import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface HudData {
  city: string;
  coords: string;
  altitude: number;
  progress: number;
  accent: string;
}

interface AdaptiveHUDProps {
  data: HudData;
  booted: boolean;   // triggers the boot-up animation once when it flips true
}

const AdaptiveHUD: React.FC<AdaptiveHUDProps> = ({ data, booted }) => {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const row1Ref    = useRef<HTMLDivElement>(null);  // IN FLIGHT label
  const row2Ref    = useRef<HTMLDivElement>(null);  // city name
  const row3Ref    = useRef<HTMLDivElement>(null);  // coords
  const row4Ref    = useRef<HTMLDivElement>(null);  // ALT row
  const row5Ref    = useRef<HTMLDivElement>(null);  // PROG row
  const barRef     = useRef<HTMLDivElement>(null);  // progress bar

  const hasBoot    = useRef(false);

  // Boot-up sequence — runs once when booted flips true
  useEffect(() => {
    if (!booted || hasBoot.current) return;
    hasBoot.current = true;

    const targets = [wrapRef, row1Ref, row2Ref, row3Ref, row4Ref, row5Ref, barRef].map(r => r.current);

    // Start all invisible
    gsap.set(targets, { opacity: 0, x: -8 });

    // Stagger reveal
    gsap.to(wrapRef.current, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 });
    gsap.to(row1Ref.current, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.45 });
    gsap.to(row2Ref.current, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.6  });
    gsap.to(row3Ref.current, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.72 });
    gsap.to(row4Ref.current, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.84 });
    gsap.to(row5Ref.current, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 0.96 });
    gsap.to(barRef.current,  { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', delay: 1.1  });
  }, [booted]);

  const bars = Math.round(data.progress / 10); // 0–10 segments

  return (
    <div
      className="fixed"
      style={{
        top: '84px',
        left: '20px',
        zIndex: 55,
        pointerEvents: 'none',
        minWidth: '210px',
      }}
    >
      <div
        ref={wrapRef}
        style={{
          position: 'relative',
          background: 'rgba(7, 9, 30, 0.55)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          border: `1px solid ${data.accent}30`,
          borderRadius: '12px',
          padding: '16px 18px',
          overflow: 'hidden',
          opacity: 0,  // GSAP controls
        }}
      >
        {/* Accent left-edge bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px',
          background: data.accent,
          opacity: 0.85,
          transition: 'background 0.8s ease',
          boxShadow: `0 0 8px ${data.accent}88`,
        }} />

        {/* Top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, ${data.accent}77, transparent 70%)`,
          transition: 'background 0.8s ease',
        }} />

        {/* Scanline sweep */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)',
          pointerEvents: 'none',
          borderRadius: 'inherit',
        }} />
        <div style={{
          position: 'absolute', left: 0, right: 0,
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.025) 50%, transparent)',
          animation: 'hud-scan 3s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* ── Status label ───────────────────────────────────── */}
        <div ref={row1Ref} style={{ marginBottom: '10px', paddingLeft: '6px', opacity: 0 }}>
          <span className="font-mono" style={{
            fontSize: '7px', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: data.accent,
            transition: 'color 0.6s ease',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: data.accent,
              boxShadow: `0 0 6px ${data.accent}`,
              display: 'inline-block',
              animation: 'hud-dot-blink 2.5s ease-in-out infinite',
            }} />
            IN FLIGHT
          </span>
        </div>

        {/* ── City ───────────────────────────────────────────── */}
        <div ref={row2Ref} style={{ paddingLeft: '6px', marginBottom: '4px', opacity: 0 }}>
          <span className="font-serif" style={{
            fontSize: '1.05rem', color: '#ffffff', fontWeight: 700,
          }}>
            {data.city}
          </span>
        </div>

        {/* ── Coords ─────────────────────────────────────────── */}
        <div ref={row3Ref} style={{ paddingLeft: '6px', marginBottom: '14px', opacity: 0 }}>
          <span className="font-mono" style={{
            fontSize: '7.5px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.38)',
          }}>
            {data.coords}
          </span>
        </div>

        {/* ── ALT ────────────────────────────────────────────── */}
        <div ref={row4Ref} style={{ opacity: 0 }}>
          <HudMetric label="ALT" value={`${data.altitude}m`} accent={data.accent} />
        </div>

        {/* ── PROG ───────────────────────────────────────────── */}
        <div ref={row5Ref} style={{ opacity: 0 }}>
          <HudMetric label="PROG" value={`${data.progress}%`} accent={data.accent} />
        </div>

        {/* ── Progress segments ──────────────────────────────── */}
        <div ref={barRef} style={{ marginTop: '12px', paddingLeft: '6px', display: 'flex', gap: '3px', opacity: 0 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: '3px',
                background: i < bars ? data.accent : 'rgba(255,255,255,0.1)',
                borderRadius: '2px',
                transition: 'background 0.25s ease',
                boxShadow: i < bars ? `0 0 4px ${data.accent}88` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes hud-scan {
          from { top: -30%; }
          to   { top: 130%; }
        }
        @keyframes hud-dot-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

// Single metric row
const HudMetric: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '4px 6px', marginBottom: '2px',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.025)',
  }}>
    <span className="font-mono" style={{
      fontSize: '7px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
    }}>
      {label}
    </span>
    <span className="font-mono" style={{
      fontSize: '11px', letterSpacing: '0.1em', fontWeight: 700,
      color: accent, transition: 'color 0.6s ease',
    }}>
      {value}
    </span>
  </div>
);

export default AdaptiveHUD;
