"use client";

import { useTranslations } from "next-intl";

/** Persistent legal/responsible-gambling note shown at the bottom of pages. */
export function ResponsibleFooter() {
  const t = useTranslations("footer");
  return (
    <footer className="mx-auto mt-10 w-full max-w-xl border-t border-white/10 pt-4 text-center text-[11px] leading-relaxed text-white/35">
      <p>{t("disclaimer")}</p>
      <a
        href={t("helpUrl")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-[#C8F04A]/70 hover:text-[#C8F04A]"
      >
        {t("help")}
      </a>
    </footer>
  );
}
