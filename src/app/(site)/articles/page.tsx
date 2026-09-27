import type { Metadata } from "next";
import { ArticlesBrowser } from "@/components/cards/ArticlesBrowser";
import { DemoNotice, PageHeader } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { articleCategories } from "@/data/articles";

export const metadata: Metadata = {
  title: "مقالات پزشکی",
  description: "مقالات آموزشی و سلامت عمومی (نمونه نمایشی).",
};

export default function ArticlesPage() {
  return (
    <>
      <PageHeader breadcrumb="مجله سلامت" title="مقالات" description="مطالب آموزشی برای بیماران، دانشجویان و پزشکان." />
      <section className="container py-10 sm:py-14">
        <DemoNotice className="mb-8">
          مقالات این بخش ساختگی و نمونه هستند و نباید به‌عنوان توصیه پزشکی تأییدشده در نظر گرفته شوند.
        </DemoNotice>
        <ArticlesBrowser articles={api.articles.list()} categories={articleCategories} />
      </section>
    </>
  );
}
