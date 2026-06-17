import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "caerus-demo" },
    update: {},
    create: {
      name: "Caerus Demo Group",
      legalName: "Caerus Demo Group Ltd",
      slug: "caerus-demo",
      modules: ["people", "payroll", "finance", "inventory", "fleet", "documents", "chat", "sign", "projects", "crm", "procurement", "ai", "workflow"],
      branding: { primary: "#147C88", accent: "#D94862" },
    },
  });

  const executive = await prisma.role.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: "Executive Operator" } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Executive Operator",
      maxApprovalAmount: 250000,
      policies: {
        create: {
          tenantId: tenant.id,
          name: "Executive platform access",
          permissions: [
            "VIEW_EMPLOYEE",
            "VIEW_PAYROLL",
            "VIEW_REPORTS",
            "CREATE_PAYMENT",
            "APPROVE_PAYMENT",
            "VIEW_STOCK",
            "VIEW_FLEET",
            "VIEW_DOCUMENT",
            "VIEW_CHANNEL",
            "SEND_MESSAGE",
            "CREATE_ENVELOPE",
            "SIGN_DOCUMENT",
            "VIEW_SIGNATURE_AUDIT",
            "ASK_BUSINESS_AI",
            "RUN_AI_REPORT",
            "CREATE_WORKFLOW",
            "VIEW_AUDIT_LOG",
          ],
        },
      },
    },
  });

  const user = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: "admin@caerus.local" } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "admin@caerus.local",
      passwordHash: await argon2.hash("CaerusDemo!2026"),
      displayName: "Avery Stone",
      status: "ACTIVE",
      createdBy: "seed",
    },
  });

  await prisma.userRole.upsert({
    where: { tenantId_userId_roleId: { tenantId: tenant.id, userId: user.id, roleId: executive.id } },
    update: {},
    create: { tenantId: tenant.id, userId: user.id, roleId: executive.id, createdBy: "seed" },
  });

  await prisma.department.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: "Operations" } },
    update: {},
    create: { tenantId: tenant.id, name: "Operations", costCenter: "OPS-100", createdBy: user.id },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
