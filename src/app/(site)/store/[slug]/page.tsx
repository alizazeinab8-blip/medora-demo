import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookDetails } from "@/components/course/BookDetails";
import { BookCard } from "@/components/cards/ProductCard";
import { SectionHeading } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { isLearnable, products } from "@/data/catalog";

export function generateStaticParams() {
  return products.filter((p) => !isLearnable(p)).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = api.catalog.bySlug(slug);
  return p ? { title: p.title, description: p.shortDescription } : { title: "یافت نشد" };
}

export default async function StoreItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = api.catalog.bySlug(slug);
  if (!product || isLearnable(product)) notFound();
  const related = api
    .catalog.list()
    .filter((p) => !isLearnable(p) && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <BookDetails product={product} />
      <section className="section bg-surface">
        <div className="container">
          <SectionHeading title="محتوای مرتبط" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <BookCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
