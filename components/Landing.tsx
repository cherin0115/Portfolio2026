import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

import cloud1 from '../assets/Cloud/Realistic Clouds Overlay 1.png';
import cloud2 from '../assets/Cloud/Realistic Clouds Overlay 2.png';
import cloud3 from '../assets/Cloud/Realistic Clouds Overlay 3.png';
import cloud4 from '../assets/Cloud/Realistic Clouds Overlay 4.png';

const CLOUD_ASSETS = [cloud1, cloud2, cloud3, cloud4];

// Fixed positions so layout is stable on every render
const BG_CLOUDS = [
  { w: 620, top: 12, left: -40, opacity: 0.22, asset: 0, dur: 52, delay: 0   },
  { w: 480, top: 55, left: -40, opacity: 0.18, asset: 2, dur: 68, delay: -18 },
  { w: 750, top: 28, left: -40, opacity: 0.14, asset: 1, dur: 44, delay: -8  },
  { w: 390, top: 70, left: -40, opacity: 0.20, asset: 3, dur: 60, delay: -30 },
  { w: 560, top: 5,  left: -40, opacity: 0.12, asset: 2, dur: 76, delay: -44 },
  { w: 430, top: 42, left: -40, opacity: 0.16, asset: 0, dur: 40, delay: -22 },
];

const FG_CLOUDS = [
  { w: 820, top: 60, left: -50, opacity: 0.28, asset: 1, dur: 30, delay: 0   },
  { w: 680, top: 15, left: -50, opacity: 0.24, asset: 3, dur: 22, delay: -10 },
  { w: 720, top: 38, left: -50, opacity: 0.22, asset: 0, dur: 36, delay: -20 },
  { w: 600, top: 78, left: -50, opacity: 0.20, asset: 2, dur: 28, delay: -14 },
];

const GPU: React.CSSProperties = {
  transform: 'translate3d(0,0,0)',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
};

