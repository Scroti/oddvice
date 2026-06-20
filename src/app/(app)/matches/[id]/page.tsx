import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  getMatch,
  getStandings,
  getTeamByName,
  getLineups,
  getMatchStats,
  type Match,
  type Group,
  type TeamDetail,
  type MatchLineups,
  type MatchStats,
  type Lineup,
} from "@/lib/api";
import { localizeStage } from "@/lib/stage";
import { StandingsTable } from "@/components/standings-table";
import { TeamStats } from "@/components/team-stats";
import { Pitch } from "@/components/pitch";
import { MatchStatsTable } from "@/components/match-stats-table";
import { LocalTime } from "@/components/local-time";
import { FollowButton } from "@/components/follow-button";
import { watchUrl } from "@/lib/watch";

export const dynamic = "force-dynamic";

function abbr(name: string): string {
  return name.replace(/[^a-zA-Z ]/g, "").trim().slice(0, 3).toUpperCase() || "—";
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations();
  const ls = (name: string) =>
    localizeStage(name, (k, v) => t(`stage.${k}`, v));

  let match: Match | null = null;
  try {
    match = await getMatch(id);
  } catch {
    match = null;
  }

  if (!match) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink label={t("matchDetail.back")} />
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          {t("matchDetail.notFound")}
        </p>
      </div>
    );
  }

  // Everything below is best-effort — a failing source must not blank the page.
  let group: Group | null = null;
  if (match.league.startsWith("Group")) {
    try {
      const { groups } = await getStandings();
      group = groups.find((g) => g.name === match!.league) ?? null;
    } catch {
      group = null;
    }
  }

  let homeTeam: TeamDetail | null = null;
  let awayTeam: TeamDetail | null = null;
  let lineups: MatchLineups | null = null;
  let stats: MatchStats | null = null;
  const matchDate = (match.kickoffAt ?? "").slice(0, 10);
  try {
    [homeTeam, awayTeam, lineups, stats] = await Promise.all([
      getTeamByName(match.homeTeam).catch(() => null),
      getTeamByName(match.awayTeam).catch(() => null),
      getLineups(match.homeTeam, match.awayTeam, matchDate).catch(() => null),
      getMatchStats(match.homeTeam, match.awayTeam, matchDate).catch(() => null),
    ]);
  } catch {
    homeTeam = awayTeam = null;
    lineups = null;
    stats = null;
  }
  const statLines = stats?.lines ?? [];
  const hasBench = Boolean(
    lineups?.home?.coach ||
      lineups?.away?.coach ||
      lineups?.home?.substitutes?.length ||
      lineups?.away?.substitutes?.length,
  );

  const homeStats = homeTeam?.stats ?? null;
  const awayStats = awayTeam?.stats ?? null;
  const hasTeamStats = Boolean(homeStats || awayStats);
  const canCompare = Boolean(homeStats && awayStats);

  const played = match.homeScore != null && match.awayScore != null;
  const statusText =
    match.status === "LIVE"
      ? t("common.live")
      : match.status === "FT" || played
        ? t("common.ft")
        : t("home.upcoming");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <BackLink label={t("matchDetail.back")} />

      {/* Scoreboard */}
      <section className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <div className="absolute right-3 top-3">
          <FollowButton matchId={match.id} size={22} />
        </div>
        <p className="text-center text-xs font-bold uppercase tracking-widest text-white/40">
          {ls(match.league)}
        </p>
        {match.kickoffAt && (
          <p className="mt-1 text-center text-xs text-white/40">
            <LocalTime iso={match.kickoffAt} mode="datetime" />
          </p>
        )}

        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <TeamColumn name={match.homeTeam} badge={match.homeBadge} />

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-extrabold tabular-nums">
                {played ? match.homeScore : "–"}
              </span>
              <span className="font-display text-4xl font-extrabold tabular-nums">
                {played ? match.awayScore : "–"}
              </span>
            </div>
            <span className="rounded-full border border-[#C8F04A]/40 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#C8F04A]">
              {statusText}
            </span>
          </div>

          <TeamColumn name={match.awayTeam} badge={match.awayBadge} />
        </div>

        <a
          href={watchUrl(match)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C8F04A] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#D8FB6A]"
        >
          {t("matchDetail.whereToWatch")} ↗
        </a>
      </section>

      {/* Formations — schematic pitch with both teams placed by formation */}
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
          {t("matchDetail.lineups")}
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <Pitch
            homeName={match.homeTeam}
            awayName={match.awayTeam}
            homeFormation={lineups?.home?.formation ?? homeStats?.formation}
            awayFormation={lineups?.away?.formation ?? awayStats?.formation}
            homePlayers={lineups?.home?.startXI}
            awayPlayers={lineups?.away?.startXI}
          />
        </div>
        {hasBench && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Bench
              lineup={lineups?.home}
              coachLabel={t("matchDetail.coach")}
              subsLabel={t("matchDetail.subs")}
            />
            <Bench
              lineup={lineups?.away}
              coachLabel={t("matchDetail.coach")}
              subsLabel={t("matchDetail.subs")}
            />
          </div>
        )}
      </section>

      {/* Match statistics (possession, shots, …) */}
      {statLines.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
            {t("matchDetail.stats")}
          </h2>
          <MatchStatsTable lines={statLines} />
        </section>
      )}

      {/* Head-to-head: form + stat comparison */}
      {hasTeamStats && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
            {t("teamStats.title")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {homeTeam && <TeamStats detail={homeTeam} />}
            {awayTeam && <TeamStats detail={awayTeam} />}
          </div>

          {canCompare && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <StatCompare label={t("teamStats.goals")} home={homeStats!.goalsFor} away={awayStats!.goalsFor} />
              <StatCompare label={t("teamStats.cleanSheets")} home={homeStats!.cleanSheets} away={awayStats!.cleanSheets} />
              <StatCompare label={t("teamStats.cards")} home={homeStats!.yellowCards + homeStats!.redCards} away={awayStats!.yellowCards + awayStats!.redCards} />
            </div>
          )}
        </section>
      )}

      {/* Group standings (group-stage matches only) */}
      {group && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
            {t("standings.forGroup", { group: ls(group.name) })}
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <StandingsTable group={group} />
          </div>
        </section>
      )}

      {/* Details */}
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
          {t("matchDetail.details")}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <InfoRow label={t("matchDetail.competition")} value={ls(match.league)} />
          {match.kickoffAt && (
            <InfoRow
              label={t("matchDetail.date")}
              value={<LocalTime iso={match.kickoffAt} mode="datetime" />}
            />
          )}
          {match.venue && (
            <InfoRow label={t("matchDetail.stadium")} value={match.venue} />
          )}
          <InfoRow label={t("matchDetail.status")} value={statusText} />
        </div>
      </section>
    </div>
  );
}

