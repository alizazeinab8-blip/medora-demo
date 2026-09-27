import type { Metadata } from "next";
import { UserOverview } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "داشبورد" };

export default function Page() {
  return <UserOverview />;
}
