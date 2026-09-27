import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetails } from "@/components/course/CourseDetails";
import { api } from "@/lib/api";
import { isLearnable, products } from "@/data/catalog";

export function generateStaticParams() {
  return products.filter(isLearnable).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = api.catalog.bySlug(slug);
  return p ? { title: p.title, description: p.shortDescription } : { title: "یافت نشد" };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = api.catalog.bySlug(slug);
  if (!product || !isLearnable(product)) notFound();
  return <CourseDetails product={product} />;
}
