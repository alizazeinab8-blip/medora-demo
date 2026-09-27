import type { Metadata } from "next";
import { MyRecord } from "@/components/dashboard/UserViews";

export const metadata: Metadata = { title: "پرونده سلامت" };

export default function Page() {
  return <MyRecord />;
}
