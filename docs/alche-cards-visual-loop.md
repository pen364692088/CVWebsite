# ALCHE Cards Visual Loop

Use this loop when iterating on the `works -> works_cards` handoff and you do not need the full locale, pointer, and wheel validation pass.

## Fast Path

1. `npm run build`
2. `npm run validate:alche-cards`

If you want a single command that also rebuilds the static export first, run:

1. `npm run verify:alche-cards`

## What It Checks

- `works-out`: `WORKS` is gone and cards are still hidden
- `cards-boundary`: cards are already visible at the `works_cards` boundary
- `cards-enter`: `card0` still leads while `card1` stays on the right
- `cards-swap-mid`: both cards stay visible and swap through motion, not fade
- `cards-settled`: `card1` reaches center while `card0` exits left
- all cards stay ahead of the center model
- the center model stays stable through the handoff

## Artifacts

The focused loop refreshes these artifacts under `.playwright-artifacts/alche-top-page/`:

- `works-out.png`
- `cards-boundary.png`
- `cards-enter.png`
- `cards-swap-mid.png`
- `cards-settled.png`
- `reference-board.html`

`reference-board.html` places the current captures beside:

- `Task/alche-reference-home.png`
- `Task/滚动前.png`
- `Task/参考视频.mp4`

## When To Use Full Validation

Run `npm run validate:playwright` instead when you need confidence in:

- locale routing
- mobile/tablet shell regressions
- pointer behavior
- real wheel-driven section handoff
