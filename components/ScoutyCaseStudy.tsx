import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ScoutyCaseStudyProps {
  onBack: () => void;
}

const ANCHORS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'process', label: 'Process' },
  { id: 'impact', label: 'Impact' },
  { id: 'learnings', label: 'Learnings' },
];

const PROBLEMS = [
  { n: '01', title: 'Scattered, then overwhelming', body: 'Camps live across dozens of sites. Gather them and the new problem is 90+ near-identical cards, with nothing telling a parent where to start.' },
  { n: '02', title: 'A map that was just decoration', body: 'It sat in a corner, scrolled away, and every pin looked the same. Next to the list, not connected to it.' },
  { n: '03', title: 'Location buried at the bottom', body: '"Near me" is a parent\'s first question. It was the last filter in a modal, and entering a zip changed nothing.' },
  { n: '04', title: 'Two kids, one dropoff', body: 'The hardest version of the problem, and the biggest payoff. No tool matched multiple ages at once.' },
];

const SOLUTIONS = [
  { tag: 'Problem 02, 03', title: 'Make the map a tool, not a panel', body: 'Sticky so it never scrolls away. Zip entry zooms the map, draws a radius, and puts a distance on every card. One input moves the list and the map together.' },
  { tag: 'Problem 01, 03', title: 'Lift the three real questions to the top', body: 'Age, weeks, distance, pulled out of a buried filter panel into a search pill, the way Airbnb surfaces where, when, and who.' },
  { tag: 'Problem 04', title: 'Match multiple kids without collapsing the list', body: 'OR logic under the hood, labeled with intent: every card shows "Both kids ✓" or "Age 9 only," with a count that explains the number in place.' },
];

const PROCESS = [
  { title: 'Validate before building', body: 'I tested demand with fake doors before writing real features. A recommendation section shipped behind a 50/50 feature flag to measure whether the "recommended" label itself changed behavior, using outbound clicks, not clicks, as the success metric.' },
  { title: 'Direct the AI, verify the output', body: 'Claude Code wrote the codebase, set up analytics, and handled deployment while I owned every product decision. The real skill was knowing what to verify: I caught several silent failures where a feature looked fine but was not working, including a flag stuck off for every user despite correct assignment.' },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const ScoutyCaseStudy: React.FC<ScoutyCaseStudyProps> = ({ onBack }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>(ANCHORS[0].id);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    const sections = ANCHORS.map(a => document.getElementById(a.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
      <div
        className="case-study-panel"
        style={{
          position: 'relative',
          width: 'min(94vw, 820px)',
          margin: '0 auto',
          padding: '16px clamp(20px, 5vw, 48px) 48px',
          boxSizing: 'border-box',
          background: 'var(--panel)',
          borderRadius: 2,
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <button onClick={onBack} className="font-mono" style={backLinkStyle}>
          ← Work
        </button>

        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--ink)', lineHeight: 1.05, margin: '28px 0 18px', fontWeight: 500 }}>
          Scouty
        </h1>

        <p className="font-serif" style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: 'var(--muted)', lineHeight: 1.4, maxWidth: 560, margin: 0 }}>
          A summer camp finder that turns scattered listings into one map parents can actually plan
          from. Designed, built, and shipped to a real community.
        </p>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 20, letterSpacing: '0.03em' }}>
          2026 / Case study · Live at{' '}
          <a
            href="https://scouty-beta.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--faint)' }}
          >
            scouty-beta.vercel.app
          </a>
        </div>

        <nav
          className="font-mono"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 3,
            background: 'var(--panel)',
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 18,
            overflowX: 'auto',
            padding: '18px 0',
            marginTop: 40,
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          {ANCHORS.map(a => (
            <button key={a.id} onClick={() => scrollToSection(a.id)} style={anchorLinkStyle(a.id === activeSection)}>
              {a.label}
            </button>
          ))}
        </nav>

        <section id="overview" style={sectionAnchorStyle}>
          <H2>Overview</H2>
          <Body>
            Scouty is a summer camp finder for Richmond, VA, built with another senior product
            designer. It started from a personal problem: new to the city, we had no idea where to
            start with summer camp. I designed it, built it with Claude Code as a directed
            collaborator, and launched it into local parenting groups to test against real demand.
          </Body>
          <CardRow cards={[
            { label: '90+', desc: 'camps in one place' },
            { label: '50+', desc: 'parent comments within hours of launch' },
            { label: '0 to 1', desc: 'designed, built, and deployed' },
          ]} />
        </section>

        <section id="problem" style={sectionAnchorStyle}>
          <H2>Problem</H2>
          {PROBLEMS.map(p => (
            <div key={p.n} style={{ marginBottom: 20, maxWidth: 640 }}>
              <div style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600, marginBottom: 4 }}>
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginRight: 10 }}>{p.n}</span>
                {p.title}
              </div>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink)', margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </section>

        <section id="solution" style={sectionAnchorStyle}>
          <H2>Solution</H2>
          {SOLUTIONS.map(s => (
            <div key={s.title}>
              <ProblemTag>{s.tag}</ProblemTag>
              <H3>{s.title}</H3>
              <Body>{s.body}</Body>
            </div>
          ))}
        </section>

        <section id="process" style={sectionAnchorStyle}>
          <H2>Process</H2>
          {PROCESS.map(p => (
            <div key={p.title}>
              <H3>{p.title}</H3>
              <Body>{p.body}</Body>
            </div>
          ))}
        </section>

        <section id="impact" style={sectionAnchorStyle}>
          <H2>Impact</H2>
          <Body>
            I launched Scouty in local parenting groups and watched what parents did with it. Within
            hours, dozens were using it and telling us what was missing.
          </Body>
          <Quote>
            So badly needed. The resources out there never list the price, and the distance feature
            is top notch.
          </Quote>
          <Quote>
            The biggest pain point is knowing which camps are off the table due to hours. I end up
            going to each website individually every year.
          </Quote>
          <Body>
            The same two requests surfaced over and over: price and hours. That repetition reset the
            next priority on real demand, not instinct. I had built a recommendation feature on a
            hypothesis; parents were asking, unprompted, for something else.
          </Body>
        </section>

        <section id="learnings" style={sectionAnchorStyle}>
          <H2>Learnings</H2>
          <Body>
            A live launch surfaces demand you cannot reach from inside your own head. I had tested my
            hypothesis; the community handed me theirs. The fastest way to find the real priority was
            to ship and listen.
          </Body>
          <Body>
            Full launch planned for January 2027, when Richmond camp registration opens.
          </Body>
          <Body>
            I came into this as a product designer and left it treating deployment as part of design.
          </Body>
        </section>

        <button onClick={onBack} className="font-mono" style={{ ...backLinkStyle, marginTop: 40 }}>
          ← Back to work
        </button>
        </div>
      </div>
    </div>
  );
};

