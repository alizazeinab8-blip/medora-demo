"use client";

import { useState } from "react";
import { ChevronDown, CircleCheck, CirclePlay, Lock } from "lucide-react";
import type { CourseSection, Lesson } from "@/types";
import { cn, fa } from "@/lib/format";

/** Collapsible curriculum. Used on the course page and in the learning interface. */
export function Curriculum({
  sections,
  owned,
  completed = [],
  activeLessonId,
  onSelect,
  defaultOpen = "first",
}: {
  sections: CourseSection[];
  owned: boolean;
  completed?: string[];
  activeLessonId?: string;
  onSelect?: (lesson: Lesson) => void;
  defaultOpen?: "first" | "all";
}) {
  const [open, setOpen] = useState<string[]>(defaultOpen === "all" ? sections.map((s) => s.id) : [sections[0]?.id]);

  return (
    <div className="divide-y divide-navy-100 overflow-hidden rounded-2xl border border-navy-100 bg-white">
      {sections.map((sec) => {
        const isOpen = open.includes(sec.id);
        return (
          <div key={sec.id}>
            <button
              type="button"
              onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== sec.id) : [...o, sec.id]))}
              className="flex w-full items-center justify-between gap-3 bg-surface px-4 py-3.5 text-right"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-bold text-navy-900">{sec.title}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-navy-500">
                {fa(sec.lessons.length)} جلسه
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} aria-hidden />
              </span>
            </button>
            {isOpen && (
              <ul>
                {sec.lessons.map((l) => {
                  const unlocked = owned || !!l.free;
                  const done = completed.includes(l.id);
                  const active = l.id === activeLessonId;
                  const content = (
                    <>
                      <span className="flex min-w-0 items-center gap-3">
                        {done ? (
                          <CircleCheck className="h-5 w-5 shrink-0 text-teal-500" aria-label="تکمیل‌شده" />
                        ) : unlocked ? (
                          <CirclePlay className={cn("h-5 w-5 shrink-0", active ? "text-brand-600" : "text-navy-400")} aria-hidden />
                        ) : (
                          <Lock className="h-4 w-4 shrink-0 text-navy-300" aria-label="قفل" />
                        )}
                        <span className={cn("truncate text-sm", unlocked ? "text-navy-800" : "text-navy-400", active && "font-semibold text-brand-700")}>
                          {l.title}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2 text-xs text-navy-400">
                        {l.free && !owned && <span className="chip bg-teal-50 text-teal-700">پیش‌نمایش</span>}
                        <span className="tabular-nums">{fa(l.duration)}</span>
                      </span>
                    </>
                  );
                  return (
                    <li key={l.id} className="border-t border-navy-100 first:border-t-0">
                      {onSelect ? (
                        <button
                          type="button"
                          onClick={() => onSelect(l)}
                          className={cn("flex w-full items-center justify-between gap-3 px-4 py-3 text-right transition-colors hover:bg-brand-50/40", active && "bg-brand-50/60")}
                          aria-current={active ? "true" : undefined}
                        >
                          {content}
                        </button>
                      ) : (
                        <div className="flex items-center justify-between gap-3 px-4 py-3">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
