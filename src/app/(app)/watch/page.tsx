import { PageHeader, ComingSoon } from "@/components/page-header";

export const metadata = { title: "Watch" };

export default function WatchPage() {
  return (
    <div>
      <PageHeader subtitle="Unde poți urmări meciurile — TV și online." />
      <ComingSoon note="Aici vei vedea unde se transmite fiecare meci (posturi TV și platforme), în funcție de regiune." />
    </div>
  );
}
