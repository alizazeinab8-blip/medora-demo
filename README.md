# Medora (مدورا) — Medical & Medical-Education Platform · Frontend Demo

A clickable, Persian (RTL) frontend demo that shows how a combined **medical services + medical education** platform would work: appointment booking, online and phone consultation, a content store (courses, videos, PDFs, e-books, packages), a video learning interface, and three dashboards (patient, doctor, admin).

> **This is a demo.** There is no backend, database, authentication, payment gateway, SMS, VoIP, DRM or real medical data. All names, numbers and messages are fictional. Nothing in it is medical advice. "Medora / مدورا" is a placeholder brand, not a real institution.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build` · `npm start` · `npm run typecheck`

Requires Node.js 18.18+ (tested on Node 22). No API keys or environment variables. The Vazirmatn font is bundled from npm, so the demo works offline.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3 · lucide-react icons · localStorage for demo state.

---

## 1. Project structure

```
src/
├─ config/site.ts           ← REBRAND HERE: brand, doctor, contact, navigation
├─ types/index.ts           ← domain types (Patient, Product, Appointment, Order…)
├─ data/                    ← ALL MOCK DATA (separate from the app code)
│  ├─ services.ts           services, pricing, doctors, time slots
│  ├─ catalog.ts            16 products, categories, instructors, curricula
│  ├─ articles.ts           8 fictional articles
│  ├─ patients.ts           18 fictional patients with visits/notes/files/payments
│  └─ dashboard.ts          demo user seed, doctor workload, admin stats & tables
├─ lib/
│  ├─ api.ts                read layer — swap bodies for fetch() in production
│  ├─ demo-store.ts         write layer — localStorage store; each action notes its real API
│  ├─ permissions.ts        role → permission map (RBAC sketch)
│  └─ format.ts             Persian digits, Jalali dates, prices
├─ components/
│  ├─ layout/               Header (+ MobileMenu, DemoBar), Footer, Logo
│  ├─ ui/                   Modal, Toast, Cover, primitives (Badge, Price, StatCard…),
│  │                        controls (SearchBar, FilterBar, Select, responsive DataTable)
│  ├─ home/                 Hero, homepage sections, ContactForm
│  ├─ cards/                ServiceCard, DoctorCard, ProductCard (Course/Book/Video variants),
│  │                        ArticleCard, ArticlesBrowser
│  ├─ booking/              AppointmentBooking, AppointmentCalendar, TimeSlotPicker
│  ├─ consultation/         ConsultationChat, ConsultationCenter
│  ├─ course/               CatalogBrowser, CourseDetails, Curriculum, VideoPlayer,
│  │                        LearningInterface, BookDetails
│  ├─ payment/              PaymentSummary, CheckoutFlow
│  ├─ patients/             PatientManager (PatientTable + filters), PatientProfile, ExportPanel
│  ├─ dashboard/            DashboardShell, UserViews, DoctorViews, AdminViews, LoginPanel
│  └─ charts/Charts.tsx     GroupedBarChart, HBarChart, Sparkline (no chart library)
└─ app/
   ├─ (site)/…              public pages (shared header/footer)
   ├─ dashboard/…           patient/user panel
   ├─ doctor/…              doctor panel
   └─ admin/…               admin panel
