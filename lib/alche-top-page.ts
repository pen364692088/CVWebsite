import type { AlcheHeroShotId } from "@/lib/alche-hero-lock";
import type { AlchePhaseId as LegacyAlchePhaseId } from "@/lib/alche-contract";

export const ALCHE_TOP_SECTION_IDS = [
  "loading",
  "kv",
  "works_intro",
  "works",
  "works_outro",
  "mission_in",
  "mission",
  "vision",
  "vision_out",
  "service_in",
  "service",
  "stellla",
  "outro",
] as const;

export type AlcheTopSectionId = (typeof ALCHE_TOP_SECTION_IDS)[number];

export const ALCHE_SCROLLABLE_SECTION_IDS = ALCHE_TOP_SECTION_IDS.filter(
  (sectionId): sectionId is Exclude<AlcheTopSectionId, "loading"> => sectionId !== "loading",
);

export type AlcheScrollableSectionId = (typeof ALCHE_SCROLLABLE_SECTION_IDS)[number];

export const ALCHE_TOP_GROUP_IDS = ["top", "works", "about", "vision", "service"] as const;

export type AlcheTopGroupId = (typeof ALCHE_TOP_GROUP_IDS)[number];

export interface AlcheTopSectionDefinition {
  id: AlcheScrollableSectionId;
  label: string;
  groupId: AlcheTopGroupId | null;
  snapRatio: number;
  minHeight: string;
}

export interface AlcheTopGroupDefinition {
  id: AlcheTopGroupId;
  label: string;
  scrollTarget: AlcheScrollableSectionId;
  subsections: readonly AlcheScrollableSectionId[];
}

export interface AlcheTopSectionState {
  activeSection: AlcheTopSectionId;
  activeGroup: AlcheTopGroupId | null;
  sectionProgress: number;
  groupProgress: number;
  heroShotId: AlcheHeroShotId | null;
  introProgress: number;
}

export interface AlcheLegacySceneBridge {
  activePhase: LegacyAlchePhaseId;
  phaseProgress: number;
}

export const ALCHE_TOP_TIMINGS = {
  loadingFade: 0.92,
  introDuration: 1.82,
  navReveal: 0.74,
  indicatorReveal: 0.86,
  newsReveal: 0.96,
} as const;

export const ALCHE_TOP_SCROLL_TUNING = {
  duration: 2.36,
  lerp: 0.028,
  wheelMultiplier: 0.36,
  touchMultiplier: 0.65,
  activeViewport: 0.38,
  activeTriggerStart: "top 38%",
  activeTriggerEnd: "bottom 38%",
} as const;

const BASE_SCROLL_HEIGHT = 112;

function sectionHeight(ratio: number) {
  return `${Math.round(BASE_SCROLL_HEIGHT * ratio)}svh`;
}

export const ALCHE_TOP_SECTIONS: readonly AlcheTopSectionDefinition[] = [
  { id: "kv", label: "kv", groupId: "top", snapRatio: 1, minHeight: sectionHeight(1) },
  { id: "works_intro", label: "works_intro", groupId: "top", snapRatio: 1, minHeight: sectionHeight(1) },
  { id: "works", label: "works", groupId: "works", snapRatio: 1, minHeight: sectionHeight(1.35) },
  { id: "works_outro", label: "works_outro", groupId: "works", snapRatio: 1.5, minHeight: sectionHeight(1.5) },
  { id: "mission_in", label: "mission_in", groupId: "about", snapRatio: 1, minHeight: sectionHeight(1) },
  { id: "mission", label: "mission", groupId: "about", snapRatio: 1, minHeight: sectionHeight(1.05) },
  { id: "vision", label: "vision", groupId: "vision", snapRatio: 1.8, minHeight: sectionHeight(1.7) },
  { id: "vision_out", label: "vision_out", groupId: "vision", snapRatio: 1, minHeight: sectionHeight(1) },
  { id: "service_in", label: "service_in", groupId: "service", snapRatio: 1, minHeight: sectionHeight(1) },
  { id: "service", label: "service", groupId: "service", snapRatio: 1, minHeight: sectionHeight(1.15) },
  { id: "stellla", label: "stellla", groupId: "service", snapRatio: 1, minHeight: sectionHeight(1.22) },
  { id: "outro", label: "outro", groupId: null, snapRatio: 1.5, minHeight: sectionHeight(1.45) },
] as const;

