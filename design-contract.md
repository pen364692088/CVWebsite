# Reverse-Engineering Contract: alche.studio

## Scope Lock

- This phase defines the target system only.
- Do not start implementation beyond contract artifacts.
- Target stack for the recreation: `Astro + TypeScript + React islands + Three.js + GSAP + Lenis + Swup + Swiper + SCSS modules`.
- Do not preserve the current repo's `Next.js` architecture by default. That migration decision belongs to the next phase.

## Visual DNA

- Black-first, white-second, technical-editorial, premium, sparse.
- The hero is a spatial composition, not a flat poster.
- The core emblem is a real 3D prism-like `A` object with refraction, reflection, noise breakup, and screen-state morphs.
- The environment is a curved room / cylindrical grid volume, not a flat background texture.
- White-space is used as a scene inversion event, not as a permanent UI theme.
- Accent color use is near-zero. The only observed live accent is a toxic yellow-green status chip.
- Surfaces feel optical, not glossy marketing. Distortion, bloom, noise, scan, and lens warping are subtle but structural.

## Layout System

- One fixed full-viewport WebGL stage behind the page.
- One main DOM scroll rail on top of the WebGL stage.
- One independent outro canvas after the top-page stage.
- Sections are scroll-driven states, not isolated page blocks.
- Header is fixed and color-inverts for light phases.
- Left rail scroll indicator is fixed and section-aware.
- Works and Service use fixed overlay text against moving GL media.
- Footer is withheld until the outro lockup resolves.

## Section Order

| Order | Section ID | Snap Ratio | Contract Role |
| --- | --- | --- | --- |
| 1 | `kv` | `1` | hero / main logo / room establishment |
| 2 | `works_intro` | `1` | deceleration bridge into gallery |
| 3 | `works` | `1` | curved works gallery |
| 4 | `works_outro` | `1.5` | gallery exit and camera settle |
| 5 | `mission_in` | `1` | pre-white transition buffer |
| 6 | `mission` | `1` | editorial mission scene |
| 7 | `vision` | `1.8` | white inversion scene |
| 8 | `vision_out` | `1` | white-to-dark release |
| 9 | `service_in` | `1` | logo-to-screen transition buffer |
| 10 | `service` | `1` | service scene / portalized logo screen |
| 11 | `stellla` | `1` | framed product close |
| 12 | `outro + footer` | `200vh` outro wrapper | centered logo lockup and release |

## Typography Assumptions

- Navigation / chrome / code labels: `IBM Plex Mono` and `Google Sans Code`.
- Japanese UI/body: `IBM Plex Sans JP` and `kozuka-gothic-pr6n`.
- English display / project titles: `acumin-pro`.
- Wide service headings: `acumin-pro-wide`.
- Numeric emphasis: `Barlow`.
- `Bodoni Moda Variable` is loaded, but its top-page role is not proven. Treat as available, not primary.
- Typography should feel editorial and technical, not startup-generic.

## Color Tokens

- `#000000` main background.
- `#ffffff` main foreground.
- `#333333`, `#555555`, `#7e7e7e`, `#999999`, `#a9a9a9`, `#bababa`, `#bbbbbb` for tonal hierarchy.
- `#ffffff1a`, `#ffffff80`, `#0000001a`, `#00000026`, `#00000080` for glass / overlay / stroke states.
- `#d7ff00` reserved status accent for small, high-signal metadata only.
- Light phase flips chrome to black. Exact white-scene base tone is known as light, but not yet numerically proven beyond `#fff` / `#000`.

## Spacing Rhythm

- Micro rhythm: `4 / 8 / 10 / 12 / 16 / 20px`.
- Desktop chrome gutters: `40 / 50px`.
- Section anchoring: `10vh`, `17vh`, `20vh`.
- Large frame/inset system: `95 / 100px`.
- Scroll indicator cadence: `18 / 21.6px`.
- The page reads in large spatial bands, then resolves into small mono labels and chips.

## UI Chrome Rules

- Header is fixed, thin, precise, and mostly transparent.
- Nav links are mono and react with scramble-like text behavior.
- Scroll indicator uses line-length state changes, not pills or dots.
- Buttons are outline-first, with white-fill inversion on hover.
- Mobile side menu is blurred black glass, not a full opaque sheet.
- Works/service metadata is lightweight and anchored to geometry, not boxed into card components.
- Rounded corners exist only on chips, micro-buttons, and soft utility containers.
- No broad colorful gradients.
- No flat hero card stacks.

## What Is Known

- The live site uses `Astro`, `Lenis`, `Swup`, `GSAP`, `Three.js`, and `Swiper`.
- There is a fixed `gl-canvas` plus a separate `outro-canvas`.
- The top page is driven by `data-top_section` state and section-specific snap ratios.
- `mainLogo` is a 3D object with roughness, noise scale, material color, quaternion control, and a screen-state mesh.
- The works title system is shader-driven on a curved path.
- The top scene composite includes bloom, fluids distortion, filmic tonemapping, and FXAA.
- Mission / Vision / Vision Out switch the chrome to black.
- `vision` is a light phase.

## What Is Inferred

- The hero room is a curved grid chamber built from procedural or semi-procedural geometry, not a single bitmap.
- The `A` logo transitions from volumetric prism state to screen/portal state across `vision -> service`.
- The white vision scene is a full scene inversion event, not just a section background color change.
- The works media are DOM-synced GL planes with chromatic displacement and rounded-rect masking.
- The service scene uses the logo screen as a composited scene surface.

## What Is Unknown

- Exact camera keyframes for every section beyond the exposed base camera controller.
- Exact room topology, segment count, and curve radius.
- Exact main-logo mesh topology and material defaults.
- Exact bloom thresholds, blur radii, and default noise-scale values.
- Exact white-scene background tone and whether there is hidden off-white shading.
- Exact asset/video timing from the provided local reference video. It was not machine-readable in the current environment.

## Acceptance Criteria

- This file names the stack, spatial model, section order, typography roles, color system, spacing rhythm, and chrome rules.
- It separates `known`, `inferred`, and `unknown` instead of collapsing them.
- It explicitly forbids flattening the room or replacing the prism `A` with a flat SVG.
- It is specific enough to guide a first implementation pass without requiring more framing work.
