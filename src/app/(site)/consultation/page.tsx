import type { Metadata } from "next";
import { CreditCard, FileUp, History, ListChecks, MessageSquareReply, NotebookPen } from "lucide-react";
import { ConsultationCenter } from "@/components/consultation/ConsultationCenter";
import { DemoNotice, PageHeader } from "@/components/ui/primitives";
import { fa, formatPrice } from "@/lib/format";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "ویزیت و مشاوره آنلاین",
  description: "ارسال شرح حال، تصویر و فایل و دریافت پاسخ مکتوب پزشک در پنل کاربری.",
};

const steps = [
  { icon: ListChecks, title: "انتخاب خدمت", text: "موضوع و پزشک را انتخاب کنید." },
  { icon: CreditCard, title: "پرداخت", text: "پرداخت آنلاین هزینه ویزیت." },
  { icon: NotebookPen, title: "ارسال شرح حال", text: "علائم و سابقه را بنویسید." },
  { icon: FileUp, title: "ارسال تصویر یا فایل", text: "آزمایش یا تصویر را پیوست کنید." },
  { icon: MessageSquareReply, title: "پاسخ پزشک", text: "پاسخ مکتوب پزشک را دریافت کنید." },
  { icon: History, title: "مشاهده سابقه گفتگو", text: "همه گفتگوها در پرونده می‌ماند." },
];

export default function ConsultationPage() {
  const price = api.services.pricing().online.price;
  return (
    <>
      <PageHeader
        breadcrumb="ویزیت آنلاین"
        title="ویزیت و مشاوره آنلاین"
        description={`گفت‌وگوی متنی با پزشک، همراه با ارسال تصویر و فایل. تعرفه نمایشی: ${formatPrice(price)}`}
      />

      <section className="container py-10 sm:py-14">
        <h2 className="sr-only">مراحل ویزیت آنلاین</h2>
        <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="card relative p-4">
              <span className="absolute left-3 top-3 text-[11px] font-bold text-navy-300">{fa(i + 1)}</span>
              <Icon className="h-6 w-6 text-brand-600" aria-hidden />
              <p className="mt-3 text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs leading-5 text-navy-500">{text}</p>
            </li>
          ))}
        </ol>

        <DemoNotice className="my-8">
          این رابط کاربری نمایشی است. پیام‌ها و پاسخ‌ها ساختگی‌اند، فایل‌ها آپلود نمی‌شوند و هیچ محتوایی توصیه پزشکی محسوب نمی‌شود.
          در شرایط اورژانسی با اورژانس تماس بگیرید.
        </DemoNotice>

        <ConsultationCenter />
      </section>
    </>
  );
}
