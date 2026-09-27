import type { Metadata } from "next";
import { MyLibrary } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "کتاب‌ها و فایل‌ها" };

export default function Page() {
  return <MyLibrary />;
}
