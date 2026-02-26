import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface NavbarProps {
  visible?: boolean;
}

const NAV_LINKS = [
  { label: 'Projects', href: '#journey' },
  { label: 'About',    href: '#about'   },
  { label: 'Article',  href: '#article' },
];

const Navbar: React.FC<NavbarProps> = ({ visible = true }) => {
  const navRef     = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Only track scroll to switch background — navbar always stays visible
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Slide-in entrance on mount
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.set(nav, { y: -80, opacity: 0 });
    gsap.to(nav, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href === '#article') return; // placeholder
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 80,
        // Background transitions from transparent → glassmorphism on scroll
        background: scrolled
          ? 'rgba(26, 28, 52, 0.23'
          : 'linear-gradient(to bottom, rgba(7,9,30,0.6) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'background 0.5s ease, border-color 0.5s ease',
      }}
    >
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 clamp(20px, 4vw, 48px)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* ── LEFT: Logo + Name ──────────────────────────────────────── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          {/* Logo mark */}
          <LogoMark />

          {/* Name */}
          <span
            className="ui-serif"
            style={{
              fontSize: 'clamp(15px, 2vw, 25px)',
              color: '#ffffff',
              fontWeight: 300,
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            Cherin Blanton
          </span>
        </button>

        {/* ── RIGHT: Desktop nav links ───────────────────────────────── */}
        <div
          className="nav-desktop"
          style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px, 3vw, 48px)' }}
        >
          {NAV_LINKS.map(link => (
            <NavLink key={link.label} label={link.label} onClick={() => scrollTo(link.href)} />
          ))}
        </div>

        {/* ── RIGHT: Mobile hamburger ────────────────────────────────── */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            flexDirection: 'column', gap: '5px',
            background: 'none', border: 'none',
            cursor: 'pointer', padding: '4px',
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '1px', background: menuOpen ? 'transparent' : 'rgba(255,255,255,0.7)', transition: 'background 0.2s' }} />
          <span style={{ display: 'block', width: '22px', height: '1px', background: 'rgba(255,255,255,0.7)', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none', transition: 'transform 0.2s' }} />
          <span style={{ display: 'block', width: '22px', height: '1px', background: 'rgba(255,255,255,0.7)', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────────────── */}
      {menuOpen && (
        <div style={{
          background: 'rgba(26, 28, 52, 0.23)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '16px clamp(20px, 4vw, 48px) 24px',
        }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="font-mono"
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '11px', letterSpacing: '0.3em',
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'uppercase',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @font-face {
          font-family: 'Colence';
          src: url('/assets/font/Colence-Regular.ttf') format('truetype');
        }
        .colence-font { font-family: 'Colence', serif; }

        /* Show hamburger on mobile, hide desktop nav */
        @media (max-width: 640px) {
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

// ── Animated nav link with underline hover ────────────────────────────────
const NavLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  const lineRef = useRef<HTMLSpanElement>(null);

  const onEnter = () => gsap.to(lineRef.current, { scaleX: 1, duration: 0.3, ease: 'power2.out' });
  const onLeave = () => gsap.to(lineRef.current, { scaleX: 0, duration: 0.25, ease: 'power2.in' });

  return (
    <button
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="font-mono"
      style={{
        position: 'relative',
        background: 'none', border: 'none', cursor: 'pointer',
        padding: '4px 0',
        fontSize: '10px',
        letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.55)',
        textTransform: 'uppercase',
        transition: 'color 0.2s ease',
      }}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      {label}
      {/* Underline — scales from left on hover */}
      <span
        ref={lineRef}
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '1px',
          background: 'rgba(255,255,255,0.5)',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
        }}
      />
    </button>
  );
};

// ── Logo mark — stylised paraglider chevron ───────────────────────────────
const LogoMark: React.FC = () => (
  <svg
    width="28" height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    {/* Outer circle */}
    <circle cx="14" cy="14" r="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    {/* Chevron / wing shape */}
    <path
      d="M6 16 L14 9 L22 16"
      stroke="rgba(255,255,255,0.85)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Small pilot dot */}
    <circle cx="14" cy="17.5" r="1.5" fill="rgba(255,255,255,0.6)" />
  </svg>
);

export default Navbar;
