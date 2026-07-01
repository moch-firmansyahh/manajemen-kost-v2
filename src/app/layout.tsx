import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MainLayoutClient } from "@/components/layout/MainLayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kontrakan Pa Iman",
  description: "Aplikasi manajemen kost berbasis web untuk pemilik kost.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-background min-h-screen text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayoutClient>{children}</MainLayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
