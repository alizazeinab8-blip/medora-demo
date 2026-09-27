import type { Role } from "@/types";

/**
 * ─────────────────────────────────────────────────────────────
 *  ROLE-BASED ACCESS CONTROL — architecture sketch.
 *
 *  In the demo this only drives what the UI shows.
 *  In production the SAME permission map must be enforced on the
 *  server for every request (API middleware), and every access to
 *  medical records must be written to an audit log.
 * ─────────────────────────────────────────────────────────────
 */

export type Permission =
  | "record:read:own"
  | "record:read:assigned"
  | "record:read:any"
  | "record:write"
  | "record:export"
  | "appointment:manage"
  | "consultation:reply"
  | "content:manage"
  | "orders:manage"
  | "users:manage"
  | "settings:manage";

export const rolePermissions: Record<Role, Permission[]> = {
  patient: ["record:read:own"],
  doctor: ["record:read:assigned", "record:write", "record:export", "appointment:manage", "consultation:reply"],
  admin: [
    "record:read:any",
    "record:export",
    "appointment:manage",
    "content:manage",
    "orders:manage",
    "users:manage",
    "settings:manage",
  ],
};

export const roleLabels: Record<Role, string> = {
  patient: "بیمار / کاربر",
  doctor: "پزشک",
  admin: "مدیر سیستم",
};

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

/** Human-readable descriptions for the security architecture panel. */
export const permissionLabels: Record<Permission, string> = {
  "record:read:own": "مشاهده پرونده خود",
  "record:read:assigned": "مشاهده پرونده بیماران تحت درمان",
  "record:read:any": "دسترسی مدیریتی به پرونده‌ها (با ثبت دلیل)",
  "record:write": "ثبت یادداشت و سوابق",
  "record:export": "خروجی گرفتن از اطلاعات",
  "appointment:manage": "مدیریت نوبت‌ها",
  "consultation:reply": "پاسخ به مشاوره‌ها",
  "content:manage": "مدیریت محتوای آموزشی",
  "orders:manage": "مدیریت سفارش‌ها",
  "users:manage": "مدیریت کاربران",
  "settings:manage": "تنظیمات سیستم",
};
