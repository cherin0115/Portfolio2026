// Data for the DESIGN.md Work + Notes pages. Kept separate from
// constants.ts so the old, unmounted cinematic components keep working
// unmodified off their own data.
//
// Not currently rendered anywhere: DESIGN.md now keeps the landing page bare
// and moves Work/Notes to their own pages (not yet built). This stays ready
// for when those pages exist.

export interface HomeProject {
  id: string;
  title: string;
  year: string;
  role: string;
  client: string;
  color: string; // project tag color, DESIGN.md §5
  hasCaseStudy?: boolean;
}

// TODO: only Light-T's metadata is confirmed (DESIGN.md §5, §14). The other
// three need real year/role/client before shipping.
export const HOME_PROJECTS: HomeProject[] = [
  { id: 'light-t',        title: 'Light-T',        year: '2022', role: 'Design & Dev', client: 'Korea Transport Institute', color: 'var(--warp)', hasCaseStudy: true   },
  { id: 'scouty',         title: 'Scouty',         year: '2025', role: 'Design & Dev',    client: 'Richmond, Virginia',                color: 'var(--weft)', hasCaseStudy: true   },
  { id: 'bitti',          title: 'Bitti',          year: '2025', role: 'Design & Dev',    client: 'Individual Study',                color: 'var(--bullet)', hasCaseStudy: true   },
  { id: 'contextual-hud', title: 'Contextual HUD', year: '2025', role: 'Design & Dev',    client: 'Individual Study',                color: 'var(--ink)', hasCaseStudy: true    },
  { id: 'duoEcho', title: 'DuoEcho', year: '2025', role: 'Design',    client: 'Team Project',                color: 'var(--ink)', hasCaseStudy: true    },
];

export interface HomeNote {
  date: string; // MM.DD
  title: string;
  tag: string;
}

// TODO: placeholder entries so the section never launches with fewer than
// six (DESIGN.md §11). Replace with real notes before shipping.
export const HOME_NOTES: HomeNote[] = [
  { date: '08.03', title: 'What disappears at each zoom level', tag: 'Light-T' },
  { date: '08.01', title: 'Links, August 2026',                 tag: 'Links'   },
  { date: '07.30', title: 'JSON I can trust',                   tag: 'Bitti'   },
  { date: '07.27', title: 'Placeholder note, replace me',       tag: 'Log'     },
  { date: '07.23', title: 'Placeholder note, replace me',       tag: 'Scouty'  },
  { date: '07.20', title: 'Placeholder note, replace me',       tag: 'Doc'     },
];

export const NOTES_SINCE = '08.2025';

// Info page (DESIGN.md §13). Right column, on the opaque panel.
export const ABOUT_PARAGRAPHS: string[] = [
  "Started with thread. Still making things that hold together.",
  "I've made things in three languages: fabric, code, and interfaces. Textile design in Los Angeles, then full-stack GIS development in Seoul building traffic systems for the Korea Transport Institute. Now I design experiences and build them myself, without a handoff.",
  "MS in Experience Design from VCU Brandcenter. Recognized by D&AD New Blood, Future Lions, and The One Club.",
  "AI is how I work now, not something I have opinions about from a distance. I build with the Anthropic API and keep design systems consistent with context files I write myself.",
  "Off the clock: breweries, museums, farms, vintage racks. I like places you have to dig through.",
];

export interface AboutLink {
  label: string;
  href: string;
}

export const ABOUT_LINKS: AboutLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cherin-kim-blanton/' },
  { label: 'GitHub', href: 'https://github.com/cherin0115' },
  { label: 'Medium', href: 'https://medium.com/@cherin0115' },
  { label: 'cherin0115@gmail.com', href: 'mailto:cherin0115@gmail.com' },
];

// Left column, scattered pill images (DESIGN.md §13 comp). Placeholder swatches
// stand in for real photos — swap `color` for a `src` per item once the
// photos exist. Positions are percentages of the pill field so the scatter
// holds its shape across viewport sizes. Every motif is the same flat,
// horizontal pill (rounded ends, no rotation) — width always well past
// height so none of them read as a circle. Kept to nine so the field stays
// legible now that the pill column is narrower than the content column.
export interface AboutPhoto {
  id: string;
  caption: string;
  color: string;
  top: string;
  left: string;
  w: number;
  h: number;
}

export const ABOUT_PHOTOS: AboutPhoto[] = [
  { id: 'p1', caption: 'Los Angeles — textile studio',      color: 'var(--weft)',                                          top: '4%',  left: '8%',  w: 108, h: 32 },
  { id: 'p2', caption: 'Seoul — subway map study',           color: 'var(--warp)',                                          top: '14%', left: '46%', w: 96,  h: 30 },
  { id: 'p3', caption: 'Hwaseong traffic platform, on-site', color: 'var(--weft)',                                           top: '26%', left: '14%', w: 100, h: 30 },
  { id: 'p4', caption: 'VCU Brandcenter, studio wall',       color: 'var(--weft)',                                          top: '36%', left: '50%', w: 90,  h: 30 },
  { id: 'p5', caption: 'D&AD New Blood, 2026',                color: 'var(--warp)',                                          top: '48%', left: '6%',  w: 84,  h: 28 },
  { id: 'p6', caption: 'Map layer system, Light-T',           color: 'var(--warp)',                                        top: '58%', left: '42%', w: 104, h: 28 },
];
