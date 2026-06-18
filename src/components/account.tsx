"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Account card: sign-in prompt when logged out, email + logout when in. */
export function Account() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoaded(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoaded(true);
    });
  }, []);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.refresh();
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/55">
        {t("notConfigured")}
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="h-[68px] animate-pulse rounded-xl border border-white/10 bg-white/[0.02]" />
    );
  }

  if (!email) {
    return (
      <div className="rounded-xl border border-[#C8F04A]/25 bg-[#C8F04A]/5 p-4">
        <p className="mb-3 text-sm text-white/70">{t("loginPrompt")}</p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-[#C8F04A] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-[#020B0A] hover:bg-[#D8FB6A]"
        >
          {t("signIn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
      <div className="min-w-0">
        <p className="text-xs text-white/40">{t("signedInAs")}</p>
        <p className="truncate text-sm font-medium">{email}</p>
      </div>
      <button
        onClick={logout}
        className="shrink-0 rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 hover:border-red-400/50 hover:text-white"
      >
        {t("logout")}
      </button>
    </div>
  );
}
