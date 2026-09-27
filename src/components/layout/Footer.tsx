import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

const columns = [
  {
    title: "خدمات پزشکی",
    links: [
      ["نوبت‌دهی مطب", "/appointment"],
      ["ویزیت آنلاین", "/consultation"],
      ["مشاوره تلفنی", "/phone-consultation"],
      ["سوابق مراجعه", "/dashboard/record"],
    ],
  },
  {
    title: "آموزش پزشکی",
    links: [
      ["دوره‌ها", "/courses"],
      ["فروشگاه محتوا", "/store"],
      ["دسته‌بندی‌ها", "/education"],
      ["مقالات", "/articles"],
    ],
  },
  {
    title: "مدورا",
    links: [
      ["درباره ما", "/about"],
      ["تماس با ما", "/contact"],
      ["ورود / ثبت‌نام", "/login"],
      ["پنل پزشک (نمایشی)", "/doctor"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-navy-900 text-navy-200">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo inverted />
            <p className="mt-4 max-w-sm text-sm leading-7 text-navy-300">{siteConfig.brand.description}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400" aria-hidden />
                <span className="ltr">{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400" aria-hidden />
                <span className="ltr break-all">{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden />
                <span className="leading-6">{siteConfig.contact.address}</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="mb-4 text-sm font-bold text-white">{col.title}</h2>
                <ul className="space-y-3 text-sm">
                  {col.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-navy-300 transition-colors hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-navy-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-400" aria-hidden />
            حریم خصوصی و امنیت اطلاعات کاربران برای ما اهمیت دارد.
          </p>
          <p>
            نسخه نمایشی {siteConfig.brand.nameFa} — این وب‌سایت یک مؤسسه درمانی واقعی نیست و محتوای آن جایگزین مشاوره پزشکی
            نیست.
          </p>
        </div>
      </div>
    </footer>
  );
}
