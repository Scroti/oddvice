import type { Group } from "@/lib/api";

/** Presentational standings table for a single group (server-compatible). */
export function StandingsTable({ group }: { group: Group }) {
  return (
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
          <tr key={row.position} className="border-t border-white/[0.06]">
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
              {row.goalDifference > 0
                ? `+${row.goalDifference}`
                : row.goalDifference}
            </td>
            <td className="py-2 text-center font-bold tabular-nums text-[#C8F04A]">
              {row.points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
