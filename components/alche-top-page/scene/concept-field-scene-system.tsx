"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createEmissiveWordMaterial } from "@/components/alche-top-page/scene/alche-top-page-materials";
import { createPrismAShape, buildWordLayout } from "@/components/alche-top-page/scene/scene-helpers";
import type { AlcheTopSceneState } from "@/lib/alche-top-page";

interface ConceptFieldSceneSystemProps {
  sceneState: AlcheTopSceneState;
}

function createOutlinePoints(scale: number) {
  const shape = createPrismAShape(scale);
  const points = shape.extractPoints(48).shape;
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function ConceptFieldSceneSystem({ sceneState }: ConceptFieldSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fieldRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const bandRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const outlineRef = useRef<THREE.LineLoop<THREE.BufferGeometry, THREE.LineBasicMaterial>>(null);
  const wordGroupRef = useRef<THREE.Group>(null);
  const fieldGeometry = useMemo(() => new THREE.PlaneGeometry(18, 11, 1, 1), []);
  const bandGeometry = useMemo(() => new THREE.PlaneGeometry(7.8, 2.3, 1, 1), []);
  const outlineGeometry = useMemo(() => createOutlinePoints(1.22), []);
  const slabGeometry = useMemo(() => new THREE.PlaneGeometry(2.4, 0.12), []);
  const fieldMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f4f6fb", transparent: true, opacity: 0 }), []);
  const bandMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#dce6ff", transparent: true, opacity: 0 }), []);
  const outlineMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: "#f7fbff", transparent: true, opacity: 0 }), []);
  const slabMaterial = useMemo(() => createEmissiveWordMaterial("#edf4ff"), []);
  const layout = useMemo(() => buildWordLayout("ALCHE"), []);
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  useEffect(() => {
    return () => {
      fieldGeometry.dispose();
      bandGeometry.dispose();
      outlineGeometry.dispose();
      slabGeometry.dispose();
      boxGeometry.dispose();
      fieldMaterial.dispose();
      bandMaterial.dispose();
      outlineMaterial.dispose();
      slabMaterial.dispose();
    };
  }, [bandGeometry, bandMaterial, boxGeometry, fieldGeometry, fieldMaterial, outlineGeometry, outlineMaterial, slabGeometry, slabMaterial]);

  useFrame((state, delta) => {
    const whiteMix = Math.max(sceneState.missionIn.whiteMix, sceneState.mission.whiteMix);
    const fieldVisible = Math.max(sceneState.missionIn.visible, sceneState.mission.visible, sceneState.vision.visible, sceneState.visionOut.visible);
    const outlineVisible = Math.max(sceneState.missionIn.emblemMix, sceneState.mission.emblemMix, sceneState.vision.lineMix, 1 - sceneState.visionOut.drainMix * 0.82);
    const bandVisible = Math.max(sceneState.vision.densityMix, sceneState.visionOut.visible * 0.4);

    if (groupRef.current) {
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

    if (outlineRef.current) {
      outlineRef.current.material.opacity = THREE.MathUtils.damp(outlineRef.current.material.opacity, outlineVisible, 4, delta);
      outlineRef.current.scale.setScalar(THREE.MathUtils.damp(outlineRef.current.scale.x, 1 + sceneState.vision.densityMix * 0.08, 4, delta));
    }

    if (wordGroupRef.current) {
      const wordOpacity = sceneState.vision.visible > 0 ? 0.1 + sceneState.vision.densityMix * 0.28 : 0;
      wordGroupRef.current.position.y = THREE.MathUtils.damp(wordGroupRef.current.position.y, -1.18 + sceneState.vision.densityMix * 0.14, 3, delta);
      slabMaterial.opacity = THREE.MathUtils.damp(slabMaterial.opacity, wordOpacity, 4, delta);
      slabMaterial.emissiveIntensity = THREE.MathUtils.damp(slabMaterial.emissiveIntensity, 0.6 + sceneState.vision.densityMix * 0.7, 4, delta);
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

      <lineLoop ref={outlineRef} geometry={outlineGeometry} position={[0, -0.16, -0.02]}>
        <primitive object={outlineMaterial} attach="material" />
      </lineLoop>

      <group ref={wordGroupRef} position={[0, -1.18, 0.08]} scale={0.36}>
        {layout.map((segment, index) => (
          <mesh
            key={`concept-word-${index}`}
            geometry={boxGeometry}
            material={slabMaterial}
            position={[segment.centerX * 0.92, segment.y * 0.92, 0]}
            rotation={[0, 0, segment.rot ?? 0]}
            scale={[segment.w * 0.92, segment.h * 0.92, 0.08]}
          />
        ))}
      </group>
    </group>
  );
}
