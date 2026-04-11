# Hero Composition-Lock Report

Scope: hero only. No new sections. No route transitions. No cleanup pass.

## What Changed

- Added a single hero constraint source in [`alche-hero-lock.ts`](/mnt/d/Project/AIProject/MyProject/CVWebsite/lib/alche-hero-lock.ts).
- Locked hero camera framing, prism base transform, typography layout values, and HUD anchors to one master composition.
- Rewired the hero runtime so the hero scene, overlay, and screenshot states all read from the same lock data.
- Added capture-only `alcheHeroShot` support for five fixed hero states without changing default runtime behavior.
- Rebalanced the hero chamber massing and hero object placement through composition values, not extra shader complexity.

## What Is Now Closer

- The hero reads as one directed technical exhibition shot rather than a loose combination of strong parts.
- `ALCHE` now lands first, with the prism and rear dark mass grouped into a clearer second read.
- The prism sits against the wordmark and rear slab more intentionally, so the overlap feels staged instead of incidental.
- The HUD is locked into a consistent right-side anchor and carries less compositional drift.
- The five fixed screenshots now feel like one hero system with controlled emphasis shifts, not five independent layouts.

## What Still Feels Off

- The rear chamber is closer, but still flatter and more uniform than the reference’s shot-specific architecture.
- The prism silhouette now sits better compositionally, but the object still feels more reconstructed than authored.
- The HUD is legible and anchored, but still slightly lighter and less editorially integrated than the reference.

## Top 3 Remaining Gaps

1. Rear-stage mass hierarchy.
The hero is better framed now, but the back wall, braces, and dark slab still need a more exact large-shape hierarchy to fully sell the directed chamber shot.

2. Prism-to-wordmark relationship.
The overlap is much better locked, but the prism still needs a slightly more exact silhouette/pose relationship against `ALCHE` to feel fully intentional.

3. HUD editorial integration.
The HUD placement is now stable and readable, but its visual weight still sits a bit separately from the main composition instead of feeling fully fused into it.
