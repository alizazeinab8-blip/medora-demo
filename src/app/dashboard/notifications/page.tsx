import type { Metadata } from "next";
import { NotificationsView } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "اعلان‌ها" };

export default function Page() {
  return <NotificationsView />;
}
