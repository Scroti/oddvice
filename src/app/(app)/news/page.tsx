import { PageHeader, ComingSoon } from "@/components/page-header";

export const metadata = { title: "Știri" };

export default function NewsPage() {
  return (
    <div>
      <PageHeader title="Știri" subtitle="Noutăți din fotbal." />
      <ComingSoon note="Aici vor apărea articole și noutăți relevante pentru pariuri." />
    </div>
  );
}
