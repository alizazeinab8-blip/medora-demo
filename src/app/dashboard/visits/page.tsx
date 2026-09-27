import type { Metadata } from "next";
import { VisitHistory } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "سوابق ویزیت" };

export default function Page() {
  return <VisitHistory />;
}
