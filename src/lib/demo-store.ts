"use client";

import { useSyncExternalStore } from "react";
import type { Appointment, ChatMessage, Consultation, Notification, Order, Role } from "@/types";
import {
  seedAppointments,
  seedConsultations,
  seedNotifications,
  seedOrders,
  seedPurchases,
} from "@/data/dashboard";
import { demoId, isoDate } from "./format";

/**
 * ─────────────────────────────────────────────────────────────
 *  DEMO STORE (localStorage)
 *  Stands in for the backend during the demo. Every mutation here
 *  corresponds to a real API call in production — see the
 *  "PRODUCTION:" comments on each action.
 * ─────────────────────────────────────────────────────────────
 */

export interface PaymentRecord {
  id: string;
  orderId: string;
  title: string;
  amount: number;
  date: string;
  status: "success";
}

export interface DemoState {
  version: number;
  role: Role;
  loggedIn: boolean;
  appointments: Appointment[];
  consultations: Consultation[];
  orders: Order[];
  payments: PaymentRecord[];
  purchases: string[];
  notifications: Notification[];
  lessonProgress: Record<string, string[]>; // productId -> completed lesson ids
}

const STORAGE_KEY = "medora-demo-state";
const VERSION = 1;

function seed(): DemoState {
  return {
    version: VERSION,
    role: "patient",
    loggedIn: true,
    appointments: seedAppointments,
    consultations: seedConsultations,
    orders: seedOrders,
    payments: seedOrders.map((o, i) => ({
      id: `PAY-${99000 + i}`,
      orderId: o.id,
      title: o.itemTitle,
      amount: o.total,
      date: o.date,
      status: "success" as const,
    })),
    purchases: seedPurchases,
    notifications: seedNotifications,
    lessonProgress: { "p-exam": ["s1-l1", "s1-l2", "s2-l1"] },
  };
}

const serverSnapshot: DemoState = seed();
let state: DemoState = serverSnapshot;
let hydrated = false;
const listeners = new Set<() => void>();

function load() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed.version === VERSION) state = { ...seed(), ...parsed };
    }
  } catch {
    /* storage unavailable — keep in-memory seed */
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

function set(updater: (s: DemoState) => DemoState) {
  load();
  state = updater(state);
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  // Notify once after hydration from storage so subscribers pick up saved state.
  queueMicrotask(listener);
  return () => listeners.delete(listener);
}

/**
 * Subscribe to a slice of demo state.
 * Selectors must return an existing reference (e.g. `s => s.orders`), not a new
 * array/object — derive filtered data with useMemo in the component.
 */
export function useDemoStore<T>(selector: (s: DemoState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return selector(state);
    },
    () => selector(serverSnapshot),
  );
}

export function getDemoState(): DemoState {
  load();
  return state;
}

/* ───────────── Actions ───────────── */

export const demoActions = {
  /** PRODUCTION: POST /api/appointments → returns appointment with server-generated number */
  addAppointment(a: Omit<Appointment, "id" | "createdAt" | "status">): Appointment {
    const appt: Appointment = { ...a, id: demoId("MD"), status: "confirmed", createdAt: isoDate(new Date()) };
    set((s) => ({
      ...s,
      appointments: [appt, ...s.appointments],
      notifications: [
        {
          id: demoId("n"),
          title: "نوبت ثبت شد",
          body: `نوبت ${appt.id} با موفقیت ثبت شد.`,
          date: appt.createdAt,
          read: false,
          kind: "appointment",
        },
        ...s.notifications,
      ],
    }));
    return appt;
  },

  /** PRODUCTION: PATCH /api/appointments/:id { status: "cancelled" } */
  cancelAppointment(id: string) {
    set((s) => ({
      ...s,
      appointments: s.appointments.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)),
    }));
  },

  /**
   * PRODUCTION: POST /api/orders then redirect to the payment gateway;
   * the gateway callback (POST /api/payments/verify) marks the order paid.
   */
  recordPayment(input: {
    itemId: string;
    itemTitle: string;
    kind: Order["kind"];
    amount: number;
    discount: number;
  }): Order {
    const today = isoDate(new Date());
    const order: Order = {
      id: demoId("OR"),
      itemId: input.itemId,
      itemTitle: input.itemTitle,
      kind: input.kind,
      amount: input.amount,
      discount: input.discount,
      total: input.amount - input.discount,
      status: "paid",
      date: today,
    };
    set((s) => ({
      ...s,
      orders: [order, ...s.orders],
      payments: [
        { id: demoId("PAY"), orderId: order.id, title: order.itemTitle, amount: order.total, date: today, status: "success" },
        ...s.payments,
      ],
      purchases:
        input.kind === "appointment" || input.kind === "consultation" || s.purchases.includes(input.itemId)
          ? s.purchases
          : [...s.purchases, input.itemId],
      notifications: [
        {
          id: demoId("n"),
          title: "پرداخت آزمایشی موفق",
          body: `سفارش ${order.id} — ${order.itemTitle}`,
          date: today,
          read: false,
          kind: "payment",
        },
        ...s.notifications,
      ],
    }));
    return order;
  },

  /** PRODUCTION: POST /api/consultations (after payment) */
  startConsultation(subject: string, doctorId: string): Consultation {
    const c: Consultation = {
      id: demoId("CN"),
      subject,
      doctorId,
      status: "open",
      createdAt: isoDate(new Date()),
      messages: [
        {
          id: demoId("m"),
          from: "system",
          text: "پرداخت آزمایشی انجام شد. لطفاً شرح حال خود را ارسال کنید.",
          time: nowLabel(),
        },
      ],
    };
    set((s) => ({ ...s, consultations: [c, ...s.consultations] }));
    return c;
  },

  /** PRODUCTION: POST /api/consultations/:id/messages (+ secure file upload) */
  sendMessage(consultationId: string, msg: Omit<ChatMessage, "id" | "time">) {
    const m: ChatMessage = { ...msg, id: demoId("m"), time: nowLabel() };
    set((s) => ({
      ...s,
      consultations: s.consultations.map((c) =>
        c.id === consultationId
          ? { ...c, status: msg.from === "doctor" ? "answered" : "open", messages: [...c.messages, m] }
          : c,
      ),
    }));
  },

  /** PRODUCTION: POST /api/progress { productId, lessonId } */
  toggleLesson(productId: string, lessonId: string) {
    set((s) => {
      const done = s.lessonProgress[productId] ?? [];
      const next = done.includes(lessonId) ? done.filter((l) => l !== lessonId) : [...done, lessonId];
      return { ...s, lessonProgress: { ...s.lessonProgress, [productId]: next } };
    });
  },

  markAllNotificationsRead() {
    set((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },

  /** PRODUCTION: real auth (OTP / password) sets a secure session cookie; role comes from the server. */
  login(role: Role) {
    set((s) => ({ ...s, role, loggedIn: true }));
  },

  logout() {
    set((s) => ({ ...s, loggedIn: false }));
  },

  /** Reset the demo to its initial seed data. */
  reset() {
    set(() => seed());
  },
};

function nowLabel(): string {
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}
