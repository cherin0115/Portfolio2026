import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, CITY_HUB } from '../constants';
import { JourneyStop, Project as ProjectType } from '../types';
import richmondBg from '../assets/Richmond.png';
import seoulBg    from '../assets/Seoul.png';
import AdaptiveHUD, { HudData } from './AdaptiveHUD';

// ── Cloud assets via Vite glob ────────────────────────────────────────────
const cloudModules = import.meta.glob('../assets/Cloud/*.png', { eager: true });
const CLOUD_IMAGES: string[] = Object.values(cloudModules)
  .map((m: any) => m.default as string)
  .sort();

const GPU: React.CSSProperties = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
};

const PALETTE = {
  sky: {
    [JourneyStop.VIRGINIA]: 'linear-gradient(180deg, #1E3A5F 0%, #2A4A70 55%, #365870 100%)',
    [JourneyStop.SEOUL]:    'linear-gradient(180deg, #1A2E58 0%, #22396C 55%, #2E4A7A 100%)',
    [JourneyStop.LA]:       'linear-gradient(180deg, #1C2E56 0%, #283A70 55%, #38507A 100%)',
  },
  cloud: {
    [JourneyStop.VIRGINIA]: 'sepia(0.5) hue-rotate(310deg) saturate(1.1) brightness(0.88)',
    [JourneyStop.SEOUL]:    'sepia(0.55) hue-rotate(320deg) saturate(1.05) brightness(0.84)',
    [JourneyStop.LA]:       'sepia(0.45) hue-rotate(345deg) saturate(1.15) brightness(1.02)',
  },
  accent: {
    [JourneyStop.VIRGINIA]: '#8CC8C0',
    [JourneyStop.SEOUL]:    '#A8B8D8',
    [JourneyStop.LA]:       '#D8B888',
  },
  cream:      '#FFF5E4',
};

const SKY_GRADIENT: Record<string, string> = {
  [JourneyStop.VIRGINIA]: PALETTE.sky[JourneyStop.VIRGINIA],
  [JourneyStop.SEOUL]:    PALETTE.sky[JourneyStop.SEOUL],
  [JourneyStop.LA]:       PALETTE.sky[JourneyStop.LA],
};

const CLOUD_FILTER: Record<string, string> = {
  [JourneyStop.VIRGINIA]: PALETTE.cloud[JourneyStop.VIRGINIA],
  [JourneyStop.SEOUL]:    PALETTE.cloud[JourneyStop.SEOUL],
  [JourneyStop.LA]:       PALETTE.cloud[JourneyStop.LA],
};

const CLOUDS = [
  { id: 1, wVw: 55, top: -28, dur: 50, delay:  0,  opacity: 0.50, imgIdx: 0 },
  { id: 2, wVw: 42, top:  -8, dur: 38, delay: 12,  opacity: 0.40, imgIdx: 4 },
  { id: 3, wVw: 68, top: -18, dur: 65, delay:  0,  opacity: 0.32, imgIdx: 8 },
  { id: 4, wVw: 48, top: -48, dur: 44, delay:  6,  opacity: 0.44, imgIdx: 2 },
  { id: 5, wVw: 38, top: -95, dur: 32, delay: 20,  opacity: 0.36, imgIdx: 6 },
];

const laBgUrl = new URL('../assets/Los angeles.png', import.meta.url).href;

