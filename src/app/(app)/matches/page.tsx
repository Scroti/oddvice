import { getTranslations } from "next-intl/server";
import { MatchList } from "@/components/match-list";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Matches" };

export default async function MatchesPage() {
  const t = await getTranslations("matches");
  return (
    <div>
      <PageHeader subtitle={t("subtitle")} />
      <MatchList />
    </div>
  );
}
