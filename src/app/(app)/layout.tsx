import { cookies } from "next/headers";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Sidebar } from "@/components/sidebar";
import { ResponsibleFooter } from "@/components/responsible-footer";
import { Onboarding } from "@/components/onboarding";
import { NotificationWatcher } from "@/components/notification-watcher";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Decide server-side so the overlay is in the initial HTML (no feed flash).
  const onboarded =
    (await cookies()).get("oddvice_onboarded")?.value === "1";
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#020B0A] text-white">
      <Header />

      {/* Desktop: left sidebar. Mobile: bottom bar. */}
      <Sidebar />

      <div className="pt-14 lg:pl-64">
        <main className="mx-auto w-full max-w-md px-5 pt-6 pb-28 lg:max-w-5xl lg:px-10 lg:pt-10 lg:pb-12">
          {children}
          <ResponsibleFooter />
        </main>
      </div>

      <BottomNav />
      <NotificationWatcher />
      {!onboarded && <Onboarding />}
    </div>
  );
}
