"use client";

import { useEffect, useState } from "react";
import { ArrowRight, MessageSquarePlus, MessagesSquare } from "lucide-react";
import { useDemoStore, demoActions } from "@/lib/demo-store";
import { ConsultationChat, consultationStatusLabel } from "./ConsultationChat";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { Badge } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { cn, formatDate } from "@/lib/format";
import { doctorById } from "@/data/services";

/** Consultation list + new request (with demo payment) + chat. */
export function ConsultationCenter({ compact = false }: { compact?: boolean }) {
  const consultations = useDemoStore((s) => s.consultations);
  const toast = useToast();
  const doctors = api.doctors.list().filter((d) => d.services.includes("online"));
  const price = api.services.pricing().online.price;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileChat, setMobileChat] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [draft, setDraft] = useState({ subject: "", doctorId: doctors[0]?.id ?? "dr-1" });
  const [payStep, setPayStep] = useState(false);

  useEffect(() => {
    if (!activeId && consultations.length) setActiveId(consultations[0].id);
  }, [activeId, consultations]);

  const active = consultations.find((c) => c.id === activeId) ?? null;

  const startPayment = () => {
    if (draft.subject.trim().length < 3) return;
    setPayStep(true);
  };

  const paid = (totals: { amount: number; discount: number }) => {
    const c = demoActions.startConsultation(draft.subject.trim(), draft.doctorId);
    demoActions.recordPayment({
      itemId: c.id,
      itemTitle: `ویزیت آنلاین — ${c.subject}`,
      kind: "consultation",
      amount: totals.amount,
      discount: totals.discount,
    });
    toast("پرداخت آزمایشی با موفقیت انجام شد. شرح حال خود را ارسال کنید.");
    setNewOpen(false);
    setPayStep(false);
    setDraft({ subject: "", doctorId: draft.doctorId });
    setActiveId(c.id);
    setMobileChat(true);
  };

  return (
    <>
      <div className={cn("grid gap-5", !compact && "lg:grid-cols-[320px_1fr]", compact && "lg:grid-cols-[280px_1fr]")}>
        {/* List */}
        <aside className={cn("space-y-3", mobileChat && "hidden lg:block")} aria-label="سابقه گفتگوها">
          <button onClick={() => setNewOpen(true)} className="btn-primary w-full">
            <MessageSquarePlus className="h-4 w-4" aria-hidden />
            درخواست ویزیت آنلاین جدید
          </button>
          <h3 className="px-1 pt-2 text-xs font-semibold text-navy-500">سابقه گفتگوها</h3>
          <ul className="space-y-2">
            {consultations.map((c) => {
              const last = c.messages[c.messages.length - 1];
              return (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setActiveId(c.id);
                      setMobileChat(true);
                    }}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-right transition-colors",
                      c.id === activeId ? "border-brand-300 bg-brand-50/50" : "border-navy-100 bg-white hover:border-brand-200",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-bold">{c.subject}</p>
                      <Badge tone={c.status === "answered" ? "green" : c.status === "closed" ? "gray" : "amber"} className="shrink-0">
                        {consultationStatusLabel[c.status]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[11px] text-navy-500">
                      {doctorById(c.doctorId)?.name} · {formatDate(c.createdAt)}
                    </p>
                    {last && <p className="mt-2 line-clamp-1 text-xs text-navy-500">{last.text}</p>}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Chat */}
        <div className={cn(!mobileChat && "hidden lg:block")}>
          <button onClick={() => setMobileChat(false)} className="btn-ghost btn-sm mb-3 lg:hidden">
            <ArrowRight className="h-4 w-4" aria-hidden />
            بازگشت به فهرست
          </button>
          {active ? (
            <ConsultationChat consultation={active} />
          ) : (
            <div className="flex h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-surface text-center">
              <MessagesSquare className="h-10 w-10 text-navy-300" aria-hidden />
              <p className="mt-3 text-sm text-navy-500">یک گفتگو را انتخاب کنید یا درخواست جدید ثبت کنید.</p>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={newOpen}
        onClose={() => {
          setNewOpen(false);
          setPayStep(false);
        }}
        title={payStep ? "پرداخت ویزیت آنلاین" : "درخواست ویزیت آنلاین"}
        size={payStep ? "lg" : "md"}
      >
        {!payStep ? (
          <div className="space-y-4">
            <label className="block">
              <span className="label">موضوع مشاوره</span>
              <input
                className="input"
                value={draft.subject}
                onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                placeholder="مثلاً: بررسی نتیجه آزمایش"
              />
            </label>
            <label className="block">
              <span className="label">پزشک</span>
              <select className="input" value={draft.doctorId} onChange={(e) => setDraft({ ...draft, doctorId: e.target.value })}>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.specialty}
                  </option>
                ))}
              </select>
            </label>
            <p className="rounded-xl bg-surface p-3 text-xs leading-6 text-navy-600">
              پس از پرداخت، می‌توانید شرح حال، تصویر و فایل‌های خود را ارسال کنید و پاسخ پزشک را در همین بخش ببینید.
            </p>
            <button onClick={startPayment} disabled={draft.subject.trim().length < 3} className="btn-primary w-full">
              ادامه و پرداخت
            </button>
          </div>
        ) : (
          <PaymentSummary
            line={{ title: "ویزیت آنلاین متنی", subtitle: `${draft.subject} — ${doctorById(draft.doctorId)?.name}`, amount: price }}
            onPay={paid}
          />
        )}
      </Modal>
    </>
  );
}
