"use client";

import { useState } from "react";
import type { LineupPlayer } from "@/lib/api";

// A pitch showing both teams. With real lineup data it places named players by
// their grid position; otherwise it renders the formation shape with role
// labels (GK/DF/MF/FW). Home is lime (bottom), away blue (top).

const DEFAULT: number[] = [4, 3, 3];

function parseFormation(f?: string): number[] {
  if (!f) return DEFAULT;
  const rows = f
    .split("-")
    .map((n) => parseInt(n, 10))
    .filter((n) => Number.isFinite(n) && n > 0 && n <= 6);
  const sum = rows.reduce((a, b) => a + b, 0);
  return rows.length >= 2 && sum >= 6 && sum <= 10 ? rows : DEFAULT;
}

function roleFor(lineIdx: number, formationRows: number): string {
  if (lineIdx === 0) return "GK";
  const fIdx = lineIdx - 1;
  if (fIdx === 0) return "DF";
  if (fIdx === formationRows - 1) return "FW";
  return "MF";
}

function posLabel(pos?: string): string {
  switch ((pos ?? "").toUpperCase()) {
    case "G":
      return "GK";
    case "D":
      return "DF";
    case "M":
      return "MF";
    case "F":
      return "FW";
    default:
      return "";
  }
}

function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1];
  return last.replace(".", "").length <= 1 ? name : last;
}

type Dot = {
  x: number;
  y: number;
  role: string;
  number?: number;
  name?: string;
  photo?: string;
};

// y-range each side occupies (GK near its own goal, attackers near the centre).
function yFor(side: "home" | "away", frac: number): number {
  const [near, far] = side === "home" ? [94, 54] : [6, 46];
  return near + frac * (far - near);
}

function schematicDots(formation: number[], side: "home" | "away"): Dot[] {
  const lines = [1, ...formation]; // GK + outfield rows
  const L = lines.length;
  const dots: Dot[] = [];
  for (let i = 0; i < L; i++) {
    const n = lines[i];
    const y = yFor(side, L === 1 ? 0 : i / (L - 1));
    for (let k = 0; k < n; k++) {
      dots.push({ x: ((k + 1) / (n + 1)) * 100, y, role: roleFor(i, formation.length) });
    }
  }
  return dots;
}

// Real players placed by their "row:col" grid. Returns null if grids are missing.
function lineupDots(players: LineupPlayer[], side: "home" | "away"): Dot[] | null {
  if (!players.length) return null;
  const rows = new Map<number, LineupPlayer[]>();
  for (const p of players) {
    const [r, c] = (p.grid ?? "").split(":").map((n) => parseInt(n, 10));
    if (!Number.isFinite(r) || !Number.isFinite(c)) return null; // can't place precisely
    if (!rows.has(r)) rows.set(r, []);
    rows.get(r)!.push(p);
  }
  const rowKeys = [...rows.keys()].sort((a, b) => a - b);
  const R = rowKeys.length;
  const dots: Dot[] = [];
  rowKeys.forEach((rk, idx) => {
    const line = rows
      .get(rk)!
      .slice()
      .sort((a, b) => parseInt(a.grid!.split(":")[1], 10) - parseInt(b.grid!.split(":")[1], 10));
    const y = yFor(side, R === 1 ? 0 : idx / (R - 1));
    line.forEach((p, k) => {
      dots.push({
        x: ((k + 1) / (line.length + 1)) * 100,
        y,
        role: posLabel(p.pos),
        number: p.number,
        name: shortName(p.name),
        photo: p.photo,
      });
    });
  });
  return dots;
}

function PlayerDot({ d, side }: { d: Dot; side: "home" | "away" }) {
  const [photoOk, setPhotoOk] = useState(Boolean(d.photo));
  const inCircle = d.number ? String(d.number) : d.role;
  const ring = side === "home" ? "ring-[#C8F04A]" : "ring-sky-400";
  const badge =
    side === "home" ? "bg-[#C8F04A] text-[#020B0A]" : "bg-sky-400 text-[#041016]";
  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${d.x}%`, top: `${d.y}%` }}
    >
      {photoOk && d.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={d.photo}
          alt={d.name ?? ""}
          width={28}
          height={28}
          referrerPolicy="no-referrer"
          onError={() => setPhotoOk(false)}
          className={`h-7 w-7 rounded-full bg-[#0a2c22] object-cover ring-2 ${ring}`}
        />
      ) : (
        <div
          className={`grid h-6 w-6 place-items-center rounded-full text-[8px] font-extrabold shadow ${badge}`}
        >
          {inCircle}
        </div>
      )}
      {d.name && (
        <span
          className="mt-0.5 max-w-[64px] truncate text-[8px] font-semibold text-white"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.85)" }}
        >
          {d.name}
        </span>
      )}
    </div>
  );
}

export function Pitch({
  homeName,
  awayName,
  homeFormation,
  awayFormation,
  homePlayers,
  awayPlayers,
}: {
  homeName: string;
  awayName: string;
  homeFormation?: string;
  awayFormation?: string;
  homePlayers?: LineupPlayer[];
  awayPlayers?: LineupPlayer[];
}) {
  const home = parseFormation(homeFormation);
  const away = parseFormation(awayFormation);
  const homeDots =
    (homePlayers && lineupDots(homePlayers, "home")) || schematicDots(home, "home");
  const awayDots =
    (awayPlayers && lineupDots(awayPlayers, "away")) || schematicDots(away, "away");
  const fmt = (r: number[]) => r.join("-");

  return (
    <div>
      {/* Legend */}
      <div className="mb-2 flex items-center justify-between text-[11px]">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400" />
          <span className="truncate font-semibold">{awayName}</span>
          <span className="shrink-0 text-white/40">{awayFormation || fmt(away)}</span>
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 text-white/40">{homeFormation || fmt(home)}</span>
          <span className="truncate font-semibold">{homeName}</span>
          <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-[#C8F04A]" />
        </span>
      </div>

      {/* Pitch */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-[#0e3b2e] to-[#0a2c22]">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 8%, transparent 8% 16%)",
          }}
        />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
        <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30" />
        <div className="absolute left-1/2 top-0 h-[14%] w-[55%] -translate-x-1/2 rounded-b-md border border-t-0 border-white/20" />
        <div className="absolute bottom-0 left-1/2 h-[14%] w-[55%] -translate-x-1/2 rounded-t-md border border-b-0 border-white/20" />

        {awayDots.map((d, i) => (
          <PlayerDot key={`a${i}`} d={d} side="away" />
        ))}
        {homeDots.map((d, i) => (
          <PlayerDot key={`h${i}`} d={d} side="home" />
        ))}
      </div>
    </div>
  );
}
