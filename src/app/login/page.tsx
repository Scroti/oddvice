"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });
    const { error } = await fn;
    setBusy(false);
    if (error) {
      setError(error.message || t("error"));
      return;
    }
    router.push("/profile");
    router.refresh();
  }

  async function oauth(provider: "google" | "apple") {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-[#020B0A] px-5 text-white">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image src="/logo.svg" alt="Oddvice" width={36} height={36} unoptimized />
          <span className="font-display text-xl font-extrabold uppercase tracking-tight">
            Oddvice
          </span>
        </Link>

        <h1 className="mb-6 text-center font-display text-2xl font-extrabold uppercase tracking-tight">
          {mode === "signin" ? t("signInTitle") : t("signUpTitle")}
        </h1>

        {!isSupabaseConfigured ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center text-sm text-white/60">
            {t("notConfigured")}
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => oauth("google")}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
              >
                {t("google")}
              </button>
              <button
                onClick={() => oauth("apple")}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/5"
              >
                {t("apple")}
              </button>
            </div>

            <div className="my-4 flex items-center gap-3 text-xs text-white/30">
              <span className="h-px flex-1 bg-white/10" />
              {t("or")}
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                className="rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-[#C8F04A]"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                className="rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm outline-none focus:border-[#C8F04A]"
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-[#C8F04A] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-[#020B0A] hover:bg-[#D8FB6A] disabled:opacity-50"
              >
                {mode === "signin" ? t("signIn") : t("signUp")}
              </button>
            </form>

            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-4 w-full text-center text-sm text-white/55 hover:text-white"
            >
              {mode === "signin" ? t("noAccount") : t("haveAccount")}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
