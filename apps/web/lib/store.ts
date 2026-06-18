"use client";

import { create } from "zustand";

type ViewMode = "table" | "card" | "analytics";

export type DemoRecord = {
  id: string;
  module: string;
  title: string;
  status: string;
  owner: string;
  amount?: string;
  createdAt: string;
};

type WorkspaceState = {
  activeModule: string;
  viewMode: ViewMode;
  sidebarCollapsed: boolean;
  records: DemoRecord[];
  recordsLoading: boolean;
  backendMessage: string;
  setModule: (module: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  fetchRecords: () => Promise<void>;
  addRecord: (record: Omit<DemoRecord, "id" | "createdAt">) => Promise<void>;
  advanceRecord: (id: string) => Promise<void>;
};

const seededRecords: DemoRecord[] = [
  { id: "rec-1", module: "people", title: "Amina Cole · Senior Analyst", status: "Active", owner: "People Ops", createdAt: "Today" },
  { id: "rec-2", module: "finance", title: "Vendor renewal payment", status: "Manager Approval", owner: "Finance", amount: "$48,200", createdAt: "Today" },
  { id: "rec-3", module: "chat", title: "#finance-approvals", status: "12 unread", owner: "Avery Stone", createdAt: "Today" },
  { id: "rec-4", module: "sign", title: "Supplier master agreement", status: "Awaiting Signature", owner: "Legal", createdAt: "Today" },
  { id: "rec-5", module: "workflow", title: "CFO approval above $50,000", status: "Published", owner: "Automation", createdAt: "Today" },
];

const formatRecord = (record: DemoRecord & { createdAt: string | Date }) => {
  const createdAt = new Date(record.createdAt);
  return {
    ...record,
    createdAt: Number.isNaN(createdAt.getTime()) ? "Just now" : createdAt.toLocaleDateString(),
  };
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeModule: "command-center",
  viewMode: "analytics",
  sidebarCollapsed: false,
  records: seededRecords,
  recordsLoading: false,
  backendMessage: "Demo data loaded",
  setModule: (activeModule) => set({ activeModule }),
  setViewMode: (viewMode) => set({ viewMode }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  fetchRecords: async () => {
    set({ recordsLoading: true, backendMessage: "Connecting to Supabase" });
    try {
      const response = await fetch("/api/records", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load records");
      const data = (await response.json()) as { records: DemoRecord[] };
      set({
        records: data.records.map(formatRecord),
        recordsLoading: false,
        backendMessage: "Live Supabase backend connected",
      });
    } catch {
      set({
        recordsLoading: false,
        backendMessage: "Using local fallback until DATABASE_URL and tables are ready",
      });
    }
  },
  addRecord: async (record) => {
    const optimisticRecord = { ...record, id: `rec-${Date.now()}`, createdAt: "Saving" };
    set((state) => ({
      records: [optimisticRecord, ...state.records],
      backendMessage: "Saving to Supabase",
    }));

    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!response.ok) throw new Error("Unable to save record");
      const data = (await response.json()) as { record: DemoRecord };
      set((state) => ({
        records: [formatRecord(data.record), ...state.records.filter((item) => item.id !== optimisticRecord.id)],
        backendMessage: "Saved to Supabase",
      }));
    } catch {
      set({ backendMessage: "Saved locally only. Check DATABASE_URL and database tables." });
    }
  },
  advanceRecord: async (id) => {
    set({ backendMessage: "Updating status" });
    try {
      const response = await fetch("/api/records", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Unable to update record");
      const data = (await response.json()) as { record: DemoRecord };
      set((state) => ({
        records: state.records.map((record) => (record.id === id ? formatRecord(data.record) : record)),
        backendMessage: "Updated in Supabase",
      }));
    } catch {
      set({ backendMessage: "Update failed. Check DATABASE_URL and database tables." });
    }
  },
}));
