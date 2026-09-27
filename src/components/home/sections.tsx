import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarSearch,
  CirclePlay,
  Database,
  FileText,
  GraduationCap,
  KeyRound,
  Layers,
  Lock,
  MessagesSquare,
  Paperclip,
  PhoneCall,
  ScrollText,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { doctors, serviceLabels } from "@/data/services";
import { Avatar } from "@/components/ui/primitives";
import { contentTypeLabels, eduCategories, products } from "@/data/catalog";
import type { ContentType } from "@/types";
import { fa } from "@/lib/format";

/* ───────────── Quick appointment (works without JS: GET form) ───────────── */

export function QuickAppointment() {
  return (
    <section aria-labelledby="quick-appt" className="container relative z-10 -mt-16 lg:-mt-20">
      <form action="/appointment" method="get" className="card grid gap-4 p-5 shadow-lift sm:p-6 md:grid-cols-[auto_1fr_1fr_auto] md:items-end">
        <div className="flex items-center gap-3 md:pl-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-white">
            <CalendarSearch className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <h2 id="quick-appt" className="font-bold">نوبت سریع</h2>
            <p className="text-xs text-navy-500">در کمتر از یک دقیقه</p>
          </div>
        </div>
        <label className="block">
          <span className="label">نوع خدمت</span>
          <select name="service" className="input" defaultValue="in-person">
            {Object.entries(serviceLabels).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">پزشک</span>
          <select name="doctor" className="input" defaultValue={doctors[0].id}>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialty}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-primary h-[42px] px-6">
          مشاهده زمان‌های خالی
        </button>
      </form>
    </section>
  );
}

/* ───────────── Featured doctor / brand ───────────── */

