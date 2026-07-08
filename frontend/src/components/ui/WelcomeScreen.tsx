"use client";

import React from "react";
import Image from "next/image";

interface WelcomeScreenProps {
  isVisible: boolean;
}

export function WelcomeScreen({ isVisible: _isVisible }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300 select-none">
      
      {/* Kontainer Utama Logo (Fade-in + Zoom halus) */}
      <div className="flex flex-col items-center justify-center logo-fade-in relative z-10">
        
        {/* Shimmer container wrapper */}
        <div className="relative w-80 h-64 shimmer-container filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          
          {/* Lapisan efek kilau cahaya miring */}
          <div className="shimmer-overlay" />
          
          <Image
            src="/Logo-Kost.png"
            alt="Logo Kontrakan Pa Iman"
            fill
            priority
            loading="eager"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
