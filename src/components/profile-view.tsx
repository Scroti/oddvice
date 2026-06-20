"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { API_URL, getHealth, searchPlayers, type PlayerHit } from "@/lib/api";
import { usePremium } from "@/lib/use-premium";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { LanguageSwitcher } from "@/components/language-switcher";
import { InstallPrompt } from "@/components/pwa";
import { Icon } from "@/components/icon";

const AVATARS: { key: string; emoji: string; from: string; to: string }[] = [
  { key: "ball", emoji: "⚽", from: "#C8F04A", to: "#38BDF8" },
  { key: "gloves", emoji: "🧤", from: "#38BDF8", to: "#7DD3FC" },
  { key: "goal", emoji: "🥅", from: "#22C55E", to: "#C8F04A" },
  { key: "boot", emoji: "👟", from: "#FCD34D", to: "#EF4444" },
  { key: "trophy", emoji: "🏆", from: "#FACC15", to: "#C8F04A" },
  { key: "target", emoji: "🎯", from: "#EF4444", to: "#FCD34D" },
  { key: "fire", emoji: "🔥", from: "#F87171", to: "#FCD34D" },
  { key: "star", emoji: "⭐", from: "#C8F04A", to: "#FACC15" },
  { key: "lion", emoji: "🦁", from: "#FCD34D", to: "#F87171" },
  { key: "dragon", emoji: "🐉", from: "#22C55E", to: "#38BDF8" },
  { key: "crown", emoji: "👑", from: "#FACC15", to: "#C8F04A" },
  { key: "rocket", emoji: "🚀", from: "#7DD3FC", to: "#C8F04A" },
];

function initials(name: string): string {
  const parts = name.replace(/[^a-zA-Z ]/g, "").trim().split(/\s+/).filter(Boolean);
  return (parts.map((p) => p[0]).slice(0, 2).join("") || "O").toUpperCase();
}

