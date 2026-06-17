import Link from "next/link";
import { NavIcon, type IconName } from "@/components/nav-config";

const QUICK_LINKS: { href: string; title: string; desc: string; icon: IconName }[] =
  [
    { href: "/matches", title: "Meciuri", desc: "Rezultate și program", icon: "ball" },
    { href: "/news", title: "Știri", desc: "Noutăți WC 2026", icon: "news" },
    { href: "/bets", title: "Ponturi", desc: "Predicții și valoare", icon: "spark" },
  ];

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      {/* Featured: pontul zilei */}
      <section className="relative overflow-hidden rounded-2xl border border-[#37F06C]/25 bg-gradient-to-br from-[#37F06C]/20 via-white/[0.02] to-transparent p-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#37F06C]">
          Pontul zilei
        </span>
        <h1 className="mt-2 max-w-md font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight">
          Ponturi pentru Cupa Mondială 2026
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/60">
          Analize, predicții și valoare — actualizate zilnic.
        </p>
        <Link
          href="/bets"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#37F06C] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#5af588]"
        >
          Vezi ponturile →
        </Link>
      </section>

      {/* Quick links */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:-translate-y-0.5 hover:border-[#37F06C]/50 hover:bg-white/[0.04]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#37F06C]/15 text-[#37F06C]">
              <NavIcon name={link.icon} size={20} />
            </span>
            <div>
              <p className="font-display font-bold uppercase tracking-tight">
                {link.title}
              </p>
              <p className="mt-0.5 text-xs text-white/50">{link.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
