"use client";

import { useState } from "react";
import type { Group } from "@/lib/api";

/** Group standings with a tab per group. */
export function StandingsTabs({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState(0);
  if (groups.length === 0) return null;

  const group = groups[active] ?? groups[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      {/* Group tabs */}
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

      {/* Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-white/35">
            <th className="py-1.5 text-left font-medium">#</th>
            <th className="py-1.5 text-left font-medium">Echipă</th>
            <th className="py-1.5 text-center font-medium">J</th>
            <th className="py-1.5 text-center font-medium">GD</th>
            <th className="py-1.5 text-center font-medium">Pct</th>
          </tr>
        </thead>
        <tbody>
          {group.table.map((row) => (
            <tr
              key={row.position}
              className="border-t border-white/[0.06]"
            >
              <td className="py-2 text-white/40">{row.position}</td>
              <td className="py-2">
                <span className="flex items-center gap-2">
                  {row.crest ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={row.crest}
                      alt={row.team}
                      width={20}
                      height={20}
                      referrerPolicy="no-referrer"
                      className="h-5 w-5 shrink-0 object-contain"
                    />
                  ) : null}
                  <span className="truncate font-medium">{row.team}</span>
                </span>
              </td>
              <td className="py-2 text-center tabular-nums text-white/60">
                {row.played}
              </td>
              <td className="py-2 text-center tabular-nums text-white/60">
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className="py-2 text-center font-bold tabular-nums text-[#C8F04A]">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
