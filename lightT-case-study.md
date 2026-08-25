# Light-T case study

Laid out on the jaimec.co structure. Sticky anchor nav across eight sections,
short blocks, one image per idea.

Bracketed notes in [FILL] and [NOTE] are for Cherin, not for the page.

---

## Page head

```
Light-T
A traffic signal analysis dashboard that tells planners which direction is
causing the backup, not just that there is one.

2022        Case Study
```

Hero: the Hwaseong deployment screenshot, full width. The school zone buffers, the
layer panel, and the signal cycle legend are all visible in one frame, and all of
them are yours.

**Sticky anchor nav, eight links:**

```
Overview · Contributions · Problem · Solution · Impact · Process · Designs · Learnings
```

[NOTE] The anchor nav is the highest value thing to copy from that reference. Your
stated problem is that people do not reach the bottom. This lets a recruiter jump
straight to Designs, which is the section that actually gets you interviews.

---

## 1. Overview

Light-T is the Korea Transport Institute's signal operation monitoring and analysis
standard model, deployed for Hwaseong City. The system already existed. I joined a
24 week engagement to improve and extend it.

### Card row

```
   5 layers      Map layers and spatial data I built
   
   300m          School zone buffers drawn around every school
   Standard      Published by KOTI as a national standard model
```

[NOTE] You do not have conversion metrics and you should not invent the shape of
them. These are your real equivalents: scope, artifact, and institutional weight.
Keep the card format, change what goes in it.

[FILL] Replace "5 layers" with the real count of schools or intersections covered if
you have it. A specific number is stronger than a round one.

---

## 2. Contributions

Built the map layer system and the spatial data behind it: school zone extraction and
buffers, crosswalk and bus stop layers, and operator controls over all of them.

Unified address search with road ID and intersection ID lookup so one field resolves
any of the three.

Proposed converting the interface to dark, and proposed the design for it. The team
adopted it across the product.

Proposed replacing the pass through metric at the centre of the signal analysis view,
then designed and built the directional flow that replaced it.

[NOTE] Two of these four are proposals, not assignments. That is the argument of the
whole page. Keep them last so they land, and keep the verb "proposed" visible.

---

## 3. Problem

**01 · A number that stopped short**

Planners saw a pass through percentage per intersection. It said something was wrong.
It did not say what to change.

**02 · A light interface for long sessions**

Transport researchers and Hwaseong traffic officials read a map, several charts, and
a table on one screen for as long as a question takes. The light UI was built for
dipping in.

**03 · Five layers, one map**

Signals, school zones, crosswalks, bus stops, road geometry. Turn them all on and the
map stops being readable.

**04 · Two speeds of data**

Traffic volume arrives live. Most of the rest is batched records, roughly a year
accumulated then pulled. One panel is seconds old and the panel beside it covers
months.

[NOTE] Four numbered problems, one sentence each, is the scan layer. Everything in
Solution and Process answers one of these four. Say which one, each time.

---

## 4. Solution

### Proposal one: move the interface to dark

Answers problem 02.

Watching how long these people sit with one screen, the light interface looked like
the wrong default. I proposed converting it, and proposed the design rather than only
raising the problem. The team took it up and we rolled the change across the product.

The signal cycle layer is the clearest case. Cycle length runs 55 to 240 seconds,
mapped to a green through red scale and drawn across the whole city. On a light
basemap the mid range washed out. On dark, the full scale holds at city zoom, which
is the zoom a planner starts from.

[Image: the signal cycle legend and the dark map together.]

### Proposal two: show direction, not a total

Answers problem 01.

This was not a new feature request. It was an existing chart in a shipped product
that I argued should be replaced.

Before, a donut per intersection with one number in it. Left, right, and straight
collapsed into a single figure, each intersection an island, and nothing a planner
could act on.

After, a directional flow across the whole signalized area. Vehicles enter at one
end, move through each intersection, and exit at the other, and at every intersection
the count splits into straight, left, and right.

```
IN  4,467
  Intersection 10927     straight 4,463    left 2      right 2
  Intersection 10936     straight 4,447    left 2      right 13
  Intersection 10939     straight 4,446    left --     right --
OUT 4,446
```

A planner can now read how many vehicles took each direction, find which intersection
in the chain is the constraint, and decide whether to extend or shorten a specific
phase.

[NOTE] Every pass rate in the current example reads 100 percent, which is the one case
where the view looks pointless. Use a signalized area where a rate drops, or where a
heavy left turn count sits against a short phase. **Show the failure the view was
built to catch.** Highest value single fix on the page.

