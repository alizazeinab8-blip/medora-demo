"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarCheck, GraduationCap, Plus, ShoppingBag, UserCog, Users, Wallet } from "lucide-react";
import { GroupedBarChart, HBarChart, Sparkline } from "@/components/charts/Charts";
import { DataTable, SearchBar, type Column } from "@/components/ui/controls";
import { Badge, DemoNotice, StatusBadge } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  adminAppointments,
  adminConsultations,
  adminOrders,
  adminPayments,
  adminStats,
  adminUsers,
  appointmentsByService,
  monthlyRevenue,
} from "@/data/dashboard";
import { contentTypeLabels, categoryLabel, products } from "@/data/catalog";
import { doctors } from "@/data/services";
import { discounted, fa, faNumber, formatDate, formatPrice } from "@/lib/format";
import { siteConfig } from "@/config/site";

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

type Row = Record<string, string | number>;

/* ───────────── Section registry (tables) ───────────── */

const courseRows: Row[] = products
  .filter((p) => p.type === "course" || p.type === "package")
  .map((p) => ({ id: p.id, title: p.title, instructor: p.author, sessions: p.sessions ?? 0, students: p.students ?? 0, price: discounted(p.price, p.discountPercent), status: "منتشرشده" }));

const productRow = (p: (typeof products)[number]): Row => ({
  id: p.id,
  title: p.title,
  type: contentTypeLabels[p.type],
  author: p.author,
  category: categoryLabel(p.category),
  price: discounted(p.price, p.discountPercent),
  discount: p.discountPercent ?? 0,
  sales: p.students ?? p.reviews * 3,
  status: "منتشرشده",
});

const text = (k: string, primary = false, ltr = false): Column<Row> => ({
  key: k,
  header: k,
  primary,
  render: (r) => (ltr ? <span className="ltr">{String(r[k])}</span> : String(r[k])),
});
const h = (c: Column<Row>, header: string): Column<Row> => ({ ...c, header });
const money = (k: string, header: string): Column<Row> => ({ key: k, header, render: (r) => (Number(r[k]) ? formatPrice(Number(r[k])) : "رایگان") });
const date = (k: string, header: string): Column<Row> => ({ key: k, header, render: (r) => formatDate(String(r[k])) });
const status = (k: string, header = "وضعیت"): Column<Row> => ({ key: k, header, render: (r) => <StatusBadge status={String(r[k])} /> });
const num = (k: string, header: string): Column<Row> => ({ key: k, header, render: (r) => faNumber(Number(r[k])) });

