
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

import cloud1 from '../assets/Realistic Clouds Overlay 1.png';
import cloud2 from '../assets/Realistic Clouds Overlay 2.png';
import cloud3 from '../assets/Realistic Clouds Overlay 3.png';
import cloud4 from '../assets/Realistic Clouds Overlay 4.png';

const CLOUD_ASSETS = [cloud1, cloud2, cloud3, cloud4];

const Landing: React.FC = () => {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const bgCloudsRef = useRef<HTMLDivElement>(null);
  const fgCloudsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating wobble effect for hero text
    gsap.to(heroTextRef.current, {
      y: 20,
      x: 10,
      rotation: 1.5,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Animate background clouds (Slow & Deep)
    const bgClouds = bgCloudsRef.current?.children;
    if (bgClouds) {
      Array.from(bgClouds).forEach((cloud, i) => {
        gsap.to(cloud, {
          x: '120vw',
          duration: 40 + i * 15,
          repeat: -1,
          ease: 'none',
          delay: -i * 10
        });
        // Subtle drift
        gsap.to(cloud, {
          y: '+=30',
          duration: 3 + i,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
    }

    // Animate foreground clouds (Faster & Closer)
    const fgClouds = fgCloudsRef.current?.children;
    if (fgClouds) {
      Array.from(fgClouds).forEach((cloud, i) => {
        gsap.to(cloud, {
          x: '140vw',
          duration: 25 + i * 8,
          repeat: -1,
          ease: 'none',
          delay: -i * 12
        });
        gsap.to(cloud, {
          y: '-=50',
          duration: 4 + i,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
    }
  }, []);

  return (
    <section id="landing" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#7db6d6] via-[#a0d4f2] to-[#d8f4fe] z-10">
      
      {/* BACKGROUND CLOUDS (Behind Text) */}
      <div ref={bgCloudsRef} className="absolute inset-0 pointer-events-none opacity-60">
        {[...Array(6)].map((_, i) => (
          <img 
            key={`bg-${i}`}
            src={CLOUD_ASSETS[i % CLOUD_ASSETS.length]}
            alt="cloud"
            className="absolute select-none pointer-events-none filter blur-[2px]"
            style={{
              width: `${400 + Math.random() * 400}px`,
              top: `${Math.random() * 80}%`,
              left: '-40vw',
              opacity: 0.6 + Math.random() * 0.4
            }}
          />
        ))}
      </div>

      {/* HERO TEXT (Sandwiched) */}
      <div className="z-20 text-center px-6 mix-blend-overlay">
        <div ref={heroTextRef} className="inline-block relative">
          <h1 className="colence-font text-7xl md:text-[10rem] text-[#1e3040] font-light leading-none tracking-tight">
            Hi, I'm <span className="font-bold">Cherin</span>
          </h1>
          <div className="mt-6 font-mono text-[10px] md:text-xs tracking-[0.8em] uppercase text-[#1e3040]/40 font-bold block">
            Design Journey Protocol — Flight 2025
          </div>
        </div>
      </div>

      {/* FOREGROUND CLOUDS (In front of Text) */}
      <div ref={fgCloudsRef} className="absolute inset-0 pointer-events-none z-30">
        {[...Array(4)].map((_, i) => (
          <img 
            key={`fg-${i}`}
            src={CLOUD_ASSETS[(i + 2) % CLOUD_ASSETS.length]}
            alt="cloud"
            className="absolute select-none pointer-events-none"
            style={{
              width: `${600 + Math.random() * 400}px`,
              top: `${10 + Math.random() * 80}%`,
              left: '-50vw',
              opacity: 0.8 + Math.random() * 0.2,
              filter: 'brightness(1.1) contrast(0.9)'
            }}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-12 z-40 flex flex-col items-center gap-3 opacity-40 group cursor-default">
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#1e3040]">Initiate Descent</span>
        <div className="w-[1px] h-16 bg-[#1e3040] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/60 -translate-y-full animate-scroll-hint" />
        </div>
      </div>

      <style>{`
        @font-face {
          font-family: 'Colence';
          src: url('/assets/font/Colence-Regular.ttf') format('truetype');
        }
        .colence-font {
          font-family: 'Colence', serif;
          font-style: normal;
        }
        @keyframes scroll-hint {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scroll-hint {
          animation: scroll-hint 2.5s infinite ease-in-out;
        }
        /* Create a soft atmospheric haze */
        #landing::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.2) 100%);
          pointer-events: none;
          z-index: 25;
        }
      `}</style>
    </section>
  );
};

export default Landing;
