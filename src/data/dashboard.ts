import type { Appointment, Consultation, Notification, Order } from "@/types";

/**
 * DEMO DATA — the logged-in demo patient account, doctor workload and admin statistics.
 * Seeds the localStorage demo store on first visit.
 */

export const demoUser = {
  id: "u-1001",
  name: "مریم احمدی",
  email: "maryam@demo.example",
  phone: "0900-120-3400",
  city: "تهران",
  memberSince: "2025-11-02",
  patientId: "P-10210",
};

export const seedAppointments: Appointment[] = [
  {
    id: "MD-418220",
    serviceKind: "in-person",
    doctorId: "dr-1",
    date: "2026-10-04",
    time: "10:00",
    patientName: "مریم احمدی",
    phone: "0900-120-3400",
    notes: "ویزیت پیگیری",
    status: "confirmed",
    amount: 450000,
    createdAt: "2026-09-21",
  },
  {
    id: "MD-390114",
    serviceKind: "phone",
    doctorId: "dr-3",
    date: "2026-09-10",
    time: "16:30",
    patientName: "مریم احمدی",
    phone: "0900-120-3400",
    status: "done",
    amount: 400000,
    createdAt: "2026-09-06",
  },
  {
    id: "MD-377902",
    serviceKind: "in-person",
    doctorId: "dr-1",
    date: "2026-08-12",
    time: "09:30",
    patientName: "مریم احمدی",
    phone: "0900-120-3400",
    status: "done",
    amount: 450000,
    createdAt: "2026-08-05",
  },
];

export const seedConsultations: Consultation[] = [
  {
    id: "CN-5521",
    subject: "بررسی نتیجه آزمایش خون",
    doctorId: "dr-1",
    status: "answered",
    createdAt: "2026-09-18",
    messages: [
      {
        id: "m1",
        from: "system",
        text: "پرداخت آزمایشی انجام شد. گفت‌وگو آغاز شد.",
        time: "۱۸ شهریور — ۰۹:۱۲",
      },
      {
        id: "m2",
        from: "patient",
        text: "سلام دکتر، نتیجه آزمایش خونی که هفته پیش دادم را پیوست کرده‌ام. ممکن است بررسی کنید؟ (پیام نمایشی)",
        time: "۱۸ شهریور — ۰۹:۱۵",
        attachment: { name: "آزمایش-خون-نمونه.pdf", size: "۴۸۰ KB", kind: "file" },
      },
      {
        id: "m3",
        from: "doctor",
        text: "سلام، وقت بخیر. فایل را دریافت کردم. این یک پاسخ نمایشی است و محتوای پزشکی واقعی ندارد. در نسخه واقعی، پاسخ پزشک اینجا نمایش داده می‌شود.",
        time: "۱۸ شهریور — ۱۱:۴۰",
      },
      {
        id: "m4",
        from: "patient",
        text: "ممنون از پاسخ‌تان. آیا لازم است برای ویزیت حضوری هم نوبت بگیرم؟",
        time: "۱۸ شهریور — ۱۲:۰۲",
      },
      {
        id: "m5",
        from: "doctor",
        text: "(پاسخ نمایشی) در صورت نیاز به معاینه، از بخش نوبت‌دهی می‌توانید نوبت حضوری ثبت کنید.",
        time: "۱۸ شهریور — ۱۳:۲۵",
      },
    ],
  },
  {
    id: "CN-5487",
    subject: "سؤال درباره برنامه پیگیری",
    doctorId: "dr-2",
    status: "closed",
    createdAt: "2026-08-29",
    messages: [
      { id: "m1", from: "patient", text: "سلام، سؤال نمایشی درباره زمان ویزیت بعدی.", time: "۷ شهریور — ۱۰:۰۰" },
      { id: "m2", from: "doctor", text: "پاسخ نمایشی پزشک.", time: "۷ شهریور — ۱۴:۲۰" },
    ],
  },
];

export const seedOrders: Order[] = [
  {
    id: "OR-88213",
    itemId: "p-labs",
    itemTitle: "راهنمای جامع تفسیر آزمایش‌های شایع",
    kind: "pdf",
    amount: 380000,
    discount: 0,
    total: 380000,
    status: "paid",
    date: "2026-09-15",
  },
  {
    id: "OR-87940",
    itemId: "p-exam",
    itemTitle: "اصول معاینه فیزیکی",
    kind: "course",
    amount: 1900000,
    discount: 190000,
    total: 1710000,
    status: "paid",
    date: "2026-09-02",
  },
  {
    id: "OR-86102",
    itemId: "MD-390114",
    itemTitle: "مشاوره تلفنی — نوبت MD-390114",
    kind: "appointment",
    amount: 400000,
    discount: 0,
    total: 400000,
    status: "paid",
    date: "2026-09-06",
  },
];

/** Product ids the demo user already owns. */
export const seedPurchases = ["p-labs", "p-exam", "p-interactions"];

