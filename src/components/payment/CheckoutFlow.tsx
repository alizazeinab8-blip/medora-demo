"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, Receipt } from "lucide-react";
import type { Product } from "@/types";
import { PaymentSummary } from "./PaymentSummary";
import { Cover } from "@/components/ui/Cover";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { contentTypeLabels, isLearnable } from "@/data/catalog";
import { discounted, formatPrice } from "@/lib/format";

export function CheckoutFlow({ product }: { product: Product }) {
  const purchases = useDemoStore((s) => s.purchases);
  const [receipt, setReceipt] = useState<{ orderId: string; total: number } | null>(null);
  const alreadyOwned = purchases.includes(product.id) && !receipt;
  const itemDiscount = product.price - discounted(product.price, product.discountPercent);
  const accessHref = isLearnable(product) ? `/courses/${product.slug}/learn` : "/dashboard/library";

  if (receipt) {
    return (
      <div className="card mx-auto max-w-xl p-6 text-center sm:p-10" role="status">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600">
          <CircleCheck className="h-9 w-9" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-extrabold">پرداخت آزمایشی با موفقیت انجام شد.</h2>
        <p className="mt-2 text-sm text-navy-600">این محتوا در پنل کاربری شما در دسترس است.</p>
        <dl className="mt-6 space-y-2 rounded-2xl bg-surface p-5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-navy-500">شماره سفارش</dt>
            <dd className="ltr font-bold">{receipt.orderId}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-navy-500">محصول</dt>
            <dd className="text-left font-semibold">{product.title}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-navy-500">مبلغ پرداختی</dt>
            <dd className="font-semibold">{receipt.total ? formatPrice(receipt.total) : "رایگان"}</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={accessHref} className="btn-primary">
            {isLearnable(product) ? "شروع یادگیری" : "مشاهده در کتابخانه"}
          </Link>
          <Link href="/dashboard/orders" className="btn-outline">
            <Receipt className="h-4 w-4" aria-hidden />
            سفارش‌های من
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="card flex items-center gap-4 p-4">
        <Cover title={product.title} tone={product.coverTone} type={product.type} showTitle={false} size="sm" className="h-16 w-24 shrink-0 rounded-xl" />
        <div className="min-w-0">
          <p className="text-xs text-teal-700">{contentTypeLabels[product.type]}</p>
          <p className="truncate font-bold">{product.title}</p>
          <p className="text-xs text-navy-500">{product.author}</p>
        </div>
      </div>

      {alreadyOwned ? (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center">
          <p className="font-bold text-teal-800">شما قبلاً این محتوا را تهیه کرده‌اید.</p>
          <Link href={accessHref} className="btn-primary mt-4">
            دسترسی به محتوا
          </Link>
        </div>
      ) : (
        <PaymentSummary
          line={{ title: product.title, subtitle: `${contentTypeLabels[product.type]} — ${product.author}`, amount: product.price }}
          itemDiscount={itemDiscount}
          onPay={(t) => {
            const order = demoActions.recordPayment({
              itemId: product.id,
              itemTitle: product.title,
              kind: product.type,
              amount: t.amount,
              discount: t.discount,
            });
            setReceipt({ orderId: order.id, total: order.total });
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
