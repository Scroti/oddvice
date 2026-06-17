import Link from "next/link";
import { getArticle } from "@/lib/api";
import { formatDate, cleanTitle } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let article;
  try {
    article = await getArticle(id);
  } catch {
    article = null;
  }

  if (!article) {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        <p className="rounded-xl border border-white/10 p-6 text-sm text-white/60">
          Articolul nu a fost găsit sau nu mai este disponibil.
        </p>
      </div>
    );
  }

  const title = cleanTitle(article.title, article.source);
  const date = formatDate(article.publishedAt);

  return (
    <article className="flex flex-col gap-5">
      <BackLink />

      <div className="flex items-center gap-2 text-xs text-white/50">
        {article.source && (
          <span className="rounded-full bg-[#37F06C]/15 px-2 py-0.5 font-medium text-[#37F06C]">
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
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#37F06C] px-5 py-2.5 text-sm font-medium text-[#020B0A] transition-colors hover:bg-[#5af588]"
      >
        Citește pe site
        <span aria-hidden>↗</span>
      </a>

      <p className="text-xs text-white/40">
        Vei fi redirecționat către {article.source || "sursa originală"}.
      </p>
    </article>
  );
}

function BackLink() {
  return (
    <Link
      href="/news"
      className="inline-flex w-fit items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
    >
      ← Înapoi la știri
    </Link>
  );
}
