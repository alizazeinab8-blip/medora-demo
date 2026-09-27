import Link from "next/link";
import { CalendarCheck, CircleCheck, GraduationCap, MessagesSquare, ShieldCheck, Stethoscope } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ProgressBar } from "@/components/ui/primitives";

/** Homepage hero. The visual is built from HTML/SVG — no stock photo or real person. */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <svg className="absolute inset-0 h-full w-full text-navy-100" aria-hidden>
        <defs>
          <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" aria-hidden />

      <div className="container relative grid grid-cols-1 items-center gap-12 pb-40 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-36 lg:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-700">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {siteConfig.brand.tagline}
          </p>
          <h1 className="mt-6 text-3xl font-black leading-[1.5] text-navy-900 sm:text-4xl lg:text-[2.9rem] lg:leading-[1.45]">
            سلامت و آموزش پزشکی،
            <br />
            <span className="text-brand-700">در یک پلتفرم</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-navy-500 sm:text-lg">
            دسترسی آسان به خدمات پزشکی، نوبت‌دهی، مشاوره آنلاین و محتوای تخصصی پزشکی.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/appointment" className="btn-primary px-6 py-3 text-[15px]">
              <CalendarCheck className="h-5 w-5" aria-hidden />
              دریافت نوبت
            </Link>
            <Link href="/courses" className="btn-outline px-6 py-3 text-[15px]">
              <GraduationCap className="h-5 w-5" aria-hidden />
              مشاهده دوره‌های آموزشی
            </Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-navy-100 pt-6">
            {[
              ["۱۲٬۰۰۰+", "بیمار (نمایشی)"],
              ["۱۶", "محتوای آموزشی"],
              ["زیر ۲۴ ساعت", "پاسخ ویزیت آنلاین"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="text-lg font-extrabold text-navy-900 sm:text-xl">{v}</dd>
                <dd className="mt-1 text-xs text-navy-500">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none" aria-hidden>
      {/* Main panel */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 text-white shadow-lift sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Stethoscope className="h-6 w-6 text-teal-300" />
            </span>
            <div>
              <p className="text-sm font-bold">پرونده سلامت</p>
              <p className="text-xs text-navy-300">نمای نمایشی داشبورد بیمار</p>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 400 110" className="mt-6 w-full">
          <path d="M0 55 H70 L85 35 L100 75 L118 10 L138 100 L152 55 H230 L245 40 L258 70 L272 55 H400" fill="none" stroke="#46b9ac" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M0 55 H400" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 6" />
        </svg>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["نوبت‌ها", "۳"],
            ["مشاوره‌ها", "۲"],
            ["دوره‌ها", "۲"],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl bg-white/5 px-2 py-3">
              <p className="text-lg font-extrabold">{v}</p>
              <p className="mt-0.5 text-[11px] text-navy-300">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating: next appointment */}
      <div className="absolute -bottom-10 right-3 w-[62%] rounded-2xl border border-navy-100 bg-white p-4 shadow-lift sm:-right-6 sm:w-64">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <CalendarCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] text-navy-400">نوبت بعدی</p>
            <p className="truncate text-sm font-bold text-navy-900">شنبه، ساعت ۱۰:۰۰</p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-teal-700">
          <CircleCheck className="h-3.5 w-3.5" />
          تأیید شده — ویزیت حضوری
        </p>
      </div>

      {/* Floating: course progress */}
      <div className="absolute -top-6 left-3 hidden w-56 rounded-2xl border border-navy-100 bg-white p-4 shadow-lift sm:block lg:-left-8">
        <p className="text-[11px] text-navy-400">در حال یادگیری</p>
        <p className="mt-1 text-sm font-bold text-navy-900">اصول معاینه فیزیکی</p>
        <ProgressBar value={60} className="mt-3" />
        <p className="mt-2 text-[11px] text-navy-500">۳ از ۵ جلسه</p>
      </div>

      {/* Floating: message */}
      <div className="absolute -bottom-6 left-6 hidden items-center gap-2 rounded-full border border-navy-100 bg-white py-2 pl-4 pr-2 text-xs shadow-card md:flex lg:-left-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <MessagesSquare className="h-4 w-4" />
        </span>
        پزشک به پیام شما پاسخ داد
      </div>
    </div>
  );
}
