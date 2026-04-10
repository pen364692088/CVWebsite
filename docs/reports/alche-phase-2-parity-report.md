# Phase 2 Parity Report

Scope: tighten perceptual fidelity on the first `12-16s` only. No route transition work. No new sections.

## Screenshot Comparisons

- Hero intro: [`compare-hero-intro.png`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/phase-2-screenshots/compare-hero-intro.png)
- Hero settled: [`compare-hero-settled.png`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/phase-2-screenshots/compare-hero-settled.png)
- Works: [`compare-works.png`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/phase-2-screenshots/compare-works.png)
- Vision: [`compare-vision.png`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/phase-2-screenshots/compare-vision.png)
- Service: [`compare-service.png`](/mnt/d/Project/AIProject/MyProject/CVWebsite/docs/phase-2-screenshots/compare-service.png)

Capture note:
Screenshots use query-only phase overrides such as `?alchePhase=works&alcheIntro=1`. Default runtime behavior is unchanged.

## Priority 1: Hero-Stage Parity

Status: materially improved, not closed.

What landed:
- Curved room is no longer a mostly empty cylinder.
- Added chamber segmentation with rear portal, wall panel belts, inset plates, and diagonal structural braces.
- Camera now reads against a technical exhibition chamber rather than a generic moving backdrop.
- Depth layering is stronger because the rear wall, braces, and plane stack sit on separate z bands.

Still off:
- The room topology is still more uniform than the reference.
- Panel detailing is readable, but not yet as intricately tuned as the source chamber.
- The relationship between stage architecture and the giant wordmark is still less deliberate than the reference.

## Priority 2: Prism-A Parity

Status: improved silhouette and object feel, still the main gap.

What landed:
- Rebuilt the `A` silhouette with a narrower apex, sharper aperture, and a more geometric lower break.
- Warped the extruded geometry so it reads as a shaped prism instead of a flat logo extrusion.
- Reduced wireframe dominance and shifted the object toward a quieter liquid-glass read.

Still off:
- The current mesh is still a reconstructed approximation, not the source asset.
- Refraction is shader-driven and convincing at a glance, but not yet at the level of true multi-layer caustics.
- Edge behavior is still more line-drawn than premium optical glass.

## Priority 3: Postprocessing Parity

Status: landed the correct stack direction, tuning still incomplete.

What landed:
- Replaced direct render with `EffectComposer`.
- Added `RenderPass`, restrained `UnrealBloomPass`, and a final composite pass for chromatic separation, grain, and vignette.
- Tone mapping is now controlled at canvas creation, so the stage reads more deliberately and less flat.

Still off:
- No lens-distortion/glare pass yet because the current image benefits more from restraint than extra optics.
- Grain is uniform film noise, not a fully art-directed texture response.
- Chromatic aberration is subtle and stable, but not yet scene-aware.

## Priority 4: Works-Gallery Choreography Stub

Status: good proof of spatial logic, not yet content-credible.

What landed:
- Replaced flat side planes with a dark angled plane cluster on multiple depth layers.
- Added frame lines, backing slabs, and shader-driven panel graphics so the gallery reads spatially.
- Works, vision, and service phases now show distinct spatial states instead of a single hero hold.

Still off:
- Planes are still abstract media carriers; no real media composition rhythm yet.
- The gallery cluster is more proof-of-language than final choreography.
- Motion cadence is state-driven, not yet keyed to exact section beats from the reference.

## Remaining Blockers Ranked By Perceptual Impact

1. Prism asset fidelity.
Current silhouette is better, but the hero object still lacks the exact sculpt, bevel logic, and optical depth of the reference.

2. Hero composition against typography.
The stage and object are stronger now, but the exact spatial relationship between the `ALCHE` wordmark, object, and chamber is not yet locked.

3. Chamber topology density.
The chamber reads correctly now, but the reference has more intentional segmentation, trim hierarchy, and surface rhythm.

4. Optical finishing.
Composer stack direction is correct, but glare, refraction response, and grain tuning are still below near-perfect fidelity.

5. Works-gallery authored content.
The spatial stub proves the idea, but real media sequencing will matter before the gallery can feel fully premium.

## Practical Read

The first-glance impression is now much closer to `alche.studio` than Phase 1:
- more directed
- more spatial
- less placeholder
- more technically staged

Near-perfect fidelity is still blocked mainly by the proprietary hero object and the exact shot composition, not by the current stack direction.
