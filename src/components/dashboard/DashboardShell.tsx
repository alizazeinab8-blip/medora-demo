"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ChartColumn,
  ClipboardList,
  CreditCard,
  FileDown,
  FileText,
  FolderOpen,
  GraduationCap,
  House,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Package,
  Receipt,
  RotateCcw,
  Settings,
  ShoppingBag,
  Stethoscope,
  UserCog,
  UserRound,
  Users,
  Video,
  X,
} from "lucide-react";
import type { Role } from "@/types";
import { Logo } from "@/components/layout/Logo";
import { Avatar } from "@/components/ui/primitives";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { roleLabels } from "@/lib/permissions";
import { useToast } from "@/components/ui/Toast";
import { cn, fa } from "@/lib/format";
import { demoUser } from "@/data/dashboard";

type NavItem = { label: string; href: string; icon: typeof House; exact?: boolean };

/** Sidebar navigation per role. Adding a module = adding one line here + a route. */
const NAV: Record<Role, NavItem[]> = {
  patient: [
    { label: "داشبورد", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "اطلاعات حساب", href: "/dashboard/profile", icon: UserRound },
    { label: "نوبت‌های من", href: "/dashboard/appointments", icon: CalendarCheck },
    { label: "مشاوره‌های آنلاین", href: "/dashboard/consultations", icon: MessagesSquare },
    { label: "سوابق ویزیت", href: "/dashboard/visits", icon: ClipboardList },
    { label: "پرونده سلامت", href: "/dashboard/record", icon: FolderOpen },
    { label: "سفارش‌ها", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "پرداخت‌ها", href: "/dashboard/payments", icon: CreditCard },
    { label: "دوره‌های من", href: "/dashboard/courses", icon: GraduationCap },
    { label: "کتاب‌ها و فایل‌ها", href: "/dashboard/library", icon: BookOpen },
    { label: "ویدیوهای خریداری‌شده", href: "/dashboard/videos", icon: Video },
    { label: "اعلان‌ها", href: "/dashboard/notifications", icon: Bell },
  ],
  doctor: [
    { label: "داشبورد", href: "/doctor", icon: LayoutDashboard, exact: true },
    { label: "نوبت‌ها", href: "/doctor/appointments", icon: CalendarDays },
    { label: "بیماران", href: "/doctor/patients", icon: Users },
    { label: "مشاوره‌ها و پیام‌ها", href: "/doctor/consultations", icon: MessagesSquare },
    { label: "خروجی اطلاعات", href: "/doctor/export", icon: FileDown },
  ],
  admin: [
    { label: "داشبورد", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "کاربران", href: "/admin/users", icon: UserCog },
    { label: "بیماران", href: "/admin/patients", icon: Users },
    { label: "پزشکان", href: "/admin/doctors", icon: Stethoscope },
    { label: "محتوا", href: "/admin/content", icon: FileText },
    { label: "کتاب‌ها", href: "/admin/books", icon: BookOpen },
    { label: "ویدیوها", href: "/admin/videos", icon: Video },
    { label: "دوره‌ها", href: "/admin/courses", icon: GraduationCap },
    { label: "محصولات", href: "/admin/products", icon: Package },
    { label: "سفارش‌ها", href: "/admin/orders", icon: ShoppingBag },
    { label: "پرداخت‌ها", href: "/admin/payments", icon: Receipt },
    { label: "نوبت‌ها", href: "/admin/appointments", icon: CalendarCheck },
    { label: "مشاوره‌ها", href: "/admin/consultations", icon: MessagesSquare },
    { label: "گزارش‌ها", href: "/admin/reports", icon: ChartColumn },
    { label: "تنظیمات", href: "/admin/settings", icon: Settings },
  ],
};

