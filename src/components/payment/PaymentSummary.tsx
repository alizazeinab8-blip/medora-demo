"use client";

import { useState } from "react";
import { BadgePercent, CreditCard, Lock, LoaderCircle, ShieldCheck } from "lucide-react";
import { cn, fa, formatPrice } from "@/lib/format";
import { DemoNotice } from "@/components/ui/primitives";

export interface PaymentLine {
  title: string;
  subtitle?: string;
  amount: number;
}

/** Demo discount codes. PRODUCTION: validated by POST /api/coupons/validate. */
const DEMO_COUPONS: Record<string, number> = { MEDORA10: 10, STUDENT20: 20 };

/**
 * Order summary + demo gateway. Used by course/book/video purchases,
 * appointments and consultations.
 * PRODUCTION: onPay creates an order and redirects to the real PSP (e.g. a Shaparak gateway);
 * success is confirmed only by the server-side verify callback.
 */
export function PaymentSummary({
  line,
  itemDiscount = 0,
  onPay,
  payLabel = "پرداخت آزمایشی",
}: {
  line: PaymentLine;
  /** Discount already applied to the item (e.g. course sale), in Toman. */
  itemDiscount?: number;
  onPay: (totals: { amount: number; discount: number; total: number }) => void;
  payLabel?: string;
}) {
  const [code, setCode] = useState("");
  const [couponPercent, setCouponPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [method, setMethod] = useState<"gateway" | "wallet">("gateway");
  const [paying, setPaying] = useState(false);

  const afterItemDiscount = line.amount - itemDiscount;
  const couponDiscount = Math.round((afterItemDiscount * couponPercent) / 100);
  const discount = itemDiscount + couponDiscount;
  const total = Math.max(0, line.amount - discount);

  const applyCoupon = () => {
    const pct = DEMO_COUPONS[code.trim().toUpperCase()];
    if (pct) {
      setCouponPercent(pct);
      setCouponMsg(`کد تخفیف ${fa(pct)}٪ اعمال شد.`);
    } else {
      setCouponPercent(0);
      setCouponMsg("کد تخفیف معتبر نیست. (کد نمایشی: MEDORA10)");
    }
  };

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      onPay({ amount: line.amount, discount, total });
    }, 1100);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        <section className="rounded-2xl border border-navy-100 p-5">
          <h3 className="text-sm font-bold">خلاصه سفارش</h3>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-navy-900">{line.title}</p>
              {line.subtitle && <p className="mt-1 text-xs text-navy-500">{line.subtitle}</p>}
            </div>
            <p className="shrink-0 text-sm font-semibold">{formatPrice(line.amount)}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-navy-100 p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <BadgePercent className="h-4 w-4 text-teal-600" aria-hidden />
            کد تخفیف
          </h3>
          <div className="mt-3 flex gap-2">
            <label htmlFor="coupon" className="sr-only">
              کد تخفیف
            </label>
            <input
              id="coupon"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثلاً MEDORA10"
              className="input ltr text-left"
            />
            <button type="button" onClick={applyCoupon} className="btn-outline shrink-0" disabled={!code.trim()}>
              اعمال
            </button>
          </div>
          {couponMsg && (
            <p className={cn("mt-2 text-xs", couponPercent ? "text-teal-700" : "text-red-600")} role="status">
              {couponMsg}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-navy-100 p-5">
          <h3 className="text-sm font-bold">روش پرداخت</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="روش پرداخت">
            {[
              { id: "gateway" as const, label: "درگاه بانکی (آزمایشی)", icon: CreditCard },
              { id: "wallet" as const, label: "کیف پول (آزمایشی)", icon: Lock },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={method === m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-right text-sm transition-colors",
                  method === m.id ? "border-brand-500 bg-brand-50/60 text-navy-900" : "border-navy-200 hover:border-brand-200",
                )}
              >
                <m.icon className="h-5 w-5 text-brand-600" aria-hidden />
                {m.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-navy-100 bg-surface p-5 lg:sticky lg:top-24">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-navy-500">مبلغ</dt>
            <dd>{formatPrice(line.amount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-navy-500">تخفیف</dt>
            <dd className={discount ? "text-red-600" : ""}>{discount ? `− ${formatPrice(discount)}` : "—"}</dd>
          </div>
          <div className="flex justify-between border-t border-navy-200 pt-3 text-base font-extrabold">
            <dt>مبلغ نهایی</dt>
            <dd>{total === 0 ? "رایگان" : formatPrice(total)}</dd>
          </div>
        </dl>
        <button type="button" onClick={pay} disabled={paying} className="btn-primary mt-5 w-full py-3">
          {paying ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
              در حال اتصال به درگاه آزمایشی...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" aria-hidden />
              {payLabel}
            </>
          )}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-navy-500">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
          اتصال امن در نسخه نهایی
        </p>
        <DemoNotice className="mt-4">هیچ پرداخت واقعی انجام نمی‌شود و به درگاه بانکی متصل نیست.</DemoNotice>
      </aside>
    </div>
  );
}
