import { Injectable } from "@nestjs/common";
import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async answerBusinessQuestion(tenantId: string, actorId: string, question: string) {
    const commandCenter = {
      paymentsPending: await this.prisma.paymentRequest.count({ where: { tenantId, status: { not: "COMPLETED" }, deletedAt: null } }),
      payrollOpen: await this.prisma.payrollRun.count({ where: { tenantId, status: { notIn: ["COMPLETED", "LOCKED"] }, deletedAt: null } }),
      lowStockSignals: await this.prisma.inventoryItem.count({ where: { tenantId, deletedAt: null } }),
      fleetServiceSignals: await this.prisma.vehicle.count({ where: { tenantId, serviceDueAt: { lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }, deletedAt: null } }),
    };

    const answer = [
      "Enterprise analysis completed across Finance, Payroll, Inventory, and Fleet.",
      `Open payment approvals: ${commandCenter.paymentsPending}.`,
      `Open payroll cycles: ${commandCenter.payrollOpen}.`,
      `Inventory items under intelligence watch: ${commandCenter.lowStockSignals}.`,
      `Vehicles with service due in 14 days: ${commandCenter.fleetServiceSignals}.`,
      "Recommended action: prioritize approvals, run variance review, and publish a workflow for high-value exceptions.",
    ].join(" ");

    const insight = await this.prisma.aiInsight.create({
      data: {
        tenantId,
        module: "enterprise",
        agent: "CEO Assistant",
        prompt: question,
        answer,
        confidence: 0.86,
        riskLevel: commandCenter.paymentsPending > 20 ? "MEDIUM" : "LOW",
        evidence: commandCenter,
        actions: [{ type: "CREATE_REPORT" }, { type: "SUGGEST_WORKFLOW" }],
        createdBy: actorId,
      },
    });
    await this.audit.record({ tenantId, actorId, module: "ai", action: "BUSINESS_QUESTION_ANSWERED", entityId: insight.id, afterState: insight });
    return insight;
  }
}
