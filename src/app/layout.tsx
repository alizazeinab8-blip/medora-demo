import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.brand.url),
  title: {
    default: `${siteConfig.brand.nameFa} | ${siteConfig.brand.tagline}`,
    template: `%s | ${siteConfig.brand.nameFa}`,
  },
  description: siteConfig.brand.description,
  applicationName: siteConfig.brand.nameFa,
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: siteConfig.brand.nameFa,
  },
  // Demo site — keep it out of search indexes.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#111d33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">
          رفتن به محتوای اصلی
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
