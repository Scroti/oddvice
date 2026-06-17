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
};

export type MatchSearchResponse = {
  query: string;
  count: number;
  matches: Match[];
};

/** Searches football matches via the Go API. Throws on non-2xx responses. */
export async function searchMatches(
  query: string,
  signal?: AbortSignal,
): Promise<MatchSearchResponse> {
  const res = await fetch(
    `${API_URL}/api/v1/football/matches/search?q=${encodeURIComponent(query)}`,
    { signal, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<MatchSearchResponse>;
}

export type Article = {
  id: string;
  title: string;
  link: string;
  source: string;
  image: string;
  summary: string;
  publishedAt: string | null;
};

export type NewsResponse = {
  count: number;
  articles: Article[];
};

/** Fetches the latest news. Cached for 5 minutes on the server. */
export async function getNews(): Promise<NewsResponse> {
  const res = await fetch(`${API_URL}/api/v1/news`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<NewsResponse>;
}

/** Fetches a single article by id. Returns null on 404. */
export async function getArticle(id: string): Promise<Article | null> {
  const res = await fetch(
    `${API_URL}/api/v1/news/${encodeURIComponent(id)}`,
    { next: { revalidate: 300 } },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  return res.json() as Promise<Article>;
}