export const ALCHE_TOP_SECTION_MAP = Object.fromEntries(
  ALCHE_TOP_SECTIONS.map((section) => [section.id, section]),
) as Record<AlcheScrollableSectionId, AlcheTopSectionDefinition>;

export const ALCHE_TOP_GROUPS: readonly AlcheTopGroupDefinition[] = [
  { id: "top", label: "TOP", scrollTarget: "kv", subsections: ["kv", "works_intro"] },
  { id: "works", label: "WORKS", scrollTarget: "works", subsections: ["works", "works_outro"] },
  { id: "about", label: "ABOUT", scrollTarget: "mission", subsections: ["mission_in", "mission"] },
  { id: "vision", label: "VISION", scrollTarget: "vision", subsections: ["vision", "vision_out"] },
  { id: "service", label: "SERVICE", scrollTarget: "service", subsections: ["service", "stellla"] },
] as const;

export const ALCHE_TOP_NEWS_VISIBILITY: readonly AlcheTopSectionId[] = [
  "kv",
  "works_intro",
  "works",
  "works_outro",
] as const;

export const ALCHE_TOP_HERO_HUD_VISIBILITY: readonly AlcheTopSectionId[] = ["kv", "works_intro"] as const;

export const ALCHE_TOP_WORKS_VISIBILITY: readonly AlcheTopSectionId[] = [
  "works_intro",
  "works",
  "works_outro",
] as const;

export const ALCHE_TOP_MISSION_VISIBILITY: readonly AlcheTopSectionId[] = ["mission_in", "mission"] as const;

export const ALCHE_TOP_VISION_VISIBILITY: readonly AlcheTopSectionId[] = ["vision", "vision_out"] as const;

export const ALCHE_TOP_SERVICE_VISIBILITY: readonly AlcheTopSectionId[] = ["service_in", "service"] as const;

export const ALCHE_TOP_STELLLA_VISIBILITY: readonly AlcheTopSectionId[] = ["stellla"] as const;

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

export function getTopGroupForSection(sectionId: AlcheTopSectionId): AlcheTopGroupId | null {
  if (sectionId === "loading") return null;
  return ALCHE_TOP_SECTION_MAP[sectionId].groupId;
}

export function deriveKvState(introProgress: number) {
  return {
    wallEstablish: smoothstep(remapRange(introProgress, 0.08, 0.42)),
    wordReveal: smoothstep(remapRange(introProgress, 0.24, 0.62)),
    hudReveal: smoothstep(remapRange(introProgress, 0.56, 0.9)),
  };
}

export function deriveWorksIntroState(progress: number) {
  return {
    handoffMix: smoothstep(remapRange(progress, 0.0, 0.72)),
    sweepMix: smoothstep(remapRange(progress, 0.12, 0.82)),
    alcheFade: smoothstep(remapRange(progress, 0.18, 0.54)),
  };
}

export function deriveWorksState(progress: number, workCount: number) {
  const clamped = clamp01(progress);
  const cardMix = smoothstep(remapRange(clamped, 0.08, 0.58));
  const browseProgress = smoothstep(remapRange(clamped, 0.32, 1.0));
  const travel = browseProgress * Math.max(workCount - 1, 0);
  const activeIndex = Math.min(workCount - 1, Math.floor(travel + 0.35));

  return {
    cardMix,
    browseProgress,
    travel,
    activeIndex,
    activeBlend: travel - Math.floor(travel),
  };
}

export function deriveWorksOutroState(progress: number) {
  return {
    clearMix: smoothstep(remapRange(progress, 0.0, 0.84)),
    residualMix: 1 - smoothstep(remapRange(progress, 0.36, 1.0)),
  };
}

export function deriveMissionState(progress: number) {
  return {
    flattenMix: smoothstep(remapRange(progress, 0.0, 0.82)),
    whiteMix: smoothstep(remapRange(progress, 0.16, 0.92)),
    emblemMix: smoothstep(remapRange(progress, 0.34, 1.0)),
  };
}

