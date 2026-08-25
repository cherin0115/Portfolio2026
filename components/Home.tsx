import React, { useEffect, useState } from 'react';
import BandsCanvas, { BandsMode } from './BandsCanvas';
import WorkView from './WorkView';
import LightTCaseStudy from './LightTCaseStudy';
import ScoutyCaseStudy from './ScoutyCaseStudy';
import BittiCaseStudy from './BittiCaseStudy';
import ContextualHUDCaseStudy from './ContextualHUDCaseStudy';
import DuoEchoCaseStudy from './DuoEchoCaseStudy';

const MODE_KEY = 'bands-mode';

type View = 'home' | 'work' | 'light-t' | 'scouty' | 'bitti' | 'contextual-hud' | 'duoEcho';

const CASE_STUDY_VIEWS: View[] = ['light-t', 'scouty', 'bitti', 'contextual-hud', 'duoEcho'];

const NAV_ITEMS: { n: number; label: string; view?: View }[] = [
  { n: 1, label: 'Home', view: 'home' },
  { n: 2, label: 'Work', view: 'work' },
  { n: 3, label: 'Notes' },
  { n: 4, label: 'Info' },
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
  return 'home';
}

const Home: React.FC = () => {
  const [mode, setMode] = useState<BandsMode>('light');
  const [view, setView] = useState<View>('home');

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
    window.location.hash = v === 'home' ? '#home' : CASE_STUDY_VIEWS.includes(v) ? `#work/${v}` : '#work';
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
      <BandsCanvas mode={mode} dimmed={CASE_STUDY_VIEWS.includes(view)} />

      {/* Mode toggle — small, unobtrusive, top-right */}
      <div
        className="font-mono"
        style={{ position: 'fixed', top: 20, right: 24, zIndex: 2, fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 8, alignItems: 'center' }}
      >
        <button onClick={() => setModePersist('light')} style={modeBtnStyle(mode === 'light')}>Light</button>
        <span style={{ color: 'var(--rule)' }}>/</span>
        <button onClick={() => setModePersist('mono')} style={modeBtnStyle(mode === 'mono')}>Mono</button>
      </div>

      <div className={CASE_STUDY_VIEWS.includes(view) ? 'home-layout home-layout--split' : 'home-layout'}>
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
              <div className="font-mono" style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink)' }}>
                {BIO_LINES.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            </div>
          )}

          {view === 'work' && <WorkView onOpenProject={(id) => CASE_STUDY_VIEWS.includes(id as View) && goTo(id as View)} />}
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
