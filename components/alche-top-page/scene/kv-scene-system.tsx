"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { ALCHE_HERO_LOCK, ALCHE_HERO_SHOTS } from "@/lib/alche-hero-lock";
import { ALCHE_TOP_MEDIA_WALL, clamp01, type AlcheTopSceneState } from "@/lib/alche-top-page";
import {
  createCurvedGridMaterial,
  createEmissiveWordMaterial,
  createHaloMaterial,
  createPrismEdgeColor,
  createPrismMaterial,
} from "@/components/alche-top-page/scene/alche-top-page-materials";
import { WordSegments, createPrismAShape, warpPrismGeometry } from "@/components/alche-top-page/scene/scene-helpers";

interface KvSceneSystemProps {
  sceneState: AlcheTopSceneState;
  reducedMotion: boolean;
}

function CurvedMediaWall({ sceneState, reducedMotion }: KvSceneSystemProps) {
  const roomRef = useRef<THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial>>(null);
  const material = useMemo(() => createCurvedGridMaterial(), []);
  const geometry = useMemo(
    () =>
      new THREE.CylinderGeometry(
        ALCHE_TOP_MEDIA_WALL.radius,
        ALCHE_TOP_MEDIA_WALL.radius,
        ALCHE_TOP_MEDIA_WALL.height,
        ALCHE_TOP_MEDIA_WALL.radialSegments,
        ALCHE_TOP_MEDIA_WALL.heightSegments,
        true,
      ),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    if (!roomRef.current) return;

    const pointerYaw = reducedMotion ? 0 : state.pointer.x * (sceneState.activeSection === "kv" ? 0.06 : 0.025);
    const wallVisible = sceneState.kv.wallVisibility * sceneState.kv.visible;

    roomRef.current.rotation.y = THREE.MathUtils.damp(roomRef.current.rotation.y, pointerYaw, 2.4, delta);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uIntro.value = sceneState.introProgress;
    material.uniforms.uGlow.value = THREE.MathUtils.damp(material.uniforms.uGlow.value, sceneState.kv.wallGlow, 3.4, delta);
    material.uniforms.uExposure.value = THREE.MathUtils.damp(material.uniforms.uExposure.value, sceneState.kv.wallExposure, 3.4, delta);
    material.uniforms.uWhiteMix.value = THREE.MathUtils.damp(material.uniforms.uWhiteMix.value, sceneState.kv.wallWhiteMix, 3.4, delta);
    material.uniforms.uFlatten.value = THREE.MathUtils.damp(material.uniforms.uFlatten.value, sceneState.kv.wallFlatten, 3.2, delta);
    material.uniforms.uSceneFade.value = THREE.MathUtils.damp(material.uniforms.uSceneFade.value, wallVisible, 3.2, delta);
  });

  return (
    <mesh ref={roomRef} geometry={geometry}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function FloatingAlcheWordmark({ sceneState, reducedMotion }: KvSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(() => {
    const created = createEmissiveWordMaterial("#ffffff");
    created.opacity = 0;
    created.emissiveIntensity = 0;
    return created;
  }, []);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const visibility = sceneState.kv.wordVisibility * sceneState.kv.visible;
    const pointer = reducedMotion ? 0 : state.pointer.x * 0.12;

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, pointer, 2.8, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.28) * 0.05) * visibility,
      2.8,
      delta,
    );
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, 1 + visibility * 0.02, 3, delta));
    material.opacity = THREE.MathUtils.damp(material.opacity, visibility, 4, delta);
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 1.6 + visibility * 4.4, 4, delta);
  });

  return (
    <group ref={groupRef} position={[0, 0.02, -3.34]} scale={1.18}>
      <WordSegments word="ALCHE" material={material} scale={1.18} depth={0.24} />
    </group>
  );
}

