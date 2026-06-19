"use client";

import { useTranslations } from "next-intl";
import { usePremium } from "@/lib/use-premium";

/** Local demo toggle that unlocks premium picks (stands in for real billing). */
export function PremiumDemoButton() {
  const t = useTranslations("premium");
  const { premium, setPremium } = usePremium();

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setPremium(!premium)}
        className={`w-full rounded-xl px-4 py-3 text-sm font-extrabold uppercase tracking-wide transition ${
          premium
            ? "border border-white/15 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"
            : "bg-[#C8F04A] text-[#020B0A] hover:bg-[#D8FB6A]"
        }`}
      >
        {premium ? t("deactivate") : t("activate")}
      </button>
      {premium && (
        <p className="mt-2 text-center text-[13px] font-semibold text-[#C8F04A]">
          {t("active")}
        </p>
      )}
      <p className="mt-3 text-center text-[12px] leading-snug text-white/45">{t("note")}</p>
    </div>
  );
}
