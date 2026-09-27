import type { Metadata } from "next";
import { AdminOverview } from "@/components/dashboard/AdminViews";

export const metadata: Metadata = { title: "داشبورد" };

export default function Page() {
  return <AdminOverview />;
}
