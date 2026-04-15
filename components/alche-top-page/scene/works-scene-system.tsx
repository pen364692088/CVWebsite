"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createGalleryPlaneMaterial } from "@/components/alche-top-page/scene/alche-top-page-materials";
import { WordSegments, createBentCardGeometry, buildWordLayout } from "@/components/alche-top-page/scene/scene-helpers";
import { ALCHE_TOP_MEDIA_WALL, type AlcheTopSceneState } from "@/lib/alche-top-page";

interface WorksSceneSystemProps {
  sceneState: AlcheTopSceneState;
  reducedMotion: boolean;
  workCount: number;
  workImagePaths: string[];
}

function CurvedWorkSweep({ sceneState }: WorksSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#f4f7fc",
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  );
  const boxGeometry = useMemo(() => new THREE.PlaneGeometry(1, 1), []);
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
        ? sceneState.worksIntro.sweepMix * (1 - sceneState.worksIntro.alcheFade * 0.2)
        : sceneState.activeSection === "works"
          ? Math.max(0, 1 - sceneState.works.cardMix * 1.28)
          : sceneState.activeSection === "works_outro"
            ? sceneState.worksOutro.residualMix * 0.22
            : 0;

    if (groupRef.current) {
      groupRef.current.visible = visible > 0.001;
    }

    material.opacity = THREE.MathUtils.damp(material.opacity, visible, 4, delta);
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
  const radius = ALCHE_TOP_MEDIA_WALL.radius - 0.08;
  const scale = 0.68;

  return (
    <group ref={groupRef} visible={false}>
      {layout.map((segment, index) => {
        const angle = baseAngle + (segment.centerX * scale) / radius;
        return (
          <mesh
            key={`work-${index}`}
            geometry={boxGeometry}
            material={material}
            position={[Math.sin(angle) * radius, segment.y * scale + 0.16, Math.cos(angle) * radius - 0.04]}
            rotation={[0, angle, segment.rot ?? 0]}
            scale={[segment.w * scale, segment.h * scale, 1]}
          />
        );
      })}
    </group>
  );
}

