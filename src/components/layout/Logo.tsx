import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/format";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-9 w-9", className)} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#111d33" />
      <path d="M17 10h6v7h7v6h-7v7h-6v-7h-7v-6h7z" fill="#fff" />
      <circle cx="30" cy="10" r="3.2" fill="#46b9ac" />
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label={`${siteConfig.brand.nameFa} — صفحه اصلی`}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("text-lg font-extrabold", inverted ? "text-white" : "text-navy-900")}>
          {siteConfig.brand.nameFa}
        </span>
        <span className={cn("mt-1 text-[10px] font-medium tracking-[0.2em]", inverted ? "text-navy-300" : "text-navy-400")}>
          {siteConfig.brand.name.toUpperCase()}
        </span>
      </span>
    </Link>
  );
}
