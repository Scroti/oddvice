"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Match } from "@/lib/api";
import { localizeStage } from "@/lib/stage";
import { LocalTime } from "@/components/local-time";

function abbr(name: string): string {
  return name.replace(/[^a-zA-Z ]/g, "").trim().slice(0, 3).toUpperCase() || "—";
}

function Team({
  name,
  badge,
  align,
}: {
  name: string;
  badge?: string;
  align: "start" | "end";
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-2.5 ${
        align === "end" ? "flex-row-reverse text-right" : ""
      }`}
    >
      {badge ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={badge}
          alt={name}
          width={36}
          height={36}
          referrerPolicy="no-referrer"
          className="h-9 w-9 shrink-0 object-contain"
        />
      ) : (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-[11px] font-bold">
          {abbr(name)}
        </span>
      )}
      <span className="truncate text-sm font-semibold">{name}</span>
    </div>
  );
}

export function MatchCard({ match }: { match: Match }) {
  const c = useTranslations("common");
  const ts = useTranslations("stage");
  const played = match.homeScore != null && match.awayScore != null;
  const live = match.status === "LIVE";
  const mid = live ? c("live") : played ? c("ft") : c("vs");

  return (
    <Link
      href={`/matches/${match.id}`}
      prefetch={false}
      className="block rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:-translate-y-0.5 hover:border-[#C8F04A]/40 hover:bg-white/[0.04]"
    >
      <p className="mb-3 truncate text-center text-[11px] font-bold uppercase tracking-widest text-white/40">
        {localizeStage(match.league, ts)}
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Team name={match.homeTeam} badge={match.homeBadge} align="end" />

        <div className="flex items-center gap-2.5 px-1">
          <span className="font-display text-2xl font-extrabold tabular-nums">
            {played ? match.homeScore : "–"}
          </span>
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              live
                ? "bg-red-500/15 text-red-400"
                : "bg-[#C8F04A]/15 text-[#C8F04A]"
            }`}
          >
            {mid}
          </span>
          <span className="font-display text-2xl font-extrabold tabular-nums">
            {played ? match.awayScore : "–"}
          </span>
        </div>

        <Team name={match.awayTeam} badge={match.awayBadge} align="start" />
      </div>

      {(match.kickoffAt || match.venue) && (
        <p className="mt-3 truncate text-center text-[11px] text-white/35">
          {match.kickoffAt && <LocalTime iso={match.kickoffAt} mode="datetime" />}
          {match.kickoffAt && match.venue ? " · " : ""}
          {match.venue}
        </p>
      )}
    </Link>
  );
}
