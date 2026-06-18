import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { InstallPrompt } from "@/components/pwa";
import { ApiStatus } from "@/components/api-status";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Account } from "@/components/account";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const t = await getTranslations("profile");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader subtitle={t("subtitle")} />

      <Account />

      {/* Language */}
      <div className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
        <span className="text-sm font-medium">{t("language")}</span>
        <LanguageSwitcher />
      </div>

      <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
        {[t("account"), t("notifications"), t("preferences"), t("about")].map(
          (item) => (
            <li
              key={item}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <span>{item}</span>
              <span className="text-white/30">›</span>
            </li>
          ),
        )}
      </ul>

      <InstallPrompt />

      {/* Responsible gambling */}
      <div className="rounded-xl border border-[#C8F04A]/25 bg-[#C8F04A]/5 p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-[#C8F04A] px-1.5 py-0.5 text-[11px] font-extrabold text-[#020B0A]">
            18+
          </span>
          <span className="text-sm font-semibold">{t("rgTitle")}</span>
        </div>
        <p className="text-xs leading-relaxed text-white/55">{t("rgText")}</p>
        <a
          href={t("rgHelpUrl")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-semibold text-[#C8F04A]"
        >
          {t("rgHelp")} ↗
        </a>
      </div>

      <div className="flex items-center justify-between text-xs text-white/40">
        <span>{t("serverStatus")}</span>
        <ApiStatus />
      </div>
    </div>
  );
}
