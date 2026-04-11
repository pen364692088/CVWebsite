# Alche Frame Analysis

## Status

- Scope: local reference video reverse-engineering.
- Primary source: [参考视频.mp4](/mnt/d/Project/AIProject/MyProject/CVWebsite/Task/参考视频.mp4)
- Method: dual-track
  - Track A: manual keyframe analysis from extracted anchors
  - Track B: future tool-enhanced extraction if `ffmpeg/ffprobe` becomes available
- This document does not assume automated video tooling is available in the repo environment.

## Track A

### Evidence basis

- A contact sheet extracted during analysis yielded 10 anchor times:
  - `00.00s`
  - `02.67s`
  - `05.33s`
  - `08.03s`
  - `10.70s`
  - `13.37s`
  - `16.03s`
  - `18.73s`
  - `21.40s`
  - `24.07s`
- Existing local screenshot sets under [滚动效果](/mnt/d/Project/AIProject/MyProject/CVWebsite/Task/滚动效果) were used as secondary support for transitional states.

### Checkpoint table

| # | Time | Phase | Evidence class | Camera state | Relative layer read | What establishes / exits | Direct implementation meaning |
|---|---:|---|---|---|---|---|---|
| 1 | `00.00s` | `loading` | known-from-frame | camera not yet readable | black screen only | no scene read yet | loading must fully own the screen before hero appears |
| 2 | `02.67s` | `loading -> kv` | known-from-frame | fixed/front-facing | faint `A` construction lines on black | structural logo grammar establishes before full optical hero | intro should not start from a finished hero shot |
| 3 | `04.20s` | `kv build` | inferred-between-anchors | fixed | wall/grid begins to read behind forming logo | media wall and alignment scaffold likely establish before full hero brightness | hero intro needs staged assembly, not single fade-in |
| 4 | `05.33s` | `kv settled` | known-from-frame | fixed hero framing | front `A`, mid `ALCHE`, rear cylindrical wall, plus DOM news/HUD | hero stack fully readable | current repo hero must be judged against this three-layer read, not just one screenshot |
| 5 | `06.70s` | `works_intro` | inferred-from-video + screenshots | mild reframe | hero authority starts collapsing; wall begins transitional content duty | `ALCHE` begins to lose authority | `works_intro` must be its own runtime state |
| 6 | `08.03s` | `works_intro / early works` | known-from-frame | restrained reframing | `A` remains, but wall pattern and logo pose have shifted; hero typography no longer dominates | hero state is no longer stable, but works is not yet settled | do not jump directly from hero to centered works card |
| 7 | `09.40s` | `works handoff` | inferred-between-anchors | same world, no hard cut | `WORK` sweep and card activation window | wall temporarily becomes primary carrier | wall content must participate in the handoff |
| 8 | `10.70s` | `works settled` | known-from-frame | works framing | main project card centered, side cards visible, DOM metadata active | works foreground system is stable | works requires synced GL card track + DOM metadata |
| 9 | `12.10s` | `works_outro` | inferred-from-screenshots | controlled, not flashy | project card authority starts clearing | works cards begin exiting before conceptual white stage | `works_outro` cannot be collapsed into `about` start |
| 10 | `13.37s` | `late works / transition buffer` | known-from-frame | same chain | work media still present, but scene is decompressing and logo fragments reappear | bridge state between works and conceptual field | transition buffer is structurally required |
| 11 | `14.80s` | `mission_in` | inferred | flattening / purification | dark spatial richness collapses toward planar field | white-field transition begins | mission entry should read as purification, not page cut |
| 12 | `16.03s` | `mission / vision stable field` | known-from-frame | stable conceptual framing | white field, rainbow/iridescent `A` band, outlined `A`, technical marks | conceptual field is now primary | current repo `about` should split here into `mission + vision` program |
| 13 | `17.10s` | `vision_out / service_in` | inferred | preparing for redensification | white field begins losing authority | concept program drains before product/service density returns | `vision_out` and `service_in` are real beats, not noise |
| 14 | `18.73s` | `service / stellla chain` | known-from-frame | branded section framing | large media plane left, product/service copy right, grid persists | product/service program is dominant | current repo merges too much here; service and stellla need distinct roles |
| 15 | `21.40s` | `outro intro` | known-from-frame | settled black-stage framing | black field, left `A`, grid lines, footer-adjacent telemetry | top-page narrative has drained into closing stage | this is not ordinary contact content |
| 16 | `22.80s` | `outro build` | inferred-between-anchors | stable | brand lockup expands toward final wordmark | single `A` grows into final brand read | outro needs its own buildup, not immediate footer |
| 17 | `24.07s` | `outro settled` | known-from-frame | fixed closing frame | giant `ALCHE` on black, footer/legal quietly present | final brand lockup takes over | rename/rebuild current `contact` as `outro/footer stage` |

## Track A Conclusions

### Known

- The video supports the richer top-page state graph found in live DOM markers.
- The hero program, works program, conceptual white-field program, service/product program, and branded outro are all visually distinct.
- The current repo’s 5-phase abstraction is too coarse to reproduce this rhythm.

### Inferred

- Several of the most important perceptual beats are buffer states, not stable content sections.
- The reference site’s pacing depends on decompression and handoff beats:
  - `works_intro`
  - `works_outro`
  - `mission_in`
  - `vision_out`
  - `service_in`

### Unknown

- Exact frame count and exact easing curves between the anchor points.
- Exact camera transform values at each transition boundary.

## Track B

Tool-enhanced follow-up, not a blocker for the next rewrite:

- add `ffmpeg/ffprobe` access or equivalent
- extract a denser frame series
- map every extracted frame to a section id
- annotate exact transition boundaries

Track B may improve time precision, but it should not change the structural conclusions above unless the live site or source evidence contradicts them.

## Ranked Gap List

By perceptual impact:

1. The current runtime graph is too coarse and loses the reference site’s transition buffers.
2. The current repo treats `about` as one state, but the video shows a full conceptual program around mission/vision.
3. The current repo ends in `contact`, but the video shows a branded outro stage before footer utility settles.
4. Works is under-modeled as a single section instead of a full handoff program with intro and outro beats.
5. DOM systems like news, scroll indicator, and editorial content are still underweighted relative to the reference site.
