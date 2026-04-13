---
name: web-visual-debugging
description: Debug and verify web UI visual issues, screenshot mismatches, layout regressions, shader/three.js rendering bugs, and “it changed but still looks wrong” reports. Use when adjusting page visuals requires screenshot-first validation, runtime verification, asset-path checks, or careful dirty-worktree commit boundaries.
---
# web-visual-debugging

Use this skill when the user is debugging or iterating on webpage visuals and the real question is “what is actually rendering?” rather than “what did the code change say?”

This skill is for:
- page looks wrong
- screenshot does not match expectation
- visual change is not visible
- layout/spacing/typography/tiling feels off
- shader/three.js/webgl output is suspicious
- a change may be implemented but not wired to the real page
- GitHub Pages/static-export visuals differ from local assumptions

## Core Rule

Do not claim a visual fix from code inspection alone. A visual change is only “real” after:

1. the change is connected to the real render path
2. the relevant validation command passes
3. a fresh screenshot or equivalent visual artifact confirms the intended result

If any of those are missing, report `partial`, `pending-validation`, or the exact missing evidence.

## Workflow

### 1. Find the real render path first

Before editing, identify:
- the actual route the user is looking at
- the component or scene that renders it
- whether the visual is DOM, CSS, canvas, shader, or 3D scene output
- whether there is a local-vs-production difference such as base path, export mode, capture mode, or debug override

For this repo, check:
- locale gateway vs actual homepage route
- `app/[locale]/page.tsx`
- `components/alche-top-page/*`
- `lib/site.ts` for `assetPath()`
- `scripts/verify-static-export.mjs`
- `scripts/validate-playwright.mjs`

Do not assume the edited component is actually mounted.

### 2. Prefer the cheapest decisive verification

Use the smallest proof that can falsify the current theory:
- if the question is “is this route wired?” inspect the built HTML or route output
- if the question is “did the visual change render?” capture a screenshot
- if the question is “is this only local?” check production headers or deployed HTML
- if the question is “is the issue from projection/UV/shader math?” inspect the actual render artifact, not only the math

If two consecutive changes do not move the screenshot in the intended direction, stop patching and reframe the problem at a higher level.

### 3. Screenshot-first loop

For visual changes, default loop:

1. make the smallest targeted change
2. run the relevant validation
3. inspect the new screenshot artifact directly
4. compare the result against the user’s complaint
5. only then decide the next edit

In this repo, prefer:

```bash
npm run build
node scripts/validate-playwright.mjs
```

Then inspect:

```text
.playwright-artifacts/alche-top-page/kv-settled.png
```

If the user says “there is no change,” believe the screenshot over the code.

### 4. Distinguish implementation failure from perception failure

When a user says “no change,” separate:
- code changed but wrong render path
- code changed but visual effect is too weak to read
- code changed but was averaged/flattened by sampling or post-processing
- code changed and screenshot proves it, but user still sees cached production

Report which case it is. Do not collapse them into one explanation.

## WebGL / Shader / 3D Rules

### Shader textures and repeat

For custom `ShaderMaterial`, do not assume `texture.repeat` alone guarantees visible repeat in the final image. If the visual must remain readable at very high density:
- prefer procedural lines/grids over tiny bitmap detail
- verify sampling, filtering, mipmaps, and UV logic
- inspect screenshots after each density change

### Curved walls and center artifacts

For cylindrical or curved surfaces:
- a center band or rectangle may be projection accumulation, not a stray layer
- if lines are distributed in angle/UV space, the front-facing projection may visually bunch them into a stripe
- consider using projected/screen-space references when the requirement is “looks evenly distributed on screen”

### Troika text

When using `troika-three-text` in this repo:
- always use a local font asset under `public/`
- always build the URL with `assetPath()` because the site is deployed under `/CVWebsite`
- expect worker/blob behavior to affect validation heuristics such as Playwright `networkidle`
- if local static validation hangs but production behavior is fine, isolate the validation-only condition and say so explicitly

Do not call the result “fixed” unless the screenshot shows the right glyphs.

## GitHub Pages / Static Export Rules

This repo is export-only and deployed under `/CVWebsite`.

That means:
- do not use bare `/foo/bar` asset URLs for runtime assets
- use `assetPath()` for anything loaded from `public/`
- verify with static export oriented checks, not only dev-server behavior

If the user says production has not changed:
- distinguish route wiring from deployment freshness
- check whether the built/exported artifact contains the new structure
- only then blame cache or deployment lag

## Dirty Worktree Rules

This repo is often dirty. Before editing:
- inspect `git status --short`
- identify unrelated user changes
- avoid shared helper files when a new dedicated file is safer
- only stage files owned by the current request

If a shared file already has user changes, prefer:
- a new dedicated file
- a narrower hook/component
- a local constant or adapter

Do not revert or absorb unrelated changes.

## Commit/Status Language

Use precise closure language:
- `implemented` when code changed
- `validated` only when checks/artifacts confirm it
- `partial` when code is in but the visual result is still off
- `pending-validation` when production or screenshot evidence is still missing

Never say “fixed” for visual work without a screenshot or other direct render evidence.

## Minimum Deliverable for Visual Debug Tasks

Unless blocked, finish with:
- the diagnosis
- the smallest meaningful code change
- validation results
- the exact screenshot or artifact inspected
- any remaining `unknown`

If no screenshot was inspected, say that explicitly.
