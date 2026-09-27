import Link from "next/link";
import { CalendarCheck, MessagesSquare, PhoneCall } from "lucide-react";
import type { Doctor } from "@/types";
import { Avatar, Rating } from "@/components/ui/primitives";
import { serviceLabels } from "@/data/services";

const serviceIcons = { "in-person": CalendarCheck, phone: PhoneCall, online: MessagesSquare };

/** Doctor card — ready for a multi-doctor directory. */
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex items-center gap-3">
        <Avatar initials={doctor.initials} size="lg" />
        <div className="min-w-0">
          <h3 className="truncate font-bold">{doctor.name}</h3>
          <p className="mt-0.5 truncate text-xs text-navy-500">{doctor.specialty}</p>
          <Rating value={doctor.rating} reviews={doctor.reviews} className="mt-1.5" />
        </div>
      </div>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {doctor.services.map((s) => {
          const Icon = serviceIcons[s];
          return (
            <li key={s} className="chip bg-navy-50 text-navy-600">
              <Icon className="h-3.5 w-3.5" aria-hidden />
              {serviceLabels[s]}
            </li>
          );
        })}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-navy-100 pt-4 text-xs">
        <span className="text-navy-500">
          اولین نوبت: <span className="font-semibold text-teal-700">{doctor.nextAvailable}</span>
        </span>
        <Link href={`/appointment?doctor=${doctor.id}`} className="btn-outline btn-sm">
          رزرو
        </Link>
      </div>
    </article>
  );
}
