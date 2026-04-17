# ALCHE Cards Visual Loop

Use this loop for the active `works -> works_cards` program.
Authority is:

1. `Task/参考视频.mp4`
2. the current shotbook
3. fresh local and remote screenshots

Do not let raw wheel feel or old parity docs outrank those.

## Fast Path

Focused cards loop:

1. `npm run verify:alche-cards`

If you only need full page validation after a card change:

1. `npm run build`
2. `npm run typecheck`
3. `npm run verify:static`
4. `npm run validate:playwright`

If you only want to refresh extracted video references:

1. `npm run reference:alche-cards`

Important:

- do not run `typecheck` in parallel with `build` and interpret missing `.next/types` as a real regression

## Preferred Debug Entry

Use `alcheShot`, not raw `alcheProgress`.

Examples:

- `/en/?alcheShot=cards-a-entry`
- `/en/?alcheShot=cards-a-center`
- `/en/?alcheShot=cards-b-queue`
- `/en/?alcheShot=cards-handoff-mid`
- `/en/?alcheShot=cards-settled`

Use `alcheCardDebug=identity` when order or ownership is in doubt.

Debug mode defaults to identity for:

- `alcheShot`
- `alcheCapture`
- local `localhost` / `127.0.0.1`
- GitHub Pages host

Use `alcheCardDebug=poster` only when you specifically need poster art back.

## What Must Be Proven

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

Geometry checks:

- cards stay ahead of the center model
- facing error remains near `0`
- side-lane framing remains correct on both desktop baselines

## Desktop Validation Baselines

Current desktop validation is not single-viewport anymore.

Required local baselines:

- `1440×1080`
- `2560×1600`

For side lanes, validator uses normalized screen-space ratios instead of only fixed pixels:

- `screenLeftRatio`
- `screenRightRatio`
- `widthRatio`
- `centerYRatio`

This is the current durable rule for desktop adaptation.

## Artifacts

Primary local artifacts under `.playwright-artifacts/alche-top-page/`:

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
- `reference-video/*.png`
- `reference-board.html`

`reference-board.html` is still the main manual review surface.

## Remote Validation

If the user is looking at GitHub Pages, local proof is not enough.

Minimum remote checks:

- `/CVWebsite/en/?alcheShot=cards-b-queue`
- `/CVWebsite/en/?alcheShot=cards-settled`
- one real free-scroll capture on the production URL

For the current desktop adaptation loop, remote validation should use `2560×1600`.

## Current Best Tuning Lever

If the side panels still feel too close on desktop:

1. adjust side-lane desktop aspect compensation
2. then side-lane pose angle/radius offsets
3. only after that consider deeper geometry changes

Do **not** start with global `baseRadius` as the first lever.
