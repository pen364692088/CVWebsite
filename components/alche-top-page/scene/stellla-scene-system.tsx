"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createStructureMaterial } from "@/components/alche-top-page/scene/alche-top-page-materials";
import type { AlcheTopSceneState } from "@/lib/alche-top-page";

interface StelllaSceneSystemProps {
  sceneState: AlcheTopSceneState;
}

export function StelllaSceneSystem({ sceneState }: StelllaSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(() => createStructureMaterial(), []);
  const frameGeometry = useMemo(() => new THREE.BoxGeometry(0.12, 4.8, 0.12), []);
  const beamGeometry = useMemo(() => new THREE.BoxGeometry(2.4, 0.12, 0.12), []);
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(2.1, 1.24), []);
  const planeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#070a11",
        transparent: true,
        opacity: 0.18,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      material.dispose();
      frameGeometry.dispose();
      beamGeometry.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();
    };
  }, [beamGeometry, frameGeometry, material, planeGeometry, planeMaterial]);

  useFrame((_, delta) => {
    const visible = sceneState.stellla.visible * (1 - sceneState.outro.stageMix * 0.72);

    if (!groupRef.current) return;

    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, -6.4, 3, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, visible * -0.28, 3, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, -0.14 + sceneState.stellla.frameMix * 0.08, 3, delta);
    material.opacity = THREE.MathUtils.damp(material.opacity, visible * 0.92, 4, delta);
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 0.1 + visible * 0.38, 4, delta);
    planeMaterial.opacity = THREE.MathUtils.damp(planeMaterial.opacity, visible * 0.24, 4, delta);
  });

  return (
    <group ref={groupRef}>
      {[-2.4, -0.8, 1.0, 2.48].map((x, index) => (
        <group key={`stellla-frame-${x}`} position={[x, 0.2, -index * 0.7]}>
          <mesh geometry={frameGeometry} position={[-1.08, 0, 0]}>
            <primitive object={material} attach="material" />
          </mesh>
          <mesh geometry={frameGeometry} position={[1.08, 0, 0]}>
            <primitive object={material} attach="material" />
          </mesh>
          <mesh geometry={beamGeometry} position={[0, 1.82, 0]}>
            <primitive object={material} attach="material" />
          </mesh>
          <mesh geometry={beamGeometry} position={[0, -1.82, 0]}>
            <primitive object={material} attach="material" />
          </mesh>
          <mesh geometry={planeGeometry} position={[0, 0.08, -0.12]}>
            <primitive object={planeMaterial} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
