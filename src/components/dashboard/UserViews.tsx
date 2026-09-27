"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bell,
  CalendarCheck,
  CircleCheck,
  CirclePlay,
  CreditCard,
  Download,
  GraduationCap,
  MessagesSquare,
  ShoppingBag,
} from "lucide-react";
import type { Appointment } from "@/types";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { DataTable, FilterBar } from "@/components/ui/controls";
import { Badge, EmptyState, ProgressBar, StatCard, StatusBadge } from "@/components/ui/primitives";
import { Cover } from "@/components/ui/Cover";
import { ConsultationCenter } from "@/components/consultation/ConsultationCenter";
import { PatientProfile } from "@/components/patients/PatientProfile";
import { contentTypeLabels, isLearnable, productById } from "@/data/catalog";
import { doctorById, serviceLabels } from "@/data/services";
import { demoUser } from "@/data/dashboard";
import { patientById, visitStatusLabels } from "@/data/patients";
import { cn, fa, formatDate, formatPrice, isoDate } from "@/lib/format";

const apptStatus: Record<Appointment["status"], string> = {
  confirmed: "تأیید‌شده",
  pending: "در انتظار",
  done: "انجام‌شده",
  cancelled: "لغوشده",
};

const orderKind: Record<string, string> = { ...contentTypeLabels, appointment: "نوبت", consultation: "ویزیت آنلاین" };

function PageTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
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

function useUpcoming() {
  const appointments = useDemoStore((s) => s.appointments);
  return useMemo(() => {
    const today = isoDate(new Date());
    return appointments
      .filter((a) => a.status === "confirmed" && a.date >= today)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }, [appointments]);
}

function useOwnedProducts() {
  const purchases = useDemoStore((s) => s.purchases);
  return useMemo(() => purchases.map(productById).filter((p): p is NonNullable<typeof p> => !!p), [purchases]);
}

/* ───────────── Overview ───────────── */

