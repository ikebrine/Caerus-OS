"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, FileSignature, Loader2, TriangleAlert } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect } from "react";
import { approvalFlow, commandMetrics, liveEvents, moduleProfiles, trendData } from "@/lib/data";
import { useWorkspaceStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const workflowRules = [
  { when: "Payment amount exceeds $50,000", if: "Cost center is Operations", then: "Require CFO approval" },
  { when: "Stock forecast drops below reorder point", if: "Supplier lead time exceeds 7 days", then: "Create purchase request" },
  { when: "Vehicle service date is within 14 days", if: "Mileage exceeds service interval", then: "Notify Fleet Manager" },
];

export function CommandCenter({ initialModule }: { initialModule: string }) {
  const { activeModule, setModule, viewMode, setViewMode, addRecord, fetchRecords, backendMessage, recordsLoading } = useWorkspaceStore();

  useEffect(() => {
    setModule(initialModule);
  }, [initialModule, setModule]);

  useEffect(() => {
    void fetchRecords();
  }, [fetchRecords]);

  const module = moduleProfiles[activeModule as keyof typeof moduleProfiles];
  const isCommandCenter = activeModule === "command-center";

  return (
    <div className="px-6 py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{isCommandCenter ? "Command Center" : module?.title ?? "Workspace"}</h1>
          <p className="mt-1 text-sm text-muted">
            {isCommandCenter ? "Company health, approvals, risks, and live operating signals." : module?.signal ?? "Focused module workspace."}
          </p>
        </div>
        <span className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted">{recordsLoading ? "Loading" : backendMessage}</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          {isCommandCenter && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {commandMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="panel p-4"
                >
                  <div className="text-xs font-medium uppercase text-muted">{metric.label}</div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-semibold">{metric.value}</span>
                    <span className="text-sm text-muted">{metric.unit}</span>
                  </div>
                  <div
                    className={cn(
                      "mt-3 text-xs font-medium",
                      metric.tone === "success" && "text-success",
                      metric.tone === "warning" && "text-warning",
                      metric.tone === "danger" && "text-danger",
                    )}
                  >
                    {metric.delta}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isCommandCenter && (
            <ModuleWorkspace module={module} activeModule={activeModule} viewMode={viewMode} setViewMode={setViewMode} />
          )}

          {isCommandCenter && (
            <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <section className="panel min-h-[330px] p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Executive Overview</h2>
                    <p className="mt-1 text-sm text-muted">Revenue, expenses, forecasts, approvals, and risk signals</p>
                  </div>
                  <Button size="sm">
                    Report <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#revenue)" strokeWidth={2} />
                      <Area type="monotone" dataKey="expenses" stroke="hsl(var(--accent))" fill="transparent" strokeWidth={2} />
                      <Area type="monotone" dataKey="forecast" stroke="hsl(var(--warning))" fill="transparent" strokeDasharray="4 4" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="panel p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Approval Trail</h2>
                  <FileSignature className="h-4 w-4 text-muted" />
                </div>
                <div className="mt-5 space-y-4">
                  {approvalFlow.map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "grid h-8 w-8 shrink-0 place-items-center rounded-md border",
                          index < 3 ? "border-success bg-success/10 text-success" : "border-border bg-background text-muted",
                        )}
                      >
                        {index < 3 ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{step}</div>
                        <div className="text-xs text-muted">{index < 3 ? "Completed with digital signature" : "Waiting for authority check"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {isCommandCenter && (
            <ModuleWorkspace module={module} activeModule={activeModule} viewMode={viewMode} setViewMode={setViewMode} />
          )}
        </section>

        <aside className="space-y-4">
          <ActionPanel activeModule={activeModule} addRecord={addRecord} />
          {isCommandCenter ? (
            <>
              <AiPanel />
              <NotificationPanel />
              <WorkflowPanel />
            </>
          ) : (
            <NotificationPanel compact />
          )}
        </aside>
      </div>
    </div>
  );
}

function ModuleWorkspace({
  module,
  activeModule,
  viewMode,
  setViewMode,
}: {
  module?: (typeof moduleProfiles)[keyof typeof moduleProfiles];
  activeModule: string;
  viewMode: "table" | "card" | "analytics";
  setViewMode: (mode: "table" | "card" | "analytics") => void;
}) {
  const { records, advanceRecord, addRecord } = useWorkspaceStore();
  const profile = module ?? {
    title: "CAERUS OS",
    icon: CheckCircle2,
    rows: ["Company health", "Metrics", "Approvals", "Risks", "Predictions"],
    signal: "Unified operating layer active",
  };
  const Icon = profile.icon;
  const visibleRecords = records.filter((record) => record.module === activeModule || activeModule === "command-center").slice(0, 6);
  const formLabels: Record<string, { title: string; owner: string; amount: string; button: string; status: string }> = {
    people: { title: "Employee name / role", owner: "Department", amount: "Salary optional", button: "Add Employee", status: "Active" },
    payroll: { title: "Payroll period", owner: "Payroll owner", amount: "Net pay optional", button: "Create Payroll", status: "Draft" },
    finance: { title: "Payment request", owner: "Vendor or requester", amount: "Amount", button: "Create Payment", status: "Requested" },
    inventory: { title: "Item / SKU", owner: "Warehouse", amount: "Quantity optional", button: "Add Stock Entry", status: "Recorded" },
    fleet: { title: "Vehicle / service", owner: "Driver or manager", amount: "Cost optional", button: "Log Fleet Entry", status: "Scheduled" },
    documents: { title: "Document title", owner: "Owner", amount: "Version optional", button: "Add Document", status: "Draft" },
    chat: { title: "Message or channel", owner: "Sender", amount: "Attachment optional", button: "Post Message", status: "Sent" },
    sign: { title: "Envelope / document", owner: "Signer", amount: "Value optional", button: "Send for Signature", status: "Awaiting Signature" },
    projects: { title: "Task or project", owner: "Assignee", amount: "Budget optional", button: "Create Task", status: "Todo" },
    crm: { title: "Customer / deal", owner: "Account owner", amount: "Deal value", button: "Create Deal", status: "Pipeline" },
    procurement: { title: "Purchase request", owner: "Supplier", amount: "Estimated cost", button: "Create Request", status: "Requested" },
    ai: { title: "Report question", owner: "Requested by", amount: "Priority optional", button: "Create AI Request", status: "Queued" },
    workflow: { title: "Automation rule", owner: "Process owner", amount: "Threshold optional", button: "Create Workflow", status: "Draft" },
    security: { title: "Permission / user", owner: "Approver", amount: "Duration optional", button: "Create Grant", status: "Pending" },
  };
  const formLabel = formLabels[activeModule] ?? {
    title: "Entry title",
    owner: "Owner",
    amount: "Amount optional",
    button: "Create Entry",
    status: "Requested",
  };

  if (activeModule === "chat") {
    return <ChatWorkspace records={visibleRecords} addRecord={addRecord} />;
  }

  return (
    <section className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold">{profile.title}</h2>
            <p className="truncate text-sm text-muted">{profile.signal}</p>
          </div>
        </div>
        <div className="flex rounded-md border border-border p-1">
          {(["table", "card", "analytics"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn("h-8 rounded px-3 text-sm capitalize", viewMode === mode ? "bg-foreground text-background" : "text-muted hover:text-foreground")}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {activeModule !== "command-center" && (
            <form
              className="grid gap-3 rounded-md border border-border bg-background p-4 md:grid-cols-[1fr_180px_150px_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const data = new FormData(form);
                const title = data.get("title")?.toString().trim();
                const owner = data.get("owner")?.toString().trim();
                const amount = data.get("amount")?.toString().trim();
                if (!title) return;
                void addRecord({
                  module: activeModule,
                  title,
                  owner: owner || "Unassigned",
                  amount: amount || undefined,
                  status: formLabel.status,
                });
                form.reset();
              }}
            >
              <input
                name="title"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={formLabel.title}
              />
              <input
                name="owner"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={formLabel.owner}
              />
              <input
                name="amount"
                className="h-10 rounded-md border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder={formLabel.amount}
              />
              <Button type="submit">{formLabel.button}</Button>
            </form>
          )}

          <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead className="bg-background text-left text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Record</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((record) => (
                <tr key={record.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">{record.title}</div>
                    <div className="text-xs text-muted">{record.amount ?? record.createdAt}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{record.status}</td>
                  <td className="px-4 py-3 text-muted">{record.owner}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="ghost" onClick={() => advanceRecord(record.id)}>
                      Advance
                    </Button>
                  </td>
                </tr>
              ))}
              {visibleRecords.length === 0 && (
                <tr className="border-t border-border">
                  <td className="px-4 py-8 text-center text-muted" colSpan={4}>
                    No entries yet. Use the form above to create the first live {profile.title} record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        <div className="rounded-md border border-border p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">Analytics View</span>
            <Loader2 className="h-4 w-4 animate-spin text-muted" />
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData.slice(0, 5)}>
                <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="forecast" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatWorkspace({
  records,
  addRecord,
}: {
  records: Array<{ id: string; title: string; owner: string; createdAt: string; status: string }>;
  addRecord: (record: { module: string; title: string; status: string; owner: string; amount?: string }) => Promise<void>;
}) {
  return (
    <section className="panel overflow-hidden">
      <div className="grid min-h-[620px] lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-border bg-background p-4 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">CaerusChat</h2>
            <span className="rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">Live</span>
          </div>
          <div className="space-y-1">
            {["#general", "#finance-approvals", "#people-ops", "#fleet-desk", "#executive"].map((channel, index) => (
              <button
                key={channel}
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm",
                  index === 1 ? "bg-foreground text-background" : "text-muted hover:bg-surface hover:text-foreground",
                )}
              >
                <span>{channel}</span>
                {index === 1 && <span className="rounded bg-background/20 px-1.5 py-0.5 text-xs">open</span>}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex min-h-[620px] flex-col">
          <header className="border-b border-border p-4">
            <div className="text-sm font-semibold">#finance-approvals</div>
            <div className="mt-1 text-xs text-muted">Payment approvals, budget notes, and signature follow-ups</div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-background p-5">
            {records.length === 0 && (
              <div className="rounded-md border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
                No messages yet. Start the conversation below.
              </div>
            )}
            {records.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                  {message.owner.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-sm font-semibold">{message.owner}</span>
                    <span className="text-xs text-muted">{message.createdAt}</span>
                  </div>
                  <div className="mt-1 rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6">
                    {message.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            className="border-t border-border bg-surface p-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const data = new FormData(form);
              const message = data.get("message")?.toString().trim();
              const sender = data.get("sender")?.toString().trim() || "Team member";
              if (!message) return;
              void addRecord({ module: "chat", title: message, owner: sender, status: "Sent" });
              form.reset();
            }}
          >
            <div className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
              <input
                name="sender"
                className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Your name"
              />
              <input
                name="message"
                className="h-11 rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="Write a message"
              />
              <Button type="submit">Send</Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ActionPanel({
  activeModule,
  addRecord,
}: {
  activeModule: string;
  addRecord: (record: { module: string; title: string; status: string; owner: string; amount?: string }) => void;
}) {
  const templates: Record<string, { title: string; label: string; placeholder: string; status: string; owner: string; amount?: string }> = {
    people: { title: "Create Employee", label: "Add employee", placeholder: "Employee name and role", status: "Active", owner: "People Ops" },
    payroll: { title: "Run Payroll", label: "Create payroll run", placeholder: "June salaried payroll", status: "Draft", owner: "Payroll" },
    finance: { title: "Payment Request", label: "Create payment", placeholder: "Vendor payment title", status: "Requested", owner: "Finance", amount: "$52,000" },
    inventory: { title: "Stock Action", label: "Create reorder", placeholder: "Item SKU and supplier", status: "Requested", owner: "Inventory" },
    fleet: { title: "Fleet Service", label: "Schedule service", placeholder: "Vehicle and service type", status: "Scheduled", owner: "Fleet" },
    documents: { title: "Document Approval", label: "Send for approval", placeholder: "Document title", status: "In Review", owner: "Documents" },
    chat: { title: "CaerusChat", label: "Send message", placeholder: "Channel or message", status: "Sent", owner: "Team Chat" },
    sign: { title: "CaeruSign", label: "Create envelope", placeholder: "Envelope title", status: "Awaiting Signature", owner: "Legal" },
    projects: { title: "Project Task", label: "Create task", placeholder: "Task title", status: "Todo", owner: "Projects" },
    crm: { title: "CRM Deal", label: "Create deal", placeholder: "Customer or deal name", status: "Pipeline", owner: "Sales" },
    procurement: { title: "Purchase Request", label: "Create request", placeholder: "Purchase item", status: "Requested", owner: "Procurement" },
    ai: { title: "AI Report", label: "Generate insight", placeholder: "Question for CEO assistant", status: "Generated", owner: "CAERUS AI" },
    workflow: { title: "Automation Rule", label: "Publish workflow", placeholder: "WHEN payment > 50000 THEN CFO approval", status: "Published", owner: "Automation" },
    security: { title: "Security Grant", label: "Create temporary grant", placeholder: "Permission and user", status: "Expires Today", owner: "Security" },
    "command-center": { title: "Command Action", label: "Create executive action", placeholder: "Action title", status: "Requested", owner: "CEO Office" },
  };
  const template = templates[activeModule] ?? templates["command-center"];

  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{template.title}</h2>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Testable</span>
      </div>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const input = new FormData(form).get("title")?.toString().trim();
          addRecord({
            module: activeModule,
            title: input || template.placeholder,
            status: template.status,
            owner: template.owner,
            amount: template.amount,
          });
          form.reset();
        }}
      >
        <input
          name="title"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder={template.placeholder}
        />
        <Button className="w-full" type="submit">
          {template.label}
        </Button>
      </form>
    </section>
  );
}

function AiPanel() {
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">CAERUS AI</h2>
        <span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent">Agents online</span>
      </div>
      <div className="mt-4 rounded-md border border-border bg-background p-4">
        <p className="text-sm font-medium">Why did expenses increase this month?</p>
        <p className="mt-3 text-sm leading-6 text-muted">
          Expense growth is concentrated in fleet repairs, procurement rush fees, and payroll overtime. Risk level is medium until CFO approval thresholds clear.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {["Finance Agent", "HR Agent", "Inventory Agent", "Fleet Agent"].map((agent) => (
          <span key={agent} className="rounded-md border border-border px-2 py-2 text-muted">
            {agent}
          </span>
        ))}
      </div>
    </section>
  );
}

function NotificationPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Notifications</h2>
        <span className="text-xs text-muted">Email · In-app · SMS · Push</span>
      </div>
      <div className="mt-4 space-y-3">
        {liveEvents.slice(0, compact ? 3 : 6).map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.event} className="flex gap-3 rounded-md border border-border p-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold">{item.event}</div>
                <div className="truncate text-sm text-muted">{item.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function WorkflowPanel() {
  return (
    <section className="panel p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Workflow Builder</h2>
        <TriangleAlert className="h-4 w-4 text-warning" />
      </div>
      <div className="mt-4 space-y-3">
        {workflowRules.map((rule) => (
          <div key={rule.when} className="rounded-md border border-border p-3">
            <div className="text-xs font-semibold text-muted">WHEN</div>
            <div className="mt-1 text-sm">{rule.when}</div>
            <div className="mt-3 text-xs font-semibold text-muted">IF</div>
            <div className="mt-1 text-sm">{rule.if}</div>
            <div className="mt-3 text-xs font-semibold text-muted">THEN</div>
            <div className="mt-1 text-sm">{rule.then}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
