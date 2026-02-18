
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Landing from './components/Landing';
import Introduction from './components/Introduction';
import ParaglidingJourney from './components/ParaglidingJourney';
import ProjectDetail from './components/ProjectDetail';
import HUD from './components/HUD';
import { Project } from './types';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hudData, setHudData] = useState({
    city: 'Glen Allen, VA',
    coords: '37.6660° N, 77.4605° W',
    altitude: 120,
    progress: 0
  });

  const mainRef = useRef<HTMLDivElement>(null);

  const handleProjectClick = (project: Project) => {
    const tl = gsap.timeline();
    // Foveal zoom effect
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
    <div className="relative bg-[#07091e] min-h-screen">
      {/* HUD Overlay */}
      {!selectedProject && <HUD data={hudData} isDetailOpen={!!selectedProject} />}

      {/* Wipe / Foveal Transition Overlay */}
      <div className="wipe-overlay fixed inset-0 bg-white z-[9999] rounded-full scale-0 opacity-0 pointer-events-none flex items-center justify-center">
        <div className="text-[#1e3040] font-mono text-sm tracking-widest animate-pulse">INITIATING DATA LINK...</div>
      </div>

      {/* Main Content */}
      <div ref={mainRef} className={selectedProject ? 'hidden' : 'block'}>
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
    </div>
  );
};

export default App;