[FILL] State the period these counts cover, and whether they come from the accumulated
records rather than the live feed.

---

## 5. Impact

```
  Standard model     Published by KOTI as a national reference model
  Hwaseong City      Deployed and in use
  Still running      School zone layer and map controls live in the 2024 build
```

[NOTE] You left in August 2022 and the screenshot is from February 2024. That gap is
the impact. Work that outlives you on a project you did not own is a better claim than
a percentage you cannot verify.

[FILL] Was a signal timing change actually made from the directional view? Even
"planners used it in review meetings" belongs here. If nothing changed, leave this out
and say so in Learnings.

---

## 6. Process

### The spatial data behind the map

Answers problem 03.

School zones did not exist as a layer. They existed as three separate government
datasets: daycare centres, kindergartens, and elementary schools. I extracted those,
resolved them to points, and drew a 300 metre buffer around each, so a planner can see
which intersections sit inside a protected zone before touching the timing there.

Same pattern for the rest. Crosswalk and bus stop positions came in as raw data and
left as layers a planner could read against the signal view.

I also unified search. Address lookup ran through the Daum API, but planners work in
road IDs and intersection IDs too, and those were separate. One field now resolves any
of the three.

### Giving operators control

Also answers problem 03.

Five layers competing for one map is a legibility problem, not a data problem. I built
on and off toggles and per layer colour controls. A planner looking at school zone
safety turns off everything except schools and signals. A planner tracing a corridor
keeps bus stops and drops the rest.

Graph conditions also switch based on the selected location on the thematic map, so
the charts follow the operator's attention instead of sitting apart from it.

### Working inside the two speeds

Answers problem 04.

The product already made the analysis window an explicit choice: a planner picks a
date and an hour band before anything is computed. Working inside that convention is
what keeps the mixed latency legible, because the numbers on screen are never
ambiguous about what period they describe.

[NOTE] Attribute this one correctly. It was the product's convention, not your
invention. Recognising why an existing pattern works is still a design observation and
it costs you nothing to say where it came from.

---

## 7. Designs

Small heading, one or two sentences, one image. Repeat. No paragraphs here.

**School zone buffers, Hwaseong deployment**
300 metre buffers around every school, drawn over the signal cycle layer, so proximity
and timing can be read together.
[Image: the yellow buffer field over the city.]

**Layer controls**
Signals, incidents, CCTV, schools, bus stops. Toggles and per layer colour, so an
operator can reduce the map to their current question.
[Image: the right hand layer panel.]

**Signal cycle scale on a dark basemap**
55 to 240 seconds, green through red, readable at city zoom.
[Image: the legend and the map together.]

**Directional flow**
Straight, left, and right counts at every intersection in a signalized area.
[Image: the directional view.]

**Published report**
The system documented as KOTI's signal operation monitoring and analysis standard
model.
[Images: report cover and feature spread.]

[NOTE] Caption the deployment screenshot honestly. It is the 2024 build and you left
in August 2022. "Hwaseong City deployment, 2024. School zone layer and map controls
built in 2022." Saying it plainly is stronger than leaving it ambiguous.

---

## 8. Learnings

Two of the changes I am most attached to on this project were ones nobody asked for.
The dark conversion came from watching how long these people sit with one screen. The
directional view came from having built the data and seeing what the number was
hiding. Both required arguing for a change inside a product that was not mine, which
turned out to be the part of the work I want more of.

The directional view tells a planner where to adjust timing. It does not tell them
whether the adjustment worked. The next step was before and after measurement on
intersections where a phase had been changed, and we did not get to it.

[FILL] One honest sentence about your own design, not the project scope. What you
would build differently now. It is the most credible paragraph on the page and it does
not exist yet.

I came into this as a design major and left it thinking of code as a drawing tool.

---

## Layout notes

**Copy from the reference:**

- Sticky anchor nav. Eight sections, always visible.
- Card row at the top, repeated in Impact.
- Numbered problems, title plus one sentence.
- Designs as heading, caption, image, repeated.
- Almost never more than two sentences in a block.
- Date and type tag under the title.

**Do not copy:**

- Metric cards with invented percentages. Yours are qualitative and that is fine.
- The reference's Process section repeats one sentence three times, a template
  artifact left in. Read your own page start to finish before shipping.

**Still to fix on the live page:**

- Role currently reads "Full Stack Developer."
- The string "(data TBD)" is live. It came from a WBS note.
- Two dark mode before and after images have no source file.
- Resume line "pulled live signal data" overstates the ingestion work. Replace with
  something like "extracted school-zone and bus datasets into map layers and built
  D3.js visualizations reading the live traffic feed."