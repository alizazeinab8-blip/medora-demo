import type { Doctor, MedicalService, ServiceKind } from "@/types";

/**
 * DEMO DATA — medical services & doctors.
 * In production this comes from GET /api/services and GET /api/doctors.
 */

export const medicalServices: MedicalService[] = [
  {
    id: "svc-clinic",
    kind: "in-person",
    title: "نوبت‌دهی مطب",
    description: "رزرو آنلاین نوبت حضوری در مطب، انتخاب روز و ساعت دلخواه و دریافت یادآوری.",
    icon: "calendar",
    href: "/appointment?service=in-person",
    cta: "رزرو نوبت حضوری",
    price: 450000,
    durationMin: 20,
  },
  {
    id: "svc-online",
    kind: "online",
    title: "ویزیت آنلاین متنی",
    description: "ارسال شرح حال، تصویر و مدارک پزشکی و دریافت پاسخ مکتوب پزشک در پنل کاربری.",
    icon: "chat",
    href: "/consultation",
    cta: "شروع ویزیت آنلاین",
    price: 350000,
    durationMin: 0,
  },
  {
    id: "svc-phone",
    kind: "phone",
    title: "مشاوره تلفنی",
    description: "رزرو زمان مشخص برای گفت‌وگوی تلفنی با پزشک، بدون نیاز به مراجعه حضوری.",
    icon: "phone",
    href: "/phone-consultation",
    cta: "رزرو مشاوره تلفنی",
    price: 400000,
    durationMin: 15,
  },
  {
    id: "svc-records",
    kind: "records",
    title: "پیگیری و سوابق مراجعه",
    description: "دسترسی به تاریخچه نوبت‌ها، ویزیت‌ها، مشاوره‌ها و فایل‌های پزشکی در یک پرونده.",
    icon: "records",
    href: "/dashboard/record",
    cta: "مشاهده پرونده",
  },
];

export const serviceLabels: Record<ServiceKind, string> = {
  "in-person": "ویزیت حضوری",
  phone: "مشاوره تلفنی",
  online: "ویزیت آنلاین",
};

export const servicePricing: Record<ServiceKind, { price: number; duration: string; description: string }> = {
  "in-person": {
    price: 450000,
    duration: "حدود ۲۰ دقیقه",
    description: "معاینه حضوری در مطب با امکان ثبت سوابق در پرونده الکترونیک.",
  },
  phone: {
    price: 400000,
    duration: "۱۵ دقیقه",
    description: "تماس پزشک با شما در ساعت رزروشده. شماره تماس خود را دقیق وارد کنید.",
  },
  online: {
    price: 350000,
    duration: "پاسخ تا ۲۴ ساعت",
    description: "گفت‌وگوی متنی با پزشک، همراه با امکان ارسال تصویر و فایل.",
  },
};

/** Default daily time slots. Production: generated from each doctor's schedule. */
export const defaultTimeSlots = ["09:00", "09:30", "10:00", "10:30", "11:30", "12:00", "16:00", "16:30", "17:30", "18:00"];

/**
 * Deterministic "unavailable" slots so the demo looks realistic.
 * Production: returned by GET /api/doctors/:id/availability?date=...
 */
export function unavailableSlotsFor(isoDate: string): string[] {
  const seed = isoDate.split("-").reduce((a, b) => a + Number(b), 0);
  return defaultTimeSlots.filter((_, i) => (i * 7 + seed) % 5 === 0);
}

export const doctors: Doctor[] = [
  {
    id: "dr-1",
    name: "دکتر آرمان نیک‌پور",
    specialty: "متخصص داخلی",
    initials: "آن",
    rating: 4.9,
    reviews: 412,
    nextAvailable: "فردا، ۱۰:۰۰",
    services: ["in-person", "phone", "online"],
  },
  {
    id: "dr-2",
    name: "دکتر سارا مهرآیین",
    specialty: "متخصص قلب و عروق",
    initials: "سم",
    rating: 4.8,
    reviews: 268,
    nextAvailable: "دوشنبه، ۱۶:۰۰",
    services: ["in-person", "online"],
  },
  {
    id: "dr-3",
    name: "دکتر کیان رحیمی",
    specialty: "پزشک عمومی و مدرس مهارت‌های بالینی",
    initials: "کر",
    rating: 4.7,
    reviews: 189,
    nextAvailable: "امروز، ۱۷:۳۰",
    services: ["phone", "online"],
  },
];

export function doctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id);
}
