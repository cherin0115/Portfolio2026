import React, { useEffect, useRef, useState } from 'react';
import BandsCanvas, { BandsMode } from './BandsCanvas';
import WorkView from './WorkView';
import InfoView from './InfoView';
import LightTCaseStudy from './LightTCaseStudy';
import ScoutyCaseStudy from './ScoutyCaseStudy';
import BittiCaseStudy from './BittiCaseStudy';
import ContextualHUDCaseStudy from './ContextualHUDCaseStudy';
import DuoEchoCaseStudy from './DuoEchoCaseStudy';

const MODE_KEY = 'bands-mode';

type View = 'home' | 'work' | 'info' | 'light-t' | 'scouty' | 'bitti' | 'contextual-hud' | 'duoEcho';

const CASE_STUDY_VIEWS: View[] = ['light-t', 'scouty', 'bitti', 'contextual-hud', 'duoEcho'];

// Views whose panels are dense enough that the weave behind them should dim
// and hold still (DESIGN.md §6).
const DIM_VIEWS: View[] = [...CASE_STUDY_VIEWS, 'info'];

const NAV_ITEMS: { n: number; label: string; view?: View }[] = [
  { n: 1, label: 'Home', view: 'home' },
  { n: 2, label: 'Work', view: 'work' },
  { n: 3, label: 'Notes' },
  { n: 4, label: 'Info', view: 'info' },
  { n: 5, label: 'Contact' },
];

const BIO_LINES = [
  'Started in textiles in Los Angeles.',
  'Moved to maps in Seoul.',
  'Now I design interfaces for data that never',
  'stops moving. I build them too.',
];

function viewFromHash(): View {
  const match = CASE_STUDY_VIEWS.find(v => window.location.hash === `#work/${v}`);
  if (match) return match;
  if (window.location.hash === '#work') return 'work';
  if (window.location.hash === '#info') return 'info';
  return 'home';
}

