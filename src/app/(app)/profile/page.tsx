import { PageHeader } from "@/components/page-header";
import { InstallPrompt } from "@/components/pwa";

export const metadata = { title: "Profil" };

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profil" subtitle="Cont și setări." />

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
    </div>
  );
}
