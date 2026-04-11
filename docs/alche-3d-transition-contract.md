# Alche 3D Construction And Transition Contract

## Contract Status

- This document is implementation-facing.
- It describes the site as one evolving brand-space system, not a stack of isolated pages.
- When this document conflicts with earlier prototype assumptions or reverse-engineering notes, this document wins.

## Global Scene Model

### Persistent 3D Parents

Only three core 3D geometric parents define the hero world:

1. Thick refractive `A` logo slab in the foreground
2. Floating emissive `ALCHE` wordmark in the midground
3. Near-full cylindrical media wall in the background

### World Continuity

- The same world persists through `Hero -> Works -> About -> Stella`.
- `Stella -> Contact` stays in the same brand system, but exits the deep 3D world.
- Hero camera is mostly fixed unless a transition explicitly says otherwise.

### Hero Framing Lock

- Camera faces the center axis of the cylindrical wall.
- FOV reads as moderate cinematic, not wide-angle spectacle.
- `A` is nearly exactly centered.
- `ALCHE` sits centered behind `A`, mostly contained in frame.
- `A` and `ALCHE` have a clear air gap; they are not touching.

### Cylindrical Wall Model

- The wall is not a stack of thick TV boxes.
- It is a cylindrical media skin made from mostly uniform square screen cells.
- Cell seams read as thin dark lines, primarily drawn by texture/content, not thick physical bezels.
- Fine grid lives inside each cell as content.
- Black squares are inactive or switched cell states, not permanent black panels.
- Content spans multiple cells; each cell is a display carrier, not an isolated program slot.
- The wall keeps a dark base with sparse brighter activity.

## 3D vs DOM Ownership

### 3D-Owned

- Thick refractive `A`
- Emissive `ALCHE` wordmark
- Cylindrical wall and its cell/content system
- Works project cards once they detach into the foreground
- Camera transforms tied to transitions

### DOM-Owned

- Top navigation; persistent through the site
- Left state rail; persistent but increasingly lighter
- Right technical HUD; hero-only
- Bottom-left material/debug controls; hero-only
- Works metadata tied to the active card
- `stella` large typography and editorial copy
- Footer/contact links and company information

### DOM Behavior Notes

- DOM chrome is primarily technical instrumentation, not standard marketing UI.
- Top navigation keeps equal structural importance across the site.
- Left rail behaves like a state-machine marker, not a decorative rail.
- Right HUD is not part of the wall; it exits after hero.
- Bottom-left debug chrome is not part of the wall; it exits after hero.
- `About` keeps the same overlay structure with a cleaner tone.
- `Stella` keeps navigation, but editorial overlay takes visual control.

## Hero Optical Stack

### `A` Material

- `A` is a thick cloudy refractive glass/ice slab, not a simple prism.
- Refraction is primary. Reflection is secondary.
- Opacity is variable by region.
- Roughness is variable by region.
- Internal volume is uneven and flow-scarred, not uniformly milky and not procedurally generic.
- Distortion is heavy and local. Background layers stay readable but are violently warped.
- The strongest optical activity lives on the outer edges and inner aperture.
- Chromatic aberration is thin accent only.
- Color bias comes mainly from refracted backdrop content, not from a heavily tinted body.

### `ALCHE` Wordmark

- `ALCHE` is a flat straight layer of thin emissive solids, not a single cutout slab and not a texture card.
- It is the primary white backlight for `A`.
- The core stays crisp; bloom is soft and secondary.

### Lighting

- Primary lighting comes from `ALCHE` and the cylindrical wall content.
- Extra lighting is subtle fill only.
- Shadows are minimal and are not a primary design tool.
- Hero should read as optical reprocessing of lit background layers, not as a separately lit hero object.

## Transition Grammars

### `Hero -> Works`

#### Persistent Layers

- Cylindrical wall stays alive
- `A` stays centered
- Same world remains active

#### Authority Shift

- `ALCHE` loses authority by hiding
- `A` loses authority without leaving center
- Wall content briefly becomes the primary carrier
- Works card system then becomes the new primary read

#### Camera Action

- Camera performs a restrained pull-back reframe
- Do not treat it as a dramatic lens stunt

#### Object Action

- Wall shows a large `WORK` word sweeping horizontally through wall content, then clearing completely
- `A` remains in place and loses authority mainly by occlusion
- Main works card enters from the right to the center
- Side preview cards form an arc queue
- Foreground cards are glossy translucent panels with slight curvature
- Scroll drives the horizontal track; active main card slides left on the arc as the next card arrives from the right

#### DOM Action

- Works metadata is DOM and bound to the active card
- Top navigation stays present
- Left state rail persists lightly
- Hero right HUD and bottom-left debug controls are out

#### Stable End State

- One main centered works card
- Side preview cards queued on the arc
- `A` mostly hidden behind the main card
- `WORK` transition word fully cleared

#### Verification Checklist

- Primary read: main works card
- Secondary read: side preview cards plus residual cylindrical wall
- Persistent layer: same cylindrical world and centered `A`
- Exiting layer: `ALCHE` hero wordmark
- Failure mode to avoid: cards feeling pasted over hero instead of activated within the same world

### `Works -> About`

#### Persistent Layers

- Same world basis persists
- `A` persists through transformation

