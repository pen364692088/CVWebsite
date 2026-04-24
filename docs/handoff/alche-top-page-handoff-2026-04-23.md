# Alche Top-Page Handoff

Date: `2026-04-23`  
Scope: active `kv -> works_intro -> works -> works_cards -> works_outro -> mission_in -> mission turn -> vision cover -> endmark` program on the ALCHE top page  
Current runtime mode: `kv-works`

## Program Goal

Treat this repo as `ALCHE visual reproduction` first.

Current real target is no longer only `works_cards`. The active continuation point is the full top-page chain through:

- center prism camera-facing inverted baseline
- mission mask transition
- right-side prism turn
- vision cover overscan and rainbow-to-black face fade
- bottom black-screen takeover
- SVG geometric `ALCHE` endmark construction sequence

Do not reopen old `vision / service / outro` Three runtime branches unless the user explicitly asks for that direction.

## Current Status

- Main route `/{locale}/` is still on the active `alche-top-page` runtime.
- Real scroll track now continues through:
  - `loading`
  - `kv`
  - `works_intro`
  - `works`
  - `works_cards`
  - `works_outro`
  - `mission_in`
  - `mission`
  - `vision`
- Real renderable Three scene still ends at `mission_in`; the later `mission / vision` sections are scroll-track drivers, not reopened legacy scene branches.
- After prism cover reaches its terminal vision state, a shell-level DOM/SVG overlay now takes over and plays the endmark sequence.
- Current status is:
  - `local targeted live validated` for vision cover and endmark
  - `fixed-state and live-state aligned` for the endmark overlay
  - `full-suite still pending-cleanup` because one older wheel-handoff assertion is still failing outside the endmark path

## Authority Order

Use these in order:

1. Current user-approved visual direction and latest task screenshots
2. This handoff:
   - [`docs/handoff/alche-top-page-handoff-2026-04-23.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/handoff/alche-top-page-handoff-2026-04-23.md)
3. Current runtime constants and state derivation:
   - [`lib/alche-top-page.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts)
4. Current real render path:
   - [`components/alche-top-page/alche-top-page-shell.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
   - [`components/alche-top-page/alche-endmark-overlay.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-endmark-overlay.tsx)
   - [`scripts/validate-playwright.mjs`](/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/validate-playwright.mjs)
