# Alche Phase 1 Implementation Notes

## Delivered in this pass

- Fixed full-viewport WebGL hero stage inside the current `Next.js` app shell.
- Curved black grid room rendered in shader space on an inward-facing cylinder.
- Large `ALCHE` hero typography with condensed editorial treatment.
- Refractive / iridescent prism `A` with core + shell + halo + technical guide layers.
- Right-side technical HUD with live phase telemetry and future state-machine readout.
- GSAP intro sequence with staged nav, wordmark, copy, and HUD reveals.
- Lenis smooth scroll wired into GSAP `ScrollTrigger`.
- Future-ready scroll state machine for `hero -> works -> vision -> service -> outro`.

## Scene architecture

```text
AlchePhaseOneShell
├─ Fixed overlay chrome
│  ├─ top navigation
│  ├─ giant hero copy
│  ├─ right HUD telemetry
│  └─ future-state indicator
├─ Fixed WebGL canvas
│  └─ AlcheRoomScene
│     ├─ CurvedRoom
│     ├─ HeroPrism
│     │  ├─ core prism material
│     │  ├─ shell prism material
│     │  ├─ halo ring
│     │  └─ edge / guide lines
│     └─ TechnicalPlanes
└─ Scroll track
   ├─ hero section
   ├─ works section anchor
   ├─ vision section anchor
   ├─ service section anchor
   └─ outro section anchor
```

## Reusable shader/material setup

- [`components/alche-phase-one/alche-room-materials.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-phase-one/alche-room-materials.ts)
  - `createCurvedGridMaterial()`
  - `createPrismMaterial(layer)`
  - `createHaloMaterial()`
  - `createPrismEdgeColor()`

These are kept independent from the React shell so they can be reused in later scene states or migrated into another runtime.

## Timing constants

- [`lib/alche-phase-one.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-phase-one.ts)
  - intro sequencing timings
  - phase heights
  - room constants
  - camera states
  - HUD/state-machine constants

## Why this did not migrate to Astro yet

- Phase 1's real objective is visual/runtime validation.
- Migrating the app shell to `Astro + islands + Swup` before the scene language is proven would add high-cost, low-signal work.
- The current prototype is already modular enough to port later: scene code, materials, scroll constants, and overlay chrome are isolated.

## Remaining blockers to near-perfect fidelity

1. Exact `alche.studio` logo mesh and typography stack are still unavailable locally. This pass uses a custom prism `A` and a condensed display fallback, not the original asset/font pair.
2. The reference site's full post stack includes more advanced screen-space compositing and scene-specific shader logic than this pass. Phase 1 deliberately stops short of a full multi-pass renderer.
3. The provided local reference video could not be machine-inspected in the current environment, so micro-timing and exact camera choreography are still matched by inference, not frame-accurate extraction.
4. The current runtime remains `Next.js + React Three Fiber`, not `Astro + React islands + Swup`. That is an architecture delta, not a visual/runtime blocker for Phase 1.