function Avatar({ value, name, size }: { value: string | null; name: string; size: number }) {
  if (value && value.startsWith("http")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={value}
        alt=""
        style={{ width: size, height: size }}
        className="rounded-full bg-white/5 object-cover"
      />
    );
  }
  const a = AVATARS.find((x) => x.key === value);
  if (a) {
    return (
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: size, height: size, background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
      >
        <span style={{ fontSize: size * 0.46 }}>{a.emoji}</span>
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-full bg-[#C8F04A] font-display font-extrabold text-[#020B0A]"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  );
}

export function ProfileView() {
  const t = useTranslations();
  const { premium } = usePremium();

  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [notif, setNotif] = useState(true);
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  const [pq, setPq] = useState("");
  const [results, setResults] = useState<PlayerHit[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setAvatar(localStorage.getItem("oddvice_avatar"));
    setUsername(localStorage.getItem("oddvice_username"));
    setNotif(localStorage.getItem("oddvice_notif_pref") !== "0");
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const apply = async (uid: string | null, mail: string | null) => {
      setEmail(mail);
      setUserId(uid);
      if (!uid) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("username, avatar")
          .eq("id", uid)
          .maybeSingle();
        if (data?.username != null) {
          setUsername(data.username);
          localStorage.setItem("oddvice_username", data.username);
        }
        if (data?.avatar != null) {
          setAvatar(data.avatar);
          localStorage.setItem("oddvice_avatar", data.avatar);
        }
      } catch {
        // ignore — keep local values
      }
    };
    supabase.auth.getUser().then(({ data }) => apply(data.user?.id ?? null, data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      apply(s?.user?.id ?? null, s?.user?.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const c = new AbortController();
    getHealth(c.signal)
      .then(() => setStatus("online"))
      .catch(() => {
        if (!c.signal.aborted) setStatus("offline");
      });
    return () => c.abort();
  }, []);

  const displayName = username || (email ? email.split("@")[0] : "Guest");

  // Push the profile to Supabase when signed in (non-blocking; local already saved).
  const pushCloud = (next: { username?: string | null; avatar?: string | null }) => {
    if (!isSupabaseConfigured || !userId) return;
    const supabase = createClient();
    void supabase
      .from("profiles")
      .upsert({
        id: userId,
        username: next.username !== undefined ? next.username : username,
        avatar: next.avatar !== undefined ? next.avatar : avatar,
        updated_at: new Date().toISOString(),
      })
      .then(
        () => {},
        () => {},
      );
  };

  const saveAvatar = (v: string) => {
    setAvatar(v);
    localStorage.setItem("oddvice_avatar", v);
    pushCloud({ avatar: v });
    setAvatarOpen(false);
  };
  const saveName = () => {
    const v = nameDraft.trim();
    setUsername(v || null);
    localStorage.setItem("oddvice_username", v);
    pushCloud({ username: v || null });
    setNameOpen(false);
  };
  const toggleNotif = () => {
    const v = !notif;
    setNotif(v);
    localStorage.setItem("oddvice_notif_pref", v ? "1" : "0");
  };
  const runSearch = async () => {
    const q = pq.trim();
    if (q.length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      setResults(await searchPlayers(q));
    } finally {
      setSearching(false);
    }
  };
  async function logout() {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
  }

  const statusDot =
    status === "online"
      ? "bg-green-500"
      : status === "offline"
        ? "bg-red-500"
        : "bg-yellow-500 animate-pulse";
  const statusLabel =
    status === "online" ? t("apiStatus.online") : status === "offline" ? t("apiStatus.offline") : t("apiStatus.checking");

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#C8F04A]/12 via-white/[0.02] to-transparent p-6">
        <button onClick={() => setAvatarOpen(true)} className="relative" aria-label="Change avatar">
          <Avatar value={avatar} name={displayName} size={92} />
          <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-[#020B0A] bg-[#C8F04A] text-[#020B0A]">
            <Icon name="edit" size={13} />
          </span>
        </button>
        <button
          onClick={() => {
            setNameDraft(username ?? displayName);
            setNameOpen(true);
          }}
          className="mt-3 flex items-center gap-2"
        >
          <span className="font-display text-2xl font-extrabold tracking-tight">{displayName}</span>
          <Icon name="edit" size={15} className="text-white/45" />
        </button>
        {email && <p className="mt-0.5 text-[13px] text-white/45">{email}</p>}
        <div className="mt-3">
          {premium ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8F04A] px-3.5 py-1.5 text-xs font-extrabold tracking-wide text-[#020B0A]">
              <Icon name="star" size={13} /> PREMIUM
            </span>
          ) : (
            <Link
              href="/premium"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C8F04A] px-3.5 py-1.5 text-xs font-extrabold tracking-wide text-[#C8F04A]"
            >
              <Icon name="star" size={13} /> GO PREMIUM
            </Link>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        {!isSupabaseConfigured ? (
          <p className="text-sm text-white/55">{t("auth.notConfigured")}</p>
        ) : email ? (
          <>
            <p className="text-xs text-white/40">{t("auth.signedInAs")}</p>
            <p className="mt-0.5 truncate text-base font-semibold">{email}</p>
            <button
              onClick={logout}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 py-2.5 text-sm font-semibold text-white/80 hover:border-red-400/50 hover:text-white"
            >
              <Icon name="logout" size={16} /> {t("auth.logout")}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-white/70">{t("auth.loginPrompt")}</p>
            <Link
              href="/login"
              className="mt-3 block rounded-lg bg-[#C8F04A] py-2.5 text-center text-sm font-bold uppercase tracking-wide text-[#020B0A] hover:bg-[#D8FB6A]"
            >
              {t("auth.signIn")}
            </Link>
          </>
        )}
      </div>

      {/* Settings */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4">
        <div className="flex items-center gap-3 py-3.5">
          <Icon name="bell" className="text-white/55" />
          <span className="flex-1 text-sm">{t("profile.notifications")}</span>
          <button
            onClick={toggleNotif}
            aria-label="Toggle notifications"
            className={`relative h-6 w-11 rounded-full transition-colors ${notif ? "bg-[#C8F04A]" : "bg-white/15"}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${notif ? "left-[22px]" : "left-0.5"}`} />
          </button>
        </div>
        <div className="flex items-center gap-3 border-t border-white/[0.06] py-3.5">
          <Icon name="globe" className="text-white/55" />
          <span className="flex-1 text-sm">{t("profile.language")}</span>
          <LanguageSwitcher />
        </div>
        <Link href="/premium" className="flex items-center gap-3 border-t border-white/[0.06] py-3.5">
          <Icon name="trophy" className="text-white/55" />
          <span className="flex-1 text-sm">{t("premium.title")}</span>
          <Icon name="chevron" size={16} className="text-white/30" />
        </Link>
        <div className="flex items-center gap-3 border-t border-white/[0.06] py-3.5">
          <Icon name="info" className="text-white/55" />
          <span className="flex-1 text-sm">{t("profile.about")}</span>
          <span className="text-[13px] text-white/40">Oddvice · v1.0.0</span>
        </div>
      </div>

      <InstallPrompt />

      {/* Responsible gambling */}
      <div className="rounded-2xl border border-[#FCD34D]/25 bg-[#FCD34D]/[0.06] p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-[#FCD34D] px-1.5 py-0.5 text-[11px] font-black text-[#020B0A]">18+</span>
          <span className="text-sm font-semibold">{t("profile.rgTitle")}</span>
        </div>
        <p className="text-xs leading-relaxed text-white/60">{t("profile.rgText")}</p>
        <a
          href={t("profile.rgHelpUrl")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-[#FCD34D]"
        >
          {t("profile.rgHelp")} ↗
        </a>
      </div>

      {/* Server status */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">{t("profile.serverStatus")}</span>
          <span className={`ml-auto h-2 w-2 rounded-full ${statusDot}`} />
          <span className="text-white/70">{statusLabel}</span>
        </div>
        <p className="mt-1.5 text-[11px] text-white/35">{API_URL.replace(/^https?:\/\//, "")}</p>
      </div>

      {/* Avatar picker */}
      {avatarOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center"
          onClick={() => setAvatarOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl border border-white/10 bg-[#08110F] p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-widest text-white/40">Choose avatar</p>
            <div className="flex gap-2">
              <input
                value={pq}
                onChange={(e) => setPq(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                placeholder="Search a player…"
                className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-[#C8F04A]"
              />
              <button onClick={runSearch} className="shrink-0 rounded-lg bg-[#C8F04A] px-4 text-sm font-bold text-[#020B0A]">
                Go
              </button>
            </div>
            {searching && <p className="mt-3 text-center text-sm text-white/50">Searching…</p>}
            {!searching && results.length > 0 && (
              <div className="mt-4 flex max-h-44 flex-wrap justify-center gap-3 overflow-y-auto">
                {results.map((p) => (
                  <button key={p.id} onClick={() => p.photo && saveAvatar(p.photo)} className="w-16 text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.photo} alt="" className="mx-auto h-14 w-14 rounded-full bg-white/5 object-cover" />
                    <span className="mt-1 block truncate text-[10px] text-white/70">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
            <p className="my-4 text-center text-[11px] text-white/30">or pick an avatar</p>
            <div className="flex flex-wrap justify-center gap-4 pb-1">
              {AVATARS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => saveAvatar(a.key)}
                  className={`rounded-full ${avatar === a.key ? "ring-2 ring-[#C8F04A] ring-offset-2 ring-offset-[#08110F]" : ""}`}
                >
                  <Avatar value={a.key} name={displayName} size={56} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Name editor */}
      {nameOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6" onClick={() => setNameOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#08110F] p-5" onClick={(e) => e.stopPropagation()}>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/45">Username</p>
            <input
              autoFocus
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              placeholder="Your name"
              className="w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#C8F04A]"
            />
            <div className="mt-4 flex gap-2.5">
              <button onClick={() => setNameOpen(false)} className="flex-1 rounded-lg border border-white/15 py-2.5 text-sm font-semibold">
                Cancel
              </button>
              <button onClick={saveName} className="flex-1 rounded-lg bg-[#C8F04A] py-2.5 text-sm font-bold text-[#020B0A]">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
