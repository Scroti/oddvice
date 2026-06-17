import Link from "next/link";
import type { Article } from "@/lib/api";
import { formatDate, cleanTitle } from "@/lib/format";

export function NewsCard({ article }: { article: Article }) {
  const date = formatDate(article.publishedAt);
  const title = cleanTitle(article.title, article.source);

  return (
    <Link
      href={`/news/${article.id}`}
      className="group flex flex-col rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-[#37F06C]/50 hover:bg-white/[0.04]"
    >
      <div className="mb-2 flex items-center gap-2 text-xs text-white/45">
        {article.source && (
          <span className="rounded-full bg-[#37F06C]/15 px-2 py-0.5 font-medium text-[#37F06C]">
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

      <span className="mt-3 text-xs font-medium text-[#37F06C]">Citește →</span>
    </Link>
  );
}