export function deriveVisionState(progress: number) {
  return {
    lineMix: smoothstep(remapRange(progress, 0.0, 0.7)),
    densityMix: smoothstep(remapRange(progress, 0.18, 0.94)),
    drainMix: smoothstep(remapRange(progress, 0.52, 1.0)),
  };
}

export function deriveServiceState(progress: number, itemCount: number) {
  const clamped = clamp01(progress);
  const densityMix = smoothstep(remapRange(clamped, 0.0, 0.72));
  const browse = smoothstep(remapRange(clamped, 0.24, 1.0)) * Math.max(itemCount - 1, 0);
  const activeIndex = Math.min(itemCount - 1, Math.floor(browse + 0.25));

  return {
    densityMix,
    browse,
    activeIndex,
  };
}

export function deriveStelllaState(progress: number) {
  return {
    architectureMix: smoothstep(remapRange(progress, 0.0, 0.56)),
    editorialMix: smoothstep(remapRange(progress, 0.38, 0.92)),
    frameMix: smoothstep(remapRange(progress, 0.2, 0.84)),
  };
}

export function deriveOutroState(progress: number) {
  return {
    stageMix: smoothstep(remapRange(progress, 0.0, 0.54)),
    wordmarkMix: smoothstep(remapRange(progress, 0.34, 0.92)),
    footerMix: smoothstep(remapRange(progress, 0.56, 1.0)),
  };
}

export function deriveGroupProgress(sectionId: AlcheTopSectionId, sectionProgress: number) {
  const groupId = getTopGroupForSection(sectionId);
  if (!groupId) return 0;

  const group = ALCHE_TOP_GROUPS.find((entry) => entry.id === groupId);
  if (!group) return 0;

  const index = Math.max(group.subsections.indexOf(sectionId as AlcheScrollableSectionId), 0);
  return clamp01((index + clamp01(sectionProgress)) / group.subsections.length);
}

export function deriveLegacySceneBridge(
  sectionId: AlcheTopSectionId,
  sectionProgress: number,
): AlcheLegacySceneBridge {
  const progress = clamp01(sectionProgress);

  switch (sectionId) {
    case "loading":
    case "kv":
      return { activePhase: "hero", phaseProgress: 0 };
    case "works_intro": {
      const introState = deriveWorksIntroState(progress);
      return { activePhase: "works", phaseProgress: introState.sweepMix * 0.38 };
    }
    case "works": {
      const worksState = deriveWorksState(progress, 4);
      return { activePhase: "works", phaseProgress: 0.26 + worksState.browseProgress * 0.62 };
    }
    case "works_outro": {
      const outroState = deriveWorksOutroState(progress);
      return { activePhase: "works", phaseProgress: 0.82 + outroState.clearMix * 0.18 };
    }
    case "mission_in": {
      const missionState = deriveMissionState(progress);
      return { activePhase: "about", phaseProgress: missionState.flattenMix * 0.3 };
    }
    case "mission": {
      const missionState = deriveMissionState(progress);
      return { activePhase: "about", phaseProgress: 0.24 + missionState.whiteMix * 0.36 };
    }
    case "vision": {
      const visionState = deriveVisionState(progress);
      return { activePhase: "about", phaseProgress: 0.58 + visionState.lineMix * 0.32 };
    }
    case "vision_out": {
      const visionState = deriveVisionState(progress);
      return { activePhase: "stella", phaseProgress: visionState.drainMix * 0.16 };
    }
    case "service_in":
      return { activePhase: "stella", phaseProgress: 0.12 + progress * 0.18 };
    case "service": {
      const serviceState = deriveServiceState(progress, 3);
      return { activePhase: "stella", phaseProgress: 0.28 + serviceState.densityMix * 0.28 };
    }
    case "stellla": {
      const stelllaState = deriveStelllaState(progress);
      return { activePhase: "stella", phaseProgress: 0.58 + stelllaState.editorialMix * 0.34 };
    }
    case "outro": {
      const outroState = deriveOutroState(progress);
      return { activePhase: "contact", phaseProgress: 0.18 + outroState.wordmarkMix * 0.82 };
    }
  }
}