export const adminSections: Record<string, { title: string; description: string; addLabel?: string; rows: Row[]; columns: Column<Row>[] }> = {
  users: {
    title: "کاربران",
    description: "مدیریت کاربران و نقش‌ها (بیمار، پزشک، مدرس، دانشجو، مدیر).",
    addLabel: "افزودن کاربر",
    rows: adminUsers,
    columns: [h(text("name", true), "نام"), h(text("id", false, true), "شناسه"), { key: "role", header: "نقش", render: (r) => <Badge tone="blue">{String(r.role)}</Badge> }, h(text("email", false, true), "ایمیل"), date("joined", "تاریخ عضویت"), status("status")],
  },
  doctors: {
    title: "پزشکان",
    description: "ساختار چندپزشکی: هر پزشک برنامه زمانی، خدمات و تعرفه جداگانه دارد.",
    addLabel: "افزودن پزشک",
    rows: doctors.map((d) => ({ id: d.id, name: d.name, specialty: d.specialty, services: d.services.length, rating: d.rating, next: d.nextAvailable, status: "فعال" })),
    columns: [h(text("name", true), "نام پزشک"), h(text("specialty"), "تخصص"), num("services", "تعداد خدمات"), { key: "rating", header: "امتیاز", render: (r) => fa(r.rating) }, h(text("next"), "اولین نوبت خالی"), status("status")],
  },
  content: {
    title: "محتوا",
    description: "همه محتوای آموزشی منتشرشده در پلتفرم.",
    addLabel: "افزودن محتوا",
    rows: products.map(productRow),
    columns: [h(text("title", true), "عنوان"), h(text("type"), "نوع"), h(text("author"), "مدرس / نویسنده"), h(text("category"), "دسته‌بندی"), status("status")],
  },
  books: {
    title: "کتاب‌ها و فایل‌ها",
    description: "کتاب‌های الکترونیک و فایل‌های PDF.",
    addLabel: "افزودن کتاب / فایل",
    rows: products.filter((p) => p.type === "pdf" || p.type === "ebook").map((p) => ({ ...productRow(p), pages: p.pages ?? 0, size: p.fileSize ?? "" })),
    columns: [h(text("title", true), "عنوان"), h(text("type"), "نوع"), h(text("author"), "نویسنده"), num("pages", "صفحات"), h(text("size"), "حجم"), money("price", "قیمت")],
  },
  videos: {
    title: "ویدیوها",
    description: "ویدیوهای آموزشی. در نسخه نهایی، آپلود به سرویس ویدیوی امن و تبدیل خودکار کیفیت‌ها.",
    addLabel: "آپلود ویدیو",
    rows: products.filter((p) => p.type === "video").map((p) => ({ ...productRow(p), duration: p.duration ?? "" })),
    columns: [h(text("title", true), "عنوان"), h(text("author"), "مدرس"), h(text("duration"), "مدت"), money("price", "قیمت"), num("sales", "مشاهده / فروش"), status("status")],
  },
  courses: {
    title: "دوره‌ها",
    description: "دوره‌ها و پکیج‌های آموزشی، جلسات و دانشجویان.",
    addLabel: "ایجاد دوره",
    rows: courseRows,
    columns: [h(text("title", true), "عنوان دوره"), h(text("instructor"), "مدرس"), num("sessions", "جلسات"), num("students", "دانشجو"), money("price", "قیمت"), status("status")],
  },
  products: {
    title: "محصولات",
    description: "قیمت‌گذاری، تخفیف و فروش همه محصولات آموزشی.",
    addLabel: "افزودن محصول",
    rows: products.map(productRow),
    columns: [
      h(text("title", true), "محصول"),
      h(text("type"), "نوع"),
      money("price", "قیمت نهایی"),
      { key: "discount", header: "تخفیف", render: (r) => (Number(r.discount) ? `${fa(r.discount)}٪` : "—") },
      num("sales", "فروش"),
      status("status"),
    ],
  },
  orders: {
    title: "سفارش‌ها",
    description: "همه سفارش‌های محتوا، نوبت و مشاوره.",
    rows: adminOrders,
    columns: [h(text("item", true), "محصول / خدمت"), h(text("id", false, true), "شماره سفارش"), h(text("customer"), "مشتری"), money("amount", "مبلغ"), date("date", "تاریخ"), status("status")],
  },
  payments: {
    title: "پرداخت‌ها",
    description: "تراکنش‌های درگاه (آزمایشی). در نسخه نهایی با تطبیق خودکار درگاه.",
    rows: adminPayments,
    columns: [h(text("payer", true), "پرداخت‌کننده"), h(text("id", false, true), "شناسه تراکنش"), h(text("ref", false, true), "سفارش"), money("amount", "مبلغ"), h(text("method"), "روش"), date("date", "تاریخ"), status("status")],
  },
  appointments: {
    title: "نوبت‌ها",
    description: "همه نوبت‌های پزشکان.",
    rows: adminAppointments,
    columns: [h(text("patient", true), "بیمار"), h(text("id", false, true), "شماره نوبت"), h(text("doctor"), "پزشک"), h(text("service"), "خدمت"), date("date", "تاریخ"), { key: "time", header: "ساعت", render: (r) => fa(String(r.time)) }, status("status")],
  },
  consultations: {
    title: "مشاوره‌ها",
    description: "درخواست‌های ویزیت آنلاین و وضعیت پاسخ‌گویی.",
    rows: adminConsultations,
    columns: [h(text("subject", true), "موضوع"), h(text("id", false, true), "شماره"), h(text("patient"), "بیمار"), h(text("doctor"), "پزشک"), date("date", "تاریخ"), status("status")],
  },
};