#### Authority Shift

- Works cards exit first
- The cylindrical wall loses curved spatial authority
- White technical field becomes the new primary read
- `A` transitions from glass object to large outlined emblem

#### Camera Action

- No hard cut
- Scroll trigger immediately starts interpolation from curved wall to planar field

#### Object Action

- Cards clear out before the white field takes over
- Cylindrical wall interpolates toward a plane with visible interpolation
- White field sweeps bottom-to-top
- Background and `A` are whitened together
- `A` resolves into a large outlined emblem / wireframe-like line state

#### DOM Action

- Top navigation persists
- Left rail persists in a cleaner lighter tone
- Overlay structure stays the same, but reads flatter and cleaner

#### Stable End State

- White technical field
- Large centered outlined `A`
- No foreground works card system

#### Verification Checklist

- Primary read: white technical field plus outlined `A`
- Secondary read: cleaned overlay and residual alignment marks
- Persistent layer: center-axis `A` and world continuity
- Exiting layer: works card queue
- Failure mode to avoid: cutting to a new white page instead of flattening and purifying the same world

### `About -> Stella`

#### Persistent Layers

- `A` remains the transition device
- World continuity is preserved until the new scene is entered

#### Authority Shift

- Outlined `A` stops being a static emblem and becomes an entry object
- About field loses authority once camera commits to the passage
- Stella architecture becomes the new first read
- Large `stella` editorial layer arrives later

#### Camera Action

- Camera pushes in with rotation
- Transition passes by the edge of `A`, not through the aperture

#### Object Action

- `A` rotates into a side-presenting pose
- Entry is felt as passing by the thickness/edge of `A`
- After entry, `A` leaves the main read
- Stella space returns to deep 3D

#### DOM Action

- Top navigation persists
- Left rail remains minimal
- `stella` typography and editorial copy are DOM overlay, not in-world 3D text
- Large `stella` type does not arrive immediately; it takes over later in the section

#### Stable End State

- Deep 3D architectural stella scene
- `A` no longer read as a main object
- Editorial `stella` layer arrives as a later overlay event

#### Verification Checklist

- Primary read: architectural/deep 3D stella scene on entry
- Secondary read: later editorial `stella` overlay
- Persistent layer: `A` as passage object during the transition itself
- Exiting layer: about white technical field
- Failure mode to avoid: generic FX cut or immediate typography slam instead of entering past the edge of `A`

### `Stella -> Contact`

#### Persistent Layers

- Brand continuity persists
- Deep 3D world continuity does not

#### Authority Shift

- Stella scene drains out
- Footer black stage takes over
- Giant `ALCHE` wordmark becomes the new primary read
- Contact information stays secondary

#### Camera Action

- First read is closer to a straight page push than a deep 3D transform

#### Object Action

- Stella scene exits rather than morphing into another deep 3D chamber
- Footer becomes a mostly flat black brand stage
- Giant `ALCHE` rises into dominance

#### DOM Action

- Footer links and company info remain quiet support detail
- They must not compete with the giant brand wordmark

#### Stable End State

- Mostly flat black footer stage
- Giant `ALCHE` as the first read
- Quiet contact/footer detail around it

#### Verification Checklist

- Primary read: giant `ALCHE`
- Secondary read: quiet footer links and company info
- Persistent layer: brand system continuity only
- Exiting layer: stella deep 3D scene
- Failure mode to avoid: forcing deep 3D continuity too long or making footer utility links co-headline

## Motion Grammar

### Persistent Interaction Rules

- Hero camera is mostly static
- `A` responds to mouse with `yaw + slight pitch`
- `ALCHE` moves in the same direction at about one-third of `A`
- Wall moves in the same direction again, but weaker
- Motion uses tight inertial damping
- Return to neutral eases back slowly
- Idle motion is very slight drift only

### Hero Intro After Loading

- Loading screen is separate from hero
- Loading crosses into hero with crossfade; ripple-like water distortion is optional and may be simplified away
- Wall establishes first
- `ALCHE` fades up second
- `A` resolves last via material authority
- UI fades up after hero mostly settles
- Mouse interaction can already exist, but it should be visually subdued until hero settles

### Approximate Intro Rhythm

- Loading-to-hero handoff: soft crossfade, not hard cut
- Hero establishment window: about `2s` to `3s`
- Wall leads slightly
- `ALCHE` follows
- `A` reaches the main memory beat when it catches the strongest white backlight

## Verification Prompts

An implementer should be able to answer these without guessing:

- What are the only three core 3D geometric parents of the hero world?
- Which overlay elements are DOM and which belong to the 3D world?
- How does `Hero -> Works` preserve the same world while reassigning authority?
- How does `Works -> About` flatten and whiten the world without cutting scenes?
- Why is `About -> Stella` a passage along `A` rather than a generic effect transition?
- Why is `Stella -> Contact` allowed to lose deep 3D continuity while preserving brand continuity?

## Known Approximations

- Exact timings may stay approximate unless implementation forces more precision.
- Exact easing curves do not need to be locked beyond the described motion feel.
- Exact camera distances, wall curvature values, and works-card curvature values remain implementation-level tuning variables.
- Ripple during loading handoff is optional; simple crossfade is an acceptable first implementation.
