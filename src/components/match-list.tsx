"use client";

import { useEffect, useState } from "react";
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

/** Full competition match list, grouped by stage. */
export function MatchList() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    getMatches()
      .then((res) => setState({ kind: "done", matches: res.matches }))
      .catch(() => setState({ kind: "error" }));
  }, []);

  if (state.kind === "loading") {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-2.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-[104px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]"
          />
        ))}
      </div>
    );
  }

  if (state.kind === "error") {
    return (
      <p className="mx-auto w-full max-w-xl rounded-xl border border-white/10 p-6 text-sm text-white/60">
        Nu am putut încărca meciurile. Încearcă din nou.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
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
  );
}
