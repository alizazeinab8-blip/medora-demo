import type { Metadata } from "next";
import { ExportPanel } from "@/components/patients/ExportPanel";

export const metadata: Metadata = { title: "خروجی اطلاعات بیماران" };

export default function Page() {
  return (
    <div>
      <h1 className="text-xl font-extrabold sm:text-2xl">خروجی اطلاعات بیماران</h1>
      <p className="mb-6 mt-1 text-sm text-navy-500">محدوده، فیلدها و قالب خروجی را انتخاب کنید (نمایشی).</p>
      <ExportPanel />
    </div>
  );
}
