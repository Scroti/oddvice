"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { API_URL, getHealth } from "@/lib/api";

type State =
  | { kind: "loading" }
  | { kind: "online"; service: string }
  | { kind: "offline" };

/** Live badge showing whether the Go API is reachable. */
export function ApiStatus() {
  const t = useTranslations("apiStatus");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    getHealth(controller.signal)
      .then((h) => setState({ kind: "online", service: h.service }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ kind: "offline" });
      });
    return () => controller.abort();
  }, []);

  const dot =
    state.kind === "online"
      ? "bg-green-500"
      : state.kind === "offline"
        ? "bg-red-500"
        : "bg-yellow-500 animate-pulse";

  const label =
    state.kind === "online"
      ? `${t("online")} (${state.service})`
      : state.kind === "offline"
        ? t("offline")
        : t("checking");

  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm">
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <span className="whitespace-nowrap">{label}</span>
      <code className="hidden truncate text-xs text-white/50 sm:inline">
        {API_URL}
      </code>
    </div>
  );
}
