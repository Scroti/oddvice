"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getEvents, type MatchEvent } from "@/lib/api";

function icon(e: MatchEvent): string {
  if (e.type === "Goal") return "⚽";
  if (e.type === "Card")
    return e.detail.toLowerCase().includes("red") ? "🟥" : "🟨";
  if (e.type === "subst") return "🔁";
  if (e.type === "Var") return "VAR";
  return "•";
}

/** Flashscore-style live timeline (goals, cards, subs). Polls ~30s; renders
 * nothing until there are events. Newest at the top. */
export function Commentary({
  home,
  away,
  date,
}: {
  home: string;
  away: string;
  date: string;
}) {
  const t = useTranslations("live");
  const [events, setEvents] = useState<MatchEvent[]>([]);

  useEffect(() => {
    let active = true;
    const load = () =>
      getEvents(home, away, date)
        .then((r) => active && setEvents(r.events))
        .catch(() => {});
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [home, away, date]);

  if (events.length === 0) return null;
  const rows = [...events].reverse(); // newest first

  return (
    <section>
      <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
        {t("commentary")}
      </h2>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <ul className="space-y-2.5">
          {rows.map((e, i) => (
            <li key={`${e.minute}-${i}`} className="flex gap-3 text-[13px]">
              <span className="w-9 shrink-0 text-right font-bold tabular-nums text-white/45">
                {e.minute}
                {e.extra ? `+${e.extra}` : ""}&apos;
              </span>
              <span className="w-5 shrink-0 text-center">{icon(e)}</span>
              <span className="min-w-0">
                <span className="font-semibold">{e.player || e.detail}</span>
                {e.type === "subst" && e.assist ? (
                  <span className="text-white/45"> ↔ {e.assist}</span>
                ) : e.type === "Goal" && e.assist ? (
                  <span className="text-white/45"> ({e.assist})</span>
                ) : null}
                <span className="block text-[11px] text-white/35">
                  {e.team}
                  {e.type !== "Goal" ? ` · ${e.detail}` : ""}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
