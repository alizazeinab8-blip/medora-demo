import type { Metadata } from "next";
import { DoctorAppointments } from "@/components/dashboard/DoctorViews";

export const metadata: Metadata = { title: "نوبت‌ها" };

export default function Page() {
  return <DoctorAppointments />;
}
