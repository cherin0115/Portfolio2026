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
