import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Sidebar } from "@/components/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#020B0A] text-white">
      <Header />

      {/* Desktop: left sidebar. Mobile: bottom bar. */}
      <Sidebar />

      <div className="lg:pl-64">
        <main className="mx-auto w-full max-w-md px-5 pt-6 pb-28 lg:max-w-5xl lg:px-10 lg:pt-10 lg:pb-12">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
