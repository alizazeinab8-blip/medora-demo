import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/home/ContactForm";
import { PageHeader } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های ارتباط با مدورا برای نوبت‌دهی، دوره‌های آموزشی و پشتیبانی.",
};

export default function ContactPage() {
  const c = siteConfig.contact;
  const items = [
    { icon: Phone, label: "تلفن", value: c.phone, ltr: true },
    { icon: Phone, label: "موبایل", value: c.mobile, ltr: true },
    { icon: Mail, label: "ایمیل", value: c.email, ltr: true },
    { icon: Clock, label: "ساعات پاسخ‌گویی", value: c.hours, ltr: false },
    { icon: MapPin, label: "آدرس", value: c.address, ltr: false },
  ];
  return (
    <>
      <PageHeader breadcrumb="ارتباط" title="تماس با ما" description="سؤالات خود را درباره خدمات، نوبت‌ها یا دوره‌ها با ما در میان بگذارید." />
      <section className="container grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_380px]">
        <ContactForm />
        <aside className="space-y-4">
          <ul className="card divide-y divide-navy-100">
            {items.map(({ icon: Icon, label, value, ltr }) => (
              <li key={label} className="flex items-start gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-navy-500">{label}</p>
                  <p className={ltr ? "ltr mt-1 break-all text-right text-sm font-semibold" : "mt-1 text-sm font-semibold leading-7"}>{value}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-surface text-center text-xs text-navy-400">
            جای نقشه — در نسخه نهایی نقشه (مثلاً نشان یا نقشه گوگل) قرار می‌گیرد
          </div>
          <p className="text-[11px] text-navy-400">اطلاعات تماس ساختگی است.</p>
        </aside>
      </section>
    </>
  );
}
