import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, CITY_HUB, GRADIENTS } from '../constants';
import { JourneyStop, Project as ProjectType } from '../types';
import virginiaBg from '../assets/bg_Virginia.webp';

gsap.registerPlugin(ScrollTrigger);

// ── Cloud assets via Vite glob ────────────────────────────────────────────
const cloudModules = import.meta.glob('../assets/Cloud/*.png', { eager: true });
const CLOUD_IMAGES: string[] = Object.values(cloudModules)
  .map((m: any) => m.default as string)
  .sort();

// ── GPU-acceleration hint ────────────────────────────────────────────────
const GPU: React.CSSProperties = {
  transform: 'translate3d(0,0,0)',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
};

// ── Sky gradients per city ─────────────────────────────────────────────────
const SKY_GRADIENT: Record<string, string> = {
  [JourneyStop.VIRGINIA]: GRADIENTS.virginia,
  [JourneyStop.SEOUL]:    GRADIENTS.seoul,
  [JourneyStop.LA]:       GRADIENTS.la,
};

// ── Cloud tint filter per city ─────────────────────────────────────────────
const CLOUD_FILTER: Record<string, string> = {
  [JourneyStop.VIRGINIA]: 'brightness(1.0)',
  [JourneyStop.SEOUL]:    'hue-rotate(210deg) saturate(1.6) brightness(0.8)',
  [JourneyStop.LA]:       'sepia(60%) hue-rotate(10deg) brightness(1.2) saturate(1.8)',
};

// ── Persistent cloud configs ───────────────────────────────────────────────
const CLOUDS = [
  { id: 1, wVw: 55, top: -28, dur: 50, delay:  0,  opacity: 0.50, imgIdx: 0  },
  { id: 2, wVw: 42, top:  -8, dur: 38, delay: 12,  opacity: 0.40, imgIdx: 4  },
  { id: 3, wVw: 68, top: -18, dur: 65, delay:  0,  opacity: 0.32, imgIdx: 8  },
  { id: 4, wVw: 48, top: -48, dur: 44, delay:  6,  opacity: 0.44, imgIdx: 2  },
  { id: 5, wVw: 38, top: -95, dur: 32, delay: 20,  opacity: 0.36, imgIdx: 6  },
];

// ── Virginia dot positions ─────────────────────────────────────────────────
const VA_DOT_POSITIONS = [
  { id: 'VA-01', x: 25,  y: 35 },
  { id: 'VA-02', x: 55,  y: 20 },
  { id: 'VA-03', x: 80,  y: 55 },
  { id: 'VA-04', x: 120, y: 30 },
];
const VA_PROJECTS = PROJECTS.filter(p => p.id.startsWith('VA'));

// ── HUD data shape ────────────────────────────────────────────────────────
interface HudData {
  city: string;
  coords: string;
  altitude: number;
  progress: number;
  accent: string;
}

