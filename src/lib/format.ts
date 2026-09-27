import { currency } from "@/config/site";

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert Latin digits in a string/number to Persian digits. */
export function fa(value: string | number): string {
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)]);
}

/** 1250000 → "۱٬۲۵۰٬۰۰۰" */
export function faNumber(n: number): string {
  return n.toLocaleString("fa-IR");
}

/** Price label in Toman, or "رایگان" for 0. */
export function formatPrice(n: number): string {
  if (n === 0) return "رایگان";
  return `${faNumber(n)} ${currency.label}`;
}

export function discounted(price: number, discountPercent?: number): number {
  if (!discountPercent) return price;
  return Math.round((price * (100 - discountPercent)) / 100 / 1000) * 1000;
}

const persianDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "long",
  day: "numeric",
});
const persianShort = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const persianWeekday = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  weekday: "long",
});
const persianDayMonth = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
});

function toDate(iso: string): Date {
  // Treat plain dates as local noon to avoid timezone day-shift.
  return /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00`) : new Date(iso);
}

/** "2026-09-27" → "۵ مهر ۱۴۰۵" */
export function formatDate(iso: string): string {
  return persianDate.format(toDate(iso));
}

/** "2026-09-27" → "۱۴۰۵/۰۷/۰۵" */
export function formatDateShort(iso: string): string {
  return persianShort.format(toDate(iso));
}

export function formatWeekday(iso: string): string {
  return persianWeekday.format(toDate(iso));
}

export function formatDayMonth(iso: string): string {
  return persianDayMonth.format(toDate(iso));
}

/** Local ISO date (yyyy-mm-dd) for a Date. */
export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(iso: string, n: number): string {
  const d = toDate(iso);
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

/** Demo-only id generator, e.g. "MD-482913". */
export function demoId(prefix: string): string {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
