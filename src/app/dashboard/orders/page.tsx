import type { Metadata } from "next";
import { MyOrders } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "سفارش‌ها" };

export default function Page() {
  return <MyOrders />;
}
