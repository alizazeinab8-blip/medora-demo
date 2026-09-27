"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, Download, Eye, FileText, FolderOpen, HardDrive, ShoppingBag, Tag } from "lucide-react";
import type { Product } from "@/types";
import { Cover } from "@/components/ui/Cover";
import { Badge, DemoNotice, Price, Rating } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { categoryLabel, contentTypeLabels } from "@/data/catalog";
import { discounted, fa } from "@/lib/format";

/** Details page for downloadable content (PDF / e-book). */
export function BookDetails({ product }: { product: Product }) {
  const purchases = useDemoStore((s) => s.purchases);
  const toast = useToast();
  const owned = purchases.includes(product.id);
  const free = product.price === 0;
  const [preview, setPreview] = useState(false);

  const claimFree = () => {
    demoActions.recordPayment({ itemId: product.id, itemTitle: product.title, kind: product.type, amount: 0, discount: 0 });
    toast("این محتوا در پنل کاربری شما در دسترس است.");
  };

  const download = () =>
    toast("دانلود نمایشی: در نسخه نهایی فایل از طریق لینک امن و موقت دانلود می‌شود.", "info");

  return (
    <div className="container py-10 sm:py-14">
      <nav aria-label="مسیر" className="mb-6 flex flex-wrap gap-1 text-xs text-navy-500">
        <Link href="/store" className="hover:text-brand-700">
          فروشگاه محتوا
        </Link>
        <span>/</span>
        <Link href={`/store?type=${product.type}`} className="hover:text-brand-700">
          {contentTypeLabels[product.type]}
        </Link>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr]">
        <div>
          <div className="mx-auto max-w-[300px] lg:max-w-none">
            <Cover
              title={product.title}
              tone={product.coverTone}
              type={product.type}
              size="lg"
              className="aspect-[3/4] rounded-2xl shadow-lift"
            />
          </div>
          <button type="button" onClick={() => setPreview(true)} className="btn-outline mx-auto mt-4 flex w-full max-w-[300px] lg:max-w-none">
            <Eye className="h-4 w-4" aria-hidden />
            پیش‌نمایش صفحات
          </button>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone="teal">{contentTypeLabels[product.type]}</Badge>
            <Badge>{categoryLabel(product.category)}</Badge>
            {free && <Badge tone="green">رایگان</Badge>}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold leading-snug sm:text-3xl">{product.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-500">
            <span>
              نویسنده: <span className="font-semibold text-navy-800">{product.author}</span>
            </span>
            <Rating value={product.rating} reviews={product.reviews} />
          </div>

          <p className="mt-6 text-sm leading-8 text-navy-600 sm:text-[15px]">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [FileText, "تعداد صفحات", fa(product.pages ?? 0)],
              [HardDrive, "حجم فایل", product.fileSize ?? "—"],
              [FolderOpen, "فرمت", product.format ?? "PDF"],
              [Tag, "دسته‌بندی", categoryLabel(product.category)],
            ].map(([Icon, label, value]) => {
              const I = Icon as typeof FileText;
              return (
                <div key={label as string} className="flex flex-col-reverse gap-1 rounded-xl bg-surface p-4">
                  <dt className="text-xs text-navy-500">{label as string}</dt>
                  <dd className="flex items-center gap-2 text-sm font-bold">
                    <I className="h-4 w-4 text-brand-600" aria-hidden />
                    <span className="truncate">{value as string}</span>
                  </dd>
                </div>
              );
            })}
          </dl>

          <div className="card mt-8 p-5 sm:p-6">
            {owned ? (
              <div role="status">
                <p className="flex items-center gap-2 font-bold text-teal-700">
                  <CircleCheck className="h-5 w-5" aria-hidden />
                  این محتوا در پنل کاربری شما در دسترس است.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={download} className="btn-primary">
                    <Download className="h-4 w-4" aria-hidden />
                    دانلود فایل
                  </button>
                  <Link href="/dashboard/library" className="btn-outline">
                    رفتن به کتاب‌ها و فایل‌ها
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-navy-500">قیمت</p>
                  <div className="mt-1">
                    <Price price={product.price} discountPercent={product.discountPercent} size="lg" />
                  </div>
                  {product.discountPercent ? (
                    <p className="mt-1 text-xs text-red-600">
                      {fa(product.discountPercent)}٪ تخفیف — صرفه‌جویی{" "}
                      {fa((product.price - discounted(product.price, product.discountPercent)).toLocaleString("en-US")).replace(/,/g, "٬")} تومان
                    </p>
                  ) : null}
                </div>
                {free ? (
                  <button type="button" onClick={claimFree} className="btn-primary py-3">
                    <Download className="h-4 w-4" aria-hidden />
                    دریافت رایگان
                  </button>
                ) : (
                  <Link href={`/checkout?item=${product.slug}`} className="btn-primary py-3">
                    <ShoppingBag className="h-4 w-4" aria-hidden />
                    خرید و دانلود
                  </Link>
                )}
              </div>
            )}
          </div>

          <DemoNotice className="mt-6">
            فایل واقعی وجود ندارد. در نسخه نهایی، فایل‌ها در فضای ذخیره‌سازی امن نگهداری و فقط برای خریداران با لینک موقت قابل دانلود
            هستند.
          </DemoNotice>
        </div>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title={`پیش‌نمایش: ${product.title}`} size="lg">
        <div className="grid gap-4 sm:grid-cols-2">
          {["فهرست مطالب", "نمونه صفحه"].map((t, i) => (
            <div key={t} className="aspect-[3/4] rounded-xl border border-navy-100 bg-white p-5 shadow-card">
              <p className="text-xs font-bold text-navy-900">{t}</p>
              <div className="mt-4 space-y-2.5">
                {i === 0
                  ? ["فصل ۱: مقدمه و کلیات", "فصل ۲: مبانی", "فصل ۳: رویکرد بالینی", "فصل ۴: جداول مرجع", "فصل ۵: جمع‌بندی"].map((c) => (
                      <p key={c} className="flex justify-between border-b border-dashed border-navy-100 pb-1.5 text-[11px] text-navy-600">
                        {c}
                      </p>
                    ))
                  : Array.from({ length: 11 }).map((_, k) => (
                      <div key={k} className="h-1.5 rounded bg-navy-100" style={{ width: `${60 + ((k * 17) % 40)}%` }} />
                    ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-navy-500">پیش‌نمایش نمایشی — بقیه صفحات پس از خرید در دسترس است.</p>
      </Modal>
    </div>
  );
}
