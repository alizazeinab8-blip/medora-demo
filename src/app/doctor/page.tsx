import type { Metadata } from "next";
import { DoctorOverview } from "@/components/dashboard/DoctorViews";

export const metadata: Metadata = { title: "داشبورد" };

export default function Page() {
  return <DoctorOverview />;
}
