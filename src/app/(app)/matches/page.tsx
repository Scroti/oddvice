import { MatchSearch } from "@/components/match-search";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Meciuri" };

export default function MatchesPage() {
  return (
    <div>
      <PageHeader subtitle="Caută un meci după nume." />
      <MatchSearch />
    </div>
  );
}
