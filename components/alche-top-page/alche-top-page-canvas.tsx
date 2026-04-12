"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
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
  kvOnly: boolean;
  kvGlyphTexturePath: string;
  workCount: number;
  workImagePaths: string[];
  serviceCount: number;
}

interface AlcheCanvasCaptureOverride {
  section: AlcheTopSectionId;
  progress: number;
  intro: number;
  heroShotId: AlcheHeroShotId | null;
}

export function AlcheTopPageCanvas({
  activeSection,
  sectionProgress,
  introProgress,
  heroShotId,
  reducedMotion,
  kvOnly,
  kvGlyphTexturePath,
  workCount,
  workImagePaths,
  serviceCount,
}: AlcheTopPageCanvasProps) {
  const captureMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("alcheCapture") === "1";
  const [captureOverride, setCaptureOverride] = useState<AlcheCanvasCaptureOverride | null>(null);
  const resolvedActiveSection = captureOverride?.section ?? activeSection;
  const resolvedSectionProgress = captureOverride?.progress ?? sectionProgress;
  const resolvedIntroProgress = captureOverride?.intro ?? introProgress;
  const resolvedHeroShotId = captureOverride?.heroShotId ?? heroShotId;
  const sceneState = useMemo(
    () => deriveTopSceneState(resolvedActiveSection, resolvedSectionProgress, resolvedIntroProgress, resolvedHeroShotId, workCount, serviceCount),
    [resolvedActiveSection, resolvedHeroShotId, resolvedIntroProgress, resolvedSectionProgress, serviceCount, workCount],
  );
  const sceneReducedMotion = reducedMotion || captureMode;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const host = window as typeof window & {
      __setAlcheSceneOverride?: (nextOverride: AlcheCanvasCaptureOverride | null) => void;
    };

    host.__setAlcheSceneOverride = (nextOverride) => {
      setCaptureOverride(nextOverride);
    };

    return () => {
      delete host.__setAlcheSceneOverride;
    };
  }, []);

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
      <AlcheTopPageScene
        sceneState={sceneState}
        reducedMotion={sceneReducedMotion}
        kvOnly={kvOnly}
        kvGlyphTexturePath={kvGlyphTexturePath}
        workCount={workCount}
        workImagePaths={workImagePaths}
        captureMode={captureMode}
      />
    </Canvas>
  );
}
