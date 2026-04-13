"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type ComponentProps } from "react";
import * as THREE from "three";

import { AlcheTopPagePostProcessing } from "@/components/alche-top-page/scene/alche-top-page-postprocessing";
import { ConceptFieldSceneSystem } from "@/components/alche-top-page/scene/concept-field-scene-system";
import { KvSceneSystem } from "@/components/alche-top-page/scene/kv-scene-system";
import { OutroSceneSystem } from "@/components/alche-top-page/scene/outro-scene-system";
import { ServiceSceneSystem } from "@/components/alche-top-page/scene/service-scene-system";
import { StelllaSceneSystem } from "@/components/alche-top-page/scene/stellla-scene-system";
import { WorksSceneSystem } from "@/components/alche-top-page/scene/works-scene-system";
import type { AlcheTopSceneState } from "@/lib/alche-top-page";

interface AlcheTopPageSceneProps {
  sceneState: AlcheTopSceneState;
  reducedMotion: boolean;
  kvOnly: boolean;
  kvWallTexturePath: string;
  workCount: number;
  captureMode: boolean;
}

export function AlcheTopPageScene({ sceneState, reducedMotion, kvOnly, kvWallTexturePath, workCount, captureMode }: AlcheTopPageSceneProps) {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const targetRef = useRef(new THREE.Vector3(...sceneState.camera.target));
  const positionRef = useRef(new THREE.Vector3(...sceneState.camera.position));
  const nextTargetRef = useRef(new THREE.Vector3());
  const nextPositionRef = useRef(new THREE.Vector3());
  const fogColor = useMemo(() => new THREE.Color("#010204"), []);

  useFrame((_, delta) => {
    const cameraState = sceneState.camera;
    nextTargetRef.current.set(...cameraState.target);
    nextPositionRef.current.set(...cameraState.position);

    targetRef.current.lerp(nextTargetRef.current, 1 - Math.exp(-delta * 3.8));
    positionRef.current.lerp(nextPositionRef.current, 1 - Math.exp(-delta * 3.4));

    perspectiveCamera.position.copy(positionRef.current);
    perspectiveCamera.fov = THREE.MathUtils.damp(perspectiveCamera.fov, cameraState.fov, 4, delta);
    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.lookAt(targetRef.current);
  });

  const ambientIntensity =
    sceneState.activeSection === "mission" || sceneState.activeSection === "vision" || sceneState.activeSection === "vision_out" ? 0.24 : 0.08;
  const worksSceneProps = { sceneState, reducedMotion, workCount } as unknown as ComponentProps<typeof WorksSceneSystem>;

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={[fogColor, 5.8, 20.6]} />
      <ambientLight intensity={kvOnly ? 0.1 : ambientIntensity} color="#d9e4f6" />
      <spotLight
        position={[0, 5.4, 3]}
        angle={0.54}
        penumbra={0.92}
        intensity={kvOnly ? 18 : 32}
        decay={1.7}
        distance={18}
        color={kvOnly ? "#7e67ff" : "#f2f5ff"}
      />
      <pointLight position={[0, -1.2, 2.4]} intensity={kvOnly ? 0.8 : 1.6} color={kvOnly ? "#5f62ff" : "#a7c9ff"} distance={10} />

      <KvSceneSystem sceneState={sceneState} reducedMotion={reducedMotion} backgroundOnly={kvOnly} wallTexturePath={kvWallTexturePath} />
      {kvOnly ? null : (
        <>
          <WorksSceneSystem {...worksSceneProps} />
          <ConceptFieldSceneSystem sceneState={sceneState} />
          <ServiceSceneSystem sceneState={sceneState} />
          <StelllaSceneSystem sceneState={sceneState} />
          <OutroSceneSystem sceneState={sceneState} />
        </>
      )}
      {captureMode ? null : <AlcheTopPagePostProcessing sceneState={sceneState} />}
    </>
  );
}
