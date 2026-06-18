"use client";

import { useState } from "react";
import type { Group } from "@/lib/api";
import { StandingsTable } from "@/components/standings-table";

/** Group standings with a tab per group. */
export function StandingsTabs({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState(0);
  if (groups.length === 0) return null;

  const group = groups[active] ?? groups[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {groups.map((g, i) => (
          <button
            key={g.name}
            type="button"
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors ${
              i === active
                ? "bg-[#C8F04A] text-[#020B0A]"
                : "border border-white/15 text-white/55 hover:text-white"
            }`}
          >
            {g.name.replace("Grupa ", "")}
          </button>
        ))}
      </div>

      <StandingsTable group={group} />
    </div>
  );
}
