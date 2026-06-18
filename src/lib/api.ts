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
  publishedAt: string | null;
};

export type NewsResponse = {
  count: number;
  articles: Article[];
};

/** Fetches the latest news from the API (always fresh). */
export async function getNews(): Promise<NewsResponse> {
  const res = await fetch(`${API_URL}/api/v1/news`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<NewsResponse>;
}

/** Fetches a single article by id. Returns null on 404. */
export async function getArticle(id: string): Promise<Article | null> {
  const res = await fetch(`${API_URL}/api/v1/news/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<Article>;
}
