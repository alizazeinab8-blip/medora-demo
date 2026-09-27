import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpen, HeartPulse, ShieldCheck, Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { PageHeader, SectionHeading } from "@/components/ui/primitives";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `درباره ${siteConfig.brand.nameFa}؛ پلتفرم یکپارچه خدمات درمانی و آموزش پزشکی.`,
};

const values = [
  { icon: HeartPulse, title: "بیمارمحوری", text: "دسترسی ساده و شفاف به خدمات درمانی و سوابق مراجعه." },
  { icon: BookOpen, title: "آموزش مبتنی بر شواهد", text: "محتوای آموزشی ساختارمند برای پزشکان و دانشجویان." },
  { icon: ShieldCheck, title: "امنیت اطلاعات", text: "حفاظت از اطلاعات پزشکی با کنترل دسترسی و ثبت رویدادها." },
  { icon: Users, title: "توسعه‌پذیری", text: "آماده برای چند پزشک، چند مدرس و خدمات جدید." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumb="درباره ما"
        title={`درباره ${siteConfig.brand.nameFa}`}
        description="مدورا یک برند ساختگی برای نمایش معماری پلتفرمی است که خدمات درمانی و آموزش پزشکی را در یک تجربه یکپارچه ارائه می‌کند."
      />

      <section className="section">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-extrabold sm:text-2xl">یک پلتفرم، دو مسیر: درمان و آموزش</h2>
            <p className="mt-4 text-sm leading-8 text-navy-600 sm:text-base">
              بیماران می‌توانند نوبت حضوری رزرو کنند، ویزیت آنلاین یا مشاوره تلفنی بگیرند و سوابق خود را در یک پرونده ببینند. در کنار آن،
              پزشکان و دانشجویان به دوره‌ها، کتاب‌ها، ویدیوها و پکیج‌های مرور آزمون دسترسی دارند.
            </p>
            <p className="mt-4 text-sm leading-8 text-navy-600 sm:text-base">
              تمام نام‌ها، آمار و اطلاعات این نسخه ساختگی است و در نسخه نهایی با اطلاعات واقعی مجموعه جایگزین می‌شود.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/services" className="btn-navy">
                خدمات پزشکی
              </Link>
              <Link href="/education" className="btn-outline">
                آموزش پزشکی
              </Link>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-5">
                <Icon className="h-6 w-6 text-brand-600" aria-hidden />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-navy-500">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <SectionHeading title="تیم پزشکی (نمونه)" description="اطلاعات پزشکان ساختگی است." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {api.doctors.list().map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flex flex-col items-start gap-4 rounded-3xl border border-navy-100 p-8 sm:flex-row sm:items-center">
            <Award className="h-10 w-10 shrink-0 text-teal-600" aria-hidden />
            <p className="text-sm leading-8 text-navy-600">
              مجوزها و گواهی‌های مجموعه در نسخه نهایی و بر اساس مدارک ارائه‌شده توسط کارفرما در این بخش نمایش داده می‌شود. این نسخه
              نمایشی ادعای انطباق با هیچ مقررات یا استاندارد خاصی ندارد.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
