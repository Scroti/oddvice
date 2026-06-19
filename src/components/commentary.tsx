"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getEventsByFixture, type MatchEvent } from "@/lib/api";

function icon(e: MatchEvent): string {
  if (e.type === "Goal") return "⚽";
  if (e.type === "Card")
    return e.detail.toLowerCase().includes("red") ? "🟥" : "🟨";
  if (e.type === "subst") return "🔁";
  if (e.type === "Var") return "📺";
  return "•";
}

/** Live commentary timeline (goals, cards, subs) for a fixture. Polls ~30s and
 * renders nothing until there are events; newest first. When `embedded` it drops
 * its own card chrome (used inside an expanded live card). */
export function Commentary({
  fixtureId,
  embedded = false,
}: {
  fixtureId: number;
  embedded?: boolean;
}) {
  const t = useTranslations("live");
  const locale = useLocale();
  const [events, setEvents] = useState<MatchEvent[]>([]);

  useEffect(() => {
    let active = true;
    setEvents([]); // reset when switching match
    const load = () =>
      getEventsByFixture(fixtureId, locale)
        .then((r) => active && setEvents(r.events))
        .catch(() => {});
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [fixtureId, locale]);

  if (events.length === 0) return null;
  const rows = [...events].reverse().slice(0, 12); // newest first, capped

  const body = (
    <>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
        {t("commentary")}
      </h3>
      <ul className="space-y-0">
        {rows.map((e, i) => (
          <li
            key={`${e.minute}-${i}`}
            className="flex gap-3 border-b border-white/[0.06] py-2.5 first:pt-0 last:border-0 last:pb-0"
          >
            <span className="w-8 shrink-0 pt-1 text-right text-[11px] font-bold tabular-nums text-white/45">
              {e.minute}
              {e.extra ? `+${e.extra}` : ""}&apos;
            </span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/[0.06] text-[13px]">
              {icon(e)}
            </span>
            <span className="min-w-0 flex-1">
              {e.commentary ? (
                <span className="block font-medium leading-snug">
                  {e.commentary}
                </span>
              ) : (
                <span className="block leading-snug">
                  <span className="font-semibold">{e.player || e.detail}</span>
                  {e.type === "subst" && e.assist ? (
                    <span className="text-white/45"> ↔ {e.assist}</span>
                  ) : e.type === "Goal" && e.assist ? (
                    <span className="text-white/45"> ({e.assist})</span>
                  ) : null}
                </span>
              )}
              <span className="mt-0.5 block text-[11px] text-white/35">
                {e.team}
                {e.player && e.commentary ? ` · ${e.player}` : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </>
  );

  if (embedded) return <div>{body}</div>;

  return (
    <section>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        {body}
      </div>
    </section>
  );
}