const identity: Record<Role, { name: string; initials: string; sub: string }> = {
  patient: { name: demoUser.name, initials: "ما", sub: "بیمار / کاربر" },
  doctor: { name: "دکتر آرمان نیک‌پور", initials: "آن", sub: "متخصص داخلی" },
  admin: { name: "مدیر سیستم", initials: "مد", sub: "دسترسی کامل (نمایشی)" },
};

export function DashboardShell({ role, children }: { role: Role; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const unread = useDemoStore((s) => s.notifications);
  const unreadCount = unread.filter((n) => !n.read).length;
  const toast = useToast();
  const nav = NAV[role];
  const me = identity[role];

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const active = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));
  const current = [...nav].sort((a, b) => b.href.length - a.href.length).find(active);

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-navy-100 px-5">
        <Logo />
        <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-navy-500 hover:bg-navy-50 lg:hidden" aria-label="بستن منو">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-surface p-3">
          <Avatar initials={me.initials} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{me.name}</p>
            <p className="truncate text-[11px] text-navy-500">{me.sub}</p>
          </div>
        </div>
      </div>
      <nav aria-label={`منوی ${roleLabels[role]}`} className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {nav.map((item) => {
            const isActive = item === current;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    isActive ? "bg-navy-900 font-semibold text-white" : "text-navy-600 hover:bg-navy-50 hover:text-navy-900",
                  )}
                >
                  <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                    <span className={cn("rounded-full px-1.5 text-[11px] font-bold", isActive ? "bg-white text-navy-900" : "bg-brand-600 text-white")}>
                      {fa(unreadCount)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-1 border-t border-navy-100 p-3 text-sm">
        <p className="px-3 pb-1 text-[11px] font-semibold text-navy-400">پنل‌های نمایشی</p>
        {(Object.keys(NAV) as Role[])
          .filter((r) => r !== role)
          .map((r) => (
            <Link key={r} href={NAV[r][0].href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-navy-600 hover:bg-navy-50">
              <Layers className="h-4 w-4" aria-hidden /> {roleLabels[r]}
            </Link>
          ))}
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-navy-600 hover:bg-navy-50">
          <House className="h-4 w-4" aria-hidden /> بازگشت به سایت
        </Link>
        <button
          onClick={() => {
            demoActions.reset();
            toast("داده‌های نمایشی به حالت اولیه بازگشت.", "info");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-navy-600 hover:bg-navy-50"
        >
          <RotateCcw className="h-4 w-4" aria-hidden /> بازنشانی داده‌های نمایشی
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface lg:grid grid-cols-1 lg:grid-cols-[272px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-l border-navy-100 bg-white lg:block">{Sidebar}</aside>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-[80] overflow-hidden lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
        <div className={cn("absolute inset-0 bg-navy-950/40 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <aside
          className={cn(
            "absolute inset-y-0 right-0 w-[84%] max-w-[300px] bg-white shadow-lift transition-transform duration-200",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          {Sidebar}
        </aside>
      </div>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-navy-100 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button onClick={() => setOpen(true)} className="rounded-xl p-2 text-navy-700 hover:bg-navy-50 lg:hidden" aria-label="باز کردن منو">
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0">
              <p className="truncate text-[11px] text-navy-400">{roleLabels[role]}</p>
              <p className="truncate text-sm font-bold text-navy-900">{current?.label ?? "داشبورد"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip hidden bg-amber-50 text-amber-700 sm:inline-flex">نسخه نمایشی</span>
            {role === "patient" && (
              <Link href="/dashboard/notifications" className="relative rounded-xl p-2 text-navy-600 hover:bg-navy-50" aria-label={`اعلان‌ها (${fa(unreadCount)} خوانده‌نشده)`}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute left-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />}
              </Link>
            )}
            <Link href="/login" className="rounded-xl p-2 text-navy-600 hover:bg-navy-50" aria-label="تغییر نقش / خروج" title="تغییر نقش / خروج">
              <LogOut className="h-5 w-5 -scale-x-100" />
            </Link>
          </div>
        </header>
        <main id="main" className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

