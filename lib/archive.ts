export const ARCHIVE_LENSES = ["all", "moon", "tower", "ember"] as const;
export const ARCHIVE_PHASES = ["hero", "disciplines", "sigils"] as const;
export const EXPERIENCE_CHAPTERS = [
  "threshold",
  "oath",
  "egocore",
  "ashen-archive",
  "openemotion",
  "contact-coda",
] as const;

export type ArchiveLens = (typeof ARCHIVE_LENSES)[number];
export type SigilLens = Exclude<ArchiveLens, "all">;
export type ArchivePhase = (typeof ARCHIVE_PHASES)[number];
export type ExperienceChapterId = (typeof EXPERIENCE_CHAPTERS)[number];

export interface RelicPreset {
  mode: string;
  color: string;
  emissive: string;
  particleColor: string;
  clearcoat: number;
  iridescence: number;
  ior: number;
  dispersion: number;
  transmission: number;
  roughness: number;
  metalness: number;
  pointSize: number;
  particleJitter: number;
}

export interface RendererStats {
  calls: number;
  points: number;
}

export const DEFAULT_ARCHIVE_LENS: ArchiveLens = "all";
export const ARCHIVE_LENS_KEY = "ashen-archive-lens";
export const DEFAULT_ARCHIVE_PHASE: ArchivePhase = "hero";

export const RELIC_PRESETS: Record<ArchiveLens, RelicPreset> = {
  all: {
    mode: "balanced-shell",
    color: "#111318",
    emissive: "#241c18",
    particleColor: "#d8d3c8",
    clearcoat: 0.92,
    iridescence: 0.82,
    ior: 1.42,
    dispersion: 0.08,
    transmission: 0.28,
    roughness: 0.28,
    metalness: 0.24,
    pointSize: 0.043,
    particleJitter: 0.06,
  },
  moon: {
    mode: "ordered-grid",
    color: "#0d1016",
    emissive: "#111a27",
    particleColor: "#d5ddeb",
    clearcoat: 1,
    iridescence: 0.46,
    ior: 1.48,
    dispersion: 0.02,
    transmission: 0.1,
    roughness: 0.21,
    metalness: 0.32,
    pointSize: 0.038,
    particleJitter: 0.02,
  },
  tower: {
    mode: "faceted-assembly",
    color: "#131517",
    emissive: "#261f18",
    particleColor: "#cdbb96",
    clearcoat: 0.84,
    iridescence: 0.36,
    ior: 1.36,
    dispersion: 0.04,
    transmission: 0.06,
    roughness: 0.16,
    metalness: 0.46,
    pointSize: 0.041,
    particleJitter: 0.035,
  },
  ember: {
    mode: "ember-trace",
    color: "#151112",
    emissive: "#3a1e14",
    particleColor: "#f0b37a",
    clearcoat: 1,
    iridescence: 1,
    ior: 1.52,
    dispersion: 0.14,
    transmission: 0.18,
    roughness: 0.26,
    metalness: 0.18,
    pointSize: 0.048,
    particleJitter: 0.1,
  },
};

export function isArchiveLens(value: string | null): value is ArchiveLens {
  return value !== null && ARCHIVE_LENSES.includes(value as ArchiveLens);
}

export function isArchivePhase(value: string | null): value is ArchivePhase {
  return value !== null && ARCHIVE_PHASES.includes(value as ArchivePhase);
}

export function isExperienceChapter(value: string | null): value is ExperienceChapterId {
  return value !== null && EXPERIENCE_CHAPTERS.includes(value as ExperienceChapterId);
}
