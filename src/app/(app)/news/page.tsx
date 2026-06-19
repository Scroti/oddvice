import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { NewsCard } from "@/components/news-card";
import { getNews } from "@/lib/api";

export const metadata = { title: "News" };
// Fetch per request (the feed is external) and avoid build-time API calls.
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const t = await getTranslations("news");
  const locale = await getLocale();

  let articles;
  try {
    const data = await getNews(locale);
    articles = data.articles;
  } catch {
    return (
      <div>
        <PageHeader subtitle={t("subtitle")} />
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          {t("couldntLoad")}
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader subtitle={t("subtitle")} />

      {articles.length === 0 ? (
        <p className="text-sm text-white/60">{t("noNews")}</p>
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
