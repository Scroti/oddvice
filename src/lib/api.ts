/** Base URL of the Oddvice Go API. Override with NEXT_PUBLIC_API_URL. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type HealthResponse = {
  status: string;
  service: string;
  time: string;
};

/** Calls the API health endpoint. Throws on network or non-2xx errors. */
export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const res = await fetch(`${API_URL}/healthz`, {
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<HealthResponse>;
}

export type Match = {
  id: string;
  name: string;
  league: string;
  season: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  venue?: string;
  kickoffAt: string | null;
  thumbnail?: string;
  homeBadge?: string;
  awayBadge?: string;
  video?: string;
};

export type MatchSearchResponse = {
  query: string;
  count: number;
  matches: Match[];
};

/** Fetches a single match by id. Returns null on 404. */
export async function getMatch(id: string): Promise<Match | null> {
  const res = await fetch(
    `${API_URL}/api/v1/football/matches/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<Match>;
}

async function fetchMatches(path: string): Promise<MatchSearchResponse> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<MatchSearchResponse>;
}

/** All matches of the competition (e.g. the whole World Cup). */
export function getMatches(): Promise<MatchSearchResponse> {
  return fetchMatches(`/api/v1/football/matches`);
}

/** Upcoming (not yet played) matches, soonest first. */
export function getUpcoming(): Promise<MatchSearchResponse> {
  return fetchMatches(`/api/v1/football/matches/upcoming`);
}

/** Finished matches, most recent first. */
export function getResults(): Promise<MatchSearchResponse> {
  return fetchMatches(`/api/v1/football/matches/results`);
}

export type Standing = {
  position: number;
  team: string;
  crest: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalDifference: number;
  points: number;
};

export type Group = { name: string; table: Standing[] };

export type StandingsResponse = { count: number; groups: Group[] };

/** Group standings tables for the competition. */
export async function getStandings(): Promise<StandingsResponse> {
  const res = await fetch(`${API_URL}/api/v1/football/standings`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<StandingsResponse>;
}

export type Article = {
  id: string;
  title: string;
  link: string;
  source: string;
  summary: string;
  image?: string;
  publishedAt: string | null;
};

export type NewsResponse = {
  count: number;
  articles: Article[];
};

/** Fetches the latest news for a language (always fresh). */
export async function getNews(lang?: string): Promise<NewsResponse> {
  const q = lang ? `?lang=${encodeURIComponent(lang)}` : "";
  const res = await fetch(`${API_URL}/api/v1/news${q}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<NewsResponse>;
}

/** Fetches a single article by id (within a language's feed). Null on 404. */
export async function getArticle(
  id: string,
  lang?: string,
): Promise<Article | null> {
  const q = lang ? `?lang=${encodeURIComponent(lang)}` : "";
  const res = await fetch(
    `${API_URL}/api/v1/news/${encodeURIComponent(id)}${q}`,
    { cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<Article>;
}

// ---- Tips (betting advice) -------------------------------------------------

export type TipTier = "free" | "premium";
export type TipRisk = "safe" | "value" | "bold";

export type Tip = {
  id: string;
  tier: TipTier;
  risk: TipRisk;
  market: string;
  selection: string;
  odds: number;
  confidence: number;
  shortReason: string;
  analysis?: string;
  keyFactors?: string[];
  stakeUnits?: number;
};

export type MatchTips = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  matchPreview: string;
  overallConfidence: number;
  tips: Tip[];
  source: string;
  generatedAt: string;
};

export type TipsResponse = { count: number; tips: MatchTips[] };

/** Tips for upcoming matches (the bets feed). */
export async function getTips(): Promise<TipsResponse> {
  const res = await fetch(`${API_URL}/api/v1/tips`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<TipsResponse>;
}

/** Tips for a single match. Returns null on 404. */
export async function getMatchTips(matchId: string): Promise<MatchTips | null> {
  const res = await fetch(
    `${API_URL}/api/v1/tips/${encodeURIComponent(matchId)}`,
    { cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<MatchTips>;
}

// ---- Teams (rich details via api-football) ---------------------------------

export type TeamStats = {
  form: string;
  formation?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  failedToScore: number;
  yellowCards: number;
  redCards: number;
};

export type Team = {
  id: number;
  name: string;
  code?: string;
  country?: string;
  logo?: string;
  founded?: number;
};

export type TeamDetail = Team & { stats?: TeamStats };

/** Resolves a team's detail (form, cards, goals) by name. Null when unknown. */
export async function getTeamByName(name: string): Promise<TeamDetail | null> {
  const res = await fetch(
    `${API_URL}/api/v1/teams/by-name?name=${encodeURIComponent(name)}`,
    { cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<TeamDetail>;
}

export type LineupPlayer = {
  id?: number;
  name: string;
  number?: number;
  pos?: string; // "G" | "D" | "M" | "F"
  grid?: string; // "row:col"
  photo?: string;
};

export type Lineup = {
  teamId: number;
  teamName: string;
  formation: string;
  coach?: string;
  coachPhoto?: string;
  startXI: LineupPlayer[];
  substitutes?: LineupPlayer[];
};

export type MatchLineups = { home: Lineup | null; away: Lineup | null };

export type LiveMatch = {
  fixtureId: number;
  home: string;
  away: string;
  homeLogo?: string;
  awayLogo?: string;
  homeGoals: number;
  awayGoals: number;
  elapsed: number;
  status: string; // 1H, HT, 2H, ET, P, …
};

export type LiveResponse = { count: number; matches: LiveMatch[] };

/** Currently in-play matches (poll this ~30s for a live scoreboard). */
export async function getLive(): Promise<LiveResponse> {
  const res = await fetch(`${API_URL}/api/v1/live`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<LiveResponse>;
}

export type MatchEvent = {
  minute: number;
  extra?: number;
  team: string;
  type: string; // "Goal" | "Card" | "subst" | "Var"
  detail: string;
  player?: string;
  assist?: string;
  commentary?: string; // AI one-liner, when available
};

export type EventsResponse = { count: number; events: MatchEvent[] };

/** Match timeline (goals, cards, subs) for a fixture by names + date. */
export async function getEvents(
  home: string,
  away: string,
  date: string,
): Promise<EventsResponse> {
  const qs = new URLSearchParams({ home, away, date }).toString();
  const res = await fetch(`${API_URL}/api/v1/events?${qs}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<EventsResponse>;
}

/** Match timeline for a known api-football fixture id (used for live matches).
 * lang requests AI commentary lines in that language. */
export async function getEventsByFixture(
  fixtureId: number,
  lang?: string,
): Promise<EventsResponse> {
  const q = new URLSearchParams({ fixture: String(fixtureId) });
  if (lang) q.set("lang", lang);
  const res = await fetch(`${API_URL}/api/v1/events?${q.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<EventsResponse>;
}

export type MatchStatLine = { type: string; home: string; away: string };
export type MatchStats = { lines: MatchStatLine[] | null };

/** Per-team match statistics (possession, shots, …). null/empty pre-match. */
export async function getMatchStats(
  home: string,
  away: string,
  date: string,
): Promise<MatchStats | null> {
  const qs = new URLSearchParams({ home, away, date }).toString();
  const res = await fetch(`${API_URL}/api/v1/match-stats?${qs}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<MatchStats>;
}

/** Confirmed starting XIs for a fixture (by team names + YYYY-MM-DD date).
 * Returns null on error; home/away are null until lineups are available. */
export async function getLineups(
  home: string,
  away: string,
  date: string,
): Promise<MatchLineups | null> {
  const qs = new URLSearchParams({ home, away, date }).toString();
  const res = await fetch(`${API_URL}/api/v1/lineups?${qs}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json() as Promise<MatchLineups>;
}

export type PlayerHit = {
  id: number;
  name: string;
  photo?: string;
  team?: string;
  nationality?: string;
};

/** Search footballers by name (DB-backed; empty for queries under 3 chars). */
export async function searchPlayers(q: string): Promise<PlayerHit[]> {
  if (q.trim().length < 3) return [];
  try {
    const res = await fetch(
      `${API_URL}/api/v1/players/search?q=${encodeURIComponent(q.trim())}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { players?: PlayerHit[] };
    return data.players ?? [];
  } catch {
    return [];
  }
}
