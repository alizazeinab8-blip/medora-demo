import type { Metadata } from "next";
import { AppointmentBooking } from "@/components/booking/AppointmentBooking";
import { DemoNotice, PageHeader } from "@/components/ui/primitives";
import type { ServiceKind } from "@/types";

export const metadata: Metadata = {
  title: "نوبت‌دهی آنلاین",
  description: "رزرو آنلاین نوبت ویزیت حضوری، مشاوره تلفنی یا ویزیت آنلاین در چند مرحله ساده.",
};

const kinds: ServiceKind[] = ["in-person", "phone", "online"];

export default async function AppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; doctor?: string }>;
}) {
  const sp = await searchParams;
  const service = kinds.includes(sp.service as ServiceKind) ? (sp.service as ServiceKind) : undefined;

  return (
    <>
      <PageHeader
        breadcrumb="نوبت‌دهی"
        title="دریافت نوبت آنلاین"
        description="خدمت، تاریخ و ساعت مناسب را انتخاب کنید. پس از پرداخت آزمایشی، نوبت در پنل کاربری شما نمایش داده می‌شود."
      />
      <section className="container py-10 sm:py-14">
        <DemoNotice className="mb-6">
          این فرایند نمایشی است: نوبت فقط در مرورگر شما (localStorage) ذخیره می‌شود و پرداخت واقعی انجام نمی‌شود.
        </DemoNotice>
        <AppointmentBooking initialService={service} initialDoctor={sp.doctor} />
      </section>
    </>
  );
}
