# Alche Works Maintenance Lessons

These are project-local lessons for the active `works -> works_cards` program.

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
