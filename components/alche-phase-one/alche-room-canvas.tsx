"use client";

import { Canvas } from "@react-three/fiber";

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
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.08, 5.88], fov: 35 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
    >
      <AlcheRoomScene {...props} />
    </Canvas>
  );
}
