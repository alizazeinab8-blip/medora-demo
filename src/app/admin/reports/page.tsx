import type { Metadata } from "next";
import { ExportPanel } from "@/components/patients/ExportPanel";

export const metadata: Metadata = { title: "گزارش‌ها و خروجی" };

export default function Page() {
  return (
    <div>
      <h1 className="text-xl font-extrabold sm:text-2xl">گزارش‌ها — خروجی اطلاعات بیماران</h1>
      <p className="mb-6 mt-1 text-sm text-navy-500">
        خروجی Excel، CSV یا PDF بر اساس بازه زمانی، بیمار، نوع خدمت، وضعیت و نوع ویزیت (دکمه‌ها نمایشی هستند).
      </p>
      <ExportPanel />
    </div>
  );
}