export const seedNotifications: Notification[] = [
  {
    id: "n1",
    title: "یادآوری نوبت",
    body: "نوبت حضوری شما در تاریخ ۱۲ مهر ساعت ۱۰:۰۰ ثبت شده است.",
    date: "2026-09-26",
    read: false,
    kind: "appointment",
  },
  {
    id: "n2",
    title: "پاسخ پزشک",
    body: "پزشک به مشاوره «بررسی نتیجه آزمایش خون» پاسخ داد.",
    date: "2026-09-18",
    read: false,
    kind: "system",
  },
  {
    id: "n3",
    title: "جلسه جدید دوره",
    body: "جلسه جدید دوره «اصول معاینه فیزیکی» منتشر شد.",
    date: "2026-09-12",
    read: true,
    kind: "course",
  },
  {
    id: "n4",
    title: "رسید پرداخت",
    body: "پرداخت آزمایشی سفارش OR-88213 با موفقیت ثبت شد.",
    date: "2026-09-15",
    read: true,
    kind: "payment",
  },
];

/* ───────────── Doctor workload (demo) ───────────── */

export const doctorToday = [
  { time: "09:00", patient: "علی رضایی", patientId: "P-10217", service: "in-person" as const, status: "done" as const },
  { time: "09:30", patient: "زهرا کریمی", patientId: "P-10224", service: "in-person" as const, status: "done" as const },
  { time: "10:00", patient: "حسین موسوی", patientId: "P-10231", service: "phone" as const, status: "in-progress" as const },
  { time: "11:30", patient: "فاطمه حسینی", patientId: "P-10238", service: "in-person" as const, status: "waiting" as const },
  { time: "16:00", patient: "محمد جعفری", patientId: "P-10245", service: "online" as const, status: "waiting" as const },
  { time: "17:30", patient: "سمیرا نوروزی", patientId: "P-10252", service: "phone" as const, status: "waiting" as const },
];

export const doctorUpcoming = [
  { date: "2026-09-28", count: 8 },
  { date: "2026-09-29", count: 6 },
  { date: "2026-09-30", count: 9 },
  { date: "2026-10-01", count: 4 },
  { date: "2026-10-03", count: 7 },
];

export const consultationRequests = [
  { id: "CN-5610", patient: "رضا قاسمی", subject: "بررسی نتیجه آزمایش", waiting: "۲ ساعت", priority: "normal" as const },
  { id: "CN-5608", patient: "نرگس صادقی", subject: "سؤال درباره داروها", waiting: "۵ ساعت", priority: "high" as const },
  { id: "CN-5601", patient: "امیر حیدری", subject: "پیگیری پس از ویزیت", waiting: "۱ روز", priority: "normal" as const },
  { id: "CN-5597", patient: "لیلا مرادی", subject: "ارسال تصویر نمایشی", waiting: "۱ روز", priority: "normal" as const },
];

export const doctorMessages = [
  { from: "منشی مطب", text: "برنامه نوبت‌های پنجشنبه به‌روز شد.", time: "۱۰:۴۵" },
  { from: "مهدی باقری", text: "پیام نمایشی بیمار درباره زمان نوبت.", time: "۰۹:۲۰" },
  { from: "سیستم", text: "۳ درخواست مشاوره جدید در صف پاسخ‌گویی است.", time: "۰۸:۰۰" },
];

export const doctorActivity = [
  { text: "ویزیت «زهرا کریمی» تکمیل و در پرونده ثبت شد.", time: "۱۰ دقیقه پیش" },
  { text: "پاسخ به مشاوره CN-5599 ارسال شد.", time: "۱ ساعت پیش" },
  { text: "فایل آزمایش «علی رضایی» بارگذاری شد.", time: "۲ ساعت پیش" },
  { text: "نوبت جدید برای فردا ساعت ۱۶:۰۰ ثبت شد.", time: "۳ ساعت پیش" },
];

/* ───────────── Admin statistics (demo) ───────────── */

export const adminStats = {
  users: 8420,
  patients: 3175,
  appointments: 612,
  orders: 1284,
  revenue: 1_486_000_000,
  activeCourses: 14,
};

/** Monthly revenue in million Toman — last 6 Persian months. */
export const monthlyRevenue = [
  { label: "فروردین", appointments: 118, education: 96 },
  { label: "اردیبهشت", appointments: 132, education: 121 },
  { label: "خرداد", appointments: 125, education: 140 },
  { label: "تیر", appointments: 141, education: 132 },
  { label: "مرداد", appointments: 156, education: 168 },
  { label: "شهریور", appointments: 162, education: 185 },
];

export const appointmentsByService = [
  { label: "ویزیت حضوری", value: 318 },
  { label: "ویزیت آنلاین", value: 187 },
  { label: "مشاوره تلفنی", value: 107 },
];

