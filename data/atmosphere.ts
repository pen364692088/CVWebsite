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

export const HERO_STAGE_ASSETS = {
  castleMoon: {
    src: "/reference-crops/dark-fantasy-pack/castle-moon.png",
    alt: "Moonlit gothic keep rising from the abyss.",
  },
  dragon: {
    src: "/reference-crops/dark-fantasy-pack/dragon.png",
    alt: "Shadow dragon silhouette crossing the upper sky.",
  },
  knight: {
    src: "/reference-crops/dark-fantasy-pack/knight.png",
    alt: "Dark armored knight relic.",
  },
  book: {
    src: "/reference-crops/dark-fantasy-pack/book.png",
    alt: "Ancient sealed tome relic.",
  },
  raven: {
    src: "/reference-crops/dark-fantasy-pack/raven.png",
    alt: "Black raven sigil relic.",
  },
  flameSwordAltar: {
    src: "/reference-crops/dark-fantasy-pack/flame-sword-altar.png",
    alt: "Sword and candle altar lit by ember fire.",
  },
  enterButton: {
    src: "/reference-crops/dark-fantasy-pack/enter-the-abyss-button.png",
    alt: "Abyss entry button plate.",
  },
  unsealButton: {
    src: "/reference-crops/dark-fantasy-pack/unseal-the-relic-button.png",
    alt: "Ritual unlock button plate.",
  },
  dividerTop: {
    src: "/reference-crops/dark-fantasy-pack/divider_01.png",
    alt: "Ancient border fragment for top frame accents.",
  },
  dividerMid: {
    src: "/reference-crops/dark-fantasy-pack/divider_02.png",
    alt: "Ancient border fragment for side frame accents.",
  },
  dividerBottom: {
    src: "/reference-crops/dark-fantasy-pack/divider_03.png",
    alt: "Ancient border fragment for lower frame accents.",
  },
  dividerCorner: {
    src: "/reference-crops/dark-fantasy-pack/divider_04.png",
    alt: "Ancient border corner ornament for frame corners.",
  },
  ritualStack: {
    src: "/reference-crops/dark-fantasy-pack/ritual-controls-stack.png",
    alt: "Ritual control stack with buttons and seal.",
  },
  ornamentWide: {
    src: "/reference-crops/dark-fantasy-pack/ornament-wide.png",
    alt: "Wide dark fantasy ornament divider.",
  },
  ornamentMid: {
    src: "/reference-crops/dark-fantasy-pack/ornament-mid.png",
    alt: "Mid-width dark fantasy ornament divider.",
  },
  smokeBand: {
    src: "/atmosphere/smoke-band-v2.jpg",
    alt: "Low smoke band crossing the abyss foreground.",
  },
  emberMidOverlay: {
    src: "/atmosphere/embers-mid-overlay.png",
    alt: "Mid-level ember veil for the hero atmosphere.",
  },
  emberBottomOverlay: {
    src: "/atmosphere/embers-bottom-arc.png",
    alt: "Lower ember arc glow for hero atmosphere.",
  },
  sealGlyph: {
    src: "/reference-crops/dark-fantasy-pack/abyss-seal.png",
    alt: "Round abyssal seal glyph.",
  },
} as const;

export const HERO_ATMOSPHERE_LAYERS: AtmosphereLayer[] = [
  {
    id: "smoke-band",
    src: "/atmosphere/smoke-band-v2.jpg",
    alt: "Low-lying smoke band drifting across the foreground of the abyss stage.",
    depth: 0.04,
    opacity: 0.55,
    mobileOpacity: 0.46,
    blendMode: "screen",
    scale: 1,
    objectPosition: "center bottom",
    mobileObjectPosition: "center bottom",
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
