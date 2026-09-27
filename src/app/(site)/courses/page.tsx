import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/course/CatalogBrowser";
import { PageHeader } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { isLearnable } from "@/data/catalog";

export const metadata: Metadata = {
  title: "دوره‌های آموزشی",
  description: "دوره‌های ویدیویی و پکیج‌های آموزشی پزشکی با پیگیری پیشرفت یادگیری.",
};

export default function CoursesPage() {
  const items = api.catalog.list().filter(isLearnable);
  return (
    <>
      <PageHeader
        breadcrumb="آموزش پزشکی"
        title="دوره‌ها و پکیج‌های آموزشی"
        description="دوره‌های ساختارمند ویدیویی، پکیج‌های مرور آزمون و ویدیوهای آموزشی، با امکان مشاهده پیش‌نمایش جلسات رایگان."
      />
      <section className="container py-10 sm:py-14">
        <CatalogBrowser items={items} />
      </section>
    </>
  );
}
