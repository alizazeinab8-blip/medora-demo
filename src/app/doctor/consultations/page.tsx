import type { Metadata } from "next";
import { DoctorConsultations } from "@/components/dashboard/DoctorViews";

export const metadata: Metadata = { title: "مشاوره‌ها" };

export default function Page() {
  return <DoctorConsultations />;
}
