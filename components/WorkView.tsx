import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { HOME_PROJECTS } from '../content';

const PREVIEW_SIZE = { w: 260, h: 160 };

interface WorkViewProps {
  onOpenProject?: (id: string) => void;
}

const WorkView: React.FC<WorkViewProps> = ({ onOpenProject }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const rows = listRef.current?.querySelectorAll('li');
    if (!rows) return;
    gsap.fromTo(
      rows,
      { x: 48, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.06 }
    );
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  const hovered = HOME_PROJECTS.find(p => p.id === hoverId);

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      {/* Soft circular glow behind the list, fading to transparent at the edge — no hard panel edge */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '5%',
          right: '2vw',
          transform: 'translateY(-50%)',
          width: 'min(85vw, 1300px)',
          height: 'min(85vw, 1300px)',
          maxHeight: '140vh',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 78%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: 'min(68vw, 900px)',
          marginLeft: 'auto',
          padding: '16px 48px 48px',
          boxSizing: 'border-box',
        }}
      >
        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', textAlign: 'right', marginBottom: 24 }}>
          {HOME_PROJECTS.length} projects
        </div>

        <ul
          ref={listRef}
          onMouseMove={handleMove}
          style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}
        >
          {HOME_PROJECTS.map(p => (
            <li
              key={p.id}
              onMouseEnter={() => setHoverId(p.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => p.hasCaseStudy && onOpenProject?.(p.id)}
              style={{
                textAlign: 'right',
                padding: '22px 0',
                borderBottom: '1px solid var(--rule)',
                cursor: p.hasCaseStudy ? 'pointer' : 'default',
              }}
            >
              <div style={{ fontSize: 'clamp(22px, 3.2vw, 34px)', color: 'var(--ink)', lineHeight: 1.15 }}>
                {p.title}
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6 }}>
                {p.year} / {p.role} / {p.client}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Hover preview — placeholder color block, left of cursor */}
      {hovered && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: pos.x - PREVIEW_SIZE.w - 28,
            top: Math.min(Math.max(pos.y - PREVIEW_SIZE.h / 2, 16), window.innerHeight - PREVIEW_SIZE.h - 16),
            width: PREVIEW_SIZE.w,
            height: PREVIEW_SIZE.h,
            background: hovered.color,
            borderRadius: 3,
            boxShadow: '0 12px 32px rgba(20,20,26,0.18)',
            zIndex: 3,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="font-mono" style={{ fontSize: 11, color: 'rgba(20,20,26,0.55)' }}>
            preview — {hovered.title}
          </span>
        </div>
      )}
    </div>
  );
};

export default WorkView;
