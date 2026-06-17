import Link from "next/link";
import { getUpcoming, getResults, type Match } from "@/lib/api";
import { MatchCard } from "@/components/match-card";

export const dynamic = "force-dynamic";

const SPORTS = [
  { key: "football", label: "Fotbal", active: true },
  { key: "basketball", label: "Baschet", active: false },
  { key: "tennis", label: "Tenis", active: false },
] as const;

function SportIcon({ sport }: { sport: string }) {
  const p = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  };
  if (sport === "basketball")
    return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3v18M5.6 5.6c3 3 9.8 9.8 12.8 12.8M18.4 5.6c-3 3-9.8 9.8-12.8 12.8" />
      </svg>
    );
  if (sport === "tennis")
    return (
      <svg {...p}>
        <circle cx="12" cy="12" r="9" />
        <path d="M5 5c4 3 4 11 0 14M19 5c-4 3-4 11 0 14" />
      </svg>
    );
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7 4 3-1.5 5h-5L8 10z" />
    </svg>
  );
}

async function safe(fn: () => Promise<{ matches: Match[] }>): Promise<Match[]> {
  try {
    return (await fn()).matches;
  } catch {
    return [];
  }
}

export default async function Home() {
  const [upcoming, results] = await Promise.all([
    safe(getUpcoming),
    safe(getResults),
  ]);

  return (
    <div className="flex flex-col gap-8">
      {/* Sport categories */}
      <section className="grid grid-cols-3 gap-3">
        {SPORTS.map((s) => (
          <div
            key={s.key}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-4 ${
              s.active
                ? "border-[#C8F04A]/40 bg-[#C8F04A]/10 text-[#C8F04A]"
                : "border-white/10 bg-white/[0.02] text-white/40"
            }`}
          >
            <SportIcon sport={s.key} />
            <span className="text-sm font-semibold">{s.label}</span>
            {!s.active && (
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">
                Curând
              </span>
            )}
          </div>
        ))}
      </section>

      {/* Featured: pontul zilei */}
      <section className="relative overflow-hidden rounded-2xl border border-[#C8F04A]/25 bg-gradient-to-br from-[#C8F04A]/20 via-white/[0.02] to-transparent p-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C8F04A]">
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
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#C8F04A] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#D8FB6A]"
        >
          Vezi ponturile →
        </Link>
      </section>

      {upcoming.length > 0 && (
        <MatchRow title="Urmează" matches={upcoming.slice(0, 8)} />
      )}
      {results.length > 0 && (
        <MatchRow title="Rezultate" matches={results.slice(0, 8)} />
      )}
    </div>
  );
}

function MatchRow({ title, matches }: { title: string; matches: Match[] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-extrabold uppercase tracking-tight">
          {title}
        </h2>
        <Link
          href="/matches"
          className="text-xs font-semibold text-[#C8F04A]"
        >
          Vezi toate →
        </Link>
      </div>
      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
        {matches.map((m) => (
          <div key={m.id} className="w-[280px] shrink-0">
            <MatchCard match={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
