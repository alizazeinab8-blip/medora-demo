import type { Metadata } from "next";
import { PatientManager } from "@/components/patients/PatientManager";
import { api } from "@/lib/api";

export const metadata: Metadata = { title: "بیماران" };

export default function Page() {
  return (
    <div>
      <h1 className="text-xl font-extrabold sm:text-2xl">بیماران</h1>
      <p className="mb-6 mt-1 text-sm text-navy-500">جستجو و فیلتر بیماران تحت درمان (اطلاعات ساختگی).</p>
      <PatientManager patients={api.patients.list()} basePath="/doctor/patients" exportHref="/doctor/export" />
    </div>
  );
}
