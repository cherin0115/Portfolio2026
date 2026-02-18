import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Introduction: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Floating animation for intro text
    gsap.to(textRef.current, {
      y: 15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#d8f4fe] via-[#a0d4f2] to-[#7db6d6]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div ref={textRef} className="relative z-10 text-center px-6 max-w-4xl">
        <h2 className="colence-font text-5xl md:text-7xl lg:text-8xl text-[#1e3040] mb-8 leading-tight">
          Cherin's Journey
        </h2>
        
        <p className="font-serif italic text-lg md:text-2xl text-[#2c4a5c] mb-6 leading-relaxed">
          A design thinker and creative problem solver. 
          <span><br></br>Through paragliding across three cities; Richmond, Seoul, and Los Angeles.</span>
          <span><br></br>I've crafted a portfolio that captures the essence of my design philosophy.</span>
        </p>

        <div className="mt-12 flex flex-col md:flex-row gap-8 justify-center items-center">
          <div className="flex-1">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1e3040]/60 mb-3">Specialties</p>
            <ul className="font-serif text-[#1e3040] space-y-2">
              <li>✦ User Experience Design</li>
              <li>✦ Visual Storytelling</li>
              <li>✦ Interactive Prototypes</li>
            </ul>
          </div>

          <div className="h-32 md:h-48 w-px bg-gradient-to-b from-transparent via-[#1e3040]/30 to-transparent"></div>

          <div className="flex-1">
            <p className="font-mono text-xs uppercase tracking-widest text-[#1e3040]/60 mb-3">Approach</p>
            <ul className="font-serif text-[#1e3040] space-y-2">
              <li>✦ Data-Driven Design</li>
              <li>✦ Human-Centered Solutions</li>
              <li>✦ Creative Innovation</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-[#1e3040]/40">
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
      `}</style>
    </section>
  );
};

export default Introduction;
