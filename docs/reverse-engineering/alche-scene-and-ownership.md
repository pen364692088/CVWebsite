# Alche Scene And Ownership

## Status

- Scope: reference-site system decomposition.
- This document replaces the current repo’s coarse world framing where they conflict.

## Core Correction

The current repo is still too compressed.

- Current repo framing: one persistent world across `hero / works / about / stella / contact`
- Reference framing: one persistent top-page world with multiple content states and transition buffers inside it

The important correction is:

- `works` is not one section
- `about` is not one section
- `contact` is not the correct top-page end-state label

The reference top page behaves more like:

- top-page world
  - `kv`
  - `works_intro`
  - `works`
  - `works_outro`
  - `mission_in`
  - `mission`
  - `vision`
  - `vision_out`
  - `service_in`
  - `service`
  - `stellla`
  - `outro`

## Persistent 3D Systems

### Core 3D parents

`known + video-supported`

1. Thick refractive `A` logo slab
2. Floating emissive `ALCHE` word layer
3. Cylindrical media wall

These are the core hero-world geometric parents, but they are not the whole top-page runtime.

### Persistent GL systems beyond the 3 parents

`known/inferred`

- top-page scene manager
- main logo scene controller
- works thumbnail/card system
- service scene/list system
- top-page outro scene
- object scroller / DOM-to-GL attachment utilities

These are not separate canvases for each section. They appear to be subsystems inside one renderer.

## DOM Ownership Table

| System | Ownership | Persistence | Notes |
|---|---|---:|---|
| Header logo/nav | DOM | whole site | Real editorial/navigation system |
| Contact / Recruit button | DOM | whole site | Persistent utility CTA |
| Sound toggle | DOM | whole site | Operational control, not decorative |
| Side menu / hamburger | DOM | whole site | Separate mobile/navigation shell |
| TopScrollIndicator | DOM | top page | Section + subsection navigation |
| News rail | DOM | top page hero/upper chain | Fixed editorial rail on the right |
| Works metadata list | DOM | works | Real content list synchronized with GL works thumbnails |
| Mission / Vision text | DOM | mission + vision | Text rhythm is editorial, not just wall content |
| Service titles/descriptions | DOM | service | Content system, not pure GL |
| Stellla logo/text/frame | DOM | stellla | Strong editorial layer over scene |
| Footer links / legal / contact | DOM | outro/footer | Final information stage |
| Main `A` | GL | top-page opening chain | Optical hero object |
| `ALCHE` emissive word layer | GL | hero/kv and related transitions | Backlight / brand authority |
| Cylindrical media wall | GL | hero-to-works chain | Main architectural carrier |
| Works thumbnails/cards | GL | works | Scroll-driven foreground media planes |
| Top-page outro canvas | GL | outro | Distinct outro scene system |

## GL Ownership Table

| System | Role | Persistence | Notes |
|---|---|---:|---|
| Main logo scene | Hero authority | `kv` through early transitions | Includes material/orientation tuning |
| Works thumbnail scene | Foreground card authority | `works` chain | Data-driven via DOM hooks |
| Service scene/list | Service-stage authority | `service` | Distinct from works |
| Outro scene | Footer brand stage | `outro` | Own canvas region |
| Scene selector | Top vs subpage | whole site | Prevents canvas remounting |

## Current Repo vs Reference Mapping

| Current repo | Reference site | Verdict |
|---|---|---|
| `hero` | `loading + kv` | Too compressed |
| `works` | `works_intro + works + works_outro` | Too compressed |
| `about` | `mission_in + mission + vision + vision_out + service_in` | Structurally wrong |
| `stella` | `service + stellla` | Mixed two different beats |
| `contact` | `outro + footer` | Wrong label and wrong stage model |

## Design Language Read

### What the site actually is

- technical exhibition interface
- editorial information system
- persistent GL-backed world
- transition-led brand choreography

### What it is not

- generic agency landing page
- hero plus independent sections
- pure DOM site with a decorative canvas
- pure fullscreen WebGL demo with text pasted on top

## Main Read Shift By Segment

### `kv`

- primary: `A + ALCHE + cylindrical wall`
- secondary: nav / news / debug instrumentation

### `works_intro -> works -> works_outro`

- primary shifts from wall/logo authority to media-plane authority
- DOM works list becomes a synchronized editorial counterpart

### `mission -> vision`

- primary shifts from dark spatial stage to white conceptual field
- this is a conceptual and tonal reset inside the same top-page program

### `service -> stellla`

- primary shifts from category/service explanation to brand/product emphasis
- `stellla` is not just “the next 3D section”; it is a branded editorial module

### `outro`

- primary shifts to final brand lockup and footer utility
- deep scene continuity relaxes here, but brand continuity does not

## Top 5 Structural Gaps In The Current Repo

Ranked by perceptual impact:

1. State graph is too coarse. The current runtime cannot reproduce the real pacing because it lacks transition sections.
2. `about` is a false abstraction. The reference site distinguishes mission, vision, and service handoff.
3. Works is modeled as one state instead of intro/main/outro choreography with synced DOM list + GL cards.
4. The current repo treats footer/contact as a terminal flat section, while the reference site has a dedicated outro stage before the footer settles.
5. DOM ownership is under-modeled. News, scroll indicator, service content, and stellla editorial layers are structurally important, not optional garnish.

## Immediate Consequence For The Next Code Pass

The next runtime rewrite should target:

- `top-page state graph`, not `section list`
- `transition states`, not only stable sections
- `DOM/GL synchronization`, not only GL scene polish
- `outro stage`, not generic contact flattening

If these are not corrected first, further visual refinement will still land in the wrong architecture.