const Landing: React.FC = () => {
  const heroRef      = useRef<HTMLDivElement>(null);
  const bgCloudsRef  = useRef<HTMLDivElement>(null);
  const fgCloudsRef  = useRef<HTMLDivElement>(null);
  const scanlineRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text — gentle altitude drift
      gsap.to(heroRef.current, {
        y: 18,
        x: 6,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Background clouds — slow & atmospheric
      const bgKids = bgCloudsRef.current?.children;
      if (bgKids) {
        Array.from(bgKids).forEach((el, i) => {
          const cfg = BG_CLOUDS[i];
          gsap.fromTo(
            el,
            { x: '-40vw' },
            { x: '130vw', duration: cfg.dur, repeat: -1, ease: 'none', delay: cfg.delay }
          );
          gsap.to(el, { y: '+=28', duration: 4 + i * 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
      }

      // Foreground clouds — faster, bigger
      const fgKids = fgCloudsRef.current?.children;
      if (fgKids) {
        Array.from(fgKids).forEach((el, i) => {
          const cfg = FG_CLOUDS[i];
          gsap.fromTo(
            el,
            { x: '-50vw' },
            { x: '150vw', duration: cfg.dur, repeat: -1, ease: 'none', delay: cfg.delay }
          );
          gsap.to(el, { y: '-=42', duration: 3.5 + i, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        });
      }

      // HUD scanline pulse
      gsap.to(scanlineRef.current, {
        opacity: 0.06,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="landing"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #07091e 0%, #0c0c2c 40%, #111428 100%)' }}
    >
      {/* Star-field — pure CSS dots via box-shadow trick */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 8%,  rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 42% 55%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 88% 33%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 5%  72%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 60% 80%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 30% 90%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 92% 65%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 50% 12%, rgba(255,255,255,0.4) 0%, transparent 100%),
            radial-gradient(1px 1px at 22% 45%, rgba(255,255,255,0.7) 0%, transparent 100%),
            radial-gradient(2px 2px at 68% 22%, rgba(255,255,255,0.3) 0%, transparent 100%),
            radial-gradient(1px 1px at 80% 78%, rgba(255,255,255,0.5) 0%, transparent 100%)
          `,
        }} />
      </div>

      {/* Background clouds — screen blended, ethereal on dark sky */}
      <div
        ref={bgCloudsRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 2, mixBlendMode: 'screen' }}
      >
        {BG_CLOUDS.map((c, i) => (
          <img
            key={`bg-${i}`}
            src={CLOUD_ASSETS[c.asset]}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              width: `${c.w}px`,
              top: `${c.top}%`,
              left: `${c.left}vw`,
              opacity: c.opacity,
              filter: 'blur(3px) brightness(1.4)',
              ...GPU,
            }}
          />
        ))}
      </div>



      {/* ── HERO TEXT ──────────────────────────────────────────────────── */}
      <div className="z-10 text-center px-6" style={{ position: 'relative' }}>
        <div ref={heroRef} style={{ display: 'inline-block', position: 'relative' }}>

          {/* Eyebrow */}
          <div className="font-mono" style={{
            fontSize: '15px',
            letterSpacing: '0.6em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
          }}>
            <span style={{ width: '40px', height: '1px', background: 'rgba(255, 255, 255, 0.82)' }} />
            DESIGN JOURNEY PROTOCOL
            <span style={{ width: '40px', height: '1px', background: 'rgba(255, 255, 255, 0.82)' }} />
          </div>

          {/* Main name */}
          <h1
            className="colence-font"
            style={{
              marginTop: 40,
              fontSize: 'clamp(5rem, 14vw, 11rem)',
              color: '#ffffff',
              fontWeight: 300,
              lineHeight: 1.4,
              letterSpacing: '-0.02em',
            }}
          >
            Hi, I'm <br />
            <span style={{ fontWeight: 700, color: '#ffffff' }}>Cherin</span>
          </h1>

          {/* HUD data strip below name */}
          <div style={{
            marginTop: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
          }}>
            <HudChip label="DEPART" value="RICHMOND, VA" />
            <span style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />
            <HudChip label="ROUTE" value="VA → KR → CA" />
            <span style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)' }} />
            <HudChip label="STATUS" value="PRE-FLIGHT" accent="#58aa5a" />
          </div>
        </div>
      </div>

      {/* Foreground clouds — in front of text */}
      <div
        ref={fgCloudsRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 30, mixBlendMode: 'screen' }}
      >
        {FG_CLOUDS.map((c, i) => (
          <img
            key={`fg-${i}`}
            src={CLOUD_ASSETS[c.asset]}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              width: `${c.w}px`,
              top: `${c.top}%`,
              left: `${c.left}vw`,
              opacity: c.opacity,
              filter: 'brightness(1.3)',
              ...GPU,
            }}
          />
        ))}
      </div>

      {/* HUD scanline overlay */}
      <div
        ref={scanlineRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 35,
          opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* Scroll indicator — HUD style */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" style={{ zIndex: 40 }}>
        <span className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.5em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
          INITIATE DESCENT
        </span>
        <div style={{ width: '1px', height: '56px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '40%',
            background: 'rgba(255,255,255,0.5)',
            animation: 'scroll-hint 2.5s infinite ease-in-out',
          }} />
        </div>
      </div>

      {/* Bottom fade into Introduction */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '30vh',
          zIndex: 50,
          background: 'linear-gradient(to bottom, transparent 0%, #07091e 100%)',
        }}
      />

      <style>{`
        @font-face {
          font-family: 'Colence';
          src: url('/assets/font/Colence-Regular.ttf') format('truetype');
        }
        .colence-font { font-family: 'Colence', serif; }
        @keyframes scroll-hint {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(260%); }
        }
      `}</style>
    </section>
  );
};

// Small HUD readout chip
const HudChip: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent }) => (
  <div style={{ textAlign: 'center' }}>
    <div className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: '4px' }}>
      {label}
    </div>
    <div className="font-mono" style={{ fontSize: '15px', letterSpacing: '0.15em', color: accent ?? 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>
      {value}
    </div>
  </div>
);

export default Landing;
