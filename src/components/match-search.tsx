"use client";

import { useEffect, useMemo, useState } from "react";
import { getMatches, type Match } from "@/lib/api";
import { MatchCard } from "@/components/match-card";

type State =
  | { kind: "loading" }
  | { kind: "done"; matches: Match[] }
  | { kind: "error" };

function groupByLeague(matches: Match[]): [string, Match[]][] {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const key = m.league || "Meciuri";
    (map.get(key) ?? map.set(key, []).get(key)!).push(m);
  }
  return [...map.entries()];
}

/** Matches screen: full competition list with a client-side filter, grouped. */
export function MatchSearch() {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    getMatches()
      .then((res) => setState({ kind: "done", matches: res.matches }))
      .catch(() => setState({ kind: "error" }));
  }, []);

  const filtered = useMemo(() => {
    if (state.kind !== "done") return [];
    const q = query.trim().toLowerCase();
    if (!q) return state.matches;
    return state.matches.filter((m) =>
      `${m.homeTeam} ${m.awayTeam} ${m.league}`.toLowerCase().includes(q),
    );
  }, [state, query]);

  return (
    <section className="mx-auto w-full max-w-xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filtrează după echipă sau grupă…"
        aria-label="Filtrează meciuri"
        className="mb-6 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm outline-none transition-colors focus:border-[#C8F04A]"
      />

      {state.kind === "loading" && <MatchSkeleton />}

      {state.kind === "error" && (
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          Nu am putut încărca meciurile. Încearcă din nou.
        </p>
      )}

      {state.kind === "done" && filtered.length === 0 && (
        <p className="rounded-xl border border-white/10 p-6 text-center text-sm text-white/60">
          Niciun meci găsit.
        </p>
      )}

      {state.kind === "done" && filtered.length > 0 && (
        <div className="flex flex-col gap-6">
          {groupByLeague(filtered).map(([league, matches]) => (
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

function MatchSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-[104px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]"
        />
      ))}
    </div>
  );
}
