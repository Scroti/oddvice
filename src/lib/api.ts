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
