"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useUser } from "@/lib/use-user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Gates its children behind sign-in: signed-in (or Supabase not configured) →
 * children render normally; signed-out → children are blurred + non-interactive
 * with a centered "sign in" card on top.
 */
export function LoginGate({
  message = "Sign in to unlock",
  children,
}: {
  message?: string;
  children: ReactNode;
}) {
  const { user, loading } = useUser();

  // Not configured, signed in, or still resolving → show normally (no flash).
  if (!isSupabaseConfigured || user || loading) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm">{children}</div>
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-[#020B0A]/85 px-5 py-4 text-center backdrop-blur">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C8F04A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-sm text-white/80">{message}</p>
          <Link
            href="/login"
            className="rounded-lg bg-[#C8F04A] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#020B0A] hover:bg-[#D8FB6A]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
