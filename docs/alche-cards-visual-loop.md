# ALCHE Cards Visual Loop

Use this loop when iterating on the `works -> works_cards` handoff. The authority source is `Task/参考视频.mp4`, not raw wheel feel and not `alche.studio`.

## Fast Path

1. `npm run build`
2. `npm run validate:alche-cards`

If you want a single command that also rebuilds the static export first, run:

1. `npm run verify:alche-cards`

If you only want to refresh the extracted video references, run:

1. `npm run reference:alche-cards`

## Shotbook Entry

The preferred debug entry is `alcheShot`, not raw `alcheProgress`.

Examples:

- `/en/?alcheShot=cards-a-entry`
- `/en/?alcheShot=cards-a-center`
- `/en/?alcheShot=cards-b-queue`
- `/en/?alcheShot=cards-handoff-mid`
- `/en/?alcheShot=cards-settled`

Each shot resolves to a named section/progress pair from `data/alche-works-shotbook.json`.

## What It Checks

- `works-out`: `WORKS` is gone and cards are still hidden
- `cards-a-entry`: only `A` is visible in the right-lower quadrant
- `cards-a-center`: only `A` is visible and centered
- `cards-b-queue`: `A` holds center while `B` appears from the right-lower queue lane
- `cards-handoff-mid`: both cards stay visible while `A` moves toward left-upper and `B` moves toward center
- `cards-settled`: `A` remains visible in the left-upper support slot and `B` holds center
- all cards stay ahead of the center model
- the center model stays stable through the handoff

## Artifacts

The focused loop refreshes these artifacts under `.playwright-artifacts/alche-top-page/`:

- `works-out.png`
- `cards-a-entry.png`
- `cards-a-center.png`
- `cards-b-queue.png`
- `cards-handoff-mid.png`
- `cards-settled.png`
- `reference-video/*.png`
- `reference-board.html`

`reference-board.html` is the primary manual review surface. Each shot row shows:

- current local capture
- extracted reference frame from `Task/参考视频.mp4`
- optional still from `Task/滚动效果/首页滚动至work`
- debug summary with visibility, centers, and screen gap

## When To Use Full Validation

Run `npm run validate:playwright` instead when you need confidence in:

- locale routing
- mobile/tablet shell regressions
- pointer behavior
- real wheel-driven section handoff
