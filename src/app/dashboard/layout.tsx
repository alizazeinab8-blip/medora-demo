import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { default: "پنل کاربری", template: "%s | پنل کاربری — مدورا" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="patient">{children}</DashboardShell>;
}