```

## 2. Routes

**Public**

| Route | Page |
|---|---|
| `/` | Homepage — hero, quick appointment, services, featured doctor, online consultation, content types, courses, books, videos, articles, categories, trust, contact CTA |
| `/services` | Medical services, pricing, doctors |
| `/appointment` | 6-step booking (accepts `?service=` and `?doctor=`) |
| `/consultation` | Online text consultation: process + chat + history |
| `/phone-consultation` | Phone consultation info + booking |
| `/education` | Education hub with category tabs (`?category=`) and instructors |
| `/store` | Full content catalog with type/category/price filters, search, sort (`?type=`) |
| `/store/[slug]` | PDF / e-book details, preview, purchase |
| `/courses` | Courses, videos, packages |
| `/courses/[slug]` | Course details, objectives, curriculum, buy / preview |
| `/courses/[slug]/learn` | Video learning interface with locked lessons & progress |
| `/checkout?item=slug` | Demo payment for any product |
| `/articles`, `/articles/[slug]` | Articles with featured, categories, search |
| `/about`, `/contact`, `/login` | About, contact form, demo login / role picker |

**Patient panel** — `/dashboard` (overview), `/profile`, `/appointments`, `/consultations`, `/visits`, `/record`, `/orders`, `/payments`, `/courses`, `/library`, `/videos`, `/notifications`

**Doctor panel** — `/doctor` (today, requests, recent patients, messages, activity), `/doctor/appointments`, `/doctor/patients`, `/doctor/patients/[id]`, `/doctor/consultations`, `/doctor/export`

**Admin panel** — `/admin` (stats + charts + tables), `/admin/patients`, `/admin/patients/[id]`, `/admin/reports` (export), `/admin/settings`, and `/admin/{users|doctors|content|books|videos|courses|products|orders|payments|appointments|consultations}`

## 3. Demo interactions

- **Booking:** service → date (next 14 days, Fridays closed) → time slot (some taken) → patient info (validates Iranian mobile, accepts Persian digits) → summary → demo payment → success with appointment number. The appointment then appears in *نوبت‌های من*, the patient record, orders, payments and notifications, and can be cancelled.
- **Payments:** order summary, item discount, coupon codes `MEDORA10` / `STUDENT20`, method choice, "پرداخت آزمایشی" → success message and order/payment records.
- **Courses:** buy → content unlocks; free-preview lessons play before purchase; locked lessons show *«برای دسترسی به این جلسه، ابتدا دوره را تهیه کنید.»*; simulated playback and "mark complete" drive the progress bar (saved).
- **Books/PDFs:** preview modal, purchase or free claim → *«این محتوا در پنل کاربری شما در دسترس است.»*, demo download.
- **Consultation:** new request → demo payment → chat with attachment picker (file name only, nothing uploaded), timestamps and a demo auto-reply. Doctor replies from `/doctor/consultations` appear in the patient panel.
- **Patient management:** search by name, phone or ID; filters for date range (presets or custom), service type, visit status, visit type; row → patient record with tabs, doctor notes, access-control panel and audit-log sample.
- **Export:** date range, patient, service, status, visit type, data fields; Excel / CSV / PDF buttons show a success toast and a recent-exports list (no file generated).
- **Other:** catalog/article filters and search, mobile menu, responsive tables (cards on mobile), admin charts with table view, settings toggles, demo login with OTP screen and role picker, and **"بازنشانی داده‌های نمایشی"** in every dashboard sidebar to reset the demo.

## 4. Demo limitations

- State lives only in the visitor's browser (localStorage); another browser starts fresh.
- No authentication: any visitor can open any panel. The role picker is cosmetic.
- Payments, SMS, phone calls, video streaming, file upload/download and exports are simulated.
- Admin "add" forms and settings don't persist. Doctor/admin tables use static mock data.
- Dates for booking use the visitor's clock; mock records are anchored around 5 Mehr 1405.
- Search engines are told not to index the demo (`robots: noindex`). SEO structure is in place (semantic HTML, headings, metadata, clean URLs, alt/aria labels) but is not production-tuned.
- No claims of regulatory compliance are made.

## 5. What the production version adds

- Backend API + database (e.g. Node/NestJS or Laravel + PostgreSQL), admin CMS.
- Real auth: SMS OTP, httpOnly sessions, server-side role-based access control.
- Encryption in transit and at rest for medical data, audit logs for every record access/export, backups, secure object storage with signed, expiring URLs.
- Iranian payment gateway (Shaparak PSP) with server-side verification; refunds and invoices.
- SMS provider for OTP and reminders; optional VoIP or click-to-call.
- Video hosting with HLS, per-user watermarking and DRM where needed.
- Real file generation for Excel/CSV/PDF exports as background jobs.
- Notifications (SMS, email, push), analytics, error monitoring, SEO (sitemap, structured data).

## 6. Where real systems connect

| Concern | Demo file | Production replacement |
|---|---|---|
| Reading data | `src/lib/api.ts` | Replace each function body with `fetch()` to the API — call sites don't change |
| Writing data | `src/lib/demo-store.ts` (`demoActions`) | Each action is annotated with its endpoint (`POST /api/appointments`, `POST /api/orders` + gateway, `POST /api/consultations/:id/messages`, …) |
| Auth & roles | `src/components/dashboard/LoginPanel.tsx`, `src/lib/permissions.ts` | OTP endpoints, session middleware, the same permission map enforced server-side |
| Payment | `src/components/payment/PaymentSummary.tsx` (`onPay`) | Create order → redirect to PSP → verify callback |
| Files & video | `ConsultationChat`, `BookDetails`, `VideoPlayer` | Upload to secure storage; signed URLs; HLS player |
| Exports | `src/components/patients/ExportPanel.tsx` | `POST /api/exports` background job |
| Brand & contact | `src/config/site.ts`, `tailwind.config.ts` colors | Client's real data / CMS |

## 7. How the architecture scales

- **Multiple doctors:** doctors are already a list; appointments, consultations and visits carry `doctorId`; booking lets the user pick a doctor and filters by supported services. A doctor directory page and per-doctor schedules plug into `api.doctors`.
- **Multiple instructors:** every product has `instructorId`; the education page already lists instructors. An instructor panel is another `DashboardShell` role.
- **Courses, exams, certificates:** courses are `sections → lessons`; adding `quiz` lesson types, an exam engine and certificate generation extends the same model. Progress tracking is already per lesson.
- **Subscriptions / membership:** ownership is checked in one place (`purchases.includes(id)`); replace it with an entitlement check (`hasAccess(user, product)`) that also considers plans.
- **Mobile apps:** all data flows through `api.ts` / `demoActions`, which map 1:1 to REST endpoints a React Native or Flutter app can reuse.
- **AI features, medical calculators, external APIs, notifications:** new modules are a route + a sidebar line in `DashboardShell` (`NAV`) + an `api` namespace; admin sections are a config entry in `AdminViews.tsx`.

## Rebranding checklist

1. `src/config/site.ts` — brand name, featured doctor (set `image` to a file in `/public`), contact, navigation.
2. `tailwind.config.ts` — `navy`, `brand`, `teal` color scales.
3. `src/components/layout/Logo.tsx` — logo mark.
4. `src/data/*` — services, prices, doctors, courses, products, articles.