export const adminUsers = [
  { id: "u-1001", name: "مریم احمدی", role: "بیمار", email: "maryam@demo.example", joined: "2025-11-02", status: "فعال" },
  { id: "u-1002", name: "دکتر آرمان نیک‌پور", role: "پزشک", email: "dr.nikpour@demo.example", joined: "2025-06-14", status: "فعال" },
  { id: "u-1003", name: "علی رضایی", role: "بیمار", email: "ali@demo.example", joined: "2026-01-20", status: "فعال" },
  { id: "u-1004", name: "دکتر نگین فرهادی", role: "مدرس", email: "farhadi@demo.example", joined: "2025-09-03", status: "فعال" },
  { id: "u-1005", name: "سارا توکلی", role: "دانشجو", email: "sara.t@demo.example", joined: "2026-03-11", status: "فعال" },
  { id: "u-1006", name: "امید کاظمی", role: "دانشجو", email: "omid@demo.example", joined: "2026-05-28", status: "غیرفعال" },
  { id: "u-1007", name: "مدیر سیستم", role: "مدیر", email: "admin@demo.example", joined: "2025-06-01", status: "فعال" },
  { id: "u-1008", name: "نیلوفر عباسی", role: "بیمار", email: "niloofar@demo.example", joined: "2026-07-09", status: "فعال" },
];

export const adminOrders = [
  { id: "OR-88240", customer: "سارا توکلی", item: "الکتروکاردیوگرافی برای پزشکان", amount: 2320000, date: "2026-09-26", status: "پرداخت‌شده" },
  { id: "OR-88236", customer: "امید کاظمی", item: "مرور داروشناسی بالینی", amount: 468000, date: "2026-09-26", status: "پرداخت‌شده" },
  { id: "OR-88229", customer: "علی رضایی", item: "ویزیت حضوری — MD-418301", amount: 450000, date: "2026-09-25", status: "پرداخت‌شده" },
  { id: "OR-88221", customer: "نیلوفر عباسی", item: "پکیج جامع داروشناسی", amount: 1260000, date: "2026-09-25", status: "در انتظار" },
  { id: "OR-88213", customer: "مریم احمدی", item: "راهنمای جامع تفسیر آزمایش‌های شایع", amount: 380000, date: "2026-09-15", status: "پرداخت‌شده" },
  { id: "OR-88190", customer: "کامران شریفی", item: "فوریت‌های داخلی", amount: 2600000, date: "2026-09-14", status: "مسترد شده" },
];

export const adminAppointments = [
  { id: "MD-418301", patient: "علی رضایی", doctor: "دکتر آرمان نیک‌پور", service: "ویزیت حضوری", date: "2026-09-28", time: "09:00", status: "تأیید‌شده" },
  { id: "MD-418290", patient: "زهرا کریمی", doctor: "دکتر سارا مهرآیین", service: "ویزیت آنلاین", date: "2026-09-28", time: "11:30", status: "تأیید‌شده" },
  { id: "MD-418277", patient: "حسین موسوی", doctor: "دکتر کیان رحیمی", service: "مشاوره تلفنی", date: "2026-09-29", time: "16:00", status: "در انتظار پرداخت" },
  { id: "MD-418220", patient: "مریم احمدی", doctor: "دکتر آرمان نیک‌پور", service: "ویزیت حضوری", date: "2026-10-04", time: "10:00", status: "تأیید‌شده" },
  { id: "MD-418198", patient: "فاطمه حسینی", doctor: "دکتر آرمان نیک‌پور", service: "ویزیت حضوری", date: "2026-09-26", time: "17:30", status: "لغوشده" },
];

export const adminConsultations = [
  { id: "CN-5610", patient: "رضا قاسمی", doctor: "دکتر آرمان نیک‌پور", subject: "بررسی نتیجه آزمایش", date: "2026-09-27", status: "در انتظار پاسخ" },
  { id: "CN-5608", patient: "نرگس صادقی", doctor: "دکتر آرمان نیک‌پور", subject: "سؤال درباره داروها", date: "2026-09-27", status: "در انتظار پاسخ" },
  { id: "CN-5599", patient: "مهدی باقری", doctor: "دکتر سارا مهرآیین", subject: "پیگیری پس از ویزیت", date: "2026-09-25", status: "پاسخ داده‌شده" },
  { id: "CN-5521", patient: "مریم احمدی", doctor: "دکتر آرمان نیک‌پور", subject: "بررسی نتیجه آزمایش خون", date: "2026-09-18", status: "پاسخ داده‌شده" },
];

export const adminPayments = [
  { id: "PAY-99120", ref: "OR-88240", payer: "سارا توکلی", amount: 2320000, method: "درگاه آزمایشی", date: "2026-09-26", status: "موفق" },
  { id: "PAY-99118", ref: "OR-88236", payer: "امید کاظمی", amount: 468000, method: "درگاه آزمایشی", date: "2026-09-26", status: "موفق" },
  { id: "PAY-99111", ref: "OR-88229", payer: "علی رضایی", amount: 450000, method: "درگاه آزمایشی", date: "2026-09-25", status: "موفق" },
  { id: "PAY-99104", ref: "OR-88221", payer: "نیلوفر عباسی", amount: 1260000, method: "درگاه آزمایشی", date: "2026-09-25", status: "ناموفق" },
  { id: "PAY-99081", ref: "OR-88190", payer: "کامران شریفی", amount: 2600000, method: "درگاه آزمایشی", date: "2026-09-14", status: "مسترد شده" },
];
