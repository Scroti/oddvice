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

      {/* Responsible gambling */}
      <div className="rounded-xl border border-[#C8F04A]/25 bg-[#C8F04A]/5 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-[#C8F04A] px-1.5 py-0.5 text-[11px] font-extrabold text-[#020B0A]">
            18+
          </span>
          <span className="text-sm font-semibold">Joc responsabil</span>
        </div>
        <p className="text-xs leading-relaxed text-white/55">
          Oddvice oferă doar informații și analize — nu acceptă pariuri și nu
          garantează câștiguri. Pariază doar ce îți permiți să pierzi.
        </p>
        <a
          href="https://www.jocresponsabil.ro"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-[#C8F04A]"
        >
          Ai nevoie de ajutor? jocresponsabil.ro ↗
        </a>
      </div>

      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Stare server</span>
        <ApiStatus />
      </div>
    </div>
  );
}
