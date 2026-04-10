# Motion Timeline Contract: alche.studio

## Global Motion Assumptions

- Smooth scroll is continuous via `Lenis`; section logic is still snap-aware.
- Most UI chrome uses `0.3s` to `0.5s` transitions.
- Scene-selector and section-entry beats resolve around `0.5s`.
- Large hero/logo adjustments resolve around `1s`.
- Loading logo reveal on top page runs about `1.8s`.
- Proven easing: loading logo uses `cubic-bezier(0.53, 0.25, 0.3, 0.99)`.
- Proven programmatic scroll easing: cubic in/out equivalent.

## Phase Map

| Phase | Scroll / Time Span | Camera State | Main Logo State | Key Behavior | Confidence |
| --- | --- | --- | --- | --- | --- |
| P0 `loading` | initial load | scene hidden under overlay | hidden, then lottie/logo reveal | text scramble, loading lottie, top-page lock | known |
| P1 `kv` | `kv` | perspective camera, base near `(0,0,10)`, tighter FOV via `kvZoom=1`, mouse parallax active | volumetric prism, centered hero anchor | room establishes depth; scroll cue appears | known + inferred |
| P2 `works_intro` | `works_intro` | camera relaxes back toward base z/fov | logo rotation intensity increases | bridge out of hero, no hard cut | inferred from section config |
| P3 `works` | `works` | neutral perspective, mouse drift retained | prism remains present, animated by works rotation settings | fixed editorial titles + GL media planes on curved path | known + inferred |
| P4 `works_outro` | `works_outro` | mouse offset suppressed by outro progress | logo rotation begins to calm | gallery exits without abrupt camera jump | known + inferred |
| P5 `mission_in` | `mission_in` | stable camera, prep state | logo de-emphasized | white-phase pre-roll buffer | inferred |
| P6 `mission` | `mission` | stable, no hero zoom | low-motion / held state | editorial text becomes primary | known + inferred |
| P7 `vision` | `vision` | stable, light-scene emphasis | logo enters vision-specific rotate/screen path | scene inverts to light; chrome flips black | known + inferred |
| P8 `vision_out` | `vision_out` | stable, release from white | logo continues toward screen morphology | white field fades out rather than cuts out | inferred |
| P9 `service_in` | `service_in` | stable, service transition buffer | service-in uniform drives screen state | refractive prism becomes optical display surface | known + inferred |
| P10 `service` | `service` | neutral stage camera | logo behaves as screen / portal object | service cards float over spatial black field | known + inferred |
| P11 `stellla` | `stellla` | still camera, framed close | hero logo no longer dominant | framed product chamber with overlay lines/crosses | known |
| P12 `outro/footer` | `200vh` outro wrapper | separate outro canvas; lockup-centered | standalone `A` lockup | centered outro mark, then footer release | known |

## Hero Intro

- Start from total blackout via loading overlay.
- Reveal order: loading bg lottie -> slogan scramble -> logo lottie -> overlay fade.
- After overlay clears, the spatial room must already exist behind the hero.
- Hero should not read as a static image. Depth must be visible before the user scrolls.

## Main Logo Behavior

- `kv`: prism `A` is volumetric, centered, optically refractive, mouse-reactive.
- `works_intro` and `works`: logo rotation intensity increases.
- `mission`: logo stops being the dominant actor.
- `vision`: logo enters a light-compatible state.
- `service_in` and `service`: logo gains explicit screen/portal behavior with internal distortion/noise.
- `outro`: logo resolves to a pure lockup silhouette on its own canvas.

## Works Gallery Behavior

- The DOM title list is fixed over the viewport.
- Works media are GL-driven planes synchronized to DOM data.
- Title and media movement should feel orbital / curved, not stacked-card vertical.
- Exit from works must slow and settle before the mission/vision inversion.

## White Vision Scene Transition

- This is a scene inversion, not a background-color toggle.
- The header, contact button stroke, and icon fills invert to black.
- The main logo should survive the inversion as geometry, not disappear into plain typography.
- White phase duration is materially longer than a flash transition.

## Service / stellla Transition

- `service_in` is a required buffer.
- The logo screen effect ramps before the service content fully takes over.
- `stellla` is not another service card. It is a framed chamber with overlay lines, corner crosses, and a dimmed black glass mask.
- Header hides or recedes during `stellla`.

## Outro / Footer Logo Lockup

- Outro owns a separate canvas and its own scroll span.
- The centered `A` lockup must feel ceremonial, not like a footer badge.
- Footer content is released after the outro resolves, not in parallel with the hero system.

## Easing Assumptions

- UI chrome: `0.3s`, `power2.out` equivalent.
- Section scene switches: `0.5s`, smooth ease-out.
- Hero zoom / logo macro transitions: `1s`, non-bouncy ease.
- Loading overlay exit: `0.8s`, `power2.out`.
- Use no springy consumer-app easing.

## Camera State Notes

- Proven base controller: perspective camera around `(0,0,10)`.
- Proven hero bias: z pulls forward by `0.5` and FOV tightens by `4` units during `kv`.
- Proven mouse parallax range: `0.5`.
- Proven works-outro coupling: mouse response is damped by outro progress.
- Unknown: exact camera quaternion per phase and any hidden target offsets beyond the exposed controller.

## Acceptance Criteria

- This file names all major time/scroll phases from load to footer.
- Each major requested beat is covered: hero, main logo, works, white vision, service/stellla, outro/footer.
- Every phase includes camera state and easing assumptions.
- Unknown motion details remain marked as unknown instead of fabricated.
