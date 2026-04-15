# Alche Top-Page Handoff

Date: `2026-04-11`  
Scope: desktop top-page parity program for [alche.studio](https://alche.studio/)  
Current execution mode: `fallback`, not formal custom agents

## Current Status

- Main route `/{locale}/` is already on the new `alche-top-page` runtime, not the old `ArchiveShell`.
- The runtime graph is the fine-grained chain:
  - `loading`
  - `kv`
  - `works_intro`
  - `works`
  - `works_outro`
  - `mission_in`
  - `mission`
  - `vision`
  - `vision_out`
  - `service_in`
  - `service`
  - `stellla`
  - `outro`
- Reviewer has **not** accepted success.
- Current reviewer verdict: `needs_more_implementation`
- Current target remains:
  - desktop top-page only
  - reviewer-gated loop
  - do not claim `95%` parity yet

## Authority Order

Use these as the top authority for the next session:

1. [/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-tech-audit.md](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-tech-audit.md)
2. [/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-scene-and-ownership.md](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-scene-and-ownership.md)
3. [/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-timeline.md](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-timeline.md)
4. [/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-frame-analysis.md](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/reverse-engineering/alche-frame-analysis.md)
5. Local reference video:
   - [/mnt/d/Project/AIProject/MyProject/CVWebsite/Task/参考视频.mp4](/mnt/d/Project/AIProject/MyProject/CVWebsite/Task/%E5%8F%82%E8%80%83%E8%A7%86%E9%A2%91.mp4)

Older contract docs are now secondary. Use them only if they do not conflict with the reverse-engineering docs.

## Last Committed Baseline

Latest commit currently on branch:

- `4c0ec5f` `Fix Alche scene leakage in mission background`

Important:

- The work from the latest parity loop is **not committed yet**.
- There are many local modifications in the working tree.

## Relevant Uncommitted Files

Production files that changed in the current parity loop:

- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-canvas.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-canvas.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-materials.ts](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-materials.ts)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-scene.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-scene.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/concept-field-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/concept-field-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/outro-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/outro-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/scene-helpers.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/scene-helpers.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/service-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/service-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/stellla-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/stellla-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/works-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/works-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/use-top-page-scroll.ts](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/use-top-page-scroll.ts)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/data/alche-top-page.ts](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/alche-top-page.ts)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/validate-playwright.mjs](/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/validate-playwright.mjs)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/verify-static-export.mjs](/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/verify-static-export.mjs)

Assets added for the `works` program:

- [/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/works/kizunaai-poster.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/works/kizunaai-poster.png)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/works/wear-go-land-poster.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/works/wear-go-land-poster.png)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/works/discoat-poster.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/works/discoat-poster.png)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/works/wear-go-land-side-poster.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/public/alche-top-page/works/wear-go-land-side-poster.png)

Unrelated local files that should not be cleaned or committed blindly:

- `Task/` deletions and reference media
- `docs/phase-2-screenshots/current-*`

## What Changed In The Latest Loop

### 1. Opening-chain leakage reduction

Main goal was to stop synthetic leftovers from corrupting reviewer evidence.

Changes included:

- stronger hard-hide behavior for non-owned scene layers
- reduced `ALCHE` residuals in `works_*`
- reduced `stellla` and service leakage into earlier states

Main files:

- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/stellla-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/stellla-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/service-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/service-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-top-page.ts)

### 2. `works` scene moved closer to reference

The previous black-slab look was replaced with actual poster-backed media planes.

Changes included:

- loading poster textures into `WorksSceneSystem`
- lowering heavy opaque backings
- reducing synthetic overlay dominance
- making the `WORK` sweep less like a floating title and closer to wall content

Main files:

- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/works-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/works-scene-system.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-materials.ts](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/alche-top-page-materials.ts)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/data/alche-top-page.ts](/mnt/d/Project/AIProject/MyProject/CVWebsite/data/alche-top-page.ts)

### 3. Reviewer evidence chain was corrected again

This was the latest real root cause:

- `worksPanel` existed in the DOM but was missing in reviewer screenshots
- the fixed-state override advanced manual root attributes and scene state
- but the React shell did not reliably enter the same visible state for the screenshot

Changes included:

- `worksPanel` got a more direct section-owned opacity model
- capture-only panel sync was added for the `works` editorial shell
- Playwright fixed-state waiting now prefers render-sourced readiness, but falls back to manual root attrs as a regression gate

