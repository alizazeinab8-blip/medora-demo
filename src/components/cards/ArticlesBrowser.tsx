"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/types";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { FilterBar, SearchBar } from "@/components/ui/controls";
import { EmptyState } from "@/components/ui/primitives";

export function ArticlesBrowser({ articles, categories }: { articles: Article[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const filtering = q.trim() !== "" || cat !== "all";

  const list = useMemo(
    () =>
      articles.filter(
        (a) =>
          (cat === "all" || a.category === cat) &&
          (!q.trim() || a.title.includes(q.trim()) || a.excerpt.includes(q.trim())) &&
          (filtering || a.id !== featured.id),
      ),
    [articles, cat, q, filtering, featured.id],
  );

  return (
    <div>
      {!filtering && (
        <section aria-labelledby="featured-article" className="mb-12">
          <h2 id="featured-article" className="mb-4 text-sm font-bold text-navy-500">
            مقاله ویژه
          </h2>
          <ArticleCard article={featured} featured />
        </section>
      )}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <FilterBar
          label="دسته‌بندی مقالات"
          value={cat}
          onChange={setCat}
          options={[{ value: "all", label: "همه" }, ...categories.map((c) => ({ value: c, label: c }))]}
        />
        <SearchBar value={q} onChange={setQ} placeholder="جستجو در مقالات..." className="lg:w-72" label="جستجوی مقالات" />
      </div>

      <h2 className="mb-4 text-lg font-bold">{filtering ? "نتایج" : "آخرین مقالات"}</h2>
      {list.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      ) : (
        <EmptyState title="مقاله‌ای یافت نشد" description="عبارت دیگری را جستجو کنید." />
      )}
    </div>
  );
}
