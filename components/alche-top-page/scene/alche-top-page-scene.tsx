"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { AlcheTopPagePostProcessing } from "@/components/alche-top-page/scene/alche-top-page-postprocessing";
import { KvSceneSystem } from "@/components/alche-top-page/scene/kv-scene-system";
import type { AlcheWorksCardDebugMode } from "@/lib/alche-works-shotbook";
import type { AlcheLayerDebugState, AlchePointerDebugState, AlcheTopSceneState } from "@/lib/alche-top-page";

interface AlcheTopPageSceneProps {
  sceneState: AlcheTopSceneState;
  reducedMotion: boolean;
  kvWallTexturePath: string;
  worksCardItems: readonly { title: string; imageSrc: string }[];
  cardDebugMode: AlcheWorksCardDebugMode;
  captureMode: boolean;
  worksWordHandoff: number;
  pointerOverride: { x: number; y: number } | null;
  pointerDebugRef: { current: AlchePointerDebugState };
  layerDebugRef: { current: AlcheLayerDebugState };
}

export function AlcheTopPageScene({
  sceneState,
  reducedMotion,
  kvWallTexturePath,
  worksCardItems,
  cardDebugMode,
  captureMode,
  worksWordHandoff,
  pointerOverride,
  pointerDebugRef,
  layerDebugRef,
}: AlcheTopPageSceneProps) {
  const { camera, size } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const targetRef = useRef(new THREE.Vector3(...sceneState.camera.target));
  const positionRef = useRef(new THREE.Vector3(...sceneState.camera.position));
  const nextTargetRef = useRef(new THREE.Vector3());
  const nextPositionRef = useRef(new THREE.Vector3());
  const fogColor = useMemo(() => new THREE.Color("#010204"), []);
  const pinnedShotMode =
    captureMode || (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("alcheShot"));

  useFrame((_, delta) => {
    const cameraState = sceneState.camera;
    nextTargetRef.current.set(...cameraState.target);
    nextPositionRef.current.set(...cameraState.position);

    if (pinnedShotMode) {
      targetRef.current.copy(nextTargetRef.current);
      positionRef.current.copy(nextPositionRef.current);
    } else {
      targetRef.current.lerp(nextTargetRef.current, 1 - Math.exp(-delta * 3.8));
      positionRef.current.lerp(nextPositionRef.current, 1 - Math.exp(-delta * 3.4));
    }

    perspectiveCamera.position.copy(positionRef.current);
    perspectiveCamera.fov = pinnedShotMode ? cameraState.fov : THREE.MathUtils.damp(perspectiveCamera.fov, cameraState.fov, 4, delta);
    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.lookAt(targetRef.current);
    layerDebugRef.current.viewportWidth = size.width;
    layerDebugRef.current.viewportHeight = size.height;
    layerDebugRef.current.cameraPosition = [
      perspectiveCamera.position.x,
      perspectiveCamera.position.y,
      perspectiveCamera.position.z,
    ];
    layerDebugRef.current.cameraTarget = [targetRef.current.x, targetRef.current.y, targetRef.current.z];
  });

  const ambientIntensity =
    sceneState.activeSection === "mission" || sceneState.activeSection === "vision" || sceneState.activeSection === "vision_out" ? 0.24 : 0.08;

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={[fogColor, 5.8, 20.6]} />
      <ambientLight intensity={Math.max(0.1, ambientIntensity)} color="#d9e4f6" />
      <spotLight
        position={[0, 5.4, 3]}
        angle={0.54}
        penumbra={0.92}
        intensity={18}
        decay={1.7}
        distance={18}
        color="#7e67ff"
      />
      <pointLight
        position={[0, -1.2, 2.4]}
        intensity={0.8}
        color="#5f62ff"
        distance={10}
      />

      <KvSceneSystem
        sceneState={sceneState}
        reducedMotion={reducedMotion}
        wallTexturePath={kvWallTexturePath}
        worksCardItems={worksCardItems}
        cardDebugMode={cardDebugMode}
        worksWordHandoff={worksWordHandoff}
        pointerOverride={pointerOverride}
        pointerDebugRef={pointerDebugRef}
        layerDebugRef={layerDebugRef}
      />
      {captureMode ? null : <AlcheTopPagePostProcessing sceneState={sceneState} />}
    </>
  );
}
