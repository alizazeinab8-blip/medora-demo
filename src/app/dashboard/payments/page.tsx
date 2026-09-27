import type { Metadata } from "next";
import { MyPayments } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "پرداخت‌ها" };

export default function Page() {
  return <MyPayments />;
}
