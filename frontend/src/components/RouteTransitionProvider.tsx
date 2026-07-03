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
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => {
    setIsTransitioning(true);
    // Waktu tunggu disesuaikan dengan durasi animasi yang lebih santai (1.1s total animasi, kita set timeout 1000ms - 1200ms)
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1200);
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
