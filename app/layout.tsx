import type { Metadata, Viewport } from "next";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "@fontsource/aref-ruqaa/400.css";
import "@fontsource/aref-ruqaa/700.css";
import "@fontsource/fira-code/500.css";
import "./globals.css";
import { AppProvider, BOOT_SCRIPT } from "@/lib/store";
import { LoaderGate } from "@/components/site/loader-gate";

export const metadata: Metadata = {
  title: "MALAK | مَلَك — Invitations & business cards",
  description: "صمّم بطاقتك بدقائق، عاينها قبل الطباعة، واختر الطباعة أو التسليم الرقمي. Design invitations and business cards in minutes — a MALAK prototype.",
  icons: { icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 60'%3E%3Cpath d='M6 58V26a18 18 0 0 1 36 0v32' fill='none' stroke='%238a6327' stroke-width='3.2'/%3E%3Cpath d='M24 18c.9 11 2 13.6 10 16-8 2.4-9.1 5-10 16-.9-11-2-13.6-10-16 8-2.4 9.1-5 10-16z' fill='%238a6327'/%3E%3C/svg%3E" },
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#eff1f5" }, { media: "(prefers-color-scheme: dark)", color: "#181825" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <AppProvider>
          <LoaderGate />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
