
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, CITY_HUB } from '../constants';
import { JourneyStop, Project as ProjectType } from '../types';
import richmondBg from '../assets/richmond_ref2.png';

gsap.registerPlugin(ScrollTrigger);

interface ParaglidingJourneyProps {
  onUpdateHud: (data: any) => void;
  onProjectClick: (project: ProjectType) => void;
}

const VA_PROJECTS = PROJECTS.filter(p => p.id.startsWith('VA'));

// Dot positions as % of the image overlay area (w-[100vw] h-[70%] bottom-0)
const VA_DOT_POSITIONS = [
  { id: 'VA-01', x: 35, y: 50 },
  { id: 'VA-02', x: 79, y: 24 },
  { id: 'VA-03', x: 112, y: 70 },
  { id: 'VA-04', x: 150, y: 34 },
];

const ParaglidingJourney: React.FC<ParaglidingJourneyProps> = ({ onUpdateHud, onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState<string | null>(null);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  useEffect(() => {
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let tickerFn: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // The "Snake" World Timeline - Handles the background movement
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=8000', // Long scroll for the whole journey
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            let currentStop = JourneyStop.VIRGINIA;
            if (p > 0.66) currentStop = JourneyStop.LA;
            else if (p > 0.33) currentStop = JourneyStop.SEOUL;

            const cityData = CITY_HUB[currentStop];
            onUpdateHud({
              city: cityData.name,
              coords: cityData.coords,
              altitude: cityData.altitude + Math.sin(p * 50) * 20,
              progress: Math.round(p * 100)
            });
          }
        }
      });

      // Zig-Zag World Path
      tl.to(worldRef.current, { x: '-100vw', ease: 'none' }) // VA Horizontal
        .to(worldRef.current, { y: '-100vh', ease: 'none' }) // Drop to Seoul
        .to(worldRef.current, { x: '-200vw', ease: 'none' }) // Seoul Horizontal
        .to(worldRef.current, { y: '-200vh', ease: 'none' }) // Drop to LA
        .to(worldRef.current, { x: '-300vw', ease: 'none' }); // LA Horizontal

      // Mouse Following Logic for the Paraglider
      const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      
      handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Animation ticker for smooth following (lerp)
      tickerFn = () => {
        const dt = 1.0 - Math.pow(1.0 - 0.08, gsap.ticker.deltaRatio());
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;

        // Add a slight tilt based on horizontal speed
        const rotation = (mouse.x - pos.x) * 0.2;
        gsap.set(characterRef.current, {
          rotation: rotation,
          x: pos.x - (characterRef.current?.offsetWidth || 0) / 2,
          y: pos.y - (characterRef.current?.offsetHeight || 0) / 2,
        });
      };

      gsap.ticker.add(tickerFn);

      // Bobbing effect combined with mouse position
      gsap.to(characterRef.current, {
        yPercent: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => {
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#07091e]">
      {/* The World Track */}
      <div ref={worldRef} className="absolute top-0 left-0 w-[400vw] h-[300vh] flex flex-col">
        
        {/* ROW 1: VIRGINIA */}
        <div className="flex w-full h-[100vh] relative">
          {/* Richmond cityscape: bottom 70%, spans Virginia + transition corridor */}
          <img
            src={richmondBg}
            alt=""
            className="absolute bottom-0 left-0 w-[200vw] h-[70%] object-contain object-bottom pointer-events-none select-none"
            style={{ filter: 'brightness(1.3) saturate(1.1)' }}
          />
          {/* Sky-to-city soft blend edge */}
          <div
            className="absolute left-0 w-[200vw] pointer-events-none"
            style={{ bottom: '70%', height: '100px', background: 'linear-gradient(to bottom, #c0e8fa, transparent)' }}
          />

          {/* Virginia sky gradient — transparent at bottom so Richmond shows through */}
          <CitySection
            city="Virginia"
            accent="#58aa5a"
            bgGradient="from-[#a0d4f2] to-transparent"
            projects={[]}
            onProjectClick={onProjectClick}
          />
          <div className="w-[100vw] h-full bg-gradient-to-r from-transparent to-[#07091e]" />

          {/* Interactive dots — rendered LAST so they sit above CitySection */}
          <div className="absolute bottom-0 left-0 w-[100vw] h-[70%] z-20 pointer-events-none">
            {VA_DOT_POSITIONS.map(({ id, x, y }) => {
              const project = VA_PROJECTS.find(p => p.id === id);
              if (!project) return null;
              const isActive = activeDot === id;
              const isHovered = hoveredDot === id;
              return (
                <div key={id} className="absolute pointer-events-none" style={{ left: `${x}%`, top: `${y}%` }}>
                  {/* Popup card — opens upward from the dot */}
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
                  {/* Invisible proximity zone (80×80px) centred on the dot */}
                  <div
                    className="absolute pointer-events-auto"
                    style={{ width: 80, height: 80, top: -30, left: -30 }}
                    onMouseEnter={() => setHoveredDot(id)}
                    onMouseLeave={() => setHoveredDot(null)}
                    onClick={() => setActiveDot(isActive ? null : id)}
                  >
                    {/* Dot centred inside proximity zone */}
                    <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer ${isHovered ? 'dot-float' : ''}`}>
                      <span className="absolute inset-0 rounded-full bg-[#58aa5a] opacity-50 animate-ping" />
                      <span className="relative block w-5 h-5 rounded-full bg-[#58aa5a] border-2 border-white shadow-lg" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* ROW 2: SEOUL */}
        <div className="flex w-full h-[100vh]">
          <div className="w-[100vw]" />
          <CitySection 
            city="Seoul" 
            accent="#4480ff" 
            bgGradient="from-[#07091e] to-[#241760]" 
            projects={PROJECTS.filter(p => p.id.startsWith('KR'))} 
            onProjectClick={onProjectClick}
          />
          <div className="w-[100vw] h-full bg-gradient-to-r from-[#241760] to-[#ff8c42]" />
        </div>

        {/* ROW 3: LOS ANGELES */}
        <div className="flex w-full h-[100vh]">
          <div className="w-[200vw]" />
          <CitySection 
            city="Los Angeles" 
            accent="#ff6020" 
            bgGradient="from-[#ff8c42] to-[#ff3c38]" 
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
        .dot-float {
          animation: dot-float 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* Paraglider (Now follows mouse cursor) */}
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
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
      <h3 className="font-serif text-[25vw] font-bold italic text-white whitespace-nowrap">{city}</h3>
    </div>
    
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
