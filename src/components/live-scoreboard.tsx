"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getLive, type LiveMatch } from "@/lib/api";
import { Commentary } from "@/components/commentary";
import { GoalNotifyButton } from "@/components/goal-notify-button";

function abbr(name: string): string {
  return name.replace(/[^a-zA-Z ]/g, "").trim().slice(0, 3).toUpperCase() || "—";
}

function minuteLabel(m: LiveMatch): string {
  if (m.status === "HT") return "HT";
  if (m.status === "P" || m.status === "BT") return m.status;
  return `${m.elapsed}'`;
}

/** Rough live win-probability from score + minute (an estimate, not a model). */
function winProb(hg: number, ag: number, min: number) {
  const lead = hg - ag;
  const prog = Math.min(Math.max(min, 0), 95) / 95; // 0..1 match progress
  let home = 0.4;
  let draw = 0.27;
  let away = 0.33;
  if (lead === 0) {
    draw = 0.27 + 0.45 * prog; // a draw firms up as time runs out
    const rest = 1 - draw;
    home = rest * 0.55;
    away = rest * 0.45;
  } else {
    const w = Math.min(0.92, (0.18 + 0.72 * prog) * Math.min(Math.abs(lead), 3));
    if (lead > 0) {
      home = 0.4 + w * 0.6;
      away = 0.33 * (1 - w);
      draw = 1 - home - away;
    } else {
      away = 0.33 + w * 0.67;
      home = 0.4 * (1 - w);
      draw = 1 - home - away;
    }
  }
  const pct = (x: number) => Math.round(Math.max(0, x) * 100);
  return { home: pct(home), draw: pct(draw), away: pct(away) };
}

function WinProbBar({ m, label }: { m: LiveMatch; label: string }) {
  const p = winProb(m.homeGoals, m.awayGoals, m.elapsed);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="font-semibold tabular-nums text-[#C8F04A]">{p.home}%</span>
        <span className="text-white/45">{label}</span>
        <span className="font-semibold tabular-nums text-sky-300">{p.away}%</span>
      </div>
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
        <div className="bg-[#C8F04A]" style={{ width: `${p.home}%` }} />
        <div className="bg-white/25" style={{ width: `${p.draw}%` }} />
        <div className="flex-1 bg-sky-400/70" />
      </div>
    </div>
  );
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

function LiveChip({
  m,
  active,
  onClick,
}: {
  m: LiveMatch;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[170px] shrink-0 rounded-xl border p-3 text-left transition ${
        active
          ? "border-[#C8F04A]/50 bg-[#C8F04A]/[0.06]"
          : "border-red-500/25 bg-white/[0.02] hover:border-white/20"
      }`}
    >
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
    </button>
  );
}

/** Auto-refreshing live hub on the feed: a strip of in-play matches, and the
 * selected match's live commentary below it. Renders nothing when none live. */
export function LiveScoreboard() {
  const t = useTranslations("live");
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

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

  // Default to the first live match; keep selection while it stays live.
  useEffect(() => {
    if (matches.length === 0) {
      setSelected(null);
      return;
    }
    setSelected((prev) =>
      prev && matches.some((m) => m.fixtureId === prev) ? prev : matches[0].fixtureId,
    );
  }, [matches]);

  if (matches.length === 0) return null;

  return (
    <section>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
            {t("title")}
          </h2>
        </div>
        <GoalNotifyButton />
      </div>
      <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
        {matches.map((m) => (
          <LiveChip
            key={m.fixtureId}
            m={m}
            active={m.fixtureId === selected}
            onClick={() => setSelected(m.fixtureId)}
          />
        ))}
      </div>
      {selected && (
        <div className="mt-3 space-y-3">
          {(() => {
            const sel = matches.find((m) => m.fixtureId === selected);
            return sel ? <WinProbBar m={sel} label={t("winProb")} /> : null;
          })()}
          <Commentary fixtureId={selected} />
        </div>
      )}
    </section>
  );
}
