"use client";

import { AlcheRoomCanvas } from "@/components/alche-phase-one/alche-room-canvas";
import type { AlcheHeroShotId } from "@/lib/alche-hero-lock";
import {
  deriveLegacySceneBridge,
  type AlcheTopSectionId,
} from "@/lib/alche-top-page";

interface AlcheTopPageCanvasProps {
  activeSection: AlcheTopSectionId;
  sectionProgress: number;
  introProgress: number;
  heroShotId: AlcheHeroShotId | null;
  reducedMotion: boolean;
}

export function AlcheTopPageCanvas({
  activeSection,
  sectionProgress,
  introProgress,
  heroShotId,
  reducedMotion,
}: AlcheTopPageCanvasProps) {
  const bridge = deriveLegacySceneBridge(activeSection, sectionProgress);

  return (
    <AlcheRoomCanvas
      activePhase={bridge.activePhase}
      heroShotId={activeSection === "kv" ? heroShotId : null}
      phaseProgress={bridge.phaseProgress}
      introProgress={introProgress}
      reducedMotion={reducedMotion}
    />
  );
}
