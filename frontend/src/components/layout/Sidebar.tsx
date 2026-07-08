"use client";

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BedDouble, Users, CreditCard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TransitionLink } from '@/components/ui/TransitionLink';
import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Kamar', href: '/kamar', icon: BedDouble },
  { name: 'Penghuni', href: '/penghuni', icon: Users },
  { name: 'Pembayaran', href: '/pembayaran', icon: CreditCard },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border flex flex-col h-screen fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out w-64",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-border">
        <TransitionLink href="/" className="flex items-center justify-center w-full h-full py-2">
          <Image 
            src="/Logo-Kost.png" 
            alt="Logo Kontrakan Pa Iman" 
            width={200} 
            height={80} 
            priority
            className="object-contain w-full h-full max-h-16"
          />
        </TransitionLink>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(false)}
          className="md:hidden text-muted-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          const Icon = item.icon;
          
          return (
            <TransitionLink
              key={item.name}
              href={item.href}
              onClick={() => {
                // Tutup sidebar di mobile saat menu diklik
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "mr-3 h-5 w-5 transition-transform duration-200",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                )} 
              />
              {item.name}
            </TransitionLink>
          );
        })}
      </nav>
    </aside>
  );
};