export function UserOverview() {
  const upcoming = useUpcoming();
  const owned = useOwnedProducts();
  const orders = useDemoStore((s) => s.orders);
  const consultations = useDemoStore((s) => s.consultations);
  const progress = useDemoStore((s) => s.lessonProgress);
  const next = upcoming[0];
  const courses = owned.filter(isLearnable);

  return (
    <div>
      <PageTitle title={`سلام، ${demoUser.name}`} description="خلاصه فعالیت‌های شما در یک نگاه (نمایشی)." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="نوبت بعدی"
          value={next ? `${formatDate(next.date)} — ${fa(next.time)}` : "نوبتی ندارید"}
          hint={next ? serviceLabels[next.serviceKind] : undefined}
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <StatCard label="دوره‌های فعال" value={fa(courses.length)} hint="دوره و پکیج" icon={<GraduationCap className="h-5 w-5" />} tone="teal" />
        <StatCard label="سفارش‌های اخیر" value={fa(orders.length)} hint="مجموع سفارش‌ها" icon={<ShoppingBag className="h-5 w-5" />} tone="navy" />
        <StatCard label="مشاوره‌های اخیر" value={fa(consultations.length)} hint="گفتگوی آنلاین" icon={<MessagesSquare className="h-5 w-5" />} tone="amber" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">نوبت‌های پیش رو</h2>
            <Link href="/appointment" className="btn-primary btn-sm">
              نوبت جدید
            </Link>
          </div>
          {upcoming.length ? (
            <ul className="space-y-3">
              {upcoming.slice(0, 3).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{serviceLabels[a.serviceKind]} — {doctorById(a.doctorId)?.name}</p>
                    <p className="mt-0.5 text-xs text-navy-500">
                      {formatDate(a.date)} · ساعت {fa(a.time)}
                    </p>
                  </div>
                  <span className="ltr shrink-0 text-[11px] text-navy-400">{a.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="نوبت فعالی ندارید" action={<Link href="/appointment" className="btn-outline btn-sm">دریافت نوبت</Link>} />
          )}
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">ادامه یادگیری</h2>
            <Link href="/dashboard/courses" className="text-xs font-semibold text-brand-700">
              همه دوره‌ها
            </Link>
          </div>
          {courses.length ? (
            <ul className="space-y-3">
              {courses.slice(0, 3).map((p) => {
                const total = p.curriculum?.flatMap((s) => s.lessons).length ?? 1;
                const pct = Math.round(((progress[p.id]?.length ?? 0) / total) * 100);
                return (
                  <li key={p.id}>
                    <Link href={`/courses/${p.slug}/learn`} className="flex items-center gap-3 rounded-xl bg-surface p-3 hover:bg-brand-50/50">
                      <Cover title={p.title} tone={p.coverTone} type={p.type} showTitle={false} size="sm" className="h-12 w-16 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.title}</p>
                        <ProgressBar value={pct} className="mt-2" />
                      </div>
                      <span className="shrink-0 text-xs font-bold text-teal-700">{fa(pct)}٪</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title="هنوز دوره‌ای تهیه نکرده‌اید" action={<Link href="/courses" className="btn-outline btn-sm">مشاهده دوره‌ها</Link>} />
          )}
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">سفارش‌های اخیر</h2>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-brand-700">
              همه سفارش‌ها
            </Link>
          </div>
          <ul className="divide-y divide-navy-100">
            {orders.slice(0, 4).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{o.itemTitle}</p>
                  <p className="text-xs text-navy-500">
                    {orderKind[o.kind]} · {formatDate(o.date)}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold">{o.total ? formatPrice(o.total) : "رایگان"}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold">مشاوره‌های اخیر</h2>
            <Link href="/dashboard/consultations" className="text-xs font-semibold text-brand-700">
              مشاهده گفتگوها
            </Link>
          </div>
          <ul className="divide-y divide-navy-100">
            {consultations.slice(0, 3).map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{c.subject}</p>
                  <p className="text-xs text-navy-500">
                    {doctorById(c.doctorId)?.name} · {formatDate(c.createdAt)}
                  </p>
                </div>
                <StatusBadge status={c.status === "answered" ? "پاسخ داده‌شده" : c.status === "closed" ? "بسته‌شده" : "در انتظار پاسخ"} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

/* ───────────── Profile ───────────── */

export function ProfileView() {
  const toast = useToast();
  const [form, setForm] = useState({ name: demoUser.name, phone: demoUser.phone, email: demoUser.email, city: demoUser.city });
  return (
    <div>
      <PageTitle title="اطلاعات حساب" description="اطلاعات حساب کاربری (نمایشی)." />
      <form
        className="card grid max-w-3xl gap-4 p-5 sm:grid-cols-2 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          toast("اطلاعات حساب (به‌صورت نمایشی) ذخیره شد.");
        }}
      >
        {(
          [
            ["name", "نام و نام خانوادگی", false],
            ["phone", "شماره موبایل", true],
            ["email", "ایمیل", true],
            ["city", "شهر", false],
          ] as const
        ).map(([k, label, ltr]) => (
          <label key={k} className="block">
            <span className="label">{label}</span>
            <input className={cn("input", ltr && "ltr text-left")} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </label>
        ))}
        <div className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs text-navy-500">عضویت از: {formatDate(demoUser.memberSince)} · شناسه پرونده: <span className="ltr">{demoUser.patientId}</span></span>
        </div>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <button className="btn-primary">ذخیره تغییرات</button>
          <button type="button" className="btn-outline" onClick={() => toast("در نسخه نهایی تغییر شماره با کد تأیید پیامکی انجام می‌شود.", "info")}>
            تغییر شماره موبایل
          </button>
        </div>
      </form>
    </div>
  );
}

/* ───────────── Appointments ───────────── */

export function MyAppointments() {
  const appointments = useDemoStore((s) => s.appointments);
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const today = isoDate(new Date());

  const rows = appointments.filter((a) =>
    filter === "all" ? true : filter === "upcoming" ? a.date >= today && a.status === "confirmed" : a.date < today || a.status !== "confirmed",
  );

  return (
    <div>
      <PageTitle
        title="نوبت‌های من"
        description="نوبت‌هایی که از بخش نوبت‌دهی ثبت می‌کنید اینجا نمایش داده می‌شوند."
        action={
          <Link href="/appointment" className="btn-primary">
            <CalendarCheck className="h-4 w-4" aria-hidden />
            دریافت نوبت جدید
          </Link>
        }
      />
      <FilterBar
        label="فیلتر نوبت‌ها"
        className="mb-5"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "همه" },
          { value: "upcoming", label: "پیش رو" },
          { value: "past", label: "گذشته / لغوشده" },
        ]}
      />
      <DataTable
        caption="نوبت‌های من"
        rows={rows}
        rowKey={(a) => a.id}
        empty="نوبتی یافت نشد."
        columns={[
          { key: "service", header: "خدمت", primary: true, render: (a) => serviceLabels[a.serviceKind] },
          { key: "id", header: "شماره نوبت", render: (a) => <span className="ltr">{a.id}</span> },
          { key: "doctor", header: "پزشک", render: (a) => doctorById(a.doctorId)?.name },
          { key: "date", header: "تاریخ", render: (a) => formatDate(a.date) },
          { key: "time", header: "ساعت", render: (a) => fa(a.time) },
          { key: "status", header: "وضعیت", render: (a) => <StatusBadge status={apptStatus[a.status]} /> },
          {
            key: "actions",
            header: "عملیات",
            render: (a) =>
              a.status === "confirmed" && a.date >= today ? (
                <button onClick={() => setCancelId(a.id)} className="text-xs font-semibold text-red-600 hover:underline">
                  لغو نوبت
                </button>
              ) : (
                <span className="text-xs text-navy-300">—</span>
              ),
          },
        ]}
      />
      <Modal
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        title="لغو نوبت"
        size="sm"
        footer={
          <>
            <button className="btn-outline" onClick={() => setCancelId(null)}>
              انصراف
            </button>
            <button
              className="btn bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (cancelId) demoActions.cancelAppointment(cancelId);
                toast("نوبت (به‌صورت نمایشی) لغو شد.");
                setCancelId(null);
              }}
            >
              لغو نوبت
            </button>
          </>
        }
      >
        <p className="text-sm leading-7 text-navy-600">
          آیا از لغو نوبت <span className="ltr font-semibold">{cancelId}</span> مطمئن هستید؟ در نسخه نهایی، قوانین استرداد وجه اعمال می‌شود.
        </p>
      </Modal>
    </div>
  );
}

/* ───────────── Consultations ───────────── */

export function MyConsultations() {
  return (
    <div>
      <PageTitle title="مشاوره‌های آنلاین" description="سابقه گفتگوها با پزشک و ارسال پیام جدید." />
      <ConsultationCenter compact />
    </div>
  );
}

/* ───────────── Visit history ───────────── */

export function VisitHistory() {
  const patient = patientById(demoUser.patientId)!;
  return (
    <div>
      <PageTitle title="سوابق ویزیت" description="ویزیت‌های حضوری، تلفنی و آنلاین گذشته (داده نمایشی)." />
      <DataTable
        caption="سوابق ویزیت"
        rows={patient.visits}
        rowKey={(v) => v.id}
        columns={[
          { key: "reason", header: "علت مراجعه", primary: true, render: (v) => v.reason },
          { key: "date", header: "تاریخ", render: (v) => formatDate(v.date) },
          { key: "service", header: "نوع خدمت", render: (v) => serviceLabels[v.service] },
          { key: "doctor", header: "پزشک", render: (v) => doctorById(v.doctorId)?.name },
          { key: "status", header: "وضعیت", render: (v) => <StatusBadge status={visitStatusLabels[v.status]} /> },
        ]}
      />
      <p className="mt-4 text-sm">
        <Link href="/dashboard/record" className="font-semibold text-brand-700 hover:underline">
          مشاهده پرونده کامل سلامت ←
        </Link>
      </p>
    </div>
  );
}

/* ───────────── Record ───────────── */

export function MyRecord() {
  const patient = patientById(demoUser.patientId)!;
  return <PatientProfile patient={patient} viewer="patient" />;
}

/* ───────────── Orders & payments ───────────── */

export function MyOrders() {
  const orders = useDemoStore((s) => s.orders);
  return (
    <div>
      <PageTitle title="سفارش‌ها" description="سفارش‌های دوره، کتاب، ویدیو، نوبت و مشاوره." />
      <DataTable
        caption="سفارش‌ها"
        rows={orders}
        rowKey={(o) => o.id}
        columns={[
          { key: "title", header: "عنوان", primary: true, render: (o) => o.itemTitle },
          { key: "id", header: "شماره سفارش", render: (o) => <span className="ltr">{o.id}</span> },
          { key: "kind", header: "نوع", render: (o) => orderKind[o.kind] },
          { key: "date", header: "تاریخ", render: (o) => formatDate(o.date) },
          { key: "discount", header: "تخفیف", render: (o) => (o.discount ? formatPrice(o.discount) : "—") },
          { key: "total", header: "مبلغ نهایی", render: (o) => (o.total ? formatPrice(o.total) : "رایگان") },
          { key: "status", header: "وضعیت", render: () => <StatusBadge status="پرداخت‌شده" /> },
        ]}
      />
    </div>
  );
}

export function MyPayments() {
  const payments = useDemoStore((s) => s.payments);
  const total = payments.reduce((a, p) => a + p.amount, 0);
  return (
    <div>
      <PageTitle title="پرداخت‌ها" description="تراکنش‌های آزمایشی ثبت‌شده." />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="تعداد تراکنش" value={fa(payments.length)} icon={<CreditCard className="h-5 w-5" />} />
        <StatCard label="مجموع پرداخت‌ها" value={formatPrice(total)} icon={<ShoppingBag className="h-5 w-5" />} tone="teal" />
      </div>
      <DataTable
        caption="پرداخت‌ها"
        rows={payments}
        rowKey={(p) => p.id}
        columns={[
          { key: "title", header: "بابت", primary: true, render: (p) => p.title },
          { key: "id", header: "شناسه تراکنش", render: (p) => <span className="ltr">{p.id}</span> },
          { key: "order", header: "سفارش", render: (p) => <span className="ltr">{p.orderId}</span> },
          { key: "date", header: "تاریخ", render: (p) => formatDate(p.date) },
          { key: "amount", header: "مبلغ", render: (p) => (p.amount ? formatPrice(p.amount) : "رایگان") },
          { key: "status", header: "وضعیت", render: () => <StatusBadge status="موفق (آزمایشی)" /> },
        ]}
      />
    </div>
  );
}

/* ───────────── Learning library ───────────── */

export function MyCourses({ type }: { type: "courses" | "videos" }) {
  const owned = useOwnedProducts();
  const progress = useDemoStore((s) => s.lessonProgress);
  const items = owned.filter((p) => (type === "videos" ? p.type === "video" : p.type === "course" || p.type === "package"));
  return (
    <div>
      <PageTitle
        title={type === "videos" ? "ویدیوهای خریداری‌شده" : "دوره‌های من"}
        description="برای ادامه یادگیری روی هر مورد کلیک کنید."
      />
      {items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => {
            const total = p.curriculum?.flatMap((s) => s.lessons).length ?? 1;
            const done = progress[p.id]?.length ?? 0;
            const pct = Math.round((done / total) * 100);
            return (
              <article key={p.id} className="card overflow-hidden">
                <Cover title={p.title} tone={p.coverTone} type={p.type} className="aspect-[16/8]" />
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-navy-500">
                    <span>
                      {fa(done)} از {fa(total)} جلسه
                    </span>
                    <span className="font-bold text-teal-700">{fa(pct)}٪</span>
                  </div>
                  <ProgressBar value={pct} className="mt-2" />
                  <Link href={`/courses/${p.slug}/learn`} className="btn-primary mt-4 w-full">
                    <CirclePlay className="h-4 w-4" aria-hidden />
                    {pct === 100 ? "مرور دوباره" : pct ? "ادامه یادگیری" : "شروع"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={type === "videos" ? "ویدیویی خریداری نکرده‌اید" : "هنوز دوره‌ای ندارید"}
          description="از فروشگاه محتوا یک مورد را تهیه کنید تا اینجا نمایش داده شود."
          action={
            <Link href={type === "videos" ? "/store?type=video" : "/courses"} className="btn-primary">
              مشاهده محتوا
            </Link>
          }
        />
      )}
    </div>
  );
}

export function MyLibrary() {
  const owned = useOwnedProducts();
  const toast = useToast();
  const items = owned.filter((p) => p.type === "pdf" || p.type === "ebook");
  return (
    <div>
      <PageTitle title="کتاب‌ها و فایل‌ها" description="فایل‌های PDF و کتاب‌های الکترونیک تهیه‌شده." />
      {items.length ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((p) => (
            <li key={p.id} className="card flex gap-4 p-4">
              <Cover title={p.title} tone={p.coverTone} type={p.type} size="sm" className="aspect-[3/4] w-24 shrink-0 rounded-xl" showTitle={false} />
              <div className="flex min-w-0 flex-1 flex-col">
                <Badge tone="teal" className="w-fit">
                  {contentTypeLabels[p.type]}
                </Badge>
                <Link href={`/store/${p.slug}`} className="mt-2 line-clamp-2 font-bold hover:text-brand-700">
                  {p.title}
                </Link>
                <p className="mt-1 text-xs text-navy-500">
                  {p.author} · {fa(p.pages ?? 0)} صفحه · {p.fileSize}
                </p>
                <button
                  onClick={() => toast("دانلود نمایشی — فایل واقعی وجود ندارد.", "info")}
                  className="btn-outline btn-sm mt-auto w-fit"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  دانلود
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="فایلی ندارید" action={<Link href="/store?type=pdf" className="btn-primary">مشاهده فایل‌ها</Link>} />
      )}
    </div>
  );
}

/* ───────────── Notifications ───────────── */

export function NotificationsView() {
  const notifications = useDemoStore((s) => s.notifications);
  const iconFor = { appointment: CalendarCheck, course: GraduationCap, payment: CreditCard, system: Bell };
  return (
    <div>
      <PageTitle
        title="اعلان‌ها"
        description="در نسخه نهایی، اعلان‌ها از طریق پیامک، ایمیل و اپلیکیشن نیز ارسال می‌شوند."
        action={
          <button onClick={() => demoActions.markAllNotificationsRead()} className="btn-outline">
            <CircleCheck className="h-4 w-4" aria-hidden />
            علامت‌گذاری همه به‌عنوان خوانده‌شده
          </button>
        }
      />
      <ul className="space-y-3">
        {notifications.map((n) => {
          const Icon = iconFor[n.kind];
          return (
            <li key={n.id} className={cn("card flex gap-4 p-4", !n.read && "border-brand-200 bg-brand-50/30")}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-600 ring-1 ring-navy-100">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold">{n.title}</p>
                  <span className="text-xs text-navy-400">{formatDate(n.date)}</span>
                </div>
                <p className="mt-1 text-sm leading-6 text-navy-600">{n.body}</p>
              </div>
              {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="خوانده‌نشده" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

