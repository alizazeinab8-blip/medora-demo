import type { Metadata } from "next";
import { Clock, Headphones, PhoneCall, Wallet } from "lucide-react";
import { AppointmentBooking } from "@/components/booking/AppointmentBooking";
import { DemoNotice, PageHeader } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { defaultTimeSlots } from "@/data/services";
import { fa, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "مشاوره تلفنی",
  description: "رزرو زمان مشخص برای مشاوره تلفنی با پزشک، بدون نیاز به مراجعه حضوری.",
};

export default function PhoneConsultationPage() {
  const p = api.services.pricing().phone;
  return (
    <>
      <PageHeader
        breadcrumb="خدمات پزشکی"
        title="مشاوره تلفنی"
        description="زمان مناسب خود را رزرو کنید؛ پزشک در ساعت تعیین‌شده با شماره ثبت‌شده شما تماس می‌گیرد."
      />

      <section className="container py-10 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Headphones, label: "خدمت", value: "گفت‌وگوی تلفنی با پزشک" },
            { icon: Clock, label: "مدت", value: p.duration },
            { icon: Wallet, label: "تعرفه (نمایشی)", value: formatPrice(p.price) },
            { icon: PhoneCall, label: "زمان‌های قابل رزرو", value: `${fa(defaultTimeSlots.length)} بازه در روز` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs text-navy-500">{label}</p>
                <p className="mt-1 text-sm font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-1">
            <h2 className="font-bold">درباره این خدمت</h2>
            <p className="mt-3 text-sm leading-7 text-navy-500">{p.description}</p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-navy-600">
              <li>• مناسب برای پیگیری درمان و پرسش‌های غیرفوری</li>
              <li>• امکان ثبت توضیحات پیش از تماس</li>
              <li>• ثبت خلاصه مشاوره در پرونده (نسخه نهایی)</li>
            </ul>
            <DemoNotice className="mt-5">
              تماس تلفنی واقعی برقرار نمی‌شود. در نسخه نهایی می‌توان از تماس دستی پزشک یا سرویس VoIP استفاده کرد.
            </DemoNotice>
          </div>
          <div className="lg:col-span-2">
            <AppointmentBooking initialService="phone" lockService />
          </div>
        </div>
      </section>
    </>
  );
}
