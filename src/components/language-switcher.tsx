"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_NAMES } from "@/i18n/locales";

/** Language selector: writes the `locale` cookie and refreshes server data. */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    document.cookie = `locale=${e.target.value}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <select
      value={locale}
      onChange={onChange}
      aria-label="Language"
      className="rounded-lg border border-white/15 bg-[#020B0A] px-3 py-1.5 text-sm outline-none focus:border-[#C8F04A]"
    >
      {LOCALES.map((l) => (
        <option key={l} value={l}>
          {LOCALE_NAMES[l]}
        </option>
      ))}
    </select>
  );
}
