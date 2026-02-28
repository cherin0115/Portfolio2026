import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WAYPOINTS = [
  { id: 'VA', city: 'Richmond',    country: 'Virginia, USA',    coords: '37.6660° N, 77.4605° W', accent: '#8CC8C0', tag: 'WAYPOINT 01' },
  { id: 'KR', city: 'Seoul',       country: 'South Korea',      coords: '37.5665° N, 126.978° E', accent: '#A8B8D8', tag: 'WAYPOINT 02' },
  { id: 'LA', city: 'Los Angeles', country: 'California, USA',  coords: '34.0522° N, 118.244° W', accent: '#D8B888', tag: 'WAYPOINT 03' },
];

const GPU: React.CSSProperties = {
  transform: 'translate3d(0,0,0)',
  willChange: 'transform',
  backfaceVisibility: 'hidden',
};

const Introduction: React.FC = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const cardRef      = useRef<HTMLDivElement>(null);
  const waypointsRef = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal card on scroll-into-view
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );

      // Stagger waypoint rows
      const rows = waypointsRef.current?.children;
      if (rows) {
        gsap.fromTo(
          Array.from(rows),
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
            scrollTrigger: { trigger: waypointsRef.current, start: 'top 80%' },
          }
        );
      }

      // Subtle float on the main card
      gsap.to(cardRef.current, {
        y: 12,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #3A5B8A 0%, #4A6B9A 100%)',
        padding: '80px 24px',
      }}
    >
      {/* Precision grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(249,241,231,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(249,241,231,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        zIndex: 1,
      }} />

      {/* Corner brackets — HUD framing */}
      <Corner pos="top-8 left-8" />
      <Corner pos="top-8 right-8" mirror="x" />
      <Corner pos="bottom-8 left-8" mirror="y" />
      <Corner pos="bottom-8 right-8" mirror="xy" />

      {/* Glassmorphism mission briefing card */}
      <div
        ref={cardRef}
        className="relative w-full max-w-4xl"
        style={{ zIndex: 10, opacity: 0, ...GPU }}
      >
        <div style={{
          background: 'rgba(249,241,231,0.06)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(249,241,231,0.15)',
          borderRadius: '20px',
          padding: 'clamp(32px, 5vw, 56px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Shimmer edge */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(249,241,231,0.3) 50%, transparent 100%)',
          }} />

          {/* Mission header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <span className="font-mono" style={{
              fontFamily: "'Quicksand', 'Alice', sans-serif",
              fontSize: '10px', letterSpacing: '0.4em',
              color: 'rgba(244,215,147,0.85)', textTransform: 'uppercase',
              padding: '4px 10px',
              border: '1px solid rgba(244,215,147,0.35)',
              borderRadius: '4px',
            }}>
              MISSION BRIEF
            </span>
            <span style={{ flex: 1, height: '1px', background: 'rgba(249,241,231,0.4)' }} />
            <span className="font-mono" style={{ fontFamily: "'Quicksand', 'Alice', sans-serif", fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(249,241,231,0.55)' }}>
              FLT-2025 / 3 STOPS
            </span>
          </div>

          {/* Main heading */}
          <h2
            ref={headingRef}
            className="colence-font"
            style={{
              fontFamily: "'Alice', 'Quicksand', serif",
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              color: '#F9F1E7',
              lineHeight: 1.05,
              marginBottom: '50px',
              fontWeight: 200,
            }}
          >
            Cherin's Journey
          </h2>

          {/* Bio text */}
          <p className="font-serif" style={{
            fontFamily: "'Alice', 'Quicksand', serif",
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(249,241,231,0.6)',
            lineHeight: 1.75,
            maxWidth: '600px',
            marginBottom: '48px',
            fontStyle: 'italic',
          }}>
            A design thinker and creative problem solver — paragliding across three cities,
            crafting work that captures the essence of human-centered design philosophy.
          </p>

          {/* Divider */}
          <div style={{ height: '1px', background: 'rgba(249,241,231,0.12)', marginBottom: '36px' }} />

          {/* Waypoints */}
          <div ref={waypointsRef} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {WAYPOINTS.map((wp, i) => (
              <div
                key={wp.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '18px 0',
                  borderBottom: i < WAYPOINTS.length - 1 ? '1px solid rgba(249,241,231,0.1)' : 'none',
                  opacity: 0, // revealed by GSAP
                }}
              >
                {/* Accent dot + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: wp.accent,
                    boxShadow: `0 0 10px ${wp.accent}88`,
                  }} />
                  {i < WAYPOINTS.length - 1 && (
                    <div style={{ width: '1px', height: '40px', background: `linear-gradient(${wp.accent}44, transparent)` }} />
                  )}
                </div>

                {/* Tag */}
                <span className="font-mono" style={{
                  fontSize: '8px', letterSpacing: '0.3em',
                  color: wp.accent + 'aa',
                  textTransform: 'uppercase',
                  flexShrink: 0, width: '80px',
                }}>
                  {wp.tag}
                </span>

                {/* City name */}
                <span className="font-serif" style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
                  color: '#F9F1E7',
                  fontWeight: 700,
                  flex: 1,
                }}>
                  {wp.city}
                  <span style={{ fontSize: '0.55em', color: 'rgba(249,241,231,0.45)', fontWeight: 300, marginLeft: '10px', fontStyle: 'italic' }}>
                    {wp.country}
                  </span>
                </span>

                {/* Coords */}
                <span className="font-mono" style={{
                  fontSize: '10px', letterSpacing: '0.1em',
                  color: 'rgba(249,241,231,0.5)',
                  display: 'none', // hidden on small screens via media
                }}>
                  {wp.coords}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom skills strip */}
          <div style={{ marginTop: '40px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {['UX Design', 'Visual Storytelling', 'Interactive Prototypes', 'Data-Driven Design', 'Human-Centered'].map(skill => (
              <span key={skill} className="font-mono" style={{
                fontSize: '12px', letterSpacing: '0.25em',
                color: 'rgba(249,241,231,0.75)',
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(249,241,231,0.3)', flexShrink: 0 }} />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: '25vh',
        zIndex: 20,
        background: 'linear-gradient(to bottom, transparent 0%, #3A5B8A 100%)',
      }} />

      <style>{`
        @font-face {
          font-family: 'Colence';
          src: url('/assets/font/Colence-Regular.ttf') format('truetype');
        }
        .colence-font { font-family: 'Colence', serif; }
      `}</style>
    </section>
  );
};

// HUD corner bracket decoration
const Corner: React.FC<{ pos: string; mirror?: string }> = ({ pos, mirror }) => {
  const scaleX = mirror?.includes('x') ? -1 : 1;
  const scaleY = mirror?.includes('y') ? -1 : 1;
  return (
    <div
      className={`absolute ${pos} pointer-events-none`}
      style={{ zIndex: 5, transform: `scale(${scaleX}, ${scaleY})` }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M0 24 L0 0 L24 0" stroke="rgba(249,241,231,0.25)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
};

export default Introduction;
