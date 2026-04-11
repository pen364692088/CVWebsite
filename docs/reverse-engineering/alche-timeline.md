# Alche Top-Page Timeline

## Status

- Scope: implementation-facing state machine for the reference top page.
- This is a reverse-engineered runtime model, not a design essay.
- `known` states come from live DOM markers.
- motion details are marked `inferred` when the exact implementation is not directly observable from source.

## State Machine

### 1. `loading`

- Enter condition: first top-page load or swup transition into top page
- Primary read: loading lottie + loading logo + text
- Secondary read: none
- Persistent layers: page shell, hidden GL container
- Exiting layers: loading overlay
- Camera action: `unknown`
- DOM action:
  - scroll disabled
  - loading overlay visible
  - text scramble/reveal
- GL action:
  - shader precompile
  - top page scene setup
  - `loaded` state ramps in after completion
- Failure mode:
  - hero appears before loading has properly established the top-page shell

### 2. `kv`

- Enter condition: loading hides, top page becomes interactive
- Primary read: thick refractive `A` + emissive `ALCHE` + cylindrical wall
- Secondary read: top nav, news rail, top scroll indicator, tweak/debug chrome
- Persistent layers: header, news, top scroll indicator, fixed GL canvas
- Exiting layers: loading overlay
- Camera action:
  - mostly fixed
  - slight interactive parallax, not free camera
- DOM action:
  - header/nav active
  - right news visible
  - section indicator visible
- GL action:
  - main logo scene fully active
  - wall content establishes
- Failure mode:
  - hero reads like an isolated shot instead of the opening state of a longer system

### 3. `works_intro`

- Enter condition: scroll leaves `kv`
- Primary read: authority handoff out of hero
- Secondary read: residual logo/wall
- Persistent layers: same top-page world
- Exiting layers: full `ALCHE` hero dominance
- Camera action:
  - restrained reframe or dolly response
- DOM action:
  - works rail/list begins preparing
- GL action:
  - `WORK` word or equivalent transitional wall content establishes
  - main logo authority starts collapsing
- Failure mode:
  - jump directly from hero to stable works card state

### 4. `works`

- Enter condition: works foreground media system stabilizes
- Primary read: active project card / media plane
- Secondary read: side cards, DOM works metadata
- Persistent layers: same GL scene, header, indicator
- Exiting layers: hero word layer
- Camera action:
  - controlled works framing
- DOM action:
  - works list/items remain active
  - metadata is synchronized to active work
- GL action:
  - thumbnails/cards occupy foreground
  - horizontal track logic and snapping are active
- Failure mode:
  - cards feel pasted onto hero instead of emerging from the same runtime

### 5. `works_outro`

- Enter condition: works chain approaches completion
- Primary read: works system clearing
- Secondary read: residual wall/grid
- Persistent layers: top-page world continuity
- Exiting layers: works card authority
- Camera action:
  - controlled preparation for conceptual transition
- DOM action:
  - works editorial system de-emphasizes
- GL action:
  - works card system clears
  - scene prepares for mission entry
- Failure mode:
  - works ends abruptly with no decompression state

### 6. `mission_in`

- Enter condition: post-works transition begins
- Primary read: conceptual reset toward mission
- Secondary read: transformed logo/world residue
- Persistent layers: same page shell
- Exiting layers: works media logic
- Camera action:
  - transitional, not stunt-like
- DOM action:
  - mission text prepares
- GL action:
  - dark world begins flattening / purifying
- Failure mode:
  - hard cut into white section

### 7. `mission`

- Enter condition: mission field stabilizes
- Primary read: mission statement and symbolic field
- Secondary read: technical marks / structural lines
- Persistent layers: top nav and indicator
- Exiting layers: works media planes
- Camera action:
  - stable conceptual framing
- DOM action:
  - mission title and copy become legible
- GL action:
  - whitened / flattened field supports the message
- Failure mode:
  - mission reads like ordinary DOM content with no world continuity

### 8. `vision`

