import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ABOUT_PARAGRAPHS, ABOUT_LINKS, ABOUT_PHOTOS, AboutPhoto } from '../content';

const InfoView: React.FC = () => {
  const [active, setActive] = useState<AboutPhoto | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  // mailto: only does anything if the visitor has a default mail app
  // configured, which plenty of people don't. Copy the address too so the
  // link is never a dead end.
  const copyEmail = (href: string) => {
    const address = href.replace(/^mailto:/, '');
    navigator.clipboard?.writeText(address).then(() => {
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 1600);
    }).catch(() => {});
  };

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  // Pills enter from off the left edge and settle into the resting positions
  // set in content.ts, one after another rather than all at once.
  useEffect(() => {
    const pills = fieldRef.current?.querySelectorAll('.info-pill');
    if (!pills) return;
    gsap.fromTo(
      pills,
      { x: -280, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.05 }
    );
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex' }} className="info-layout">
      {/* Left ~70% — scattered photo pills, click to see about-me pictures */}
      <div ref={fieldRef} className="info-field" aria-label="Photos" style={{ position: 'relative', width: '40%', minHeight: '100vh' }}>
        {ABOUT_PHOTOS.map(p => (
          <button
            key={p.id}
            onClick={() => setActive(p)}
            aria-label={`View photo: ${p.caption}`}
            className="info-pill"
            style={{
              position: 'absolute',
              top: p.top,
              left: p.left,
              width: p.w,
              height: p.h,
              borderRadius: 999,
              background: p.color,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(20,20,26,0.10)',
            }}
          />
        ))}
      </div>

      {/* Right ~30% — content section, on the opaque panel */}
      <div
        className="case-study-panel info-content"
        style={{
          width: '60%',
          minHeight: '100vh',
          boxSizing: 'border-box',
          padding: '0 40px 48px 32px',
          borderLeft: '1px solid var(--rule)',
          background: 'var(--panel)',
        }}
      >
        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginBottom: 18 }}>
          About
        </div>
        {ABOUT_PARAGRAPHS.map((p, i) => (
          <p key={i} style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--ink)', margin: '0 0 18px' }}>
            {p}
          </p>
        ))}
        <p className="font-mono" style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--muted)', marginTop: 28 }}>
          Find me on{' '}
          {ABOUT_LINKS.map((l, i) => {
            const isLast = i === ABOUT_LINKS.length - 1;
            const isEmail = l.href.startsWith('mailto:');
            return (
              <React.Fragment key={l.label}>
                {i > 0 && (isLast ? ', or by ' : ', ')}
                <a
                  href={l.href}
                  target={isEmail ? undefined : '_blank'}
                  rel={isEmail ? undefined : 'noreferrer'}
                  onClick={isEmail ? () => copyEmail(l.href) : undefined}
                  className="info-contact-link"
                >
                  {isEmail && copiedEmail ? 'copied' : l.label}
                </a>
              </React.Fragment>
            );
          })}
          .
        </p>
      </div>

      {/* Lightbox — enlarges the clicked pill into a full "about me" picture */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={() => setActive(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 5,
            background: 'rgba(20,20,26,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(70vw, 480px)',
              height: 'min(52vw, 340px)',
              borderRadius: 24,
              background: active.color,
              boxShadow: '0 24px 60px rgba(20,20,26,0.35)',
              display: 'flex',
              alignItems: 'flex-end',
              cursor: 'default',
            }}
          >
            <span className="font-mono" style={{ fontSize: 12, color: 'rgba(20,20,26,0.6)', padding: 20 }}>
              {active.caption}
            </span>
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="font-mono"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                background: 'rgba(253,252,250,0.85)',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                fontSize: 13,
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <style>{`
        .info-pill {
          transition: box-shadow 200ms ease;
        }
        .info-pill:hover, .info-pill:focus-visible {
          box-shadow: 0 10px 24px rgba(20,20,26,0.18);
        }
        .info-contact-link {
          color: var(--ink);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .info-contact-link:hover, .info-contact-link:focus-visible {
          color: var(--bullet);
        }
        @media (max-width: 900px) {
          .info-layout { display: block; }
          .info-field { width: 100%; min-height: 60vh; }
          .info-content { width: 100%; min-height: 0; border-left: none; border-top: 1px solid var(--rule); padding: 24px 32px 40px; }
        }
      `}</style>
    </div>
  );
};

export default InfoView;
