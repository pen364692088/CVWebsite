export interface AtmosphereLayer {
  id: string;
  src: string;
  alt: string;
  depth: number;
  opacity: number;
  mobileOpacity: number;
  blendMode?: "normal" | "screen" | "soft-light";
  scale?: number;
  objectPosition?: string;
  mobileObjectPosition?: string;
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
    id: "reference-stage",
    src: "/hero/echoes-abyss-stage-v1.png",
    alt: "Reference-aligned abyss stage with moonlit gothic keep, dragon silhouette, ritual cards, and ember-strewn valley.",
    depth: 0.04,
    opacity: 1,
    mobileOpacity: 1,
    blendMode: "normal",
    scale: 1,
    objectPosition: "center top",
    mobileObjectPosition: "center top",
  },
];

export const HERO_PARTICLE_PRESETS: ParticlePreset[] = [
  {
    id: "embers",
    src: "/atmosphere/ember-sprite.png",
    count: 10,
    mobileCount: 6,
    reducedMotionCount: 3,
    baseOpacity: 0.54,
    minDuration: 10,
    maxDuration: 16,
  },
  {
    id: "ash",
    src: "/atmosphere/ash-sprite.png",
    count: 8,
    mobileCount: 4,
    reducedMotionCount: 2,
    baseOpacity: 0.28,
    minDuration: 13,
    maxDuration: 20,
  },
];

export const HERO_PARTICLE_LAYOUT = [
  { x: "8%", y: "24%", scale: 0.52, delay: 0.6, rotate: -8 },
  { x: "22%", y: "18%", scale: 0.58, delay: 1.6, rotate: 10 },
  { x: "72%", y: "16%", scale: 0.5, delay: 2.3, rotate: 5 },
  { x: "88%", y: "28%", scale: 0.54, delay: 3.1, rotate: -12 },
  { x: "10%", y: "52%", scale: 0.72, delay: 1.1, rotate: 2 },
  { x: "24%", y: "48%", scale: 0.8, delay: 4.1, rotate: 18 },
  { x: "52%", y: "45%", scale: 0.76, delay: 0.8, rotate: -5 },
  { x: "76%", y: "44%", scale: 0.7, delay: 2.7, rotate: 6 },
  { x: "90%", y: "53%", scale: 0.82, delay: 3.8, rotate: -14 },
  { x: "7%", y: "72%", scale: 0.92, delay: 0.5, rotate: 10 },
  { x: "18%", y: "84%", scale: 1.04, delay: 1.9, rotate: -4 },
  { x: "35%", y: "78%", scale: 0.88, delay: 3.4, rotate: 8 },
  { x: "52%", y: "70%", scale: 0.68, delay: 4.6, rotate: -16 },
  { x: "67%", y: "80%", scale: 0.92, delay: 2.2, rotate: 0 },
  { x: "84%", y: "72%", scale: 0.86, delay: 5.1, rotate: 12 },
  { x: "93%", y: "86%", scale: 1.02, delay: 2.9, rotate: -6 },
];
