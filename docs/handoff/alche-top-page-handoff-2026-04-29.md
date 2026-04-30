# MOONFLOW / Alche Top-Page Handoff

Date: `2026-04-29`

Scope: active `kv -> works_intro -> works -> works_cards -> works_outro -> mission_in -> mission turn -> vision cover -> endmark -> footer` program on the Alche top page

Current runtime mode: `kv-works`

## Program Goal

Treat this repo as `ALCHE visual reproduction` first, but the visible brand is now `MOONFLOW`.

The current continuation point is the full top-page chain through:

- early cold-white glass prism over the curved wall and large words
- unified A/B works-card queue choreography
- continuous light curved wall that flattens without black edges or detached side panels
- mission panel transition with prism bridge visibility
- mission / vision prism turn and cover
- shell-owned `MOONFLOW` endmark
- endmark footer links after the settled wordmark

Do not reopen old `vision / service / outro` Three runtime branches unless the user explicitly asks for that direction.

## Current Status

- Main route `/{locale}/` is still on the active `alche-top-page` runtime.
- User-visible brand copy is `MOONFLOW`; internal `ALCHE_*` constants, query params, filenames, and reproduction naming intentionally remain.
- Real scroll track continues through:
  - `loading`
  - `kv`
  - `works_intro`
  - `works`
  - `works_cards`
  - `works_outro`
  - `mission_in`
  - `mission`
  - `vision`
  - `outro`
- Real renderable Three scene still ends at `mission_in`; later `mission / vision / outro` sections are scroll-track drivers plus shell overlays.
- The post-cover brand sequence is shell-owned DOM/SVG, not legacy Three outro.
- Current status is:
  - `local targeted validated` for static build, static export, and cards-focused visual flow
  - `implemented and screenshot-inspected` for readable cold-white prism glass
  - `pending-validation` for the latest `--works-outro-live-only` run because headless Chromium closed after partial capture
  - `remote GitHub Pages evidence not refreshed in this handoff`

## Authority Order

Use these in order:

1. Current user-approved screenshots and latest visual direction
2. This handoff:
   - [`docs/handoff/alche-top-page-handoff-2026-04-29.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/handoff/alche-top-page-handoff-2026-04-29.md)
3. Current runtime constants and state derivation:
   - [`lib/alche-top-page.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts)
4. Current real render path:
   - [`components/alche-top-page/alche-top-page-shell.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
   - [`components/alche-top-page/alche-endmark-overlay.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-endmark-overlay.tsx)
   - [`components/alche-top-page/scene/kv-scene-system.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
   - [`components/alche-top-page/scene/alche-top-page-materials.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-materials.ts)
   - [`scripts/validate-playwright.mjs`](/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/validate-playwright.mjs)
