"use client";

import { useMemo, useState } from "react";
import { Download, Eye, FileText, KeyRound, Lock, ScrollText, ShieldCheck, StickyNote, UserRound } from "lucide-react";
import type { Patient, Role } from "@/types";
import { Avatar, Badge, DemoNotice, StatusBadge, initialsOf } from "@/components/ui/primitives";
import { DataTable } from "@/components/ui/controls";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/lib/demo-store";
import { can, permissionLabels, rolePermissions, roleLabels } from "@/lib/permissions";
import { doctorById, serviceLabels } from "@/data/services";
import { visitStatusLabels } from "@/data/patients";
import { adminConsultations } from "@/data/dashboard";
import { cn, fa, formatDate, formatPrice } from "@/lib/format";

const TABS = [
  { id: "basic", label: "اطلاعات پایه" },
  { id: "appointments", label: "سوابق نوبت‌ها" },
  { id: "visits", label: "سوابق ویزیت" },
  { id: "consultations", label: "مشاوره‌ها" },
  { id: "files", label: "فایل‌ها" },
  { id: "notes", label: "یادداشت‌ها" },
  { id: "payments", label: "پرداخت‌ها" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const apptStatus: Record<string, string> = {
  confirmed: "تأیید‌شده",
  pending: "در انتظار",
  done: "انجام‌شده",
  cancelled: "لغوشده",
};

/**
 * Patient record. `viewer` controls what the UI exposes.
 * PRODUCTION: the server returns only fields the viewer is allowed to see,
 * and each open of this page writes an audit-log entry.
 */
export function PatientProfile({ patient, viewer }: { patient: Patient; viewer: Role }) {
  const [tab, setTab] = useState<Tab>("basic");
  const [notes, setNotes] = useState(patient.notes);
  const [draft, setDraft] = useState("");
  const toast = useToast();
  const storeAppointments = useDemoStore((s) => s.appointments);
  const storeConsultations = useDemoStore((s) => s.consultations);
  const canWrite = can(viewer, "record:write");
  const age = 1405 - patient.birthYear;

  const appointments = useMemo(() => {
    const fromVisits = patient.visits.map((v) => ({
      id: v.id,
      date: v.date,
      service: serviceLabels[v.service],
      doctor: doctorById(v.doctorId)?.name ?? "—",
      status: visitStatusLabels[v.status],
    }));
    if (viewer !== "patient") return fromVisits;
    return [
      ...storeAppointments.map((a) => ({
        id: a.id,
        date: a.date,
        service: serviceLabels[a.serviceKind],
        doctor: doctorById(a.doctorId)?.name ?? "—",
        status: apptStatus[a.status],
      })),
      ...fromVisits,
    ];
  }, [patient.visits, storeAppointments, viewer]);

  const consultations = useMemo(
    () =>
      viewer === "patient"
        ? storeConsultations.map((c) => ({ id: c.id, subject: c.subject, date: c.createdAt, status: c.status === "answered" ? "پاسخ داده‌شده" : c.status === "closed" ? "بسته‌شده" : "در انتظار پاسخ" }))
        : adminConsultations
            .filter((c) => c.patient === patient.name)
            .map((c) => ({ id: c.id, subject: c.subject, date: c.date, status: c.status })),
    [storeConsultations, viewer, patient.name],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar initials={initialsOf(patient.name)} size="lg" />
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold sm:text-xl">{patient.name}</h1>
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-navy-500">
              <span>
                شناسه: <span className="ltr font-semibold text-navy-800">{patient.id}</span>
              </span>
              <span>آخرین مراجعه: {formatDate(patient.lastVisit)}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={visitStatusLabels[patient.status]} />
          <Badge tone="blue">
            <Lock className="h-3 w-3" aria-hidden />
            دسترسی: {roleLabels[viewer]}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {/* Tabs */}
          <div role="tablist" aria-label="بخش‌های پرونده" className="-mx-4 mb-5 flex gap-1 overflow-x-auto border-b border-navy-100 px-4 scrollbar-none sm:mx-0 sm:px-0">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "-mb-px shrink-0 border-b-2 px-3 py-3 text-sm transition-colors",
                  tab === t.id ? "border-brand-600 font-semibold text-brand-700" : "border-transparent text-navy-500 hover:text-navy-800",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tabpanel">
            {tab === "basic" && (
              <dl className="card grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                {[
                  ["نام و نام خانوادگی", patient.name],
                  ["شناسه بیمار", patient.id],
                  ["جنسیت", patient.gender],
                  ["سال تولد / سن", `${fa(patient.birthYear)} (${fa(age)} سال)`],
                  ["شماره تماس", patient.phone],
                  ["شهر", patient.city],
                  ["تعداد مراجعات", fa(patient.visits.length)],
                  ["آخرین خدمت", serviceLabels[patient.lastService]],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col-reverse gap-1">
                    <dt className="text-xs text-navy-500">{k}</dt>
                    <dd className={cn("text-sm font-semibold", (k === "شماره تماس" || k === "شناسه بیمار") && "ltr text-right")}>{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {tab === "appointments" && (
              <DataTable
                caption="سوابق نوبت‌ها"
                rows={appointments}
                rowKey={(r) => r.id}
                columns={[
                  { key: "id", header: "شماره", primary: true, render: (r) => <span className="ltr">{r.id}</span> },
                  { key: "date", header: "تاریخ", render: (r) => formatDate(r.date) },
                  { key: "service", header: "خدمت", render: (r) => r.service },
                  { key: "doctor", header: "پزشک", render: (r) => r.doctor },
                  { key: "status", header: "وضعیت", render: (r) => <StatusBadge status={r.status} /> },
                ]}
              />
            )}

            {tab === "visits" && (
              <ol className="relative space-y-4 border-r-2 border-navy-100 pr-5">
                {patient.visits.map((v) => (
                  <li key={v.id} className="relative">
                    <span className="absolute -right-[27px] top-4 h-3 w-3 rounded-full border-2 border-white bg-brand-600" aria-hidden />
                    <div className="card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold">{v.reason}</p>
                        <StatusBadge status={visitStatusLabels[v.status]} />
                      </div>
                      <p className="mt-1.5 text-xs text-navy-500">
                        {formatDate(v.date)} · {serviceLabels[v.service]} · {doctorById(v.doctorId)?.name}
                      </p>
                      <p className="mt-2 text-xs text-navy-400">شرح ویزیت (نمایشی) — در نسخه نهایی توسط پزشک ثبت می‌شود.</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {tab === "consultations" && (
              <DataTable
                caption="مشاوره‌ها"
                rows={consultations}
                rowKey={(r) => r.id}
                empty="مشاوره‌ای ثبت نشده است."
                columns={[
                  { key: "subject", header: "موضوع", primary: true, render: (r) => r.subject },
                  { key: "id", header: "شماره", render: (r) => <span className="ltr">{r.id}</span> },
                  { key: "date", header: "تاریخ", render: (r) => formatDate(r.date) },
                  { key: "status", header: "وضعیت", render: (r) => <StatusBadge status={r.status} /> },
                ]}
              />
            )}

            {tab === "files" && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {patient.files.map((f) => (
                  <li key={f.name} className="card flex items-center gap-3 p-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <FileText className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{f.name}</p>
                      <p className="text-xs text-navy-500">
                        {formatDate(f.date)} · {f.size}
                      </p>
                    </div>
                    <button
                      onClick={() => toast("دانلود نمایشی — در نسخه نهایی از طریق لینک امن و موقت.", "info")}
                      className="rounded-lg p-2 text-navy-500 hover:bg-navy-50"
                      aria-label={`دانلود ${f.name}`}
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {tab === "notes" && (
              <div className="space-y-3">
                {canWrite && (
                  <form
                    className="card p-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!draft.trim()) return;
                      setNotes([{ date: "2026-09-27", text: draft.trim(), author: "دکتر آرمان نیک‌پور" }, ...notes]);
                      setDraft("");
                      toast("یادداشت (نمایشی) ثبت شد.");
                    }}
                  >
                    <label htmlFor="note" className="label">
                      افزودن یادداشت پزشک
                    </label>
                    <textarea id="note" className="input min-h-[90px]" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="یادداشت نمایشی..." />
                    <button className="btn-navy btn-sm mt-3" disabled={!draft.trim()}>
                      ثبت یادداشت
                    </button>
                  </form>
                )}
                {notes.map((n, i) => (
                  <div key={i} className="card flex gap-3 p-4">
                    <StickyNote className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
                    <div>
                      <p className="text-sm leading-7">{n.text}</p>
                      <p className="mt-1 text-xs text-navy-500">
                        {n.author} · {formatDate(n.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "payments" && (
              <DataTable
                caption="پرداخت‌ها"
                rows={patient.payments}
                rowKey={(r) => r.id}
                empty="پرداختی ثبت نشده است."
                columns={[
                  { key: "title", header: "بابت", primary: true, render: (r) => r.title },
                  { key: "id", header: "شناسه", render: (r) => <span className="ltr">{r.id}</span> },
                  { key: "date", header: "تاریخ", render: (r) => formatDate(r.date) },
                  { key: "amount", header: "مبلغ", render: (r) => formatPrice(r.amount) },
                ]}
              />
            )}
          </div>
        </div>

        <AccessControlPanel viewer={viewer} patientId={patient.id} />
      </div>

      <DemoNotice>تمام اطلاعات این پرونده ساختگی است و هیچ اطلاعات واقعی بیمار استفاده نشده است.</DemoNotice>
    </div>
  );
}

/** Explains how record access is controlled in production. */
export function AccessControlPanel({ viewer, patientId }: { viewer: Role; patientId: string }) {
  const perms = rolePermissions[viewer];
  return (
    <aside className="h-fit space-y-4">
      <div className="card p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <ShieldCheck className="h-4 w-4 text-teal-600" aria-hidden />
          کنترل دسترسی (معماری نسخه نهایی)
        </h2>
        <p className="mt-2 text-xs leading-6 text-navy-500">
          دسترسی به اطلاعات پزشکی بر اساس نقش کاربر محدود می‌شود و روی سرور بررسی می‌گردد.
        </p>
        <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-navy-700">
          <KeyRound className="h-3.5 w-3.5" aria-hidden />
          مجوزهای نقش «{roleLabels[viewer]}»:
        </p>
        <ul className="mt-2 space-y-1.5">
          {perms.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs text-navy-600">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden />
              {permissionLabels[p]}
            </li>
          ))}
        </ul>
      </div>
      <div className="card p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <ScrollText className="h-4 w-4 text-brand-600" aria-hidden />
          گزارش ممیزی (Audit Log)
        </h2>
        <ul className="mt-3 space-y-3 text-xs">
          {[
            { icon: Eye, text: `مشاهده پرونده ${patientId}`, who: roleLabels[viewer], when: "اکنون" },
            { icon: UserRound, text: "به‌روزرسانی اطلاعات تماس", who: "منشی مطب", when: "۳ روز پیش" },
            { icon: FileText, text: "بارگذاری فایل آزمایش", who: "بیمار", when: "۱ هفته پیش" },
          ].map((e, i) => (
            <li key={i} className="flex gap-2.5">
              <e.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" aria-hidden />
              <div>
                <p className="text-navy-700">{e.text}</p>
                <p className="text-navy-400">
                  {e.who} · {e.when}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-lg bg-surface p-2.5 text-[11px] leading-5 text-navy-500">نمونه نمایشی؛ در نسخه نهایی هر دسترسی به‌صورت تغییرناپذیر ثبت می‌شود.</p>
      </div>
    </aside>
  );
}
