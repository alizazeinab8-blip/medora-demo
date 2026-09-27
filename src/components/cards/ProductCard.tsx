import Link from "next/link";
import { BookOpen, CirclePlay, Clock, FileText, Layers, Users } from "lucide-react";
import type { Product } from "@/types";
import { Cover } from "@/components/ui/Cover";
import { Badge, Price, Rating } from "@/components/ui/primitives";
import { contentTypeLabels, productHref } from "@/data/catalog";
import { fa, faNumber } from "@/lib/format";

/**
 * ProductCard — generic card for any catalog item.
 * CourseCard / BookCard / VideoCard are thin variants that change the meta row.
 */
export function ProductCard({ product, meta }: { product: Product; meta?: React.ReactNode }) {
  const href = productHref(product);
  const free = product.price === 0;
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link href={href} className="relative block" tabIndex={-1} aria-hidden>
        <Cover title={product.title} tone={product.coverTone} type={product.type} className="aspect-[16/10]" showTitle={false} />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {free ? (
            <Badge tone="teal" className="bg-white text-teal-700">رایگان</Badge>
          ) : (
            <Badge className="bg-white/95 text-navy-700">ویژه</Badge>
          )}
          {product.discountPercent ? <Badge tone="red" className="bg-white text-red-600">٪{fa(product.discountPercent)} تخفیف</Badge> : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-medium text-teal-700">{contentTypeLabels[product.type]}</span>
          <Rating value={product.rating} />
        </div>
        <h3 className="mt-2 line-clamp-2 text-[15px] font-bold leading-7">
          <Link href={href} className="hover:text-brand-700">
            {product.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs text-navy-500">{product.author}</p>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-navy-500">{product.shortDescription}</p>
        {meta && <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500">{meta}</div>}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy-100 pt-4">
          <Price price={product.price} discountPercent={product.discountPercent} />
          <Link href={href} className="btn-outline btn-sm shrink-0">
            {free ? "دریافت" : "مشاهده"}
          </Link>
        </div>
      </div>
    </article>
  );
}

const MetaItem = ({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1">
    <Icon className="h-3.5 w-3.5 text-navy-400" aria-hidden />
    {children}
  </span>
);

export function CourseCard({ product }: { product: Product }) {
  return (
    <ProductCard
      product={product}
      meta={
        <>
          <MetaItem icon={product.type === "package" ? Layers : CirclePlay}>{fa(product.sessions ?? 0)} جلسه</MetaItem>
          {product.duration && <MetaItem icon={Clock}>{product.duration}</MetaItem>}
          {product.students && <MetaItem icon={Users}>{faNumber(product.students)} دانشجو</MetaItem>}
        </>
      }
    />
  );
}

export function BookCard({ product }: { product: Product }) {
  return (
    <ProductCard
      product={product}
      meta={
        <>
          <MetaItem icon={product.type === "pdf" ? FileText : BookOpen}>{fa(product.pages ?? 0)} صفحه</MetaItem>
          {product.format && <MetaItem icon={FileText}>{product.format}</MetaItem>}
        </>
      }
    />
  );
}

export function VideoCard({ product }: { product: Product }) {
  return (
    <ProductCard
      product={product}
      meta={
        <>
          <MetaItem icon={CirclePlay}>{fa(product.sessions ?? 0)} ویدیو</MetaItem>
          {product.duration && <MetaItem icon={Clock}>{product.duration}</MetaItem>}
        </>
      }
    />
  );
}

/** Picks the right variant for a product. */
export function CatalogCard({ product }: { product: Product }) {
  if (product.type === "pdf" || product.type === "ebook") return <BookCard product={product} />;
  if (product.type === "video") return <VideoCard product={product} />;
  return <CourseCard product={product} />;
}
