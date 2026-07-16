import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MainLayoutClient } from "@/components/layout/MainLayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kontrakan Pa Iman",
  description: "Aplikasi manajemen kost berbasis web untuk pemilik kost.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kost Pa Iman",
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
