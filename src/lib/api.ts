/**
 * ─────────────────────────────────────────────────────────────
 *  API SERVICE LAYER (demo implementation)
 *
 *  Pages and components read data through these functions instead of
 *  importing mock files directly. To go to production, replace each
 *  body with a fetch() to the real backend — the call sites stay the same.
 *
 *    const res = await fetch(`${process.env.API_URL}/catalog?type=${type}`, { next: { revalidate: 60 } });
 *    return res.json();
 *
 *  Mutations (booking, payment, messages) live in lib/demo-store.ts.
 * ─────────────────────────────────────────────────────────────
 */

import { articles, articleBySlug } from "@/data/articles";
import { products, productBySlug, eduCategories, instructors } from "@/data/catalog";
import { doctors, medicalServices, servicePricing, defaultTimeSlots, unavailableSlotsFor } from "@/data/services";
import { patients, patientById } from "@/data/patients";
import type { ContentType, EduCategory } from "@/types";

export const api = {
  services: {
    /** GET /api/services */
    list: () => medicalServices,
    /** GET /api/services/pricing */
    pricing: () => servicePricing,
  },
  doctors: {
    /** GET /api/doctors */
    list: () => doctors,
    /** GET /api/doctors/:id/availability?date= */
    availability: (date: string) => ({
      slots: defaultTimeSlots,
      unavailable: unavailableSlotsFor(date),
    }),
  },
  catalog: {
    /** GET /api/catalog?type=&category= */
    list: (filter?: { type?: ContentType; category?: EduCategory }) =>
      products.filter(
        (p) => (!filter?.type || p.type === filter.type) && (!filter?.category || p.category === filter.category),
      ),
    /** GET /api/catalog/:slug */
    bySlug: (slug: string) => productBySlug(slug),
    categories: () => eduCategories,
    instructors: () => instructors,
  },
  articles: {
    /** GET /api/articles */
    list: () => articles,
    /** GET /api/articles/:slug */
    bySlug: (slug: string) => articleBySlug(slug),
  },
  patients: {
    /** GET /api/patients?q=&from=&to=&service=&status= — requires doctor/admin role + audit log */
    list: () => patients,
    /** GET /api/patients/:id — requires permission check + audit log */
    byId: (id: string) => patientById(id),
  },
};
