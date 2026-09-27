import Link from "next/link";
import { Clock } from "lucide-react";
import type { Article } from "@/types";
import { Cover } from "@/components/ui/Cover";
import { fa, formatDate } from "@/lib/format";
import { cn } from "@/lib/format";

export function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const href = `/articles/${article.slug}`;
  return (
    <article
      className={cn(
        "card group flex h-full overflow-hidden transition-shadow hover:shadow-lift",
        featured ? "flex-col lg:flex-row" : "flex-col",
      )}
    >
      <Link href={href} tabIndex={-1} aria-hidden className={cn("block", featured && "lg:w-1/2")}>
        <Cover
          title={article.title}
          tone={article.tone}
          type="article"
          showTitle={false}
          className={cn(featured ? "aspect-[16/9] h-full lg:aspect-auto lg:min-h-[320px]" : "aspect-[16/9]")}
        />
      </Link>
      <div className={cn("flex flex-1 flex-col", featured ? "p-6 sm:p-8" : "p-5")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-500">
          <span className="font-semibold text-teal-700">{article.category}</span>
          <span aria-hidden>•</span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {fa(article.readingMinutes)} دقیقه مطالعه
          </span>
        </div>
        <h3 className={cn("mt-3 font-bold leading-8", featured ? "text-xl sm:text-2xl" : "line-clamp-2 text-base")}>
          <Link href={href} className="hover:text-brand-700">
            {article.title}
          </Link>
        </h3>
        <p className={cn("mt-2 flex-1 text-sm leading-7 text-navy-500", !featured && "line-clamp-3")}>{article.excerpt}</p>
        <Link href={href} className="mt-4 text-sm font-semibold text-brand-700 hover:text-brand-800">
          ادامه مطلب
        </Link>
      </div>
    </article>
  );
}