// ─────────────────────────────────────────────────────────────────────────────
const ParaglidingJourney: React.FC<{
  onUpdateHud: (data: any) => void;
  onProjectClick: (project: ProjectType) => void;
}> = ({ onUpdateHud, onProjectClick }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const worldRef      = useRef<HTMLDivElement>(null);
  const characterRef  = useRef<HTMLDivElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const skyRef        = useRef<HTMLDivElement>(null);

  // Scroll velocity tracking
  const lastScrollY      = useRef(window.scrollY);
  const scrollVelocity   = useRef(0);

  const cityRef = useRef<string>(JourneyStop.VIRGINIA);
  const [currentCity, setCurrentCity] = useState<string>(JourneyStop.VIRGINIA);
  const [activeDot,   setActiveDot]   = useState<string | null>(null);
  const [loaded,      setLoaded]      = useState(false);

  // HUD state — updated via React state (scrub:1 is slow enough)
  const [hudData, setHudData] = useState<HudData>({
    city: 'Richmond, VA',
    coords: '37.6660° N, 77.4605° W',
    altitude: 120,
    progress: 0,
    accent: '#116d14',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Preload Virginia background
      const img = new Image();
      img.src = virginiaBg;
      img.onload = () => setLoaded(true);

      // ── Main horizontal + vertical scroll timeline ─────────────────────
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=8000',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // City detection
            let stop = JourneyStop.VIRGINIA;
            if (p > 0.66)      stop = JourneyStop.LA;
            else if (p > 0.33) stop = JourneyStop.SEOUL;

            if (stop !== cityRef.current) {
              cityRef.current = stop;
              setCurrentCity(stop);
            }

            const cityData = CITY_HUB[stop];
            const alt = Math.round(cityData.altitude + Math.sin(p * 50) * 20);

            // Update parent HUD
            onUpdateHud({
              city: cityData.name,
              coords: cityData.coords,
              altitude: alt,
              progress: Math.round(p * 100),
            });

            // Update internal HUD panel
            setHudData({
              city: cityData.name,
              coords: cityData.coords,
              altitude: alt,
              progress: Math.round(p * 100),
              accent: cityData.accent,
            });

            // Virginia background parallax
            if (bgRef.current) {
              if (stop === JourneyStop.VIRGINIA) {
                gsap.set(bgRef.current, { xPercent: -p * 20, opacity: 1 - p * 3 });
              } else {
                gsap.set(bgRef.current, { opacity: 0 });
              }
            }

            // Sky gradient transition
            if (skyRef.current) {
              skyRef.current.style.background = SKY_GRADIENT[stop];
            }

            // Scroll velocity for character
            const currentY = window.scrollY;
            scrollVelocity.current = currentY - lastScrollY.current;
            lastScrollY.current = currentY;
          },
        },
      });

      // World pan: right → down → right
      mainTl.to(worldRef.current, { x: '-210vw', ease: 'none' }, 0);
      mainTl.to(worldRef.current, { y: '-100vh', x: '0vw', ease: 'none' }, 0.33);
      mainTl.to(worldRef.current, { y: '-200vh', ease: 'none' }, 0.66);

      // ── Mouse tracking → character ─────────────────────────────────────
      const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const pos   = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
      window.addEventListener('mousemove', onMouseMove);

      const tickerFn = () => {
        const dt = 1.0 - Math.pow(1.0 - 0.08, gsap.ticker.deltaRatio());
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;

        // Combine mouse-based tilt with scroll velocity tilt
        const mouseTilt  = (mouse.x - pos.x) * 0.18;
        const velTilt    = scrollVelocity.current * 0.6;
        const totalTilt  = mouseTilt + velTilt;

        gsap.set(characterRef.current, {
          rotation: totalTilt,
          x: pos.x,
          y: pos.y,
          force3D: true,
        });

        // Decay velocity smoothly
        scrollVelocity.current *= 0.88;
      };
      gsap.ticker.add(tickerFn);

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        gsap.ticker.remove(tickerFn);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const cloudFilter = CLOUD_FILTER[currentCity] ?? 'none';

  return (
    <div
      id="journey"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#07091e' }}
    >

      {/* ── Sky gradient layer — transitions per city ─────────────────── */}
      <div
        ref={skyRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: SKY_GRADIENT[JourneyStop.VIRGINIA],
          transition: 'background 1.4s ease',
          ...GPU,
        }}
      />

      {/* ── Virginia background photo ─────────────────────────────────── */}
      <div
        ref={bgRef}
        className="fixed top-0 left-0 h-screen pointer-events-none"
        style={{
          width: '145vw',
          backgroundImage: `url(${virginiaBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          zIndex: 1,
          ...GPU,
        }}
      />

      {/* ── Cloud layer ───────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{
          zIndex: 4,
          mixBlendMode: 'screen',
          filter: cloudFilter,
          transition: 'filter 1.6s ease',
        }}
      >
        {CLOUDS.map(c => (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              top: `${c.top}%`,
              width: `${c.wVw}vw`,
              opacity: c.opacity,
              animation: `cloud-drift ${c.dur}s linear ${c.delay}s infinite`,
              ...GPU,
            }}
          >
            <img
              src={CLOUD_IMAGES[c.imgIdx % CLOUD_IMAGES.length]}
              alt=""
              style={{ width: '100%', height: 'auto', display: 'block' }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* ── Bottom fade ───────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '22vh',
          zIndex: 5,
          background: 'linear-gradient(to bottom, transparent 0%, #07091e 100%)',
        }}
      />

      {/* ── Loading veil ──────────────────────────────────────────────── */}
      <div className={`absolute inset-0 z-50 bg-[#07091e] transition-opacity duration-1000 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />

      {/* ── World content ─────────────────────────────────────────────── */}
      <div ref={worldRef} className="relative w-full h-full" style={{ zIndex: 10, ...GPU }}>

        {/* Virginia section — 300vw wide, horizontal */}
        <div className="h-screen relative overflow-visible" style={{ width: '300vw' }}>
          {/* Section header */}
          <div className="absolute left-0 top-0 h-full flex items-center" style={{ paddingLeft: '8vw' }}>
            <CityHeader
              tag="WAYPOINT 01"
              city="Virginia"
              sub="Richmond, USA"
              accent="#1a981c"
              coords="37.6660° N, 77.4605° W"
            />
          </div>

          {/* Project dots */}
          {VA_DOT_POSITIONS.map(({ id, x, y }) => {
            const project = VA_PROJECTS.find(p => p.id === id);
            if (!project) return null;
            return (
              <div key={id} className="absolute" style={{ left: `${x}vw`, top: `${y}%` }}>
                <div
                  className="dot-float"
                  onClick={() => setActiveDot(activeDot === id ? null : id)}
                  style={{
                    width: '24px', height: '24px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #ff8080, #FF484B)',
                    border: '2px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 0 16px rgba(255,72,75,0.6)',
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                  }}
                />
                {activeDot === id && (
                  <ProjectPopup project={project} onOpen={() => onProjectClick(project)} />
                )}
              </div>
            );
          })}
        </div>

        {/* Seoul section */}
        <div className="h-screen w-full flex items-center" style={{ paddingLeft: '8vw', paddingRight: '8vw' }}>
          <CitySection
            tag="WAYPOINT 02"
            city="Seoul"
            sub="South Korea"
            accent="#4480ff"
            coords="37.5665° N, 126.978° E"
            projects={PROJECTS.filter(p => p.id.startsWith('KR'))}
            onProjectClick={onProjectClick}
          />
        </div>

        {/* Los Angeles section */}
        <div className="h-screen w-full flex items-center" style={{ paddingLeft: '8vw', paddingRight: '8vw' }}>
          <CitySection
            tag="WAYPOINT 03"
            city="Los Angeles"
            sub="California, USA"
            accent="#fe6600"
            coords="34.0522° N, 118.244° W"
            projects={PROJECTS.filter(p => p.id.startsWith('LA'))}
            onProjectClick={onProjectClick}
          />
        </div>
      </div>

      {/* ── Paraglider character ──────────────────────────────────────── */}
      <div
        ref={characterRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 60,
          width: 'clamp(100px, 14vw, 200px)',
          transform: 'translate(-50%,-50%)',
          ...GPU,
        }}
      >
        <img
          src="/assets/Artboard 9.png"
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* ── Fixed FlightHUD panel ─────────────────────────────────────── */}
      <FlightHUD data={hudData} />

      <style>{`
        .dot-float { animation: dot-float 1.4s ease-in-out infinite; }
        @keyframes dot-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes cloud-drift {
          from { transform: translateX(calc(100vw + 10vw)); }
          to   { transform: translateX(calc(-10vw - 80vw)); }
        }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Fixed Flight HUD panel
// ─────────────────────────────────────────────────────────────────────────────
const FlightHUD: React.FC<{ data: HudData }> = ({ data }) => {
  const bars = Math.round(data.progress / 10); // 0-10

  return (
    <div
      className="fixed"
      style={{
        top: '70px',
        left: '24px',
        zIndex: 55,
        pointerEvents: 'none',
        minWidth: '200px',
      }}
    >
      <div style={{
        background: 'rgba(102, 136, 163, 0.54)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${data.accent}33`,
        borderRadius: '12px',
        padding: '16px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Accent edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '2px',
          background: data.accent,
          opacity: 0.8,
          transition: 'background 0.8s ease',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, ${data.accent}66, transparent)`,
          transition: 'background 0.8s ease',
        }} />

        {/* Header row */}
        <div className="font-mono" style={{
          fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: data.accent, marginBottom: '10px', paddingLeft: '4px',
          transition: 'color 0.6s ease',
        }}>
          ● IN FLIGHT
        </div>

        {/* City */}
        <div className="font-serif" style={{
          fontSize: '1rem', color: '#ffffff', fontWeight: 700,
          marginBottom: '4px', paddingLeft: '4px',
        }}>
          {data.city}
        </div>

        {/* Coords */}
        <div className="font-mono" style={{
          fontSize: '8px', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.61)',
          marginBottom: '14px', paddingLeft: '4px',
        }}>
          {data.coords}
        </div>

        {/* Altitude */}
        <HudRow label="ALT" value={`${data.altitude}m`} accent={data.accent} />
        <HudRow label="PROG" value={`${data.progress}%`} accent={data.accent} />

        {/* Progress bar */}
        <div style={{
          marginTop: '15px', paddingLeft: '4px',
          display: 'flex', gap: '3px',
        }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: 'px',
                background: i < bars ? data.accent : 'rgba(255, 255, 255, 0.16)',
                borderRadius: '2px',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const HudRow: React.FC<{ label: string; value: string; accent: string }> = ({ label, value, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',  marginBottom: '6px', paddingLeft: '4px' }}>
    <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgb(255, 255, 255)', textTransform: 'uppercase' }}>
      {label}
    </span>
    <span className="font-mono" style={{ fontSize: '12px', letterSpacing: '0.1em', color: accent, fontWeight: 700, transition: 'color 0.6s ease' }}>
      {value}
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Section label / city header
// ─────────────────────────────────────────────────────────────────────────────
const CityHeader: React.FC<{
  tag: string; city: string; sub: string; accent: string; coords: string;
}> = ({ tag, city, sub, accent, coords }) => (
  <div style={{ flexShrink: 0 }}>
    <span className="font-mono" style={{
      fontSize: '10px', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', 
      color: accent + 'cc', display: 'block', marginBottom: '12px',
    }}>
      {tag}
    </span>
    <div style={{
      width: '3px', height: '60px',
      background: `linear-gradient(${accent}, transparent)`,
      marginBottom: '12px',
      borderRadius: '2px',
    }} />
    <h4 className="font-serif" style={{
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 700, fontStyle: 'italic',
      color: '#ffffff',
      lineHeight: 1,
      marginBottom: '8px',
    }}>
      {city}
    </h4>
    <p className="font-serif" style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.96)', fontStyle: 'italic' }}>
      {sub}
    </p>
    <p className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255, 255, 255, 0.58)', marginTop: '6px' }}>
      {coords}
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// City showcase section (Seoul / LA)
// ─────────────────────────────────────────────────────────────────────────────
const CitySection: React.FC<{
  tag: string; city: string; sub: string; accent: string; coords: string;
  projects: ProjectType[];
  onProjectClick: (p: ProjectType) => void;
}> = ({ tag, city, sub, accent, coords, projects, onProjectClick }) => (
  <div style={{ display: 'flex', gap: '48px', alignItems: 'center', width: '100%' }}>
    <CityHeader tag={tag} city={city} sub={sub} accent={accent} coords={coords} />

    <div className="scrollbar-hide" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', flex: 1 }}>
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} accent={accent} onClick={() => onProjectClick(p)} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Glassmorphism project card
// ─────────────────────────────────────────────────────────────────────────────
const ProjectCard: React.FC<{
  project: ProjectType; accent: string; onClick: () => void;
}> = ({ project, accent, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onEnter = () => gsap.to(cardRef.current, { scale: 1.04, duration: 0.4, ease: 'power2.out' });
  const onLeave = () => gsap.to(cardRef.current, { scale: 1.00, duration: 0.4, ease: 'power2.out' });

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        flexShrink: 0,
        width: '260px',
        height: '330px',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid rgba(255,255,255,0.08)`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        transformOrigin: 'center',
      }}
    >
      {/* Thumbnail */}
      <img
        src={project.thumbnail}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.45,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Overlay gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)`,
      }} />

      {/* Accent border top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: `linear-gradient(90deg, ${accent}88, transparent)`,
      }} />

      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* Tag chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {project.tags.slice(0, 2).map(t => (
            <span key={t} className="font-mono" style={{
              fontSize: '7px', letterSpacing: '0.2em',
              padding: '3px 8px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '4px',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
            }}>{t}</span>
          ))}
        </div>

        <span className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase', marginBottom: '6px' }}>
          {project.category}
        </span>
        <h5 className="font-serif" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: '8px' }}>
          {project.title}
        </h5>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5, marginBottom: '14px' }}>
          {project.description}
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.2em', color: accent, textTransform: 'uppercase' }}>
            VIEW PROJECT
          </span>
          <div style={{ height: '1px', flex: 1, background: `${accent}44` }} />
          <span style={{ color: accent, fontSize: '12px' }}>→</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Virginia project popup (dot click)
// ─────────────────────────────────────────────────────────────────────────────
const ProjectPopup: React.FC<{ project: ProjectType; onOpen: () => void }> = ({ project, onOpen }) => (
  <div
    className="absolute"
    style={{
      bottom: '44px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '260px',
      zIndex: 20,
      pointerEvents: 'auto',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '14px',
      overflow: 'hidden',
      boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    }}
  >
    <img src={project.thumbnail} style={{ width: '100%', height: '100px', objectFit: 'cover', opacity: 0.7 }} alt="" />
    <div style={{ padding: '14px 16px' }}>
      <h5 className="font-serif" style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
        {project.title}
      </h5>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '12px' }}>
        {project.description}
      </p>
      <button
        onClick={onOpen}
        className="font-mono"
        style={{
          fontSize: '8px', letterSpacing: '0.25em',
          color: '#FF484B', textTransform: 'uppercase',
          background: 'rgba(255,72,75,0.1)',
          border: '1px solid rgba(255,72,75,0.3)',
          borderRadius: '6px',
          padding: '6px 14px',
          cursor: 'pointer',
        }}
      >
        OPEN PROJECT →
      </button>
    </div>
  </div>
);

export default ParaglidingJourney;
