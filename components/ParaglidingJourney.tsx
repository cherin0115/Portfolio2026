
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, CITY_HUB } from '../constants';
import { JourneyStop, Project as ProjectType } from '../types';
import virginiaBg from '../assets/bg Virginia.png';

gsap.registerPlugin(ScrollTrigger);

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  vaSky:    '#a0d4f2',
  vaMid:    '#7bb8d8',
  twilight: '#241760',
  night:    '#07091e',
  laWarm:   '#8a3040',
  laSky:    '#ff6020',
  laSunset: '#ff3c38',
} as const;

// ─── Image preloader ──────────────────────────────────────────────────────────
const preloadImage = (src: string): Promise<void> =>
  new Promise(resolve => {
    const img = new window.Image();
    img.onload  = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });

interface ParaglidingJourneyProps {
  onUpdateHud: (data: any) => void;
  onProjectClick: (project: ProjectType) => void;
}

const VA_PROJECTS = PROJECTS.filter(p => p.id.startsWith('VA'));

const VA_DOT_POSITIONS = [
  { id: 'VA-01', x: 25,  y: 10  },
  { id: 'VA-02', x: 55,  y: -4  },
  { id: 'VA-03', x: 79,  y: 40  },
  { id: 'VA-04', x: 110, y: -10 },
];

