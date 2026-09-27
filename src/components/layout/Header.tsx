"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck, LogIn, Menu, ShieldCheck, X } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { cn } from "@/lib/format";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Thin top bar that makes the demo nature explicit and links to each role's panel. */
export function DemoBar() {
  return (
    <div className="bg-navy-950 text-[11px] text-navy-200 sm:text-xs">
      <div className="container flex items-center justify-between gap-3 py-2">
        <p className="flex min-w-0 items-center gap-1.5 truncate">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-teal-400" aria-hidden />
          <span className="truncate">نسخه نمایشی — تمام اطلاعات ساختگی است و پرداخت واقعی انجام نمی‌شود.</span>
        </p>
        <nav aria-label="پنل‌های نمایشی" className="hidden shrink-0 items-center gap-4 md:flex">
          <Link href="/dashboard" className="hover:text-white">پنل کاربر</Link>
          <Link href="/doctor" className="hover:text-white">پنل پزشک</Link>
          <Link href="/admin" className="hover:text-white">پنل مدیریت</Link>
        </nav>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <DemoBar />
      <header className="sticky top-0 z-50 border-b border-navy-100/80 bg-white/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Logo />

          <nav aria-label="منوی اصلی" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-lg px-2.5 py-2 text-sm transition-colors",
                      isActive(pathname, item.href)
                        ? "font-semibold text-brand-700"
                        : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
                    )}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost hidden sm:inline-flex">
              <LogIn className="h-4 w-4" aria-hidden />
              ورود / ثبت‌نام
            </Link>
            <Link href="/appointment" className="btn-primary hidden sm:inline-flex">
              <CalendarCheck className="h-4 w-4" aria-hidden />
              دریافت نوبت
            </Link>
            <button
              className="rounded-xl p-2 text-navy-700 hover:bg-navy-50 xl:hidden"
              onClick={() => setOpen(true)}
              aria-label="باز کردن منو"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </>
  );
}

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      className={cn("fixed inset-0 z-[80] overflow-hidden xl:hidden", open ? "visible" : "invisible")}
      aria-hidden={!open}
    >
      <div
        className={cn("absolute inset-0 bg-navy-950/40 transition-opacity", open ? "opacity-100" : "opacity-0")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل"
        className={cn(
          "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-white shadow-lift transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-navy-100 px-4">
          <Logo />
          <button onClick={onClose} className="rounded-xl p-2 text-navy-600 hover:bg-navy-50" aria-label="بستن منو">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav aria-label="منوی موبایل" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-[15px]",
                    isActive(pathname, item.href) ? "bg-brand-50 font-semibold text-brand-700" : "text-navy-700 hover:bg-navy-50",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-navy-100 pt-5">
            <p className="mb-2 px-4 text-xs font-semibold text-navy-400">پنل‌های نمایشی</p>
            <ul className="space-y-1 text-sm">
              {[
                ["/dashboard", "پنل کاربر / بیمار"],
                ["/doctor", "پنل پزشک"],
                ["/admin", "پنل مدیریت"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} onClick={onClose} tabIndex={open ? 0 : -1} className="block rounded-xl px-4 py-2.5 text-navy-600 hover:bg-navy-50">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="grid gap-2 border-t border-navy-100 p-4">
          <Link href="/appointment" onClick={onClose} tabIndex={open ? 0 : -1} className="btn-primary">
            <CalendarCheck className="h-4 w-4" aria-hidden />
            دریافت نوبت
          </Link>
          <Link href="/login" onClick={onClose} tabIndex={open ? 0 : -1} className="btn-outline">
            <LogIn className="h-4 w-4" aria-hidden />
            ورود / ثبت‌نام
          </Link>
          <p className="mt-1 text-center text-[11px] text-navy-400 ltr">{siteConfig.contact.phone}</p>
        </div>
      </div>
    </div>
  );
}
