"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { ALCHE_HERO_LOCK, type AlcheHeroShotId } from "@/lib/alche-hero-lock";
import { AlcheRoomScene } from "@/components/alche-phase-one/alche-room-scene";
import type { AlchePhaseId } from "@/lib/alche-phase-one";

interface AlcheRoomCanvasProps {
  activePhase: AlchePhaseId;
  heroShotId: AlcheHeroShotId | null;
  phaseProgress: number;
  introProgress: number;
  reducedMotion: boolean;
}

export function AlcheRoomCanvas(props: AlcheRoomCanvasProps) {
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
      <AlcheRoomScene {...props} />
    </Canvas>
  );
}