function HeroPrism({ sceneState, reducedMotion }: KvSceneSystemProps) {
  const { size } = useThree();
  const prismRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.ShaderMaterial>>(null);
  const shellRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.ShaderMaterial>>(null);
  const haloRef = useRef<THREE.Mesh<THREE.RingGeometry, THREE.ShaderMaterial>>(null);
  const edgeRef = useRef<THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>>(null);
  const geometry = useMemo(() => {
    const created = new THREE.ExtrudeGeometry(createPrismAShape(1.18), {
      depth: 0.72,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.072,
      bevelThickness: 0.1,
      curveSegments: 26,
    });
    created.center();
    warpPrismGeometry(created);
    return created;
  }, []);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry, 18), [geometry]);
  const haloGeometry = useMemo(() => new THREE.RingGeometry(1.62, 2.88, 192), []);
  const coreMaterial = useMemo(() => createPrismMaterial("core"), []);
  const shellMaterial = useMemo(() => createPrismMaterial("shell"), []);
  const haloMaterial = useMemo(() => createHaloMaterial(), []);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetRotation = useMemo(() => new THREE.Euler(), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      edgesGeometry.dispose();
      haloGeometry.dispose();
      coreMaterial.dispose();
      shellMaterial.dispose();
      haloMaterial.dispose();
    };
  }, [coreMaterial, edgesGeometry, geometry, haloGeometry, haloMaterial, shellMaterial]);

  useFrame((state, delta) => {
    const heroShot = sceneState.heroShotId ? ALCHE_HERO_SHOTS[sceneState.heroShotId] : null;
    const pointerYaw = reducedMotion || sceneState.heroShotId ? 0 : state.pointer.x * 0.22;
    const pointerPitch = reducedMotion || sceneState.heroShotId ? 0 : state.pointer.y * 0.08;
    const floatY = reducedMotion || sceneState.heroShotId ? 0 : Math.sin(state.clock.elapsedTime * 0.62) * 0.04;

    const lockPosition = ALCHE_HERO_LOCK.prism.position;
    const lockRotation = ALCHE_HERO_LOCK.prism.rotation;

    const introHandoff = sceneState.worksIntro.handoffMix;
    const missionFade = Math.max(sceneState.missionIn.whiteMix, sceneState.mission.emblemMix);
    const residualVisibility = sceneState.kv.prismVisibility * sceneState.kv.visible;

    if (sceneState.activeSection === "kv" || sceneState.activeSection === "loading" || sceneState.activeSection === "works_intro") {
      targetPosition.set(
        lockPosition[0] + (heroShot?.prismEmphasis.positionOffset[0] ?? 0) + introHandoff * 0.22,
        lockPosition[1] + floatY + (heroShot?.prismEmphasis.positionOffset[1] ?? 0),
        lockPosition[2] + (heroShot?.prismEmphasis.positionOffset[2] ?? 0) - introHandoff * 0.34,
      );
      targetRotation.set(
        lockRotation[0] + pointerPitch + (heroShot?.prismEmphasis.rotationOffset[0] ?? 0),
        lockRotation[1] + pointerYaw + (heroShot?.prismEmphasis.rotationOffset[1] ?? 0) - introHandoff * 0.24,
        lockRotation[2] + (heroShot?.prismEmphasis.rotationOffset[2] ?? 0),
      );
    } else if (sceneState.activeSection === "works" || sceneState.activeSection === "works_outro") {
      targetPosition.set(0.34, -0.04 + floatY, -0.86);
      targetRotation.set(0.12, 0.08, 0);
    } else if (sceneState.activeSection === "mission_in") {
      targetPosition.set(0.06, 0.02, -1.14);
      targetRotation.set(0.02, 0.0, 0.0);
    } else {
      targetPosition.set(0.08, 0.02, -1.42);
      targetRotation.set(0, -1.08, 0);
    }

    const targetScale =
      sceneState.activeSection === "kv" || sceneState.activeSection === "loading"
        ? sceneState.kv.prismScale
        : sceneState.activeSection === "works_intro"
          ? THREE.MathUtils.lerp(sceneState.kv.prismScale, 0.78, introHandoff)
          : sceneState.activeSection === "works"
            ? 0.68 - sceneState.works.cardMix * 0.08
            : sceneState.activeSection === "works_outro"
              ? 0.52 - sceneState.worksOutro.clearMix * 0.18
              : 0.3 - missionFade * 0.18;

    const whiteMix = clamp01(sceneState.missionIn.whiteMix + sceneState.mission.whiteMix * 0.86 + sceneState.vision.lineMix * 0.4);
    const coreOpacityTarget = residualVisibility * (sceneState.activeSection === "mission_in" ? 1 - missionFade : 1);
    const shellOpacityTarget = coreOpacityTarget * 0.34;
    const edgeOpacityTarget = sceneState.activeSection === "mission_in" ? 0.42 * (1 - sceneState.missionIn.emblemMix) : coreOpacityTarget * 0.54;

    coreMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    coreMaterial.uniforms.uIntro.value = sceneState.introProgress;
    coreMaterial.uniforms.uResolution.value.set(size.width, size.height);
    coreMaterial.uniforms.uWhiteMix.value = THREE.MathUtils.damp(coreMaterial.uniforms.uWhiteMix.value, whiteMix, 3.8, delta);
    coreMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(coreMaterial.uniforms.uIntensity.value, sceneState.activeSection === "kv" ? 1.18 : 0.96, 4, delta);
    coreMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(coreMaterial.uniforms.uOpacity.value, coreOpacityTarget * 0.76, 4, delta);

    shellMaterial.uniforms.uTime.value = state.clock.elapsedTime + 0.72;
    shellMaterial.uniforms.uIntro.value = sceneState.introProgress * 0.96;
    shellMaterial.uniforms.uResolution.value.set(size.width, size.height);
    shellMaterial.uniforms.uWhiteMix.value = coreMaterial.uniforms.uWhiteMix.value;
    shellMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(shellMaterial.uniforms.uIntensity.value, 0.48, 4, delta);
    shellMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(shellMaterial.uniforms.uOpacity.value, shellOpacityTarget, 4, delta);

    haloMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    haloMaterial.uniforms.uIntro.value = sceneState.introProgress;
    haloMaterial.uniforms.uWhiteMix.value = coreMaterial.uniforms.uWhiteMix.value;

    if (prismRef.current) {
      prismRef.current.position.x = THREE.MathUtils.damp(prismRef.current.position.x, targetPosition.x, 4, delta);
      prismRef.current.position.y = THREE.MathUtils.damp(prismRef.current.position.y, targetPosition.y, 4, delta);
      prismRef.current.position.z = THREE.MathUtils.damp(prismRef.current.position.z, targetPosition.z, 4, delta);
      prismRef.current.rotation.x = THREE.MathUtils.damp(prismRef.current.rotation.x, targetRotation.x, 4, delta);
      prismRef.current.rotation.y = THREE.MathUtils.damp(prismRef.current.rotation.y, targetRotation.y, 4, delta);
      prismRef.current.rotation.z = THREE.MathUtils.damp(prismRef.current.rotation.z, targetRotation.z, 4, delta);
      prismRef.current.scale.setScalar(THREE.MathUtils.damp(prismRef.current.scale.x, targetScale, 4.2, delta));
    }

    if (shellRef.current && prismRef.current) {
      shellRef.current.position.copy(prismRef.current.position);
      shellRef.current.rotation.copy(prismRef.current.rotation);
      shellRef.current.scale.setScalar(prismRef.current.scale.x * 1.026);
    }

    if (edgeRef.current && prismRef.current) {
      edgeRef.current.position.copy(prismRef.current.position);
      edgeRef.current.rotation.copy(prismRef.current.rotation);
      edgeRef.current.scale.setScalar(prismRef.current.scale.x * 1.003);
      edgeRef.current.material.color.copy(createPrismEdgeColor(state.clock.elapsedTime * 0.06, coreMaterial.uniforms.uWhiteMix.value));
      edgeRef.current.material.opacity = THREE.MathUtils.damp(edgeRef.current.material.opacity, edgeOpacityTarget, 4, delta);
    }

    if (haloRef.current && prismRef.current) {
      haloRef.current.position.set(prismRef.current.position.x, prismRef.current.position.y, prismRef.current.position.z - 0.84);
      haloRef.current.rotation.z += delta * 0.03;
      const haloScale = sceneState.activeSection === "kv" ? 1 : sceneState.activeSection.startsWith("works") ? 0.82 : 0.36;
      haloRef.current.scale.setScalar(THREE.MathUtils.damp(haloRef.current.scale.x, haloScale, 4, delta));
    }
  });

  return (
    <>
      <mesh ref={haloRef} geometry={haloGeometry}>
        <primitive object={haloMaterial} attach="material" />
      </mesh>

      <mesh ref={shellRef} geometry={geometry}>
        <primitive object={shellMaterial} attach="material" />
      </mesh>

      <mesh ref={prismRef} geometry={geometry}>
        <primitive object={coreMaterial} attach="material" />
      </mesh>

      <lineSegments ref={edgeRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#d8e4ff" transparent opacity={0.68} />
      </lineSegments>
    </>
  );
}

export function KvSceneSystem(props: KvSceneSystemProps) {
  return (
    <>
      <CurvedMediaWall {...props} />
      <FloatingAlcheWordmark {...props} />
      <HeroPrism {...props} />
    </>
  );
}
