/**
 * Domain types. These mirror the entities a production backend would expose.
 * Most entities carry an owner id (doctorId / instructorId) so the platform can
 * grow from one doctor to many without changing the shape of the UI.
 */

export type Role = "patient" | "doctor" | "admin";

export type ServiceKind = "in-person" | "phone" | "online";

export interface MedicalService {
  id: string;
  kind: ServiceKind | "records";
  title: string;
  description: string;
  icon: "calendar" | "chat" | "phone" | "records";
  href: string;
  cta: string;
  price?: number;
  durationMin?: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  initials: string;
  rating: number;
  reviews: number;
  nextAvailable: string;
  services: ServiceKind[];
}

export type ContentType = "pdf" | "ebook" | "video" | "course" | "package";

export type EduCategory =
  | "general"
  | "specialty"
  | "pharmacology"
  | "diagnosis"
  | "clinical-skills"
  | "exam-review"
  | "resources";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  free?: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Product {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
  author: string;
  /** Owner / instructor id — supports multiple instructors later. */
  instructorId: string;
  category: EduCategory;
  shortDescription: string;
  description: string;
  price: number; // 0 = free
  discountPercent?: number;
  rating: number;
  reviews: number;
  coverTone: "navy" | "blue" | "teal" | "slate" | "indigo";
  // course / video specifics
  sessions?: number;
  duration?: string;
  level?: "مقدماتی" | "متوسط" | "پیشرفته";
  objectives?: string[];
  curriculum?: CourseSection[];
  // file specifics
  pages?: number;
  fileSize?: string;
  format?: string;
  students?: number;
  tags?: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  readingMinutes: number;
  date: string;
  excerpt: string;
  body: string[];
  author: string;
  tone: Product["coverTone"];
  featured?: boolean;
}

export type AppointmentStatus = "confirmed" | "pending" | "done" | "cancelled";

export interface Appointment {
  id: string; // demo appointment number, e.g. MD-240517
  serviceKind: ServiceKind;
  doctorId: string;
  date: string; // ISO date yyyy-mm-dd
  time: string; // HH:mm
  patientName: string;
  phone: string;
  notes?: string;
  status: AppointmentStatus;
  amount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  from: "patient" | "doctor" | "system";
  text: string;
  time: string;
  attachment?: { name: string; size: string; kind: "image" | "file" };
}

export interface Consultation {
  id: string;
  subject: string;
  doctorId: string;
  status: "open" | "answered" | "closed" | "awaiting-payment";
  createdAt: string;
  messages: ChatMessage[];
}

export type OrderItemKind = ContentType | "appointment" | "consultation";

export interface Order {
  id: string;
  itemId: string;
  itemTitle: string;
  kind: OrderItemKind;
  amount: number;
  discount: number;
  total: number;
  status: "paid" | "pending" | "refunded";
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind: "appointment" | "course" | "payment" | "system";
}

export type VisitStatus = "completed" | "scheduled" | "no-show" | "cancelled";

export interface PatientVisit {
  id: string;
  date: string;
  service: ServiceKind;
  reason: string;
  status: VisitStatus;
  doctorId: string;
}

export interface Patient {
  id: string; // e.g. P-10231
  name: string;
  phone: string;
  gender: "زن" | "مرد";
  birthYear: number;
  city: string;
  lastVisit: string; // ISO
  lastService: ServiceKind;
  status: VisitStatus;
  visits: PatientVisit[];
  notes: { date: string; text: string; author: string }[];
  files: { name: string; date: string; size: string }[];
  payments: { id: string; date: string; amount: number; title: string }[];
}
