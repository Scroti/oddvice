"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "oddvice_premium";
const EVENT = "oddvice-premium-change";

/**
 * Client-side premium flag, backed by localStorage. Real billing/entitlement
 * (via Supabase) replaces this later; for now it's a local demo toggle so the
 * premium gating can be previewed end-to-end. Updates sync across components
 * in the same tab (custom event) and across tabs (storage event).
 */
export function usePremium() {
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const read = () => setPremium(localStorage.getItem(KEY) === "1");
    read();
    window.addEventListener(EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const setValue = useCallback((v: boolean) => {
    try {
      localStorage.setItem(KEY, v ? "1" : "0");
    } catch {
      /* ignore (private mode etc.) */
    }
    setPremium(v);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { premium, setPremium: setValue } as const;
}
