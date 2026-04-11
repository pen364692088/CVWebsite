# Alche Acceptance Criteria

## Status

- This document is implementation-facing.
- It evaluates the contract build as one continuous brand-space system.
- Completion language must stay `local-only` until screenshots and manual scroll validation are captured from the main route.

## Global Gates

### Required

- Main route `/[locale]/` opens the contract build by default.
- Only one fixed WebGL canvas exists across the whole flow.
- `Hero -> Works -> About -> Stella` reads as one world mutating, not multiple pages cutting.
- `Stella -> Contact` may exit deep 3D, but brand continuity must remain obvious.
- `prefers-reduced-motion` still preserves readable navigation and phase progression.
- `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run verify:static` pass.

### Failure Modes

- A section reads like a standalone landing page template.
- DOM text becomes the primary hero object instead of the 3D scene.
- A new canvas or disconnected scene stack appears.
- The scroll chain relies on flash cuts instead of spatial reassignment.

## Phase Gates

### Hero

#### Pass

- Stable read contains the three core 3D parents at once:
  - thick refractive `A`
  - emissive `ALCHE`
  - cylindrical media wall
- `A` reads as foreground authority.
- `ALCHE` reads as the midground backlight, not DOM overlay typography.
- The wall reads as the rear architectural body, not generic chamber dressing.
- Mouse response hierarchy reads as `A > ALCHE > wall`.
- Right HUD and bottom-left debug chrome are hero-only.

#### Fail

- `A` reads like a floating prism without a clear relationship to the wordmark and wall.
- The wall reads like a generic room background.
- The hero still depends on DOM `ALCHE` to sell the composition.

### `Hero -> Works`

#### Pass

- `ALCHE` exits before the works stable state.
- `WORK` sweep appears on the wall, not in DOM.
- Camera only reframes slightly; it does not become a dramatic stunt.
- `A` stays on the same central world axis while losing authority.
- One main card stabilizes in front, with side cards queued on an arc.
- Works metadata is DOM-bound to the active card.

#### Fail

- The works card system looks pasted over the hero.
- `A` and the main card fight for the same foreground authority.
- `WORK` reads like a floating title card rather than wall content.

### `Works -> About`

#### Pass

- Cards clear first.
- The cylindrical wall visibly interpolates toward a plane.
- White field rises from bottom to top.
- `A` whitens with the background and resolves into an outlined emblem.
- About stable state reads as a white technical field, not a new blank page.

#### Fail

- The transition reads like a hard cut to a white section.
- `A` swaps to a new asset instead of transforming with the same world.
- Curvature disappears instantly instead of flattening.

### `About -> Stella`

#### Pass

- `A` becomes the entry device instead of remaining a static emblem.
- Camera pushes and rotates past the edge of `A`, not through a generic flash or dissolve.
- The first stable Stella read is spatial / architectural.
- Large `stella` editorial type arrives after the architecture stabilizes.
- `stella` overlay is DOM, not wall content.

#### Fail

- The transition looks like an effect cut.
- The `stella` title arrives before the spatial scene is understood.
- Stella reads like a different template rather than a deeper continuation.

### `Stella -> Contact`

#### Pass

- Deep 3D drains out instead of hard-cutting.
- Contact settles into a mostly flat black brand stage.
- Giant `ALCHE` becomes dominant again.
- Footer/contact information stays secondary and quiet.

#### Fail

- Contact looks like a generic page pushed from below.
- Footer links become louder than the brand wordmark.
- The stage loses continuity with the prior system.

## Capture Checklist

Recommended capture directory:

- `docs/alche-runtime-captures/`

Required states:

1. `hero-intro-establish.png`
2. `hero-settled.png`
3. `works-wall-sweep.png`
4. `works-settled.png`
5. `about-flattening.png`
6. `about-settled.png`
7. `stella-pass-by-a-edge.png`
8. `stella-architecture-settled.png`
9. `stella-editorial-settled.png`
10. `contact-settled.png`

Recommended debug query shapes:

- `?alchePhase=hero&alcheHeroShot=hero-settled`
- `?alchePhase=works&alcheProgress=0.12`
- `?alchePhase=works&alcheProgress=0.72`
- `?alchePhase=about&alcheProgress=0.34`
- `?alchePhase=stella&alcheProgress=0.26`
- `?alchePhase=stella&alcheProgress=0.84`
- `?alchePhase=contact&alcheProgress=0.78`

## Remaining Blockers

Ranked by perceptual impact:

1. `A` still uses an approximate procedural optical stack rather than a scene-accurate refraction model.
2. The cylindrical wall currently proves structure and continuity before it proves authentic media content richness.
3. Works cards prove arc logic and authority shift, but not yet real project media fidelity.
4. Stella architecture is now spatially correct in role, but still sparse compared with the reference scene density.
5. Contact stage is structurally correct, but still needs final editorial spacing polish after capture review.
