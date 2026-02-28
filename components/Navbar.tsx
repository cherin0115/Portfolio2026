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
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.set(nav, { y: -80, opacity: 0 });
    gsap.to(nav, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href === '#article') return;
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
        top: '16px',
        left: '16px',
        right: '16px',
        zIndex: 100,
        maxWidth: '1360px',
        margin: '0 auto',
        borderRadius: scrolled ? '100px' : '18px',
        background: scrolled 
          ? 'rgba(60, 60, 65, 0.24)' 
          : 'linear-gradient(to top, rgba(7, 9, 30, 0.3) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
        border: scrolled ? '1px solid rgba(110, 93, 155, 0.12)' : '1px solid transparent',
        transition: 'all 0.6s cubic-bezier(0.2, 1, 0.2, 1)',
      }}
    >
      <div style={{
        padding: '0 clamp(20px, 4vw, 40px)',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* ── LEFT: Logo + Name (Walter Turncoat 적용) ── */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            display: 'flex', alignItems: 'center', gap: '14px',
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <LogoMark />
          <span
            className="walter-font"
            style={{
              fontSize: 'clamp(14px, 2.8vw, 26px)', 
              color: '#ffffff',
              fontWeight: 400,
              letterSpacing: '0.02em', // 손글씨는 약간의 간격이 있어야 자연스럽습니다
              lineHeight: 1,
              // 미세하게 회전시켜 손으로 쓴 듯한 역동성을 줍니다
              transform: 'rotate(-1deg)', 
              textShadow: '0 2px 10px rgba(255,255,255,0.1)',
            }}
          >
            Cherin Blanton
          </span>
        </button>

        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(24px, 3vw, 48px)' }}>
          {NAV_LINKS.map(link => (
            <NavLink key={link.label} label={link.label} onClick={() => scrollTo(link.href)} />
          ))}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ display: 'block', width: '22px', height: '1px', background: 'white' }} />
          <span style={{ display: 'block', width: '22px', height: '1px', background: 'white' }} />
          <span style={{ display: 'block', width: '22px', height: '1px', background: 'white' }} />
        </button>
      </div>

      <style>{`
        /* 구글 폰트 임포트 (가장 확실한 방법) */
        @import url('https://fonts.googleapis.com/css2?family=Walter+Turncoat&display=swap');

        .walter-font { 
          font-family: "Walter Turncoat", cursive; 
          -webkit-font-smoothing: antialiased;
        }

        @media (max-width: 640px) {
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

// ── 하위 컴포넌트 (NavLink & LogoMark) ──

const NavLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  const lineRef = useRef<HTMLSpanElement>(null);
  const onEnter = () => gsap.to(lineRef.current, { scaleX: 1, duration: 0.3 });
  const onLeave = () => gsap.to(lineRef.current, { scaleX: 0, duration: 0.25 });

  return (
    <button
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position: 'relative', background: 'none', border: 'none', cursor: 'pointer',
        padding: '4px 0', fontSize: '10px', letterSpacing: '0.3em',
        color: 'rgba(255, 255, 255, 0.96)', textTransform: 'uppercase', fontFamily: 'sans-serif',
      }}
    >
      {label}
      <span ref={lineRef} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.5)', transform: 'scaleX(0)', transformOrigin: 'left center' }} />
    </button>
  );
};

const LogoMark: React.FC = () => (
  <svg
    width="30" height="30"
    viewBox="0 0 32 32" // 구름 모양을 위해 뷰박스를 약간 키웠습니다
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0, marginTop: '2px' }} // 폰트와 베이스라인을 맞추기 위해 미세 조정
  >
    
    
    {/* ── 핵심: 귀여운 뭉게구름 모양 ── */}
    {/* 펜으로 스윽 그은 듯한 불규칙하고 동글동글한 타원형들을 조합했습니다 */}
    <path 
      d="M12 12 C 10.5 10.5, 7.5 10.5, 6 12 C 4.5 13.5, 4.5 16.5, 6 18 M6 18 C 7 19.5, 9.5 21, 12 20 M12 20 C 14 21.5, 18 21.5, 20 20 M20 20 C 22.5 21, 25 19.5, 26 18 M26 18 C 27.5 16.5, 27.5 13.5, 26 12 C 24.5 10.5, 21.5 10.5, 20 12 M20 12 C 18 10.5, 14 10.5, 12 12" 
      stroke="rgba(255,255,255,0.7)" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />

  </svg>
);

export default Navbar;