export function AdminSection({ section }: { section: string }) {
  const cfg = adminSections[section];
  const toast = useToast();
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const rows = useMemo(
    () => (q.trim() ? cfg.rows.filter((r) => Object.values(r).some((v) => String(v).includes(q.trim()))) : cfg.rows),
    [cfg.rows, q],
  );

  return (
    <div>
      <Title
        title={cfg.title}
        description={cfg.description}
        action={
          cfg.addLabel && (
            <button className="btn-primary" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" aria-hidden />
              {cfg.addLabel}
            </button>
          )
        }
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={q} onChange={setQ} placeholder={`جستجو در ${cfg.title}...`} className="sm:w-80" label={`جستجو در ${cfg.title}`} />
        <p className="text-sm text-navy-500">{fa(rows.length)} مورد</p>
      </div>
      <DataTable caption={cfg.title} rows={rows} rowKey={(r) => String(r.id)} columns={cfg.columns} />

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={cfg.addLabel ?? ""}
        footer={
          <>
            <button className="btn-outline" onClick={() => setAddOpen(false)}>
              انصراف
            </button>
            <button
              className="btn-primary"
              onClick={() => {
                setAddOpen(false);
                toast("ذخیره نمایشی انجام شد — در نسخه نهایی به API مدیریت متصل می‌شود.");
              }}
            >
              ذخیره
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <label className="block">
            <span className="label">عنوان / نام</span>
            <input className="input" placeholder="..." />
          </label>
          <label className="block">
            <span className="label">توضیحات</span>
            <textarea className="input min-h-[90px]" />
          </label>
          <DemoNotice>فرم نمایشی است و اطلاعاتی ذخیره نمی‌شود.</DemoNotice>
        </div>
      </Modal>
    </div>
  );
}

/* ───────────── Overview ───────────── */

export function AdminOverview() {
  const s = adminStats;
  const stats = [
    { label: "کاربران", value: faNumber(s.users), icon: UserCog, trend: [60, 64, 70, 73, 80, 84] },
    { label: "بیماران", value: faNumber(s.patients), icon: Users, trend: [22, 24, 25, 27, 29, 31] },
    { label: "نوبت‌ها (ماه جاری)", value: faNumber(s.appointments), icon: CalendarCheck, trend: [118, 132, 125, 141, 156, 162] },
    { label: "سفارش‌ها", value: faNumber(s.orders), icon: ShoppingBag, trend: [90, 110, 124, 118, 140, 152] },
    { label: "درآمد (نمایشی)", value: `${faNumber(Math.round(s.revenue / 1_000_000))} م.ت`, icon: Wallet, trend: [214, 253, 265, 273, 324, 347] },
    { label: "دوره‌های فعال", value: fa(s.activeCourses), icon: GraduationCap, trend: [9, 10, 11, 12, 13, 14] },
  ];

  return (
    <div>
      <Title title="داشبورد مدیریت" description={`نمای کلی عملکرد ${siteConfig.brand.nameFa} — همه اعداد ساختگی هستند.`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, trend }) => (
          <div key={label} className="card flex items-center justify-between gap-3 p-5">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-navy-500">{label}</p>
                <p className="mt-1 truncate text-xl font-extrabold">{value}</p>
              </div>
            </div>
            <Sparkline values={trend} className="shrink-0" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <GroupedBarChart
          title="درآمد ماهانه به تفکیک بخش"
          unit="میلیون تومان"
          data={monthlyRevenue}
          series={[
            { key: "appointments", label: "خدمات درمانی", color: "#1f57e0" },
            { key: "education", label: "آموزش", color: "#46b9ac" },
          ]}
        />
        <HBarChart title="نوبت‌های ماه جاری به تفکیک خدمت" data={appointmentsByService} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <MiniTable title="آخرین نوبت‌ها" href="/admin/appointments" section="appointments" />
        <MiniTable title="آخرین سفارش‌ها" href="/admin/orders" section="orders" />
        <MiniTable title="کاربران جدید" href="/admin/users" section="users" />
        <MiniTable title="دوره‌ها" href="/admin/courses" section="courses" />
      </div>
    </div>
  );
}

function MiniTable({ title, href, section }: { title: string; href: string; section: string }) {
  const cfg = adminSections[section];
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <Link href={href} className="text-xs font-semibold text-brand-700">
          مشاهده همه
        </Link>
      </div>
      <DataTable caption={title} rows={cfg.rows.slice(0, 4)} rowKey={(r) => String(r.id)} columns={cfg.columns.slice(0, 4)} />
    </section>
  );
}

/* ───────────── Settings ───────────── */

export function AdminSettings() {
  const toast = useToast();
  const [toggles, setToggles] = useState({ sms: true, online: true, phone: true, reviews: false, maintenance: false });
  const labels: Record<keyof typeof toggles, string> = {
    sms: "ارسال پیامک یادآوری نوبت",
    online: "فعال بودن ویزیت آنلاین",
    phone: "فعال بودن مشاوره تلفنی",
    reviews: "نمایش نظرات کاربران",
    maintenance: "حالت تعمیر و نگهداری",
  };
  return (
    <div>
      <Title title="تنظیمات" description="تنظیمات عمومی پلتفرم (نمایشی)." />
      <div className="grid gap-6 xl:grid-cols-2">
        <form
          className="card space-y-4 p-5 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast("تنظیمات (به‌صورت نمایشی) ذخیره شد.");
          }}
        >
          <h2 className="font-bold">اطلاعات برند و تماس</h2>
          {[
            ["نام برند", siteConfig.brand.nameFa, false],
            ["تلفن", siteConfig.contact.phone, true],
            ["ایمیل", siteConfig.contact.email, true],
            ["آدرس", siteConfig.contact.address, false],
          ].map(([label, value, ltr]) => (
            <label key={label as string} className="block">
              <span className="label">{label as string}</span>
              <input className={ltr ? "input ltr text-left" : "input"} defaultValue={value as string} />
            </label>
          ))}
          <p className="text-xs text-navy-500">در این نسخه، برند از فایل src/config/site.ts خوانده می‌شود.</p>
          <button className="btn-primary">ذخیره</button>
        </form>
        <div className="card p-5 sm:p-6">
          <h2 className="font-bold">ویژگی‌ها</h2>
          <ul className="mt-4 divide-y divide-navy-100">
            {(Object.keys(toggles) as (keyof typeof toggles)[]).map((k) => (
              <li key={k} className="flex items-center justify-between gap-4 py-3.5">
                <span className="text-sm">{labels[k]}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={toggles[k]}
                  aria-label={labels[k]}
                  onClick={() => setToggles((t) => ({ ...t, [k]: !t[k] }))}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${toggles[k] ? "bg-brand-600" : "bg-navy-200"}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${toggles[k] ? "right-0.5" : "right-[22px]"}`} />
                </button>
              </li>
            ))}
          </ul>
          <DemoNotice className="mt-4">کلیدها فقط در همین صفحه تغییر می‌کنند.</DemoNotice>
        </div>
      </div>
    </div>
  );
}
