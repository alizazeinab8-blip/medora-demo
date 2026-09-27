"use client";

import { Search, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/format";

/* ───────────── SearchBar ───────────── */

export function SearchBar({
  value,
  onChange,
  placeholder = "جستجو...",
  className,
  label = "جستجو",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <label className="sr-only" htmlFor={`search-${label}`}>
        {label}
      </label>
      <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" aria-hidden />
      <input
        id={`search-${label}`}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pr-10 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-navy-400 hover:text-navy-700"
          aria-label="پاک کردن جستجو"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ───────────── FilterBar (chips) ───────────── */

export interface FilterOption<V extends string> {
  value: V;
  label: string;
  count?: number;
}

export function FilterBar<V extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: FilterOption<V>[];
  value: V;
  onChange: (v: V) => void;
  label: string;
  className?: string;
}) {
  return (
    <div role="tablist" aria-label={label} className={cn("-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0", className)}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors sm:text-sm",
              active
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-navy-200 bg-white text-navy-600 hover:border-brand-300 hover:text-brand-700",
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span className={cn("mr-1.5 text-[11px]", active ? "text-navy-300" : "text-navy-400")}>
                {o.count.toLocaleString("fa-IR")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────── Select ───────────── */

export function Select<V extends string>({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: V;
  onChange: (v: V) => void;
  options: { value: V; label: string }[];
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as V)} className="input">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ───────────── DataTable (table on desktop, cards on mobile) ───────────── */

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Shown as the card title on mobile. */
  primary?: boolean;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  empty = "موردی یافت نشد.",
  caption,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: string;
  caption?: string;
}) {
  if (rows.length === 0) {
    return <p className="rounded-xl border border-dashed border-navy-200 bg-surface p-8 text-center text-sm text-navy-500">{empty}</p>;
  }
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const rest = columns.filter((c) => c !== primary);

  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden overflow-hidden rounded-2xl border border-navy-100 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead className="bg-surface text-xs text-navy-500">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} scope="col" className={cn("whitespace-nowrap px-4 py-3 font-medium", c.className)}>
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn("transition-colors", onRowClick && "cursor-pointer hover:bg-brand-50/40")}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn("whitespace-nowrap px-4 py-3.5 text-navy-700", c.className)}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn("card p-4", onRowClick && "cursor-pointer active:bg-brand-50/40")}
          >
            <div className="mb-3 font-bold text-navy-900">{primary.render(row)}</div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-xs">
              {rest.map((c) => (
                <div key={c.key} className="min-w-0">
                  <dt className="text-navy-400">{c.header}</dt>
                  <dd className="mt-0.5 break-words text-navy-800">{c.render(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
