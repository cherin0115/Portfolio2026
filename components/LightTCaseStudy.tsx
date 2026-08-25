import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LightTCaseStudyProps {
  onBack: () => void;
}

const FLOW = [
  { label: 'IN', count: '4,467' },
  { label: 'Intersection 10927', straight: '4,463', left: '2', right: '2' },
  { label: 'Intersection 10936', straight: '4,447', left: '2', right: '13' },
  { label: 'Intersection 10939', straight: '4,446', left: '--', right: '--' },
  { label: 'OUT', count: '4,446' },
];

const ANCHORS = [
  { id: 'overview', label: 'Overview' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'impact', label: 'Impact' },
  { id: 'process', label: 'Process' },
  { id: 'designs', label: 'Designs' },
  { id: 'learnings', label: 'Learnings' },
];

const PROBLEMS = [
  { n: '01', title: 'A number that stopped short', body: 'Planners saw a pass through percentage per intersection. It said something was wrong. It did not say what to change.' },
  { n: '02', title: 'A light interface for long sessions', body: 'Transport researchers and Hwaseong traffic officials read a map, several charts, and a table on one screen for as long as a question takes. The light UI was built for dipping in.' },
  { n: '03', title: 'Five layers, one map', body: 'Signals, school zones, crosswalks, bus stops, road geometry. Turn them all on and the map stops being readable.' },
  { n: '04', title: 'Two speeds of data', body: 'Traffic volume arrives live. Most of the rest is batched records, roughly a year accumulated then pulled. One panel is seconds old and the panel beside it covers months.' },
];

const DESIGNS = [
  { title: 'School zone buffers, Hwaseong deployment', caption: '300 metre buffers around every school, drawn over the signal cycle layer, so proximity and timing can be read together.', image: 'the yellow buffer field over the city' },
  { title: 'Layer controls', caption: 'Signals, incidents, CCTV, schools, bus stops. Toggles and per layer colour, so an operator can reduce the map to their current question.', image: 'the right hand layer panel' },
  { title: 'Signal cycle scale on a dark basemap', caption: '55 to 240 seconds, green through red, readable at city zoom.', image: 'the legend and the map together' },
  { title: 'Directional flow', caption: 'Straight, left, and right counts at every intersection in a signalized area.', image: 'the directional view' },
  { title: 'Published report', caption: "The system documented as KOTI's signal operation monitoring and analysis standard model.", image: 'report cover and feature spread' },
];

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const LightTCaseStudy: React.FC<LightTCaseStudyProps> = ({ onBack }) => {
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
          Light-T
        </h1>

        <p className="font-serif" style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: 'var(--muted)', lineHeight: 1.4, maxWidth: 560, margin: 0 }}>
          A traffic signal analysis dashboard that tells planners which direction is causing the backup, not just that there is one.
        </p>

        <div className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', marginTop: 20, letterSpacing: '0.03em' }}>
          2022 / Case study
        </div>

        <ImagePlaceholder label="Hwaseong deployment, full width" style={{ marginTop: 32 }} />
        <Caption>Hwaseong City deployment, 2024. School zone layer and map controls built in 2022.</Caption>

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
            Light-T is the Korea Transport Institute's signal operation monitoring and analysis
            standard model, deployed for Hwaseong City. The system already existed. I joined a 24
            week engagement to improve and extend it.
          </Body>
          <CardRow cards={[
            { label: '5 layers', desc: 'Map layers and spatial data I built' },
            { label: '300m', desc: 'School zone buffers drawn around every school' },
            { label: 'Standard', desc: 'Published by KOTI as a national standard model' },
          ]} />
        </section>

        <section id="contributions" style={sectionAnchorStyle}>
          <H2>Contributions</H2>
          <Body>
            Built the map layer system and the spatial data behind it: school zone extraction and
            buffers, crosswalk and bus stop layers, and operator controls over all of them.
          </Body>
          <Body>
            Unified address search with road ID and intersection ID lookup so one field resolves any
            of the three.
          </Body>
          <Body>
            Proposed converting the interface to dark, and proposed the design for it. The team
            adopted it across the product.
          </Body>
          <Body>
            Proposed replacing the pass through metric at the centre of the signal analysis view,
            then designed and built the directional flow that replaced it.
          </Body>
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

          <ProblemTag>Problem 02</ProblemTag>
          <H3>Move the interface to dark</H3>
          <Body>
            Watching how long these people sit with one screen, the light interface looked like the
            wrong default. I proposed converting it, and proposed the design rather than only
            raising the problem. The team took it up and we rolled the change across the product.
          </Body>
          <Body>
            The signal cycle layer is the clearest case. Cycle length runs 55 to 240 seconds, mapped
            to a green through red scale and drawn across the whole city. On a light basemap the mid
            range washed out. On dark, the full scale holds at city zoom, which is the zoom a planner
            starts from.
          </Body>
          <ImagePlaceholder label="the signal cycle legend and the dark map together" />

          <ProblemTag>Problem 01</ProblemTag>
          <H3>Show direction, not a total</H3>
          <Body>
            This was not a new feature request. It was an existing chart in a shipped product that I
            argued should be replaced.
          </Body>
          <Body>
            Before, a donut chart per intersection with one number in it. Left, right, and straight
            collapsed into a single figure, each intersection an island, and nothing a planner could
            act on.
          </Body>
          <Body>
            After, a directional flow across the whole signalized area. Vehicles enter at one end,
            move through each intersection, and exit at the other, and at every intersection the
            count splits into straight, left, and right.
          </Body>
          <FlowDiagram />
          <Body>
            A planner can now read how many vehicles took each direction, find which intersection in
            the chain is the constraint, and decide whether to extend or shorten a specific phase.
          </Body>
        </section>

        <section id="impact" style={sectionAnchorStyle}>
          <H2>Impact</H2>
          <CardRow cards={[
            { label: 'Standard model', desc: 'Published by KOTI as a national reference model' },
            { label: 'Hwaseong City', desc: 'Deployed and in use' },
            { label: 'Still running', desc: 'School zone layer and map controls live in the 2024 build' },
          ]} />
        </section>

        <section id="process" style={sectionAnchorStyle}>
          <H2>Process</H2>

          <ProblemTag>Problem 03</ProblemTag>
          <H3>The spatial data behind the map</H3>
          <Body>
            School zones did not exist as a layer. They existed as three separate government
            datasets: daycare centres, kindergartens, and elementary schools. I extracted those,
            resolved them to points, and drew a 300 metre buffer around each, so a planner can see
            which intersections sit inside a protected zone before touching the timing there.
          </Body>
          <Body>
            Same pattern for the rest. Crosswalk and bus stop positions came in as raw data and left
            as layers a planner could read against the signal view.
          </Body>
          <Body>
            I also unified search. Address lookup ran through the Daum API, but planners work in road
            IDs and intersection IDs too, and those were separate. One field now resolves any of the
            three.
          </Body>

          <ProblemTag>Also problem 03</ProblemTag>
          <H3>Giving operators control</H3>
          <Body>
            Five layers competing for one map is a legibility problem, not a data problem. I built on
            and off toggles and per layer colour controls. A planner looking at school zone safety
            turns off everything except schools and signals. A planner tracing a corridor keeps bus
            stops and drops the rest.
          </Body>
          <Body>
            Graph conditions also switch based on the selected location on the thematic map, so the
            charts follow the operator's attention instead of sitting apart from it.
          </Body>

          <ProblemTag>Problem 04</ProblemTag>
          <H3>Working inside the two speeds</H3>
          <Body>
            The product already made the analysis window an explicit choice: a planner picks a date
            and an hour band before anything is computed. Working inside that convention is what
            keeps the mixed latency legible, because the numbers on screen are never ambiguous about
            what period they describe.
          </Body>
        </section>

        <section id="designs" style={sectionAnchorStyle}>
          <H2>Designs</H2>
          {DESIGNS.map(d => (
            <div key={d.title} style={{ marginBottom: 40, maxWidth: 640 }}>
              <h3 style={{ fontSize: 16, color: 'var(--ink)', fontWeight: 600, margin: '0 0 6px' }}>{d.title}</h3>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: 'var(--ink)', margin: '0 0 14px' }}>{d.caption}</p>
              <ImagePlaceholder label={d.image} />
            </div>
          ))}
        </section>

        <section id="learnings" style={sectionAnchorStyle}>
          <H2>Learnings</H2>
          <Body>
            Two of the changes I am most attached to on this project were ones nobody asked for. The
            dark conversion came from watching how long these people sit with one screen. The
            directional view came from having built the data and seeing what the number was hiding.
            Both required arguing for a change inside a product that was not mine, which turned out
            to be the part of the work I want more of.
          </Body>
          <Body>
            The directional view tells a planner where to adjust timing. It does not tell them
            whether the adjustment worked. The next step was before and after measurement on
            intersections where a phase had been changed, and we did not get to it.
          </Body>
          <Body>
            I came into this as a design major and left it thinking of code as a drawing tool.
          </Body>
        </section>

        <button onClick={onBack} className="font-mono" style={{ ...backLinkStyle, marginTop: 40 }}>
          ← Back to work
        </button>
        </div>
      </div>

      <style>{`
        .case-study-panel p {
          font-family: 'Cantarell', sans-serif;
        }
        .case-study-panel h1, .case-study-panel h2, .case-study-panel h3 {
          font-family: 'Inconsolata', monospace;
        }
      `}</style>
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

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-mono" style={{ fontSize: 11, color: 'var(--faint)', lineHeight: 1.5, margin: '10px 0 0', maxWidth: 640 }}>
    {children}
  </p>
);

