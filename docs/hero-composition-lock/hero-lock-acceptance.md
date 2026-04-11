# Hero Lock Acceptance

Scope: frozen hero capture shots only. No runtime architecture changes. Lock-only adjustments were applied in `/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-hero-lock.ts` before this acceptance pass.

## Acceptance Decision

Accepted for hero-lock and mass-authority gate.

Reason:
- Every shot clears the `22/30` floor used for the mass-authority pass.
- Average score is `25.2/30`, above the `25/30` gate.
- `hero-settled` and `hero-strongest-chamber-read` both clear the mandatory `25/30` threshold.

## Lock-Only Corrections Applied

- Kept camera and typography frozen.
- Reworked only hero lock values: base prism transform, base HUD anchor/weight, and per-shot chamber / prism / HUD emphases.
- Increased rear-stage authority by pushing rear-wall emphasis up while reducing panel/brace chatter in the settled and chamber-dominant shots.
- Reduced the prism’s default “glass bulk” read and made the shot-specific prism poses more silhouette-led.
- Moved the HUD inward and narrowed it so the right-side information block participates in the scene massing instead of floating at the edge.

## Scoring Table

| Shot | Composition hierarchy | Prism vs ALCHE relationship | Chamber spatial read | HUD calibration feel | Negative space / pressure balance | Premium overall impression | Total / 30 | Gate |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `intro-forming` | 4 | 4 | 4 | 3 | 4 | 4 | 23 | Pass |
| `hero-settled` | 5 | 4 | 5 | 4 | 4 | 5 | 27 | Pass |
| `hero-strongest-chamber-read` | 5 | 4 | 5 | 4 | 4 | 5 | 27 | Pass |
| `hero-strongest-prism-read` | 4 | 5 | 4 | 3 | 4 | 4 | 24 | Pass |
| `hero-hud-fully-legible` | 4 | 4 | 4 | 5 | 4 | 4 | 25 | Pass |
| **Average** |  |  |  |  |  |  | **25.2** | **Pass** |

## Why It Passes Now

- `hero-settled` now carries more black-stage pressure and less secondary chatter, so the chamber reads as a deliberate exhibition set rather than a generic room.
- `hero-strongest-chamber-read` shows clearer main-versus-secondary hierarchy instead of merely making more structure visible.
- `hero-strongest-prism-read` gives the prism more authority through pose and silhouette, not just through size.
- `hero-hud-fully-legible` feels more compiled into the right-side layout system because the block is narrower, more inward, and better subordinated to the main hero masses.

## What Still Feels Off

- The prism is more authoritative, but the inner scaffold still reads somewhat reconstructed rather than fully authored.
- The rear dark slab is stronger, but the large-shape break-up is still more rectangular and even than the reference.
- The HUD now sits better, but its editorial fusion with the scene is still one step short of the reference.

## Remaining Gaps Ranked By Perceptual Impact

1. Prism silhouette authorship.
The prism now holds the frame better, but the object still lacks the exact authored authority of the reference form.

2. Rear-stage large-shape articulation.
The back-stage mass is stronger, but the slab/panel/brace relationship still needs a more exact break-up to fully match the reference chamber.

3. HUD editorial fusion.
The HUD is no longer drifting, but it still reads slightly overlaid rather than fully embedded in the composition’s right-side rhythm.

## Mandatory Shot Check

- `hero-settled`: `27/30` Pass
- `hero-strongest-chamber-read`: `27/30` Pass

Constraint after this pass: broad optical refinement is still optional, not automatic. The next move should be decided against the remaining perceptual gaps, not against feature opportunity.
