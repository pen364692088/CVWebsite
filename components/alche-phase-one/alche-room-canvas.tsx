"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import { AlcheRoomScene } from "@/components/alche-phase-one/alche-room-scene";
import type { AlchePhaseId } from "@/lib/alche-phase-one";

interface AlcheRoomCanvasProps {
  activePhase: AlchePhaseId;
  phaseProgress: number;
  introProgress: number;
  reducedMotion: boolean;
}

export function AlcheRoomCanvas(props: AlcheRoomCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.08, 5.88], fov: 33.5 }}
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
