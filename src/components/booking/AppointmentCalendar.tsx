"use client";

import { useEffect, useState } from "react";
import { addDays, cn, formatDayMonth, formatWeekday, fa, isoDate } from "@/lib/format";

/** Next N bookable days. Fridays are shown as closed (typical for Iranian clinics). */
function upcomingDays(count: number): { iso: string; closed: boolean }[] {
  const today = isoDate(new Date());
  return Array.from({ length: count }, (_, i) => {
    const iso = addDays(today, i);
    const closed = new Date(`${iso}T12:00:00`).getDay() === 5;
    return { iso, closed };
  });
}

export function AppointmentCalendar({
  value,
  onChange,
  days = 14,
}: {
  value: string | null;
  onChange: (iso: string) => void;
  days?: number;
}) {
  // Dates depend on the visitor's clock, so render them only on the client.
  const [list, setList] = useState<{ iso: string; closed: boolean }[] | null>(null);
  useEffect(() => setList(upcomingDays(days)), [days]);

  if (!list) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7" aria-busy="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-[76px] animate-pulse rounded-xl bg-navy-50" />
        ))}
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label="انتخاب تاریخ" className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7">
      {list.map(({ iso, closed }, i) => {
        const selected = value === iso;
        return (
          <button
            key={iso}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={closed}
            onClick={() => onChange(iso)}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border px-2 py-3 text-center transition-colors",
              closed && "cursor-not-allowed border-dashed border-navy-100 bg-surface text-navy-300",
              !closed && !selected && "border-navy-200 bg-white hover:border-brand-300 hover:bg-brand-50/50",
              selected && "border-brand-600 bg-brand-600 text-white shadow-card",
            )}
          >
            <span className={cn("text-[11px]", selected ? "text-brand-100" : "text-navy-400")}>
              {i === 0 ? "امروز" : i === 1 ? "فردا" : formatWeekday(iso)}
            </span>
            <span className="mt-1 text-sm font-bold">{formatDayMonth(iso)}</span>
            {closed && <span className="mt-0.5 text-[10px]">تعطیل</span>}
          </button>
        );
      })}
    </div>
  );
}

export function TimeSlotPicker({
  slots,
  unavailable,
  value,
  onChange,
}: {
  slots: string[];
  unavailable: string[];
  value: string | null;
  onChange: (time: string) => void;
}) {
  const groups = [
    { label: "صبح", items: slots.filter((s) => Number(s.slice(0, 2)) < 13) },
    { label: "عصر", items: slots.filter((s) => Number(s.slice(0, 2)) >= 13) },
  ];
  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <fieldset key={g.label}>
          <legend className="mb-2 text-xs font-semibold text-navy-500">نوبت‌های {g.label}</legend>
          <div role="radiogroup" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {g.items.map((t) => {
              const taken = unavailable.includes(t);
              const selected = value === t;
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={taken}
                  onClick={() => onChange(t)}
                  className={cn(
                    "rounded-xl border py-2.5 text-sm font-semibold transition-colors",
                    taken && "cursor-not-allowed border-navy-100 bg-surface text-navy-300 line-through",
                    !taken && !selected && "border-navy-200 bg-white text-navy-800 hover:border-brand-300 hover:bg-brand-50/50",
                    selected && "border-brand-600 bg-brand-600 text-white",
                  )}
                >
                  {fa(t)}
                  {taken && <span className="sr-only"> (رزرو شده)</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      <p className="flex items-center gap-4 text-[11px] text-navy-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-navy-200 bg-white" /> آزاد
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-navy-100" /> رزرو شده
        </span>
      </p>
    </div>
  );
}