Main files:

- [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/alche-top-page-shell.tsx)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/validate-playwright.mjs](/mnt/d/Project/AIProject/MyProject/CVWebsite/scripts/validate-playwright.mjs)

## Current Evidence

Current reviewer screenshots:

- [/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/works-intro-handoff.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/works-intro-handoff.png)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/works-settled.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/works-settled.png)
- [/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/works-outro-clearing.png](/mnt/d/Project/AIProject/MyProject/CVWebsite/.playwright-artifacts/alche-top-page/works-outro-clearing.png)

Useful reading:

- `works-intro-handoff` now includes the left editorial panel again
- `works-settled` now reads more as a media-plane program and less as dark slabs
- `works-outro-clearing` is cleaner than before

## Validation State

Latest local validations passed:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run verify:static`
- `npm run verify:links`
- `node scripts/validate-playwright.mjs`

Important nuance:

- Playwright now passes again as a regression gate.
- This does **not** mean reviewer parity is accepted.
- The fixed-state gate still contains a fallback path, so do not overclaim reviewer fidelity from automation alone.

## Reviewer Verdict

Current reviewer verdict remains:

- `needs_more_implementation`

Why reviewer still rejects:

1. `works_intro -> works` still feels synthetic
   - media cards still read too much like foreground planes placed in front of a grid room
   - extraction from the cylindrical wall is not yet convincing enough

2. the center composition is still wrong in the `works` program
   - prism / linework residual relationship to the card field is still off
   - opening choreography still feels like a prototype, not the reference system

3. `kv` remains materially behind reference richness
   - but this is **not** the next best move yet
   - do not jump back into broad hero optical refinement before `works` handoff is structurally right

## Next Session: Single Best Entry Point

Only do this next:

- **rebuild `WorksSceneSystem` wall-extraction choreography**

Do **not**:

- reopen the whole site
- broaden into `mission/service/stellla/outro`
- do generic optical refinement
- spend the next loop on capture plumbing unless it blocks proof again

The next implementation loop should stay narrow:

1. `explorer`
   - inspect only:
     - [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/works-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/works-scene-system.tsx)
     - [/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx](/mnt/d/Project/AIProject/MyProject/CVWebsite/components/alche-top-page/scene/kv-scene-system.tsx)
     - reverse-engineering docs for `kv -> works_intro -> works -> works_outro`
   - decide the minimum changes needed so cards feel extracted from wall space rather than placed in front of it

2. `implementer`
   - only touch the `works` choreography:
     - wall handoff
     - card arc positioning
     - prism/line residual suppression during `works_intro`
     - if needed, light camera reframe inside the `works` chain only

3. `reviewer`
   - only re-check:
     - `works-intro-handoff`
     - `works-settled`
     - `works-outro-clearing`
   - reject if it still reads as synthetic layered planes

## Known Traps

1. Do not trust fixed-state root attrs alone
   - `data-active-section` can look correct while the React shell is still visually wrong

2. Do not interpret Playwright green as reviewer acceptance
   - current automation is a regression gate, not final parity proof

3. Do not spread changes across the whole chain
   - current main leverage is the `works` program
   - wider changes will slow feedback and dilute reviewer clarity

4. Do not clean unrelated files
   - `Task/` and `docs/phase-2-screenshots/current-*` remain local scratch/reference state

## Memory / Lessons

Relevant lessons already recorded:

- `exp-0020`
  - fixed-state WebGL captures need hard kill-zones for fading layers
- `exp-0021`
  - fixed-state screenshot gates must distinguish manual override markers from React-rendered readiness

If the next loop produces a new reusable insight, search memory first and only add a new lesson if it is genuinely distinct from these two.

## Suggested New-Session Prompt

Use something close to this:

```text
继续按 fallback 执行 team-role-orchestrator + experience-memory-loop。
先读 docs/handoff/alche-top-page-handoff-2026-04-11.md。
目标只限 desktop top-page 的 works 主链：
kv -> works_intro -> works -> works_outro。
reviewer 仍然是 needs_more_implementation。
不要扩 scope，不要碰后半链，不要做 broad optical refinement。
只重做 WorksSceneSystem 的 wall-extraction choreography，直到 reviewer 不再把它判成 synthetic layered planes。
```
