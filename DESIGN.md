# DESIGN.md

Design and build rules for cherinblanton.com. Read this before changing any page.

The landing page comp is the reference. Where this file and the comp disagree, the comp wins and this file gets updated.

---

## 1. What this site is

A portfolio that keeps growing. Two layers:

**Work.** Four to six projects. Curated, slow to change, the reason a hiring manager is here.

**Notes.** An ongoing record. What got built, what broke, what was learned. Written the day it happened, not reconstructed later.

Work is the main event. Notes sit below it and prove the work is still happening. The notes are also raw material: each one is written so it can later be pulled into a case study or a talk without starting over.

---

## 2. Who it is for

A hiring manager or recruiter who opened the site from a resume link and has about forty seconds. They need to know what kind of designer this is, what she has made, whether it is credible, and how to reach her.

That reader comes first. The notes serve a second reader who stays longer, and they serve the author most of all.

---

## 3. Voice

**Wordmark:** hand-lettered, in marker. Top left. This is the one place the hand appears and it is the signature of the whole site.

**Role line, mono:** `Product designer x Developer`

**Sidebar bio, broken lines, mono:**

```
Started in textiles in Los Angeles.
Moved to maps in Seoul.
Now I design interfaces for data that never
stops moving. I build them too.
```

One clause per line, ragged right. Short enough to sit directly on the weave.

---

## 4. The weave

The background is a woven field of **bands**, not threads.

Vertical bands in blue. Horizontal bands in peach. They cross and darken where they overlap. The whole thing is flat and straight, like a length of plaid laid out rather than cloth in motion.

**Five properties, all required:**

1. **Bands, not lines.** Width varies from roughly 3px to 60px. A field of even hairlines reads as graph paper.
2. **Opacity varies per band.** Some are barely there, a few are solid. This is what makes it read as woven rather than printed.
3. **Density is uneven and clustered.** In the comp, blue crowds the right edge and thins out toward the left. Peach runs the full width but its heavy bands are spaced irregularly. This asymmetry is the strongest move in the design. Do not distribute evenly.
4. **A large area stays nearly empty.** The center and lower left of the comp are almost bare. The emptiness is doing as much work as the bands.
5. **Full bleed.** Bands run edge to edge and are cut by the viewport, never inset or trimmed to fit.

**No drape, no distortion, no wobble.** Earlier explorations bent the grid. The comp does not, and it is better for it. Straight bands let the color and the spacing carry everything.

---

## 5. Color

```
--base:    #FDFCFA   page surface, near white
--panel:   #FDF9F3   soft cream, behind the nav only
--ink:     #14141A   wordmark and body text
--muted:   #6E6E75   secondary text
--faint:   #8A8A90   dates and metadata
--warp:    #8FA8F0   blue, vertical bands
--weft:    #F8DCC8   peach, horizontal bands
--bullet:  #2E7D5B   green, nav markers and small accents
--rule:    #E8E6E0   hairlines
```

Bands render with `multiply` so crossings deepen on their own. That third tone is a product, not a token. Do not define it.

The green appears only as the nav bullets and the occasional small mark. It connects to the hand-lettered character set, which was drawn in green marker. Keep it tiny and rare.

Project colors, used on project pages and note tags only:

| Project | Color |
|---|---|
| Light-T | blue |
| Scouty | peach |
| Bitti | green |
| Contextual HUD | ink |

---

## 6. Weave and text

The comp puts text directly on the weave in two places and that works because of where it sits. The rule is about local density, not about the weave as a whole.

**Allowed on the weave:** the wordmark, the role line, the broken-line bio. Short lines, generous leading, and only where band opacity is low.

**Requires the cream panel:** the numbered nav, as in the comp.

**Requires an opaque panel:** the work list, the notes list, and all case study body copy. Dense multi-column text never sits on bands.

**The one risk in the comp.** The bio sits bottom right, which is where the blue is heaviest. Either keep the bands under it at low opacity, or reserve a low-density lane there. Check it at 4.5:1 before shipping, and check it in monospace mode too.

Consequence worth knowing: on a case study the panel fills most of the viewport, so the weave recedes on its own. Reading pages get quieter without a setting.

---

## 7. Layout

Asymmetric, cornered, mostly empty.

