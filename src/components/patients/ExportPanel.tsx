"use client";

import { useMemo, useState } from "react";
import { FileSpreadsheet, FileText, LoaderCircle, ScrollText, Sheet } from "lucide-react";
import type { ServiceKind, VisitStatus } from "@/types";
import { Select } from "@/components/ui/controls";
import { DemoNotice } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/Toast";
import { patients } from "@/data/patients";
import { serviceLabels } from "@/data/services";
import { visitStatusLabels } from "@/data/patients";
import { emptyFilters, filterPatients, visitTypeLabels, type VisitType } from "./PatientManager";
import { cn, fa } from "@/lib/format";

const FIELDS = [
  { id: "name", label: "نام بیمار" },
  { id: "id", label: "شناسه بیمار" },
  { id: "phone", label: "شماره تماس" },
  { id: "lastVisit", label: "تاریخ آخرین مراجعه" },
  { id: "service", label: "نوع خدمت" },
  { id: "status", label: "وضعیت مراجعه" },
  { id: "visitType", label: "نوع ویزیت" },
  { id: "visits", label: "تعداد ویزیت‌ها" },
  { id: "payments", label: "مجموع پرداخت‌ها" },
  { id: "notes", label: "یادداشت‌های پزشک" },
];

type Format = "Excel" | "CSV" | "PDF";

/**
 * Patient data export (demo). No file is generated.
 * PRODUCTION: POST /api/exports → background job builds the file, stores it encrypted,
 * returns a short-lived download link; requires `record:export` and is audit-logged.
 */
