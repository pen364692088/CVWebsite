# Alche Top-Page Handoff

Date: `2026-04-17`  
Scope: active `kv -> works -> works_cards` program on the ALCHE top page  
Current runtime mode: `kv-works`

## Program Goal

Treat this repo as `ALCHE visual reproduction` first.

Do not frame the current homepage work as a generic portfolio-homepage iteration unless the user explicitly broadens scope back to the archived portfolio layer.

## Current Status

- Main route `/{locale}/` is on the active `alche-top-page` runtime.
- The live path in use for this task is:
  - `loading`
  - `kv`
  - `works_intro`
  - `works`
  - `works_cards`
- This is no longer the earlier broad `full-chain` parity effort. The current loop is deliberately narrowed to the `works -> works_cards` choreography.
- Current state is:
  - `local dual-desktop validated`
  - `remote 16:10 validated`
  - not a claim of full reference parity

## Authority Order

Use these in order:

1. Local reference video:
   - [`Task/参考视频.mp4`](/mnt/d/Project/AIProject/MyProject/CVWebsite/Task/%E5%8F%82%E8%80%83%E8%A7%86%E9%A2%91.mp4)
2. Current shotbook and pose source:
   - [`data/alche-works-shotbook.json`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/alche-works-shotbook.json)
   - [`lib/alche-works-shotbook.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-works-shotbook.ts)
3. Focused workflow doc:
   - [`docs/alche-cards-visual-loop.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/alche-cards-visual-loop.md)
4. Reverse-engineering context:
   - [`docs/reverse-engineering/alche-timeline.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-timeline.md)
   - [`docs/reverse-engineering/alche-scene-and-ownership.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-scene-and-ownership.md)
   - [`docs/reverse-engineering/alche-frame-analysis.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-frame-analysis.md)

Do not use older parity framing as the main source of truth for current `works_cards` behavior.

## Latest Validated Baseline

Latest commit at time of handoff:

- `cfac105` `tune works 16:10 side lane compensation`

What this baseline proves:

- `works_cards` order is correct in free scroll:
  - `WORKS` clears
  - `A` appears from the right-lower lane
  - `A` moves to center
  - `B` appears from the right-lower queue lane
  - `A` moves to the left support lane while `B` moves to center
- card orientation uses the same arc solver as position, so trajectory and facing are not decoupled
- side lanes now have desktop aspect compensation for `16:10`
- GitHub Pages host defaults to `identity` card debug mode for this program

## Real Render Path

Single-canvas architecture remains intact:

- wall, cards, and center prism are all inside one Three/R3F canvas
- DOM shell handles locale routing, scroll sections, header, and debug controls

Key files:

- [`components/alche-top-page/alche-top-page-shell.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
- [`components/alche-top-page/alche-top-page-canvas.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-canvas.tsx)
- [`components/alche-top-page/use-top-page-scroll.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/use-top-page-scroll.ts)
- [`components/alche-top-page/scene/alche-top-page-scene.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-scene.tsx)
- [`components/alche-top-page/scene/kv-scene-system.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
- [`components/alche-top-page/scene/bent-card-helpers.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/bent-card-helpers.ts)

## Current Runtime Facts

- `ALCHE_TOP_RUNTIME_MODE = "kv-works"` in [`lib/alche-top-page.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts)
- `worksCardsProgress` is independent from `activeSection`, so free-scroll no longer jumps directly into late card poses
- `alcheShot` is the preferred debug entry for named card states
- `alcheCardDebug=identity|poster` is supported
- default identity mode is active for:
  - `alcheShot`
  - `alcheCapture`
  - local `localhost` / `127.0.0.1`
  - GitHub Pages host
- current shotbook states:
  - `works-out`
  - `cards-a-entry`
  - `cards-a-center`
  - `cards-b-queue`
  - `cards-handoff-mid`
  - `cards-settled`
- current card pose ids:
  - `entry-right-lower`
  - `lead-center`
  - `queue-right-lower-offscreen`
  - `queue-right-lower`
  - `support-left-upper`

## Validation Workflow

Use this order:

1. `npm run build`
2. `npm run typecheck`
3. `npm run verify:static`
4. `npm run validate:playwright`

Important:

- do **not** treat `typecheck` and `build` as one parallel readiness probe in this repo
- `.next/types` can be missing while `build` is still generating them, which creates false `tsc` failures

## Required Evidence

Local artifacts:

- [cards-b-queue.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/cards-b-queue.png)
- [cards-handoff-mid.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/cards-handoff-mid.png)
- [cards-settled.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/cards-settled.png)
- [cards-b-queue-desktop-16x10.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/cards-b-queue-desktop-16x10.png)
- [cards-settled-desktop-16x10.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/cards-settled-desktop-16x10.png)
- [cards-wheel-handoff-desktop-16x10.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/cards-wheel-handoff-desktop-16x10.png)
- [reference-board.html](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/reference-board.html)

Remote artifacts after `cfac105`:

- [remote cards-b-queue 16:10](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/remote-shots/cards-b-queue-remote-16x10-after-c9f8dcc.png)
- [remote cards-settled 16:10](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/remote-shots/cards-settled-remote-16x10-after-cfac105.png)
- [remote free-scroll handoff 16:10](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/remote-shots/free-scroll-handoff-remote-16x10-after-cfac105.png)

## What Is Actually Solved

- sequence correctness for free scroll
- `A/B` identity debugging
- arc trajectory + radial facing consistency
- local and remote validation for desktop `4:3`-like and `16:10`
- side-lane framing no longer depends only on fixed 1440px pixel thresholds

## What Is Still Open

- final aesthetic parity against the reference site may still need art-direction tuning
- if the user says “still差了点”, assume the issue is likely:
  - side-lane compensation magnitude
  - queue/support framing taste
  - not order, not identity mapping, not canvas architecture

## Best Next Move If Tuning Continues

If the user wants further desktop tuning:

- only touch `support-left-upper` / `queue-right-lower` aspect compensation first
- do not reopen:
  - global `baseRadius`
  - camera
  - full-chain sections
- validate both:
  - local dual desktop
  - remote `2560×1600`

## Known Traps

1. Do not use `alcheShot` proof alone to claim free-scroll is correct.
2. Do not use global `baseRadius` as the first lever for side-panel distance.
3. Do not diagnose this as DPR or raw resolution by default; the main issue is usually desktop aspect.
4. Do not claim remote success without fresh GitHub Pages screenshots.
5. Do not run `typecheck` in parallel with `build` and read the failure as a code regression.

## Suggested Continuation Prompt

```text
Continue the ALCHE works_cards loop from docs/handoff/alche-top-page-handoff-2026-04-17.md.
Keep runtime mode on kv-works.
Do not reopen full-chain parity.
Use identity mode, shotbook states, local dual-desktop validation, and remote 16:10 screenshots before claiming progress.
```