interface CardData {
  icon?: string;
  label: string;
  desc: string;
}

const CardRow: React.FC<{ cards: CardData[] }> = ({ cards }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, margin: '20px 0 8px' }}>
    {cards.map(c => (
      <div key={c.label} style={{ border: '1px solid var(--rule)', borderRadius: 2, padding: '16px 18px' }}>
        {c.icon && <div style={{ fontSize: 18, marginBottom: 8 }}>{c.icon}</div>}
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
      maxWidth: 640,
      margin: '0 auto',
      ...style,
    }}
  >
    <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--faint)', textTransform: 'uppercase' }}>
      Image pending
    </span>
    <span className="font-serif" style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--muted)', padding: '0 16px', textAlign: 'center' }}>
      {label}
    </span>
  </div>
);

const FlowDiagram: React.FC = () => (
  <div
    className="font-mono"
    style={{
      border: '1px solid var(--rule)',
      borderRadius: 2,
      padding: '20px 24px',
      margin: '8px auto 20px',
      maxWidth: 640,
    }}
  >
    {FLOW.map((row, i) => (
      <div key={row.label}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 12 }}>
          <span style={{ color: 'var(--ink)' }}>{row.label}</span>
          {'count' in row ? (
            <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{row.count}</span>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--faint)' }}>
              straight {row.straight}&nbsp;&nbsp;left {row.left}&nbsp;&nbsp;right {row.right}
            </span>
          )}
        </div>
        {i < FLOW.length - 1 && (
          <div style={{ width: 1, height: 14, background: 'var(--rule)', margin: '4px 0 4px 2px' }} />
        )}
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

export default LightTCaseStudy;
