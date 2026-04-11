import { ALCHE_HERO_LOCK } from "@/lib/alche-hero-lock";

export const ALCHE_PHASE_IDS = ["hero", "works", "vision", "service", "outro"] as const;

export type AlchePhaseId = (typeof ALCHE_PHASE_IDS)[number];

export const ALCHE_TIMINGS = {
  overlayFade: 0.62,
  navReveal: 0.78,
  hudReveal: 0.92,
  heroCopyReveal: 1.08,
  wordmarkReveal: 1.28,
  canvasReveal: 1.72,
  roomRevealDelay: 0.18,
  wordmarkOffset: 0.44,
  heroCopyOffset: 0.68,
  hudOffset: 0.82,
  scrollDuration: 1.06,
  scrollLerp: 0.09,
} as const;

export const ALCHE_PHASE_HEIGHTS: Record<AlchePhaseId, string> = {
  hero: "196svh",
  works: "128svh",
  vision: "118svh",
  service: "128svh",
  outro: "112svh",
};

export const ALCHE_ROOM = {
  radius: 10.5,
  height: 11.8,
  radialSegments: 160,
  heightSegments: 48,
  technicalPlaneCount: 4,
  wallPanelCount: 14,
  braceCount: 8,
} as const;

export const ALCHE_POST = {
  bloomStrength: 0.14,
  bloomRadius: 0.38,
  bloomThreshold: 0.82,
  chromaticOffset: 0.0011,
  filmNoise: 0.012,
  vignette: 0.22,
} as const;

export const ALCHE_CAMERA_STATES: Record<
  AlchePhaseId,
  {
    position: readonly [number, number, number];
    target: readonly [number, number, number];
    prismScale: number;
    roomGlow: number;
    roomExposure: number;
    planeSpread: number;
    whiteMix: number;
    hudBias: number;
    galleryDepth: number;
  }
> = {
  hero: {
    position: ALCHE_HERO_LOCK.camera.position,
    target: ALCHE_HERO_LOCK.camera.target,
    prismScale: 1,
    roomGlow: 0.84,
    roomExposure: 0.86,
    planeSpread: 0.16,
    whiteMix: 0,
    hudBias: 0,
    galleryDepth: 0.18,
  },
  works: {
    position: [0.46, 0.04, 5.26],
    target: [0.26, -0.04, -0.2],
    prismScale: 0.89,
    roomGlow: 0.96,
    roomExposure: 1,
    planeSpread: 1,
    whiteMix: 0,
    hudBias: 0.24,
    galleryDepth: 1,
  },
  vision: {
    position: [0.02, 0.02, 4.94],
    target: [0.02, 0.01, -0.08],
    prismScale: 1.08,
    roomGlow: 0.86,
    roomExposure: 1.12,
    planeSpread: 0.38,
    whiteMix: 1,
    hudBias: -0.2,
    galleryDepth: 0.32,
  },
  service: {
    position: [-0.42, 0.06, 5.4],
    target: [-0.18, 0.0, -0.12],
    prismScale: 0.93,
    roomGlow: 0.92,
    roomExposure: 0.98,
    planeSpread: 0.74,
    whiteMix: 0,
    hudBias: 0.42,
    galleryDepth: 0.56,
  },
  outro: {
    position: [0, 0.02, 5.64],
    target: [0, 0, 0],
    prismScale: 0.82,
    roomGlow: 0.66,
    roomExposure: 0.88,
    planeSpread: 0.08,
    whiteMix: 0,
    hudBias: 0,
    galleryDepth: 0.12,
  },
};

export const ALCHE_HUD_METRICS = [
  "ROOM / CURVED GRID",
  "OBJECT / PRISM A",
  "STATE / LENIS + GSAP",
] as const;

export const ALCHE_SCROLL_MACHINE = [
  { id: "hero", label: "TOP", code: "S-00" },
  { id: "works", label: "WORKS", code: "S-01" },
  { id: "vision", label: "VISION", code: "S-02" },
  { id: "service", label: "SERVICE", code: "S-03" },
  { id: "outro", label: "OUTRO", code: "S-04" },
] as const;
