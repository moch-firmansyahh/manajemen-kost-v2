import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MainLayoutClient } from "@/components/layout/MainLayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://manajemen-kost-nine.vercel.app"),
  title: {
    default: "Kontrakan Pa Iman - Sistem Manajemen Kost Digital",
    template: "%s | Kontrakan Pa Iman",
  },
  description:
    "Aplikasi sistem manajemen kost digital modern & responsif untuk pemilik kost dalam mengelola unit kamar, data penghuni, dan pembayaran bulanan.",
  keywords: [
    "manajemen kost",
    "kontrakan pa iman",
    "sistem kost",
    "aplikasi kost",
    "kost digital",
  ],
  authors: [{ name: "Moch Firmansyah" }],
  creator: "Moch Firmansyah",
  icons: {
    icon: "/Logo-Kost-Square.png",
    shortcut: "/Logo-Kost-Square.png",
    apple: "/Logo-Kost-Square.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kost Pa Iman",
  },
  openGraph: {
    title: "Kontrakan Pa Iman - Sistem Manajemen Kost Digital",
    description:
      "Aplikasi sistem manajemen kost digital modern & responsif untuk pemilik kost.",
    url: "https://manajemen-kost-nine.vercel.app",
    siteName: "Kontrakan Pa Iman",
    images: [
      {
        url: "/Logo-Kost.png",
        width: 800,
        height: 600,
        alt: "Logo Kontrakan Pa Iman",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#567134",
};

import { RouteTransitionProvider } from "@/components/RouteTransitionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background min-h-screen text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <RouteTransitionProvider>
            <MainLayoutClient>{children}</MainLayoutClient>
          </RouteTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
