"use client";

import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import HouseLoader from "@/components/ui/HouseLoader";
import { WelcomeScreen } from "@/components/ui/WelcomeScreen";

type TransitionContextType = {
  startTransition: () => void;
  stopTransition: () => void;
};

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function useTransitionContext() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransitionContext must be used within a RouteTransitionProvider");
  }
  return context;
}

export function RouteTransitionProvider({ children }: { children: React.ReactNode }) {
  // Aktifkan secara default agar muncul saat pertama kali aplikasi dimuat (F5)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const fadeOutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pathname = usePathname();

  // Menangani penayangan saat initial mount
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      // Mulai fade out
      setIsVisible(false);
      // Setelah animasi fade out selesai (300ms), benar-benar unmount
      setTimeout(() => {
        setIsTransitioning(false);
        setIsInitialMount(false);
      }, 300);
    }, 1500); // Garansi 1.5 detik F5
    return () => clearTimeout(timeout);
  }, []);

  // Mematikan loading screen HANYA JIKA halaman benar-benar sudah selesai berpindah
  React.useEffect(() => {
    if (!isInitialMount) {
      // Fade out dulu, lalu unmount
      setIsVisible(false);
      if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [pathname]);

  const startTransition = useCallback(() => {
    if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
    setIsTransitioning(true);
    setIsVisible(true);
  }, []);

  const stopTransition = useCallback(() => {
    setIsVisible(false);
    fadeOutTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, []);

  return (
    <TransitionContext.Provider value={{ startTransition, stopTransition }}>
      {isTransitioning && (
        <div
          className="fixed inset-0 z-[100]"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: "opacity 300ms ease-out",
            pointerEvents: isVisible ? "auto" : "none",
          }}
        >
          {isInitialMount && pathname === "/login" ? (
            <WelcomeScreen isVisible={isVisible} />
          ) : (
            <HouseLoader />
          )}
        </div>
      )}
      {children}
    </TransitionContext.Provider>
  );
}
