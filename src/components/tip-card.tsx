"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { MatchTips, Tip, TipRisk } from "@/lib/api";
import { betUrl } from "@/lib/bet";
import { localizeStage } from "@/lib/stage";
import { usePremium } from "@/lib/use-premium";

const RISK_STYLES: Record<TipRisk, string> = {
  safe: "text-[#C8F04A] bg-[#C8F04A]/15",
  value: "text-sky-300 bg-sky-400/15",
  bold: "text-amber-300 bg-amber-400/15",
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** A locked premium tip: a teaser row that links to the premium page. */
function LockedRow({ risk }: { risk: TipRisk }) {
  const t = useTranslations("bets");
  return (
    <Link
      href="/premium"
      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 transition hover:border-[#C8F04A]/30"
    >
      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${RISK_STYLES[risk]}`}>
        {t(risk)}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/45">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span className="flex-1 truncate text-[13px] text-white/55">{t("lockedTitle")}</span>
      <span className="shrink-0 rounded-md bg-[#C8F04A] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#020B0A]">
        {t("unlock")}
      </span>
    </Link>
  );
}

/** An unlocked tip: a tappable summary row that expands to the reasoning. */
function TipRow({
  tip,
  home,
  away,
  defaultOpen,
}: {
  tip: Tip;
  home: string;
  away: string;
  defaultOpen: boolean;
}) {
  const t = useTranslations("bets");
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
      >
        <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${RISK_STYLES[tip.risk]}`}>
          {t(tip.risk)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">{tip.selection}</span>
          <span className="block truncate text-[10px] uppercase tracking-wide text-white/40">
            {tip.market} · {tip.confidence}%
          </span>
        </span>
        <span className="shrink-0 rounded-md bg-white/10 px-2 py-0.5 font-display text-sm font-extrabold tabular-nums">
          {tip.odds.toFixed(2)}
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className="border-t border-white/10 px-3 pb-3 pt-2.5">
          <div className="mb-2">
            <div className="mb-1 flex items-center justify-between text-[11px] text-white/45">
              <span>{t("confidence")}</span>
              <span className="font-semibold tabular-nums text-white/70">{tip.confidence}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#C8F04A]"
                style={{ width: `${Math.max(0, Math.min(100, tip.confidence))}%` }}
              />
            </div>
          </div>

          {tip.shortReason && (
            <p className="text-[13px] leading-snug text-white/65">{tip.shortReason}</p>
          )}
          {tip.analysis && (
            <p className="text-[13px] leading-snug text-white/75">{tip.analysis}</p>
          )}

          {tip.keyFactors && tip.keyFactors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {tip.keyFactors.map((f) => (
                <li key={f} className="flex gap-2 text-[12px] text-white/55">
                  <span className="text-[#C8F04A]">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 flex items-center gap-3">
            {tip.stakeUnits ? (
              <span className="text-[11px] font-semibold text-white/45">
                {t("units", { n: tip.stakeUnits })}
              </span>
            ) : null}
            {tip.tier === "free" && (
              // eslint-disable-next-line react/jsx-no-target-blank
              <a
                href={betUrl(home, away)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto rounded-lg bg-[#C8F04A] px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-wide text-[#020B0A] transition hover:bg-[#D8FB6A]"
              >
                {t("placeBet")} →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function TipCard({
  bundle,
  embedded = false,
}: {
  bundle: MatchTips;
  embedded?: boolean;
}) {
  const t = useTranslations("bets");
  const ts = useTranslations("stage");
  const { premium } = usePremium();

  const rows = (
    <div className={embedded ? "space-y-2" : "mt-3 space-y-2"}>
      {bundle.tips.map((tip, i) => {
        const unlocked = tip.tier === "free" || premium;
        return unlocked ? (
          <TipRow
            key={tip.id}
            tip={tip}
            home={bundle.homeTeam}
            away={bundle.awayTeam}
            defaultOpen={i === 0}
          />
        ) : (
          <LockedRow key={tip.id} risk={tip.risk} />
        );
      })}
    </div>
  );

  // Embedded (e.g. on the match page): no card chrome, no redundant title.
  if (embedded) return rows;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="truncate text-[11px] font-bold uppercase tracking-widest text-white/40">
          {localizeStage(bundle.league, ts)}
        </p>
        <span className="shrink-0 text-[11px] text-white/40">
          {t("confidence")}{" "}
          <span className="font-semibold text-[#C8F04A]">{bundle.overallConfidence}%</span>
        </span>
      </div>

      <Link
        href={`/matches/${bundle.matchId}`}
        prefetch={false}
        className="block text-base font-bold transition hover:text-[#C8F04A]"
      >
        {bundle.homeTeam} <span className="text-white/40">vs</span> {bundle.awayTeam}
      </Link>

      {rows}
    </div>
  );
}
