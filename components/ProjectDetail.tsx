import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Project } from '../types';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

// Map project city prefix → accent color
const ACCENT: Record<string, string> = {
  VA: '#58aa5a',
  KR: '#4480ff',
  LA: '#fe6600',
};

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef    = useRef<HTMLDivElement>(null);
  const bodyRef      = useRef<HTMLDivElement>(null);

  const accent = ACCENT[project.id.slice(0, 2)] ?? '#58aa5a';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.35 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-y-auto"
      style={{
        zIndex: 10000,
        background: 'linear-gradient(180deg, #07091e 0%, #0c0c24 100%)',
        color: 'white',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed font-mono"
        style={{
          top: '28px', right: '32px',
          zIndex: 10001,
          width: '44px', height: '44px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        ×
      </button>

      {/* Precision grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
        zIndex: 1,
      }} />

      {/* Accent edge glow */}
      <div className="fixed top-0 left-0 bottom-0 pointer-events-none" style={{
        width: '3px',
        background: `linear-gradient(to bottom, ${accent}, transparent)`,
        opacity: 0.7,
        zIndex: 2,
      }} />

      <div className="relative max-w-6xl mx-auto" style={{ padding: 'clamp(80px, 10vh, 120px) clamp(24px, 6vw, 64px) 80px', zIndex: 10 }}>

        {/* Header */}
        <header ref={headerRef} style={{ marginBottom: '64px', opacity: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <span
              className="font-mono"
              style={{
                fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase',
                padding: '5px 12px',
                border: `1px solid ${accent}55`,
                borderRadius: '6px',
                color: accent,
              }}
            >
              {project.id}
            </span>
            <span style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span className="font-mono" style={{ fontSize: '8px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
              {project.category}
            </span>
          </div>

          <h1
            className="colence-font"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.0,
              color: '#ffffff',
              marginBottom: '24px',
            }}
          >
            {project.title}
          </h1>

          <p className="font-serif" style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: 'rgba(255,255,255,0.5)',
            fontStyle: 'italic',
            maxWidth: '600px',
            lineHeight: 1.7,
          }}>
            {project.description}
          </p>
        </header>

        {/* Body */}
        <div ref={bodyRef} style={{ opacity: 0 }}>

          {/* Thumbnail + meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '32px', marginBottom: '56px', alignItems: 'start' }}>
            <div style={{
              aspectRatio: '16/9',
              borderRadius: '16px',
              overflow: 'hidden',
              border: `1px solid ${accent}22`,
              boxShadow: `0 0 60px ${accent}18, 0 24px 48px rgba(0,0,0,0.5)`,
              position: 'relative',
            }}>
              <img
                src={project.thumbnail}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${accent}11 0%, transparent 60%)`,
              }} />
            </div>

            {/* Meta sidebar */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: '24px 20px',
            }}>
              <p className="font-mono" style={{ fontSize: '7px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '10px' }}>
                TECH STACK
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {project.tags.map(tag => (
                  <span key={tag} className="font-mono" style={{
                    fontSize: '8px', letterSpacing: '0.15em',
                    padding: '4px 10px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: '6px',
                    color: 'rgba(255,255,255,0.55)',
                    textTransform: 'uppercase',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />

              <p className="font-mono" style={{ fontSize: '7px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '6px' }}>
                YEAR
              </p>
              <p className="font-serif" style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '18px' }}>2024</p>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '16px 0' }} />

              <p className="font-mono" style={{ fontSize: '7px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', marginBottom: '8px' }}>
                STATUS
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: accent,
                  boxShadow: `0 0 8px ${accent}`,
                  animation: 'hud-blink 2s ease-in-out infinite',
                }} />
                <span className="font-mono" style={{ fontSize: '9px', color: accent, letterSpacing: '0.1em' }}>
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Case study columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '64px' }}>
            {[
              { title: 'Problem Statement', body: 'Urban environments face unprecedented challenges in sustainability and efficiency. This project focuses on the intersection of human-centric design and scalable environmental monitoring — leveraging real-time data nodes to create interfaces that speak to both city planners and citizens.' },
              { title: 'The Solution', body: 'The final iteration resulted in a 40% increase in data accessibility across municipal departments. The design language utilizes high-contrast visual cues and intuitive spatial mapping to reduce cognitive load during critical decision-making phases.' },
            ].map(({ title, body }) => (
              <div key={title} style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: `linear-gradient(90deg, ${accent}66, transparent)`,
                }} />
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700, marginBottom: '14px' }}>
                  {title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', lineHeight: 1.75 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '48px', textAlign: 'center' }}>
            <p className="font-mono" style={{
              fontSize: '8px', letterSpacing: '0.4em',
              color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}>
              NEXT JOURNEY STOP
            </p>
            <button
              onClick={onClose}
              className="font-serif"
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.65)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(255,255,255,0.15)',
              }}
            >
              Continue Flight →
            </button>
          </footer>
        </div>
      </div>

      <style>{`
        @font-face {
          font-family: 'Colence';
          src: url('/assets/font/Colence-Regular.ttf') format('truetype');
        }
        .colence-font { font-family: 'Colence', serif; }
        @keyframes hud-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetail;
