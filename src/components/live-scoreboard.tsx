"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getLive, type LiveMatch } from "@/lib/api";

function abbr(name: string): string {
  return name.replace(/[^a-zA-Z ]/g, "").trim().slice(0, 3).toUpperCase() || "—";
}

function minuteLabel(m: LiveMatch): string {
  if (m.status === "HT") return "HT";
  if (m.status === "P" || m.status === "BT") return m.status;
  return `${m.elapsed}'`;
}

function Side({ name, logo, goals }: { name: string; logo?: string; goals: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-1.5">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={name} width={16} height={16} referrerPolicy="no-referrer" className="h-4 w-4 shrink-0 object-contain" />
        ) : (
          <span className="text-[10px] font-bold text-white/40">{abbr(name)}</span>
        )}
        <span className="truncate text-[13px]">{name}</span>
      </span>
      <span className="font-display text-base font-extrabold tabular-nums">{goals}</span>
    </div>
  );
}

function LiveChip({ m }: { m: LiveMatch }) {
  return (
    <div className="min-w-[170px] shrink-0 rounded-xl border border-red-500/25 bg-white/[0.02] p-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
        <span className="text-[10px] font-bold uppercase tracking-wide text-red-400">
          {minuteLabel(m)}
        </span>
      </div>
      <div className="space-y-1">
        <Side name={m.home} logo={m.homeLogo} goals={m.homeGoals} />
        <Side name={m.away} logo={m.awayLogo} goals={m.awayGoals} />
      </div>
    </div>
  );
}

/** Auto-refreshing strip of in-play matches. Renders nothing when none are live. */
export function LiveScoreboard() {
  const t = useTranslations("live");
  const [matches, setMatches] = useState<LiveMatch[]>([]);

  useEffect(() => {
    let active = true;
    const load = () =>
      getLive()
        .then((r) => active && setMatches(r.matches))
        .catch(() => {});
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (matches.length === 0) return null;

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
          {t("title")}
        </h2>
      </div>
      <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
        {matches.map((m) => (
          <LiveChip key={m.fixtureId} m={m} />
        ))}
      </div>
    </section>
  );
}
