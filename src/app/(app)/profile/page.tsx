import { PageHeader } from "@/components/page-header";
import { InstallPrompt } from "@/components/pwa";
import { ApiStatus } from "@/components/api-status";

export const metadata = { title: "Profil" };

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader subtitle="Cont și setări." />

      <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
        {["Cont", "Notificări", "Preferințe", "Despre"].map((item) => (
          <li
            key={item}
            className="flex items-center justify-between px-4 py-3 text-sm"
          >
            <span>{item}</span>
            <span className="text-white/30">›</span>
          </li>
        ))}
      </ul>

      <InstallPrompt />

      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Stare server</span>
        <ApiStatus />
      </div>
    </div>
  );
}
