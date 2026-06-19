import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getArticle } from "@/lib/api";
import { formatDate, cleanTitle } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("news");
  const locale = await getLocale();

  let article;
  try {
    article = await getArticle(id, locale);
  } catch {
    article = null;
  }

  if (!article) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink label={t("back")} />
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          {t("notFound")}
        </p>
      </div>
    );
  }

  const title = cleanTitle(article.title, article.source);
  const date = formatDate(article.publishedAt);

  return (
    <article className="flex flex-col gap-5">
      <BackLink label={t("back")} />

      <div className="flex items-center gap-2 text-xs text-white/50">
        {article.source && (
          <span className="rounded-full bg-[#C8F04A]/15 px-2 py-0.5 font-medium text-[#C8F04A]">
            {article.source}
          </span>
        )}
        {date && <span>{date}</span>}
      </div>

      <h1 className="text-2xl font-semibold leading-tight">{title}</h1>

      {article.summary && (
        <p className="text-[15px] leading-relaxed text-white/75">
          {article.summary}
        </p>
      )}

      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#C8F04A] px-5 py-2.5 text-sm font-medium text-[#020B0A] transition-colors hover:bg-[#D8FB6A]"
      >
        {t("readOnSite")}
        <span aria-hidden>↗</span>
      </a>

      <p className="text-xs text-white/40">
        {t("redirect", { source: article.source || t("source") })}
      </p>
    </article>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <Link
      href="/news"
      className="inline-flex w-fit items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
    >
      ← {label}
    </Link>
  );
}
