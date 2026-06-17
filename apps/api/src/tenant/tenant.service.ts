import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class TenantService {
  constructor(private readonly prisma: PrismaService) {}

  async profile(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        legalName: true,
        slug: true,
        branding: true,
        settings: true,
        modules: true,
        billingPlan: true,
        storageTier: true,
      },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");
    return tenant;
  }
}