const ParaglidingJourney: React.FC<{
  onUpdateHud: (data: any) => void;
  onProjectClick: (project: ProjectType) => void;
  introComplete?: boolean;
}> = ({ onUpdateHud, onProjectClick, introComplete = false }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const worldRef      = useRef<HTMLDivElement>(null);
  const characterRef  = useRef<HTMLDivElement>(null);
  const bgRef         = useRef<HTMLDivElement>(null);
  const skyRef        = useRef<HTMLDivElement>(null);

  const lastScrollY    = useRef(window.scrollY);
  const scrollVelocity = useRef(0);
  const cityRef = useRef<string>(JourneyStop.VIRGINIA);
  const [currentCity, setCurrentCity] = useState<string>(JourneyStop.VIRGINIA);
  const [loaded, setLoaded] = useState(false);

  const [hudData, setHudData] = useState<HudData>({
    city:     'Richmond, VA',
    coords:   '37.6660° N, 77.4605° W',
    altitude: 120,
    progress: 0,
    accent:   PALETTE.accent[JourneyStop.VIRGINIA],
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const img = new Image();
      img.src = richmondBg;
      img.onload = () => setLoaded(true);

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
            let stop = p > 0.66 ? JourneyStop.LA : p > 0.33 ? JourneyStop.SEOUL : JourneyStop.VIRGINIA;

            if (stop !== cityRef.current) {
              cityRef.current = stop;
              setCurrentCity(stop);
            }

            const cityData = CITY_HUB[stop];
            const alt = Math.round(cityData.altitude + Math.sin(p * 50) * 20);

            onUpdateHud({
              city: cityData.name,
              coords: cityData.coords,
              altitude: alt,
              progress: Math.round(p * 100),
            });

            setHudData({
              city: cityData.name,
              coords: cityData.coords,
              altitude: alt,
              progress: Math.round(p * 100),
              accent: PALETTE.accent[stop] ?? cityData.accent,
            });

            if (bgRef.current) {
              if (stop === JourneyStop.VIRGINIA) {
                gsap.set(bgRef.current, { xPercent: -p * 20, opacity: 1 - p * 3 });
              } else {
                gsap.set(bgRef.current, { opacity: 0 });
              }
            }

            if (skyRef.current) {
              skyRef.current.style.background = SKY_GRADIENT[stop];
            }

            const currentY = window.scrollY;
            scrollVelocity.current = currentY - lastScrollY.current;
            lastScrollY.current = currentY;
          },
        },
      });

      mainTl.to(worldRef.current, { x: '-210vw', ease: 'none' }, 0);
      mainTl.to(worldRef.current, { y: '-100vh', x: '0vw', ease: 'none' }, 0.33);
      mainTl.to(worldRef.current, { y: '-200vh', ease: 'none' }, 0.66);

      const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const pos   = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
      window.addEventListener('mousemove', onMouseMove);

      const tickerFn = () => {
        const dt = 1.0 - Math.pow(1.0 - 0.08, gsap.ticker.deltaRatio());
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        const totalTilt = (mouse.x - pos.x) * 0.18 + scrollVelocity.current * 0.6;
        gsap.set(characterRef.current, {
          rotation: totalTilt,
          x: pos.x,
          y: pos.y,
          force3D: true,
        });
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
  const cityAccent  = PALETTE.accent[currentCity] ?? PALETTE.accent[JourneyStop.VIRGINIA];

  return (
    <div id="journey" ref={containerRef} className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#1E3A5F' }}>
      <div ref={skyRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, background: SKY_GRADIENT[JourneyStop.VIRGINIA], transition: 'background 1.4s ease', ...GPU }} />
      <div ref={bgRef} className="fixed top-0 left-0 h-screen pointer-events-none" style={{ width: '145vw', backgroundImage: `url(${richmondBg})`, backgroundSize: 'cover', backgroundPosition: 'center center', zIndex: 1, ...GPU }} />
      <div className="paper-texture fixed inset-0 pointer-events-none" style={{ zIndex: 3 }} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4, mixBlendMode: 'screen', filter: cloudFilter, transition: 'filter 1.6s ease' }}>
        {CLOUD_IMAGES.length > 0 && CLOUDS.map(c => (
          <div key={c.id} style={{ position: 'absolute', top: `${c.top}%`, width: `${c.wVw}vw`, opacity: c.opacity, animation: `cloud-drift ${c.dur}s linear ${c.delay}s infinite`, ...GPU }}>
            <img src={CLOUD_IMAGES[c.imgIdx % CLOUD_IMAGES.length]} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} draggable={false} />
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 pointer-events-none" style={{ height: '22vh', zIndex: 6, background: 'linear-gradient(to bottom, transparent 0%, #14243C 100%)' }} />
      <div className={`absolute inset-0 z-50 transition-opacity duration-1000 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ background: '#1E3A5F' }} />

      <div ref={worldRef} className="relative w-full h-full" style={{ zIndex: 10, ...GPU }}>
        
        {/* VIRGINIA - 카드화 적용 */}
        <div className="h-screen relative overflow-visible" style={{ width: '300vw' }}>
          <div className="absolute left-0 top-0 h-full flex items-center" style={{ paddingLeft: '8vw' }}>
            <CitySection
              tag="WAYPOINT 01"
              city="Virginia"
              sub="Richmond, USA"
              accent={PALETTE.accent[JourneyStop.VIRGINIA]}
              coords="37.6660° N, 77.4605° W"
              projects={PROJECTS.filter(p => p.id.startsWith('VA'))}
              onProjectClick={onProjectClick}
            />
          </div>
        </div>

        {/* SEOUL */}
        <div className="h-screen w-full relative" style={{ backgroundImage: `url(${seoulBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,30,64,0.72) 0%, rgba(20,30,64,0.3) 55%, transparent 100%)' }} />
          <div className="relative flex items-center h-full" style={{ padding: '0 8vw', zIndex: 2 }}>
            <CitySection
              tag="WAYPOINT 02"
              city="Seoul"
              sub="South Korea"
              accent={PALETTE.accent[JourneyStop.SEOUL]}
              coords="37.5665° N, 126.978° E"
              projects={PROJECTS.filter(p => p.id.startsWith('KR'))}
              onProjectClick={onProjectClick}
            />
          </div>
        </div>

        {/* LOS ANGELES */}
        <div className="h-screen w-full relative" style={{ backgroundImage: `url(${laBgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,26,56,0.70) 0%, rgba(20,26,56,0.28) 55%, transparent 100%)' }} />
          <div className="relative flex items-center h-full" style={{ padding: '0 8vw', zIndex: 2 }}>
            <CitySection
              tag="WAYPOINT 03"
              city="Los Angeles"
              sub="California, USA"
              accent={PALETTE.accent[JourneyStop.LA]}
              coords="34.0522° N, 118.244° W"
              projects={PROJECTS.filter(p => p.id.startsWith('LA'))}
              onProjectClick={onProjectClick}
            />
          </div>
        </div>
      </div>

      <div ref={characterRef} className="fixed top-0 left-0 pointer-events-none" style={{ zIndex: 60, width: 'clamp(100px, 14vw, 200px)', transform: 'translate(-50%,-50%)', filter: `drop-shadow(0 4px 20px ${cityAccent}66)`, ...GPU }}>
        <img src="/assets/Artboard 9.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      <AdaptiveHUD data={hudData} booted={introComplete} />

      <style>{`
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

// ── Components ──────────────────────────────────────────────────────────────

const CityHeader: React.FC<{ tag: string; city: string; sub: string; accent: string; coords: string; }> = ({ tag, city, sub, accent, coords }) => (
  <div style={{ flexShrink: 0 }}>
    <span style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '10px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: accent, display: 'block', marginBottom: '14px' }}>{tag}</span>
    <div style={{ width: '3px', height: '56px', background: `linear-gradient(${accent}, transparent)`, marginBottom: '14px', borderRadius: '2px' }} />
    <h4 style={{ fontFamily: "'Alice', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 400, color: '#FFF5E4', lineHeight: 1.1, marginBottom: '8px' }}>{city}</h4>
    <p style={{ fontFamily: "'Alice', serif", fontSize: '1rem', color: 'rgba(255,245,228,0.85)', fontStyle: 'italic' }}>{sub}</p>
    <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(255,245,228,0.5)', marginTop: '6px' }}>{coords}</p>
  </div>
);

const CitySection: React.FC<{ tag: string; city: string; sub: string; accent: string; coords: string; projects: ProjectType[]; onProjectClick: (p: ProjectType) => void; }> = ({ tag, city, sub, accent, coords, projects, onProjectClick }) => (
  <div style={{ display: 'flex', gap: '48px', alignItems: 'center', width: '100%' }}>
    <CityHeader tag={tag} city={city} sub={sub} accent={accent} coords={coords} />
    <div className="scrollbar-hide" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', flex: 1 }}>
      {projects.map(p => (
        <ProjectCard key={p.id} project={p} accent={accent} onClick={() => onProjectClick(p)} />
      ))}
    </div>
  </div>
);

const ProjectCard: React.FC<{ project: ProjectType; accent: string; onClick: () => void; }> = ({ project, accent, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const onEnter = () => gsap.to(cardRef.current, { scale: 1.04, duration: 0.4, ease: 'power2.out' });
  const onLeave = () => gsap.to(cardRef.current, { scale: 1.00, duration: 0.4, ease: 'power2.out' });

  return (
    <div ref={cardRef} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ flexShrink: 0, width: '260px', height: '330px', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', position: 'relative', background: 'rgba(30,50,90,0.55)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: `1px solid ${accent}44`, boxShadow: `0 8px 32px rgba(0,0,0,0.38)` }}>
      <img src={project.thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(15,25,50,0.92) 0%, rgba(15,25,50,0.15) 60%, transparent 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <h5 style={{ fontFamily: "'Alice', serif", fontSize: '1.15rem', color: '#FFF5E4', marginBottom: '8px' }}>{project.title}</h5>
        <p style={{ fontFamily: "'Quicksand', sans-serif", fontSize: '0.72rem', color: 'rgba(255,245,228,0.45)', lineHeight: 1.55 }}>{project.description}</p>
      </div>
    </div>
  );
};

export default ParaglidingJourney;