5. Focused workflow doc:
   - [`docs/alche-cards-visual-loop.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/alche-cards-visual-loop.md)

Do not let older `works_cards-only` framing outrank this handoff for current top-page continuation.

## Latest Validated Baseline

Latest commit at time of handoff:

- `0bd60b9` `Add animated ALCHE endmark overlay`

What this baseline proves:

- center prism uses the through-hole asset and now starts inverted and camera-facing in `kv`
- prism rotates to a right-facing side profile across `mission -> vision`
- prism scales through `visionCoverProgress` and overscans at `coverScale = 6.2`
- rainbow face blackening begins after cover progress passes `0.5`
- the post-cover endmark sequence is not query-only anymore; it is proven on a real live-scroll bottom path
- endmark live validation now uses fresh independent runs for `black` and `settled`, avoiding the previous same-session false failure

## Real Render Path

Current top-page ownership is split like this:

- One real Three/R3F canvas for:
  - wall
  - center prism
  - works cards
- DOM shell for:
  - locale routing
  - section track
  - header
  - mission panel overlay
  - endmark overlay host
- Secondary edge-overlay canvas for:
  - line-art / edge / rainbow face layer that sits above the mission white panel
- DOM/SVG terminal overlay for:
  - black takeover
  - grid / guides / outline / fill endmark animation

Key files:

- [`components/alche-top-page/alche-top-page-shell.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
- [`components/alche-top-page/alche-top-page-shell.module.scss`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.module.scss)
- [`components/alche-top-page/alche-top-page-canvas.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-canvas.tsx)
- [`components/alche-top-page/use-top-page-scroll.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/use-top-page-scroll.ts)
- [`components/alche-top-page/scene/alche-top-page-scene.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-scene.tsx)
- [`components/alche-top-page/scene/kv-scene-system.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
- [`components/alche-top-page/alche-endmark-overlay.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-endmark-overlay.tsx)
- [`public/alche-top-page/endmark/alche-wordmark-blueprint.svg`](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/endmark/alche-wordmark-blueprint.svg)

## Current Runtime Facts

- `ALCHE_TOP_RUNTIME_MODE = "kv-works"`
- `ALCHE_TOP_RENDERABLE_SECTIONS` still end at `mission_in`
- `ALCHE_TOP_SCROLL_TRACK_SECTIONS` extend through `mission` and `vision`
- center model asset:
  - `/alche-top-page/kv/triangular-through-hole-solid.glb`
- center prism base pose:
  - `baseRotationX = 0`
  - `baseRotationY = 0.002754`
  - `baseRotationZ = Math.PI`
- current later-phase motion:
  - `missionTurnRadians = 1.57`
  - `coverScale = 6.2`
- current rainbow face selection is driven by `rainbowFaceNormal = [0.866025, 0.5, 0]`
- endmark trigger is shell-owned:
  - `visionCoverProgress >= 0.98`
  - unless `alcheDisableEndmark=1`

Useful debug query params:

- `alcheShot=...`
- `alcheCardDebug=identity|poster`
- `alcheMissionTurnProgress=...`
- `alcheVisionCoverProgress=...`
- `alcheEndmarkStage=black|guides|outline|fill|settled`
- `alcheEndmarkTimeScale=...`
- `alcheDisableEndmark=1`
- `alchePointerDebug=1`

## Validation Workflow

Use this order:

1. `npm run build`
2. `npm run typecheck`
3. `npm run verify:static`

Then choose the smallest decisive validator for the visual area you changed:

- cards / works loop:
  - `npm run validate:playwright`
- wide live vision cover:
  - `node scripts/validate-playwright.mjs --vision-cover-live-only`
- post-cover endmark:
  - `node scripts/validate-playwright.mjs --endmark-live-only`

Important:

- do **not** treat query fixed-state screenshots as authority for live end-state issues
- for `vision cover` and `endmark`, live-scroll bottom captures are the main proof
- current full `npm run validate:playwright` still contains an older blocker:
  - `Expected mission_in settled to occur after mission_in panel`
  - treat this as an existing unrelated assertion unless you are actively fixing that wheel-handoff path

## Required Evidence

Primary local artifacts for the current continuation point:

- [mission-turn-side.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/mission-turn-side.png)
- [vision-cover-full.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/vision-cover-full.png)
- [vision-cover-full-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/vision-cover-full-desktop-2000x1080.png)
- [vision-cover-live-wheel-bottom-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/vision-cover-live-wheel-bottom-desktop-2000x1080.png)
- [endmark-black-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-black-desktop-2000x1080.png)
- [endmark-guides-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-guides-desktop-2000x1080.png)
- [endmark-outline-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-outline-desktop-2000x1080.png)
- [endmark-fill-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-fill-desktop-2000x1080.png)
- [endmark-settled-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-settled-desktop-2000x1080.png)
- [endmark-live-black-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-live-black-desktop-2000x1080.png)
- [endmark-live-settled-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-live-settled-desktop-2000x1080.png)

## What Is Actually Solved

- camera-facing inverted prism baseline in `kv`
- mission mask split between shaded prism and line-art lower portion
- `mission -> vision` side turn
- vision cover scale and blackening chain on the selected prism face
- wide live bottom-cover validation no longer relies on fixed-state impostors
- post-cover black-screen takeover
- SVG-based geometric `ALCHE` endmark playback with:
  - background glow
  - grid
  - guides
  - outline draw
  - fill reveal

## What Is Still Open

- full `npm run validate:playwright` is not yet a clean green suite because of the older wheel-handoff assertion
- remote GitHub Pages evidence for the new endmark sequence is still missing
- the endmark asset is currently a repo-authored SVG baseline, not yet a final Figma / Illustrator export

## Best Next Move If Tuning Continues

If the user wants to keep iterating on the post-cover chain:

- adjust the authored SVG geometry or timing first
- keep the endmark as a shell-level DOM/SVG program
- do not reopen old Three-based `vision / service / outro` branches
- validate with:
  - `--vision-cover-live-only`
  - `--endmark-live-only`

If the user wants full-suite closure:

- fix the existing `captureRealWheelHandoff` assertion before treating `npm run validate:playwright` as a reliable all-green authority again

## Known Traps

1. Do not use `alcheEndmarkStage=settled` fixed-state alone to claim the live sequence works.
2. Do not use the old same-session `black -> settled` live capture assumption; fresh runs are the current reliable validator shape.
3. Do not diagnose post-cover issues as old `vision` runtime bugs by default; current ownership is shell overlay plus existing prism cover chain.
4. Do not claim remote success for the endmark sequence without fresh GitHub Pages captures.
5. Do not let `works_cards` docs override this handoff for later-phase prism/endmark work.

## Suggested Continuation Prompt

```text
Continue the ALCHE top-page loop from docs/handoff/alche-top-page-handoff-2026-04-23.md.
Keep runtime mode on kv-works.
Treat mission turn, vision cover, and post-cover endmark as the active continuation chain.
Use targeted live validators for vision cover and endmark before claiming progress.
```