```
+------------------------------------------------------------+
| Cherin Blanton            (hand-lettered)                   |
| Product designer x Developer                                |
|                                                             |
| +---------------+                                           |
| | 1 ● Home      |          <- cream panel                   |
| | 2 ● Work      |                                           |
| | 3 ● Notes     |                                           |
| | 4 ● Info      |                                           |
| | 5 ● Contact   |                                           |
| +---------------+                                           |
|                                                             |
|                     (empty, bands only)                     |
|                                                             |
|                                    Started in textiles...   |
|                                    Moved to maps in Seoul.  |
|                                    Now I design interfaces  |
+------------------------------------------------------------+
```

Content occupies the top left and the bottom right. The diagonal between them stays empty.

**The landing page holds nothing else.** No work list, no notes list, no award line. Those live on their own pages, reached through the numbered nav. The landing page is a title page.

This is a change from the earlier plan, which stacked everything on home. The comp is a stronger opening and the nav does the routing.

**Work and Notes pages** keep the earlier structure: a dense text list on an opaque panel, bands visible in the margins.

---

## 8. Modes

Two only. Light and Monospace. No dark mode in v1.

**Light.** Suisse Int'l for headings and body. Bands at their comp widths and opacities.

**Monospace.** A mono face throughout. Bands equalize: uniform width, even spacing, opacity flattened. The plaid becomes graph paper.

That transition is the thesis, not a preference toggle. Cloth in one state, the grid underneath in the other. Interpolate over about 800ms so the flattening is felt. Store the choice in localStorage.

Note that the comp already sets the role line and bio in mono. Monospace mode extends that treatment to everything.

---

## 9. Shader spec

Ship in two stages. Do not block the launch on learning GLSL.

**Stage one:** CSS or Canvas 2D. The bands are rectangles. A static version is legitimate output, not a compromise.

**Stage two:** A fragment shader on a fullscreen plane in three.js. One quad, one ShaderMaterial.

The bands are a one-dimensional problem solved twice. For each axis, hash the band index to get position, width, and opacity, then test whether the current fragment falls inside a band.

```glsl
float bands(float p, float seed, float density) {
  float acc = 0.0;
  for (int i = 0; i < BAND_COUNT; i++) {
    float h  = hash(float(i) + seed);
    float x  = fract(h * 7.13 + u_drift * u_speed);
    float w  = mix(u_wMin, u_wMax, hash(float(i) + seed + 41.0));
    float a  = mix(0.10, 0.85, hash(float(i) + seed + 97.0));
    float cluster = pow(x, density);          // skews bands toward one edge
    acc += a * step(abs(p - cluster), w * 0.5);
  }
  return acc;
}

float v = bands(uv.x, 0.0,  u_clusterX);   // blue, crowds one side
float h = bands(uv.y, 13.0, 1.0);          // peach, spread across
vec3 col = u_base;
col = mix(col, col * u_warp, clamp(v, 0.0, 1.0));
col = mix(col, col * u_weft, clamp(h, 0.0, 1.0));
```

Multiplying rather than blending is what produces the deepened crossings.

**Uniforms:**

| Name | Type | Light | Mono | Notes |
|---|---|---|---|---|
| `u_drift` | float | running | running, slower | Very slow lateral movement |
| `u_speed` | float | 0.006 | 0.002 | Should be barely perceptible |
| `u_wMin` | float | 0.002 | 0.006 | Band width, normalized |
| `u_wMax` | float | 0.045 | 0.006 | Equal to `u_wMin` in mono |
| `u_clusterX` | float | 2.4 | 1.0 | Above 1.0 crowds bands to one edge |
| `u_warp` | vec3 | blue | blue | |
| `u_weft` | vec3 | peach | peach | |

**Non-negotiables:**

- `prefers-reduced-motion` freezes the drift. The bands still render, they hold still.
- A static fallback ships for no-WebGL and for first paint.
- The canvas never blocks first contentful paint. Text renders first.
- Movement stays slow enough that a reader is not sure it is moving.

---

## 10. Typography

**Suisse Int'l** for light mode. One face, two weights. Commercial license, so launch on a free substitute and swap later. Only one variable changes.

**One mono** for the role line, the bio, dates, tags, and all of monospace mode.

**The hand-lettered set** appears in exactly one place: the wordmark. Twice makes it decoration. Once makes it a signature.

