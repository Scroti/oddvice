import { PageHeader, ComingSoon } from "@/components/page-header";

export const metadata = { title: "Ponturi" };

export default function BetsPage() {
  return (
    <div>
      <PageHeader
        title="Ponturi"
        subtitle="Predicții și sfaturi de pariere pe meciuri."
      />
      <ComingSoon note="Aici vor apărea ponturile zilei, cu cote și nivel de încredere." />
    </div>
  );
}
