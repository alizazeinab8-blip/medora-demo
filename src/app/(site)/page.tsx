import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import {
  CategoriesGrid,
  ContactCta,
  ContentTypesStrip,
  FeaturedDoctor,
  OnlineConsultationTeaser,
  QuickAppointment,
  TrustSection,
} from "@/components/home/sections";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { BookCard, CourseCard, VideoCard } from "@/components/cards/ProductCard";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionHeading } from "@/components/ui/primitives";
import { api } from "@/lib/api";

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
      {children}
      <ArrowLeft className="h-4 w-4" aria-hidden />
    </Link>
  );
}

export default function HomePage() {
  const services = api.services.list();
  const courses = api.catalog.list().filter((p) => p.type === "course" || p.type === "package").slice(0, 3);
  const books = api.catalog.list().filter((p) => p.type === "pdf" || p.type === "ebook").slice(0, 4);
  const videos = api.catalog.list({ type: "video" }).slice(0, 3);
  const articles = api.articles.list().slice(0, 3);

  return (
    <>
      <Hero />
      <QuickAppointment />

      <section className="section" aria-labelledby="services-title">
        <div className="container">
          <SectionHeading
            eyebrow="خدمات"
            title="خدمات پزشکی"
            description="از رزرو نوبت حضوری تا ویزیت آنلاین و پیگیری سوابق، همه در یک پنل."
            action={<MoreLink href="/services">همه خدمات</MoreLink>}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <FeaturedDoctor />
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <OnlineConsultationTeaser />
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <SectionHeading
            eyebrow="آموزش پزشکی"
            title="محتوای آموزشی تخصصی"
            description="دوره‌های ویدیویی، کتاب الکترونیک، جزوه PDF و پکیج‌های مرور آزمون برای پزشکان و دانشجویان."
            action={<MoreLink href="/education">مرکز آموزش</MoreLink>}
          />
          <ContentTypesStrip />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="دوره‌های ویژه" description="دوره‌های ساختارمند با جلسات ویدیویی و پیگیری پیشرفت." action={<MoreLink href="/courses">همه دوره‌ها</MoreLink>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((p) => (
              <CourseCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title="کتاب‌ها و جزوه‌های پزشکی" description="منابع قابل دانلود برای مطالعه و مراجعه سریع." action={<MoreLink href="/store?type=ebook">فروشگاه محتوا</MoreLink>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((p) => (
              <BookCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container">
          <SectionHeading title="ویدیوهای آموزشی" description="آموزش تصویری مباحث پرکاربرد بالینی." action={<MoreLink href="/store?type=video">همه ویدیوها</MoreLink>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((p) => (
              <VideoCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <SectionHeading title="آخرین مقالات" description="مطالب نمایشی آموزشی و سلامت عمومی." action={<MoreLink href="/articles">همه مقالات</MoreLink>} />
          <div className="grid gap-6 md:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading title="دسته‌بندی‌های آموزشی" description="محتوا را بر اساس حوزه مطالعه پیدا کنید." />
          <CategoriesGrid />
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container space-y-10">
          <TrustSection />
          <ContactCta />
        </div>
      </section>
    </>
  );
}