5. Focused workflow doc:
   - [`docs/alche-cards-visual-loop.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/alche-cards-visual-loop.md)

Do not let older `works_cards-only` or `ALCHE`-brand framing outrank this handoff for current top-page continuation.

## Latest Validated Baseline

Latest commit at time of handoff:

- `47d93c5` `Tune prism glass readability`

Recent important commits in this visual chain:

- `c891668` `Unify works card entry choreography`
- `6166bfc` `Add ice material for early prism`
- `c2d4783` `Enhance prism glass refraction`
- `04be4f5` `Bridge prism visibility during mission transition`
- `fe5298a` `Optimize prism refraction capture`
- `379e203` `Smooth prism refraction during scroll`
- `c3dfa93` `Reduce prism refraction distortion`
- `47d93c5` `Tune prism glass readability`

Latest verified commands for `47d93c5`:

```bash
NODE_OPTIONS=--max-old-space-size=1024 npm run typecheck
NEXT_PRIVATE_BUILD_WORKER=false NODE_OPTIONS=--max-old-space-size=2048 npm run build
npm run verify:static
NODE_OPTIONS=--max-old-space-size=4096 node scripts/validate-playwright.mjs --cards-only
```

All four passed.

Additional attempted validation:

```bash
NODE_OPTIONS=--max-old-space-size=2048 node scripts/validate-playwright.mjs --works-outro-live-only
NODE_OPTIONS=--max-old-space-size=4096 node scripts/validate-playwright.mjs --works-outro-live-only
```

Both runs reached several captures, then failed with `Target page, context or browser has been closed`. Treat that as `pending-validation`, not as a product assertion failure.

## Real Render Path

Current top-page ownership is split like this:

- One real Three/R3F canvas for:
  - wall
  - MOONFLOW / WORKS text
  - early glass prism
  - works cards
- Secondary edge-overlay canvas for:
  - line-art / edge / rainbow face layer above the mission white panel
- DOM shell for:
  - locale routing
  - section track
  - header
  - mission transition panel
  - mission tiled grid background
  - endmark overlay host
  - endmark footer links
- DOM/SVG terminal overlay for:
  - black takeover
  - MOONFLOW endmark grid / guides / outline / fill
  - line fade to settled wordmark

Key files:

- [`components/alche-top-page/alche-top-page-shell.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
- [`components/alche-top-page/alche-top-page-shell.module.scss`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.module.scss)
- [`components/alche-top-page/alche-top-page-canvas.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-canvas.tsx)
- [`components/alche-top-page/use-top-page-scroll.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/use-top-page-scroll.ts)
- [`components/alche-top-page/scene/kv-scene-system.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
- [`components/alche-top-page/scene/alche-top-page-materials.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-materials.ts)
- [`components/alche-top-page/alche-endmark-overlay.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-endmark-overlay.tsx)
- [`public/alche-top-page/endmark/alche-wordmark-blueprint.svg`](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/endmark/alche-wordmark-blueprint.svg)
- [`public/alche-top-page/mission/mission-grid-tile.png`](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/mission/mission-grid-tile.png)

## Current Runtime Facts

- `ALCHE_TOP_RUNTIME_MODE = "kv-works"`
- `ALCHE_TOP_RENDERABLE_SECTIONS` still end at `mission_in`
- `ALCHE_TOP_SCROLL_TRACK_SECTIONS` extend through `outro`
- center model asset:
  - `/alche-top-page/kv/triangular-through-hole-solid.glb`
- early full prism material:
  - cold-white transparent glass via `createPrismIceMaterial()`
  - true screen-space background refraction from a `WebGLRenderTarget`
  - readable-blur tuning:
    - `ALCHE_TOP_PRISM_READABLE_REFRACTION_STRENGTH = 0.045`
    - `ALCHE_TOP_PRISM_READABLE_LENS_WARP_STRENGTH = 0.75`
    - `ALCHE_TOP_PRISM_READABLE_CHROMATIC_STRENGTH = 0.0012`
  - active refraction target max: `384`
  - idle / first capture target max: `512`
  - active capture interval: about `1 / 30`
  - idle capture interval: about `0.5s`
- wall is now parametric UV-domain geometry:
  - not finite `CylinderGeometry`
  - no `atan` angle wrap
  - no edge reveal side panels
  - concave sag with monotonic X
  - current curve depth scale: `1.70352`
- card choreography uses one shared queue track:
  - `queue-right-lower-offscreen`
  - `queue-right-lower`
  - `lead-center`
  - `support-left-upper`
  - A and B both use the same queue entry logic
- endmark trigger is shell-owned:
  - `visionCoverProgress >= 0.98`
  - unless `alcheDisableEndmark=1`
- endmark footer is outro-scroll driven:
  - `endmarkFooterProgress`
  - `data-endmark-footer-progress`
  - `data-endmark-footer-visible`
  - `data-header-brand-hidden`

Useful debug query params:

- `alcheShot=...`
- `alcheCardDebug=identity|poster`
- `alcheMissionTurnProgress=...`
- `alcheVisionCoverProgress=...`
- `alcheEndmarkStage=black|guides|outline|fill|settled`
- `alcheEndmarkFooterProgress=...`
- `alcheEndmarkTimeScale=...`
- `alcheDisableEndmark=1`
- `alchePointerDebug=1`

Useful runtime debug state:

- `__getAlcheLayerDebugState()`
  - includes card state, wall state, prism opacity bridge values, and refraction capture metrics
- `__getAlcheEndmarkDebugState()`
  - includes endmark stage plus grid / guide / outline / fill alpha values

## Validation Workflow

Use this order:

1. `npm run build`
2. `npm run typecheck`
3. `npm run verify:static`

For this repo, `typecheck` also passes before build now, but do not parallelize it with `build`.

Then choose the smallest decisive visual validator:

- cards / early prism:
  - `node scripts/validate-playwright.mjs --cards-only`
  - or `npm run verify:alche-cards`
- works-outro wall / mission bridge:
  - `node scripts/validate-playwright.mjs --works-outro-live-only`
- post-cover endmark:
  - `node scripts/validate-playwright.mjs --endmark-live-only`
- full suite:
  - `npm run validate:playwright`
  - use only after focused paths are green, because this suite has historically contained old wheel-handoff blockers

Important:

- do not claim a visual fix from code inspection alone
- query fixed-state screenshots are diagnostics, not final live proof
- for endmark and footer, live bottom captures outrank debug query overrides
- if `--works-outro-live-only` closes Chromium without product assertions, report it as validator instability / pending-validation

## Current Evidence

Fresh inspected artifacts from the latest prism readability pass:

- [cards-a-entry.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/cards-a-entry.png)
- [works-out.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/works-out.png)
- [cards-a-center.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/cards-a-center.png)
- [mission-in-panel.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/mission-in-panel.png)

Useful artifacts for continued checks:

- [works-outro-prism-bridge-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/works-outro-prism-bridge-desktop-2000x1080.png)
- [mission-in-prism-bridge-early-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/mission-in-prism-bridge-early-desktop-2000x1080.png)
- [endmark-settled-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-settled-desktop-2000x1080.png)
- [endmark-footer-settled-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-footer-settled-desktop-2000x1080.png)
- [endmark-live-settled-desktop-2000x1080.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/endmark-live-settled-desktop-2000x1080.png)

## What Is Actually Solved

- user-visible brand changed to `MOONFLOW`
- post-cover endmark now draws `MOONFLOW`
- endmark grid / guides / outline fade out after fill; settled state keeps fill and glow only
- footer links appear after settled endmark via extra `outro` scroll space
- header brand hides when footer is visible
- mission panel uses the tiled grid asset under the shallow light model view
- A card now uses the same queue entry logic as B
- works wall uses a continuous parametric concave wall and avoids prior black edges / detached side panels
- wall grid density and curvature were tuned; current curve depth scale is `1.70352`
- early prism is now cold-white readable glass:
  - real background is sampled
  - scroll refraction capture is adaptive and smoother
  - latest tuning favors readable blurred letters over strong liquid distortion
- mission transition prism gap was bridged by keeping full prism visibility into early `mission_in` and letting edge overlay take over

## What Is Still Open

- `--works-outro-live-only` needs a clean rerun after the latest handoff; last two attempts closed headless Chromium after partial capture
- remote GitHub Pages screenshots for the newest glass / footer / wall state are not refreshed in this handoff
- full `npm run validate:playwright` should not be treated as the only readiness authority until focused validators are stable
- prism glass may need another art-direct pass if the user wants even clearer or even softer letters
- footer links are visual placeholders only; they intentionally do not have real hrefs

## Best Next Move If Tuning Continues

If the user keeps tuning early prism glass:

- first adjust shader composition in `createPrismIceMaterial()`
- keep the true background capture path
- prefer `scene blur / internal texture weight / chroma mask` levers
- do not move the model or camera just to change readability

If the user keeps tuning works-outro wall:

- keep the parameter-domain wall model
- do not return to `CylinderGeometry`, `atan`, `fract(angle)`, or side-edge reveal
- rerun `--works-outro-live-only` and inspect real scroll screenshots

If the user keeps tuning endmark / footer:

- keep endmark and footer shell-owned
- use `--endmark-live-only`
- verify `data-header-brand-hidden` and footer visibility in the settled footer state

## Known Traps

1. Do not use the old `ALCHE` visible brand as current truth; only internal names remain.
2. Do not call the prism glass fixed from code alone. Inspect `cards-a-entry` or another fresh screenshot.
3. Do not reduce prism distortion only by `uRefractionStrength`; internal texture, band, crack, chroma, and scene blur weights also control readability.
4. Do not change refraction capture back to low-frequency-only; that caused scroll-time jumpiness.
5. Do not restore finite cylinder wall logic; it caused black viewport edges, seams, and detached panels.
6. Do not diagnose endmark footer issues as Three outro bugs; footer is shell DOM over the endmark black layer.
7. Do not stage existing untracked `.agents/`, `code_review.md`, `scripts/run_verify.sh`, or `test/*.png` unless the user explicitly asks.

## Suggested Continuation Prompt

```text
Continue the MOONFLOW / Alche top-page loop from docs/handoff/alche-top-page-handoff-2026-04-29.md.
Keep runtime mode on kv-works.
Treat visible brand as MOONFLOW while keeping internal ALCHE names stable.
Current latest commit is 47d93c5 Tune prism glass readability.
Before changing visuals, inspect the latest screenshot artifacts and choose the smallest focused validator:
--cards-only for early prism/cards,
--works-outro-live-only for wall/mission bridge,
--endmark-live-only for endmark/footer.
Do not claim a visual fix without fresh screenshot evidence.
```
