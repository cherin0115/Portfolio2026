import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, CITY_HUB } from '../constants';
import { JourneyStop, Project as ProjectType } from '../types';
import virginiaBg from '../assets/bg_Virginia.webp';

gsap.registerPlugin(ScrollTrigger);

const C = {
  vaSky: '#a0d4f2',
  vaMid: '#7bb8d8',
  twilight: '#2b1178',
  night: '#b6cae2',
  laSky: '#fe6600',
} as const;

const GPU: React.CSSProperties = {
  transform: 'translate3d(0,0,0)',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
};

const VA_PROJECTS = PROJECTS.filter(p => p.id.startsWith('VA'));
const VA_DOT_POSITIONS = [
  { id: 'VA-01', x: 25,  y: 35 },
  { id: 'VA-02', x: 55, y: 20 },
  { id: 'VA-03', x: 80, y: 55 },
  { id: 'VA-04', x: 120, y: 30 },
];

const ParaglidingJourney: React.FC<{
  onUpdateHud: (data: any) => void;
  onProjectClick: (project: ProjectType) => void;
}> = ({ onUpdateHud, onProjectClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const cityRef = useRef<string>(JourneyStop.VIRGINIA);
  const [currentCity, setCurrentCity] = useState<string>(JourneyStop.VIRGINIA);
  const [activeDot, setActiveDot] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const img = new Image();
      img.src = virginiaBg;
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
            let stop = JourneyStop.VIRGINIA;
            if (p > 0.66) stop = JourneyStop.LA;
            else if (p > 0.33) stop = JourneyStop.SEOUL;
            
            if (stop !== cityRef.current) {
              cityRef.current = stop;
              setCurrentCity(stop);
            }

            const cityData = CITY_HUB[stop];
            onUpdateHud({
              city: cityData.name,
              coords: cityData.coords,
              altitude: cityData.altitude + Math.sin(p * 50) * 20,
              progress: Math.round(p * 100),
            });

            if (bgRef.current) {
              if (stop === JourneyStop.VIRGINIA) {
                // 배경을 가로로 이동시키면서 화면(vh)에 고정
                gsap.set(bgRef.current, { xPercent: -p * 15, opacity: 1 });
              } else {
                gsap.set(bgRef.current, { opacity: 0 });
              }
            }
          },
        },
      });

      mainTl.to(worldRef.current, { x: '-210vw', ease: 'none' }, 0); 
      mainTl.to(worldRef.current, { y: '-100vh', x: '0vw', ease: 'none' }, 0.33);
      mainTl.to(worldRef.current, { y: '-200vh', ease: 'none' }, 0.66);

      const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX; mouse.y = e.clientY;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const tickerFn = () => {
        const dt = 1.0 - Math.pow(1.0 - 0.08, gsap.ticker.deltaRatio());
        pos.x += (mouse.x - pos.x) * dt;
        pos.y += (mouse.y - pos.y) * dt;
        gsap.set(characterRef.current, {
          rotation: (mouse.x - pos.x) * 0.15,
          x: pos.x, y: pos.y,
          force3D: true,
        });
      };
      gsap.ticker.add(tickerFn);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        gsap.ticker.remove(tickerFn);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: C.night }}>
      
      {/* 버지니아 배경: vh 안에 꽉 차도록 설정 */}
      <div 
        ref={bgRef}
        className="fixed top-0 left-0 h-screen transition-opacity duration-500"
        style={{
          width: '140vw', // 가로 이동 거리를 위한 폭
          backgroundImage: `url(${virginiaBg})`,
          backgroundSize: 'auto', // 이미지를 화면 높이와 가로에 강제로 맞춤
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center', // 중앙 정렬
          zIndex: 1,
          pointerEvents: 'none',
          ...GPU
        }}
      />

      <div className="fixed inset-0 transition-colors duration-1000" style={{ zIndex: 0, backgroundColor: currentCity === JourneyStop.SEOUL ? C.twilight : currentCity === JourneyStop.LA ? C.laSky : 'transparent' }} />

      <div className={`absolute inset-0 z-50 bg-[#07091e] transition-opacity duration-1000 ${loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />

      {/* 월드 콘텐츠 */}
      <div ref={worldRef} className="relative z-10 w-full h-full" style={GPU}>
        
        <div className="h-screen w-[300vw] relative overflow-visible">
          <div className="absolute left-0 top-0 h-full flex items-center px-32">
             <header className="flex-shrink-0 w-64 border-l-4 pl-6 border-[#fc5400]">
                <h4 className="font-serif text-4xl font-bold italic text-white">Virginia Stop</h4>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mt-2">Interactive Journey</p>
             </header>
          </div>
          
          {VA_DOT_POSITIONS.map(({ id, x, y }) => {
            const project = VA_PROJECTS.find(p => p.id === id);
            if (!project) return null;
            return (
              <div key={id} className="absolute" style={{ left: `${x}vw`, top: `${y}%` }}>
                 <div 
                  className="w-6 h-6 rounded-full bg-[#FF484B] border-2 border-white shadow-lg cursor-pointer pointer-events-auto dot-float"
                  onClick={() => setActiveDot(activeDot === id ? null : id)}
                 />
                 {activeDot === id && (
                   <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-slate-900/95 p-4 rounded-xl border border-white/20 pointer-events-auto shadow-2xl backdrop-blur-sm">
                      <img src={project.thumbnail} className="w-full h-24 object-cover rounded-lg mb-2" alt="" />
                      <h5 className="text-white font-bold">{project.title}</h5>
                      <button onClick={() => onProjectClick(project)} className="mt-2 text-[10px] text-orange-400 font-mono hover:text-orange-300">View Project →</button>
                   </div>
                 )}
              </div>
            );
          })}
        </div>

        <div className="h-screen w-full flex items-center px-32">
          <CitySection city="Seoul" accent="#4480ff" projects={PROJECTS.filter(p => p.id.startsWith('KR'))} onProjectClick={onProjectClick} />
        </div>

        <div className="h-screen w-full flex items-center px-32">
          <CitySection city="Los Angeles" accent="#fffb1d" projects={PROJECTS.filter(p => p.id.startsWith('LA'))} onProjectClick={onProjectClick} />
        </div>
      </div>

      <div ref={characterRef} className="fixed top-0 left-0 z-[60] w-32 md:w-48 pointer-events-none" style={{ transform: 'translate(-50%,-50%)', ...GPU }}>
        <img src="/assets/Artboard 9.png" alt="" className="w-full h-full object-contain" />
      </div>

      <style>{`
        .dot-float { animation: dot-float 1.4s ease-in-out infinite; }
        @keyframes dot-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
};

const CitySection: React.FC<{
    city: string;
    accent: string;
    projects: ProjectType[];
    onProjectClick: (p: ProjectType) => void;
  }> = ({ city, accent, projects, onProjectClick }) => (
    <div className="flex gap-8 items-center h-full w-full">
      <header className="flex-shrink-0 w-64 border-l-4 pl-6" style={{ borderColor: accent }}>
        <h4 className="font-serif text-4xl font-bold italic text-white">{city} Stop</h4>
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/50 mt-2">Interactive Showcase</p>
      </header>
      <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
        {projects.map((p) => (
          <div key={p.id} onClick={() => onProjectClick(p)} className="group relative flex-shrink-0 w-64 h-80 bg-[#1e3040] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-500 border border-white/10 shadow-xl">
            <img src={p.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" alt="" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <span className="text-[9px] uppercase font-mono" style={{ color: accent }}>{p.category}</span>
              <h5 className="text-lg font-bold text-white font-serif leading-tight">{p.title}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

export default ParaglidingJourney;