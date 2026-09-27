/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — the single place to rebrand the demo.
 *  Replace brand, doctor, contact details and navigation here.
 *  Everything below is FICTIONAL placeholder content.
 * ─────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  brand: {
    name: "Medora",
    nameFa: "مدورا",
    tagline: "پلتفرم خدمات و آموزش پزشکی",
    description:
      "مدورا؛ پلتفرم یکپارچه نوبت‌دهی، مشاوره آنلاین و آموزش تخصصی پزشکی. (نسخه نمایشی)",
    url: "https://medora-demo.example",
  },

  /** Featured doctor shown on the homepage. Set `image` to a file in /public to use a photo. */
  doctor: {
    id: "dr-1",
    name: "دکتر آرمان نیک‌پور",
    title: "متخصص داخلی",
    subtitle: "عضو هیئت علمی و مدرس آموزش بالینی",
    image: null as string | null, // e.g. "/images/doctor.jpg"
    experienceYears: 15,
    patients: "۱۲٬۰۰۰+",
    bio: "پزشک و مدرس با سابقه طولانی در آموزش پزشکی عمومی و بالینی. این شخصیت و اطلاعات کاملاً ساختگی و صرفاً برای نمایش است.",
  },

  contact: {
    phone: "021-00000000",
    mobile: "0912-000-0000",
    email: "info@medora-demo.example",
    address: "تهران، خیابان نمونه، ساختمان نمونه، طبقه ۳ (آدرس نمایشی)",
    hours: "شنبه تا چهارشنبه، ۹ تا ۱۸",
  },

  social: [
    { label: "اینستاگرام", href: "#" },
    { label: "تلگرام", href: "#" },
    { label: "لینکدین", href: "#" },
  ],
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
  { label: "خانه", href: "/" },
  { label: "خدمات پزشکی", href: "/services" },
  { label: "نوبت‌دهی", href: "/appointment" },
  { label: "ویزیت آنلاین", href: "/consultation" },
  { label: "آموزش پزشکی", href: "/education" },
  { label: "مقالات", href: "/articles" },
  { label: "دوره‌ها", href: "/courses" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

/** Formatting for prices. Production could switch to Rial or add multi-currency. */
export const currency = {
  label: "تومان",
};
