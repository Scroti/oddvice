import { getTranslations } from "next-intl/server";
import { PremiumDemoButton } from "@/components/premium-demo-button";

export const metadata = { title: "Premium" };

export default async function PremiumPage() {
  const t = await getTranslations("premium");
  const features = [t("f1"), t("f2"), t("f3"), t("f4"), t("f5"), t("f6")];

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-[#C8F04A]/15 text-[#C8F04A]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l2.4 5.6L20 11l-5.6 2.4L12 19l-2.4-5.6L4 11l5.6-2.4z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-extrabold uppercase">{t("title")}</h1>
        <p className="mt-1 text-sm text-white/55">{t("subtitle")}</p>
      </div>

      <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
          {t("free")}
        </p>
        <p className="mt-1 text-sm text-white/65">{t("freeText")}</p>
      </div>

      <div className="rounded-2xl border border-[#C8F04A]/25 bg-gradient-to-br from-[#C8F04A]/10 to-transparent p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#C8F04A]">
          {t("features")}
        </p>
        <ul className="mt-3 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm text-white/80">
              <span className="mt-0.5 text-[#C8F04A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <PremiumDemoButton />
      </div>
    </div>
  );
}
