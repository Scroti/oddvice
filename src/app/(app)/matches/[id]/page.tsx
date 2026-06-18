import Link from "next/link";
import { getMatch, getStandings, type Match, type Group } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { StandingsTable } from "@/components/standings-table";

export const dynamic = "force-dynamic";

function abbr(name: string): string {
  return name.replace(/[^a-zA-Z ]/g, "").trim().slice(0, 3).toUpperCase() || "—";
}

function statusLabel(status: string, played: boolean): string {
  const s = status.toLowerCase();
  if (s === "ft" || s.includes("finished")) return "Final";
  if (s === "ns" || s.includes("not started")) return "Urmează";
  if (s.includes("postponed")) return "Amânat";
  return played ? "Final" : status || "Urmează";
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let match: Match | null = null;
  try {
    match = await getMatch(id);
  } catch {
    match = null;
  }

  // For group-stage matches, also load the group's standings table.
  let group: Group | null = null;
  if (match && match.league.startsWith("Grupa")) {
    try {
      const { groups } = await getStandings();
      group = groups.find((g) => g.name === match!.league) ?? null;
    } catch {
      group = null;
    }
  }

  if (!match) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          Meciul nu a fost găsit.
        </p>
      </div>
    );
  }

  const played = match.homeScore != null && match.awayScore != null;
  const date = formatDate(match.kickoffAt);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <BackLink />

      {/* Scoreboard */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-white/40">
          {match.league}
        </p>
        {date && (
          <p className="mt-1 text-center text-xs text-white/40">{date}</p>
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
              {statusLabel(match.status, played)}
            </span>
          </div>

          <TeamColumn name={match.awayTeam} badge={match.awayBadge} />
        </div>
      </section>

      {/* Group standings (group-stage matches only) */}
      {group && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
            Clasament · {group.name}
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <StandingsTable group={group} />
          </div>
        </section>
      )}

      {/* Details */}
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
          Detalii
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <InfoRow label="Competiție" value={match.league} />
          {date && <InfoRow label="Dată" value={date} />}
          {match.venue && <InfoRow label="Stadion" value={match.venue} />}
          <InfoRow label="Status" value={statusLabel(match.status, played)} />
        </div>
      </section>

      {match.video && (
        <a
          href={match.video}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#C8F04A] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#D8FB6A]"
        >
          Vezi rezumat ↗
        </a>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm last:border-b-0">
      <span className="text-white/45">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/matches"
      className="inline-flex w-fit items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
    >
      ← Înapoi la meciuri
    </Link>
  );
}
