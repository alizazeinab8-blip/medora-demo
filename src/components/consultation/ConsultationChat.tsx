"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, ImageIcon, Paperclip, Send, ShieldCheck, X } from "lucide-react";
import type { ChatMessage, Consultation } from "@/types";
import { demoActions } from "@/lib/demo-store";
import { doctorById } from "@/data/services";
import { Avatar, Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/format";

export const consultationStatusLabel: Record<Consultation["status"], string> = {
  open: "در انتظار پاسخ",
  answered: "پاسخ داده‌شده",
  closed: "بسته‌شده",
  "awaiting-payment": "در انتظار پرداخت",
};

/**
 * Chat panel for one consultation.
 * PRODUCTION: messages via REST + WebSocket/polling; attachments uploaded to secure
 * object storage with signed URLs; every access logged.
 */
export function ConsultationChat({
  consultation,
  viewer = "patient",
  className,
}: {
  consultation: Consultation;
  viewer?: "patient" | "doctor";
  className?: string;
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<{ name: string; size: string; kind: "image" | "file" } | null>(null);
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const doctor = doctorById(consultation.doctorId);
  const closed = consultation.status === "closed";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [consultation.messages.length, typing]);

  const send = () => {
    if (!text.trim() && !file) return;
    demoActions.sendMessage(consultation.id, {
      from: viewer,
      text: text.trim() || "فایل پیوست شد.",
      attachment: file ?? undefined,
    });
    setText("");
    setFile(null);
    if (viewer === "patient") {
      // Demo auto-reply so the flow feels complete. Not medical advice.
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        demoActions.sendMessage(consultation.id, {
          from: "doctor",
          text: "(پاسخ خودکار نمایشی) پیام شما دریافت شد. در نسخه واقعی، پاسخ پزشک در این بخش نمایش داده می‌شود.",
        });
      }, 1800);
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Only the file name is kept — nothing is uploaded in the demo.
    setFile({
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(f.size / 1024))} KB`,
      kind: f.type.startsWith("image/") ? "image" : "file",
    });
    e.target.value = "";
  };

  return (
    <div className={cn("flex h-[640px] max-h-[80vh] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white", className)}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-navy-100 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar initials={doctor?.initials ?? "د"} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{consultation.subject}</p>
            <p className="truncate text-[11px] text-navy-500">
              {doctor?.name} · <span className="ltr">{consultation.id}</span>
            </p>
          </div>
        </div>
        <Badge tone={consultation.status === "answered" ? "green" : consultation.status === "closed" ? "gray" : "amber"}>
          {consultationStatusLabel[consultation.status]}
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-surface/60 px-3 py-5 sm:px-5" aria-live="polite">
        <p className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] text-navy-500 shadow-card">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
          گفتگوی نمایشی — پیام‌ها توصیه پزشکی نیستند
        </p>
        {consultation.messages.map((m) => (
          <Bubble key={m.id} m={m} mine={m.from === viewer} />
        ))}
        {typing && (
          <div className="flex items-center gap-2 text-xs text-navy-400">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-navy-300 [animation-delay:240ms]" />
            </span>
            پزشک در حال نوشتن...
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      {closed ? (
        <p className="border-t border-navy-100 px-4 py-4 text-center text-xs text-navy-500">این گفتگو بسته شده است.</p>
      ) : (
        <div className="border-t border-navy-100 p-3">
          {file && (
            <div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-800">
              <span className="flex min-w-0 items-center gap-2">
                {file.kind === "image" ? <ImageIcon className="h-4 w-4 shrink-0" aria-hidden /> : <FileText className="h-4 w-4 shrink-0" aria-hidden />}
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-brand-600 ltr">{file.size}</span>
              </span>
              <button onClick={() => setFile(null)} aria-label="حذف پیوست" className="rounded p-0.5 hover:bg-brand-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={onPickFile} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-navy-200 p-2.5 text-navy-500 hover:border-brand-300 hover:text-brand-600"
              aria-label="پیوست تصویر یا فایل"
              title="پیوست تصویر یا فایل (نمایشی — آپلود نمی‌شود)"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <label htmlFor={`msg-${consultation.id}`} className="sr-only">
              متن پیام
            </label>
            <textarea
              id={`msg-${consultation.id}`}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={viewer === "doctor" ? "پاسخ به بیمار..." : "پیام خود را بنویسید..."}
              className="input max-h-32 min-h-[44px] flex-1 resize-none py-2.5"
            />
            <button type="button" onClick={send} disabled={!text.trim() && !file} className="btn-primary h-11 px-4" aria-label="ارسال پیام">
              <Send className="h-4 w-4 -scale-x-100" aria-hidden />
              <span className="hidden sm:inline">ارسال</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Bubble({ m, mine }: { m: ChatMessage; mine: boolean }) {
  if (m.from === "system") {
    return <p className="mx-auto w-fit max-w-[90%] rounded-lg bg-navy-100/70 px-3 py-1.5 text-center text-[11px] text-navy-600">{m.text}</p>;
  }
  return (
    <div className={cn("flex flex-col", mine ? "items-start" : "items-end")}>
      <span className="mb-1 px-1 text-[11px] text-navy-400">{m.from === "doctor" ? "پزشک" : "بیمار"}</span>
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-4 py-2.5 text-sm leading-7 sm:max-w-[75%]",
          mine ? "rounded-tr-sm bg-brand-600 text-white" : "rounded-tl-sm border border-navy-100 bg-white text-navy-800",
        )}
      >
        {m.text}
        {m.attachment && (
          <span
            className={cn(
              "mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs",
              mine ? "bg-white/15" : "bg-navy-50 text-navy-700",
            )}
          >
            {m.attachment.kind === "image" ? <ImageIcon className="h-4 w-4 shrink-0" aria-hidden /> : <Paperclip className="h-4 w-4 shrink-0" aria-hidden />}
            <span className="truncate">{m.attachment.name}</span>
            <span className="shrink-0 opacity-70 ltr">{m.attachment.size}</span>
          </span>
        )}
      </div>
      <time className="mt-1 px-1 text-[10px] text-navy-400">{m.time}</time>
    </div>
  );
}
