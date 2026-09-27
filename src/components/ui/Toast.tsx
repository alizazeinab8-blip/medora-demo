"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/format";

type ToastKind = "success" | "info" | "warning";
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, kind: ToastKind = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => {
          const Icon = t.kind === "success" ? CircleCheck : t.kind === "warning" ? TriangleAlert : Info;
          return (
            <div
              key={t.id}
              role="status"
              className={cn(
                "pointer-events-auto flex w-full max-w-md animate-fade-up items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lift",
                t.kind === "success" && "border-teal-200",
                t.kind === "warning" && "border-amber-200",
                t.kind === "info" && "border-brand-200",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0",
                  t.kind === "success" && "text-teal-600",
                  t.kind === "warning" && "text-amber-600",
                  t.kind === "info" && "text-brand-600",
                )}
                aria-hidden
              />
              <p className="flex-1 leading-6 text-navy-800">{t.message}</p>
              <button
                onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
                className="rounded p-0.5 text-navy-400 hover:text-navy-700"
                aria-label="بستن پیام"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
