"use client";

import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { AlcheTopPageScene } from "@/components/alche-top-page/scene/alche-top-page-scene";
import type { AlcheHeroShotId } from "@/lib/alche-hero-lock";
import { ALCHE_HERO_LOCK } from "@/lib/alche-hero-lock";
import { deriveTopSceneState, type AlcheTopSectionId } from "@/lib/alche-top-page";

interface AlcheTopPageCanvasProps {
  activeSection: AlcheTopSectionId;
  sectionProgress: number;
  introProgress: number;
  heroShotId: AlcheHeroShotId | null;
  reducedMotion: boolean;
  workCount: number;
  serviceCount: number;
}

export function AlcheTopPageCanvas({
  activeSection,
  sectionProgress,
  introProgress,
  heroShotId,
  reducedMotion,
  workCount,
  serviceCount,
}: AlcheTopPageCanvasProps) {
  const captureMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("alcheCapture") === "1";
  const sceneState = useMemo(
    () => deriveTopSceneState(activeSection, sectionProgress, introProgress, heroShotId, workCount, serviceCount),
    [activeSection, heroShotId, introProgress, sectionProgress, serviceCount, workCount],
  );

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: ALCHE_HERO_LOCK.camera.position, fov: ALCHE_HERO_LOCK.camera.fov }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.04;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.setClearColor("#000000", 1);
      }}
    >
      <AlcheTopPageScene sceneState={sceneState} reducedMotion={reducedMotion} workCount={workCount} captureMode={captureMode} />
    </Canvas>
  );
}
