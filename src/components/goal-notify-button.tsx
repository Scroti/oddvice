"use client";

import { useState, useEffect } from "react";
import { enablePush, disablePush, isPushEnabled } from "@/lib/push";

export function GoalNotifyButton() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEnabled(isPushEnabled());
  }, []);

  if (typeof window === "undefined" || !("Notification" in window)) return null;

  const toggle = async () => {
    setLoading(true);
    try {
      if (enabled) {
        await disablePush();
        setEnabled(false);
      } else {
        await enablePush();
        setEnabled(true);
      }
    } catch {
      // permission denied or unsupported — silently ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition disabled:opacity-50 ${
        enabled
          ? "border-[#C8F04A]/40 bg-[#C8F04A]/10 text-[#C8F04A]"
          : "border-white/15 bg-white/[0.03] text-white/50 hover:border-white/30 hover:text-white/70"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-[#C8F04A] animate-pulse" : "bg-white/30"}`} />
      {enabled ? "Goal alerts on" : "Notify me on goals"}
    </button>
  );
}
