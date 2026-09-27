import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PatientProfile } from "@/components/patients/PatientProfile";
import { api } from "@/lib/api";
import { patients } from "@/data/patients";

export function generateStaticParams() {
  return patients.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: `پرونده ${id}` };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = api.patients.byId(id);
  if (!patient) notFound();
  return (
    <div>
      <Link href="/doctor/patients" className="btn-ghost btn-sm mb-4">
        <ArrowRight className="h-4 w-4" aria-hidden />
        بازگشت به فهرست بیماران
      </Link>
      <PatientProfile patient={patient} viewer="doctor" />
    </div>
  );
}
