import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LearningInterface } from "@/components/course/LearningInterface";
import { api } from "@/lib/api";
import { isLearnable, products } from "@/data/catalog";

export function generateStaticParams() {
  return products.filter(isLearnable).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = api.catalog.bySlug(slug);
  return { title: p ? `محیط یادگیری — ${p.title}` : "یافت نشد", robots: { index: false } };
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = api.catalog.bySlug(slug);
  if (!product || !isLearnable(product)) notFound();
  return <LearningInterface product={product} />;
}
