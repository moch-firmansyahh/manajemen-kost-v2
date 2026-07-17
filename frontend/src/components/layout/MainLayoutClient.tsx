"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import { autoGenerateTagihan } from "@/hooks/usePembayaran";

export const MainLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Jalankan sistem auto-billing (Generate tagihan otomatis) HANYA SEKALI SAAT APP DIMUAT
    autoGenerateTagihan();
  }, []);

  useEffect(() => {
    // Periksa status login
    const isLoginPage = pathname === "/login";
    const isAuth = sessionStorage.getItem("isAuth") || localStorage.getItem("isAuth");

    if (!isAuth && !isLoginPage) {
      router.push("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [pathname, router]);

  if (isCheckingAuth) {
    return <main className="min-h-screen bg-background flex items-center justify-center" />;
  }

  // Jika di halaman login, jangan tampilkan sidebar & navbar
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="min-h-screen flex items-center justify-center bg-muted/30">{children}</main>;
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Overlay untuk mobile saat sidebar terbuka */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 min-h-screen transition-[margin] duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-64" : "md:ml-0"
        )}
      >
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 w-full max-w-full p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
