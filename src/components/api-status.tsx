"use client";

import { useEffect, useState } from "react";
import { API_URL, getHealth } from "@/lib/api";

type State =
  | { kind: "loading" }
  | { kind: "online"; service: string }
  | { kind: "offline" };

/** Live badge showing whether the Go API is reachable. */
export function ApiStatus() {
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
      ? `API online (${state.service})`
      : state.kind === "offline"
        ? "API unreachable"
        : "Checking API…";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-sm">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      <span>{label}</span>
      <code className="text-xs text-white/50">{API_URL}</code>
    </div>
  );
}
