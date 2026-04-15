"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { AlcheTopPageScene } from "@/components/alche-top-page/scene/alche-top-page-scene";
import type { AlcheHeroShotId } from "@/lib/alche-hero-lock";
import { ALCHE_HERO_LOCK } from "@/lib/alche-hero-lock";
import {
  deriveTopSceneState,
  deriveWorksWordHandoff,
  type AlcheLayerDebugState,
  type AlchePointerDebugState,
  type AlcheTopSectionId,
} from "@/lib/alche-top-page";

interface AlcheTopPageCanvasProps {
  activeSection: AlcheTopSectionId;
  sectionProgress: number;
  introProgress: number;
  heroShotId: AlcheHeroShotId | null;
  worksWordHandoff: number;
  reducedMotion: boolean;
  minimalScene: boolean;
  kvWallTexturePath: string;
  worksCardItems: readonly { title: string; imageSrc: string }[];
  workCount: number;
  serviceCount: number;
  canvasEventSource: HTMLElement | null;
  pointerDebugEnabled: boolean;
}

interface AlcheCanvasCaptureOverride {
  section: AlcheTopSectionId;
  progress: number;
  intro: number;
  heroShotId: AlcheHeroShotId | null;
}

interface AlchePointerOverride {
  x: number;
  y: number;
}

export function AlcheTopPageCanvas({
  activeSection,
  sectionProgress,
  introProgress,
  heroShotId,
  worksWordHandoff,
  reducedMotion,
  minimalScene,
  kvWallTexturePath,
  worksCardItems,
  workCount,
  serviceCount,
  canvasEventSource,
  pointerDebugEnabled,
}: AlcheTopPageCanvasProps) {
  const captureMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("alcheCapture") === "1";
  const [captureOverride, setCaptureOverride] = useState<AlcheCanvasCaptureOverride | null>(null);
  const [pointerOverride, setPointerOverride] = useState<AlchePointerOverride | null>(null);
  const resolvedActiveSection = captureOverride?.section ?? activeSection;
  const resolvedSectionProgress = captureOverride?.progress ?? sectionProgress;
  const resolvedIntroProgress = captureOverride?.intro ?? introProgress;
  const resolvedHeroShotId = captureOverride?.heroShotId ?? heroShotId;
  const sceneState = useMemo(
    () => deriveTopSceneState(resolvedActiveSection, resolvedSectionProgress, resolvedIntroProgress, resolvedHeroShotId, workCount, serviceCount),
    [resolvedActiveSection, resolvedHeroShotId, resolvedIntroProgress, resolvedSectionProgress, serviceCount, workCount],
  );
  const sceneReducedMotion = reducedMotion || captureMode;
  const pointerDebugRef = useRef<AlchePointerDebugState>({
    enabled: pointerDebugEnabled,
    prefersReducedMotion: reducedMotion,
    reducedMotion: sceneReducedMotion,
    domPointerClientX: null,
    domPointerClientY: null,
    domPointerInside: false,
    r3fPointerX: 0,
    r3fPointerY: 0,
    modelRotationX: null,
    modelRotationY: null,
    modelRotationZ: null,
  });
  const layerDebugRef = useRef<AlcheLayerDebugState>({
    cameraPosition: [0, 0, 0],
    cameraTarget: [0, 0, 0],
    wallWorldZ: null,
    wallRotationY: null,
    worksWorldX: null,
    modelWorldZ: null,
    modelScale: null,
    moonflowWorldZ: null,
    worksWorldZ: null,
    worksRotationY: null,
    worksHandoff: null,
    moonflowOpacity: null,
    worksOpacity: null,
    worksDepthTest: null,
    worksDepthWrite: null,
    worksTransparent: null,
    cardsOpacity: null,
    cardsLeadIndex: null,
    cardsLeadOpacity: null,
    cardsSupportOpacity: null,
    card0Opacity: null,
    card1Opacity: null,
    card0WorldX: null,
    card0WorldZ: null,
    card1WorldX: null,
    card1WorldZ: null,
    card0ScreenLeft: null,
    card0ScreenRight: null,
    card1ScreenLeft: null,
    card1ScreenRight: null,
    cardsLeadWorldX: null,
    cardsLeadWorldZ: null,
    cardsSupportWorldX: null,
    cardsSupportWorldZ: null,
  });

  pointerDebugRef.current.enabled = pointerDebugEnabled;
  pointerDebugRef.current.reducedMotion = sceneReducedMotion;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      pointerDebugRef.current.prefersReducedMotion = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
    };
  }, [pointerDebugRef]);

  useEffect(() => {
    if (!pointerDebugEnabled || !canvasEventSource) {
      pointerDebugRef.current.domPointerInside = false;
      pointerDebugRef.current.domPointerClientX = null;
      pointerDebugRef.current.domPointerClientY = null;
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerDebugRef.current.domPointerClientX = event.clientX;
      pointerDebugRef.current.domPointerClientY = event.clientY;
      pointerDebugRef.current.domPointerInside = true;
    };

    const handlePointerLeave = () => {
      pointerDebugRef.current.domPointerInside = false;
    };

    canvasEventSource.addEventListener("pointermove", handlePointerMove);
    canvasEventSource.addEventListener("pointerenter", handlePointerMove);
    canvasEventSource.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      canvasEventSource.removeEventListener("pointermove", handlePointerMove);
      canvasEventSource.removeEventListener("pointerenter", handlePointerMove);
      canvasEventSource.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [canvasEventSource, pointerDebugEnabled, pointerDebugRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const host = window as typeof window & {
      __setAlcheSceneOverride?: (nextOverride: AlcheCanvasCaptureOverride | null) => void;
      __setAlchePointerOverride?: (nextOverride: AlchePointerOverride | null) => void;
      __clearAlchePointerOverride?: () => void;
      __getAlchePointerDebugState?: () => AlchePointerDebugState;
      __getAlcheLayerDebugState?: () => AlcheLayerDebugState;
    };

    host.__setAlcheSceneOverride = (nextOverride) => {
      setCaptureOverride(nextOverride);
    };

    host.__setAlchePointerOverride = (nextOverride) => {
      setPointerOverride(nextOverride);
    };

    host.__clearAlchePointerOverride = () => {
      setPointerOverride(null);
    };

    host.__getAlchePointerDebugState = () => ({ ...pointerDebugRef.current });
    host.__getAlcheLayerDebugState = () => ({ ...layerDebugRef.current });

    return () => {
      delete host.__setAlcheSceneOverride;
      delete host.__setAlchePointerOverride;
      delete host.__clearAlchePointerOverride;
      delete host.__getAlchePointerDebugState;
      delete host.__getAlcheLayerDebugState;
    };
  }, [layerDebugRef, pointerDebugRef]);

  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: ALCHE_HERO_LOCK.camera.position, fov: ALCHE_HERO_LOCK.camera.fov }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      eventSource={canvasEventSource ?? undefined}
      eventPrefix="client"
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
        minimalScene={minimalScene}
        kvWallTexturePath={kvWallTexturePath}
        worksCardItems={worksCardItems}
        workCount={workCount}
        captureMode={captureMode}
        worksWordHandoff={captureOverride ? deriveWorksWordHandoff(captureOverride.section, captureOverride.progress) : worksWordHandoff}
        pointerOverride={pointerOverride}
        pointerDebugRef={pointerDebugRef}
        layerDebugRef={layerDebugRef}
      />
    </Canvas>
  );
}
