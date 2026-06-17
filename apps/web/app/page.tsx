import { CommandCenter } from "@/components/dashboard";
import { AppShell } from "@/components/shell";

export default function Home() {
  return (
    <AppShell>
      <CommandCenter />
    </AppShell>
  );
}
