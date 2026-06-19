import type { MatchStatLine } from "@/lib/api";

function asPct(v: string): number | null {
  const m = v.match(/^(\d+)\s*%$/);
  return m ? Math.max(0, Math.min(100, parseInt(m[1], 10))) : null;
}

function pretty(t: string): string {
  return t.replace(/_/g, " ");
}

/** Per-team match statistics: a possession bar + a home | label | away grid. */
export function MatchStatsTable({ lines }: { lines: MatchStatLine[] }) {
  const poss = lines.find((l) => l.type === "Ball Possession");
  const ph = poss ? asPct(poss.home) : null;
  const pa = poss ? asPct(poss.away) : null;
  const rows = lines.filter((l) => l.type !== "Ball Possession");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      {poss && ph != null && pa != null && (
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-[12px]">
            <span className="font-semibold tabular-nums text-[#C8F04A]">{poss.home}</span>
            <span className="text-white/45">{pretty(poss.type)}</span>
            <span className="font-semibold tabular-nums text-sky-300">{poss.away}</span>
          </div>
          <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
            <div className="rounded-l-full bg-[#C8F04A]" style={{ width: `${ph}%` }} />
            <div className="flex-1 rounded-r-full bg-sky-400/70" />
          </div>
        </div>
      )}

      <div className="divide-y divide-white/5">
        {rows.map((l) => (
          <div key={l.type} className="grid grid-cols-3 items-center py-1.5 text-[13px]">
            <span className="font-semibold tabular-nums text-[#C8F04A]">{l.home || "–"}</span>
            <span className="text-center text-[11px] capitalize text-white/45">
              {pretty(l.type)}
            </span>
            <span className="text-right font-semibold tabular-nums text-sky-300">
              {l.away || "–"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
