# Hero Mass & Authority Pass

Scope: hero only. Lock-source tuning only. No route changes, no scene-graph changes, no new effects, no post stack expansion.

## Outcome

Pass completed on top of the accepted hero lock.

- Average score moved from `23.4/30` to `25.2/30`
- `hero-settled` moved to `27/30`
- `hero-strongest-chamber-read` moved to `27/30`
- No shot fell below `23/30`

## What Lock Values Changed

File: [`alche-hero-lock.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-hero-lock.ts)

- Prism base transform:
  - moved slightly back and inward
  - reduced default scale
  - reduced default yaw so the outer triangular read is more direct
- HUD base anchor:
  - moved inward from the right edge
  - narrowed the block
  - lowered default frame/list intensity slightly so the HUD can integrate instead of simply brightening
- `hero-settled`:
  - increased `rearWallEmphasis`
  - reduced `panelBias` / `braceBias`
  - kept the prism present but less bulk-led
- `chamber-read`:
  - pushed rear-wall dominance further
  - reduced secondary structure noise
  - pushed prism back so the chamber remains the primary read
- `prism-read`:
  - reduced chamber chatter
  - increased prism authority through pose and scale, not by changing the material system
- `hud-legible`:
  - reduced prism competition
  - increased HUD readability through anchor and weight, not through new UI treatments

## Which Gaps Improved

### 1. Rear-stage mass hierarchy

- Stronger in `hero-settled`
- Clearest in `hero-strongest-chamber-read`
- The chamber now feels more like a deliberate black stage with secondary structure, not a uniform technical room

### 2. Prism silhouette authority

- The prism now reads more as a staged emblem than a generic refractive cone
- `prism-read` is closer to “symbol with authority” and less like a material demo

### 3. HUD editorial integration

- The right-side block now participates more cleanly in the hero composition
- `hud-legible` reads more like layout infrastructure and less like a detached overlay

## What Still Blocks Stronger Similarity

- The prism still lacks the exact authored silhouette and internal discipline of the reference object
- The rear dark mass is stronger, but the large-shape articulation is still somewhat even and rectangular
- The HUD is more integrated, but still not fully fused into the chamber’s visual rhythm

## Remaining Gaps Ranked By Perceptual Impact

1. Prism silhouette authorship
2. Rear-stage large-shape articulation
3. HUD editorial fusion
