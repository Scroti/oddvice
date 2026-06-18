import { getTranslations } from "next-intl/server";
import { PageHeader, ComingSoon } from "@/components/page-header";

export const metadata = { title: "Tips" };

export default async function BetsPage() {
  const t = await getTranslations("bets");
  return (
    <div>
      <PageHeader subtitle={t("subtitle")} />
      <ComingSoon note={t("comingSoon")} />
    </div>
  );
}
