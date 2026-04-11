"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createEmissiveWordMaterial } from "@/components/alche-top-page/scene/alche-top-page-materials";
import { WordSegments, createPrismAShape } from "@/components/alche-top-page/scene/scene-helpers";
import type { AlcheTopSceneState } from "@/lib/alche-top-page";

interface OutroSceneSystemProps {
  sceneState: AlcheTopSceneState;
}

function createOutlinePoints(scale: number) {
  const shape = createPrismAShape(scale);
  const points = shape.extractPoints(48).shape;
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function OutroSceneSystem({ sceneState }: OutroSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const brandRef = useRef<THREE.Group>(null);
  const outlineRef = useRef<THREE.LineLoop<THREE.BufferGeometry, THREE.LineBasicMaterial>>(null);
  const plateRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);
  const wordMaterial = useMemo(() => {
    const created = createEmissiveWordMaterial("#ffffff");
    created.opacity = 0;
    created.emissiveIntensity = 0;
    return created;
  }, []);
  const outlineGeometry = useMemo(() => createOutlinePoints(0.9), []);
  const plateGeometry = useMemo(() => new THREE.PlaneGeometry(20, 12), []);
  const plateMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#030406", transparent: true, opacity: 0 }), []);

  useEffect(() => {
    return () => {
      wordMaterial.dispose();
      outlineGeometry.dispose();
      plateGeometry.dispose();
      plateMaterial.dispose();
    };
  }, [outlineGeometry, plateGeometry, plateMaterial, wordMaterial]);

  useFrame((state, delta) => {
    const visible = sceneState.outro.visible;

    if (groupRef.current) {
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, -5.86, 3, delta);
    }

    if (plateRef.current) {
      plateRef.current.material.opacity = THREE.MathUtils.damp(plateRef.current.material.opacity, visible * 0.86, 4, delta);
    }

    if (brandRef.current) {
      brandRef.current.position.x = THREE.MathUtils.damp(brandRef.current.position.x, 0.2, 3, delta);
      brandRef.current.position.y = THREE.MathUtils.damp(brandRef.current.position.y, -0.24 + sceneState.outro.wordmarkMix * 0.12, 3, delta);
      brandRef.current.scale.setScalar(THREE.MathUtils.damp(brandRef.current.scale.x, 0.88 + sceneState.outro.wordmarkMix * 0.2, 4, delta));
    }

    if (outlineRef.current) {
      outlineRef.current.material.opacity = THREE.MathUtils.damp(outlineRef.current.material.opacity, visible * (1 - sceneState.outro.wordmarkMix * 0.52), 4, delta);
      outlineRef.current.rotation.z += delta * 0.01;
    }

    wordMaterial.opacity = THREE.MathUtils.damp(wordMaterial.opacity, visible * sceneState.outro.wordmarkMix, 4, delta);
    wordMaterial.emissiveIntensity = THREE.MathUtils.damp(wordMaterial.emissiveIntensity, 0.6 + sceneState.outro.wordmarkMix * 2.8, 4, delta);
  });

  return (
    <group ref={groupRef}>
      <mesh ref={plateRef} geometry={plateGeometry} position={[0, 0, -0.4]}>
        <primitive object={plateMaterial} attach="material" />
      </mesh>

      <lineLoop ref={outlineRef} geometry={outlineGeometry} position={[-3.2, -0.34, -0.02]}>
        <lineBasicMaterial color="#d6dff3" transparent opacity={0.48} />
      </lineLoop>

      <group ref={brandRef} position={[0.2, -0.14, 0.06]} scale={0.94}>
        <WordSegments word="ALCHE" material={wordMaterial} scale={1.42} depth={0.18} />
      </group>
    </group>
  );
}
