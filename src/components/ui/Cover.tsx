import { BookOpen, CirclePlay, FileText, GraduationCap, Layers, Newspaper } from "lucide-react";
import type { ContentType, Product } from "@/types";
import { cn } from "@/lib/format";
import { contentTypeLabels } from "@/data/catalog";

/**
 * Generated cover art for products and articles — no external images needed.
 * PRODUCTION: replace with <Image src={product.coverUrl} ... /> from the CMS / object storage.
 */

const tones: Record<Product["coverTone"], { bg: string; accent: string }> = {
  navy: { bg: "bg-navy-900", accent: "#46b9ac" },
  blue: { bg: "bg-brand-800", accent: "#8ebcff" },
  teal: { bg: "bg-teal-700", accent: "#aee8df" },
  slate: { bg: "bg-navy-600", accent: "#c5d1e5" },
  indigo: { bg: "bg-[#2b2f6b]", accent: "#bcd6ff" },
};

const typeIcons: Record<ContentType | "article", typeof BookOpen> = {
  pdf: FileText,
  ebook: BookOpen,
  video: CirclePlay,
  course: GraduationCap,
  package: Layers,
  article: Newspaper,
};

interface CoverProps {
  title: string;
  tone: Product["coverTone"];
  type: ContentType | "article";
  className?: string;
  size?: "sm" | "md" | "lg";
  showTitle?: boolean;
}

export function Cover({ title, tone, type, className, size = "md", showTitle = true }: CoverProps) {
  const t = tones[tone];
  const Icon = typeIcons[type];
  return (
    <div
      role="img"
      aria-label={`تصویر جلد: ${title}`}
      className={cn("relative isolate overflow-hidden text-white", t.bg, className)}
    >
      <svg className="absolute inset-0 -z-10 h-full w-full opacity-[0.18]" preserveAspectRatio="none" viewBox="0 0 400 300" aria-hidden>
        <defs>
          <pattern id={`grid-${tone}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#fff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={`url(#grid-${tone})`} />
        <path
          d="M0 200 H120 L140 170 L160 230 L185 110 L210 250 L230 200 H400"
          fill="none"
          stroke={t.accent}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
      <div className="absolute -left-10 -top-10 -z-10 h-40 w-40 rounded-full bg-white/5" aria-hidden />
      <div className={cn("flex h-full flex-col justify-between", size === "sm" ? "p-3" : "p-5")}>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {type === "article" ? "مقاله" : contentTypeLabels[type]}
        </span>
        {showTitle && (
          <p
            className={cn(
              "font-bold leading-relaxed",
              size === "sm" && "line-clamp-2 text-xs",
              size === "md" && "line-clamp-2 text-base",
              size === "lg" && "text-xl sm:text-2xl",
            )}
          >
            {title}
          </p>
        )}
      </div>
    </div>
  );
}
