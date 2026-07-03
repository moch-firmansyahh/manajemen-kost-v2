"use client";

export default function HouseLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <style>{`
        .draw-anim {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw 0.8s ease-in-out forwards;
        }
        @keyframes draw {
          0% { stroke-dashoffset: 100; opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
      
      <div className="relative flex items-center justify-center w-32 h-32">
        <svg 
          viewBox="0 0 100 80" 
          className="w-full h-full text-[#567134] dark:text-[#7a9d4b]"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Atap (Roof) */}
          <path 
            d="M 10 70 L 50 25 L 90 70" 
            pathLength="100"
            className="draw-anim"
            style={{ animationDelay: '0s' }}
          />
          
          {/* Cerobong Asap (Chimney) */}
          <path 
            d="M 22 56 L 22 30 L 18 30 L 18 24 L 34 24 L 34 30 L 30 30 L 30 47"
            pathLength="100"
            className="draw-anim"
            style={{ animationDelay: '0.1s' }}
          />

          {/* Kotak Jendela (4-pane window) */}
          <rect 
            x="38" y="45" width="24" height="24" rx="2"
            pathLength="100"
            className="draw-anim"
            style={{ animationDelay: '0.2s' }}
          />
          <path 
            d="M 50 45 L 50 69 M 38 57 L 62 57"
            pathLength="100"
            className="draw-anim"
            style={{ animationDelay: '0.3s' }}
          />
        </svg>
      </div>
    </div>
  );
}
