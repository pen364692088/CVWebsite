import shotbookJson from "@/data/alche-works-shotbook.json";

export const ALCHE_WORKS_CARD_POSE_IDS = [
  "entry-right-lower",
  "lead-center",
  "queue-right-lower-offscreen",
  "queue-right-lower",
  "support-left-upper",
] as const;

export type AlcheWorksCardPoseId = (typeof ALCHE_WORKS_CARD_POSE_IDS)[number];

export const ALCHE_WORKS_CARD_DEBUG_MODES = ["identity", "poster"] as const;

export type AlcheWorksCardDebugMode = (typeof ALCHE_WORKS_CARD_DEBUG_MODES)[number];

export interface AlcheWorksCardPoseDefinition {
  angle: number;
  radiusOffset: number;
  yOffset: number;
  scale: number;
}

export const ALCHE_WORKS_SHOT_IDS = [
  "works-out",
  "cards-a-entry",
  "cards-a-center",
  "cards-b-queue",
  "cards-handoff-mid",
  "cards-settled",
] as const;

export type AlcheWorksShotId = (typeof ALCHE_WORKS_SHOT_IDS)[number];

export interface AlcheWorksShotCardDefinition {
  visible: boolean;
  poseId: AlcheWorksCardPoseId | null;
}

export interface AlcheWorksShotReference {
  videoTime: number;
  taskStillPath?: string;
}

export interface AlcheWorksShotDefinition {
  id: AlcheWorksShotId;
  section: "works" | "works_cards";
  progress: number;
  intro: number;
  card0: AlcheWorksShotCardDefinition;
  card1: AlcheWorksShotCardDefinition;
  reference: AlcheWorksShotReference;
}

export type AlcheWorksCardsShotDefinition = AlcheWorksShotDefinition & { section: "works_cards" };

export interface AlcheWorksCardsSegment {
  phase: "entry" | "queue" | "handoff" | "settled";
  mix: number;
  entryShot: AlcheWorksCardsShotDefinition;
  centerShot: AlcheWorksCardsShotDefinition;
  queueShot: AlcheWorksCardsShotDefinition;
  handoffShot: AlcheWorksCardsShotDefinition;
  settledShot: AlcheWorksCardsShotDefinition;
}

interface AlcheWorksShotbookData {
  poses: Record<AlcheWorksCardPoseId, AlcheWorksCardPoseDefinition>;
  shots: readonly AlcheWorksShotDefinition[];
}

const shotbook = shotbookJson as AlcheWorksShotbookData;

export const ALCHE_WORKS_CARD_POSES = shotbook.poses;
export const ALCHE_WORKS_SHOTS = shotbook.shots;
export const ALCHE_WORKS_SHOTS_BY_ID = new Map(ALCHE_WORKS_SHOTS.map((shot) => [shot.id, shot] as const));
export const ALCHE_WORKS_CAPTURE_SHOTS = ALCHE_WORKS_SHOTS;
export const ALCHE_WORKS_CARDS_SHOTS = ALCHE_WORKS_SHOTS.filter(
  (shot): shot is AlcheWorksCardsShotDefinition => shot.section === "works_cards",
);

export function readAlcheWorksShotId(value: string | null | undefined): AlcheWorksShotId | null {
  if (!value) return null;
  return ALCHE_WORKS_SHOT_IDS.find((shotId) => shotId === value) ?? null;
}

export function readAlcheWorksCardDebugMode(value: string | null | undefined): AlcheWorksCardDebugMode | null {
  if (!value) return null;
  return ALCHE_WORKS_CARD_DEBUG_MODES.find((mode) => mode === value) ?? null;
}

function isIdentityDefaultHost(hostname: string | null | undefined) {
  return hostname === "localhost" || hostname === "127.0.0.1" || Boolean(hostname?.endsWith(".github.io"));
}

export function getDefaultAlcheWorksCardDebugMode(
  params: Pick<URLSearchParams, "get"> | null,
  hostname?: string | null,
): AlcheWorksCardDebugMode {
  if (!params) return "poster";
  const captureMode = params.get("alcheCapture") === "1";
  const shotId = readAlcheWorksShotId(params.get("alcheShot"));
  return captureMode || shotId || isIdentityDefaultHost(hostname) ? "identity" : "poster";
}

export function resolveAlcheWorksCardDebugMode(
  params: Pick<URLSearchParams, "get"> | null,
  hostname?: string | null,
): AlcheWorksCardDebugMode {
  if (!params) return "poster";
  return readAlcheWorksCardDebugMode(params.get("alcheCardDebug")) ?? getDefaultAlcheWorksCardDebugMode(params, hostname);
}

export function getAlcheWorksShotDefinition(shotId: AlcheWorksShotId) {
  return ALCHE_WORKS_SHOTS_BY_ID.get(shotId) ?? null;
}

export function getAlcheWorksCardPoseDefinition(poseId: AlcheWorksCardPoseId) {
  return ALCHE_WORKS_CARD_POSES[poseId];
}

export function getAdjacentAlcheWorksShotId(shotId: AlcheWorksShotId, direction: -1 | 1) {
  const currentIndex = ALCHE_WORKS_SHOT_IDS.indexOf(shotId);
  if (currentIndex < 0) return null;
  return ALCHE_WORKS_SHOT_IDS[currentIndex + direction] ?? null;
}

export function getAlcheWorksShotOverride(shotId: AlcheWorksShotId) {
  const shot = getAlcheWorksShotDefinition(shotId);
  if (!shot) return null;
  return {
    shotId,
    section: shot.section,
    progress: shot.progress,
    intro: shot.intro,
  };
}

export function getAlcheWorksCardsSegment(progress: number): AlcheWorksCardsSegment {
  const [entryShot, centerShot, queueShot, handoffShot, settledShot] = ALCHE_WORKS_CARDS_SHOTS;
  if (!entryShot || !centerShot || !queueShot || !handoffShot || !settledShot) {
    throw new Error("ALCHE works shotbook is missing required works_cards shots.");
  }

  if (progress <= entryShot.progress) {
    return {
      phase: "entry" as const,
      mix: 0,
      entryShot,
      centerShot,
      queueShot,
      handoffShot,
      settledShot,
    };
  }

  if (progress <= centerShot.progress) {
    return {
      phase: "entry" as const,
      mix: (progress - entryShot.progress) / Math.max(centerShot.progress - entryShot.progress, 0.0001),
      entryShot,
      centerShot,
      queueShot,
      handoffShot,
      settledShot,
    };
  }

  if (progress <= queueShot.progress) {
    return {
      phase: "queue" as const,
      mix: (progress - centerShot.progress) / Math.max(queueShot.progress - centerShot.progress, 0.0001),
      entryShot,
      centerShot,
      queueShot,
      handoffShot,
      settledShot,
    };
  }

  if (progress < settledShot.progress) {
    return {
      phase: "handoff" as const,
      mix: (progress - queueShot.progress) / Math.max(settledShot.progress - queueShot.progress, 0.0001),
      entryShot,
      centerShot,
      queueShot,
      handoffShot,
      settledShot,
    };
  }

  return {
    phase: "settled" as const,
    mix: 1,
    entryShot,
    centerShot,
    queueShot,
    handoffShot,
    settledShot,
  };
}
