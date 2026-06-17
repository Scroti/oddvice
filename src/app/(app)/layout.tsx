import { BottomNav } from "@/components/bottom-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#020B0A] text-white">
      <main className="mx-auto w-full max-w-md flex-1 px-5 pt-8 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
