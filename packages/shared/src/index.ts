export const enterpriseModules = [
  "command-center",
  "people",
  "payroll",
  "finance",
  "inventory",
  "fleet",
  "documents",
  "chat",
  "sign",
  "projects",
  "crm",
  "procurement",
  "ai",
  "workflow",
  "notifications",
] as const;

export type EnterpriseModule = (typeof enterpriseModules)[number];

export const permissions = {
  people: ["VIEW_EMPLOYEE", "CREATE_EMPLOYEE", "UPDATE_EMPLOYEE", "APPROVE_LEAVE"],
  payroll: ["VIEW_PAYROLL", "RUN_PAYROLL", "APPROVE_PAYROLL", "LOCK_PAYROLL"],
  finance: ["CREATE_PAYMENT", "APPROVE_PAYMENT", "VIEW_REPORTS", "MANAGE_BUDGET"],
  inventory: ["VIEW_STOCK", "MOVE_STOCK", "APPROVE_REORDER", "MANAGE_ASSETS"],
  fleet: ["VIEW_FLEET", "LOG_FUEL", "SCHEDULE_SERVICE", "APPROVE_REPAIR"],
  documents: ["VIEW_DOCUMENT", "APPROVE_DOCUMENT", "MANAGE_VERSION", "AI_EXTRACT"],
  chat: ["VIEW_CHANNEL", "SEND_MESSAGE", "MANAGE_CHANNEL", "MODERATE_MESSAGE"],
  sign: ["CREATE_ENVELOPE", "SIGN_DOCUMENT", "MANAGE_SIGNATURES", "VIEW_SIGNATURE_AUDIT"],
  workflow: ["CREATE_WORKFLOW", "PUBLISH_WORKFLOW", "EXECUTE_WORKFLOW"],
  ai: ["ASK_BUSINESS_AI", "RUN_AI_REPORT", "CREATE_AI_AGENT_ACTION"],
  security: ["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_TENANT", "VIEW_AUDIT_LOG"],
} as const;

export type PermissionNamespace = keyof typeof permissions;

export type PermissionCode = {
  [K in PermissionNamespace]: (typeof permissions)[K][number];
}[PermissionNamespace];

export const workflowEvents = [
  "PAYMENT_APPROVED",
  "LEAVE_REQUESTED",
  "PAYROLL_COMPLETED",
  "LOW_STOCK",
  "VEHICLE_SERVICE_DUE",
  "DOCUMENT_APPROVAL_REQUESTED",
  "CHAT_MENTIONED",
  "SIGNATURE_REQUESTED",
  "DOCUMENT_SIGNED",
  "AI_RISK_DETECTED",
] as const;

export type WorkflowEventCode = (typeof workflowEvents)[number];
