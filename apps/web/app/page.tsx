import { CommandCenter } from "@/components/dashboard";
import { AppShell } from "@/components/shell";
import { navigation } from "@/lib/data";

export default async function Home({ searchParams }: { searchParams?: Promise<{ module?: string }> }) {
  const params = await searchParams;
  const requestedModule = params?.module ?? "command-center";
  const initialModule = navigation.some((item) => item.id === requestedModule) ? requestedModule : "command-center";

  return (
    <AppShell initialModule={initialModule}>
      <CommandCenter initialModule={initialModule} />
    </AppShell>
  );
}