function StatCompare({
  label,
  home,
  away,
}: {
  label: string;
  home: number;
  away: number;
}) {
  const total = home + away;
  const homePct = total === 0 ? 50 : Math.round((home / total) * 100);
  return (
    <div className="py-2 first:pt-0 last:pb-0">
      <div className="mb-1 flex items-center justify-between text-[12px]">
        <span className="w-10 font-semibold tabular-nums text-[#C8F04A]">{home}</span>
        <span className="text-white/45">{label}</span>
        <span className="w-10 text-right font-semibold tabular-nums text-sky-300">{away}</span>
      </div>
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
        <div className="rounded-l-full bg-[#C8F04A]" style={{ width: `${homePct}%` }} />
        <div className="flex-1 rounded-r-full bg-sky-400/70" />
      </div>
    </div>
  );
}

function Bench({
  lineup,
  coachLabel,
  subsLabel,
}: {
  lineup: Lineup | null | undefined;
  coachLabel: string;
  subsLabel: string;
}) {
  if (!lineup || (!lineup.coach && !(lineup.substitutes?.length))) {
    return <div />;
  }
  const subs = lineup.substitutes ?? [];
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <p className="mb-1.5 truncate text-[11px] font-bold uppercase tracking-wide text-white/40">
        {lineup.teamName}
      </p>
      {lineup.coach && (
        <p className="mb-2 text-[12px]">
          <span className="text-white/45">{coachLabel}: </span>
          <span className="font-medium">{lineup.coach}</span>
        </p>
      )}
      {subs.length > 0 && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/35">
            {subsLabel}
          </p>
          <ul className="mt-1 space-y-0.5">
            {subs.map((s) => (
              <li key={s.id ?? s.name} className="truncate text-[12px] text-white/60">
                {s.number ? (
                  <span className="text-white/35">{s.number} </span>
                ) : null}
                {s.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function TeamColumn({ name, badge }: { name: string; badge?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {badge ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={badge}
          alt={name}
          width={56}
          height={56}
          className="h-14 w-14 object-contain"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-sm font-bold">
          {abbr(name)}
        </span>
      )}
      <span className="text-sm font-semibold leading-tight">{name}</span>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm last:border-b-0">
      <span className="text-white/45">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <Link
      href="/matches"
      className="inline-flex w-fit items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
    >
      ← {label}
    </Link>
  );
}
