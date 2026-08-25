import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface DuoEchoCaseStudyProps {
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
  { n: '01', title: 'The language graveyard', body: "Every two weeks a language disappears. 40% of the world's 6,700 spoken languages are at risk, and 80 to 90% of heritage languages are lost by the third generation of immigrant families (UC Berkeley, 2021)." },
  { n: '02', title: 'Textbooks teach the wrong thing', body: "Standard apps teach formal, test-ready language, not grandma's dialect. The rhythms, slang, and intonations that carry a family's identity are exactly what no curriculum contains, and they vanish 3x faster than standardized languages (Max Planck, 2022)." },
  { n: '03', title: 'The loss is emotional, not just linguistic', body: '68% of second-generation immigrants struggle to express emotions with parents whose shared language is limited (UCLA, 2023). The gap is not vocabulary. It is connection.' },
];

const SOLUTIONS = [
  { tag: 'Problem 02', title: 'Capture the real dialect', body: 'With consent and on-device AI, DuoEcho listens to natural family conversations and extracts the rhythms, slang, and intonations no textbook contains. Privacy-first by design.' },
  { tag: 'Problem 01, 02', title: 'Generate a curriculum from real dialogue', body: "AI builds lesson modules from the family's own conversations, turning personal history into a living syllabus rather than a generic course." },
  { tag: 'Problem 03', title: 'Lower the emotional barrier', body: 'Context-aware prompts like "Ask your mom about her childhood recipe" reduce the friction of starting a deep conversation, so language practice and family connection become the same act.' },
];

const PROCESS = [
  { title: 'Ground every claim in research', body: 'Before designing, the team built the case on data from UCLA, UC Berkeley, Pew, the Max Planck Institute, and the WEF, spanning 37 countries and five continents. The statistics were not decoration. They defined who we were designing for and why the emotional stakes, not just the linguistic ones, had to drive the concept.' },
  { title: 'Design the method, then the flow', body: 'We shaped the experience into four steps a family could actually follow: record a real conversation, let AI build a lesson from it in seconds, practice with vocabulary from your own family life, and grow both fluency and closeness with each session. A storyboard tied the whole system back to a single emotional truth, framed through Duo struggling to speak with his own family.' },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const DuoEchoCaseStudy: React.FC<DuoEchoCaseStudyProps> = ({ onBack }) => {
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
          DuoEcho
        </h1>

        <p className="font-serif" style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: 'var(--muted)', lineHeight: 1.4, maxWidth: 560, margin: 0 }}>
          A feature proposal for Duolingo that turns real family conversations into personalized
          lessons, helping 2nd and 3rd generation immigrants learn their family's dialect and
          restore emotional bonds across generations.
        </p>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 20, letterSpacing: '0.03em' }}>
          2025 / Case study
        </div>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6, letterSpacing: '0.03em' }}>
          Role: UX Design, Art Direction · Duration: 8 weeks · Team of 4
        </div>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--bullet)', marginTop: 6, letterSpacing: '0.03em' }}>
          Young Ones ADC 2026, Design for Good Merit · FutureLion 2025 Shortlist
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
            Standard language apps teach test-ready formal phrases, not what your family actually
            says. DuoEcho is a proposed extension for Duolingo that records real family
            conversations, uses on-device AI to extract the dialect-specific words that matter
            most, and builds lessons from them. It turns personal history into a living
            curriculum, grounded in research spanning 37 countries.
          </Body>
          <CardRow cards={[
            { label: '80–90%', desc: 'of heritage languages lost by the third generation' },
            { label: '3', desc: 'pillars' },
            { label: '2', desc: 'international award recognitions' },
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
          <Body>A three-pillar system that teaches what your family actually says.</Body>
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
            DuoEcho was recognized with a Young Ones ADC 2026 Design for Good Merit and shortlisted
            at FutureLion 2025, validating the concept beyond the classroom. The research reframed
            it as more than a language app: a cultural resilience infrastructure.
          </Body>
          <Body>
            Intergenerational language transmission raises cultural resilience scores by 62%.
            Adolescents in families with a shared language report far lower rates of depression and
            anxiety. And every preserved conversation becomes a living archive future generations
            can learn from.
          </Body>
        </section>

        <section id="learnings" style={sectionAnchorStyle}>
          <H2>Learnings</H2>
          <Body>
            The strongest lesson was that the real problem was emotional, not linguistic. We
            started thinking about vocabulary and ended up designing for connection, because the
            data kept pointing to the same place: families were not just losing words, they were
            losing the ability to reach each other.
          </Body>
          <Body>
            Designing for a real product's ecosystem also meant every idea had to earn its place
            inside Duolingo's existing model, character, and constraints, not float as a standalone
            concept.
          </Body>
          <p className="font-serif" style={{ fontSize: 17, fontStyle: 'italic', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 600, margin: '20px 0 0' }}>
            We didn't set out to teach a language. We set out to keep a family talking.
          </p>
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

export default DuoEchoCaseStudy;
