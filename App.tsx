
import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Landing from './components/Landing';
import Introduction from './components/Introduction';
import ParaglidingJourney from './components/ParaglidingJourney';
import ProjectDetail from './components/ProjectDetail';
import AdaptiveHudCaseStudy from './components/HUD';
import Navbar from './components/Navbar';
import IntroScene from './components/IntroScene';
import { Project } from './types';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [showIntro,       setShowIntro]       = useState(() => !sessionStorage.getItem('intro_done'));
  const [introComplete,   setIntroComplete]   = useState(() => !!sessionStorage.getItem('intro_done'));
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isHudOpen,       setIsHudOpen]       = useState(false);
  const [, setHudData] = useState({
    city: 'Glen Allen, VA',
    coords: '37.6660° N, 77.4605° W',
    altitude: 120,
    progress: 0
  });

  const mainRef      = useRef<HTMLDivElement>(null);
  const savedScrollY = useRef(0);

  const handleIntroComplete = () => {
    sessionStorage.setItem('intro_done', '1');
    setShowIntro(false);
    setIntroComplete(true);
  };

  const handleProjectClick = (project: Project) => {
    if (project.id === 'VA-01') {
      savedScrollY.current = window.scrollY;
      const tl = gsap.timeline();
      tl.set('.wipe-overlay', { scale: 0, opacity: 1 });
      tl.to('.wipe-overlay', {
        scale: 1,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => setIsHudOpen(true),
      })
      .to('.wipe-overlay', { scale: 5, opacity: 0, duration: 0.8, ease: 'power4.out' });
      return;
    }

    const tl = gsap.timeline();
    tl.set('.wipe-overlay', { scale: 0, opacity: 1 });
    tl.to('.wipe-overlay', {
      scale: 1,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: () => setSelectedProject(project),
    })
    .to('.wipe-overlay', { scale: 5, opacity: 0, duration: 0.8, ease: 'power4.out' });
  };

  const closeHud = () => {
    const tl = gsap.timeline();
    tl.set('.wipe-overlay', { scale: 0, opacity: 1 });
    tl.to('.wipe-overlay', {
      scale: 1,
      duration: 0.6,
      ease: 'power4.inOut',
      onComplete: () => {
        setIsHudOpen(false);
        window.scrollTo(0, savedScrollY.current);
      },
    })
    .to('.wipe-overlay', { scale: 5, opacity: 0, duration: 0.6, ease: 'power4.out' });
  };

  const closeProject = () => {
    const tl = gsap.timeline();
    tl.to('.wipe-overlay', {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power4.inOut',
      onComplete: () => {
        setSelectedProject(null);
        tl.pause();
        requestAnimationFrame(() => {
          const savedY = sessionStorage.getItem('pj_scroll_y');
          if (savedY) {
            window.scrollTo(0, parseInt(savedY, 10));
            ScrollTrigger.update();
          }
          tl.resume();
        });
      },
    })
    .to('.wipe-overlay', { scale: 0, opacity: 0, duration: 0.6, ease: 'power4.out' });
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#07091e' }}>

      {/* ── Cinematic Intro ─────────────────────────────────────────── */}
      {showIntro && <IntroScene onComplete={handleIntroComplete} />}

      {/* ── Film Grain overlay ──────────────────────────────────────── */}
      <div className="film-grain" style={{ pointerEvents: 'none' }} />

      {/* ── Vignette overlay ────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(0,0,0,0.65) 100%)',
        zIndex: 9201,
        pointerEvents: 'none',
      }} />

      {/* ── Sticky Navbar ───────────────────────────────────────────── */}
      <Navbar visible={introComplete && !isHudOpen} />

      {/* ── Wipe transition overlay ─────────────────────────────────── */}
      <div
        className="wipe-overlay fixed inset-0 z-[9999] rounded-full scale-0 opacity-0 pointer-events-none flex items-center justify-center"
        style={{ backgroundColor: '#5c7ba4' }}
      >
        <div className="font-mono" style={{
          color: 'rgb(255, 255, 255)',
          fontSize: '12px',
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
        }}>
          INITIATING DATA LINK...
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div ref={mainRef} className={selectedProject || isHudOpen ? 'hidden' : 'block'}>
        <Landing introComplete={introComplete} />
        <Introduction />
        <ParaglidingJourney
          onProjectClick={handleProjectClick}
          onUpdateHud={(data) => setHudData(prev => ({ ...prev, ...data }))}
          introComplete={introComplete}
        />
      </div>

      {/* ── Project Detail ──────────────────────────────────────────── */}
      {selectedProject && (
        <ProjectDetail project={selectedProject} onClose={closeProject} />
      )}

      {/* ── HUD Case Study ──────────────────────────────────────────── */}
      {isHudOpen && (
        <div className="fixed inset-0 z-[9998] overflow-y-auto" style={{ background: '#07091e' }}>
          <button
            onClick={closeHud}
            className="fixed top-6 right-8 z-[10000] font-mono text-2xl leading-none"
            style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Close"
          >
            ×
          </button>
          <AdaptiveHudCaseStudy />
        </div>
      )}

      {/* ── Global styles ───────────────────────────────────────────── */}
      <style>{`
        /* Film grain */
        .film-grain {
          position: fixed;
          inset: -100%;
          width: 300%;
          height: 300%;
          opacity: 0.038;
          z-index: 9200;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          animation: film-grain 0.18s steps(2) infinite;
          mix-blend-mode: overlay;
        }
        @keyframes film-grain {
          0%   { transform: translate(0,    0)    }
          20%  { transform: translate(-3%,  4%)   }
          40%  { transform: translate(4%,  -3%)   }
          60%  { transform: translate(-4%,  2%)   }
          80%  { transform: translate(3%,  -4%)   }
          100% { transform: translate(0,    0)    }
        }
      `}</style>
    </div>
  );
};

export default App;
