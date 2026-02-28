import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface IntroSceneProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  'INITIALIZING FLIGHT SYSTEMS...',
  'LOADING TERRAIN DATA...',
  'CALIBRATING HUD OVERLAY...',
  'SYNCING GPS COORDINATES...',
  'PARAGLIDER SYSTEMS NOMINAL',
  'DESTINATION LOCKED: RICHMOND, VA',
];

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
const FINAL_TITLE    = 'CHERIN';

const IntroScene: React.FC<IntroSceneProps> = ({ onComplete }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLDivElement>(null);
  const barFillRef    = useRef<HTMLDivElement>(null);
  const flashRef      = useRef<HTMLDivElement>(null);
  const statusRef     = useRef<HTMLDivElement>(null);

  const [progress,  setProgress]  = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);

  useEffect(() => {
    // ── 1. Title scramble — resolves letter-by-letter ────────────────
    let iteration = 0;
    const scramble = setInterval(() => {
      if (!titleRef.current) return;
      titleRef.current.textContent = FINAL_TITLE
        .split('')
        .map((_char, i) => {
          if (i < Math.floor(iteration)) return FINAL_TITLE[i];
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        })
        .join('');
      iteration += 0.25;
      if (iteration >= FINAL_TITLE.length + 3) clearInterval(scramble);
    }, 45);

    // ── 2. Boot lines — one every 300ms ──────────────────────────────
    let lineIdx = 0;
    const lineTimer = setInterval(() => {
      if (lineIdx < BOOT_LINES.length) {
        setBootLines(prev => [...prev, BOOT_LINES[lineIdx]]);
        lineIdx++;
      } else {
        clearInterval(lineTimer);
      }
    }, 300);

    // ── 3. Progress bar + counter ─────────────────────────────────────
    const counter = { val: 0 };
    gsap.to(counter, {
      val: 100,
      duration: 2.4,
      ease: 'power2.inOut',
      delay: 0.2,
      onUpdate: () => {
        const v = Math.round(counter.val);
        setProgress(v);
        if (barFillRef.current) barFillRef.current.style.width = `${counter.val}%`;
      },
      onComplete: () => {
        // 4. Status flash → "FLIGHT READY"
        if (statusRef.current) {
          gsap.to(statusRef.current, {
            opacity: 1, duration: 0.15,
            onComplete: () => {
              // 5. Blast-through after short hold
              gsap.delayedCall(0.35, () => {
                // Cream flash
                if (flashRef.current) {
                  gsap.to(flashRef.current, {
                    opacity: 1, duration: 0.12,
                    onComplete: () => gsap.to(flashRef.current, { opacity: 0, duration: 0.4 }),
                  });
                }
                // Container punches through
                gsap.to(containerRef.current, {
                  scale: 14,
                  opacity: 0,
                  duration: 1.0,
                  ease: 'power4.in',
                  delay: 0.08,
                  onComplete: onComplete,
                });
              });
            },
          });
        }
      },
    });

    return () => {
      clearInterval(scramble);
      clearInterval(lineTimer);
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9400,
        background: '#5A7BAE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Cream flash layer */}
      <div ref={flashRef} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(249,241,231,0.92)',
        opacity: 0, pointerEvents: 'none', zIndex: 20,
      }} />

      {/* Precision grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(249,241,231,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(249,241,231,0.05) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
        pointerEvents: 'none',
      }} />

      {/* HUD corner brackets */}
      <HudCorner pos="top-left"     />
      <HudCorner pos="top-right"    />
      <HudCorner pos="bottom-left"  />
      <HudCorner pos="bottom-right" />

      {/* Top status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 28px',
        borderBottom: '1px solid rgba(249,241,231,0.12)',
      }}>
        <span className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.35em', color: 'rgba(249,241,231,0.5)' }}>
          CHERIN DESIGN SYSTEMS
        </span>
        <span className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.25em', color: 'rgba(244,215,147,0.85)' }}>
          ● PRE-FLIGHT CHECK
        </span>
      </div>

      {/* Central content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', width: '100%', maxWidth: '480px', padding: '0 24px' }}>

        {/* Paraglider icon */}
        <svg width="52" height="52" viewBox="0 0 28 28" fill="none" style={{ marginBottom: '28px', opacity: 0.7 }}>
          <circle cx="14" cy="14" r="13" stroke="rgba(249,241,231,0.3)" strokeWidth="1" />
          <path d="M5 17 L14 8 L23 17" stroke="#F9F1E7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="14" cy="18.5" r="2" fill="rgba(249,241,231,0.6)" />
        </svg>

        {/* Scrambling title */}
        <div
          ref={titleRef}
          className="colence-font"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 6rem)',
            color: '#F9F1E7',
            fontWeight: 700,
            letterSpacing: '0.15em',
            fontVariantNumeric: 'tabular-nums',
            marginBottom: '10px',
            fontFamily: 'monospace', // fallback while scrambling
          }}
        >
          {FINAL_TITLE}
        </div>

        {/* Subtitle */}
        <div className="font-mono" style={{
          fontSize: '8px', letterSpacing: '0.55em',
          color: 'rgba(249,241,231,0.45)',
          textTransform: 'uppercase', marginBottom: '44px',
        }}>
          PORTFOLIO · FLIGHT 2025
        </div>

        {/* Boot sequence lines */}
        <div style={{ width: '100%', minHeight: '130px', marginBottom: '28px' }}>
          {bootLines.map((line, i) => (
            <BootLine
              key={i}
              text={line}
              active={i === bootLines.length - 1}
              done={i < bootLines.length - 1}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="font-mono" style={{ fontSize: '7px', letterSpacing: '0.3em', color: 'rgba(249,241,231,0.45)', textTransform: 'uppercase' }}>
              LOADING SEQUENCE
            </span>
            <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.1em', color: 'rgba(244,215,147,0.9)', fontWeight: 700 }}>
              {progress}%
            </span>
          </div>
          <div style={{ height: '2px', background: 'rgba(249,241,231,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              ref={barFillRef}
              style={{
                height: '100%', width: '0%',
                background: 'linear-gradient(90deg, #E8B4B8 0%, #F4D793 100%)',
                borderRadius: '2px',
                boxShadow: '0 0 10px rgba(232,180,184,0.6)',
                transition: 'none',
              }}
            />
          </div>
        </div>

        {/* FLIGHT READY status — fades in on 100% */}
        <div
          ref={statusRef}
          style={{
            marginTop: '24px',
            opacity: 0,
            display: 'flex', alignItems: 'center', gap: '10px',
          }}
        >
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#F4D793',
            boxShadow: '0 0 12px rgba(244,215,147,0.7)',
            animation: 'hud-blink 0.6s ease-in-out 3',
          }} />
          <span className="font-mono" style={{
            fontSize: '11px', letterSpacing: '0.4em',
            color: 'rgba(244,215,147,0.9)',
            textTransform: 'uppercase', fontWeight: 700,
          }}>
            FLIGHT READY
          </span>
        </div>
      </div>

      {/* Bottom coords bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 28px',
        borderTop: '1px solid rgba(249,241,231,0.12)',
      }}>
        <span className="font-mono" style={{ fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(249,241,231,0.4)' }}>
          37.6660° N / 77.4605° W
        </span>
        <span className="font-mono" style={{ fontSize: '7px', letterSpacing: '0.2em', color: 'rgba(249,241,231,0.4)' }}>
          ALT 120m · VA-01 ACTIVE
        </span>
      </div>

      <style>{`
        @font-face {
          font-family: 'Colence';
          src: url('/assets/font/Colence-Regular.ttf') format('truetype');
        }
        .colence-font { font-family: 'Colence', serif; }
        @keyframes hud-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
};

// ── Single boot line ──────────────────────────────────────────────────────
const BootLine: React.FC<{ text: string; active: boolean; done: boolean }> = ({ text, active, done }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, []);

  return (
    <div ref={ref} style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      marginBottom: '7px',
    }}>
      <span style={{
        fontSize: '8px', lineHeight: 1,
        color: done ? 'rgba(232,180,184,0.6)' : active ? 'rgba(244,215,147,0.9)' : 'rgba(249,241,231,0.35)',
        transition: 'color 0.3s',
      }}>
        {done ? '✓' : '›'}
      </span>
      <span className="font-mono" style={{
        fontSize: '8px', letterSpacing: '0.2em',
        color: done ? 'rgba(249,241,231,0.3)' : active ? 'rgba(249,241,231,0.75)' : 'rgba(249,241,231,0.45)',
        textTransform: 'uppercase',
        transition: 'color 0.3s',
      }}>
        {text}
      </span>
    </div>
  );
};

// ── HUD corner bracket ────────────────────────────────────────────────────
const HudCorner: React.FC<{ pos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({ pos }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: '32px', height: '32px',
    pointerEvents: 'none', zIndex: 5,
  };
  const top    = pos.includes('top')    ? '20px' : undefined;
  const bottom = pos.includes('bottom') ? '20px' : undefined;
  const left   = pos.includes('left')   ? '20px' : undefined;
  const right  = pos.includes('right')  ? '20px' : undefined;
  const scaleX = pos.includes('right')  ? -1 : 1;
  const scaleY = pos.includes('bottom') ? -1 : 1;

  return (
    <div style={{ ...style, top, bottom, left, right, transform: `scale(${scaleX}, ${scaleY})` }}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M0 32 L0 0 L32 0" stroke="rgba(249,241,231,0.3)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};

export default IntroScene;
