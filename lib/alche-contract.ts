import { ALCHE_HERO_LOCK } from "@/lib/alche-hero-lock";

export const ALCHE_PHASE_IDS = ["hero", "works", "about", "stella", "contact"] as const;

export type AlchePhaseId = (typeof ALCHE_PHASE_IDS)[number];

export interface AlchePhaseCameraState {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
  wallCurve: number;
  whiteMix: number;
  wallGlow: number;
  wallExposure: number;
  prismScale: number;
  prismOutline: number;
  architectureMix: number;
  sceneFade: number;
}

export interface AlcheWorkCardIdl {
  id: string;
  code: string;
}

export const ALCHE_TIMINGS = {
  overlayFade: 0.62,
  navReveal: 0.78,
  hudReveal: 0.92,
  railReveal: 0.88,
  canvasReveal: 1.72,
  loadingFade: 1.08,
  roomRevealDelay: 0.18,
  scrollDuration: 1.06,
  scrollLerp: 0.09,
} as const;

export const ALCHE_PHASE_HEIGHTS: Record<AlchePhaseId, string> = {
  hero: "188svh",
  works: "170svh",
  about: "138svh",
  stella: "172svh",
  contact: "126svh",
};

export const ALCHE_ROOM = {
  radius: 10.5,
  height: 12.4,
  radialSegments: 192,
  heightSegments: 72,
  cellColumns: 26,
  cellRows: 14,
  workCardCount: 4,
} as const;

export const ALCHE_POST = {
  bloomStrength: 0.16,
  bloomRadius: 0.34,
  bloomThreshold: 0.82,
  chromaticOffset: 0.0009,
  filmNoise: 0.014,
  vignette: 0.22,
} as const;

export const ALCHE_WORK_CARDS: readonly AlcheWorkCardIdl[] = [
  { id: "ego-core", code: "WK-01" },
  { id: "ashen-archive", code: "WK-02" },
  { id: "open-emotion", code: "WK-03" },
  { id: "runtime-host", code: "WK-04" },
] as const;

export const ALCHE_SCROLL_MACHINE = [
  { id: "hero", label: "HERO", code: "S-00" },
  { id: "works", label: "WORKS", code: "S-01" },
  { id: "about", label: "ABOUT", code: "S-02" },
  { id: "stella", label: "STELLA", code: "S-03" },
  { id: "contact", label: "CONTACT", code: "S-04" },
] as const;

export const ALCHE_HUD_METRICS = [
  "WORLD / 3 PARENTS",
  "TRANSITION / SAME SPACE",
  "DOM / 3D OWNERSHIP",
] as const;

export const ALCHE_WORLD_CONTRACT = {
  persistentParents: ["A slab", "ALCHE emissive wordmark", "cylindrical media wall"],
  domOwnership: {
    persistent: ["top nav", "left state rail"],
    heroOnly: ["right HUD", "bottom-left debug"],
    works: ["active card metadata"],
    stella: ["editorial title and copy"],
    contact: ["footer links and company info"],
  },
} as const;

export const ALCHE_CAMERA_STATES: Record<AlchePhaseId, AlchePhaseCameraState> = {
  hero: {
    position: ALCHE_HERO_LOCK.camera.position,
    target: ALCHE_HERO_LOCK.camera.target,
    fov: ALCHE_HERO_LOCK.camera.fov,
    wallCurve: 1,
    whiteMix: 0,
    wallGlow: 0.84,
    wallExposure: 0.84,
    prismScale: 1,
    prismOutline: 0,
    architectureMix: 0,
    sceneFade: 1,
  },
  works: {
    position: [0.14, 0.16, 5.98],
    target: [0.16, 0.08, -0.7],
    fov: 33.4,
    wallCurve: 1,
    whiteMix: 0,
    wallGlow: 0.92,
    wallExposure: 0.92,
    prismScale: 0.94,
    prismOutline: 0.1,
    architectureMix: 0,
    sceneFade: 1,
  },
  about: {
    position: [0.04, 0.08, 6.16],
    target: [0.06, 0.04, -0.82],
    fov: 32,
    wallCurve: 0,
    whiteMix: 1,
    wallGlow: 0.52,
    wallExposure: 1.1,
    prismScale: 1.08,
    prismOutline: 1,
    architectureMix: 0,
    sceneFade: 1,
  },
  stella: {
    position: [0.96, 0.12, 4.38],
    target: [1.36, 0.02, -1.72],
    fov: 35.2,
    wallCurve: 0.42,
    whiteMix: 0,
    wallGlow: 0.7,
    wallExposure: 0.8,
    prismScale: 0.78,
    prismOutline: 0.18,
    architectureMix: 1,
    sceneFade: 1,
  },
  contact: {
    position: [0, 0.06, 6.42],
    target: [0, 0, -1],
    fov: 30.8,
    wallCurve: 0.12,
    whiteMix: 0,
    wallGlow: 0.18,
    wallExposure: 0.34,
    prismScale: 0.52,
    prismOutline: 0,
    architectureMix: 0.12,
    sceneFade: 0.1,
  },
};

export function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function remapRange(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

export function smoothstep(value: number) {
  const clamped = clamp01(value);
  return clamped * clamped * (3 - 2 * clamped);
}

export function deriveWorksPresentation(progress: number) {
  const clamped = clamp01(progress);
  const sweepProgress = smoothstep(remapRange(clamped, 0, 0.3));
  const sweepOpacity = 1 - smoothstep(remapRange(clamped, 0.2, 0.42));
  const cardMix = smoothstep(remapRange(clamped, 0.24, 0.54));
  const browseProgress = smoothstep(remapRange(clamped, 0.42, 1));
  const travel = browseProgress * Math.max(ALCHE_WORK_CARDS.length - 1, 0);
  const activeIndex = Math.min(ALCHE_WORK_CARDS.length - 1, Math.floor(travel + 0.25));
  const activeBlend = travel - Math.floor(travel);

  return {
    sweepProgress,
    sweepOpacity,
    cardMix,
    browseProgress,
    travel,
    activeIndex,
    activeBlend,
  };
}

export function deriveAboutState(progress: number) {
  const clamped = clamp01(progress);
  return {
    flattenMix: smoothstep(remapRange(clamped, 0.06, 0.44)),
    whiteSweep: smoothstep(remapRange(clamped, 0.14, 0.58)),
    emblemMix: smoothstep(remapRange(clamped, 0.28, 0.82)),
  };
}

export function deriveStellaState(progress: number) {
  const clamped = clamp01(progress);
  return {
    passageMix: smoothstep(remapRange(clamped, 0.0, 0.48)),
    architectureMix: smoothstep(remapRange(clamped, 0.24, 0.72)),
    editorialMix: smoothstep(remapRange(clamped, 0.62, 0.94)),
  };
}

export function deriveContactState(progress: number) {
  const clamped = clamp01(progress);
  return {
    drainMix: smoothstep(remapRange(clamped, 0, 0.48)),
    footerMix: smoothstep(remapRange(clamped, 0.3, 0.92)),
  };
}
