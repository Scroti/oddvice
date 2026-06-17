"use client";

import { useState } from "react";
import { searchMatches, type Match } from "@/lib/api";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; matches: Match[] }
  | { kind: "error"; message: string };

function score(m: Match): string {
  if (m.homeScore == null || m.awayScore == null) return "vs";
  return `${m.homeScore} – ${m.awayScore}`;
}

/** Test-only match search: sends the query to the Go API and lists results. */
export function MatchSearch() {
  const [query, setQuery] = useState("Arsenal vs Chelsea");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setState({ kind: "loading" });
    try {
      const res = await searchMatches(q);
      setState({ kind: "done", matches: res.matches });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Request failed",
      });
    }
  }

  return (
    <section className="w-full max-w-md">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Arsenal vs Chelsea"
          aria-label="Match search"
          className="flex-1 rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-[#37F06C]"
        />
        <button
          type="submit"
          disabled={state.kind === "loading"}
          className="rounded-md bg-[#37F06C] px-4 py-2 text-sm font-bold uppercase tracking-wide text-[#020B0A] hover:bg-[#5af588] disabled:opacity-50 transition-colors"
        >
          {state.kind === "loading" ? "Caut…" : "Caută"}
        </button>
      </form>

      <div className="mt-4">
        {state.kind === "error" && (
          <p className="text-sm text-red-500">Error: {state.message}</p>
        )}
        {state.kind === "done" && state.matches.length === 0 && (
          <p className="text-sm text-white/60">Niciun meci găsit.</p>
        )}
        {state.kind === "done" && state.matches.length > 0 && (
          <ul className="flex flex-col gap-2">
            {state.matches.map((m) => (
              <li
                key={m.id}
                className="rounded-lg border border-white/15 p-3 text-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">
                    {m.homeTeam} {score(m)} {m.awayTeam}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                    {m.status || "—"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-white/55">
                  {[m.league, m.season, m.kickoffAt?.slice(0, 10), m.venue]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