const Home: React.FC = () => {
  const [mode, setMode] = useState<BandsMode>('light');
  const [view, setView] = useState<View>('home');
  const bioTextRef = useRef<HTMLDivElement>(null);
  const [bioRect, setBioRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // The canvas paints a low-density "quiet lane" behind the bio so the text
  // stays readable against the weave. Measure where the text actually sits
  // rather than guessing a fixed zone, so the patch always tracks it.
  useEffect(() => {
    const measure = () => {
      const el = bioTextRef.current;
      if (!el) { setBioRect(null); return; }
      const r = el.getBoundingClientRect();
      setBioRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    measure();
    window.addEventListener('resize', measure);
    const id = window.setTimeout(measure, 60); // catch layout settling after a font swap
    return () => {
      window.removeEventListener('resize', measure);
      window.clearTimeout(id);
    };
  }, [view, mode]);

  useEffect(() => {
    const saved = window.localStorage.getItem(MODE_KEY);
    if (saved === 'light' || saved === 'mono') setMode(saved);

    setView(viewFromHash());
    const onHashChange = () => {
      setView(viewFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const goTo = (v: View) => {
    window.location.hash = v === 'home' ? '#home' : CASE_STUDY_VIEWS.includes(v) ? `#work/${v}` : v === 'info' ? '#info' : '#work';
    setView(v);
    window.scrollTo(0, 0);
  };

  const setModePersist = (m: BandsMode) => {
    setMode(m);
    window.localStorage.setItem(MODE_KEY, m);
  };

  const monoFont = "'JetBrains Mono', monospace";
  const bodyFont = mode === 'mono' ? monoFont : "'Inter', sans-serif";

  return (
    <div id="home" style={{ position: 'relative', minHeight: '100vh', fontFamily: bodyFont, transition: 'font-family 200ms' }}>
      <BandsCanvas mode={mode} dimmed={DIM_VIEWS.includes(view)} bioRect={view === 'home' ? bioRect : null} />

      {/* Mode toggle — small, unobtrusive, top-right */}
      <div
        className="font-mono"
        style={{ position: 'fixed', top: 20, right: 24, zIndex: 3, fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <button onClick={() => setModePersist('light')} style={modeBtnStyle(mode === 'light')}>Light</button>
        <span style={{ color: 'var(--rule)' }}>/</span>
        <button onClick={() => setModePersist('mono')} style={modeBtnStyle(mode === 'mono')}>Mono</button>
      </div>

      <div
        className={view !== 'home' ? 'home-layout home-layout--split' : 'home-layout'}
        style={{ filter: mode === 'mono' ? 'grayscale(1)' : 'none', transition: 'filter 800ms ease' }}
      >
        {/* Top-left: wordmark + role line + nav panel */}
        <div style={{ padding: '28px 32px' }} className="home-topleft">
          <div style={{ fontFamily: "'Cherin Hand', cursive", fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--ink)', lineHeight: 1 }}>
            Cherin Blanton
          </div>
          <div className="font-mono" style={{ fontSize: 15, color: 'var(--muted)', marginTop: 8 }}>
            Product designer x Developer
          </div>

          <div
            style={{
              marginTop: 32,
              background: 'var(--panel)',
              display: 'inline-block',
              padding: '18px 22px',
              borderRadius: 2,
            }}
          >
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {NAV_ITEMS.map(item => (
                <li key={item.n} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span className="font-mono" style={{ fontSize: 11, color: 'var(--faint)' }}>{item.n}</span>
                  <span style={{ color: isNavActive(item.view, view) ? 'var(--bullet)' : 'var(--rule)' }}>&bull;</span>
                  {item.view ? (
                    <button onClick={() => goTo(item.view!)} style={navLinkStyle(isNavActive(item.view, view))}>{item.label}</button>
                  ) : (
                    <span style={{ fontSize: 14, color: 'var(--faint)' }}>{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="home-content">
          {view === 'home' && (
            <div className="home-bio" style={{ position: 'relative', zIndex: 1, textAlign: 'right', padding: '0 32px 40px' }}>
              <div ref={bioTextRef} className="font-mono" style={{ display: 'inline-block', fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>
                {BIO_LINES.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
          )}

          {view === 'work' && <WorkView onOpenProject={(id) => CASE_STUDY_VIEWS.includes(id as View) && goTo(id as View)} />}
          {view === 'info' && <InfoView />}
          {view === 'light-t' && <LightTCaseStudy onBack={() => goTo('work')} />}
          {view === 'scouty' && <ScoutyCaseStudy onBack={() => goTo('work')} />}
          {view === 'bitti' && <BittiCaseStudy onBack={() => goTo('work')} />}
          {view === 'contextual-hud' && <ContextualHUDCaseStudy onBack={() => goTo('work')} />}
          {view === 'duoEcho' && <DuoEchoCaseStudy onBack={() => goTo('work')} />}
        </div>
      </div>

      <style>{`
        .home-layout--split {
          display: flex;
          align-items: flex-start;
        }
        .home-layout--split .home-content {
          flex: 1 1 auto;
          min-width: 0;
          padding-top: 132px;
        }
        .home-layout--split .home-topleft {
          flex: 0 0 auto;
        }
        .home-bio {
          position: fixed;
          bottom: 0;
          right: 0;
          left: 0;
        }
        .home-topleft {
          position: sticky;
          top: 0;
          z-index: 2;
          /* On the plain (non-split) home layout this is a full-width block by
             default, so its transparent hit area stretched across the whole
             top strip and ate clicks meant for the mode toggle in the corner. */
          width: fit-content;
        }
        a:focus-visible, button:focus-visible {
          outline: 2px solid var(--bullet);
          outline-offset: 2px;
        }
        @media (max-width: 640px) {
          .home-layout--split {
            display: block;
          }
          .home-layout--split .home-content {
            padding-top: 0;
          }
          .home-bio {
            position: relative;
            text-align: left;
            padding: 24px 32px 40px;
          }
          .home-topleft {
            position: relative;
          }
        }
      `}</style>
    </div>
  );
};

function isNavActive(itemView: View | undefined, currentView: View): boolean {
  if (itemView === currentView) return true;
  return itemView === 'work' && CASE_STUDY_VIEWS.includes(currentView);
}

function navLinkStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 14,
    color: active ? 'var(--ink)' : 'var(--muted)',
    fontWeight: active ? 500 : 400,
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };
}

function modeBtnStyle(active: boolean): React.CSSProperties {
  return {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    color: active ? 'var(--ink)' : 'var(--faint)',
    fontWeight: active ? 500 : 400,
    fontFamily: 'inherit',
    fontSize: 11,
  };
}

export default Home;
