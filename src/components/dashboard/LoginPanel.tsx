"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyRound, ShieldCheck, Smartphone, Stethoscope, UserCog, UserRound } from "lucide-react";
import type { Role } from "@/types";
import { demoActions } from "@/lib/demo-store";
import { roleLabels } from "@/lib/permissions";
import { useToast } from "@/components/ui/Toast";
import { DemoNotice } from "@/components/ui/primitives";
import { cn } from "@/lib/format";

const roleCards: { role: Role; href: string; icon: typeof UserRound; text: string }[] = [
  { role: "patient", href: "/dashboard", icon: UserRound, text: "نوبت‌ها، مشاوره‌ها، دوره‌ها و پرونده" },
  { role: "doctor", href: "/doctor", icon: Stethoscope, text: "نوبت‌های امروز، بیماران و مشاوره‌ها" },
  { role: "admin", href: "/admin", icon: UserCog, text: "کاربران، محتوا، سفارش‌ها و گزارش‌ها" },
];

/**
 * Demo login. PRODUCTION: OTP via SMS provider (POST /api/auth/otp → /api/auth/verify),
 * httpOnly session cookie, role loaded from the server — never chosen by the client.
 */
export function LoginPanel() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<"phone" | "code" | "role">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const enter = (role: Role, href: string) => {
    demoActions.login(role);
    toast(`ورود نمایشی به ${roleLabels[role]}`);
    router.push(href);
  };

  return (
    <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          {step === "phone" ? <Smartphone className="h-7 w-7" aria-hidden /> : step === "code" ? <KeyRound className="h-7 w-7" aria-hidden /> : <ShieldCheck className="h-7 w-7" aria-hidden />}
        </span>
        <h1 className="mt-4 text-xl font-extrabold">ورود / ثبت‌نام</h1>
        <p className="mt-2 text-sm text-navy-500">
          {step === "phone" && "شماره موبایل خود را وارد کنید."}
          {step === "code" && "کد تأیید ارسال‌شده را وارد کنید."}
          {step === "role" && "نقش نمایشی را برای مشاهده پنل انتخاب کنید."}
        </p>
      </div>

      {step === "phone" && (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep("code");
            toast("کد نمایشی ۱۲۳۴ «ارسال» شد (پیامک واقعی ارسال نمی‌شود).", "info");
          }}
        >
          <label className="block">
            <span className="label">شماره موبایل</span>
            <input
              className="input ltr text-left"
              inputMode="tel"
              placeholder="09xx xxx xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </label>
          <button type="submit" className="btn-primary w-full py-3" disabled={phone.replace(/\D/g, "").length < 10 && phone.length < 10}>
            دریافت کد تأیید
          </button>
        </form>
      )}

      {step === "code" && (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setStep("role");
          }}
        >
          <label className="block">
            <span className="label">کد تأیید</span>
            <input
              className="input ltr text-center text-lg tracking-[0.6em]"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="----"
              autoComplete="one-time-code"
            />
          </label>
          <p className="text-center text-xs text-navy-500">کد نمایشی: ۱۲۳۴ (هر ۴ رقمی پذیرفته می‌شود)</p>
          <button type="submit" className="btn-primary w-full py-3" disabled={code.length < 4}>
            تأیید و ورود
          </button>
          <button type="button" onClick={() => setStep("phone")} className="btn-ghost w-full">
            ویرایش شماره
          </button>
        </form>
      )}

      {step === "role" && (
        <ul className="mt-6 space-y-3">
          {roleCards.map(({ role, href, icon: Icon, text }) => (
            <li key={role}>
              <button
                onClick={() => enter(role, href)}
                className={cn("flex w-full items-center gap-4 rounded-2xl border border-navy-200 p-4 text-right transition-colors hover:border-brand-300 hover:bg-brand-50/40")}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-bold">{roleLabels[role]}</span>
                  <span className="mt-0.5 block text-xs text-navy-500">{text}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {step !== "role" && (
        <div className="mt-8 border-t border-navy-100 pt-6">
          <p className="mb-3 text-center text-xs font-semibold text-navy-500">ورود سریع نمایشی</p>
          <div className="grid grid-cols-3 gap-2">
            {roleCards.map(({ role, href, icon: Icon }) => (
              <button key={role} onClick={() => enter(role, href)} className="btn-outline btn-sm flex-col gap-1 py-3">
                <Icon className="h-4 w-4" aria-hidden />
                <span className="text-[11px]">{roleLabels[role].split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <DemoNotice className="mt-6">
        احراز هویت واقعی وجود ندارد. در نسخه نهایی، ورود با کد یک‌بارمصرف پیامکی و نقش کاربر از سمت سرور تعیین می‌شود.
      </DemoNotice>
    </div>
  );
}
