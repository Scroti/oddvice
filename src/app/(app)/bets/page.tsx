import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { TipCard } from "@/components/tip-card";
import { getTips, type MatchTips } from "@/lib/api";

export const metadata = { title: "Tips" };
export const dynamic = "force-dynamic";

export default async function BetsPage() {
  const t = await getTranslations("bets");

  let bundles: MatchTips[] = [];
  let failed = false;
  try {
    bundles = (await getTips()).tips;
  } catch {
    failed = true;
  }

  return (
    <div>
      <PageHeader subtitle={t("subtitle")} />

      <Link
        href="/premium"
        className="mb-6 flex items-center gap-3 rounded-2xl border border-[#C8F04A]/25 bg-gradient-to-br from-[#C8F04A]/15 to-transparent p-4 transition hover:border-[#C8F04A]/40"
      >
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#C8F04A]/15 text-[#C8F04A]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#C8F04A]">
            {t("bannerTitle")}
          </p>
          <p className="truncate text-[13px] text-white/60">{t("bannerText")}</p>
        </div>
        <span className="shrink-0 text-[#C8F04A]">→</span>
      </Link>

      {failed ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/60">
          {t("couldntLoad")}
        </div>
      ) : bundles.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/60">
          {t("none")}
        </div>
      ) : (
        <div className="space-y-4">
          {bundles.map((b) => (
            <TipCard key={b.matchId} bundle={b} />
          ))}
        </div>
      )}
    </div>
  );
}
