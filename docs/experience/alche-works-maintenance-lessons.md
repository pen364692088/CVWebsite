# Alche Top-Page Maintenance Lessons

These are project-local lessons for the active `ALCHE` top-page program.

## `alche-exp-0001` Free Scroll And Named Shots Can Diverge

`alcheShot` can look correct while real wheel-driven progression is still wrong.  
Default rule: any change to order, reveal timing, or card ownership must validate both:

- named shots
- free-scroll capture

Do not accept a choreography change from `alcheShot` alone.

## `alche-exp-0002` Identity Mode Is The Fastest Way To Diagnose Order Bugs

When the user says the card order looks wrong, poster art slows diagnosis because role and identity are easy to confuse.  
Use fixed-identity cards first:

- `card0 = A`
- `card1 = B`

Only return to poster art after order and ownership are proven.

## `alche-exp-0003` Side-Lane Distance Is Usually An Aspect Problem, Not A Global Radius Problem

On this project, “side card feels too close to the center card” is usually a desktop aspect/framing issue, especially on `16:10`.  
Do **not** default to increasing global `baseRadius`.  
Better first levers:

- side-lane `angle`
- side-lane `radiusOffset`
- runtime aspect compensation for side poses

## `alche-exp-0004` Validate Side Panels With Ratios, Not Only Fixed Pixels

Fixed `1440px` thresholds make the framing look correct on one desktop and drift inward on another.  
For support/queue lanes, use normalized screen-space checks:

- `screenLeftRatio`
- `screenRightRatio`
- `widthRatio`
- `centerYRatio`

This is the durable validator shape for desktop adaptation.

## `alche-exp-0005` Do Not Parallelize `build` And `typecheck` As One Readiness Signal

In this repo, `.next/types` may not exist yet while `build` is still generating them.  
If `tsc --noEmit` runs in parallel with `build`, it can fail even when the code is fine.

Correct order:

1. `npm run build`
2. `npm run typecheck`
3. `npm run verify:static`
4. `npm run validate:playwright`

## `alche-exp-0006` Scroll-Owned Section State Must Not Be Deferred

For the ALCHE top-page program, `activeSection / trackedSection / sectionProgress` are not cosmetic UI state.
They directly control the Three scene, card visibility, and free-scroll validation.

Do not wrap the scroll-owned section sync path in deferred transitions.
If these updates are delayed, the visual chain can drift into a wrong section even while the DOM scroll position is already correct.

Rule for this program:

- write the scroll-owned refs immediately
- update section state synchronously
- treat validator failures around skipped sections as possible ownership latency before changing pose math

## `alche-exp-0007` Mission Prism Fade Should Follow Mask Coverage

In `works_outro -> mission_in`, fading the center prism directly from `missionIn.whiteMix` or `emblemMix`
can make it disappear before the mission mask visually reaches it.

For this transition:

- keep prism residual visibility alive through early `mission_in`
- let late fade be driven by mission panel occlusion progress
- verify both `mission-in-panel` and real `mission-in-wheel-panel`

## `alche-exp-0008` Active Homepage Should Have One Real Render Path

When the active homepage is supposed to be `kv-works`, do not keep a second "minimal/background-only"
render tree that silently changes which scene systems mount.

That kind of fork makes screenshot debugging misleading:

- opacity or pose tweaks can look correct in code but never reach the real viewport
- DOM overlay timing can appear to be the bug while the actual 3D layer is not mounted
- shell/canvas can drift if transition state is recomputed in two places

Default rule for this program:

- keep one active scene tree for the real homepage
- centralize shared transition state such as mission panel/outline progress
- if a visual bug "doesn't move" after reasonable tuning, verify the layer is actually mounted on the active path before changing more math

## `alche-exp-0009` Verify Visual Ownership From Fresh Frames, Not Component Names

On the ALCHE top-page, the user-facing identity of a visual layer can diverge from how the code is named.
In this bug, the large transparent A-shaped object came from `HeroPrism`, while the purple triangle the user wanted
to keep was `CenterHeroModel`.

Default rule for this program:

- when the user says "delete X, keep Y", verify the mapping against fresh local screenshots before deleting components
- do not assume `HeroPrism` is the desired prism just because of the name
- if local issue screenshots exist in `test/`, use them as the fastest authority for layer ownership before changing mounts or validators

## `alche-exp-0010` Flatten Curved Walls Without Sacrificing Edge Coverage

When a full-width curved wall is flattened toward a plane, the failure mode on wider real-scroll desktops is not just
"black seam at the edge". One fix can solve the seam and still be wrong if it reintroduces the wall ends into frame.

On this project, the dangerous combination is:

- a black scene background / clear color
- a wall material rendered on `BackSide`
- `works_outro -> mission_in` flattening near the planar limit
- desktop widths wider than the existing `16:10` validator path

Default rule for this program:

- keep the wall visually close to fully flattened so the ends stay out of frame
- clamp geometry flatten just below the degeneracy point instead of preserving large outer arcs
- switch the main wall to a temporary cull-safe mode such as `DoubleSide` in the high-flatten window
- validate on a wider real-scroll desktop path, not only `16:10` named shots