const ParaglidingJourney: React.FC<ParaglidingJourneyProps> = ({ onUpdateHud, onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef     = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  const [activeDot,  setActiveDot]  = useState<string | null>(null);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let ctx: gsap.Context | null = null;
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let tickerFn: (() => void) | null = null;

    const init = async () => {
      await preloadImage(virginiaBg);
      if (!mounted) return;

      ctx = gsap.context(() => {

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger:       containerRef.current,
            start:         'top top',
            end:           '+=8000',
            scrub:         0.5,
            pin:           true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const p = self.progress;
              let currentStop = JourneyStop.VIRGINIA;
              if (p > 0.66)      currentStop = JourneyStop.LA;
              else if (p > 0.33) currentStop = JourneyStop.SEOUL;

              const cityData = CITY_HUB[currentStop];
              onUpdateHud({
                city:     cityData.name,
                coords:   cityData.coords,
                altitude: cityData.altitude + Math.sin(p * 50) * 20,
                progress: Math.round(p * 100),
              });
            },
          },
        });

        // ── Step 1: Virginia horizontal ──────────────────────────────────────
        tl.to(worldRef.current, {
          x: '-100vw', ease: 'none', force3D: true, immediateRender: false,
        });

        // ── Step 2: Drop VA → Seoul ───────────────────────────────────────────
        // Backgrounds are now inside worldRef — Seoul slides in from below naturally.
        tl.to(worldRef.current, {
          y: '-100vh', ease: 'none', force3D: true, immediateRender: false,
        });

        // ── Step 3: Seoul horizontal ─────────────────────────────────────────
        tl.to(worldRef.current, {
          x: '-200vw', ease: 'none', force3D: true, immediateRender: false,
        });

        // ── Step 4: Drop Seoul → LA ───────────────────────────────────────────
        tl.to(worldRef.current, {
          y: '-200vh', ease: 'none', force3D: true, immediateRender: false,
        });

        // ── Step 5: LA horizontal ────────────────────────────────────────────
        tl.to(worldRef.current, {
          x: '-300vw', ease: 'none', force3D: true, immediateRender: false,
        });

        // ── Mouse-follow paraglider ───────────────────────────────────────────
        const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const pos   = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        handleMouseMove = (e: MouseEvent) => {
          mouse.x = e.clientX;
          mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        tickerFn = () => {
          const dt = 1.0 - Math.pow(1.0 - 0.08, gsap.ticker.deltaRatio());
          pos.x += (mouse.x - pos.x) * dt;
          pos.y += (mouse.y - pos.y) * dt;
          gsap.set(characterRef.current, {
            rotation: (mouse.x - pos.x) * 0.2,
            x: pos.x - (characterRef.current?.offsetWidth  || 0) / 2,
            y: pos.y - (characterRef.current?.offsetHeight || 0) / 2,
            force3D: true,
          });
        };
        gsap.ticker.add(tickerFn);

        gsap.to(characterRef.current, {
          yPercent: 5, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });

      }, containerRef);
    };

    init();

    return () => {
      mounted = false;
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      ctx?.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: C.night, minHeight: '100vh', height: '100vh' }}
    >

      {/* ══════════════════════════════════════════════════════════════════════
          WORLD TRACK — backgrounds + content, all move together.
          Each background row is 400vw wide (covers every horizontal position)
          and 100vh tall, stacked at its row's y-offset inside worldRef.
          As GSAP translates the world, backgrounds and cards move in sync.
          ══════════════════════════════════════════════════════════════════════ */}
      <div
        ref={worldRef}
        className="absolute top-0 left-0 w-[400vw] h-[300vh] flex flex-col"
        style={{ willChange: 'transform', transform: 'translateZ(0)' }}
      >

        {/* ── Row 1 background · Virginia  (y: 0 → 100vh) ─────────────────── */}
        <div
          className="absolute left-0 w-full"
          style={{ top: 0, height: '100vh', zIndex: 0 }}
        >
          {/* Sky gradient — fills the full 400vw row */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom,
                ${C.vaSky}  0%,
                ${C.vaMid}  60%,
                ${C.vaMid}  100%)`,
            }}
          />
          {/* Terrain image — spans the full Virginia row (200vw) so it stays
              visible across the entire horizontal pan (Step 1: x 0 → −100vw) */}
          <img
            src={virginiaBg}
            alt=""
            style={{
              position:       'absolute',
              left:           0,
              top:            0,
              width:          '200vw',
              height:         '100%',
              objectFit:      'cover',
              objectPosition: 'center bottom',
              filter:         'brightness(1.0) saturate(1.5)',
              display:        'block',
            }}
          />
        </div>

        {/* ── Row 2 background · Seoul  (y: 100vh → 200vh) ────────────────── */}
        <div
          className="absolute left-0 w-full"
          style={{
            top: '100vh', height: '100vh', zIndex: 0,
            background: `linear-gradient(to bottom,
              ${C.night}    0%,
              #1a1244       45%,
              ${C.twilight} 100%)`,
          }}
        />

        {/* ── Row 3 background · Los Angeles  (y: 200vh → 300vh) ──────────── */}
        <div
          className="absolute left-0 w-full"
          style={{
            top: '200vh', height: '100vh', zIndex: 0,
            background: `linear-gradient(to bottom,
              ${C.twilight}  0%,
              ${C.laWarm}    30%,
              ${C.laSky}     62%,
              ${C.laSunset}  85%,
              #ff2020        100%)`,
          }}
        />

        {/* ══ ROW 1 · VIRGINIA ══ scrolls x: 0 → −100 vw ══════════════════ */}
        <div className="relative w-full h-[100vh] flex flex-shrink-0" style={{ zIndex: 1 }}>
          <CitySection
            city="Virginia"
            accent="#58aa5a"
            bgGradient="from-transparent to-transparent"
            projects={[]}
            onProjectClick={onProjectClick}
          />
          <div className="w-[100vw] h-full flex-shrink-0" />

          {/* Interactive project dots */}
          <div className="absolute bottom-0 left-0 w-[100vw] h-[70%] z-20 pointer-events-none">
            {VA_DOT_POSITIONS.map(({ id, x, y }) => {
              const project  = VA_PROJECTS.find(p => p.id === id);
              if (!project) return null;
              const isActive  = activeDot  === id;
              const isHovered = hoveredDot === id;
              return (
                <div
                  key={id}
                  className="absolute pointer-events-none"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {isActive && (
                    <div
                      className="absolute w-60 bg-[#0d1b2a]/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30 pointer-events-auto"
                      style={{ bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' }}
                    >
                      <div className="relative">
                        <img src={project.thumbnail} alt={project.title} className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a] via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#58aa5a]">{project.category}</span>
                        <h5 className="font-serif text-base font-bold text-white mt-1 leading-tight">{project.title}</h5>
                        <p className="font-mono text-[10px] text-white/50 mt-2 leading-relaxed">{project.description}</p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {project.tags.map(t => (
                            <span key={t} className="font-mono text-[8px] border border-white/20 px-2 py-0.5 rounded-full text-white/60">{t}</span>
                          ))}
                        </div>
                        <button
                          onClick={() => { setActiveDot(null); onProjectClick(project); }}
                          className="mt-4 w-full font-mono text-[9px] uppercase tracking-wider bg-[#58aa5a] hover:bg-[#6abb6c] text-white py-2 rounded-lg transition-colors"
                        >
                          View Full Project →
                        </button>
                      </div>
                    </div>
                  )}
                  <div
                    className="absolute pointer-events-auto"
                    style={{ width: 80, height: 80, top: -30, left: -30 }}
                    onMouseEnter={() => setHoveredDot(id)}
                    onMouseLeave={() => setHoveredDot(null)}
                    onClick={() => setActiveDot(isActive ? null : id)}
                  >
                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer ${isHovered ? 'dot-float' : ''}`}>
                      <span className="absolute inset-0 rounded-full bg-[#FF484B] opacity-50 animate-ping" />
                      <span className="relative block w-5 h-5 rounded-full bg-[#FF484B] border-2 border-white shadow-lg" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ ROW 2 · SEOUL ══ scrolls x: −100 vw → −200 vw ═══════════════ */}
        <div className="relative w-full h-[100vh] flex flex-shrink-0" style={{ zIndex: 1 }}>
          <div className="w-[100vw] h-full flex-shrink-0" />
          <CitySection
            city="Seoul"
            accent="#4480ff"
            bgGradient="from-transparent to-transparent"
            projects={PROJECTS.filter(p => p.id.startsWith('KR'))}
            onProjectClick={onProjectClick}
          />
          <div className="w-[100vw] h-full flex-shrink-0" />
        </div>

        {/* ══ ROW 3 · LOS ANGELES ══ scrolls x: −200 vw → −300 vw ══════════ */}
        <div className="relative w-full h-[100vh] flex flex-shrink-0" style={{ zIndex: 1 }}>
          <div className="w-[200vw] h-full flex-shrink-0" />
          <CitySection
            city="Los Angeles"
            accent="#ff6020"
            bgGradient="from-transparent to-transparent"
            projects={PROJECTS.filter(p => p.id.startsWith('LA'))}
            onProjectClick={onProjectClick}
          />
        </div>
      </div>

      <style>{`
        @keyframes dot-float {
          0%,  100% { transform: translate(-50%, -50%) translateY(0px)   scale(1);    }
          50%        { transform: translate(-50%, -50%) translateY(-8px)  scale(1.15); }
        }
        .dot-float { animation: dot-float 1.4s ease-in-out infinite; }
      `}</style>

      {/* Paraglider */}
      <div
        ref={characterRef}
        className="fixed top-0 left-0 z-[60] w-32 md:w-48 pointer-events-none drop-shadow-2xl will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <img src="/assets/Artboard 9.png" alt="Paraglider" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

const CitySection: React.FC<{
  city: string;
  accent: string;
  bgGradient: string;
  projects: ProjectType[];
  onProjectClick: (p: ProjectType) => void;
}> = ({ city, accent, bgGradient, projects, onProjectClick }) => (
  <div className={`w-[100vw] h-full relative bg-gradient-to-b ${bgGradient} flex items-center px-12 md:px-32`}>
    <div className="relative z-10 flex gap-8 items-center h-full w-full">
      <header className="flex-shrink-0 w-64 border-l-4 pl-6" style={{ borderColor: accent }}>
        <h4 className="font-serif text-4xl font-bold italic text-white">{city} Stop</h4>
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mt-2">Interactive Showcase</p>
      </header>

      {projects.length > 0 && (
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => onProjectClick(p)}
              className="group relative flex-shrink-0 w-64 h-80 bg-[#1e3040] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-500 border border-white/10 shadow-2xl pointer-events-auto"
            >
              <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#07091e] via-transparent to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: accent }}>{p.category}</span>
                <h5 className="font-serif text-lg font-bold text-white leading-tight">{p.title}</h5>
                <div className="mt-4 flex gap-2 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                  {p.tags.map(t => (
                    <span key={t} className="font-mono text-[8px] border border-white/20 px-2 py-0.5 rounded-full text-white/70 whitespace-nowrap">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default ParaglidingJourney;
