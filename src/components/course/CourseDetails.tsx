"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, ChartColumn, CircleCheck, CirclePlay, Clock, Eye, GraduationCap, Layers, ShoppingBag, Users } from "lucide-react";
import type { Product } from "@/types";
import { Cover } from "@/components/ui/Cover";
import { Avatar, Badge, DemoNotice, Price, ProgressBar, Rating, initialsOf } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/Modal";
import { Curriculum } from "./Curriculum";
import { VideoPlayer } from "./VideoPlayer";
import { useDemoStore } from "@/lib/demo-store";
import { categoryLabel, contentTypeLabels } from "@/data/catalog";
import { fa, faNumber } from "@/lib/format";

export function CourseDetails({ product }: { product: Product }) {
  const purchases = useDemoStore((s) => s.purchases);
  const progress = useDemoStore((s) => s.lessonProgress);
  const owned = purchases.includes(product.id) || product.price === 0;
  const [preview, setPreview] = useState(false);

  const lessons = product.curriculum?.flatMap((s) => s.lessons) ?? [];
  const firstFree = lessons.find((l) => l.free) ?? lessons[0];
  const done = progress[product.id] ?? [];
  const pct = lessons.length ? Math.round((done.length / lessons.length) * 100) : 0;
  const checkoutHref = `/checkout?item=${product.slug}`;
  const learnHref = `/courses/${product.slug}/learn`;

  const PurchaseBox = (
    <div className="card overflow-hidden">
      <Cover title={product.title} tone={product.coverTone} type={product.type} className="aspect-video" size="md" />
      <div className="p-5">
        {owned ? (
          <>
            <Badge tone="green" className="mb-3">
              <CircleCheck className="h-3.5 w-3.5" aria-hidden />
              {product.price === 0 ? "رایگان — در دسترس" : "شما این دوره را تهیه کرده‌اید"}
            </Badge>
            <p className="text-xs text-navy-500">پیشرفت شما: {fa(pct)}٪</p>
            <ProgressBar value={pct} className="mt-2" />
            <Link href={learnHref} className="btn-primary mt-5 w-full py-3">
              <CirclePlay className="h-4 w-4" aria-hidden />
              {pct > 0 ? "ادامه یادگیری" : "شروع یادگیری"}
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <Price price={product.price} discountPercent={product.discountPercent} size="lg" />
              {product.discountPercent ? <Badge tone="red">٪{fa(product.discountPercent)} تخفیف</Badge> : null}
            </div>
            <Link href={checkoutHref} className="btn-primary mt-5 w-full py-3">
              <ShoppingBag className="h-4 w-4" aria-hidden />
              خرید دوره
            </Link>
            <button type="button" onClick={() => setPreview(true)} className="btn-outline mt-2 w-full">
              <Eye className="h-4 w-4" aria-hidden />
              مشاهده پیش‌نمایش
            </button>
          </>
        )}
        <ul className="mt-5 space-y-2.5 border-t border-navy-100 pt-5 text-sm text-navy-600">
          <li className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-navy-400" aria-hidden /> {fa(product.sessions ?? lessons.length)} جلسه
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-navy-400" aria-hidden /> {product.duration}
          </li>
          <li className="flex items-center gap-2">
            <Award className="h-4 w-4 text-navy-400" aria-hidden /> گواهی پایان دوره (در نسخه نهایی)
          </li>
          <li className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-navy-400" aria-hidden /> دسترسی دائمی از پنل کاربری
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      {/* Header band */}
      <section className="bg-navy-900 text-white">
        <div className="container grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-xs text-navy-300">
              <Link href="/courses" className="hover:text-white">
                دوره‌ها
              </Link>{" "}
              / {categoryLabel(product.category)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge className="bg-white/10 text-white">{contentTypeLabels[product.type]}</Badge>
              {product.level && <Badge className="bg-teal-500/15 text-teal-200">سطح {product.level}</Badge>}
            </div>
            <h1 className="mt-4 text-2xl font-extrabold leading-snug text-white sm:text-3xl lg:text-4xl lg:leading-snug">{product.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-navy-200 sm:text-base">{product.shortDescription}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="flex items-center gap-2">
                <Avatar initials={initialsOf(product.author)} size="sm" className="bg-white/10 text-white ring-white/20" />
                <span>
                  <span className="block text-[11px] text-navy-300">مدرس</span>
                  {product.author}
                </span>
              </span>
              <Rating value={product.rating} reviews={product.reviews} className="text-navy-300 [&_span.font-semibold]:text-white" />
              {product.students && (
                <span className="flex items-center gap-1.5 text-navy-300">
                  <Users className="h-4 w-4" aria-hidden /> {faNumber(product.students)} دانشجو
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container grid grid-cols-1 gap-10 py-10 lg:grid-cols-[1fr_360px] lg:py-14">
        <div className="min-w-0 space-y-10">
          {/* Mobile purchase box */}
          <div className="lg:hidden">{PurchaseBox}</div>

          <section aria-labelledby="c-info">
            <h2 id="c-info" className="sr-only">
              مشخصات دوره
            </h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [Layers, "تعداد جلسات", fa(product.sessions ?? lessons.length)],
                [Clock, "مدت دوره", product.duration ?? "—"],
                [ChartColumn, "سطح", product.level ?? "—"],
                [Users, "دانشجو", faNumber(product.students ?? 0)],
              ].map(([Icon, label, value]) => {
                const I = Icon as typeof Layers;
                return (
                  <div key={label as string} className="card flex flex-col-reverse gap-1 p-4">
                    <dt className="text-xs text-navy-500">{label as string}</dt>
                    <dd className="flex items-center gap-2 text-sm font-bold">
                      <I className="h-4 w-4 text-brand-600" aria-hidden />
                      {value as string}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>

          <section>
            <h2 className="text-lg font-bold">درباره این دوره</h2>
            <p className="mt-3 text-sm leading-8 text-navy-600 sm:text-[15px]">{product.description}</p>
          </section>

          {product.objectives && (
            <section>
              <h2 className="text-lg font-bold">اهداف یادگیری</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {product.objectives.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 rounded-xl bg-surface p-4 text-sm leading-7">
                    <CircleCheck className="mt-1 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {product.curriculum && (
            <section>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <h2 className="text-lg font-bold">سرفصل‌ها</h2>
                <p className="text-xs text-navy-500">
                  {fa(product.curriculum.length)} بخش · {fa(lessons.length)} جلسه
                </p>
              </div>
              <Curriculum sections={product.curriculum} owned={owned} completed={done} defaultOpen="all" />
              {!owned && <p className="mt-3 text-xs text-navy-500">جلسات دارای برچسب «پیش‌نمایش» پیش از خرید قابل مشاهده‌اند.</p>}
            </section>
          )}

          <section className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <Avatar initials={initialsOf(product.author)} size="lg" />
            <div>
              <p className="text-xs text-navy-500">مدرس دوره</p>
              <h2 className="mt-1 font-bold">{product.author}</h2>
              <p className="mt-2 text-sm leading-7 text-navy-500">مدرس ساختگی برای نسخه نمایشی. در نسخه نهایی، هر مدرس صفحه پروفایل و پنل مدیریت محتوای خود را خواهد داشت.</p>
            </div>
          </section>

          <DemoNotice>محتوای این دوره نمایشی است و ویدیوی واقعی پخش نمی‌شود.</DemoNotice>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">{PurchaseBox}</div>
        </aside>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title={`پیش‌نمایش: ${product.title}`} size="lg">
        {firstFree && <VideoPlayer title={firstFree.title} duration={firstFree.duration} />}
        <p className="mt-4 text-sm leading-7 text-navy-500">
          جلسات پیش‌نمایش رایگان هستند. برای دسترسی به همه جلسات، دوره را تهیه کنید.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={checkoutHref} className="btn-primary">
            خرید دوره
          </Link>
          <Link href={learnHref} className="btn-outline">
            ورود به محیط یادگیری
          </Link>
        </div>
      </Modal>
    </>
  );
}
