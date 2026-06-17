import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../prisma.service";

type LoginInput = {
  tenantSlug: string;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  async login(input: LoginInput, userAgent?: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: input.tenantSlug } });
    if (!tenant) throw new UnauthorizedException("Invalid credentials");

    const user = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId: tenant.id, email: input.email.toLowerCase() } },
      include: { userRoles: { include: { role: { include: { policies: true, inherits: { include: { policies: true } } } } } } },
    });
    if (!user || user.status !== "ACTIVE") throw new UnauthorizedException("Invalid credentials");

    const verified = await argon2.verify(user.passwordHash, input.password);
    if (!verified) throw new UnauthorizedException("Invalid credentials");

    const permissions = new Set<string>();
    for (const userRole of user.userRoles) {
      for (const policy of userRole.role.policies) policy.permissions.forEach((permission) => permissions.add(permission));
      for (const policy of userRole.role.inherits?.policies ?? []) policy.permissions.forEach((permission) => permissions.add(permission));
    }

    const payload = {
      sub: user.id,
      tenantId: tenant.id,
      email: user.email,
      displayName: user.displayName,
      permissions: [...permissions],
    };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.config.get<string>("JWT_ACCESS_TTL") ?? "15m",
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.config.get<string>("JWT_REFRESH_TTL") ?? "30d",
    });

    await this.prisma.session.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        refreshHash: await argon2.hash(refreshToken),
        userAgent,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: user.id,
      },
    });
    await this.audit.record({ tenantId: tenant.id, actorId: user.id, action: "LOGIN", module: "auth", afterState: { userAgent } });

    return { accessToken, refreshToken, mfaRequired: user.mfaEnabled };
  }

  async requestPasswordReset(input: { tenantSlug: string; email: string }) {
    const tenant = await this.prisma.tenant.findUnique({ where: { slug: input.tenantSlug } });
    if (!tenant) return { accepted: true };
    const user = await this.prisma.user.findUnique({ where: { tenantId_email: { tenantId: tenant.id, email: input.email.toLowerCase() } } });
    if (user) {
      await this.audit.record({ tenantId: tenant.id, actorId: user.id, action: "PASSWORD_RESET_REQUESTED", module: "auth" });
    }
    return { accepted: true };
  }
}
