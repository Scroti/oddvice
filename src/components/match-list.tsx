"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { getMatches, type Match } from "@/lib/api";
import { MatchCard } from "@/components/match-card";
import { localizeStage } from "@/lib/stage";
import { formatDate } from "@/lib/format";

type State =
  | { kind: "loading" }
  | { kind: "done"; matches: Match[] }
  | { kind: "error" };

type View = "date" | "group";

/** Groups items into [label, items][], preserving first-seen order. */
function groupBy(matches: Match[], keyFn: (m: Match) => string): [string, Match[]][] {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const key = keyFn(m);
    (map.get(key) ?? map.set(key, []).get(key)!).push(m);
  }
  return [...map.entries()];
}

export function MatchList() {
  const t = useTranslations("matches");
  const ts = useTranslations("stage");
  const [view, setView] = useState<View>("date");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    getMatches()
      .then((res) => setState({ kind: "done", matches: res.matches }))
      .catch(() => setState({ kind: "error" }));
  }, []);

  const groups = useMemo(() => {
    if (state.kind !== "done") return [];
    if (view === "group") {
      return groupBy(state.matches, (m) => m.league || "—").map(
        ([k, items]) => [localizeStage(k, ts), items] as [string, Match[]],
      );
    }
    // by date: group by day (matches arrive sorted by kickoff ascending)
    return groupBy(state.matches, (m) => m.kickoffAt?.slice(0, 10) ?? "—").map(
      ([k, items]) =>
        [k === "—" ? "—" : formatDate(`${k}T00:00:00Z`), items] as [
          string,
          Match[],
        ],
    );
  }, [state, view, ts]);

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* View selector */}
      <div className="mb-5 inline-flex rounded-full border border-white/15 p-1 text-xs font-bold uppercase tracking-wide">
        {(["date", "group"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full px-4 py-1.5 transition-colors ${
              view === v ? "bg-[#C8F04A] text-[#020B0A]" : "text-white/55"
            }`}
          >
            {v === "date" ? t("byDate") : t("byGroup")}
          </button>
        ))}
      </div>

      {state.kind === "loading" && (
        <div className="flex flex-col gap-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[104px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.02]"
            />
          ))}
        </div>
      )}

      {state.kind === "error" && (
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          {t("couldntLoad")}
        </p>
      )}

      {state.kind === "done" && (
        <div className="flex flex-col gap-6">
          {groups.map(([label, matches]) => (
            <div key={label}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
                {label}
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
    </div>
  );
}
