"use client";

import { motion } from "framer-motion";
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
  Command,
  Moon,
  Search,
  Shield,
  Sparkles,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { navigation } from "@/lib/data";
import { useWorkspaceStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function AppShell({ children, initialModule }: { children: React.ReactNode; initialModule: string }) {
  const { activeModule, setModule, sidebarCollapsed, toggleSidebar } = useWorkspaceStore();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setModule(initialModule);
  }, [initialModule, setModule]);

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 border-r border-border bg-surface transition-all duration-300",
          sidebarCollapsed ? "w-[76px]" : "w-[248px]",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link className="flex min-w-0 items-center gap-3" href="/" onClick={() => setModule("command-center")}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-foreground text-sm font-bold text-background">
              C
            </span>
            {!sidebarCollapsed && (
              <span className="truncate text-left">
                <span className="block text-sm font-semibold">CAERUS OS</span>
                <span className="block text-xs text-muted">Enterprise Command</span>
              </span>
            )}
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.id;
            return (
              <Link
                key={item.id}
                title={item.label}
                href={item.id === "command-center" ? "/" : `/?module=${item.id}`}
                onClick={() => setModule(item.id)}
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition",
                  active ? "bg-foreground text-background" : "text-muted hover:bg-background hover:text-foreground",
                  sidebarCollapsed && "justify-center px-0",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button variant="ghost" size={sidebarCollapsed ? "icon" : "md"} className="w-full" onClick={toggleSidebar} title="Toggle sidebar">
            {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            {!sidebarCollapsed && <span>Collapse</span>}
          </Button>
        </div>
      </aside>

      <main className={cn("min-h-screen transition-all duration-300", sidebarCollapsed ? "pl-[76px]" : "pl-[248px]")}>
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-6 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-10 flex-1 items-center gap-3 rounded-md border border-border bg-surface px-3">
              <Search className="h-4 w-4 text-muted" />
              <input
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
                placeholder="Search employees, payments, assets, documents, approvals"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-muted">⌘K</kbd>
            </div>
            <motion.div whileTap={{ scale: 0.98 }} className="hidden min-w-[360px] items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 lg:flex">
              <Sparkles className="h-4 w-4 text-accent" />
              <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" defaultValue="Why did expenses increase this month?" />
              <Command className="h-4 w-4 text-muted" />
            </motion.div>
            <Button variant="ghost" size="icon" title="Security center">
              <Shield className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Notifications">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Toggle theme" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
