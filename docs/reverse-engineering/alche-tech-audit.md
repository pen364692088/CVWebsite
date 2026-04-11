# Alche Reference Tech Audit

## Status

- Scope: reverse-engineering only.
- This document is the highest-priority authority for runtime structure until the next implementation pass rewrites the current coarse contract.
- Sources are ordered by authority:
  1. live site HTML / JS bundle from [alche.studio](https://alche.studio/)
  2. local reference video [参考视频.mp4](/mnt/d/Project/AIProject/MyProject/CVWebsite/Task/参考视频.mp4)
  3. current repo prototype and docs
- This document distinguishes `known`, `inferred`, and `unknown`.

## Runtime Facts

### Known

- Site generator is `Astro v5.13.3`.
- Delivery is static HTML/CSS/JS from S3 + CloudFront.
- A persistent fixed GL mount exists at `#gl-canvas`.
- A page transition shell exists at `#swup`.
- A loading shell exists at:
  - `#loading-overlay`
  - `#loading-lottie`
  - `#loading-logo`
  - `#loading-text`
- Smooth scrolling uses `Lenis`.
- Motion/scroll orchestration uses `GSAP` and `ScrollTrigger`.
- Page transitions use `Swup`.
- Works/service carousel logic uses `Swiper`.
- Loading and outro branding use `Lottie`.
- Three.js runtime is present, including:
  - `THREE`
  - `GLTFLoader`
  - `DRACOLoader`
- Debug/runtime instrumentation is present:
  - `Tweakpane`
  - `Stats`
  - `tweakpane-mainlogo-material`
  - `tweakpane-mainlogo-quaternion`
  - `tweakpane-mainlogo-screen`
- The top page is segmented by DOM markers:
  - `data-top_section`
  - `data-snap-ratio`
- A right-side fixed content rail exists as `News__newsArea`.
- A persistent top progress/navigation system exists as `TopScrollIndicator`.
- Outro/footer has its own canvas layer:
  - `TopPageOutro__canvas`
  - `#outro-canvas`

### Inferred

- Top-page motion is managed by a custom orchestration layer rather than direct component-local logic.
- The GL scene is persistent across the full top page and switches internal section states instead of remounting separate canvases.
- The site uses a page manager + scene manager architecture:
  - `PageManager`
  - `TopScrollManager`
  - `Transition`
  - `LoadingUIController`
  - `OutroController`
  - `TweakPaneSectionManager`
- The site distinguishes top-page scene state from subpage scene state through a scene selector, not by destroying the renderer.
- Shader precompilation is treated as a first-class loading concern.
- The top-page GL system is authored as a small scene graph of named subsystems rather than a single monolith.

### Unknown

- Exact repo structure and source module boundaries on the Alche side.
- Whether scene state is authored from TS classes only or partially code-generated.
- Exact material implementation details for the main `A` beyond what is visible in the bundle and video.
- Whether postprocessing is entirely custom or layered on top of stock Three passes.

## Top-Page Structure

### Known section graph

Live DOM markers show the top page uses this sequence:

1. `kv`
2. `works_intro`
3. `works`
4. `works_outro`
5. `mission_in`
6. `mission`
7. `vision`
8. `vision_out`
9. `service_in`
10. `service`
11. `stellla`
12. `outro`

This is not compatible with the current repo’s coarse model:

- current repo: `hero / works / about / stella / contact`
- reference site: `kv / works_intro / works / works_outro / mission_in / mission / vision / vision_out / service_in / service / stellla / outro`

## Runtime Architecture Read

### GL shell

`known`

- `gl.canvas` is appended into `#gl-canvas`.
- `gl.switchToTopPage()` and `gl.switchToSubPage()` are runtime-level scene switches.
- `gl.changeTopSection(...)` exists, which confirms the top page uses internal section state rather than route-level remounting.
- `gl.onLoadingComplete(...)` and shader precompile hooks are part of startup.

### Scroll shell

`known`

- `TopScrollManager` registers each `data-top_section`.
- `TopScrollIndicatorController` groups sections into higher-order categories:
  - `kv`
  - `works`
  - `mission`
  - `vision`
  - `service`
- `works` uses its own progress/snap logic.
- `mission/vision/service` are not decorative labels. They are separate scroll-managed states.

### Page transition shell

`known`

- Swup is live and page transitions are not just CSS route fades.
- Loading UI, page transition, and GL page switching are synchronized.
- There is special-case handling for works-to-works navigation.

### Debug shell

`known`

- Tweakpane windows are section-aware.
- Debug windows are selectively enabled per top-page section.

`inferred`

- The team actively tunes logo material/orientation/screen behavior per section during development.
- The hero and top-page GL states are authored as adjustable production scenes, not hardcoded demo shots.

## Design System Read

### Known

- The top page is not a generic landing-page composition.
- The visual system is black-first, high-contrast, technical, editorial, and spatial.
- Navigation, scroll indicator, news rail, and footer are real editorial systems, not placeholder overlays.
- The wall/grid language persists well beyond hero.
- The footer is a distinct branded stage, not a standard contact block.

### Inferred

- The design language is closer to a technical exhibition system than to an agency portfolio template.
- The 3D layer supplies continuity and authority.
- The DOM layer supplies navigation, editorial reading, and operational clarity.
- The site relies on contrast between:
  - optical density vs flat typography
  - curved spatial fields vs planar editorial blocks
  - black stage vs white mission/vision field

## Why The Current Prototype Still Misses

Ranked by perceptual impact:

1. The current repo compresses the real top-page structure into 5 phases, which breaks choreography before any shader issue is considered.
2. The current repo treats `about` as one broad state, but the reference site clearly separates `mission`, `vision`, and their transition buffers.
3. The current repo over-centers the hero contract and under-models the loading, works-intro, works-outro, and outro systems that define the site’s rhythm.
4. The current repo models DOM overlay as a simplified shell, while the reference site uses persistent editorial systems with stronger structural roles.
5. The current repo has one scene abstraction trying to cover everything, while the reference site appears to use section-specific scene controllers inside one persistent renderer.

## Implementation Consequence

Do not continue refining the current 5-phase abstraction as if it were close.  
The next implementation pass should start from:

- a richer top-page state graph
- an explicit DOM-vs-GL ownership table
- persistent GL scene subsystems
- transition sections as first-class runtime states

Without that, more optical work is low-yield.