| Role | Size | Notes |
|---|---|---|
| Wordmark | 34 to 40px | Hand-lettered artwork, not a font |
| Role line | 15px | Mono |
| Nav item | 14px | Number and bullet at 11px |
| Bio, broken lines | 14px | Mono, line height 1.7 |
| Project title | 14px | |
| Note title | 12 to 13px | |
| Body in a note | 15 to 16px | Line height 1.65, max 68 characters |
| Date, tag, meta | 11px | Mono |

---

## 11. Notes

**Formats, so the habit survives.** A pure daily build log dies in three weeks. Rotate:

- **Log.** What was built today, what broke. Three sentences is a valid entry.
- **Doc.** Kept and revised. Geospatial design resources, AI interface patterns.
- **Links.** Monthly. What was read that month. Easiest to write, best proof of consistency.
- **List.** Things to learn, interfaces worth studying, books.
- **Essay.** Occasional and longer.

**Every entry carries:**

```
date · project tag · format tag
title, one plain line
body, 100 to 400 words
one image or code block when there is one
"What I learned", one line
```

That last line is the conversion point. It becomes a slide. A project's entries in order become a talk outline. Write it every time, even when it feels obvious.

**Cadence: twice a week.** A log that stopped four months ago is worse than no log.

**Do not launch the section with two entries.** Write six to eight first.

**Now line.** One sentence, updated weekly, saying what is being worked on. It lives on the Notes page rather than the landing page, since the landing page stays bare. Highest-value sentence on the site, because it is the only one that proves the site is current.

---

## 12. Project pages

```
[Summary]      what it is, the constraint, three to five decisions, what shipped
[Build trail]  every note tagged to this project, oldest first
```

The conclusion sits on top of the evidence that produced it.

**Summary structure:**

1. What it is. One sentence. Who used it, for what.
2. The constraint. What made it hard.
3. Three to five decisions. Each one: what was chosen, what was rejected, why.
4. What changed the design. The test, the metric, the failure. If nothing did, say so.
5. What shipped. Two or three real screens.
6. What I would do differently. Two sentences.

**Length ceiling: four screens.**

---

## 13. Info page

A colophon answering how this site was built. What the bands are, what it is made of, what was learned building it. It doubles as technical evidence and links back into the notes that document the build.

The D&AD New Blood Portfolio Winner 2026 credential goes here and in the Work page header, since the landing page carries no text beyond the wordmark, role line, nav, and bio.

---

## 14. Copy rules

- Sentence case in body and headings. Uppercase only in mono metadata.
- Active voice. "I removed the signup" rather than "the signup was removed."
- Numbers instead of adjectives. "19 events, 3 funnels" rather than "extensive testing."
- No em dashes. Use periods, commas, or a colon.
- Name the real thing. "Korea Transport Institute," not "a government client."
- Note titles are plain and specific. "What disappears at each zoom level," not "Reflections on cartographic hierarchy."
- If a sentence could appear in any designer's portfolio, delete it.

---

## 15. Meta tags

Current tags still say Creative Technologist and list GIS, 3D, AI, Full-Stack. That is a list, not a position.

```html
<title>Cherin Blanton, Product Designer x Developer</title>
<meta name="description" content="I design interfaces for complex, live data, and I build them.">
```

The OG image should be the landing page itself. It already looks like one.

---

## 16. Build

Static site, markdown content, one repo. Notes as `.md` files with frontmatter for date, project, and format. No CMS.

Content and code live together, so an agent can work across both. And the same markdown parses into slides later, which is the point of writing the notes this way.

---

## 17. Open decisions

- Where the D&AD credential surfaces, given the bare landing page. Section 13 is a proposal.
- Contextual HUD one-line description. Current text is a placeholder.
- Whether the bands drift at all, or stay completely still. Still is a valid answer.

---

## 18. Before shipping

- [ ] Band density is clustered, not evenly distributed
- [ ] A large region of the landing page is nearly empty
- [ ] Bands are cut by the viewport edge, never inset
- [ ] The bio passes 4.5:1 against the bands behind it, in both modes
- [ ] Dense lists sit on an opaque panel
- [ ] Text renders before the canvas
- [ ] `prefers-reduced-motion` holds the bands still
- [ ] A static fallback exists for no-WebGL
- [ ] Mode choice persists across pages
- [ ] Mono mode equalizes band width and spacing
- [ ] The notes list has at least six entries
- [ ] Every page reads at 375px
- [ ] Keyboard focus is visible on every link
- [ ] No em dashes anywhere in the copy