"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createPrismAShape } from "@/components/alche-top-page/scene/scene-helpers";
import type { AlcheTopSceneState } from "@/lib/alche-top-page";

interface ConceptFieldSceneSystemProps {
  sceneState: AlcheTopSceneState;
}

export function ConceptFieldSceneSystem({ sceneState }: ConceptFieldSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fieldRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const bandRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const emblemRef = useRef<THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>>(null);
  const fieldGeometry = useMemo(() => new THREE.PlaneGeometry(18, 11, 1, 1), []);
  const bandGeometry = useMemo(() => new THREE.PlaneGeometry(7.8, 2.3, 1, 1), []);
  const emblemGeometry = useMemo(() => new THREE.ShapeGeometry(createPrismAShape(1.22), 32), []);
  const fieldMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f4f6fb", transparent: true, opacity: 0 }), []);
  const bandMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#dce6ff", transparent: true, opacity: 0 }), []);
  const emblemMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#f7fbff",
        wireframe: true,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      fieldGeometry.dispose();
      bandGeometry.dispose();
      emblemGeometry.dispose();
      fieldMaterial.dispose();
      bandMaterial.dispose();
      emblemMaterial.dispose();
    };
  }, [bandGeometry, bandMaterial, emblemGeometry, emblemMaterial, fieldGeometry, fieldMaterial]);

  useFrame((state, delta) => {
    const whiteMix = Math.max(sceneState.missionIn.whiteMix, sceneState.mission.whiteMix);
    const fieldVisible = Math.max(sceneState.missionIn.visible, sceneState.mission.visible, sceneState.vision.visible, sceneState.visionOut.visible);
    const visionOutroEmblem = sceneState.visionOut.visible > 0 ? (1 - sceneState.visionOut.drainMix * 0.82) * sceneState.visionOut.visible : 0;
    const emblemVisible = Math.max(sceneState.missionIn.emblemMix, sceneState.mission.emblemMix, sceneState.vision.lineMix, visionOutroEmblem);
    const bandVisible = Math.max(sceneState.vision.densityMix, sceneState.visionOut.visible * 0.4);
    const systemVisible = Math.max(fieldVisible, emblemVisible, bandVisible);

    if (groupRef.current) {
      groupRef.current.visible = systemVisible > 0.001;
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, -4.92, 3.2, delta);
      groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, sceneState.vision.densityMix * 0.018, 3.2, delta);
    }

    if (fieldRef.current) {
      fieldRef.current.material.opacity = THREE.MathUtils.damp(fieldRef.current.material.opacity, fieldVisible * (0.18 + whiteMix * 0.76), 4, delta);
    }

    if (bandRef.current) {
      bandRef.current.material.opacity = THREE.MathUtils.damp(bandRef.current.material.opacity, bandVisible * 0.36, 4, delta);
      bandRef.current.rotation.z += delta * 0.02;
    }

    if (emblemRef.current) {
      emblemRef.current.material.opacity = THREE.MathUtils.damp(emblemRef.current.material.opacity, emblemVisible, 4, delta);
      emblemRef.current.scale.setScalar(THREE.MathUtils.damp(emblemRef.current.scale.x, 1 + sceneState.vision.densityMix * 0.08, 4, delta));
    }

    bandMaterial.color.lerpColors(new THREE.Color("#d8e4ff"), new THREE.Color("#ffbfe1"), 0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 0.22));
  });

  return (
    <group ref={groupRef}>
      <mesh ref={fieldRef} geometry={fieldGeometry} position={[0, 0, -0.34]}>
        <primitive object={fieldMaterial} attach="material" />
      </mesh>

      <mesh ref={bandRef} geometry={bandGeometry} position={[0, 0.8, -0.22]} rotation={[0, 0, -0.12]}>
        <primitive object={bandMaterial} attach="material" />
      </mesh>

      <mesh ref={emblemRef} geometry={emblemGeometry} position={[0, -0.16, -0.02]}>
        <primitive object={emblemMaterial} attach="material" />
      </mesh>
    </group>
  );
}
