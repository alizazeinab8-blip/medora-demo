"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, Lock } from "lucide-react";
import type { Lesson, Product } from "@/types";
import { VideoPlayer } from "./VideoPlayer";
import { Curriculum } from "./Curriculum";
import { Badge, DemoNotice, ProgressBar } from "@/components/ui/primitives";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { useToast } from "@/components/ui/Toast";
import { cn, fa } from "@/lib/format";

/** Video learning interface with locked/unlocked lessons and progress tracking. */
export function LearningInterface({ product }: { product: Product }) {
  const purchases = useDemoStore((s) => s.purchases);
  const progress = useDemoStore((s) => s.lessonProgress);
  const toast = useToast();
  const owned = purchases.includes(product.id) || product.price === 0;
  const sections = product.curriculum ?? [];
  const lessons = useMemo(() => sections.flatMap((s) => s.lessons), [sections]);
  const [activeId, setActiveId] = useState(lessons[0]?.id);
  const active = lessons.find((l) => l.id === activeId) ?? lessons[0];
  const idx = lessons.findIndex((l) => l.id === active?.id);
  const done = progress[product.id] ?? [];
  const pct = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;
  const locked = !owned && !active?.free;
  const section = sections.find((s) => s.lessons.some((l) => l.id === active?.id));
  const buyHref = `/checkout?item=${product.slug}`;

  const select = (l: Lesson) => {
    setActiveId(l.id);
    if (!owned && !l.free) toast("برای دسترسی به این جلسه، ابتدا دوره را تهیه کنید.", "warning");
    if (typeof window !== "undefined" && window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markDone = () => {
    if (!active) return;
    demoActions.toggleLesson(product.id, active.id);
  };

  if (!active) return null;

  return (
    <div className="container py-6 sm:py-10">
      <nav aria-label="مسیر" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-navy-500">
        <Link href="/courses" className="hover:text-brand-700">
          دوره‌ها
        </Link>
        <span>/</span>
        <Link href={`/courses/${product.slug}`} className="hover:text-brand-700">
          {product.title}
        </Link>
        <span>/</span>
        <span className="text-navy-800">محیط یادگیری</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <VideoPlayer
            title={active.title}
            duration={active.duration}
            locked={locked}
            buyHref={buyHref}
            onEnded={() => {
              if (!done.includes(active.id)) demoActions.toggleLesson(product.id, active.id);
            }}
          />

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs text-navy-500">{section?.title}</p>
              <h1 className="mt-1 text-lg font-extrabold sm:text-xl">{active.title}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {active.free && !owned && <Badge tone="teal">پیش‌نمایش رایگان</Badge>}
                {locked && (
                  <Badge tone="gray">
                    <Lock className="h-3 w-3" aria-hidden /> قفل
                  </Badge>
                )}
                {done.includes(active.id) && (
                  <Badge tone="green">
                    <CircleCheck className="h-3 w-3" aria-hidden /> تکمیل‌شده
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className="btn-outline btn-sm"
                disabled={idx <= 0}
                onClick={() => select(lessons[idx - 1])}
                aria-label="جلسه قبل"
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
                قبلی
              </button>
              <button
                type="button"
                className="btn-outline btn-sm"
                disabled={idx >= lessons.length - 1}
                onClick={() => select(lessons[idx + 1])}
                aria-label="جلسه بعد"
              >
                بعدی
                <ArrowLeft className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          {locked ? (
            <div className="mt-6 rounded-2xl border border-navy-100 bg-surface p-5 text-center sm:p-6">
              <Lock className="mx-auto h-6 w-6 text-navy-400" aria-hidden />
              <p className="mt-3 font-bold">برای دسترسی به این جلسه، ابتدا دوره را تهیه کنید.</p>
              <p className="mt-1 text-sm text-navy-500">پس از خرید، تمام جلسات، فایل‌های ضمیمه و پیگیری پیشرفت فعال می‌شود.</p>
              <Link href={buyHref} className="btn-primary mt-4">
                تهیه دوره
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button type="button" onClick={markDone} className={cn(done.includes(active.id) ? "btn-outline" : "btn-navy")}>
                <CircleCheck className="h-4 w-4" aria-hidden />
                {done.includes(active.id) ? "برداشتن علامت تکمیل" : "علامت‌گذاری به‌عنوان تکمیل‌شده"}
              </button>
              <span className="text-xs text-navy-500">پیشرفت در پنل کاربری ذخیره می‌شود.</span>
            </div>
          )}

          <DemoNotice className="mt-6">
            محافظت از محتوا در این نسخه فقط به‌صورت مفهومی نمایش داده شده است. در نسخه نهایی، ویدیوها با لینک‌های امضاشده و
            موقت، واترمارک اختصاصی کاربر و در صورت نیاز DRM ارائه می‌شوند.
          </DemoNotice>
        </div>

        <aside className="space-y-4">
          <div className="card p-5">
            <p className="text-xs text-navy-500">پیشرفت دوره</p>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-bold">
                {fa(done.length)} از {fa(lessons.length)} جلسه
              </span>
              <span className="font-bold text-teal-700">{fa(pct)}٪</span>
            </div>
            <ProgressBar value={pct} className="mt-3" />
            {!owned && (
              <Link href={buyHref} className="btn-primary mt-4 w-full">
                خرید دوره و باز شدن همه جلسات
              </Link>
            )}
          </div>
          <Curriculum sections={sections} owned={owned} completed={done} activeLessonId={active.id} onSelect={select} defaultOpen="all" />
        </aside>
      </div>
    </div>
  );
}
