import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { default: "پنل پزشک", template: "%s | پنل پزشک — مدورا" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="doctor">{children}</DashboardShell>;
}
