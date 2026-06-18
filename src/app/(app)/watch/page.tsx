import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { WatchCard } from "@/components/watch-card";
import { getUpcoming, type Match } from "@/lib/api";

export const metadata = { title: "Watch" };
export const dynamic = "force-dynamic";

export default async function WatchPage() {
  const t = await getTranslations("watch");
  let matches: Match[] = [];
  try {
    matches = (await getUpcoming()).matches;
  } catch {
    matches = [];
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <PageHeader subtitle={t("subtitle")} />

      {/* Official live entry point */}
      <a
        href="https://www.fifa.com/fifaplus/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-2xl border border-[#C8F04A]/25 bg-gradient-to-br from-[#C8F04A]/15 to-transparent p-5"
      >
        <div>
          <p className="font-display text-lg font-extrabold uppercase tracking-tight">
            FIFA+
          </p>
          <p className="mt-0.5 text-sm text-white/60">{t("fifaDesc")}</p>
        </div>
        <span className="text-[#C8F04A]">↗</span>
      </a>

      {matches.length > 0 && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">
            {t("upcoming")}
          </h2>
          <div className="flex flex-col gap-2.5">
            {matches.map((m) => (
              <WatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      <p className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-white/45">
        {t("note")}
      </p>
    </div>
  );
}