- Enter condition: mission continues into vision state
- Primary read: vision statement in white technical field
- Secondary read: residual emblem geometry
- Persistent layers: same page shell
- Exiting layers: mission emphasis
- Camera action:
  - still restrained
- DOM action:
  - vision title/copy replace mission copy
- GL action:
  - field remains light, precise, schematic
- Failure mode:
  - mission and vision collapse into one undifferentiated about block

### 9. `vision_out`

- Enter condition: vision exits toward service
- Primary read: release of white field authority
- Secondary read: structural carry-over marks
- Persistent layers: same top-page program
- Exiting layers: vision field dominance
- Camera action:
  - prepares for return to darker, denser space
- DOM action:
  - vision copy de-emphasizes
- GL action:
  - white field drains / recedes
- Failure mode:
  - immediate jump from white conceptual state to service content

### 10. `service_in`

- Enter condition: vision-out completes
- Primary read: service-stage buildup
- Secondary read: grid/scaffold return
- Persistent layers: page shell
- Exiting layers: pure white field
- Camera action:
  - transition into darker service environment
- DOM action:
  - service content prepares
- GL action:
  - world regains spatial density
- Failure mode:
  - service appears as unrelated new template

### 11. `service`

- Enter condition: service stage stabilizes
- Primary read: service category system
- Secondary read: related motion scaffold / GL support
- Persistent layers: header, indicator
- Exiting layers: vision conceptual emphasis
- Camera action:
  - section framing for service categories
- DOM action:
  - service items, titles, descriptions active
- GL action:
  - service scene/list supports DOM content
- Failure mode:
  - service flattened into generic text section or merged blindly into stellla

### 12. `stellla`

- Enter condition: service hands off to branded product stage
- Primary read: `stellla` branded editorial module
- Secondary read: supporting 3D architecture
- Persistent layers: header/nav, page shell
- Exiting layers: generic service category emphasis
- Camera action:
  - brand/product framing
- DOM action:
  - `stellla` logo, text, frame overlay active
- GL action:
  - supporting scene remains spatial but serves the product story
- Failure mode:
  - stellla reads like a random next section instead of a branded climax module

### 13. `outro`

- Enter condition: top-page content drains into footer stage
- Primary read: final brand lockup and outro scene
- Secondary read: footer navigation/utilities
- Persistent layers: brand continuity
- Exiting layers: top-page deep spatial chain
- Camera action:
  - settles, not expands
- DOM action:
  - footer links, contact, privacy, social visible
- GL action:
  - outro canvas takes over final branded motion
- Failure mode:
  - footer reads like a normal contact section with no branded outro stage

## Grouped Read Logic

### Group A: Hero program

- `loading -> kv`
- Goal: establish brand-space authority

### Group B: Works program

- `works_intro -> works -> works_outro`
- Goal: hand authority from logo world to project media without leaving the same runtime

### Group C: Concept program

- `mission_in -> mission -> vision -> vision_out`
- Goal: purify the scene into conceptual white-field messaging

### Group D: Product program

- `service_in -> service -> stellla`
- Goal: re-densify the world and land on branded product/editorial content

### Group E: Closing program

- `outro`
- Goal: finish in a distinct brand stage before footer utility settles

## Why `About` Is Wrong

The current repo label `about` is not just imprecise; it is structurally misleading.

- The live site does not present one broad `about` phase on the top page.
- It presents:
  - mission entry
  - mission
  - vision
  - vision exit
  - service entry
- That sequence contains at least two stable semantic sections and multiple transition buffers.

## Why `Contact` Is Wrong

- The live top page ends in an `outro` stage plus footer.
- That is different from a plain `contact` section.
- Contact/recruit links exist in the footer, but they are not the whole end-state.

## Next Runtime Direction

The next rewrite should use:

- `TopPagePhaseId` or equivalent richer type
- stable sections plus transition sections
- DOM and GL states keyed by the same phase graph

Do not keep extending the current 5-phase machine.
