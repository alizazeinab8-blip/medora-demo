import type { Metadata } from "next";
import { MyConsultations } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "مشاوره‌های آنلاین" };

export default function Page() {
  return <MyConsultations />;
}
