import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface BittiCaseStudyProps {
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
  { n: '01', title: 'The list became the task', body: 'V1 followed the traditional model: capture everything, organize by category, build a detailed list. In testing it backfired. Everyone spent more time organizing the list than working. The app created procrastination, not clarity.' },
  { n: '02', title: 'High activation energy', body: 'When a task feels shapeless or too large, the mental cost of the first step leads to avoidance. Seeing 8 tasks did not make starting easier, it made it impossible.' },
  { n: '03', title: 'The market organizes "what," not "how"', body: 'A competitor audit showed the leaders excel at capturing and scheduling tasks, but none guide the user on how to actually begin. The starting problem was unsolved.' },
];

const SOLUTIONS = [
  { tag: 'Problem 01, 02', title: 'Remove the list entirely', body: 'The pivot to V2 required one insight: delete the list. The app now opens to one task and three steps, nothing else visible. This single architecture shift changed everything downstream.' },
  { tag: 'Problem 02', title: 'Exactly three steps', body: 'AI decomposes any goal into three steps of 15 to 25 minutes each. In testing, three felt "already half done." More than three brought the anxiety back. The constraint is not a limitation, it is a psychological intervention.' },
  { tag: 'Problem 01', title: 'AI as co-thinker, not boss', body: 'During processing, Bitti runs a breathing animation that turns latency into a shared thinking moment. Swipe-to-complete replaces checkboxes, so finishing a step feels physical and satisfying.' },
];

const PROCESS = [
  { title: 'Test with five people, watch for friction', body: 'I sat with five people individually, mapped every hesitation and wrong tap, and asked afterward what they expected to happen. Three insights drove every V2 decision: the list itself became a task, three steps felt approachable where more did not, and people wanted the AI to think with them, not command them.' },
  { title: 'The constraint lives in the prompt', body: 'Getting "exactly three steps" to work reliably was not a UI decision, it was prompt engineering. "Break this into steps" returned 4 to 6 steps with inconsistent structure. The fix was a strict JSON schema: exactly three typed objects, each with a title, detail, and duration. Output became reliable enough to drive the interface directly, with no cleanup layer.' },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const BittiCaseStudy: React.FC<BittiCaseStudyProps> = ({ onBack }) => {
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
          Bitti
        </h1>

        <p className="font-serif" style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: 'var(--muted)', lineHeight: 1.4, maxWidth: 560, margin: 0 }}>
          Bit by bit. An AI-powered productivity app that dissolves task paralysis by breaking any
          goal into three concrete, time-bounded steps.
        </p>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 20, letterSpacing: '0.03em' }}>
          2025 / Case study · Live at{' '}
          <a href="https://bitti-app.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--faint)' }}>
            bitti-app.vercel.app
          </a>
        </div>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6, letterSpacing: '0.03em' }}>
          Role: UX/UI Designer · Duration: 4 weeks · Stack: React, Anthropic API, Framer
        </div>

        <VideoEmbed vimeoId="1172545948" style={{ marginTop: 32 }} />

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
            Bitti is built on one research-backed premise: the hardest part of any task is knowing
            where to start. Not motivation, not time, the invisible first step. I designed and built
            it around a single design constraint, exactly three steps, and rebuilt it end to end
            after V1's list-based model failed in testing.
          </Body>
          <CardRow cards={[
            { label: '#1', desc: 'VCU class favorite' },
            { label: '9/10', desc: 'ready-to-act score' },
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

          <ProblemTag>{SOLUTIONS[0].tag}</ProblemTag>
          <H3>{SOLUTIONS[0].title}</H3>
          <Body>{SOLUTIONS[0].body}</Body>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 640, margin: '4px auto 20px' }}>
            <ImagePlaceholder label={'V1 list view — "Make a Portfolio" with five stacked steps. Before.'} />
            <ImagePlaceholder label={'V2 focus view — one bit at a time. "Just this one." After.'} />
          </div>

          {SOLUTIONS.slice(1).map(s => (
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
            Bitti was voted #1 class favorite at VCU Brandcenter, validating that a warmer, calmer
            interface reduces productivity anxiety. The strict JSON prompt schema returned clean,
            parseable steps with virtually no malformed responses, so the output could drive the
            interface directly. Users rated the AI-generated steps 9 out of 10 for being immediately
            executable without further thought.
          </Body>
          <Quote attribution="Participant C, V2 test">
            Three steps felt like the task was already half done before I started.
          </Quote>
          <div className="font-mono" style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            <a href="https://bitti-app.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--faint)' }}>
              → Try it live — bitti-app.vercel.app
            </a>
            <a href="https://cherinblanton.com/bittiDesignSystem.html" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--faint)' }}>
              → View full design system — cherinblanton.com/bittiDesignSystem.html
            </a>
          </div>
        </section>

        <section id="learnings" style={sectionAnchorStyle}>
          <H2>Learnings</H2>
          <Body>
            The biggest lesson was about removal. V1 was overbuilt, and the pivot meant deleting
            weeks of work. It was the hardest decision and the most necessary one.
          </Body>
          <Body>
            The second: constraints are products. The three-step rule is not a feature, it is the
            intervention that shaped every downstream interaction.
          </Body>
          <Body>
            The list was the problem. Removing it was the design. Everything else was execution.
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

const Quote: React.FC<{ children: React.ReactNode; attribution?: string }> = ({ children, attribution }) => (
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
    {attribution && (
      <footer className="font-mono" style={{ fontSize: 11, fontStyle: 'normal', color: 'var(--faint)', marginTop: 8 }}>
        — {attribution}
      </footer>
    )}
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

const ImagePlaceholder: React.FC<{ label: string; style?: React.CSSProperties }> = ({ label, style }) => (
  <div
    style={{
      aspectRatio: '16 / 9',
      border: '1px dashed var(--rule)',
      borderRadius: 2,
      background: 'rgba(143,168,240,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '0 12px',
      ...style,
    }}
  >
    <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--faint)', textTransform: 'uppercase' }}>
      Image pending
    </span>
    <span className="font-serif" style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--muted)', textAlign: 'center' }}>
      {label}
    </span>
  </div>
);

const VideoEmbed: React.FC<{ vimeoId: string; style?: React.CSSProperties }> = ({ vimeoId, style }) => (
  <div
    style={{
      position: 'relative',
      aspectRatio: '16 / 9',
      maxWidth: 640,
      margin: '0 auto',
      borderRadius: 2,
      overflow: 'hidden',
      background: 'var(--rule)',
      ...style,
    }}
  >
    <iframe
      src={`https://player.vimeo.com/video/${vimeoId}`}
      title="Bitti demo"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
    />
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

export default BittiCaseStudy;
