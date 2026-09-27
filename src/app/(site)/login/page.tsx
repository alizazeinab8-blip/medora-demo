import type { Metadata } from "next";
import { LoginPanel } from "@/components/dashboard/LoginPanel";

export const metadata: Metadata = {
  title: "ورود / ثبت‌نام",
  description: "ورود نمایشی به پنل کاربر، پزشک یا مدیر.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <section className="flex min-h-[70vh] items-center bg-surface py-12">
      <div className="container">
        <LoginPanel />
      </div>
    </section>
  );
}
