"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FileDown, SlidersHorizontal } from "lucide-react";
import type { Patient, ServiceKind, VisitStatus } from "@/types";
import { DataTable, SearchBar, Select } from "@/components/ui/controls";
import { Avatar, StatusBadge, initialsOf } from "@/components/ui/primitives";
import { serviceLabels } from "@/data/services";
import { visitStatusLabels } from "@/data/patients";
import { addDays, fa, formatDate } from "@/lib/format";

export const DEMO_TODAY = "2026-09-27";

export type VisitType = "first" | "follow-up";
export const visitTypeLabels: Record<VisitType, string> = { first: "ویزیت اول", "follow-up": "ویزیت پیگیری" };
export const visitTypeOf = (p: Patient): VisitType => (p.visits.length <= 2 ? "first" : "follow-up");

type Range = "all" | "7" | "30" | "90" | "365" | "custom";

function normalizeDigits(s: string) {
  return s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

export interface PatientFilters {
  q: string;
  range: Range;
  from: string;
  to: string;
  service: ServiceKind | "all";
  status: VisitStatus | "all";
  visitType: VisitType | "all";
}

export const emptyFilters: PatientFilters = { q: "", range: "all", from: "", to: "", service: "all", status: "all", visitType: "all" };

export function filterPatients(patients: Patient[], f: PatientFilters): Patient[] {
  const q = normalizeDigits(f.q.trim()).replace(/-/g, "");
  let from = "";
  let to = "";
  if (f.range === "custom") {
    from = f.from;
    to = f.to;
  } else if (f.range !== "all") {
    from = addDays(DEMO_TODAY, -Number(f.range));
  }
  return patients.filter((p) => {
    if (q && !(p.name.includes(f.q.trim()) || p.phone.replace(/-/g, "").includes(q) || p.id.replace(/-/g, "").toLowerCase().includes(q.toLowerCase()))) return false;
    if (from && p.lastVisit < from) return false;
    if (to && p.lastVisit > to) return false;
    if (f.service !== "all" && p.lastService !== f.service) return false;
    if (f.status !== "all" && p.status !== f.status) return false;
    if (f.visitType !== "all" && visitTypeOf(p) !== f.visitType) return false;
    return true;
  });
}

/** Search + filter + table of patients (doctor & admin). */
export function PatientManager({ patients, basePath, exportHref }: { patients: Patient[]; basePath: string; exportHref: string }) {
  const router = useRouter();
  const [f, setF] = useState<PatientFilters>(emptyFilters);
  const [showFilters, setShowFilters] = useState(false);
  const rows = useMemo(() => filterPatients(patients, f), [patients, f]);
  const set = <K extends keyof PatientFilters>(k: K, v: PatientFilters[K]) => setF((x) => ({ ...x, [k]: v }));
  const activeCount = (["service", "status", "visitType"] as const).filter((k) => f[k] !== "all").length + (f.range !== "all" ? 1 : 0);

  return (
    <div className="space-y-5">
      <div className="card space-y-4 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchBar
            value={f.q}
            onChange={(v) => set("q", v)}
            placeholder="جستجو با نام، شماره تماس یا شناسه بیمار (مثلاً P-10231)"
            className="flex-1"
            label="جستجوی بیمار"
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowFilters((s) => !s)} className="btn-outline flex-1 sm:flex-none" aria-expanded={showFilters}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              فیلترها {activeCount > 0 && <span className="rounded-full bg-brand-600 px-1.5 text-[11px] text-white">{fa(activeCount)}</span>}
            </button>
            <Link href={exportHref} className="btn-navy flex-1 sm:flex-none">
              <FileDown className="h-4 w-4" aria-hidden />
              خروجی
            </Link>
          </div>
        </div>

        <div className={showFilters ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-4" : "hidden"}>
          <Select<Range>
            label="بازه زمانی (آخرین مراجعه)"
            value={f.range}
            onChange={(v) => set("range", v)}
            options={[
              { value: "all", label: "همه زمان‌ها" },
              { value: "7", label: "۷ روز اخیر" },
              { value: "30", label: "۳۰ روز اخیر" },
              { value: "90", label: "۳ ماه اخیر" },
              { value: "365", label: "یک سال اخیر" },
              { value: "custom", label: "بازه دلخواه" },
            ]}
          />
          <Select<ServiceKind | "all">
            label="نوع خدمت"
            value={f.service}
            onChange={(v) => set("service", v)}
            options={[{ value: "all", label: "همه خدمات" }, ...(Object.keys(serviceLabels) as ServiceKind[]).map((k) => ({ value: k, label: serviceLabels[k] }))]}
          />
          <Select<VisitStatus | "all">
            label="وضعیت مراجعه"
            value={f.status}
            onChange={(v) => set("status", v)}
            options={[{ value: "all", label: "همه وضعیت‌ها" }, ...(Object.keys(visitStatusLabels) as VisitStatus[]).map((k) => ({ value: k, label: visitStatusLabels[k] }))]}
          />
          <Select<VisitType | "all">
            label="نوع ویزیت"
            value={f.visitType}
            onChange={(v) => set("visitType", v)}
            options={[{ value: "all", label: "همه" }, { value: "first", label: visitTypeLabels.first }, { value: "follow-up", label: visitTypeLabels["follow-up"] }]}
          />
          {f.range === "custom" && (
            <>
              <label className="block">
                <span className="label">از تاریخ</span>
                <input type="date" className="input ltr" value={f.from} onChange={(e) => set("from", e.target.value)} />
              </label>
              <label className="block">
                <span className="label">تا تاریخ</span>
                <input type="date" className="input ltr" value={f.to} onChange={(e) => set("to", e.target.value)} />
              </label>
            </>
          )}
          {activeCount > 0 && (
            <button type="button" onClick={() => setF({ ...emptyFilters, q: f.q })} className="btn-ghost self-end text-red-600">
              حذف فیلترها
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-navy-500" aria-live="polite">
        {fa(rows.length)} بیمار از {fa(patients.length)}
      </p>

      <DataTable
        caption="فهرست بیماران"
        rows={rows}
        rowKey={(p) => p.id}
        onRowClick={(p) => router.push(`${basePath}/${p.id}`)}
        empty="بیماری با این مشخصات یافت نشد."
        columns={[
          {
            key: "name",
            header: "نام بیمار",
            primary: true,
            render: (p) => (
              <Link href={`${basePath}/${p.id}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5 font-semibold text-navy-900 hover:text-brand-700">
                <Avatar initials={initialsOf(p.name)} size="sm" />
                {p.name}
              </Link>
            ),
          },
          { key: "id", header: "شناسه بیمار", render: (p) => <span className="ltr">{p.id}</span> },
          { key: "phone", header: "شماره تماس", render: (p) => <span className="ltr">{p.phone}</span> },
          { key: "last", header: "آخرین مراجعه", render: (p) => formatDate(p.lastVisit) },
          { key: "service", header: "خدمت", render: (p) => serviceLabels[p.lastService] },
          { key: "type", header: "نوع ویزیت", render: (p) => visitTypeLabels[visitTypeOf(p)] },
          { key: "status", header: "وضعیت", render: (p) => <StatusBadge status={visitStatusLabels[p.status]} /> },
        ]}
      />
    </div>
  );
}
