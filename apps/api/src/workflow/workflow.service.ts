import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../prisma.service";

@Injectable()
export class WorkflowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    @InjectQueue("workflow-events") private readonly queue: Queue,
  ) {}

  async create(tenantId: string, actorId: string, input: { name: string; trigger: string; conditions: unknown[]; actions: unknown[]; enabled: boolean }) {
    const workflow = await this.prisma.workflowDefinition.create({
      data: {
        tenantId,
        name: input.name,
        trigger: input.trigger,
        conditions: input.conditions as object[],
        actions: input.actions as object[],
        enabled: input.enabled,
        createdBy: actorId,
      },
    });
    if (process.env.REDIS_URL) {
      await this.queue.add("workflow-definition-created", { tenantId, workflowId: workflow.id });
    }
    await this.audit.record({ tenantId, actorId, module: "workflow", action: "WORKFLOW_CREATED", entityId: workflow.id, afterState: workflow });
    return workflow;
  }
}
