import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ContextualHUDCaseStudyProps {
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
  { n: '01', title: 'Screens are the distraction', body: 'Touchscreens and buried menus pull a driver’s attention off the road. Infotainment systems are the number one complaint in new vehicles, and removing physical buttons turned even a temperature change into a hazard.' },
  { n: '02', title: 'Bigger is not the answer', body: 'Mercedes, BMW, Genesis, and Audi are all building larger AR displays, some spanning the full windshield. They compete on size while sharing one flaw: they show too much at once.' },
  { n: '03', title: 'Attention has a hard limit', body: 'Research showed the number of items on a HUD matters more than their size or layout. A driver should see fewer than six pieces of information at a time, or the display becomes the thing they have to manage.' },
];

const PROCESS = [
  { title: 'Ground the design in human factors, not screen specs', body: 'Before designing anything, I researched the constraints that actually govern a HUD: a minimum 7-meter virtual image distance, a 10-degree field of view, and the under-six-items attention limit. Vertical layouts read more intuitively than horizontal ones. These findings set the rules the whole system had to obey.' },
  { title: 'Build it, break it, pivot fast', body: 'I prototyped in Unity VR, where spatial interaction made sense, then hit real blockers. A spatial UI that spawned three kilometers away, traced to world-space anchoring. A freeze on obstacle detection, traced to a null-reference exception. And a borrowed headset that locked developer mode one day before presenting, which forced a full architecture pivot: I re-mapped inputs to keyboard, switched to a WebGL browser build, and deployed globally via Vercel within 24 hours.' },
  { title: 'Direct the AI, define the problem', body: 'I pair-programmed with an LLM across 23 sessions to bridge design logic and C# implementation. The lesson: the quality of the solution depended entirely on how clearly I could define the problem. Writing precise prompts turned out to be the same skill as writing precise design specs.' },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const ContextualHUDCaseStudy: React.FC<ContextualHUDCaseStudyProps> = ({ onBack }) => {
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
          Contextual HUD
        </h1>

        <p className="font-serif" style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: 'var(--muted)', lineHeight: 1.4, maxWidth: 560, margin: 0 }}>
          A heads-up display for modern vehicles that shows only what you need, when you need it. It
          responds to driving context, ambient conditions, and cognitive load in real time.
        </p>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 20, letterSpacing: '0.03em' }}>
          2025 / Case study · Live demo at{' '}
          <a href="https://hud-voice.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--faint)' }}>
            hud-voice.vercel.app
          </a>
        </div>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 6, letterSpacing: '0.03em' }}>
          Role: UX Design, Research, Development · Focus: Automotive HUD · Stack: Unity, WebGL, Web
          Speech API, C#
        </div>

        <HeroPlaceholder style={{ marginTop: 32 }} />

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
            Every automaker is racing to build bigger in-car screens, and they all share the same
            problem: too much information in the driver's eyeline. I designed a HUD built on the
            opposite premise. Instead of a larger display, a smarter one that surfaces only what the
            moment requires. I researched the human factors, designed the system across three driving
            contexts, and built a working browser prototype, pivoting the whole architecture from VR
            to WebGL 24 hours before the final presentation.
          </Body>
          <CardRow cards={[
            { label: '4', desc: 'driving contexts researched' },
            { label: '3', desc: 'adaptive modes' },
            { label: '24 hrs', desc: 'VR to WebGL pivot' },
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

          <ProblemTag>Problem 01, 03</ProblemTag>
          <H3>Structure information by cognitive priority</H3>
          <Body>
            I mapped all HUD content to four hierarchical levels, from driving control to auxiliary
            functions, and to a grid of visual zones: critical alerts dead center, speed and
            navigation in the natural lower eyeline, secondary info in the periphery. Placement
            follows attention, not aesthetics.
          </Body>
          <ZoneArchitectureEmbed />

          <ProblemTag>Problem 02, 03</ProblemTag>
          <H3>Adapt to context instead of showing everything</H3>
          <Body>
            The HUD switches between three modes in real time. Highway mode keeps the display minimal
            and stable at speed. Urban mode prioritizes navigation and pedestrian alerts.
            Poor-visibility mode reduces brightness and strips blue light. Each mode shows a different
            hierarchy to match what the driver's brain needs right then.
          </Body>

          <ProblemTag>Problem 01</ProblemTag>
          <H3>Hands stay on the wheel</H3>
          <Body>
            Voice integration reads messages aloud and returns to the map by command, so the driver
            never reaches for a control to manage the display.
          </Body>
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
            The result is a working, browser-accessible prototype anyone can try without a headset,
            built from a real-time C# state machine that transitions between driving modes frame by
            frame, with hands-free voice control bridged from the Web Speech API into Unity. What
            began as a VR concept became a globally deployed simulation, and the 24-hour pivot proved
            the design logic held up independent of the platform it ran on.
          </Body>
          <div className="font-mono" style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            <a href="https://hud-voice.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--faint)' }}>
              → Launch the interactive demo — hud-voice.vercel.app
            </a>
            <span style={{ color: 'var(--faint)' }}>→ Full technical breakdown on Medium</span>
          </div>
        </section>

        <section id="learnings" style={sectionAnchorStyle}>
          <H2>Learnings</H2>
          <Body>
            Experiencing severe cybersickness during VR turns taught me that immersive interfaces
            demand empathy for human biology, not just sleek graphics. The vestibular system is a
            design constraint.
          </Body>
          <Body>
            And the pivot taught me that a design's logic should survive its platform. When the
            hardware failed, the thinking didn't, because the system was defined by cognitive
            priority, not by the device it happened to run on.
          </Body>
          <Body>
            The future of automotive UX is not bigger displays. It is smarter systems that get out of
            the driver's way.
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

const HeroPlaceholder: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div
    style={{
      position: 'relative',
      aspectRatio: '16 / 9',
      maxWidth: 640,
      margin: '0 auto',
      borderRadius: 2,
      border: '1px dashed var(--rule)',
      background: 'rgba(143,168,240,0.06)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      ...style,
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--faint)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
        Image pending
      </span>
      <span className="font-serif" style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', padding: '0 16px' }}>
        HUD in action, screenshot or GIF
      </span>
    </div>
    <a
      href="https://hud-voice.vercel.app"
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono"
      style={{
        fontSize: 11,
        letterSpacing: '0.05em',
        color: 'var(--ink)',
        background: 'var(--base)',
        border: '1px solid var(--ink)',
        borderRadius: 2,
        padding: '10px 18px',
        textDecoration: 'none',
      }}
    >
      Launch simulation →
    </a>
  </div>
);

const ZoneArchitectureEmbed: React.FC = () => (
  <div
    style={{
      width: '100%',
      maxWidth: 740,
      aspectRatio: '4 / 4',
      borderRadius: 2,
      overflow: 'hidden',
      border: '1px solid var(--rule)',
      margin: '4px auto 20px',
      background: '#0a0a0a',
    }}
  >
    <iframe
      src="/zone-architecture.html"
      title="Zone Architecture — drag HUD elements into their correct zone"
      style={{ width: '100%', height: '100%', border: 'none' }}
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

export default ContextualHUDCaseStudy;
