import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

type AuditInput = {
  tenantId: string;
  actorId?: string;
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  beforeState?: unknown;
  afterState?: unknown;
  ipAddress?: string;
  device?: string;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(input: AuditInput) {
    return this.prisma.auditLog.create({
      data: {
        tenantId: input.tenantId,
        actorId: input.actorId,
        action: input.action,
        module: input.module,
        entityType: input.entityType,
        entityId: input.entityId,
        beforeState: input.beforeState as object,
        afterState: input.afterState as object,
        ipAddress: input.ipAddress,
        device: input.device,
        createdBy: input.actorId,
      },
    });
  }
}
