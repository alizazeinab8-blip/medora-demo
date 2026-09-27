"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Activity, CalendarCheck, Clock, MessagesSquare, Users } from "lucide-react";
import { ConsultationChat } from "@/components/consultation/ConsultationChat";
import { DataTable, FilterBar } from "@/components/ui/controls";
import { Avatar, Badge, StatCard, StatusBadge, initialsOf } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/Toast";
import { useDemoStore } from "@/lib/demo-store";
import {
  consultationRequests,
  doctorActivity,
  doctorMessages,
  doctorToday,
  doctorUpcoming,
} from "@/data/dashboard";
import { patients, visitStatusLabels } from "@/data/patients";
import { serviceLabels } from "@/data/services";
import { cn, fa, formatDate, formatWeekday } from "@/lib/format";

const todayStatus = { done: "انجام‌شده", "in-progress": "در حال ویزیت", waiting: "در انتظار" } as const;

function Title({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-extrabold sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-navy-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function DoctorOverview() {
  const toast = useToast();
  const recent = [...patients].sort((a, b) => b.lastVisit.localeCompare(a.lastVisit)).slice(0, 5);
  const waiting = doctorToday.filter((a) => a.status === "waiting").length;

  return (
    <div>
      <Title title="روز بخیر، دکتر نیک‌پور" description="برنامه امروز و درخواست‌های در انتظار (داده نمایشی)." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="نوبت‌های امروز" value={fa(doctorToday.length)} hint={`${fa(waiting)} نفر در انتظار`} icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard
          label="نوبت‌های پیش رو"
          value={fa(doctorUpcoming.reduce((a, d) => a + d.count, 0))}
          hint="۵ روز آینده"
          icon={<Clock className="h-5 w-5" />}
          tone="navy"
        />
        <StatCard label="درخواست‌های مشاوره" value={fa(consultationRequests.length)} hint="در صف پاسخ" icon={<MessagesSquare className="h-5 w-5" />} tone="amber" />
        <StatCard label="تعداد بیماران" value={fa(patients.length)} hint="بیماران ثبت‌شده" icon={<Users className="h-5 w-5" />} tone="teal" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">نوبت‌های امروز</h2>
            <Link href="/doctor/appointments" className="text-xs font-semibold text-brand-700">
              همه نوبت‌ها
            </Link>
          </div>
          <ol className="space-y-2">
            {doctorToday.map((a) => (
              <li
                key={a.time}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3",
                  a.status === "in-progress" ? "border-brand-200 bg-brand-50/50" : "border-navy-100",
                )}
              >
                <span className="w-12 shrink-0 text-center text-sm font-bold tabular-nums text-navy-900">{fa(a.time)}</span>
                <span className="h-8 w-px bg-navy-100" aria-hidden />
                <div className="min-w-0 flex-1">
                  <Link href={`/doctor/patients/${a.patientId}`} className="truncate text-sm font-semibold hover:text-brand-700">
                    {a.patient}
                  </Link>
                  <p className="text-xs text-navy-500">{serviceLabels[a.service]}</p>
                </div>
                <Badge tone={a.status === "done" ? "green" : a.status === "in-progress" ? "blue" : "amber"}>{todayStatus[a.status]}</Badge>
              </li>
            ))}
          </ol>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">درخواست‌های مشاوره</h2>
            <Link href="/doctor/consultations" className="text-xs font-semibold text-brand-700">
              پاسخ‌گویی
            </Link>
          </div>
          <ul className="space-y-2">
            {consultationRequests.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{c.patient}</p>
                  <p className="truncate text-xs text-navy-500">
                    {c.subject} · {c.waiting} پیش
                  </p>
                </div>
                {c.priority === "high" ? <Badge tone="red">اولویت بالا</Badge> : <Badge>عادی</Badge>}
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">بیماران اخیر</h2>
            <Link href="/doctor/patients" className="text-xs font-semibold text-brand-700">
              همه بیماران
            </Link>
          </div>
          <ul className="divide-y divide-navy-100">
            {recent.map((p) => (
              <li key={p.id}>
                <Link href={`/doctor/patients/${p.id}`} className="flex items-center gap-3 py-3 hover:text-brand-700">
                  <Avatar initials={initialsOf(p.name)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-navy-500">
                      <span className="ltr">{p.id}</span> · {formatDate(p.lastVisit)}
                    </p>
                  </div>
                  <StatusBadge status={visitStatusLabels[p.status]} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="mb-4 font-bold">پیام‌ها</h2>
            <ul className="space-y-3">
              {doctorMessages.map((m, i) => (
                <li key={i} className="flex gap-3">
                  <Avatar initials={initialsOf(m.from)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2 text-xs">
                      <span className="font-semibold text-navy-800">{m.from}</span>
                      <span className="text-navy-400">{m.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs leading-5 text-navy-600">{m.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn-outline btn-sm mt-4 w-full" onClick={() => toast("صندوق پیام کامل در نسخه نهایی.", "info")}>
              مشاهده همه پیام‌ها
            </button>
          </section>

          <section className="card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-bold">
              <Activity className="h-4 w-4 text-teal-600" aria-hidden />
              فعالیت‌های اخیر
            </h2>
            <ul className="space-y-3 text-xs">
              {doctorActivity.map((a, i) => (
                <li key={i} className="flex justify-between gap-3">
                  <span className="text-navy-700">{a.text}</span>
                  <span className="shrink-0 text-navy-400">{a.time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export function DoctorAppointments() {
  const [day, setDay] = useState("today");
  const upcomingRows = doctorUpcoming.flatMap((d, di) =>
    doctorToday.slice(0, Math.min(d.count, doctorToday.length)).map((a, i) => ({
      key: `${d.date}-${i}`,
      date: d.date,
      time: a.time,
      patient: patients[(di * 3 + i + 5) % patients.length].name,
      patientId: patients[(di * 3 + i + 5) % patients.length].id,
      service: serviceLabels[a.service],
      status: "تأیید‌شده",
    })),
  );
  const todayRows = doctorToday.map((a) => ({
    key: a.time,
    date: "2026-09-27",
    time: a.time,
    patient: a.patient,
    patientId: a.patientId,
    service: serviceLabels[a.service],
    status: todayStatus[a.status],
  }));
  const rows = day === "today" ? todayRows : upcomingRows.filter((r) => r.date === day);

  return (
    <div>
      <Title title="نوبت‌ها" description="برنامه نوبت‌های امروز و روزهای آینده (داده نمایشی)." />
      <FilterBar
        label="انتخاب روز"
        className="mb-5"
        value={day}
        onChange={setDay}
        options={[{ value: "today", label: "امروز", count: todayRows.length }, ...doctorUpcoming.map((d) => ({ value: d.date, label: `${formatWeekday(d.date)} ${formatDate(d.date).split(" ").slice(0, 2).join(" ")}`, count: upcomingRows.filter((r) => r.date === d.date).length }))]}
      />
      <DataTable
        caption="نوبت‌ها"
        rows={rows}
        rowKey={(r) => r.key}
        columns={[
          {
            key: "patient",
            header: "بیمار",
            primary: true,
            render: (r) => (
              <Link href={`/doctor/patients/${r.patientId}`} className="font-semibold hover:text-brand-700">
                {r.patient}
              </Link>
            ),
          },
          { key: "time", header: "ساعت", render: (r) => fa(r.time) },
          { key: "date", header: "تاریخ", render: (r) => formatDate(r.date) },
          { key: "service", header: "خدمت", render: (r) => r.service },
          { key: "status", header: "وضعیت", render: (r) => <StatusBadge status={r.status} /> },
        ]}
      />
    </div>
  );
}

export function DoctorConsultations() {
  const consultations = useDemoStore((s) => s.consultations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(() => consultations.find((c) => c.id === activeId) ?? consultations[0], [consultations, activeId]);

  return (
    <div>
      <Title title="مشاوره‌ها و پیام‌ها" description="پاسخ به درخواست‌های ویزیت آنلاین. پیام‌های شما در پنل بیمار نمایشی هم دیده می‌شوند." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr]">
        <div className="space-y-5">
          <section>
            <h2 className="mb-2 text-xs font-semibold text-navy-500">گفتگوهای فعال (مشترک با پنل بیمار نمایشی)</h2>
            <ul className="space-y-2">
              {consultations.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveId(c.id)}
                    className={cn(
                      "w-full rounded-xl border p-3 text-right",
                      active?.id === c.id ? "border-brand-300 bg-brand-50/50" : "border-navy-100 bg-white hover:border-brand-200",
                    )}
                  >
                    <p className="line-clamp-1 text-sm font-semibold">{c.subject}</p>
                    <p className="text-[11px] text-navy-500">مریم احمدی · {formatDate(c.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-2 text-xs font-semibold text-navy-500">صف درخواست‌ها</h2>
            <ul className="space-y-2">
              {consultationRequests.map((c) => (
                <li key={c.id} className="rounded-xl border border-dashed border-navy-200 bg-white p-3">
                  <p className="text-sm font-semibold">{c.patient}</p>
                  <p className="text-[11px] text-navy-500">
                    {c.subject} · {c.waiting} پیش
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        {active && <ConsultationChat consultation={active} viewer="doctor" />}
      </div>
    </div>
  );
}
