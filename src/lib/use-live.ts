"use client";

import { useEffect, useState } from "react";
import { getLive } from "@/lib/api";

/** Polls the live endpoint ~30s; true when any match is in play. */
export function useHasLive(): boolean {
  const [has, setHas] = useState(false);
  useEffect(() => {
    let active = true;
    const load = () =>
      getLive()
        .then((r) => active && setHas(r.matches.length > 0))
        .catch(() => {});
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);
  return has;
}