export function FeaturedDoctor() {
  const d = siteConfig.doctor;
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      <div className="relative">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 to-teal-50 p-8 sm:p-10">
          <div className="flex flex-col items-center text-center">
            {d.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.image} alt={d.name} className="h-40 w-40 rounded-full object-cover ring-8 ring-white" />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white ring-8 ring-white/60" role="img" aria-label="جای تصویر پزشک">
                <Stethoscope className="h-16 w-16 text-brand-600" aria-hidden />
              </div>
            )}
            <p className="mt-6 text-xl font-extrabold">{d.name}</p>
            <p className="mt-1 text-sm text-navy-600">{d.title}</p>
            <p className="mt-1 text-xs text-navy-500">{d.subtitle}</p>
            <dl className="mt-6 grid w-full max-w-xs grid-cols-2 gap-3">
              <div className="flex flex-col-reverse rounded-xl bg-white px-3 py-3">
                <dt className="text-[11px] text-navy-500">سابقه (نمایشی)</dt>
                <dd className="text-lg font-extrabold text-navy-900">{fa(d.experienceYears)} سال</dd>
              </div>
              <div className="flex flex-col-reverse rounded-xl bg-white px-3 py-3">
                <dt className="text-[11px] text-navy-500">بیمار (نمایشی)</dt>
                <dd className="text-lg font-extrabold text-navy-900">{d.patients}</dd>
              </div>
            </dl>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-navy-400">شخصیت و تصویر ساختگی؛ در نسخه نهایی با اطلاعات واقعی جایگزین می‌شود.</p>
      </div>

      <div>
        <p className="eyebrow mb-2">پزشک و مدرس</p>
        <h2 className="text-xl font-extrabold leading-snug sm:text-2xl">درمان و آموزش، زیر نظر یک تیم متخصص</h2>
        <p className="mt-4 text-sm leading-8 text-navy-500 sm:text-base">{d.bio}</p>
        <ul className="mt-6 space-y-3 text-sm">
          {[
            "ویزیت حضوری، آنلاین و تلفنی با یک پرونده یکپارچه",
            "دوره‌ها و منابع آموزشی تهیه‌شده توسط پزشکان و مدرسان",
            "ساختار آماده برای افزودن پزشکان و مدرسان بیشتر",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" aria-hidden />
              <span className="leading-7 text-navy-700">{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 space-y-3">
          <p className="text-xs font-semibold text-navy-400">پزشکان نمونه پلتفرم</p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {doctors.map((doc) => (
              <li key={doc.id} className="flex items-center gap-2.5 rounded-xl border border-navy-100 bg-white p-3">
                <Avatar initials={doc.initials} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">{doc.name}</p>
                  <p className="truncate text-[11px] text-navy-500">{doc.specialty}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/appointment" className="btn-navy">
            رزرو نوبت
          </Link>
          <Link href="/about" className="btn-outline">
            درباره ما
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ───────────── Online consultation teaser ───────────── */

export function OnlineConsultationTeaser() {
  const steps = ["انتخاب خدمت", "پرداخت", "ارسال شرح حال", "ارسال تصویر یا فایل", "پاسخ پزشک", "مشاهده سابقه گفتگو"];
  return (
    <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-navy-900 p-6 text-white sm:p-10 lg:grid-cols-2 lg:p-14">
      <div>
        <p className="text-xs font-semibold text-teal-300">ویزیت آنلاین و مشاوره تلفنی</p>
        <h2 className="mt-3 text-2xl font-extrabold leading-snug text-white sm:text-3xl">بدون مراجعه حضوری، با پزشک در ارتباط باشید</h2>
        <p className="mt-4 text-sm leading-8 text-navy-200">
          شرح حال خود را بنویسید، تصویر یا نتیجه آزمایش را پیوست کنید و پاسخ پزشک را در پنل کاربری دریافت کنید.
        </p>
        <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="rounded-xl bg-white/5 p-3">
              <span className="text-[11px] font-bold text-teal-300">گام {fa(i + 1)}</span>
              <p className="mt-1 text-xs leading-5 text-white">{s}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/consultation" className="btn bg-white text-navy-900 hover:bg-brand-50">
            <MessagesSquare className="h-4 w-4" aria-hidden />
            شروع ویزیت آنلاین
          </Link>
          <Link href="/phone-consultation" className="btn border border-white/20 text-white hover:bg-white/10">
            <PhoneCall className="h-4 w-4" aria-hidden />
            رزرو مشاوره تلفنی
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 text-navy-800 sm:p-5" aria-label="پیش‌نمایش گفتگو (نمایشی)">
        <div className="flex items-center gap-3 border-b border-navy-100 pb-3">
          <Avatar initials="آن" size="sm" />
          <div>
            <p className="text-sm font-bold">{doctors[0].name}</p>
            <p className="text-[11px] text-teal-600">پاسخ‌گویی کمتر از ۲۴ ساعت</p>
          </div>
        </div>
        <div className="space-y-3 py-4 text-xs leading-6">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-2.5 text-white">
            سلام دکتر، نتیجه آزمایش را پیوست کردم. (پیام نمایشی)
            <span className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/15 px-2 py-1.5 text-[11px]">
              <Paperclip className="h-3.5 w-3.5" aria-hidden /> آزمایش-نمونه.pdf
            </span>
          </div>
          <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm bg-navy-50 px-4 py-2.5">
            سلام، فایل دریافت شد. این یک پاسخ نمایشی است.
          </div>
        </div>
        <p className="rounded-lg bg-surface px-3 py-2 text-[11px] text-navy-500">پیام‌ها نمایشی‌اند و توصیه پزشکی محسوب نمی‌شوند.</p>
      </div>
    </div>
  );
}

/* ───────────── Educational content types ───────────── */

const typeIcons: Record<ContentType, typeof BookOpen> = {
  pdf: FileText,
  ebook: BookOpen,
  video: CirclePlay,
  course: GraduationCap,
  package: Layers,
};

export function ContentTypesStrip() {
  const types = Object.keys(contentTypeLabels) as ContentType[];
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {types.map((t) => {
        const Icon = typeIcons[t];
        const count = products.filter((p) => p.type === t).length;
        return (
          <li key={t}>
            <Link
              href={`/store?type=${t}`}
              className="card flex h-full flex-col items-start gap-3 p-5 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-bold text-navy-900">{contentTypeLabels[t]}</span>
              <span className="text-xs text-navy-500">{fa(count)} محتوا</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ───────────── Categories ───────────── */

export function CategoriesGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {eduCategories.map((c) => (
        <li key={c.id}>
          <Link
            href={`/education?category=${c.id}`}
            className="group flex h-full items-center justify-between gap-3 rounded-2xl border border-navy-100 bg-white p-5 transition-colors hover:border-brand-200"
          >
            <span>
              <span className="block font-bold text-navy-900">{c.label}</span>
              <span className="mt-1 block text-xs leading-5 text-navy-500">{c.description}</span>
            </span>
            <ArrowLeft className="h-4 w-4 shrink-0 text-navy-300 transition-transform group-hover:-translate-x-1 group-hover:text-brand-600" aria-hidden />
          </Link>
        </li>
      ))}
      <li>
        <Link href="/store" className="flex h-full items-center justify-center rounded-2xl bg-navy-900 p-5 text-sm font-bold text-white hover:bg-navy-800">
          مشاهده همه محتوا
        </Link>
      </li>
    </ul>
  );
}

/* ───────────── Trust / privacy ───────────── */

export function TrustSection() {
  const items = [
    { icon: Lock, title: "ارتباط رمزنگاری‌شده", text: "در نسخه نهایی، تمام ارتباطات از طریق HTTPS و داده‌های حساس به‌صورت رمزنگاری‌شده ذخیره می‌شوند." },
    { icon: KeyRound, title: "دسترسی مبتنی بر نقش", text: "بیمار، پزشک و مدیر فقط به اطلاعاتی دسترسی دارند که برای نقش آن‌ها تعریف شده است." },
    { icon: ScrollText, title: "ثبت رویدادها", text: "هر مشاهده یا تغییر در پرونده پزشکی در گزارش ممیزی (Audit Log) ثبت می‌شود." },
    { icon: Database, title: "نگهداری امن فایل‌ها", text: "فایل‌ها و مدارک پزشکی در فضای ذخیره‌سازی امن با پشتیبان‌گیری منظم نگهداری می‌شوند." },
  ];
  return (
    <div className="rounded-3xl border border-navy-100 bg-surface p-6 sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-2">امنیت و حریم خصوصی</p>
          <h2 className="text-xl font-extrabold sm:text-2xl">حریم خصوصی و امنیت اطلاعات کاربران برای ما اهمیت دارد.</h2>
        </div>
        <ShieldCheck className="hidden h-14 w-14 shrink-0 text-teal-500 sm:block" aria-hidden />
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="rounded-2xl bg-white p-5 shadow-card">
            <Icon className="h-6 w-6 text-brand-600" aria-hidden />
            <h3 className="mt-4 text-sm font-bold">{title}</h3>
            <p className="mt-2 text-xs leading-6 text-navy-500">{text}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[11px] leading-5 text-navy-400">
        موارد بالا معماری پیشنهادی نسخه نهایی را توصیف می‌کنند و در این نسخه نمایشی پیاده‌سازی نشده‌اند.
      </p>
    </div>
  );
}

/* ───────────── Contact CTA ───────────── */

export function ContactCta() {
  return (
    <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-brand-700 p-8 text-white sm:p-12 lg:flex-row lg:items-center">
      <div>
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">سؤالی دارید؟ با ما در تماس باشید</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-brand-100">
          برای رزرو نوبت، اطلاعات دوره‌ها یا همکاری آموزشی، از طریق فرم تماس یا تلفن با ما ارتباط بگیرید.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link href="/contact" className="btn bg-white px-6 py-3 text-brand-800 hover:bg-brand-50">
          تماس با ما
        </Link>
        <a href={`tel:${siteConfig.contact.phone.replace(/-/g, "")}`} className="btn border border-white/30 px-6 py-3 text-white hover:bg-white/10">
          <PhoneCall className="h-4 w-4" aria-hidden />
          <span className="ltr">{siteConfig.contact.phone}</span>
        </a>
      </div>
    </div>
  );
}
