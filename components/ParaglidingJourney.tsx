
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, CITY_HUB } from '../constants';
import { JourneyStop, Project as ProjectType } from '../types';

interface ParaglidingJourneyProps {
  onUpdateHud: (data: any) => void;
  onProjectClick: (project: ProjectType) => void;
}

const ParaglidingJourney: React.FC<ParaglidingJourneyProps> = ({ onUpdateHud, onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      
      const xSet = gsap.quickSetter(characterRef.current, "x", "px");
      const ySet = gsap.quickSetter(characterRef.current, "y", "px");

      const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };

      window.addEventListener("mousemove", handleMouseMove);

      // Animation ticker for smooth following (lerp)
      gsap.ticker.add(() => {
        const dt = 1.0 - Math.pow(1.0 - 0.08, gsap.ticker.deltaRatio()); 
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        
        // Add a slight tilt based on horizontal speed
        const rotation = (mouse.x - pos.x) * 0.2;
        gsap.set(characterRef.current, { 
          rotation: rotation,
          x: pos.x - (characterRef.current?.offsetWidth || 0) / 2,
          y: pos.y - (characterRef.current?.offsetHeight || 0) / 2
        });
      });

      // Bobbing effect combined with mouse position
      gsap.to(characterRef.current, {
        yPercent: 5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-[#07091e]">
      {/* The World Track */}
      <div ref={worldRef} className="absolute top-0 left-0 w-[400vw] h-[300vh] flex flex-col">
        
        {/* ROW 1: VIRGINIA */}
        <div className="flex w-full h-[100vh]">
          <CitySection 
            city="Virginia" 
            accent="#58aa5a" 
            bgGradient="from-[#a0d4f2] to-[#c0e8fa]" 
            projects={PROJECTS.filter(p => p.id.startsWith('VA'))} 
            onProjectClick={onProjectClick}
          />
          <div className="w-[100vw] h-full bg-gradient-to-r from-[#c0e8fa] to-[#07091e]" />
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

      {/* Paraglider (Now follows mouse cursor) */}
      <div 
        ref={characterRef}
        className="fixed top-0 left-0 z-[60] w-32 md:w-48 pointer-events-none drop-shadow-2xl will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <ParagliderSVG />
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
    </div>
  </div>
);

const ParagliderSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 50 C 5 15, 95 15, 95 50" stroke="white" strokeWidth="2.5" fill="white" fillOpacity="0.15" />
    <path d="M10 50 L 50 82 L 90 50" stroke="white" strokeWidth="0.8" strokeDasharray="2 2" />
    <circle cx="50" cy="85" r="4" fill="white" />
    <path d="M48 89 L 45 96 M 52 89 L 55 96" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <rect x="47" y="81" width="6" height="4" rx="1" fill="white" />
    <g opacity="0.6">
      <line x1="10" y1="40" x2="0" y2="40" stroke="white" strokeWidth="0.5">
        <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.5s" repeatCount="indefinite" />
      </line>
    </g>
  </svg>
);

export default ParaglidingJourney;
