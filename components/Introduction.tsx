import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

import cloud1 from '../assets/Cloud/Realistic Clouds Overlay 1.png';
import cloud2 from '../assets/Cloud/Realistic Clouds Overlay 2.png';
import cloud3 from '../assets/Cloud/Realistic Clouds Overlay 3.png';
import cloud4 from '../assets/Cloud/Realistic Clouds Overlay 4.png';

const CLOUD_ASSETS = [cloud1, cloud2, cloud3, cloud4];

const Introduction: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const bgCloudsRef = useRef<HTMLDivElement>(null);
  const fgCloudsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating animation for intro text
    gsap.to(textRef.current, {
      y: 15,
      duration: 3,
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
    <section className="relative -mt-px h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#d8f4fe] via-[#a0d4f2] to-[#7db6d6]">
      
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

      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div ref={textRef} className="relative z-10 text-center px-6 max-w-4xl mix-blend-overlay text-[#071F35]">
        <h2 className="colence-font text-5xl md:text-7xl lg:text-8xl mb-8 leading-tight text-[#071F35]">
          Cherin's Journey
        </h2>
        
        <p className="font-serif italic text-lg md:text-2xl text-[#071F35] mb-6 leading-relaxed">
          A design thinker and creative problem solver. 
          <span><br></br>Through paragliding across three cities; Richmond, Seoul, and Los Angeles.</span>
          <span><br></br>I've crafted a portfolio that captures the essence of my design philosophy.</span>
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="flex-1">
            <p className="font-mono text-xs uppercase tracking-widest text-[#071F35]/60 mb-3">Specialties</p>
            <ul className="font-serif text-[#1e3040] space-y-2">
              <li>✦ User Experience Design</li>
              <li>✦ Visual Storytelling</li>
              <li>✦ Interactive Prototypes</li>
            </ul>
          </div>

          <div className="h-32 md:h-48 w-px bg-gradient-to-b from-transparent via-[#1e3040]/30 to-transparent"></div>

          <div className="flex-1">
            <p className="font-mono text-xs uppercase tracking-widest text-[#071F35]/60 mb-3">Approach</p>
            <ul className="font-serif text-[#1e3040] space-y-2">
              <li>✦ Data-Driven Design</li>
              <li>✦ Human-Centered Solutions</li>
              <li>✦ Creative Innovation</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-[#071F35]/40">
          Scroll to begin the expedition
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
        /* Create a soft atmospheric haze */
        section::after {
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

export default Introduction;
