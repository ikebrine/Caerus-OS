import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tenantId = "caerus-demo";

const defaultRecords = [
  { tenantId, module: "people", title: "Amina Cole · Senior Analyst", status: "Active", owner: "People Ops" },
  { tenantId, module: "finance", title: "Vendor renewal payment", status: "Manager Approval", owner: "Finance", amount: "$48,200" },
  { tenantId, module: "chat", title: "#finance-approvals", status: "12 unread", owner: "Avery Stone" },
  { tenantId, module: "sign", title: "Supplier master agreement", status: "Awaiting Signature", owner: "Legal" },
  { tenantId, module: "workflow", title: "CFO approval above $50,000", status: "Published", owner: "Automation" },
];

const nextStatus = (status: string) => {
  const flow = ["Draft", "Requested", "Manager Approval", "Finance Approval", "Executive Approval", "Approved", "Completed"];
  const index = flow.indexOf(status);
  return index === -1 ? "Completed" : flow[Math.min(index + 1, flow.length - 1)];
};

async function ensureDefaults() {
  const count = await prisma.activityRecord.count({ where: { tenantId, deletedAt: null } });
  if (count === 0) {
    await prisma.activityRecord.createMany({ data: defaultRecords });
  }
}

export async function GET() {
  await ensureDefaults();
  const records = await prisma.activityRecord.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ records });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<{
    module: string;
    title: string;
    status: string;
    owner: string;
    amount: string;
  }>;

  if (!body.module || !body.title || !body.status || !body.owner) {
    return NextResponse.json({ error: "module, title, status, and owner are required" }, { status: 400 });
  }

  const record = await prisma.activityRecord.create({
    data: {
      tenantId,
      module: body.module,
      title: body.title,
      status: body.status,
      owner: body.owner,
      amount: body.amount,
      createdBy: "vercel-demo",
    },
  });

  return NextResponse.json({ record }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Partial<{ id: string }>;
  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const existing = await prisma.activityRecord.findFirst({
    where: { id: body.id, tenantId, deletedAt: null },
  });
  if (!existing) {
    return NextResponse.json({ error: "record not found" }, { status: 404 });
  }

  const record = await prisma.activityRecord.update({
    where: { id: existing.id },
    data: { status: nextStatus(existing.status) },
  });

  return NextResponse.json({ record });
}
