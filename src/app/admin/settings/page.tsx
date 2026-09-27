import type { Metadata } from "next";
import { AdminSettings } from "@/components/dashboard/AdminViews";

export const metadata: Metadata = { title: "تنظیمات" };

export default function Page() {
  return <AdminSettings />;
}
