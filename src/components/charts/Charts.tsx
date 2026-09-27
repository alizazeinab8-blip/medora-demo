"use client";

import { useState } from "react";
import { cn, fa, faNumber } from "@/lib/format";

/**
 * Lightweight charts (no chart library) for the admin dashboard.
 * Palette validated for CVD separation: brand blue #1f57e0 + teal #46b9ac.
 * Teal is below 3:1 contrast on white, so every chart ships a legend and a table view.
 * PRODUCTION: feed from /api/reports/*; swap for a charting library if needs grow.
 */

export interface Series {
  key: string;
  label: string;
  color: string;
}

export function GroupedBarChart({
  data,
  series,
  unit,
  title,
}: {
  data: ({ label: string } & Record<string, number | string>)[];
  series: Series[];
  unit: string;
  title: string;
}) {
  const [hover, setHover] = useState<{ i: number; s: string } | null>(null);
  const [table, setTable] = useState(false);
  const max = Math.max(...data.flatMap((d) => series.map((s) => Number(d[s.key]))));
  const niceMax = Math.ceil(max / 50) * 50;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(niceMax * t));

  return (
    <figure className="card p-5">
      <figcaption className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold">{title}</h3>
          <p className="mt-0.5 text-xs text-navy-500">واحد: {unit} (داده نمایشی)</p>
        </div>
        <div className="flex items-center gap-4">
          <ul className="flex gap-3 text-xs text-navy-600">
            {series.map((s) => (
              <li key={s.key} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} aria-hidden />
                {s.label}
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setTable((t) => !t)} className="text-xs font-medium text-brand-700 hover:underline">
            {table ? "نمایش نمودار" : "نمایش جدول"}
          </button>
        </div>
      </figcaption>

      {table ? (
        <table className="mt-5 w-full text-right text-xs">
          <thead className="text-navy-500">
            <tr>
              <th className="py-2 font-medium">ماه</th>
              {series.map((s) => (
                <th key={s.key} className="py-2 font-medium">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-100">
            {data.map((d) => (
              <tr key={d.label}>
                <td className="py-2">{d.label}</td>
                {series.map((s) => (
                  <td key={s.key} className="py-2 tabular-nums">
                    {faNumber(Number(d[s.key]))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="mt-6 flex gap-2">
          {/* y-axis */}
          <div className="flex h-52 flex-col-reverse justify-between pb-6 text-[10px] text-navy-400" aria-hidden>
            {ticks.map((t) => (
              <span key={t} className="leading-none">
                {fa(t)}
              </span>
            ))}
          </div>
          <div className="relative flex-1">
            <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col-reverse justify-between" aria-hidden>
              {ticks.map((t) => (
                <div key={t} className="border-t border-navy-100" />
              ))}
            </div>
            <div className="relative flex h-52 items-end justify-around gap-1 pb-6" role="img" aria-label={title}>
              {data.map((d, i) => (
                <div key={d.label} className="relative flex h-full flex-1 flex-col items-center justify-end">
                  <div className="flex h-full w-full max-w-[56px] items-end justify-center gap-[2px]">
                    {series.map((s) => {
                      const v = Number(d[s.key]);
                      const active = hover?.i === i && hover.s === s.key;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onMouseEnter={() => setHover({ i, s: s.key })}
                          onMouseLeave={() => setHover(null)}
                          onFocus={() => setHover({ i, s: s.key })}
                          onBlur={() => setHover(null)}
                          className={cn("w-full max-w-[20px] rounded-t transition-opacity", hover && !active && "opacity-50")}
                          style={{ height: `${(v / niceMax) * 100}%`, background: s.color }}
                          aria-label={`${d.label} — ${s.label}: ${faNumber(v)} ${unit}`}
                        />
                      );
                    })}
                  </div>
                  <span className="absolute -bottom-5 text-[10px] text-navy-500">{d.label}</span>
                  {hover?.i === i && (
                    <div className="pointer-events-none absolute bottom-full z-10 mb-1 whitespace-nowrap rounded-lg bg-navy-900 px-2.5 py-1.5 text-[11px] text-white shadow-lift">
                      {d.label} · {series.find((s) => s.key === hover.s)?.label}: {faNumber(Number(d[hover.s]))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </figure>
  );
}

/** Single-series horizontal bars with direct labels. */
export function HBarChart({ data, title, color = "#1f57e0" }: { data: { label: string; value: number }[]; title: string; color?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <figure className="card p-5">
      <figcaption>
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="mt-0.5 text-xs text-navy-500">مجموع: {faNumber(total)} (داده نمایشی)</p>
      </figcaption>
      <ul className="mt-5 space-y-4">
        {data.map((d) => (
          <li key={d.label}>
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-navy-700">{d.label}</span>
              <span className="font-semibold tabular-nums text-navy-900">
                {faNumber(d.value)} <span className="font-normal text-navy-400">({fa(Math.round((d.value / total) * 100))}٪)</span>
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-navy-50">
              <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: color }} />
            </div>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Tiny trend line for stat cards. */
export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${30 - ((v - min) / (max - min || 1)) * 26 - 2}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" className={cn("h-8 w-24", className)} preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" stroke="#1f57e0" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
