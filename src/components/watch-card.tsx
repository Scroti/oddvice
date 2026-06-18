"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Match } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { localizeStage } from "@/lib/stage";
import { watchUrl } from "@/lib/watch";

function abbr(name: string): string {
  return name.replace(/[^a-zA-Z ]/g, "").trim().slice(0, 3).toUpperCase() || "—";
}

function Side({ name, badge }: { name: string; badge?: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
      {badge ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={badge}
          alt={name}
          width={32}
          height={32}
          referrerPolicy="no-referrer"
          className="h-8 w-8 object-contain"
        />
      ) : (
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[10px] font-bold">
          {abbr(name)}
        </span>
      )}
      <span className="truncate text-xs font-semibold">{name}</span>
    </div>
  );
}

export function WatchCard({ match }: { match: Match }) {
  const t = useTranslations("matchDetail");
  const ts = useTranslations("stage");
  const date = formatDate(match.kickoffAt);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <Link
        href={`/matches/${match.id}`}
        prefetch={false}
        className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"
      >
        <Side name={match.homeTeam} badge={match.homeBadge} />
        <div className="flex flex-col items-center px-1 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wide text-white/40">
            {localizeStage(match.league, ts)}
          </span>
          {date && <span className="text-xs text-white/55">{date}</span>}
        </div>
        <Side name={match.awayTeam} badge={match.awayBadge} />
      </Link>

      <a
        href={watchUrl(match)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#C8F04A] px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#D8FB6A]"
      >
        {t("whereToWatch")} ↗
      </a>
    </div>
  );
}
