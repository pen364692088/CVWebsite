# Scene Breakdown Contract: alche.studio

## Scene Graph Plan

```text
App Shell
├─ DOM Scroll Rail
│  ├─ fixed Header
│  ├─ left Scroll Indicator
│  ├─ fixed Works overlay
│  ├─ fixed Mission/Vision text
│  ├─ fixed Service overlay
│  ├─ Stellla frame overlay
│  └─ Footer
├─ Main WebGL Canvas
│  ├─ TopPageMainScene
│  │  ├─ MainLogo (3D prism + outline + screen mesh)
│  │  ├─ CurvedGridRoom
│  │  ├─ WorksTitleCurvedSystem
│  │  └─ ambient background / noise field
│  ├─ ThumbnailScene
│  │  └─ DOM-synced media planes
│  ├─ TopPageServiceScene
│  │  └─ ServiceList / service-linked planes
│  ├─ SubPageScene
│  └─ NotFoundScene
└─ Outro Canvas
   ├─ Outro lottie / reveal field
   └─ Centered A lockup
```

## DOM Layer vs WebGL Layer

### DOM layer

- Header, nav, contact button, sound toggle.
- Scroll indicator.
- Works titles, dates, tags, and More Works link.
- Mission / Vision text blocks.
- Service copy and icons.
- Stellla copy and frame chrome.
- Footer links and contact buttons.

### WebGL layer

- Main 3D prism `A`.
- Curved room / grid architecture.
- Works gallery media planes.
- Service transition screen texture.
- Bloom, fluids, tonemapping, FXAA.
- Outro canvas lockup animation.

### Hard rule

- Do not move the curved spatial room into DOM/CSS.
- Do not flatten the main prism into SVG for the hero state.

## Camera Model

- One shared perspective camera for the top stage.
- Proven base position: approximately `(0, 0, 10)`.
- Proven hero bias: `kvZoom` pulls z forward by `0.5` and tightens FOV by `4`.
- Proven parallax: mouse-driven offset range `0.5`.
- Camera always looks at origin in the exposed controller.
- Section transitions should alter emphasis through restrained zoom/rotation/state changes, not hard cuts.
- Unknown: hidden camera offsets, shake layers, and section-specific quaternions beyond exposed code.

## Postprocessing Stack

1. Render scene backbuffer.
2. Generate bloom bright pass.
3. Run separable bloom blur passes.
4. Composite backbuffer + bloom textures + fluids distortion.
5. Apply filmic tonemap.
6. Apply FXAA.
7. For logo screen state, apply internal noise, lens distortion, and RGB split inside the material shader.

### Contract notes

- Bloom is present but restrained. Do not turn the scene into glow soup.
- Fluids are subtle screen-space distortion, not a hero liquid simulation.
- Chromatic aberration is optical and local, not a broad rainbow edge filter.

## Media Plane System

- Works thumbnails are DOM-addressable items mirrored into GL.
- Each media plane keeps `screenSpacePos` and `screenSpaceSize`.
- Rounded-rect masking happens in shader space.
- Loading has at least two modes: `default` and `center`.
- Media planes must support transition persistence between works-related pages.
- The system should survive page transitions without full teardown when context is compatible.

## Section State Machine

```text
loading
-> kv
-> works_intro
-> works
-> works_outro
-> mission_in
-> mission
-> vision
-> vision_out
-> service_in
-> service
-> stellla
-> footer
```

### State emission contract

- A single source of truth writes `data-current_section` onto `body`.
- Chrome, theme inversion, pointer events, and scene behavior read from that state.
- `works_outro`, `mission_in`, `vision_out`, and `service_in` are real intermediary states, not implementation accidents.

## Curved Room Contract

- Room geometry must be rounded / cylindrical / tunnel-like.
- The grid can be generated shader-side or geometry-side, but it must preserve visible curvature.
- Cross markers and technical framing elements are valid secondary geometry.
- White phase can mute or hide the room, but dark phases must restore spatial depth.

## Main Logo Contract

- Minimum structure: base body, outline/edge layer, screen layer.
- Material must support refraction-like sampling from scene texture.
- Material must expose roughness/noise/color controls.
- Logo must support quaternion-driven rotation.
- Vision/service phases must be able to transition the logo from volume to screen-like behavior.

## Performance Budget

- Desktop target: stable `60fps` on a modern laptop GPU during normal scroll.
- Mobile target: stable `30fps+` with reduced complexity.
- One main WebGL canvas for the page stage.
- One separate outro canvas only when required.
- Avoid more than one heavy realtime scene active at once.
- Post stack budget should stay visually rich but operationally small: bloom, fluids, FXAA only.
- No realtime GI, no shadow-heavy scene, no large particle field, no free camera.

## Unknowns

- Exact mesh counts and triangle budgets.
- Exact bloom threshold and blur kernel width.
- Exact grid-room segmentation and whether the room is one mesh or layered shells.
- Exact service scene object count behind the screen-state logo.

## Acceptance Criteria

- This file distinguishes DOM responsibilities from WebGL responsibilities.
- It defines a scene graph that can be implemented directly in Astro + React islands + Three.
- It locks the curved room, volumetric logo, section buffers, and post stack.
- It sets a realistic performance budget and flags the remaining unknowns.
