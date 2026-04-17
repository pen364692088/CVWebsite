---
name: alche-works-visual-loop
description: Use when iterating on the ALCHE `works -> works_cards` choreography, card lanes, desktop aspect adaptation, identity A/B debugging, or remote GitHub Pages visual parity. Prefer this over generic visual tweaking when the task is specifically about the ALCHE top-page works program.
---
# alche-works-visual-loop

Use this skill for the active ALCHE top-page `works -> works_cards` loop.

This is not a generic homepage skill. It is only for:

- `works_intro -> works -> works_cards`
- A/B identity ordering
- arc trajectory and radial facing
- side-lane framing
- desktop `4:3` / `16:10` validation
- remote GitHub Pages proof for this program

## Read First

1. [`docs/handoff/alche-top-page-handoff-2026-04-17.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/handoff/alche-top-page-handoff-2026-04-17.md)
2. [`docs/alche-cards-visual-loop.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/alche-cards-visual-loop.md)
3. [`docs/experience/alche-works-maintenance-lessons.md`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/experience/alche-works-maintenance-lessons.md)

## Real Render Path

The active path is single-canvas, not DOM cards:

- [`components/alche-top-page/alche-top-page-shell.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
- [`components/alche-top-page/alche-top-page-canvas.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-canvas.tsx)
- [`components/alche-top-page/use-top-page-scroll.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/use-top-page-scroll.ts)
- [`components/alche-top-page/scene/alche-top-page-scene.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-scene.tsx)
- [`components/alche-top-page/scene/kv-scene-system.tsx`](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
- [`lib/alche-works-shotbook.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-works-shotbook.ts)
- [`data/alche-works-shotbook.json`](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/alche-works-shotbook.json)

## Default Workflow

1. Confirm whether the issue is:
   - order/timing
   - identity confusion
   - pose/framing
   - desktop aspect drift
   - validator-only failure
2. If order or ownership is in doubt, use `alcheCardDebug=identity`.
3. Make the smallest pose/runtime change that can move the screenshot.
4. Validate in this order:
   - `npm run build`
   - `npm run typecheck`
   - `npm run verify:static`
   - `npm run validate:playwright`
5. Inspect screenshots before claiming progress.
6. If the user is looking at production, also verify remote GitHub Pages with fresh screenshots.

## Current Rules

- Keep `ALCHE_TOP_RUNTIME_MODE = "kv-works"`.
- Prefer `alcheShot` for named-state diagnosis.
- Do not accept `alcheShot` proof alone for sequence fixes; free-scroll must also pass.
- Do not start with global `baseRadius` when side panels feel too close.
- For desktop framing drift, first adjust side-lane aspect compensation.

## Current Named Shots

- `works-out`
- `cards-a-entry`
- `cards-a-center`
- `cards-b-queue`
- `cards-handoff-mid`
- `cards-settled`

## Fast Commands

Focused cards loop:

```bash
npm run verify:alche-cards
```

Full loop:

```bash
npm run build
npm run typecheck
npm run verify:static
npm run validate:playwright
```

## What Not To Do

- Do not reopen `full-chain` parity unless the user explicitly broadens scope.
- Do not claim a visual fix from code inspection alone.
- Do not rely on fixed 1440px thresholds for side-lane framing.
- Do not parallelize `build` and `typecheck` as one signal.
