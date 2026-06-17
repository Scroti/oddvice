import { PageHeader } from "@/components/page-header";
import { NewsCard } from "@/components/news-card";
import { getNews } from "@/lib/api";

export const metadata = { title: "Știri" };
// Fetch per request (the feed is external) and avoid build-time API calls.
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  let articles;
  try {
    const data = await getNews();
    articles = data.articles;
  } catch {
    return (
      <div>
        <PageHeader subtitle="Noutăți despre Cupa Mondială 2026." />
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          Nu am putut încărca știrile momentan. Încearcă din nou mai târziu.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader subtitle="Noutăți despre Cupa Mondială 2026." />

      {articles.length === 0 ? (
        <p className="text-sm text-white/60">Nicio știre disponibilă.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
