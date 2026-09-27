"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function ContactForm() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", phone: "", topic: "appointment", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.message.trim().length < 5) {
      toast("لطفاً نام و متن پیام را کامل کنید.", "warning");
      return;
    }
    // PRODUCTION: POST /api/contact → ticketing / email / CRM
    setSent(true);
    toast("پیام شما (به‌صورت نمایشی) ثبت شد.");
    setForm({ name: "", phone: "", topic: "appointment", message: "" });
  };

  return (
    <form onSubmit={submit} className="card grid gap-4 p-6 sm:grid-cols-2 sm:p-8" noValidate>
      <label className="block">
        <span className="label">نام و نام خانوادگی</span>
        <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" required />
      </label>
      <label className="block">
        <span className="label">شماره تماس</span>
        <input
          className="input ltr text-left"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          inputMode="tel"
          autoComplete="tel"
          placeholder="09xx xxx xxxx"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="label">موضوع</span>
        <select className="input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
          <option value="appointment">نوبت‌دهی و ویزیت</option>
          <option value="education">دوره‌ها و محتوای آموزشی</option>
          <option value="payment">پرداخت و سفارش</option>
          <option value="other">سایر</option>
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="label">متن پیام</span>
        <textarea
          className="input min-h-[140px] resize-y"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-navy-500">
          {sent ? "پیام ثبت شد. در نسخه نهایی، پاسخ از طریق تماس یا پیامک ارسال می‌شود." : "لطفاً اطلاعات پزشکی حساس را در این فرم وارد نکنید."}
        </p>
        <button type="submit" className="btn-primary">
          <Send className="h-4 w-4 -scale-x-100" aria-hidden />
          ارسال پیام
        </button>
      </div>
    </form>
  );
}
