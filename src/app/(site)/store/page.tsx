import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/course/CatalogBrowser";
import { PageHeader } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { contentTypeLabels, eduCategories } from "@/data/catalog";
import type { ContentType, EduCategory } from "@/types";

export const metadata: Metadata = {
  title: "فروشگاه محتوای پزشکی",
  description: "دوره‌های آموزشی، ویدیوها، کتاب‌های الکترونیک، فایل‌های PDF و پکیج‌های آموزشی پزشکی.",
};

export default async function StorePage({ searchParams }: { searchParams: Promise<{ type?: string; category?: string }> }) {
  const sp = await searchParams;
  const type = sp.type && sp.type in contentTypeLabels ? (sp.type as ContentType) : "all";
  const category = eduCategories.some((c) => c.id === sp.category) ? (sp.category as EduCategory) : "all";

  return (
    <>
      <PageHeader
        breadcrumb="آموزش پزشکی"
        title="محتوای آموزشی پزشکی"
        description="مجموعه دوره‌ها، ویدیوها، کتاب‌ها و جزوه‌های تخصصی. محتوای خریداری‌شده در پنل کاربری در دسترس است."
      />
      <section className="container py-10 sm:py-14">
        <CatalogBrowser key={`${type}-${category}`} items={api.catalog.list()} initialType={type} initialCategory={category} />
      </section>
    </>
  );
}
