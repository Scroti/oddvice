import { PageHeader } from "@/components/page-header";
import { MatchCard } from "@/components/match-card";
import { getUpcoming, type Match } from "@/lib/api";

export const metadata = { title: "Watch" };
export const dynamic = "force-dynamic";

export default async function WatchPage() {
  let matches: Match[] = [];
  try {
    matches = (await getUpcoming()).matches;
  } catch {
    matches = [];
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <PageHeader subtitle="Meciuri care urmează — unde le poți urmări." />

      {matches.length === 0 ? (
        <p className="rounded-xl border border-white/10 p-6 text-center text-sm text-white/60">
          Niciun meci programat momentan.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}

      <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/45">
        Transmisiunile TV/online diferă în funcție de regiune. Integrarea cu
        posturile și platformele oficiale urmează.
      </p>
    </div>
  );
}
