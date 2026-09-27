import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutFlow } from "@/components/payment/CheckoutFlow";
import { EmptyState, PageHeader } from "@/components/ui/primitives";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "پرداخت",
  description: "پرداخت آزمایشی سفارش — بدون اتصال به درگاه واقعی.",
  robots: { index: false },
};

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ item?: string }> }) {
  const { item } = await searchParams;
  const product = item ? api.catalog.bySlug(item) : undefined;

  return (
    <>
      <PageHeader breadcrumb="سبد خرید" title="تکمیل خرید" description="سفارش خود را بررسی و پرداخت آزمایشی را انجام دهید." />
      <section className="container max-w-5xl py-10 sm:py-14">
        {product ? (
          <CheckoutFlow product={product} />
        ) : (
          <EmptyState
            title="محصولی انتخاب نشده است"
            description="برای خرید، ابتدا یک دوره، کتاب یا ویدیو را از فروشگاه انتخاب کنید."
            action={
              <Link href="/store" className="btn-primary">
                رفتن به فروشگاه محتوا
              </Link>
            }
          />
        )}
      </section>
    </>
  );
}
