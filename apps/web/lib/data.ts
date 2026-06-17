import {
  BadgeDollarSign,
  Bot,
  Boxes,
  Building2,
  Car,
  ClipboardList,
  FileStack,
  FolderKanban,
  Gauge,
  HandCoins,
  HeartPulse,
  MessageSquareText,
  Megaphone,
  Network,
  PenLine,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";

export const navigation = [
  { id: "command-center", label: "Command", icon: Gauge },
  { id: "people", label: "People", icon: Users },
  { id: "payroll", label: "Payroll", icon: BadgeDollarSign },
  { id: "finance", label: "Finance", icon: HandCoins },
  { id: "inventory", label: "CAERUSTOCK", icon: Boxes },
  { id: "fleet", label: "Fleet", icon: Car },
  { id: "documents", label: "Documents", icon: FileStack },
  { id: "chat", label: "Chat", icon: MessageSquareText },
  { id: "sign", label: "CaeruSign", icon: PenLine },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "crm", label: "CRM", icon: Building2 },
  { id: "procurement", label: "Procure", icon: ClipboardList },
  { id: "ai", label: "AI", icon: Bot },
  { id: "workflow", label: "Workflow", icon: Workflow },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export const commandMetrics = [
  { label: "Company health", value: "91", unit: "/100", delta: "+4", tone: "success" },
  { label: "Revenue", value: "$9.84M", unit: "", delta: "+12.8%", tone: "success" },
  { label: "Expenses", value: "$6.31M", unit: "", delta: "+3.1%", tone: "warning" },
  { label: "Open approvals", value: "128", unit: "", delta: "-18", tone: "success" },
  { label: "Risk signals", value: "14", unit: "", delta: "+2", tone: "danger" },
];

export const trendData = [
  { month: "Jan", revenue: 820, expenses: 590, forecast: 770 },
  { month: "Feb", revenue: 870, expenses: 610, forecast: 815 },
  { month: "Mar", revenue: 910, expenses: 640, forecast: 850 },
  { month: "Apr", revenue: 980, expenses: 655, forecast: 905 },
  { month: "May", revenue: 1040, expenses: 690, forecast: 960 },
  { month: "Jun", revenue: 1110, expenses: 712, forecast: 1015 },
];

export const moduleProfiles = {
  people: {
    title: "CAERUS People",
    icon: Users,
    rows: ["Employee profile", "Org chart", "Leave policy", "Performance cycle", "Recruitment"],
    signal: "10,248 employees, 42 departments, 17 active requisitions",
  },
  payroll: {
    title: "CAERUS Payroll",
    icon: BadgeDollarSign,
    rows: ["Salary structures", "Draft payroll", "Approval queue", "Payslips", "Payroll locking"],
    signal: "June payroll in Review, 9 exceptions, lock scheduled Friday",
  },
  finance: {
    title: "CAERUS Finance",
    icon: HandCoins,
    rows: ["Payment request", "Budget center", "Expense claim", "Approval trail", "Digital signature"],
    signal: "$2.4M in approvals, CFO threshold active above $50,000",
  },
  inventory: {
    title: "CAERUSTOCK",
    icon: Boxes,
    rows: ["Item master", "Warehouses", "Movement history", "Reorder points", "Asset depreciation"],
    signal: "22 low-stock predictions, 6 reorder workflows ready",
  },
  fleet: {
    title: "CAERUS Fleet",
    icon: Car,
    rows: ["Vehicle registry", "Driver documents", "Fuel tracking", "Service schedule", "Downtime"],
    signal: "11 vehicles due for service, fuel efficiency up 4.2%",
  },
  documents: {
    title: "Document OS",
    icon: FileStack,
    rows: ["Folders", "Permissions", "Versions", "Approvals", "AI extraction"],
    signal: "418 documents indexed, 36 pending approvals",
  },
  chat: {
    title: "CaerusChat",
    icon: MessageSquareText,
    rows: ["Channels", "Direct messages", "Mentions", "Attachments", "Retention policies"],
    signal: "128 active channels, realtime mentions and module-linked conversations",
  },
  sign: {
    title: "CaeruSign",
    icon: PenLine,
    rows: ["Signature envelopes", "Recipients", "Signing order", "Identity evidence", "Audit trail"],
    signal: "54 envelopes in flight, 12 completed today, full signature audit enabled",
  },
  projects: {
    title: "Project Management",
    icon: FolderKanban,
    rows: ["Kanban", "Timeline", "Calendar", "Table", "Teams"],
    signal: "64 active projects, 12 deadlines this week",
  },
  crm: {
    title: "CRM",
    icon: Building2,
    rows: ["Customers", "Contacts", "Deals", "Pipeline", "Communication history"],
    signal: "$14.2M pipeline, 27 high-intent accounts",
  },
  procurement: {
    title: "Procurement",
    icon: ClipboardList,
    rows: ["Purchase request", "RFQ", "Suppliers", "Purchase orders", "Goods received"],
    signal: "39 purchase requests, 8 RFQs awaiting suppliers",
  },
  ai: {
    title: "CAERUS AI",
    icon: Bot,
    rows: ["Business Q&A", "AI reports", "Forecasting", "Risk detection", "Agent actions"],
    signal: "Finance, HR, Inventory, Fleet, and CEO agents online",
  },
  workflow: {
    title: "Workflow Automation",
    icon: Workflow,
    rows: ["When", "If", "Then", "Approval limits", "Published versions"],
    signal: "18 live automations, 3 drafts awaiting approval",
  },
  security: {
    title: "Security Standard",
    icon: ShieldCheck,
    rows: ["JWT sessions", "MFA", "Device trust", "Audit log", "Security notifications"],
    signal: "99.97% policy coverage, 2 temporary grants expire today",
  },
};

export const approvalFlow = [
  "Request Created",
  "Manager Approval",
  "Finance Approval",
  "Executive Approval",
  "Payment Complete",
];

export const liveEvents = [
  { event: "PAYMENT_APPROVED", detail: "Vendor renewal cleared Finance", icon: HandCoins },
  { event: "LEAVE_REQUESTED", detail: "Regional manager requested 3 days", icon: Users },
  { event: "PAYROLL_COMPLETED", detail: "June salaried payroll locked", icon: BadgeDollarSign },
  { event: "LOW_STOCK", detail: "Component AX-91 will breach reorder point", icon: Boxes },
  { event: "VEHICLE_SERVICE_DUE", detail: "Fleet unit F-204 due in 9 days", icon: Car },
  { event: "CHAT_MENTIONED", detail: "Finance mentioned you in budget approvals", icon: MessageSquareText },
  { event: "SIGNATURE_REQUESTED", detail: "Supplier contract requires signature", icon: PenLine },
  { event: "AI_RISK_DETECTED", detail: "Expense variance requires review", icon: HeartPulse },
  { event: "WORKFLOW_PUBLISHED", detail: "CFO approval rule over $50,000", icon: Network },
  { event: "SECURITY_NOTICE", detail: "New device trust challenge issued", icon: Megaphone },
];
