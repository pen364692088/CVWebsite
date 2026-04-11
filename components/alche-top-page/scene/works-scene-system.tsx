"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createEmissiveWordMaterial, createGalleryPlaneMaterial } from "@/components/alche-top-page/scene/alche-top-page-materials";
import { WordSegments, createBentCardGeometry, buildWordLayout } from "@/components/alche-top-page/scene/scene-helpers";
import { ALCHE_TOP_MEDIA_WALL, type AlcheTopSceneState } from "@/lib/alche-top-page";

interface WorksSceneSystemProps {
  sceneState: AlcheTopSceneState;
  reducedMotion: boolean;
  workCount: number;
}

function CurvedWorkSweep({ sceneState }: WorksSceneSystemProps) {
  const material = useMemo(() => {
    const created = createEmissiveWordMaterial("#ffffff");
    created.opacity = 0;
    created.emissiveIntensity = 0;
    return created;
  }, []);
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const layout = useMemo(() => buildWordLayout("WORK", 0.24), []);

  useEffect(() => {
    return () => {
      material.dispose();
      boxGeometry.dispose();
    };
  }, [boxGeometry, material]);

  useFrame((_, delta) => {
    const visible =
      sceneState.activeSection === "works_intro"
        ? sceneState.worksIntro.sweepMix
        : sceneState.activeSection === "works"
          ? 1 - sceneState.works.cardMix * 0.28
          : sceneState.activeSection === "works_outro"
            ? sceneState.worksOutro.residualMix
            : 0;

    material.opacity = THREE.MathUtils.damp(material.opacity, visible, 4, delta);
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 1.2 + visible * 4.2, 4, delta);
  });

  const baseProgress =
    sceneState.activeSection === "works_intro"
      ? sceneState.worksIntro.sweepMix
      : sceneState.activeSection === "works"
        ? 1
        : sceneState.activeSection === "works_outro"
          ? 1 + sceneState.worksOutro.clearMix * 0.12
          : 0;
  const baseAngle = THREE.MathUtils.lerp(-0.72, 0.68, Math.min(baseProgress, 1));
  const radius = ALCHE_TOP_MEDIA_WALL.radius - 0.32;
  const scale = 0.96;

  return (
    <>
      {layout.map((segment, index) => {
        const angle = baseAngle + (segment.centerX * scale) / radius;
        return (
          <mesh
            key={`work-${index}`}
            geometry={boxGeometry}
            material={material}
            position={[Math.sin(angle) * radius, segment.y * scale + 0.28, Math.cos(angle) * radius]}
            rotation={[0, angle, segment.rot ?? 0]}
            scale={[segment.w * scale, segment.h * scale, 0.18]}
          />
        );
      })}
    </>
  );
}

function WorksCardTrack({ sceneState, reducedMotion, workCount }: WorksSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRefs = useRef<Array<THREE.Group | null>>([]);
  const planeGeometry = useMemo(() => createBentCardGeometry(), []);
  const planeEdges = useMemo(() => new THREE.EdgesGeometry(planeGeometry), [planeGeometry]);
  const backingMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#05070b",
        transparent: true,
        opacity: 0.12,
      }),
    [],
  );
  const frameMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#dfe7f5",
        transparent: true,
        opacity: 0.2,
      }),
    [],
  );
  const planeMaterials = useMemo(() => Array.from({ length: workCount }, () => createGalleryPlaneMaterial()), [workCount]);

  useEffect(() => {
    return () => {
      planeGeometry.dispose();
      planeEdges.dispose();
      backingMaterial.dispose();
      frameMaterial.dispose();
      planeMaterials.forEach((material) => material.dispose());
    };
  }, [backingMaterial, frameMaterial, planeEdges, planeGeometry, planeMaterials]);

  useFrame((state, delta) => {
    const visibleMix =
      sceneState.activeSection === "works_intro"
        ? sceneState.worksIntro.handoffMix * 0.48
        : sceneState.activeSection === "works"
          ? sceneState.works.cardMix
          : sceneState.activeSection === "works_outro"
            ? 1 - sceneState.worksOutro.clearMix
            : 0;
    const travel =
      sceneState.activeSection === "works"
        ? sceneState.works.travel
        : sceneState.activeSection === "works_outro"
          ? workCount - 1 + sceneState.worksOutro.clearMix
          : 0;

    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, sceneState.activeSection === "works" ? 0.02 : 0.06, 2.8, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, sceneState.activeSection === "works" ? 0 : -0.1, 2.8, delta);
    }

    planeMaterials.forEach((material, index) => {
      const node = cardRefs.current[index];
      if (!node) return;

      const relative = index - travel;
      const clampedRelative = THREE.MathUtils.clamp(relative, -2.4, 2.4);
      const arcAngle = clampedRelative * 0.44;
      const targetX = visibleMix < 0.1 ? 4.4 + index * 0.8 : Math.sin(arcAngle) * 3.1 + 0.18;
      const targetY = visibleMix < 0.1 ? -0.12 : 0.06 - Math.abs(clampedRelative) * 0.14 + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.42 + index) * 0.02);
      const targetZ = visibleMix < 0.1 ? -0.08 : 1.16 - Math.abs(clampedRelative) * 0.74;
      const targetRotY = visibleMix < 0.1 ? -0.44 : -arcAngle * 0.92;
      const targetScale = visibleMix < 0.1 ? 0.82 : 1.12 - Math.min(Math.abs(clampedRelative) * 0.18, 0.42);
      const visibilityTarget = Math.max(0, visibleMix * (1 - Math.max(Math.abs(relative) - 2.2, 0) * 0.8) * Math.max(sceneState.introProgress, 0.65));

      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uVisibility.value = THREE.MathUtils.damp(material.uniforms.uVisibility.value, visibilityTarget, 4, delta);
      material.uniforms.uWhiteMix.value = THREE.MathUtils.damp(material.uniforms.uWhiteMix.value, sceneState.missionIn.whiteMix, 4, delta);
      material.uniforms.uIndex.value = index;

      node.position.x = THREE.MathUtils.damp(node.position.x, targetX, 4, delta);
      node.position.y = THREE.MathUtils.damp(node.position.y, targetY, 4, delta);
      node.position.z = THREE.MathUtils.damp(node.position.z, targetZ, 4, delta);
      node.rotation.x = THREE.MathUtils.damp(node.rotation.x, 0.04, 4, delta);
      node.rotation.y = THREE.MathUtils.damp(node.rotation.y, targetRotY, 4, delta);
      node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, targetScale, 4, delta));
    });

    backingMaterial.opacity = THREE.MathUtils.damp(backingMaterial.opacity, visibleMix * 0.26, 4, delta);
    frameMaterial.opacity = THREE.MathUtils.damp(frameMaterial.opacity, visibleMix * 0.42, 4, delta);
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: workCount }, (_, index) => (
        <group
          key={`work-card-${index}`}
          ref={(node) => {
            cardRefs.current[index] = node;
          }}
        >
          <mesh geometry={planeGeometry} position={[0, 0, -0.03]}>
            <primitive object={backingMaterial} attach="material" />
          </mesh>
          <mesh geometry={planeGeometry}>
            <primitive object={planeMaterials[index]} attach="material" />
          </mesh>
          <lineSegments geometry={planeEdges}>
            <primitive object={frameMaterial} attach="material" />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

export function WorksSceneSystem(props: WorksSceneSystemProps) {
  return (
    <>
      <CurvedWorkSweep {...props} />
      <WorksCardTrack {...props} />
    </>
  );
}
