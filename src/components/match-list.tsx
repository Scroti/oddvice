"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

type Group = { key: string; label: string; matches: Match[] };

/** Groups items into [key, items][], preserving first-seen order. */
function groupBy(matches: Match[], keyFn: (m: Match) => string): [string, Match[]][] {
  const map = new Map<string, Match[]>();
  for (const m of matches) {
    const key = keyFn(m);
    (map.get(key) ?? map.set(key, []).get(key)!).push(m);
  }
  return [...map.entries()];
}

/** Local "YYYY-MM-DD" for today (matches are grouped by their date key). */
function todayKey(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function MatchList() {
  const t = useTranslations("matches");
  const ts = useTranslations("stage");
  const [view, setView] = useState<View>("date");
  const [state, setState] = useState<State>({ kind: "loading" });
  const refs = useRef(new Map<string, HTMLDivElement>());
  const scrolled = useRef(false);
  const today = useMemo(() => todayKey(), []);

  useEffect(() => {
    getMatches()
      .then((res) => setState({ kind: "done", matches: res.matches }))
      .catch(() => setState({ kind: "error" }));
  }, []);

  const groups: Group[] = useMemo(() => {
    if (state.kind !== "done") return [];
    if (view === "group") {
      return groupBy(state.matches, (m) => m.league || "—").map(([k, items]) => ({
        key: k,
        label: localizeStage(k, ts),
        matches: items,
      }));
    }
    // by date: group by day (matches arrive sorted by kickoff ascending)
    return groupBy(state.matches, (m) => m.kickoffAt?.slice(0, 10) ?? "—").map(
      ([k, items]) => ({
        key: k,
        label: k === "—" ? "—" : formatDate(`${k}T00:00:00Z`),
        matches: items,
      }),
    );
  }, [state, view, ts]);

  /** The date group to land on: today, else the next upcoming day, else last. */
  const targetKey = useMemo(() => {
    if (view !== "date" || groups.length === 0) return null;
    const dated = groups.filter((g) => g.key !== "—");
    const upcoming = dated.find((g) => g.key >= today);
    return (upcoming ?? dated[dated.length - 1])?.key ?? null;
  }, [groups, view, today]);

  const scrollTo = (key: string | null, smooth: boolean) => {
    if (!key) return;
    refs.current.get(key)?.scrollIntoView({
      block: "start",
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Auto-jump to today once, after the list first renders.
  useEffect(() => {
    if (state.kind === "done" && view === "date" && !scrolled.current && targetKey) {
      scrolled.current = true;
      requestAnimationFrame(() => scrollTo(targetKey, false));
    }
  }, [state, view, targetKey]);

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Controls */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="inline-flex rounded-full border border-white/15 p-1 text-xs font-bold uppercase tracking-wide">
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
        {view === "date" && targetKey && (
          <button
            type="button"
            onClick={() => scrollTo(targetKey, true)}
            className="rounded-full border border-[#C8F04A]/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#C8F04A] transition-colors hover:bg-[#C8F04A]/10"
          >
            {t("today")}
          </button>
        )}
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
          {groups.map((g) => {
            const isToday = view === "date" && g.key === today;
            return (
              <div
                key={g.key}
                ref={(el) => {
                  if (el) refs.current.set(g.key, el);
                }}
                className="scroll-mt-20"
              >
                <h2
                  className={`mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
                    isToday ? "text-[#C8F04A]" : "text-white/40"
                  }`}
                >
                  {isToday && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#C8F04A]" />
                  )}
                  {isToday ? `${t("today")} · ${g.label}` : g.label}
                </h2>
                <div className="flex flex-col gap-2.5">
                  {g.matches.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
