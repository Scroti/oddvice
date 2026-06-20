"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Article } from "@/lib/api";
import { formatDate, cleanTitle } from "@/lib/format";

export function NewsCard({ article }: { article: Article }) {
  const t = useTranslations("common");
  const date = formatDate(article.publishedAt);
  const title = cleanTitle(article.title, article.source);

  return (
    <Link
      href={`/news/${article.id}`}
      prefetch={false}
      className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:-translate-y-0.5 hover:border-[#C8F04A]/50 hover:bg-white/[0.04]"
    >
      {article.image && (
        <img
          src={article.image}
          alt=""
          className="mb-3 aspect-[16/9] w-full rounded-lg object-cover"
        />
      )}
      <div className="mb-2 flex items-center gap-2 text-xs text-white/45">
        {article.source && (
          <span className="rounded-full bg-[#C8F04A]/15 px-2 py-0.5 font-medium text-[#C8F04A]">
            {article.source}
          </span>
        )}
        {date && <span>{date}</span>}
      </div>

      <h3 className="line-clamp-3 font-medium leading-snug transition-colors group-hover:text-white">
        {title}
      </h3>

      {article.summary && (
        <p className="mt-2 line-clamp-2 text-sm text-white/55">
          {article.summary}
        </p>
      )}

      <span className="mt-3 text-xs font-medium text-[#C8F04A]">
        {t("read")} →
      </span>
    </Link>
  );
}
