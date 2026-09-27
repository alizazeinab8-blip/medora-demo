import Link from "next/link";
import { ArrowLeft, CalendarCheck, ClipboardList, MessagesSquare, PhoneCall } from "lucide-react";
import type { MedicalService } from "@/types";
import { formatPrice } from "@/lib/format";

const icons = {
  calendar: CalendarCheck,
  chat: MessagesSquare,
  phone: PhoneCall,
  records: ClipboardList,
};

export function ServiceCard({ service }: { service: MedicalService }) {
  const Icon = icons[service.icon];
  return (
    <article className="card group flex h-full flex-col p-6 transition-shadow hover:shadow-lift">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="mt-5 text-base font-bold">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-7 text-navy-500">{service.description}</p>
      {service.price !== undefined && (
        <p className="mt-4 text-xs text-navy-400">
          تعرفه نمایشی: <span className="font-semibold text-navy-700">{formatPrice(service.price)}</span>
        </p>
      )}
      <Link
        href={service.href}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        {service.cta}
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" aria-hidden />
      </Link>
    </article>
  );
}
