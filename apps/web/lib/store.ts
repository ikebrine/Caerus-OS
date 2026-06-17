"use client";

import { create } from "zustand";

type ViewMode = "table" | "card" | "analytics";

type WorkspaceState = {
  activeModule: string;
  viewMode: ViewMode;
  sidebarCollapsed: boolean;
  setModule: (module: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeModule: "command-center",
  viewMode: "analytics",
  sidebarCollapsed: false,
  setModule: (activeModule) => set({ activeModule }),
  setViewMode: (viewMode) => set({ viewMode }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
