import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { Cover } from "@/components/ui/Cover";
import { DemoNotice } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { articles } from "@/data/articles";
import { fa, formatDate } from "@/lib/format";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = api.articles.bySlug(slug);
  return a ? { title: a.title, description: a.excerpt, openGraph: { type: "article", title: a.title } } : { title: "یافت نشد" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = api.articles.bySlug(slug);
  if (!article) notFound();
  const related = api.articles.list().filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <>
      <article className="container max-w-3xl py-10 sm:py-14">
        <nav aria-label="مسیر" className="mb-6 text-xs text-navy-500">
          <Link href="/articles" className="hover:text-brand-700">
            مقالات
          </Link>{" "}
          / {article.category}
        </nav>
        <header>
          <p className="eyebrow">{article.category}</p>
          <h1 className="mt-3 text-2xl font-extrabold leading-snug sm:text-4xl sm:leading-snug">{article.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-500">
            <span>{article.author}</span>
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden />
              {fa(article.readingMinutes)} دقیقه مطالعه
            </span>
          </div>
        </header>
        <Cover title={article.title} tone={article.tone} type="article" showTitle={false} className="mt-8 aspect-[2/1] rounded-2xl" />
        <div className="mt-8 space-y-5 text-[15px] leading-9 text-navy-700 sm:text-base">
          <p className="text-lg font-medium leading-9 text-navy-800">{article.excerpt}</p>
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <DemoNotice className="mt-10">
          این مقاله ساختگی و صرفاً برای نمایش طراحی است و توصیه پزشکی تأییدشده محسوب نمی‌شود. برای تصمیم‌های درمانی با پزشک مشورت
          کنید.
        </DemoNotice>
      </article>

      <section className="section bg-surface">
        <div className="container">
          <h2 className="mb-6 text-xl font-extrabold">مقالات مرتبط</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
