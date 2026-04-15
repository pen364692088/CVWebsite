"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createGalleryPlaneMaterial, createStructureMaterial } from "@/components/alche-top-page/scene/alche-top-page-materials";
import type { AlcheTopSceneState } from "@/lib/alche-top-page";

interface ServiceSceneSystemProps {
  sceneState: AlcheTopSceneState;
}

export function ServiceSceneSystem({ sceneState }: ServiceSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const mediaMaterial = useMemo(() => createGalleryPlaneMaterial(), []);
  const frameMaterial = useMemo(() => createStructureMaterial(), []);
  const plateMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#060910",
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const mediaGeometry = useMemo(() => new THREE.PlaneGeometry(4.6, 2.8), []);
  const frameGeometry = useMemo(() => new THREE.BoxGeometry(0.12, 4.8, 0.12), []);
  const beamGeometry = useMemo(() => new THREE.BoxGeometry(2.4, 0.12, 0.12), []);

  useEffect(() => {
    return () => {
      mediaMaterial.dispose();
      frameMaterial.dispose();
      plateMaterial.dispose();
      mediaGeometry.dispose();
      frameGeometry.dispose();
      beamGeometry.dispose();
    };
  }, [beamGeometry, frameGeometry, frameMaterial, mediaGeometry, mediaMaterial, plateMaterial]);

  useFrame((state, delta) => {
    const visible = Math.max(sceneState.serviceIn.visible, sceneState.service.visible);

    if (groupRef.current) {
      groupRef.current.visible = visible > 0.001;
      groupRef.current.position.set(
        THREE.MathUtils.damp(groupRef.current.position.x, 0.96, 3, delta),
        THREE.MathUtils.damp(groupRef.current.position.y, -0.04, 3, delta),
        THREE.MathUtils.damp(groupRef.current.position.z, -5.44, 3, delta),
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, -0.26, 3, delta);
    }

    mediaMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    mediaMaterial.uniforms.uVisibility.value = THREE.MathUtils.damp(mediaMaterial.uniforms.uVisibility.value, visible, 4, delta);
    mediaMaterial.uniforms.uWhiteMix.value = THREE.MathUtils.damp(mediaMaterial.uniforms.uWhiteMix.value, sceneState.mission.whiteMix, 4, delta);
    mediaMaterial.uniforms.uIndex.value = sceneState.service.activeIndex;

    frameMaterial.opacity = THREE.MathUtils.damp(frameMaterial.opacity, visible * 0.92, 4, delta);
    frameMaterial.emissiveIntensity = THREE.MathUtils.damp(frameMaterial.emissiveIntensity, 0.14 + visible * 0.2, 4, delta);
    plateMaterial.opacity = THREE.MathUtils.damp(plateMaterial.opacity, visible * 0.24, 4, delta);
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh geometry={mediaGeometry} position={[-2.1, 0.22, 0.02]}>
        <primitive object={mediaMaterial} attach="material" />
      </mesh>

      <mesh geometry={mediaGeometry} position={[-2.1, 0.22, -0.06]}>
        <primitive object={plateMaterial} attach="material" />
      </mesh>

      {[-0.48, 1.26].map((x, index) => (
        <group key={`service-frame-${x}`} position={[x, 0.18, -index * 0.4]}>
          <mesh geometry={frameGeometry} position={[-1.08, 0, 0]}>
            <primitive object={frameMaterial} attach="material" />
          </mesh>
          <mesh geometry={frameGeometry} position={[1.08, 0, 0]}>
            <primitive object={frameMaterial} attach="material" />
          </mesh>
          <mesh geometry={beamGeometry} position={[0, 1.82, 0]}>
            <primitive object={frameMaterial} attach="material" />
          </mesh>
          <mesh geometry={beamGeometry} position={[0, -1.82, 0]}>
            <primitive object={frameMaterial} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
