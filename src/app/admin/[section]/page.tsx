import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminSection } from "@/components/dashboard/AdminViews";

/** Generic admin table sections. Add a module: add a key here and a config in AdminViews. */
const SECTIONS: Record<string, string> = {
  users: "کاربران",
  doctors: "پزشکان",
  content: "محتوا",
  books: "کتاب‌ها",
  videos: "ویدیوها",
  courses: "دوره‌ها",
  products: "محصولات",
  orders: "سفارش‌ها",
  payments: "پرداخت‌ها",
  appointments: "نوبت‌ها",
  consultations: "مشاوره‌ها",
};

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  return { title: SECTIONS[section] ?? "مدیریت" };
}

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!SECTIONS[section]) notFound();
  return <AdminSection section={section} />;
}