function WorksCardTrack({ sceneState, reducedMotion, workCount, workImagePaths }: WorksSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRefs = useRef<Array<THREE.Group | null>>([]);
  const planeGeometry = useMemo(() => createBentCardGeometry(), []);
  const planeEdges = useMemo(() => new THREE.EdgesGeometry(planeGeometry), [planeGeometry]);
  const posterTextures = useLoader(THREE.TextureLoader, workImagePaths);
  const backingMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#10151d",
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const frameMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#dfe7f5",
        transparent: true,
        opacity: 0,
      }),
    [],
  );
  const planeMaterials = useMemo(() => Array.from({ length: workCount }, () => createGalleryPlaneMaterial()), [workCount]);
  const posterMaterials = useMemo(
    () =>
      posterTextures.map((texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;
        return new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0,
          toneMapped: false,
        });
      }),
    [posterTextures],
  );

  useEffect(() => {
    return () => {
      planeGeometry.dispose();
      planeEdges.dispose();
      backingMaterial.dispose();
      frameMaterial.dispose();
      planeMaterials.forEach((material) => material.dispose());
      posterMaterials.forEach((material) => material.dispose());
    };
  }, [backingMaterial, frameMaterial, planeEdges, planeGeometry, planeMaterials, posterMaterials]);

  useFrame((state, delta) => {
    const sectionVisibleMix =
      sceneState.activeSection === "works_intro"
        ? sceneState.worksIntro.handoffMix * 0.56
        : sceneState.activeSection === "works"
          ? sceneState.works.cardMix
          : sceneState.activeSection === "works_outro"
            ? Math.max(0, 1 - sceneState.worksOutro.clearMix * 1.4) * sceneState.worksOutro.residualMix
            : 0;
    const detachmentMix =
      sceneState.activeSection === "works_intro"
        ? THREE.MathUtils.smoothstep(sceneState.worksIntro.handoffMix, 0.52, 0.92) * 0.34
        : sceneState.activeSection === "works"
          ? THREE.MathUtils.smoothstep(sceneState.works.cardMix, 0.18, 0.96)
        : sceneState.activeSection === "works_outro"
          ? Math.max(0, 1 - sceneState.worksOutro.clearMix * 1.28) * 0.28
          : 0;
    const travel =
      sceneState.activeSection === "works"
        ? sceneState.works.travel
        : sceneState.activeSection === "works_outro"
          ? workCount - 1 + sceneState.worksOutro.clearMix
          : 0;

    if (groupRef.current) {
      groupRef.current.visible = sectionVisibleMix > 0.001;
      if (!groupRef.current.visible) {
        backingMaterial.opacity = THREE.MathUtils.damp(backingMaterial.opacity, 0, 5, delta);
        frameMaterial.opacity = THREE.MathUtils.damp(frameMaterial.opacity, 0, 5, delta);
        planeMaterials.forEach((material) => {
          material.uniforms.uVisibility.value = THREE.MathUtils.damp(material.uniforms.uVisibility.value, 0, 5, delta);
        });
        posterMaterials.forEach((material) => {
          material.opacity = THREE.MathUtils.damp(material.opacity, 0, 5, delta);
        });
        return;
      }

      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, sceneState.activeSection === "works" ? 0.02 : 0.06, 2.8, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, sceneState.activeSection === "works" ? 0 : -0.1, 2.8, delta);
    }

    planeMaterials.forEach((material, index) => {
      const node = cardRefs.current[index];
      if (!node) return;

      const relative = index - travel;
      const clampedRelative = THREE.MathUtils.clamp(relative, -2.4, 2.4);
      const distance = Math.abs(clampedRelative);
      const focus = 1 - THREE.MathUtils.clamp(distance / 2.2, 0, 1);
      const focusMix = focus * focus * (3 - 2 * focus);
      const cardDetachment = detachmentMix * THREE.MathUtils.lerp(0.18, 1, focusMix);

      const wallAngle = clampedRelative * 0.23;
      const wallX = Math.sin(wallAngle) * 1.84 + 0.46;
      const wallY = 0.14 - distance * 0.036 + focusMix * 0.02;
      const wallZ = -2.1 - distance * 0.14 + focusMix * 0.05;
      const wallRotY = -wallAngle * 0.94;
      const wallScale = 0.62 - Math.min(distance * 0.05, 0.14) + focusMix * 0.04;

      const arcAngle = clampedRelative * 0.36;
      const foregroundFloat = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.42 + index) * (0.006 + focusMix * 0.006);
      const foregroundX = Math.sin(arcAngle) * 2.06 + 0.42;
      const foregroundY = 0.02 - distance * 0.082 + foregroundFloat;
      const foregroundZ = -0.18 - distance * 0.34 + focusMix * 0.28;
      const foregroundRotY = -arcAngle * 0.86;
      const foregroundScale = 0.74 - Math.min(distance * 0.1, 0.22) + focusMix * 0.12;

      const targetX = THREE.MathUtils.lerp(wallX, foregroundX, cardDetachment);
      const targetY = THREE.MathUtils.lerp(wallY, foregroundY, cardDetachment);
      const targetZ = THREE.MathUtils.lerp(wallZ, foregroundZ, cardDetachment);
      const targetRotY = THREE.MathUtils.lerp(wallRotY, foregroundRotY, cardDetachment);
      const targetScale = THREE.MathUtils.lerp(wallScale, foregroundScale, cardDetachment);
      const visibilityTarget = Math.max(
        0,
        sectionVisibleMix * (1 - Math.max(Math.abs(relative) - 2.2, 0) * 0.8) * Math.max(sceneState.introProgress, 0.65),
      );

      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uVisibility.value = THREE.MathUtils.damp(material.uniforms.uVisibility.value, visibilityTarget * 0.28, 4, delta);
      material.uniforms.uWhiteMix.value = THREE.MathUtils.damp(material.uniforms.uWhiteMix.value, sceneState.missionIn.whiteMix, 4, delta);
      material.uniforms.uIndex.value = index;
      posterMaterials[index].opacity = THREE.MathUtils.damp(posterMaterials[index].opacity, visibilityTarget * 0.96, 4, delta);

      node.position.x = THREE.MathUtils.damp(node.position.x, targetX, 4, delta);
      node.position.y = THREE.MathUtils.damp(node.position.y, targetY, 4, delta);
      node.position.z = THREE.MathUtils.damp(node.position.z, targetZ, 4, delta);
      node.rotation.x = THREE.MathUtils.damp(node.rotation.x, 0.04, 4, delta);
      node.rotation.y = THREE.MathUtils.damp(node.rotation.y, targetRotY, 4, delta);
      node.scale.setScalar(THREE.MathUtils.damp(node.scale.x, targetScale, 4, delta));
    });

    backingMaterial.opacity = THREE.MathUtils.damp(backingMaterial.opacity, sectionVisibleMix * 0.012, 4, delta);
    frameMaterial.opacity = THREE.MathUtils.damp(frameMaterial.opacity, sectionVisibleMix * 0.22, 4, delta);
  });

  return (
    <group ref={groupRef} visible={false}>
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
          <mesh geometry={planeGeometry} position={[0, 0, -0.01]}>
            <primitive object={posterMaterials[index]} attach="material" />
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
