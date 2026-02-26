
import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Landing from './components/Landing';
import Introduction from './components/Introduction';
import ParaglidingJourney from './components/ParaglidingJourney';
import ProjectDetail from './components/ProjectDetail';
import AdaptiveHudCaseStudy from './components/HUD';
import Navbar from './components/Navbar';
import { Project } from './types';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [, setHudData] = useState({
    city: 'Glen Allen, VA',
    coords: '37.6660° N, 77.4605° W',
    altitude: 120,
    progress: 0
  });

  const mainRef = useRef<HTMLDivElement>(null);
  const savedScrollY = useRef(0);

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
      .to('.wipe-overlay', {
        scale: 5,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.out',
      });
      return;
    }

    const tl = gsap.timeline();
    tl.set('.wipe-overlay', { scale: 0, opacity: 1 });
    tl.to('.wipe-overlay', {
      scale: 1,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: () => {
        setSelectedProject(project);
        window.scrollTo(0, 0);
      }
    })
    .to('.wipe-overlay', {
      scale: 5,
      opacity: 0,
      duration: 0.8,
      ease: 'power4.out'
    });
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
    .to('.wipe-overlay', {
      scale: 5,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out',
    });
  };

  const closeProject = () => {
    const tl = gsap.timeline();
    tl.to('.wipe-overlay', {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'power4.inOut',
      onComplete: () => setSelectedProject(null)
    })
    .to('.wipe-overlay', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'power4.out'
    });
  };

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#07091e' }}>
      {/* Global sticky navbar — hidden inside the HUD iframe view */}
      <Navbar visible={!isHudOpen} />

      {/* Wipe / Foveal Transition Overlay */}
      <div
        className="wipe-overlay fixed inset-0 z-[9999] rounded-full scale-0 opacity-0 pointer-events-none flex items-center justify-center"
        style={{ backgroundColor: '#07091e' }}
      >
        <div className="font-mono" style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '10px',
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}>
          INITIATING DATA LINK...
        </div>
      </div>

      {/* Main Content */}
      <div ref={mainRef} className={selectedProject || isHudOpen ? 'hidden' : 'block'}>
        <Landing />
        <Introduction />
        <ParaglidingJourney
          onProjectClick={handleProjectClick}
          onUpdateHud={(data) => setHudData(prev => ({ ...prev, ...data }))}
        />
      </div>

      {/* Detail Page */}
      {selectedProject && (
        <ProjectDetail project={selectedProject} onClose={closeProject} />
      )}

      {/* Adaptive HUD Case Study */}
      {isHudOpen && (
        <div className="fixed inset-0 z-[9998] bg-[#07091e] overflow-y-auto">
          <button
            onClick={closeHud}
            className="fixed top-6 right-8 z-[10000] text-white/60 hover:text-white font-mono text-2xl leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
          <AdaptiveHudCaseStudy />
        </div>
      )}
    </div>
  );
};

export default App;
