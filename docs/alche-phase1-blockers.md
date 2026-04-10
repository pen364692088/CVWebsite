# Phase 1 Fidelity Notes

## What still blocks near-perfect fidelity

- The current prototype does not yet reproduce the reference site's full media-plane choreography in `works`.
- White-scene inversion is present only as a scene-state change, not as a finished editorial section with full DOM/WebGL integration.
- No dedicated postprocessing composer yet.
  - Current look relies on shader-driven glow, room lines, and optical color.
  - The reference likely uses a more tuned bloom/noise/compositor stack.
- The `A` object is a custom prism approximation.
  - It is volumetric and refractive-looking, but not a one-to-one mesh match.
- Header / HUD are structurally aligned, but the reference has more nuanced microinteractions and text treatment.
- Page transition behavior through `Swup` is not wired into this hero prototype yet.
- The current repo remains `Next.js`, not `Astro`.
  - Runtime direction matches the contract: modular TS, Three, GSAP, Lenis, CSS modules.

## What Phase 2 should tackle

- Works gallery plane system with real media routing and DOM-anchored metadata
- White vision scene with proper hard inversion and iridescent identity moment
- Service / stellla scene-specific layouts
- Outro logo lockup scene
- Composer-based bloom/noise/aberration tuning
- More exact typography and navigation timing parity
