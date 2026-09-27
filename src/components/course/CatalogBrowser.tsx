"use client";

import { useMemo, useState } from "react";
import type { ContentType, EduCategory, Product } from "@/types";
import { CatalogCard } from "@/components/cards/ProductCard";
import { FilterBar, SearchBar, Select } from "@/components/ui/controls";
import { EmptyState } from "@/components/ui/primitives";
import { contentTypeLabels, eduCategories } from "@/data/catalog";
import { discounted, fa } from "@/lib/format";

type Sort = "popular" | "rating" | "price-asc" | "price-desc";
type TypeFilter = ContentType | "all";
type CatFilter = EduCategory | "all";
type PriceFilter = "all" | "free" | "paid";

export function CatalogBrowser({
  items,
  initialType = "all",
  initialCategory = "all",
  showTypeFilter = true,
  primary = "type",
}: {
  items: Product[];
  initialType?: TypeFilter;
  initialCategory?: CatFilter;
  showTypeFilter?: boolean;
  /** Which filter renders as the prominent tab row. */
  primary?: "type" | "category";
}) {
  const [q, setQ] = useState("");
  const [type, setType] = useState<TypeFilter>(initialType);
  const [category, setCategory] = useState<CatFilter>(initialCategory);
  const [price, setPrice] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<Sort>("popular");

  const filtered = useMemo(() => {
    const term = q.trim();
    const list = items.filter(
      (p) =>
        (type === "all" || p.type === type) &&
        (category === "all" || p.category === category) &&
        (price === "all" || (price === "free" ? p.price === 0 : p.price > 0)) &&
        (!term || p.title.includes(term) || p.author.includes(term) || p.shortDescription.includes(term)),
    );
    const final = (p: Product) => discounted(p.price, p.discountPercent);
    return [...list].sort((a, b) =>
      sort === "rating"
        ? b.rating - a.rating
        : sort === "price-asc"
          ? final(a) - final(b)
          : sort === "price-desc"
            ? final(b) - final(a)
            : b.reviews - a.reviews,
    );
  }, [items, q, type, category, price, sort]);

  const availableTypes = Array.from(new Set(items.map((p) => p.type)));
  const typeOptions = [
    { value: "all" as TypeFilter, label: "همه", count: items.length },
    ...availableTypes.map((t) => ({ value: t as TypeFilter, label: contentTypeLabels[t], count: items.filter((p) => p.type === t).length })),
  ];
  const catOptions = [
    { value: "all" as CatFilter, label: "همه دسته‌ها" },
    ...eduCategories.map((c) => ({ value: c.id as CatFilter, label: c.label })),
  ];

  return (
    <div>
      {primary === "category" ? (
        <FilterBar label="دسته‌بندی آموزشی" options={catOptions} value={category} onChange={setCategory} className="mb-5" />
      ) : (
        showTypeFilter && <FilterBar label="نوع محتوا" options={typeOptions} value={type} onChange={setType} className="mb-5" />
      )}

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-navy-100 bg-surface p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:items-end">
        <div>
          <span className="label">جستجو</span>
          <SearchBar value={q} onChange={setQ} placeholder="عنوان، مدرس یا موضوع..." label="جستجوی محتوا" />
        </div>
        {primary === "category" ? (
          showTypeFilter && (
            <Select label="نوع محتوا" value={type} onChange={setType} options={typeOptions.map(({ value, label }) => ({ value, label }))} />
          )
        ) : (
          <Select label="دسته‌بندی" value={category} onChange={setCategory} options={catOptions} />
        )}
        <Select<PriceFilter>
          label="قیمت"
          value={price}
          onChange={setPrice}
          options={[
            { value: "all", label: "همه" },
            { value: "free", label: "رایگان" },
            { value: "paid", label: "غیررایگان" },
          ]}
        />
        <Select<Sort>
          label="مرتب‌سازی"
          value={sort}
          onChange={setSort}
          options={[
            { value: "popular", label: "محبوب‌ترین" },
            { value: "rating", label: "بیشترین امتیاز" },
            { value: "price-asc", label: "ارزان‌ترین" },
            { value: "price-desc", label: "گران‌ترین" },
          ]}
        />
      </div>

      <p className="mb-4 text-sm text-navy-500" aria-live="polite">
        {fa(filtered.length)} مورد یافت شد
      </p>

      {filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <CatalogCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="محتوایی با این مشخصات یافت نشد"
          description="فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید."
          action={
            <button
              className="btn-outline"
              onClick={() => {
                setQ("");
                setType("all");
                setCategory("all");
                setPrice("all");
              }}
            >
              پاک کردن فیلترها
            </button>
          }
        />
      )}
    </div>
  );
}
