import type { Metadata } from "next";
import { ProfileView } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "اطلاعات حساب" };

export default function Page() {
  return <ProfileView />;
}
