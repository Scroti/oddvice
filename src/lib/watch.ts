import type { Match } from "@/lib/api";

/** Search URL for where a match can be watched (YouTube is the WC 2026
 * preferred platform; results surface official streams/highlights). */
export function watchUrl(match: Match): string {
  const q = `${match.homeTeam} vs ${match.awayTeam} World Cup 2026`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}
