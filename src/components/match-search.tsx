"use client";

import { useEffect, useState } from "react";
import { searchMatches, type Match } from "@/lib/api";

type State =
  | { kind: "loading" }
  | { kind: "done"; matches: Match[] }
  | { kind: "error"; message: string };

/** 3-letter abbreviation derived from a team name (e.g. "Arsenal" -> "ARS"). */
function abbr(name: string): string {
  const clean = name.replace(/[^a-zA-Z ]/g, "").trim();
  return clean.slice(0, 3).toUpperCase() || "—";
}

function groupByLeague(matches: Match[]): [string, Match[]][] {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const key = m.league || "Alte meciuri";
    (map.get(key) ?? map.set(key, []).get(key)!).push(m);
  }
  return [...map.entries()];
}

/** Matches screen: search + match cards grouped by league. */
export function MatchSearch() {
  const [query, setQuery] = useState("Arsenal");
  const [state, setState] = useState<State>({ kind: "loading" });

  async function run(q: string) {
    setState({ kind: "loading" });
    try {
      const res = await searchMatches(q);
      setState({ kind: "done", matches: res.matches });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Cerere eșuată",
      });
    }
  }

  // Load a default set of matches on mount.
  useEffect(() => {
    run("Arsenal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) run(query.trim());
  }

  return (
    <section className="mx-auto w-full max-w-xl">
      <form onSubmit={onSubmit} className="mb-6 flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Caută un meci (ex. Arsenal vs Chelsea)"
          aria-label="Caută meci"
          className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C8F04A]"
        />
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="rounded-xl bg-[#C8F04A] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#020B0A] transition-colors hover:bg-[#D8FB6A] disabled:opacity-50"
        >
          {state.kind === "loading" ? "Caut…" : "Caută"}
        </button>
      </form>

      {state.kind === "loading" && <MatchSkeleton />}

      {state.kind === "error" && (
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          Nu am putut încărca meciurile. Încearcă din nou.
        </p>
      )}

      {state.kind === "done" && state.matches.length === 0 && (
        <p className="rounded-xl border border-white/10 p-6 text-center text-sm text-white/60">
          Niciun meci găsit pentru „{query}".
        </p>
      )}

      {state.kind === "done" && state.matches.length > 0 && (
        <div className="flex flex-col gap-6">
          {groupByLeague(state.matches).map(([league, matches]) => (
            <div key={league}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                {league}
              </h2>
              <div className="flex flex-col gap-2.5">
                {matches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MatchCard({ match }: { match: Match }) {
  const played = match.homeScore != null && match.awayScore != null;
  const date = match.kickoffAt?.slice(0, 10) ?? "";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <TeamSide name={match.homeTeam} align="end" />

        <div className="flex flex-col items-center px-2">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-extrabold tabular-nums">
              {played ? match.homeScore : "–"}
            </span>
            <span className="rounded-md bg-[#C8F04A]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#C8F04A]">
              {played ? "FT" : "VS"}
            </span>
            <span className="font-display text-2xl font-extrabold tabular-nums">
              {played ? match.awayScore : "–"}
            </span>
          </div>
        </div>

        <TeamSide name={match.awayTeam} align="start" />
      </div>

      {(match.venue || date) && (
        <p className="mt-3 text-center text-[11px] text-white/35">
          {[date, match.venue].filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}

function TeamSide({ name, align }: { name: string; align: "start" | "end" }) {
  return (
    <div
      className={`flex items-center gap-2.5 ${align === "end" ? "flex-row-reverse text-right" : ""}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold">
        {abbr(name)}
      </span>
      <span className="truncate text-sm font-semibold">{name}</span>
    </div>
  );
}

function MatchSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[88px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]"
        />
      ))}
    </div>
  );
}
