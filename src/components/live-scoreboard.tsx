"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getLive, type LiveMatch } from "@/lib/api";
import { Commentary } from "@/components/commentary";
import { GoalNotifyButton } from "@/components/goal-notify-button";
import { LoginGate } from "@/components/login-gate";

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

function Crest({ name, logo, size = 28 }: { name: string; logo?: string; size?: number }) {
  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={name}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-md bg-white/10 text-[10px] font-bold text-white/60"
      style={{ width: size, height: size }}
    >
      {abbr(name)}
    </span>
  );
}

/** A full-width live match card: scoreboard + win-prob bar; tap to expand the
 * live commentary timeline inline. */
function LiveCard({
  m,
  expanded,
  onToggle,
}: {
  m: LiveMatch;
  expanded: boolean;
  onToggle: () => void;
}) {
  const t = useTranslations("live");
  const p = winProb(m.homeGoals, m.awayGoals, m.elapsed);

  return (
    <div
      className={`rounded-2xl border bg-white/[0.02] p-4 transition ${
        expanded ? "border-[#C8F04A]/40" : "border-white/10"
      }`}
    >
      <button type="button" onClick={onToggle} className="w-full text-left">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            <span className="text-[11px] font-bold uppercase tracking-wide text-red-400">
              {minuteLabel(m)}
            </span>
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-white/40 transition-transform ${expanded ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
            <span className="truncate text-sm font-medium">{m.home}</span>
            <Crest name={m.home} logo={m.homeLogo} />
          </div>
          <div className="flex items-center gap-2 font-display text-2xl font-extrabold tabular-nums">
            <span>{m.homeGoals}</span>
            <span className="text-white/30">–</span>
            <span>{m.awayGoals}</span>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Crest name={m.away} logo={m.awayLogo} />
            <span className="truncate text-sm font-medium">{m.away}</span>
          </div>
        </div>
      </button>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="font-semibold tabular-nums text-[#C8F04A]">{p.home}%</span>
          <span className="text-white/45">{t("winProb")}</span>
          <span className="font-semibold tabular-nums text-sky-300">{p.away}%</span>
        </div>
        <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
          <div className="bg-[#C8F04A]" style={{ width: `${p.home}%` }} />
          <div className="bg-white/25" style={{ width: `${p.draw}%` }} />
          <div className="flex-1 bg-sky-400/70" />
        </div>
      </div>

      {expanded && (
        <div className="mt-4">
          <LoginGate message="Sign in to see live commentary">
            <Commentary fixtureId={m.fixtureId} embedded />
          </LoginGate>
        </div>
      )}
    </div>
  );
}

/** Auto-refreshing live hub on the feed: a vertical stack of full-width live
 * match cards (one per in-play match), each expandable to its live commentary.
 * Renders nothing when none are live. */
export function LiveScoreboard() {
  const t = useTranslations("live");
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

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

  // Default to expanding the first live match; keep selection while it stays live.
  useEffect(() => {
    if (matches.length === 0) {
      setExpanded(null);
      return;
    }
    setExpanded((prev) =>
      prev && matches.some((m) => m.fixtureId === prev) ? prev : matches[0].fixtureId,
    );
  }, [matches]);

  if (matches.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">
            {t("title")}
          </h2>
        </div>
        <GoalNotifyButton />
      </div>
      <div className="space-y-3">
        {matches.map((m) => (
          <LiveCard
            key={m.fixtureId}
            m={m}
            expanded={m.fixtureId === expanded}
            onToggle={() =>
              setExpanded((e) => (e === m.fixtureId ? null : m.fixtureId))
            }
          />
        ))}
      </div>
    </section>
  );
}
