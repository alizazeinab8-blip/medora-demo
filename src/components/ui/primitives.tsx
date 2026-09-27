import type { ReactNode } from "react";
import { Info, Star } from "lucide-react";
import { cn, discounted, fa, faNumber, formatPrice } from "@/lib/format";

/* ───────────── Section heading ───────────── */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <As className={cn("font-extrabold leading-snug", As === "h1" ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
          {title}
        </As>
        {description && <p className="mt-2 text-sm leading-7 text-navy-500 sm:text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ───────────── Page header (inner pages) ───────────── */

export function PageHeader({
  title,
  description,
  breadcrumb,
  children,
}: {
  title: string;
  description?: string;
  breadcrumb?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-navy-100 bg-surface">
      <div className="container py-10 sm:py-14">
        {breadcrumb && <p className="eyebrow mb-3">{breadcrumb}</p>}
        <h1 className="text-2xl font-extrabold leading-snug sm:text-3xl">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-sm leading-7 text-navy-500 sm:text-base">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

/* ───────────── Badge ───────────── */

type BadgeTone = "blue" | "teal" | "navy" | "gray" | "amber" | "red" | "green";

const badgeTones: Record<BadgeTone, string> = {
  blue: "bg-brand-50 text-brand-700",
  teal: "bg-teal-50 text-teal-700",
  navy: "bg-navy-900 text-white",
  gray: "bg-navy-50 text-navy-600",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  green: "bg-emerald-50 text-emerald-700",
};

export function Badge({ children, tone = "gray", className }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return <span className={cn("chip", badgeTones[tone], className)}>{children}</span>;
}

/** Maps common Persian status labels to badge colors. */
export function StatusBadge({ status }: { status: string }) {
  const tone: BadgeTone =
    /لغو|ناموفق|مسترد|عدم|غیرفعال/.test(status)
      ? "red"
      : /انتظار|در حال|باز/.test(status)
        ? "amber"
        : /آینده|تأیید|فعال|پاسخ داده|موفق|پرداخت‌شده|انجام|تکمیل|بسته/.test(status)
          ? "green"
          : "gray";
  return <Badge tone={tone}>{status}</Badge>;
}

/* ───────────── Rating ───────────── */

export function Rating({ value, reviews, className }: { value: number; reviews?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-navy-500", className)}>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
      <span className="font-semibold text-navy-800">{fa(value.toFixed(1))}</span>
      {reviews !== undefined && <span>({fa(reviews)} نظر)</span>}
      <span className="sr-only">امتیاز {fa(value)} از ۵</span>
    </span>
  );
}

/* ───────────── Price ───────────── */

export function Price({
  price,
  discountPercent,
  size = "md",
}: {
  price: number;
  discountPercent?: number;
  size?: "md" | "lg";
}) {
  if (price === 0) {
    return <span className={cn("font-bold text-teal-600", size === "lg" ? "text-2xl" : "text-sm")}>رایگان</span>;
  }
  const final = discounted(price, discountPercent);
  return (
    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      {discountPercent ? (
        <span className={cn("text-navy-400 line-through", size === "lg" ? "text-sm" : "text-xs")}>{faNumber(price)}</span>
      ) : null}
      <span className={cn("font-bold text-navy-900", size === "lg" ? "text-2xl" : "text-sm")}>{formatPrice(final)}</span>
    </span>
  );
}

/* ───────────── Demo disclaimer ───────────── */

export function DemoNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs leading-6 text-amber-900", className)}>
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

/* ───────────── Avatar ───────────── */

export function Avatar({ initials, size = "md", className }: { initials: string; size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-700 ring-1 ring-brand-100",
        size === "sm" && "h-8 w-8 text-[11px]",
        size === "md" && "h-11 w-11 text-sm",
        size === "lg" && "h-16 w-16 text-lg",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function initialsOf(name: string): string {
  const parts = name.replace(/^دکتر\s+/, "").split(" ").filter(Boolean);
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("‌");
}

/* ───────────── Stat card ───────────── */

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: "blue" | "teal" | "navy" | "amber";
}) {
  return (
    <div className="card flex items-start gap-4 p-5">
      {icon && (
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            tone === "blue" && "bg-brand-50 text-brand-600",
            tone === "teal" && "bg-teal-50 text-teal-600",
            tone === "navy" && "bg-navy-50 text-navy-700",
            tone === "amber" && "bg-amber-50 text-amber-600",
          )}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-xs text-navy-500">{label}</p>
        <p className="mt-1 truncate text-xl font-extrabold text-navy-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
      </div>
    </div>
  );
}

/* ───────────── Empty state ───────────── */

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-surface px-6 py-12 text-center">
      <p className="font-bold text-navy-800">{title}</p>
      {description && <p className="mt-2 max-w-sm text-sm leading-6 text-navy-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ───────────── Progress bar ───────────── */

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-navy-100", className)}
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}
