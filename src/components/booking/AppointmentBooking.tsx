"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CircleCheck,
  MessagesSquare,
  PhoneCall,
  Stethoscope,
} from "lucide-react";
import type { ServiceKind } from "@/types";
import { AppointmentCalendar, TimeSlotPicker } from "./AppointmentCalendar";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { DemoNotice } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { demoActions } from "@/lib/demo-store";
import { doctorById, serviceLabels } from "@/data/services";
import { demoUser } from "@/data/dashboard";
import { cn, fa, formatDate, formatPrice, formatWeekday } from "@/lib/format";

const serviceIcons: Record<ServiceKind, typeof Stethoscope> = {
  "in-person": Stethoscope,
  phone: PhoneCall,
  online: MessagesSquare,
};

const STEPS = ["انتخاب خدمت", "انتخاب تاریخ", "انتخاب ساعت", "اطلاعات بیمار", "خلاصه نوبت", "پرداخت"];

/** Normalises Persian/Arabic digits to Latin for validation. */
function normalizeDigits(s: string) {
  return s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function AppointmentBooking({
  initialService,
  initialDoctor,
  lockService = false,
}: {
  initialService?: ServiceKind;
  initialDoctor?: string;
  /** Skip step 1 (used by the phone-consultation page). */
  lockService?: boolean;
}) {
  const doctors = api.doctors.list();
  const pricing = api.services.pricing();

  const [step, setStep] = useState(lockService ? 1 : 0);
  const [service, setService] = useState<ServiceKind | null>(initialService ?? null);
  const [doctorId, setDoctorId] = useState(
    initialDoctor && doctorById(initialDoctor) ? initialDoctor : doctors[0].id,
  );
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: demoUser.name, phone: "", notes: "" });
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState<{ id: string } | null>(null);

  const availableDoctors = useMemo(
    () => (service ? doctors.filter((d) => d.services.includes(service)) : doctors),
    [service, doctors],
  );
  const availability = useMemo(() => (date ? api.doctors.availability(date) : null), [date]);
  const doctor = doctorById(doctorId) ?? doctors[0];

  const canNext =
    (step === 0 && !!service) || (step === 1 && !!date) || (step === 2 && !!time) || step === 3 || step === 4;

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 3) e.name = "لطفاً نام و نام خانوادگی را وارد کنید.";
    const phone = normalizeDigits(form.phone).replace(/[\s-]/g, "");
    if (!/^09\d{9}$/.test(phone)) e.phone = "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 3 && !validate()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    if (typeof window !== "undefined") document.getElementById("booking-top")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const back = () => setStep((s) => Math.max(s - 1, lockService ? 1 : 0));

  const pickService = (k: ServiceKind) => {
    setService(k);
    const d = doctorById(doctorId);
    if (d && !d.services.includes(k)) {
      const alt = doctors.find((x) => x.services.includes(k));
      if (alt) setDoctorId(alt.id);
    }
  };

  const handlePaid = (totals: { amount: number; discount: number }) => {
    if (!service || !date || !time) return;
    const appt = demoActions.addAppointment({
      serviceKind: service,
      doctorId,
      date,
      time,
      patientName: form.name,
      phone: form.phone,
      notes: form.notes,
      amount: totals.amount,
    });
    demoActions.recordPayment({
      itemId: appt.id,
      itemTitle: `${serviceLabels[service]} — نوبت ${appt.id}`,
      kind: "appointment",
      amount: totals.amount,
      discount: totals.discount,
    });
    setDone({ id: appt.id });
  };

  /* ───────────── Success ───────────── */
  if (done && service && date && time) {
    return (
      <div className="card mx-auto max-w-xl p-6 text-center sm:p-10" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <CircleCheck className="h-9 w-9" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-extrabold">نوبت شما با موفقیت ثبت شد.</h2>
        <p className="mt-2 text-sm text-navy-500">پرداخت آزمایشی با موفقیت انجام شد.</p>
        <div className="mt-6 rounded-2xl bg-surface p-5 text-sm">
          <p className="text-xs text-navy-500">شماره نوبت</p>
          <p className="ltr mt-1 text-2xl font-black tracking-wider text-navy-900">{done.id}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-right text-xs">
            <div>
              <dt className="text-navy-400">خدمت</dt>
              <dd className="mt-0.5 font-semibold">{serviceLabels[service]}</dd>
            </div>
            <div>
              <dt className="text-navy-400">پزشک</dt>
              <dd className="mt-0.5 font-semibold">{doctor.name}</dd>
            </div>
            <div>
              <dt className="text-navy-400">تاریخ</dt>
              <dd className="mt-0.5 font-semibold">{formatDate(date)}</dd>
            </div>
            <div>
              <dt className="text-navy-400">ساعت</dt>
              <dd className="mt-0.5 font-semibold">{fa(time)}</dd>
            </div>
          </dl>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard/appointments" className="btn-primary">
            مشاهده در پنل کاربری
          </Link>
          <Link href="/" className="btn-outline">
            بازگشت به خانه
          </Link>
        </div>
        <p className="mt-5 text-[11px] text-navy-400">در نسخه نهایی، پیامک تأیید و یادآوری برای بیمار ارسال می‌شود.</p>
      </div>
    );
  }

  const visibleSteps = lockService ? STEPS.slice(1) : STEPS;
  const visibleIndex = lockService ? step - 1 : step;

  return (
    <div id="booking-top" className="scroll-mt-28">
      {/* Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs sm:hidden">
          <span className="font-semibold text-navy-800">
            مرحله {fa(visibleIndex + 1)} از {fa(visibleSteps.length)}: {visibleSteps[visibleIndex]}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-100 sm:hidden">
          <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${((visibleIndex + 1) / visibleSteps.length) * 100}%` }} />
        </div>
        <ol className="hidden items-center gap-2 sm:flex">
          {visibleSteps.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i < visibleIndex && "bg-teal-500 text-white",
                  i === visibleIndex && "bg-brand-600 text-white",
                  i > visibleIndex && "bg-navy-100 text-navy-400",
                )}
                aria-current={i === visibleIndex ? "step" : undefined}
              >
                {i < visibleIndex ? <CircleCheck className="h-4 w-4" aria-hidden /> : fa(i + 1)}
              </span>
              <span className={cn("hidden whitespace-nowrap text-xs lg:inline", i === visibleIndex ? "font-semibold text-navy-900" : "text-navy-400")}>
                {label}
              </span>
              {i < visibleSteps.length - 1 && <span className="h-px flex-1 bg-navy-100" />}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        <div className="card p-5 sm:p-7">
          {step === 0 && (
            <section>
              <h2 className="text-lg font-bold">نوع خدمت را انتخاب کنید</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="نوع خدمت">
                {(Object.keys(serviceLabels) as ServiceKind[]).map((k) => {
                  const Icon = serviceIcons[k];
                  const selected = service === k;
                  return (
                    <button
                      key={k}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pickService(k)}
                      className={cn(
                        "flex flex-col items-start rounded-2xl border p-4 text-right transition-colors",
                        selected ? "border-brand-600 bg-brand-50/60 ring-1 ring-brand-600" : "border-navy-200 hover:border-brand-300",
                      )}
                    >
                      <Icon className={cn("h-6 w-6", selected ? "text-brand-600" : "text-navy-400")} aria-hidden />
                      <span className="mt-3 font-bold text-navy-900">{serviceLabels[k]}</span>
                      <span className="mt-1 text-xs text-navy-500">{pricing[k].duration}</span>
                      <span className="mt-3 text-sm font-semibold text-navy-800">{formatPrice(pricing[k].price)}</span>
                    </button>
                  );
                })}
              </div>
              {service && <p className="mt-4 text-sm leading-7 text-navy-500">{pricing[service].description}</p>}

              <label className="mt-6 block max-w-md">
                <span className="label">پزشک</span>
                <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="input">
                  {availableDoctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — {d.specialty}
                    </option>
                  ))}
                </select>
              </label>
            </section>
          )}

          {step === 1 && (
            <section>
              <h2 className="text-lg font-bold">تاریخ نوبت را انتخاب کنید</h2>
              <p className="mb-5 mt-1 text-sm text-navy-500">
                {doctor.name} — {service ? serviceLabels[service] : ""}
              </p>
              <AppointmentCalendar
                value={date}
                onChange={(d) => {
                  setDate(d);
                  setTime(null);
                }}
              />
            </section>
          )}

          {step === 2 && availability && date && (
            <section>
              <h2 className="text-lg font-bold">ساعت نوبت را انتخاب کنید</h2>
              <p className="mb-5 mt-1 text-sm text-navy-500">
                {formatWeekday(date)}، {formatDate(date)}
              </p>
              <TimeSlotPicker slots={availability.slots} unavailable={availability.unavailable} value={time} onChange={setTime} />
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 className="text-lg font-bold">اطلاعات بیمار</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label">نام و نام خانوادگی</span>
                  <input
                    className={cn("input", errors.name && "border-red-400")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoComplete="name"
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name}</span>}
                </label>
                <label className="block">
                  <span className="label">شماره تماس</span>
                  <input
                    className={cn("input ltr text-left", errors.phone && "border-red-400")}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    inputMode="tel"
                    placeholder="09xx xxx xxxx"
                    autoComplete="tel"
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && <span className="mt-1 block text-xs text-red-600">{errors.phone}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="label">توضیحات (اختیاری)</span>
                  <textarea
                    className="input min-h-[110px] resize-y"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="علت مراجعه یا توضیحات لازم برای پزشک"
                  />
                </label>
              </div>
              <DemoNotice className="mt-5">لطفاً اطلاعات واقعی پزشکی وارد نکنید؛ این فرم نمایشی است و فقط در مرورگر شما ذخیره می‌شود.</DemoNotice>
            </section>
          )}

          {step === 4 && service && date && time && (
            <section>
              <h2 className="text-lg font-bold">خلاصه نوبت</h2>
              <dl className="mt-5 divide-y divide-navy-100 rounded-2xl border border-navy-100 text-sm">
                {[
                  ["خدمت", serviceLabels[service]],
                  ["پزشک", `${doctor.name} — ${doctor.specialty}`],
                  ["تاریخ", `${formatWeekday(date)}، ${formatDate(date)}`],
                  ["ساعت", fa(time)],
                  ["نام بیمار", form.name],
                  ["شماره تماس", form.phone],
                  ["توضیحات", form.notes || "—"],
                  ["مبلغ", formatPrice(pricing[service].price)],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:justify-between">
                    <dt className="text-navy-500">{k}</dt>
                    <dd className={cn("font-semibold text-navy-900", k === "شماره تماس" && "ltr sm:text-left")}>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {step === 5 && service && (
            <section>
              <h2 className="mb-5 text-lg font-bold">پرداخت</h2>
              <PaymentSummary
                line={{
                  title: `${serviceLabels[service]} — ${doctor.name}`,
                  subtitle: date && time ? `${formatDate(date)} — ساعت ${fa(time)}` : undefined,
                  amount: pricing[service].price,
                }}
                onPay={handlePaid}
                payLabel="پرداخت آزمایشی و ثبت نوبت"
              />
            </section>
          )}

          {step < 5 && (
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-navy-100 pt-5">
              <button type="button" onClick={back} className={cn("btn-ghost", step === (lockService ? 1 : 0) && "invisible")}>
                <ArrowRight className="h-4 w-4" aria-hidden />
                مرحله قبل
              </button>
              <button type="button" onClick={next} disabled={!canNext} className="btn-primary">
                {step === 4 ? "تأیید و پرداخت" : "مرحله بعد"}
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
          {step === 5 && (
            <button type="button" onClick={back} className="btn-ghost mt-6">
              <ArrowRight className="h-4 w-4" aria-hidden />
              بازگشت به خلاصه
            </button>
          )}
        </div>

        {/* Live summary */}
        <aside className="h-fit rounded-2xl border border-navy-100 bg-surface p-5 lg:sticky lg:top-24" aria-label="خلاصه انتخاب‌ها">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <CalendarCheck className="h-4 w-4 text-brand-600" aria-hidden />
            نوبت شما
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="خدمت" value={service ? serviceLabels[service] : null} />
            <Row label="پزشک" value={doctor.name} />
            <Row label="تاریخ" value={date ? formatDate(date) : null} />
            <Row label="ساعت" value={time ? fa(time) : null} />
            <div className="flex justify-between border-t border-navy-200 pt-3">
              <dt className="text-navy-500">مبلغ</dt>
              <dd className="font-bold">{service ? formatPrice(pricing[service].price) : "—"}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-navy-500">{label}</dt>
      <dd className={cn("text-left", value ? "font-semibold text-navy-900" : "text-navy-300")}>{value ?? "انتخاب نشده"}</dd>
    </div>
  );
}
