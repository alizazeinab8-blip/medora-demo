import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="flex flex-1 items-center">
        <div className="container py-24 text-center">
          <p className="text-6xl font-black text-navy-200">۴۰۴</p>
          <h1 className="mt-4 text-2xl font-extrabold">صفحه مورد نظر یافت نشد</h1>
          <p className="mt-2 text-sm text-navy-500">ممکن است آدرس اشتباه باشد یا صفحه جابه‌جا شده باشد.</p>
          <Link href="/" className="btn-primary mt-8">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
