import type { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { DoctorCard } from "@/components/cards/DoctorCard";
import { PageHeader, SectionHeading } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { serviceLabels } from "@/data/services";
import { fa, formatPrice } from "@/lib/format";
import type { ServiceKind } from "@/types";

export const metadata: Metadata = {
  title: "خدمات پزشکی",
  description: "نوبت‌دهی مطب، ویزیت آنلاین متنی، مشاوره تلفنی و پیگیری سوابق مراجعه.",
};

export default function ServicesPage() {
  const services = api.services.list();
  const pricing = api.services.pricing();
  const doctors = api.doctors.list();

  return (
    <>
      <PageHeader
        breadcrumb="خدمات"
        title="خدمات پزشکی"
        description="همه خدمات درمانی مدورا در یک پلتفرم: از رزرو نوبت حضوری تا ویزیت آنلاین و دسترسی به سوابق."
      />

      <section className="section">
        <div className="container">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container">
          <SectionHeading title="تعرفه‌ها و زمان خدمات" description="تعرفه‌ها نمایشی هستند و در پنل مدیریت قابل تنظیم خواهند بود." />
          <div className="grid gap-4 md:grid-cols-3">
            {(Object.keys(pricing) as ServiceKind[]).map((k) => (
              <div key={k} className="card p-6">
                <h3 className="font-bold">{serviceLabels[k]}</h3>
                <p className="mt-2 min-h-[56px] text-sm leading-7 text-navy-500">{pricing[k].description}</p>
                <dl className="mt-4 space-y-2 border-t border-navy-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-navy-500">مدت</dt>
                    <dd className="font-semibold">{pricing[k].duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-500">تعرفه</dt>
                    <dd className="font-semibold">{formatPrice(pricing[k].price)}</dd>
                  </div>
                </dl>
                <Link
                  href={k === "phone" ? "/phone-consultation" : k === "online" ? "/consultation" : "/appointment?service=in-person"}
                  className="btn-outline mt-5 w-full"
                >
                  رزرو {serviceLabels[k]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            title="پزشکان"
            description={`ساختار پلتفرم از چند پزشک پشتیبانی می‌کند. ${fa(doctors.length)} پزشک نمونه (ساختگی):`}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
