import type { Patient, PatientVisit, ServiceKind, VisitStatus } from "@/types";

/**
 * DEMO DATA — entirely fictional patients.
 * Names, phone numbers and IDs are invented; phone numbers use a non-real 0900 prefix.
 * In production this data lives behind role-based access control (see lib/permissions.ts).
 */

const names: [string, Patient["gender"], string][] = [
  ["مریم احمدی", "زن", "تهران"],
  ["علی رضایی", "مرد", "کرج"],
  ["زهرا کریمی", "زن", "تهران"],
  ["حسین موسوی", "مرد", "اصفهان"],
  ["فاطمه حسینی", "زن", "شیراز"],
  ["محمد جعفری", "مرد", "تهران"],
  ["سمیرا نوروزی", "زن", "مشهد"],
  ["رضا قاسمی", "مرد", "تبریز"],
  ["نرگس صادقی", "زن", "تهران"],
  ["امیر حیدری", "مرد", "قم"],
  ["لیلا مرادی", "زن", "رشت"],
  ["مهدی باقری", "مرد", "تهران"],
  ["شیما اکبری", "زن", "کرج"],
  ["پویا سلیمانی", "مرد", "اصفهان"],
  ["الهام رستمی", "زن", "تهران"],
  ["سعید ملکی", "مرد", "یزد"],
  ["نیلوفر عباسی", "زن", "تهران"],
  ["کامران شریفی", "مرد", "اهواز"],
];

const reasons = [
  "پیگیری فشار خون",
  "بررسی نتایج آزمایش",
  "ویزیت دوره‌ای",
  "سرفه طولانی",
  "سردرد مکرر",
  "پیگیری درمان",
  "مشاوره پیش از سفر",
  "خستگی و ضعف",
  "بررسی نوار قلب",
];

const services: ServiceKind[] = ["in-person", "online", "phone"];
const statuses: VisitStatus[] = ["completed", "completed", "completed", "completed", "no-show", "cancelled"];
const doctorIds = ["dr-1", "dr-2", "dr-3"];

function isoFromOffset(daysAgo: number): string {
  // Fixed demo anchor so data looks the same everywhere.
  const base = new Date("2026-09-27T12:00:00");
  base.setDate(base.getDate() - daysAgo);
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  return `${base.getFullYear()}-${m}-${d}`;
}

export const patients: Patient[] = names.map(([name, gender, city], i) => {
  const visitCount = 2 + (i % 4);
  const visits: PatientVisit[] = Array.from({ length: visitCount }, (_, v) => {
    const daysAgo = i * 3 + v * 37 - (i % 3 === 0 && v === 0 ? i * 3 + 4 : 0);
    return {
      id: `V-${3100 + i * 10 + v}`,
      date: isoFromOffset(daysAgo),
      service: services[(i + v) % 3],
      reason: reasons[(i * 2 + v) % reasons.length],
      status: daysAgo < 0 ? "scheduled" : v === 0 ? statuses[i % statuses.length] : "completed",
      doctorId: doctorIds[(i + v) % 3],
    };
  });
  const last = visits[0];
  return {
    id: `P-${10210 + i * 7}`,
    name,
    phone: `0900-${String(1200000 + i * 45731).slice(0, 3)}-${String(3400 + i * 137).slice(0, 4)}`,
    gender,
    birthYear: 1345 + ((i * 7) % 45),
    city,
    lastVisit: last.date,
    lastService: last.service,
    status: last.status,
    visits,
    notes: [
      {
        date: visits[visits.length - 1].date,
        text: "یادداشت نمایشی: بیمار برای پیگیری در ویزیت بعدی دعوت شد.",
        author: "دکتر آرمان نیک‌پور",
      },
      ...(i % 2 === 0
        ? [{ date: last.date, text: "یادداشت نمایشی: نتایج آزمایش در پرونده بارگذاری شد.", author: "منشی مطب" }]
        : []),
    ],
    files: [
      { name: "نتیجه-آزمایش-نمونه.pdf", date: last.date, size: "۴۸۰ کیلوبایت" },
      ...(i % 3 === 0 ? [{ name: "تصویر-نمونه.jpg", date: visits[visits.length - 1].date, size: "۱٫۲ مگابایت" }] : []),
    ],
    payments: visits
      .filter((v) => v.status === "completed")
      .map((v, k) => ({
        id: `PAY-${7700 + i * 10 + k}`,
        date: v.date,
        amount: v.service === "in-person" ? 450000 : v.service === "phone" ? 400000 : 350000,
        title: v.service === "in-person" ? "ویزیت حضوری" : v.service === "phone" ? "مشاوره تلفنی" : "ویزیت آنلاین",
      })),
  };
});

export function patientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export const visitStatusLabels: Record<VisitStatus, string> = {
  completed: "انجام‌شده",
  scheduled: "نوبت آینده",
  "no-show": "عدم مراجعه",
  cancelled: "لغوشده",
};

/** The demo account used in the patient dashboard is patient #1. */
export const DEMO_PATIENT_ID = patients[0].id;
