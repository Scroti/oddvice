"use client";

import { useEffect, useState } from "react";
import { getLive, getNews, getTips, getUpcoming } from "./api";

export type Notif = {
  id: string;
  title: string;
  body: string;
  href?: string;
  ts: number;
  read: boolean;
};

const KEY = "oddvice_notifs";
const MAX = 100;

let cache: Notif[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache.slice(0, MAX)));
  } catch {
    // ignore
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) cache = JSON.parse(raw) as Notif[];
  } catch {
    // ignore corrupt store
  }
  emit();
}

/** Add a notification (deduped by id). Newest first, capped at MAX. */
export function addNotification(n: {
  id: string;
  title: string;
  body: string;
  href?: string;
}) {
  if (cache.some((x) => x.id === n.id)) return;
  cache = [
    { id: n.id, title: n.title, body: n.body, href: n.href, ts: Date.now(), read: false },
    ...cache,
  ].slice(0, MAX);
  emit();
  persist();
}

export function markAllRead() {
  if (!cache.some((n) => !n.read)) return;
  cache = cache.map((n) => ({ ...n, read: true }));
  emit();
  persist();
}

/** Subscribe a component to the notification list + unread count. */
export function useNotifications() {
  const [, force] = useState(0);
  useEffect(() => {
    ensureLoaded();
    const l = () => force((x) => x + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return {
    items: cache,
    unread: cache.filter((n) => !n.read).length,
    markAllRead,
  };
}

/** App-wide watcher: goals + full-time (live), next/starting-soon (upcoming),
 * tip of the day, and an occasional news headline. Mount once in the layout. */
export function useNotificationWatcher() {
  useEffect(() => {
    ensureLoaded();
    const seen = new Map<number, { h: number; a: number; home: string; away: string }>();
    let first = true;

    const tick = async () => {
      try {
        const { matches } = await getLive();
        const liveIds = new Set(matches.map((m) => m.fixtureId));
        for (const m of matches) {
          const prev = seen.get(m.fixtureId);
          if (prev && !first) {
            const score = `${m.homeGoals}-${m.awayGoals}`;
            if (m.homeGoals > prev.h)
              addNotification({ id: `g-${m.fixtureId}-h-${m.homeGoals}`, title: `⚽ ${m.home} ${score} ${m.away}`, body: `${m.home} scored · ${m.elapsed}'`, href: "/" });
            if (m.awayGoals > prev.a)
              addNotification({ id: `g-${m.fixtureId}-a-${m.awayGoals}`, title: `⚽ ${m.home} ${score} ${m.away}`, body: `${m.away} scored · ${m.elapsed}'`, href: "/" });
          }
          seen.set(m.fixtureId, { h: m.homeGoals, a: m.awayGoals, home: m.home, away: m.away });
        }
        if (!first) {
          for (const [fid, s] of [...seen.entries()]) {
            if (!liveIds.has(fid)) {
              addNotification({ id: `final-${fid}`, title: `🏁 ${s.home} ${s.h}-${s.a} ${s.away}`, body: "Full time", href: "/" });
              seen.delete(fid);
            }
          }
        }
        first = false;
      } catch {
        // ignore
      }

      try {
        const { matches } = await getUpcoming();
        const now = Date.now();
        const next = matches[0];
        if (next?.kickoffAt) {
          const d = new Date(next.kickoffAt);
          const when = `${d.toLocaleDateString(undefined, { day: "numeric", month: "short" })} · ${d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
          addNotification({ id: `next-${next.id}`, title: `📅 ${next.homeTeam} vs ${next.awayTeam}`, body: `Up next · ${when}`, href: `/matches/${next.id}` });
        }
        for (const m of matches.slice(0, 6)) {
          if (!m.kickoffAt) continue;
          const diff = new Date(m.kickoffAt).getTime() - now;
          if (diff > 0 && diff <= 2 * 60 * 60 * 1000) {
            const hhmm = new Date(m.kickoffAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
            addNotification({ id: `soon-${m.id}`, title: `⏰ ${m.homeTeam} vs ${m.awayTeam}`, body: `Kicks off at ${hhmm}`, href: `/matches/${m.id}` });
          }
        }
      } catch {
        // ignore
      }
    };

    const seedSlow = async () => {
      try {
        const today = new Date().toISOString().slice(0, 10);
        const { tips } = await getTips();
        const b = tips[0];
        const tip = b?.tips?.[0];
        if (b && tip)
          addNotification({ id: `tip-${today}`, title: "💡 Tip of the day", body: `${b.homeTeam} vs ${b.awayTeam} — ${tip.selection}`, href: "/bets" });
      } catch {
        // ignore
      }
      try {
        const { articles } = await getNews();
        const a = articles[0];
        if (a) addNotification({ id: `news-${a.id}`, title: `📰 ${a.title}`, body: a.source, href: `/news/${a.id}` });
      } catch {
        // ignore
      }
    };

    void tick();
    void seedSlow();
    const fastId = setInterval(() => void tick(), 30000);
    const slowId = setInterval(() => void seedSlow(), 30 * 60 * 1000);
    return () => {
      clearInterval(fastId);
      clearInterval(slowId);
    };
  }, []);
}
