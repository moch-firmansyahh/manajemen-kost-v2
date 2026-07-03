"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HouseLoader from "@/components/ui/HouseLoader";

type TransitionContextType = {
  startTransition: () => void;
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

  // Menangani penayangan saat initial mount
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 1500); // Garansi 1.5 detik
    return () => clearTimeout(timeout);
  }, []);

  const startTransition = () => {
    setIsTransitioning(true);
    // Waktu tunggu disesuaikan agar garansi animasi selesai
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.1 } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="fixed inset-0 z-[100]"
          >
            <HouseLoader />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </TransitionContext.Provider>
  );
}
