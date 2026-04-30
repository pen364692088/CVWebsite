# ALCHE Top-Page Visual Loop

Use this doc for the active `ALCHE` top-page program.

Current continuation chain is no longer only `works_cards`. The active visual loop now spans:

1. `kv`
2. `works_intro`
3. `works`
4. `works_cards`
5. `works_outro`
6. `mission_in`
7. `mission -> vision` prism turn
8. `vision` full-cover and rainbow-to-black face fade
9. post-cover `MOONFLOW` endmark SVG overlay
10. settled endmark footer links

Authority order is:

1. latest handoff:
   - [`docs/handoff/alche-top-page-handoff-2026-04-29.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/handoff/alche-top-page-handoff-2026-04-29.md)
2. current runtime code:
   - [`lib/alche-top-page.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts)
   - [`components/alche-top-page/alche-top-page-shell.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
   - [`scripts/validate-playwright.mjs`](/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/validate-playwright.mjs)
3. fresh local screenshots
4. reference video and task screenshots

Do not let old `works_cards-only` assumptions outrank this broader chain.

## Validation Truth

Default order:

1. `npm run build`
2. `npm run typecheck`
3. `npm run verify:static`

Then pick the smallest decisive visual validator:

- cards / works loop:
  - `node scripts/validate-playwright.mjs --cards-only`
  - `npm run verify:alche-cards`
  - or `npm run validate:playwright`
- works-outro wall / mission bridge:
  - `node scripts/validate-playwright.mjs --works-outro-live-only`
- wide live vision cover:
  - `node scripts/validate-playwright.mjs --vision-cover-live-only`
- post-cover endmark:
  - `node scripts/validate-playwright.mjs --endmark-live-only`

Important:

- do not run `typecheck` in parallel with `build`
- do not use fixed-state query screenshots as the authority for live end-state issues
- for `vision cover` and `endmark`, the live-scroll bottom path outranks query overrides

Current known suite fact:

- latest focused cards validation is green at commit `47d93c5`
- the latest `--works-outro-live-only` attempts closed headless Chromium after partial capture
- treat that as `pending-validation`, not as a product assertion failure, unless a fresh rerun proves otherwise
- full `npm run validate:playwright` should not be the only readiness authority until focused validators are stable

## Preferred Debug Entries

### Cards / works

Use `alcheShot`, not raw `alcheProgress`.

Examples:

- `/en/?alcheShot=cards-a-entry`
- `/en/?alcheShot=cards-a-center`
- `/en/?alcheShot=cards-b-queue`
- `/en/?alcheShot=cards-handoff-mid`
- `/en/?alcheShot=cards-settled`

Use `alcheCardDebug=identity` when order or ownership is in doubt.

### Mission / vision / endmark

Use the later-phase overrides when the issue is no longer a cards problem:

- `alcheMissionTurnProgress=...`
- `alcheVisionCoverProgress=...`
- `alcheEndmarkStage=black|guides|outline|fill|settled`
- `alcheEndmarkFooterProgress=...`
- `alcheEndmarkTimeScale=...`
- `alcheDisableEndmark=1`

Use them as diagnostics or fixed-state comparison only. Do not treat them as the final proof for live behavior.

### Prism glass / refraction

Use `__getAlcheLayerDebugState()` when checking the early cold-white glass prism:

- `prismRefractionCaptureCount`
- `prismRefractionTargetWidth`
- `prismRefractionTargetHeight`
- `prismRefractionLastCaptureMs`
- `prismRefractionCaptureMode`
- `prismRefractionActiveMotion`

Current intended feel:

- background letters and wall grid remain recognizable through the prism
- they are blurred and softened, not strongly liquid-distorted
- internal ice texture is a subtle material layer, not the dominant visible pattern

## What Must Be Proven

### Works / cards

Named-shot checks:

- `works-out`: `WORKS` is gone and cards are hidden
- `cards-a-entry`: only `A` is visible in the right-lower entry lane
- `cards-a-center`: only `A` is visible in the center lead lane
- `cards-b-queue`: `A` holds center while `B` appears in the right queue lane
- `cards-handoff-mid`: `A` moves left while `B` moves toward center
- `cards-settled`: `A` sits in the left support lane while `B` holds center

Free-scroll checks:

- cards do not appear before `WORKS` clears
- `A` appears before `B`
- queue and handoff happen in the right order

### Vision cover

Live-scroll checks:

- prism has already completed the right-facing side turn
- bottom live scroll reaches full `visionCoverProgress`
- final side face overscans the wide viewport with no residual white wedges
- blackening begins after cover progress passes halfway

### Endmark

Live-scroll checks:

- prism cover reaches terminal state first
- black overlay really takes over before the SVG sequence starts
- `grid -> guides -> outline -> fill -> settled` order is visible
- final `MOONFLOW` geometry is present as a shell-level SVG overlay, not as a resurrected Three scene
- after footer scroll, the left header brand is hidden while the right controls stay visible
- footer items are visual placeholders, not real links

## Desktop Validation Baselines

Current minimum desktop baselines are:

- `1440×1080`
- `2000×1080`
- `2560×1600` for card side-lane framing taste

The `2000×1080` path is now the critical wide-screen truth source for:

- `vision cover`
- `endmark live`

## Artifacts

Primary artifacts under `.playwright-artifacts/alche-top-page/`:

### Cards / works

- `works-out.png`
- `cards-a-entry.png`
- `cards-a-center.png`
- `cards-b-queue.png`
- `cards-handoff-mid.png`
- `cards-settled.png`
- `cards-b-queue-desktop-16x10.png`
- `cards-handoff-mid-desktop-16x10.png`
- `cards-settled-desktop-16x10.png`
- `cards-wheel-queue.png`
- `cards-wheel-handoff.png`
- `cards-wheel-queue-desktop-16x10.png`
- `cards-wheel-handoff-desktop-16x10.png`
- `reference-board.html`

### Vision cover

- `vision-cover-full.png`
- `vision-cover-full-desktop-2000x1080.png`
- `vision-cover-live-wheel-bottom-desktop-2000x1080.png`
- `vision-cover-black-mid.png`

### Endmark

- `endmark-black-desktop-2000x1080.png`
- `endmark-guides-desktop-2000x1080.png`
- `endmark-outline-desktop-2000x1080.png`
- `endmark-fill-desktop-2000x1080.png`
- `endmark-settled-desktop-2000x1080.png`
- `endmark-footer-settled-desktop-2000x1080.png`
- `endmark-live-black-desktop-2000x1080.png`
- `endmark-live-settled-desktop-2000x1080.png`

## Current Best Tuning Levers

If the issue is still in `works_cards`:

1. side-lane desktop aspect compensation
2. side-lane pose angle / radius offsets
3. only then deeper card geometry changes

If the issue is in later phases:

1. `ALCHE_TOP_CENTER_MODEL` constants in [`lib/alche-top-page.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts)
2. shell-owned overlay timing in [`components/alche-top-page/alche-top-page-shell.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
3. endmark SVG asset and overlay timeline

Do **not** start by reopening old `vision / service / outro` Three branches.

If the issue is early prism glass readability:

1. `uRefractionStrength`, `uLensWarpStrength`, and `uChromaticStrength` defaults in [`components/alche-top-page/scene/kv-scene-system.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
2. scene blur radius and scene/internal mix in [`components/alche-top-page/scene/alche-top-page-materials.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-materials.ts)
3. internal `iceBand`, `iceCloud`, `iceCrack`, and chroma weights

Do **not** move the camera or prism model just to make letters more readable.

## Known Traps

1. Do not claim live success from `alcheVisionCoverProgress=1` or `alcheEndmarkStage=settled` fixed-state alone.
2. Do not diagnose later-phase bugs as old cards bugs by default.
3. Do not start with global `baseRadius` for wide-screen cover problems.
4. Do not claim remote success for endmark or vision cover without fresh GitHub Pages screenshots.
5. Do not let a full-suite failure in the old wheel-handoff assertion erase targeted live evidence for later-phase work.
6. Do not tune glass readability only by lowering refraction strength; internal texture and chroma can still dominate.
7. Do not change refraction capture back to low-frequency-only; that caused scroll-time jumpiness.
