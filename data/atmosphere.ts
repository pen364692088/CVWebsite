export interface AtmosphereLayer {
  id: string;
  src: string;
  alt: string;
  depth: number;
  opacity: number;
  mobileOpacity: number;
  blendMode?: "normal" | "screen" | "soft-light";
  scale?: number;
}

export interface ParticlePreset {
  id: string;
  src: string;
  count: number;
  mobileCount: number;
  reducedMotionCount: number;
  baseOpacity: number;
  minDuration: number;
  maxDuration: number;
}

export const HERO_ATMOSPHERE_LAYERS: AtmosphereLayer[] = [
  {
    id: "moon-texture",
    src: "/hero/abyss-castle-moon-unsplash.jpg",
    alt: "Moonlit castle texture used as a distant atmospheric layer.",
    depth: 0.06,
    opacity: 0.16,
    mobileOpacity: 0.1,
    blendMode: "screen",
    scale: 1.06,
  },
  {
    id: "matte-scene",
    src: "/hero/abyss-hero-matte.jpg",
    alt: "Original abyss matte painting with moonlit keep, smoke, dragon trace, and ember-lit approach.",
    depth: 0.12,
    opacity: 1,
    mobileOpacity: 1,
    blendMode: "normal",
    scale: 1.02,
  },
  {
    id: "rear-smoke",
    src: "/atmosphere/smoke-veils-unsplash.jpg",
    alt: "Cold smoke used as a middle atmospheric haze layer.",
    depth: 0.18,
    opacity: 0.22,
    mobileOpacity: 0.15,
    blendMode: "screen",
    scale: 1.04,
  },
  {
    id: "front-smoke",
    src: "/atmosphere/smoke-band.svg",
    alt: "Generated foreground smoke used to frame the ritual cards and lower terrain.",
    depth: 0.28,
    opacity: 0.56,
    mobileOpacity: 0.38,
    blendMode: "screen",
    scale: 1.08,
  },
];

export const HERO_PARTICLE_PRESETS: ParticlePreset[] = [
  {
    id: "embers",
    src: "/atmosphere/ember-sprite.svg",
    count: 8,
    mobileCount: 5,
    reducedMotionCount: 3,
    baseOpacity: 0.66,
    minDuration: 9,
    maxDuration: 15,
  },
  {
    id: "ash",
    src: "/atmosphere/ash-sprite.svg",
    count: 6,
    mobileCount: 3,
    reducedMotionCount: 2,
    baseOpacity: 0.38,
    minDuration: 12,
    maxDuration: 18,
  },
];

export const HERO_PARTICLE_LAYOUT = [
  { x: "6%", y: "84%", scale: 0.72, delay: 0.2, rotate: -8 },
  { x: "14%", y: "76%", scale: 1, delay: 1.4, rotate: 10 },
  { x: "22%", y: "88%", scale: 0.92, delay: 2.1, rotate: 5 },
  { x: "29%", y: "69%", scale: 0.84, delay: 3.2, rotate: -12 },
  { x: "36%", y: "84%", scale: 1.08, delay: 1.1, rotate: 2 },
  { x: "44%", y: "79%", scale: 0.8, delay: 4.1, rotate: 18 },
  { x: "52%", y: "87%", scale: 1.12, delay: 0.8, rotate: -5 },
  { x: "58%", y: "74%", scale: 0.9, delay: 2.7, rotate: 6 },
  { x: "64%", y: "83%", scale: 1.14, delay: 3.8, rotate: -14 },
  { x: "72%", y: "90%", scale: 0.76, delay: 0.5, rotate: 10 },
  { x: "79%", y: "72%", scale: 0.88, delay: 1.9, rotate: -4 },
  { x: "86%", y: "82%", scale: 1.04, delay: 3.4, rotate: 8 },
  { x: "92%", y: "68%", scale: 0.7, delay: 4.6, rotate: -16 },
  { x: "48%", y: "61%", scale: 0.58, delay: 5.1, rotate: 0 },
];