## `alche-exp-0011` Live End-State Authority Must Outrank Query Fixed-State

For `vision cover` and `endmark`, query-driven fixed states are useful diagnostics, but they are not the main truth source.
The failure mode is easy to miss:

- fixed-state `alcheVisionCoverProgress=1` looks correct
- fixed-state `alcheEndmarkStage=settled` looks correct
- user real scroll still lands in a different end state

Default rule for this program:

- use fixed-state screenshots as comparison artifacts
- use live wide-scroll bottom captures as the authority for terminal states
- if fixed-state passes but live-state fails, fix the validator chain before tuning visuals

## `alche-exp-0012` Post-Cover Brand Sequences Belong In A Shell Overlay, Not A Reopened Three Runtime

The `ALCHE` endmark sequence after prism cover was more stable and easier to art-direct once it moved out of the folded later-phase Three state machine.

Default rule for this program:

- keep the prism cover in the existing Three chain
- let the shell own the black-screen takeover and post-cover brand sequence
- prefer authored `SVG + DOM overlay + timeline` for geometric logo construction work
- do not reopen legacy `vision / service / outro` scene branches unless the user explicitly wants that route

## `alche-exp-0013` Animated SVG Overlays Should Mutate Real SVG State, Not Trust React To Hold InnerHTML

The first endmark implementation had a false-positive validation trap:

- React re-renders could wipe `dangerouslySetInnerHTML` mutations
- fixed-stage screenshots could still be misleading if timeline progress and actual SVG draw state drifted apart

Default rule for this program:

- inject the authored SVG into a stable host ref
- drive `opacity`, `visibility`, `stroke-dasharray`, `stroke-dashoffset`, and mask geometry directly on the real SVG nodes
- for debug stages, apply explicit stage snapshots instead of pretending normalized progress equals a visual state

## `alche-exp-0014` Separate Fresh Live Runs Are Safer Than Multi-Stage Captures In One Browser Session

The endmark validator originally tried to capture `black` and `settled` in one live browser session.
That produced a false failure even though the page could reach `settled` in isolation.

Default rule for this program:

- when validating staged live animations, capture early and late states in separate fresh runs if a single-session chain proves unstable
- assert the real debug state at capture time
- keep the screenshot authority tied to the same live path the user actually sees

## `alche-exp-0015` Curved Walls Should Use Continuous Parameter Space, Not Cylinder Edge Repair

The works-outro wall seam work showed that finite cylinder edges, `atan` angle recovery, side switching,
and edge reveal patches create new failures while fixing black borders.

The durable shape for this page is a single high-subdivision parameter-domain wall:

- continuous `aWallU / aWallV`
- monotonic X mapping
- concave Z sag for the curved state
- `uFlatten` reducing curvature to zero
- grid lines derived from wall UV, not screen coordinates or wrapped angles

Default rule for this program:

- do not return to finite `CylinderGeometry` for the works wall
- avoid `atan`, `fract(angle)`, and edge reveal logic for visible wall coverage
- tune curvature, wall half-width, and grid density in the parameter-domain wall shader
- validate with real wide-scroll screenshots before claiming wall coverage

## `alche-exp-0016` Readable Glass Is Blur Plus Subtle Refraction, Not Maximum Distortion

The early prism looked impressive with strong screen-space refraction, but the user-visible goal changed:
letters behind the prism should remain slightly readable and mostly blurred.

For this page, the prism glass has three independent contributors:

- background scene sampling offset
- scene blur / background mix
- internal ice texture, bands, cracks, clouds, and chroma

Default rule for this program:

- do not tune readability only by lowering `uRefractionStrength`
- reduce lens warp, chroma, internal bands, clouds, cracks, and texture mix together
- keep true background scene sampling so letters and grid really pass through the prism
- prefer "small offset plus blur" over liquid distortion
- verify with fresh `cards-a-entry` or `works-out` screenshots

## `alche-exp-0017` Refraction Capture Needs Active And Idle Modes

The first performance fix reduced background capture frequency too much, which made scroll-time refraction visibly jump at a low frame rate.

Current rule:

- active scrolling / camera / prism motion should capture at about `1 / 30s` with a lower max target size
- idle should fall back to a slower refresh and a clearer target
- invisible prism, late split mission state, and fixed capture mode should skip unnecessary capture

Do not solve performance by forcing all states into a low-frequency capture cadence.
The perceived smoothness during scroll matters more than idle render-target sharpness.

## `alche-exp-0018` Visible Brand Can Change Without Renaming Internal Reproduction Surfaces

The site now presents `MOONFLOW` to users, but the implementation still contains many `ALCHE_*` constants,
debug query params, filenames, and docs for the reproduction program.

Default rule:

- user-facing copy and visual artifacts should say `MOONFLOW`
- internal constants, debug APIs, and historical reproduction names can remain `ALCHE` when renaming would risk breaking validators
- do not treat an internal `ALCHE_*` identifier as a visible-brand regression
- do treat visible `ALCHE` text in screenshots, exported HTML, or UI copy as a regression unless it is historical documentation
