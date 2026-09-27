import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/course/CatalogBrowser";
import { Avatar, PageHeader, SectionHeading, initialsOf } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import type { EduCategory } from "@/types";
import { fa } from "@/lib/format";

export const metadata: Metadata = {
  title: "آموزش پزشکی",
  description: "محتوای آموزشی پزشکی در دسته‌های پزشکی عمومی، تخصصی، داروشناسی، تشخیص، مهارت‌های بالینی، مرور آزمون و منابع علمی.",
};

export default async function EducationPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const sp = await searchParams;
  const categories = api.catalog.categories();
  const items = api.catalog.list();
  const category = categories.some((c) => c.id === sp.category) ? (sp.category as EduCategory) : "all";

  return (
    <>
      <PageHeader
        breadcrumb="مرکز آموزش"
        title="آموزش پزشکی"
        description="دوره‌ها، ویدیوها و منابع مطالعاتی برای پزشکان، دستیاران و دانشجویان پزشکی — دسته‌بندی‌شده بر اساس حوزه."
      >
        <dl className="flex flex-wrap gap-6 text-sm">
          {[
            [fa(items.length), "محتوای آموزشی"],
            [fa(categories.length), "دسته‌بندی"],
            [fa(api.catalog.instructors().length), "مدرس"],
            [fa(items.filter((p) => p.price === 0).length), "محتوای رایگان"],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-col-reverse">
              <dt className="text-xs text-navy-500">{l}</dt>
              <dd className="text-xl font-extrabold text-navy-900">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <section className="container py-10 sm:py-14">
        <h2 className="sr-only">محتوای آموزشی بر اساس دسته‌بندی</h2>
        <CatalogBrowser key={category} items={items} initialCategory={category} primary="category" />
      </section>

      <section className="section bg-surface">
        <div className="container">
          <SectionHeading
            title="مدرسان"
            description="هر محتوا به یک مدرس متصل است؛ پلتفرم برای افزودن مدرسان متعدد و پنل مدرس آماده است."
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {api.catalog.instructors().map((ins) => (
              <li key={ins.id} className="card flex items-center gap-3 p-5">
                <Avatar initials={initialsOf(ins.name)} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{ins.name}</p>
                  <p className="truncate text-xs text-navy-500">{ins.title}</p>
                  <p className="mt-1 text-[11px] text-teal-700">
                    {fa(items.filter((p) => p.instructorId === ins.id).length)} محتوای آموزشی
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-navy-400">نام‌ها ساختگی هستند.</p>
        </div>
      </section>
    </>
  );
}
