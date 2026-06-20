"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type NotifPrefs = { goals: boolean; news: boolean; tips: boolean };
export type Settings = { favTeam: string; notif: NotifPrefs; follows: string[] };

const KEY = "oddvice_settings";
const DEFAULT: Settings = {
  favTeam: "",
  notif: { goals: true, news: true, tips: true },
  follows: [],
};

let settings: Settings = DEFAULT;
let loaded = false;
let userId: string | null = null;
let cloudInit = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function normalize(s: Partial<Settings> | null | undefined): Settings {
  return {
    favTeam: typeof s?.favTeam === "string" ? s.favTeam : "",
    notif: {
      goals: s?.notif?.goals ?? true,
      news: s?.notif?.news ?? true,
      tips: s?.notif?.tips ?? true,
    },
    follows: Array.isArray(s?.follows) ? s!.follows!.map(String) : [],
  };
}

function persistLocal() {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

function ensureLoaded() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) settings = normalize(JSON.parse(raw));
  } catch {
    // ignore corrupt store
  }
  emit();
}

function pushCloud() {
  if (!isSupabaseConfigured || !userId) return;
  const supabase = createClient();
  void supabase
    .from("profiles")
    .upsert({ id: userId, settings, updated_at: new Date().toISOString() })
    .then(
      () => {},
      () => {},
    );
}

/** Current settings, read synchronously (used by the notifications watcher). */
export function getSettings(): Settings {
  ensureLoaded();
  return settings;
}

function update(next: Partial<Settings>) {
  settings = normalize({ ...settings, ...next });
  emit();
  persistLocal();
  pushCloud();
}

export function setNotifPref(key: keyof NotifPrefs, value: boolean) {
  update({ notif: { ...settings.notif, [key]: value } });
}
export function setFavTeam(team: string) {
  update({ favTeam: team });
}
export function toggleFollow(matchId: string) {
  const has = settings.follows.includes(matchId);
  update({
    follows: has
      ? settings.follows.filter((x) => x !== matchId)
      : [...settings.follows, matchId],
  });
}

/** Reactive settings + mutators; syncs with Supabase `profiles.settings` when signed in. */
export function useSettings() {
  const [, force] = useState(0);
  useEffect(() => {
    ensureLoaded();
    const l = () => force((x) => x + 1);
    listeners.add(l);

    if (isSupabaseConfigured && !cloudInit) {
      cloudInit = true;
      const supabase = createClient();
      const apply = async (uid: string | null) => {
        userId = uid;
        if (!uid) return;
        try {
          const { data } = await supabase
            .from("profiles")
            .select("settings")
            .eq("id", uid)
            .maybeSingle();
          if (data?.settings) {
            settings = normalize(data.settings as Partial<Settings>);
            persistLocal();
            emit();
          }
        } catch {
          // keep local
        }
      };
      supabase.auth.getUser().then(({ data }) => apply(data.user?.id ?? null));
      supabase.auth.onAuthStateChange((_e, s) => apply(s?.user?.id ?? null));
    }

    return () => {
      listeners.delete(l);
    };
  }, []);

  return { settings, setNotifPref, setFavTeam, toggleFollow };
}

export function useFollow(matchId: string): [boolean, () => void] {
  const { settings } = useSettings();
  return [settings.follows.includes(matchId), () => toggleFollow(matchId)];
}
