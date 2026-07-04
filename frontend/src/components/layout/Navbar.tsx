"use client";

import { Menu, Bell, Sun, Moon, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePembayaran } from '@/hooks/usePembayaran';
import { usePenghuni } from '@/hooks/usePenghuni';
import { API_BASE_URL } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [adminName, setAdminName] = useState<string>("Admin Kost");
  const { dataPembayaran } = usePembayaran();
  const { dataPenghuni } = usePenghuni();

  const latePembayaran = dataPembayaran.filter(p => {
    if (p.status !== 'terlambat') return false;
    const penghuni = dataPenghuni.find(pen => pen.id === p.penghuniId);
    return !!penghuni; // Selama penghuninya valid, tampilkan notifikasi (meskipun sudah keluar)
  });

  useEffect(() => {
    setMounted(true);

    const loadProfile = async () => {
      const cached = localStorage.getItem("adminName");
      if (cached) setAdminName(cached);

      try {
        const res = await fetch(`${API_BASE_URL}/api/profile`);
        if (res.ok) {
          const data = await res.json();
          setAdminName(data.nama);
          localStorage.setItem("adminName", data.nama);
        }
      } catch (err) {
        console.error("Gagal sinkronisasi nama di Navbar:", err);
      }
    };

    loadProfile();

    const handleStorageChange = () => {
      const updated = localStorage.getItem("adminName");
      if (updated) setAdminName(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5 text-muted-foreground" />
        </Button>
        
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {mounted && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground outline-none ring-0 focus-visible:ring-0">
              <Bell className="h-5 w-5" />
              {latePembayaran.length > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-white border-2 border-background shadow-sm">
                  {latePembayaran.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi Tagihan</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {latePembayaran.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Tidak ada tagihan tertunggak 🎉
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {latePembayaran.map(p => {
                  const penghuni = dataPenghuni.find(pen => pen.id === p.penghuniId);
                  return (
                    <DropdownMenuItem 
                      key={p.id} 
                      className="flex flex-col items-start gap-1 p-3 cursor-default"
                    >
                      <div className="flex justify-between w-full items-center">
                        <span className="font-medium text-foreground">{penghuni?.nama || 'Unknown'}</span>
                        <span className="text-[10px] uppercase font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                          {p.status}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Tagihan {p.bulan} {p.tahun} - <span className="font-medium text-destructive">Rp {p.jumlah.toLocaleString('id-ID')}</span>
                      </span>
                    </DropdownMenuItem>
                  )
                })}
              </div>
            )}
            
            {latePembayaran.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full justify-center text-xs cursor-pointer text-muted-foreground" asChild>
                  <Link href="/pembayaran">
                    Lihat Semua Tagihan
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Link href="/profile">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#567134] to-[#7c9e50] flex items-center justify-center text-white font-medium text-sm shadow-sm ring-2 ring-background cursor-pointer hover:shadow-md transition-all hover:scale-105">
            {adminName ? adminName.trim().charAt(0).toUpperCase() : "A"}
          </div>
        </Link>
      </div>
    </header>
  );
};
