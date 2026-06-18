import { MatchList } from "@/components/match-list";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Meciuri" };

export default function MatchesPage() {
  return (
    <div>
      <PageHeader subtitle="Toate meciurile Cupei Mondiale 2026." />
      <MatchList />
    </div>
  );
}
