
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HUDProps {
  data: {
    city: string;
    coords: string;
    altitude: number;
    progress: number;
  };
  isDetailOpen: boolean;
}

const HUD: React.FC<HUDProps> = ({ data, isDetailOpen }) => {
  const altitudeRef = useRef<HTMLParagraphElement>(null);
  const cityRef = useRef<HTMLHeadingElement>(null);
  const coordsRef = useRef<HTMLParagraphElement>(null);
  const prevData = useRef(data);

  useEffect(() => {
    // Animate altitude bounce on change
    if (prevData.current.altitude !== data.altitude) {
      gsap.fromTo(altitudeRef.current, 
        { scale: 1.1, color: '#fff' }, 
        { scale: 1, color: 'rgba(255,255,255,0.9)', duration: 0.3, ease: 'back.out(2)' }
      );
    }

    // Flicker/Type effect when city changes
    if (prevData.current.city !== data.city) {
      gsap.fromTo([cityRef.current, coordsRef.current],
        { opacity: 0.3, x: -5 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }
      );
    }

    prevData.current = data;
  }, [data]);

  if (isDetailOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col justify-between p-8 md:p-12 overflow-hidden">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        <div className="hud-element border-l-2 border-white/20 pl-4 relative">
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-1">Region Identification</p>
          <h4 ref={cityRef} className="font-serif text-2xl italic text-white transition-colors duration-500">
            {data.city}
          </h4>
          <div className="absolute left-0 top-0 w-[2px] h-full bg-white/40 animate-hud-pulse" />
        </div>
        
        <div className="text-right hud-element border-r-2 border-white/20 pr-4 relative">
          <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-1">GPS Telemetry</p>
          <p ref={coordsRef} className="font-mono text-sm tracking-tighter text-white/90">
            {data.coords}
          </p>
          <div className="absolute right-0 top-0 w-[2px] h-full bg-white/40 animate-hud-pulse" />
        </div>
      </div>

      {/* Middle Grid (Enhanced Subtle) */}
      <div className="absolute inset-0 opacity-[0.05] border-x border-white/10 mx-20 flex justify-around pointer-events-none">
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
      </div>

      {/* Bottom HUD */}
      <div className="flex justify-between items-end">
        <div className="hud-element flex flex-col gap-3 group">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" style={{ animationDuration: '3s' }} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">System: Operational</span>
          </div>
          <div className="border-t border-white/10 pt-3">
            <p ref={altitudeRef} className="font-mono text-sm mb-1">
              <span className="opacity-40 text-[10px] mr-2">ALT:</span> 
              <span className="font-bold">{Math.round(data.altitude)}</span>m
            </p>
            <p className="font-mono text-sm">
              <span className="opacity-40 text-[10px] mr-2">SPD:</span> 
              <span className="font-bold">24.5</span> kts
            </p>
          </div>
        </div>

        <div className="hud-element flex flex-col items-end gap-3">
          <div className="relative w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-700 ease-out"
              style={{ width: `${data.progress}%` }}
            />
            {/* Moving highlights on progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 animate-shimmer" />
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
              Flight Path Progress: <span className="text-white font-bold">{data.progress}%</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .hud-element {
          backdrop-filter: blur(8px);
          padding: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        @keyframes hud-pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .animate-hud-pulse {
          animation: hud-pulse 4s infinite ease-in-out;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default HUD;