export function ExportPanel() {
  const toast = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [patientId, setPatientId] = useState("all");
  const [service, setService] = useState<ServiceKind | "all">("all");
  const [status, setStatus] = useState<VisitStatus | "all">("all");
  const [visitType, setVisitType] = useState<VisitType | "all">("all");
  const [fields, setFields] = useState<string[]>(["name", "id", "lastVisit", "service", "status"]);
  const [busy, setBusy] = useState<Format | null>(null);
  const [history, setHistory] = useState<{ format: Format; count: number; time: string }[]>([]);

  const matched = useMemo(() => {
    const list = filterPatients(patients, {
      ...emptyFilters,
      range: from || to ? "custom" : "all",
      from,
      to,
      service,
      status,
      visitType,
    });
    return patientId === "all" ? list : list.filter((p) => p.id === patientId);
  }, [from, to, service, status, visitType, patientId]);

  const toggleField = (id: string) => setFields((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const run = (format: Format) => {
    if (!fields.length) {
      toast("حداقل یک فیلد اطلاعاتی انتخاب کنید.", "warning");
      return;
    }
    setBusy(format);
    setTimeout(() => {
      setBusy(null);
      setHistory((h) => [{ format, count: matched.length, time: new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }) }, ...h].slice(0, 5));
      toast(`خروجی ${format} (نمایشی) با ${fa(matched.length)} رکورد و ${fa(fields.length)} فیلد آماده شد. فایل واقعی تولید نمی‌شود.`);
    }, 900);
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
      <div className="card space-y-6 p-5 sm:p-6">
        <section>
          <h2 className="text-sm font-bold">۱. محدوده اطلاعات</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="label">از تاریخ</span>
              <input type="date" className="input ltr" value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label className="block">
              <span className="label">تا تاریخ</span>
              <input type="date" className="input ltr" value={to} onChange={(e) => setTo(e.target.value)} />
            </label>
            <Select
              label="بیمار"
              value={patientId}
              onChange={setPatientId}
              options={[{ value: "all", label: "همه بیماران" }, ...patients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }))]}
            />
            <Select<ServiceKind | "all">
              label="نوع خدمت"
              value={service}
              onChange={setService}
              options={[{ value: "all", label: "همه" }, ...(Object.keys(serviceLabels) as ServiceKind[]).map((k) => ({ value: k, label: serviceLabels[k] }))]}
            />
            <Select<VisitStatus | "all">
              label="وضعیت مراجعه"
              value={status}
              onChange={setStatus}
              options={[{ value: "all", label: "همه" }, ...(Object.keys(visitStatusLabels) as VisitStatus[]).map((k) => ({ value: k, label: visitStatusLabels[k] }))]}
            />
            <Select<VisitType | "all">
              label="نوع ویزیت"
              value={visitType}
              onChange={setVisitType}
              options={[{ value: "all", label: "همه" }, { value: "first", label: visitTypeLabels.first }, { value: "follow-up", label: visitTypeLabels["follow-up"] }]}
            />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold">۲. فیلدهای اطلاعاتی</h2>
            <button
              type="button"
              className="text-xs font-medium text-brand-700 hover:underline"
              onClick={() => setFields(fields.length === FIELDS.length ? [] : FIELDS.map((f) => f.id))}
            >
              {fields.length === FIELDS.length ? "حذف همه" : "انتخاب همه"}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FIELDS.map((f) => (
              <label
                key={f.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition-colors sm:text-sm",
                  fields.includes(f.id) ? "border-brand-300 bg-brand-50/50" : "border-navy-200",
                )}
              >
                <input type="checkbox" checked={fields.includes(f.id)} onChange={() => toggleField(f.id)} className="h-4 w-4 accent-brand-600" />
                {f.label}
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold">۳. قالب خروجی</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(
              [
                ["Excel", FileSpreadsheet, "bg-emerald-50 text-emerald-700"],
                ["CSV", Sheet, "bg-brand-50 text-brand-700"],
                ["PDF", FileText, "bg-red-50 text-red-700"],
              ] as const
            ).map(([fmt, Icon, tone]) => (
              <button
                key={fmt}
                type="button"
                onClick={() => run(fmt)}
                disabled={busy !== null}
                className="flex items-center gap-3 rounded-2xl border border-navy-200 p-4 text-right transition-colors hover:border-brand-300 disabled:opacity-60"
              >
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", tone)}>
                  {busy === fmt ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <Icon className="h-5 w-5" aria-hidden />}
                </span>
                <span>
                  <span className="block text-sm font-bold">خروجی {fmt}</span>
                  <span className="text-[11px] text-navy-500">{busy === fmt ? "در حال آماده‌سازی..." : "دکمه نمایشی"}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <div className="card p-5">
          <p className="text-xs text-navy-500">پیش‌نمایش خروجی</p>
          <p className="mt-2 text-3xl font-black text-navy-900">{fa(matched.length)}</p>
          <p className="text-xs text-navy-500">رکورد مطابق با فیلترها</p>
          <p className="mt-3 text-xs text-navy-600">{fa(fields.length)} فیلد انتخاب‌شده</p>
          <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto text-xs text-navy-600">
            {matched.slice(0, 6).map((p) => (
              <li key={p.id} className="flex justify-between gap-2">
                <span className="truncate">{p.name}</span>
                <span className="ltr text-navy-400">{p.id}</span>
              </li>
            ))}
            {matched.length > 6 && <li className="text-navy-400">و {fa(matched.length - 6)} مورد دیگر...</li>}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <ScrollText className="h-4 w-4 text-brand-600" aria-hidden />
            خروجی‌های اخیر
          </h3>
          {history.length ? (
            <ul className="mt-3 space-y-2 text-xs">
              {history.map((h, i) => (
                <li key={i} className="flex justify-between rounded-lg bg-surface px-3 py-2">
                  <span>
                    {h.format} · {fa(h.count)} رکورد
                  </span>
                  <span className="text-navy-400">{h.time}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-navy-500">هنوز خروجی گرفته نشده است.</p>
          )}
        </div>
        <DemoNotice>
          در نسخه نهایی، خروجی گرفتن فقط برای نقش‌های مجاز فعال است و هر خروجی با نام کاربر، زمان و فیلترها در گزارش ممیزی ثبت می‌شود.
        </DemoNotice>
      </aside>
    </div>
  );
}