const sectionAnchorStyle: React.CSSProperties = { scrollMarginTop: 76, paddingTop: 40 };

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-serif" style={{ fontSize: 'clamp(22px, 2.8vw, 28px)', color: 'var(--ink)', fontWeight: 500, margin: '0 0 18px' }}>
    {children}
  </h2>
);

const H3: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600, margin: '4px 0 12px' }}>
    {children}
  </h3>
);

const ProblemTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', letterSpacing: '0.03em', marginTop: 32 }}>
    → {children}
  </div>
);

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink)', maxWidth: 640, margin: '0 0 16px' }}>
    {children}
  </p>
);

const Quote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <blockquote
    className="font-serif"
    style={{
      margin: '0 0 16px',
      padding: '2px 0 2px 18px',
      borderLeft: '2px solid var(--rule)',
      fontSize: 15,
      fontStyle: 'italic',
      color: 'var(--muted)',
      lineHeight: 1.6,
      maxWidth: 600,
    }}
  >
    {children}
  </blockquote>
);

interface CardData {
  label: string;
  desc: string;
}

const CardRow: React.FC<{ cards: CardData[] }> = ({ cards }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, margin: '20px 0 8px' }}>
    {cards.map(c => (
      <div key={c.label} style={{ border: '1px solid var(--rule)', borderRadius: 2, padding: '16px 18px' }}>
        <div className="font-mono" style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500, marginBottom: 6 }}>{c.label}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{c.desc}</div>
      </div>
    ))}
  </div>
);

const backLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 11,
  letterSpacing: '0.05em',
  color: 'var(--muted)',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
};

function anchorLinkStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 11,
    letterSpacing: '0.03em',
    color: active ? 'var(--ink)' : 'var(--muted)',
    background: 'none',
    border: 'none',
    borderBottom: active ? '1px solid var(--ink)' : '1px solid transparent',
    padding: '0 0 2px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  };
}

export default ScoutyCaseStudy;
