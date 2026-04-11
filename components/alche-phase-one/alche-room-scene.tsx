"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { AlchePostProcessing } from "@/components/alche-phase-one/alche-postprocessing";
import {
  createCurvedGridMaterial,
  createEmissiveWordMaterial,
  createGalleryPlaneMaterial,
  createHaloMaterial,
  createPrismEdgeColor,
  createPrismMaterial,
  createStructureMaterial,
} from "@/components/alche-phase-one/alche-room-materials";
import {
  ALCHE_CAMERA_STATES,
  ALCHE_ROOM,
  ALCHE_WORK_CARDS,
  clamp01,
  deriveAboutState,
  deriveContactState,
  deriveStellaState,
  deriveWorksPresentation,
  type AlchePhaseId,
} from "@/lib/alche-contract";
import { ALCHE_HERO_LOCK, ALCHE_HERO_SHOTS, type AlcheHeroShotId } from "@/lib/alche-hero-lock";

interface AlcheRoomSceneProps {
  activePhase: AlchePhaseId;
  heroShotId: AlcheHeroShotId | null;
  phaseProgress: number;
  introProgress: number;
  reducedMotion: boolean;
}

interface SegmentConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: number;
}

interface LetterBlueprint {
  width: number;
  segments: readonly SegmentConfig[];
}

const LETTERS: Record<string, LetterBlueprint> = {
  A: {
    width: 1.14,
    segments: [
      { x: 0.28, y: 0.02, w: 0.18, h: 1.9, rot: 0.34 },
      { x: 0.86, y: 0.02, w: 0.18, h: 1.9, rot: -0.34 },
      { x: 0.57, y: -0.1, w: 0.62, h: 0.16 },
    ],
  },
  L: {
    width: 0.92,
    segments: [
      { x: 0.14, y: 0, w: 0.18, h: 1.88 },
      { x: 0.48, y: -0.82, w: 0.76, h: 0.18 },
    ],
  },
  C: {
    width: 1.04,
    segments: [
      { x: 0.16, y: 0, w: 0.18, h: 1.56 },
      { x: 0.52, y: 0.72, w: 0.72, h: 0.18 },
      { x: 0.52, y: -0.72, w: 0.72, h: 0.18 },
    ],
  },
  H: {
    width: 1.04,
    segments: [
      { x: 0.16, y: 0, w: 0.18, h: 1.88 },
      { x: 0.88, y: 0, w: 0.18, h: 1.88 },
      { x: 0.52, y: 0, w: 0.72, h: 0.18 },
    ],
  },
  E: {
    width: 1,
    segments: [
      { x: 0.14, y: 0, w: 0.18, h: 1.88 },
      { x: 0.52, y: 0.78, w: 0.72, h: 0.18 },
      { x: 0.48, y: 0.02, w: 0.62, h: 0.18 },
      { x: 0.52, y: -0.78, w: 0.72, h: 0.18 },
    ],
  },
  W: {
    width: 1.46,
    segments: [
      { x: 0.16, y: 0.04, w: 0.16, h: 1.74, rot: 0.1 },
      { x: 0.54, y: -0.08, w: 0.16, h: 1.7, rot: -0.22 },
      { x: 0.94, y: -0.08, w: 0.16, h: 1.7, rot: 0.22 },
      { x: 1.3, y: 0.04, w: 0.16, h: 1.74, rot: -0.1 },
    ],
  },
  O: {
    width: 1.18,
    segments: [
      { x: 0.2, y: 0, w: 0.16, h: 1.56 },
      { x: 0.98, y: 0, w: 0.16, h: 1.56 },
      { x: 0.58, y: 0.72, w: 0.72, h: 0.16 },
      { x: 0.58, y: -0.72, w: 0.72, h: 0.16 },
    ],
  },
  R: {
    width: 1.16,
    segments: [
      { x: 0.16, y: 0, w: 0.18, h: 1.88 },
      { x: 0.58, y: 0.78, w: 0.72, h: 0.18 },
      { x: 0.9, y: 0.36, w: 0.18, h: 0.84 },
      { x: 0.54, y: 0, w: 0.62, h: 0.18 },
      { x: 0.76, y: -0.54, w: 0.16, h: 1.1, rot: -0.54 },
    ],
  },
  K: {
    width: 1.08,
    segments: [
      { x: 0.16, y: 0, w: 0.18, h: 1.88 },
      { x: 0.68, y: 0.42, w: 0.16, h: 1.1, rot: 0.68 },
      { x: 0.68, y: -0.42, w: 0.16, h: 1.1, rot: -0.68 },
    ],
  },
};

function buildWordLayout(word: string, spacing = 0.26) {
  let cursor = 0;
  const placements: Array<SegmentConfig & { centerX: number }> = [];

  for (const letter of word) {
    const blueprint = LETTERS[letter];
    if (!blueprint) continue;
    for (const segment of blueprint.segments) {
      placements.push({
        ...segment,
        centerX: cursor + segment.x,
      });
    }
    cursor += blueprint.width + spacing;
  }

  const totalWidth = Math.max(cursor - spacing, 0);
  const offset = totalWidth * 0.5;

  return placements.map((segment) => ({
    ...segment,
    centerX: segment.centerX - offset,
  }));
}

function createPrismAShape(scale: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, scale * 1.46);
  shape.lineTo(-scale * 1.02, -scale * 1.3);
  shape.lineTo(-scale * 0.64, -scale * 1.3);
  shape.lineTo(-scale * 0.18, scale * 0.02);
  shape.lineTo(scale * 0.18, scale * 0.02);
  shape.lineTo(scale * 0.64, -scale * 1.3);
  shape.lineTo(scale * 1.02, -scale * 1.3);
  shape.closePath();

  const aperture = new THREE.Path();
  aperture.moveTo(0, scale * 0.76);
  aperture.lineTo(-scale * 0.3, -scale * 0.06);
  aperture.lineTo(scale * 0.3, -scale * 0.06);
  aperture.closePath();
  shape.holes.push(aperture);

  const crossbar = new THREE.Path();
  crossbar.moveTo(-scale * 0.34, -scale * 0.28);
  crossbar.lineTo(scale * 0.34, -scale * 0.28);
  crossbar.lineTo(scale * 0.24, -scale * 0.1);
  crossbar.lineTo(-scale * 0.24, -scale * 0.1);
  crossbar.closePath();
  shape.holes.push(crossbar);

  return shape;
}

function warpPrismGeometry(geometry: THREE.ExtrudeGeometry) {
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const point = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);

    const side = Math.sign(point.z || 1);
    const bodyBias = Math.abs(point.x) * 0.055 + Math.max(point.y, -1.2) * 0.02;
    const apexPull = THREE.MathUtils.smoothstep(point.y, 0.18, 1.7) * 0.05;
    point.z += side * (bodyBias + apexPull);
    point.x += side * point.y * 0.012;

    positions.setXYZ(index, point.x, point.y, point.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
}

function createBentCardGeometry() {
  const geometry = new THREE.PlaneGeometry(2.66, 1.6, 28, 1);
  const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
  const point = new THREE.Vector3();

  for (let index = 0; index < positions.count; index += 1) {
    point.fromBufferAttribute(positions, index);
    const normalized = point.x / 1.33;
    point.z = -Math.abs(normalized) * 0.16 - normalized * normalized * 0.06;
    positions.setXYZ(index, point.x, point.y, point.z);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function CurvedMediaWall({
  activePhase,
  phaseProgress,
  introProgress,
}: {
  activePhase: AlchePhaseId;
  phaseProgress: number;
  introProgress: number;
}) {
  const roomRef = useRef<THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial>>(null);
  const material = useMemo(() => createCurvedGridMaterial(), []);
  const geometry = useMemo(
    () =>
      new THREE.CylinderGeometry(
        ALCHE_ROOM.radius,
        ALCHE_ROOM.radius,
        ALCHE_ROOM.height,
        ALCHE_ROOM.radialSegments,
        ALCHE_ROOM.heightSegments,
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
    const pointerYaw =
      activePhase === "hero" ? state.pointer.x * 0.06 : activePhase === "works" ? state.pointer.x * 0.025 : 0;
    const aboutState = deriveAboutState(activePhase === "about" ? phaseProgress : activePhase === "stella" ? 1 : 0);
    const contactState = deriveContactState(activePhase === "contact" ? phaseProgress : 0);
    const phase = ALCHE_CAMERA_STATES[activePhase];

    if (!roomRef.current) return;

    roomRef.current.rotation.y = THREE.MathUtils.damp(roomRef.current.rotation.y, pointerYaw, 2.4, delta);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uIntro.value = introProgress;
    material.uniforms.uGlow.value = THREE.MathUtils.damp(material.uniforms.uGlow.value, phase.wallGlow, 3.4, delta);
    material.uniforms.uExposure.value = THREE.MathUtils.damp(
      material.uniforms.uExposure.value,
      phase.wallExposure,
      3.4,
      delta,
    );
    material.uniforms.uWhiteMix.value = THREE.MathUtils.damp(
      material.uniforms.uWhiteMix.value,
      activePhase === "about" ? aboutState.whiteSweep : phase.whiteMix,
      3.4,
      delta,
    );
    material.uniforms.uFlatten.value = THREE.MathUtils.damp(
      material.uniforms.uFlatten.value,
      activePhase === "about" ? aboutState.flattenMix : phase.wallCurve < 1 ? 1 - phase.wallCurve : 0,
      3.2,
      delta,
    );
    material.uniforms.uSceneFade.value = THREE.MathUtils.damp(
      material.uniforms.uSceneFade.value,
      activePhase === "contact" ? 1 - contactState.drainMix * 0.92 : phase.sceneFade,
      3.2,
      delta,
    );
  });

  return (
    <mesh ref={roomRef} geometry={geometry}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function WordSegments({
  word,
  material,
  scale,
  depth,
}: {
  word: string;
  material: THREE.Material;
  scale: number;
  depth: number;
}) {
  const boxGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const layout = useMemo(() => buildWordLayout(word), [word]);

  useEffect(() => {
    return () => {
      boxGeometry.dispose();
    };
  }, [boxGeometry]);

  return (
    <>
      {layout.map((segment, index) => (
        <mesh
          key={`${word}-${index}`}
          geometry={boxGeometry}
          material={material}
          position={[segment.centerX * scale, segment.y * scale, 0]}
          rotation={[0, 0, segment.rot ?? 0]}
          scale={[segment.w * scale, segment.h * scale, depth]}
        />
      ))}
    </>
  );
}

function FloatingAlcheWordmark({
  activePhase,
  phaseProgress,
  introProgress,
  reducedMotion,
}: {
  activePhase: AlchePhaseId;
  phaseProgress: number;
  introProgress: number;
  reducedMotion: boolean;
}) {
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
    const pointer = reducedMotion ? 0 : state.pointer.x * 0.12;
    const visibility =
      activePhase === "hero"
        ? clamp01((introProgress - 0.26) / 0.4)
        : activePhase === "works"
          ? 1 - clamp01(phaseProgress / 0.22)
          : 0;

    if (!groupRef.current) return;

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

function CurvedWorkSweep({
  activePhase,
  phaseProgress,
}: {
  activePhase: AlchePhaseId;
  phaseProgress: number;
}) {
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
    const worksState = deriveWorksPresentation(activePhase === "works" ? phaseProgress : 0);
    const visible = activePhase === "works" ? worksState.sweepOpacity : 0;
    material.opacity = THREE.MathUtils.damp(material.opacity, visible, 4, delta);
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 1.2 + visible * 4.2, 4, delta);
  });

  const worksState = deriveWorksPresentation(activePhase === "works" ? phaseProgress : 0);
  const baseAngle = THREE.MathUtils.lerp(-0.72, 0.68, worksState.sweepProgress);
  const radius = ALCHE_ROOM.radius - 0.32;
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

function HeroPrism({
  activePhase,
  heroShotId,
  phaseProgress,
  introProgress,
  reducedMotion,
}: {
  activePhase: AlchePhaseId;
  heroShotId: AlcheHeroShotId | null;
  phaseProgress: number;
  introProgress: number;
  reducedMotion: boolean;
}) {
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
    const worksState = deriveWorksPresentation(activePhase === "works" ? phaseProgress : 0);
    const aboutState = deriveAboutState(activePhase === "about" ? phaseProgress : 0);
    const stellaState = deriveStellaState(activePhase === "stella" ? phaseProgress : 0);
    const contactState = deriveContactState(activePhase === "contact" ? phaseProgress : 0);
    const heroShot = activePhase === "hero" && heroShotId ? ALCHE_HERO_SHOTS[heroShotId] : null;
    const pointerYaw =
      reducedMotion || heroShot
        ? 0
        : activePhase === "hero"
          ? state.pointer.x * 0.22
          : activePhase === "works"
            ? state.pointer.x * 0.08
            : 0;
    const pointerPitch =
      reducedMotion || heroShot
        ? 0
        : activePhase === "hero"
          ? state.pointer.y * 0.08
          : activePhase === "works"
            ? state.pointer.y * 0.03
            : 0;
    const floatY = reducedMotion || heroShot ? 0 : Math.sin(state.clock.elapsedTime * 0.62) * 0.04;

    const lockPosition = ALCHE_HERO_LOCK.prism.position;
    const lockRotation = ALCHE_HERO_LOCK.prism.rotation;
    const lockScale = ALCHE_HERO_LOCK.prism.scale;

    if (activePhase === "hero") {
      targetPosition.set(
        lockPosition[0] + (heroShot?.prismEmphasis.positionOffset[0] ?? 0),
        lockPosition[1] + floatY + (heroShot?.prismEmphasis.positionOffset[1] ?? 0),
        lockPosition[2] + (heroShot?.prismEmphasis.positionOffset[2] ?? 0),
      );
      targetRotation.set(
        lockRotation[0] + pointerPitch + (heroShot?.prismEmphasis.rotationOffset[0] ?? 0),
        lockRotation[1] + pointerYaw + (heroShot?.prismEmphasis.rotationOffset[1] ?? 0),
        lockRotation[2] + (heroShot?.prismEmphasis.rotationOffset[2] ?? 0),
      );
    } else if (activePhase === "works") {
      targetPosition.set(0.28, -0.06 + floatY, -0.72);
      targetRotation.set(0.14 + pointerPitch, 0.12 + pointerYaw * 0.7, 0.0);
    } else if (activePhase === "about") {
      targetPosition.set(0.04, 0.02, -0.86);
      targetRotation.set(0.02, 0.0, 0.0);
    } else if (activePhase === "stella") {
      targetPosition.set(THREE.MathUtils.lerp(0.08, 0.86, stellaState.passageMix), 0.02, THREE.MathUtils.lerp(-0.82, -1.42, stellaState.passageMix));
      targetRotation.set(0.06, THREE.MathUtils.lerp(0.0, -1.08, stellaState.passageMix), 0.0);
    } else {
      targetPosition.set(0.1, 0.02, -1.4);
      targetRotation.set(0.0, -1.18, 0.0);
    }

    const targetScale =
      activePhase === "hero"
        ? lockScale * (heroShot?.prismEmphasis.scale ?? 1)
        : activePhase === "works"
          ? 0.74 + worksState.cardMix * 0.14
          : activePhase === "about"
            ? THREE.MathUtils.lerp(0.92, 1.12, aboutState.emblemMix)
            : activePhase === "stella"
              ? THREE.MathUtils.lerp(0.96, 0.54, stellaState.passageMix)
              : 0.2;

    const coreOpacityTarget =
      activePhase === "hero"
        ? 0.76
        : activePhase === "works"
          ? THREE.MathUtils.lerp(0.54, 0.18, worksState.cardMix)
          : activePhase === "about"
            ? THREE.MathUtils.lerp(0.18, 0.02, aboutState.emblemMix)
            : activePhase === "stella"
              ? THREE.MathUtils.lerp(0.08, 0.0, stellaState.passageMix)
              : 0;
    const shellOpacityTarget =
      activePhase === "hero"
        ? 0.24
        : activePhase === "works"
          ? 0.14
          : activePhase === "about"
            ? 0.02
            : 0;
    const edgeOpacityTarget =
      activePhase === "hero"
        ? 0.4
        : activePhase === "works"
          ? 0.3
          : activePhase === "about"
            ? THREE.MathUtils.lerp(0.36, 0.96, aboutState.emblemMix)
            : activePhase === "stella"
              ? THREE.MathUtils.lerp(0.62, 0.08, stellaState.passageMix)
              : 0.02;

    coreMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    coreMaterial.uniforms.uIntro.value = introProgress;
    coreMaterial.uniforms.uResolution.value.set(size.width, size.height);
    coreMaterial.uniforms.uWhiteMix.value = THREE.MathUtils.damp(
      coreMaterial.uniforms.uWhiteMix.value,
      activePhase === "about" ? aboutState.whiteSweep : 0,
      3.8,
      delta,
    );
    coreMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(
      coreMaterial.uniforms.uIntensity.value,
      activePhase === "hero" ? 1.18 : activePhase === "works" ? 1.02 : 0.82,
      4,
      delta,
    );
    coreMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(
      coreMaterial.uniforms.uOpacity.value,
      coreOpacityTarget * (1 - contactState.drainMix),
      4,
      delta,
    );

    shellMaterial.uniforms.uTime.value = state.clock.elapsedTime + 0.72;
    shellMaterial.uniforms.uIntro.value = introProgress * 0.96;
    shellMaterial.uniforms.uResolution.value.set(size.width, size.height);
    shellMaterial.uniforms.uWhiteMix.value = coreMaterial.uniforms.uWhiteMix.value;
    shellMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(
      shellMaterial.uniforms.uIntensity.value,
      activePhase === "hero" ? 0.68 : 0.42,
      4,
      delta,
    );
    shellMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(
      shellMaterial.uniforms.uOpacity.value,
      shellOpacityTarget * (1 - contactState.drainMix),
      4,
      delta,
    );

    haloMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    haloMaterial.uniforms.uIntro.value = introProgress;
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
      edgeRef.current.material.opacity = THREE.MathUtils.damp(
        edgeRef.current.material.opacity,
        edgeOpacityTarget * (1 - contactState.drainMix),
        4,
        delta,
      );
    }

    if (haloRef.current && prismRef.current) {
      haloRef.current.position.set(prismRef.current.position.x, prismRef.current.position.y, prismRef.current.position.z - 0.84);
      haloRef.current.rotation.z += delta * 0.03;
      const haloScale =
        activePhase === "hero" ? 1 : activePhase === "works" ? 0.84 : activePhase === "about" ? 0.54 : 0.2;
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

function WorksCardTrack({
  activePhase,
  phaseProgress,
  introProgress,
  reducedMotion,
}: {
  activePhase: AlchePhaseId;
  phaseProgress: number;
  introProgress: number;
  reducedMotion: boolean;
}) {
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
  const planeMaterials = useMemo(() => ALCHE_WORK_CARDS.map(() => createGalleryPlaneMaterial()), []);

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
    const worksState = deriveWorksPresentation(activePhase === "works" ? phaseProgress : activePhase === "about" ? 1 : 0);
    const aboutState = deriveAboutState(activePhase === "about" ? phaseProgress : 0);
    const visibleMix =
      activePhase === "works" ? worksState.cardMix : activePhase === "about" ? 1 - aboutState.flattenMix : 0;
    const travel = activePhase === "works" ? worksState.travel : ALCHE_WORK_CARDS.length + 1;

    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, activePhase === "works" ? 0.02 : 0.06, 2.8, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, activePhase === "works" ? 0 : -0.1, 2.8, delta);
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
      const visibilityTarget = Math.max(0, visibleMix * (1 - Math.max(Math.abs(relative) - 2.2, 0) * 0.8) * clamp01((introProgress - 0.7) / 0.3));

      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uVisibility.value = THREE.MathUtils.damp(material.uniforms.uVisibility.value, visibilityTarget, 4, delta);
      material.uniforms.uWhiteMix.value = THREE.MathUtils.damp(material.uniforms.uWhiteMix.value, activePhase === "about" ? aboutState.whiteSweep : 0, 4, delta);
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
      {ALCHE_WORK_CARDS.map((card, index) => (
        <group
          key={card.id}
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

function StellaArchitecture({
  activePhase,
  phaseProgress,
}: {
  activePhase: AlchePhaseId;
  phaseProgress: number;
}) {
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
    const stellaState = deriveStellaState(activePhase === "stella" ? phaseProgress : 0);
    const contactState = deriveContactState(activePhase === "contact" ? phaseProgress : 0);
    const visible = activePhase === "stella" ? stellaState.architectureMix : activePhase === "contact" ? 1 - contactState.drainMix : 0;

    if (!groupRef.current) return;

    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, -6.2, 3, delta);
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, visible * -0.24, 3, delta);
    material.opacity = THREE.MathUtils.damp(material.opacity, visible * 0.92, 4, delta);
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 0.1 + visible * 0.38, 4, delta);
    planeMaterial.opacity = THREE.MathUtils.damp(planeMaterial.opacity, visible * 0.24, 4, delta);
  });

  return (
    <group ref={groupRef}>
      {[-2.2, -0.72, 0.92, 2.36].map((x, index) => (
        <group key={`stella-frame-${x}`} position={[x, 0.2, -index * 0.7]}>
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

export function AlcheRoomScene(props: AlcheRoomSceneProps) {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const targetRef = useRef(new THREE.Vector3(...ALCHE_HERO_LOCK.camera.target));
  const positionRef = useRef(new THREE.Vector3(...ALCHE_HERO_LOCK.camera.position));
  const nextTargetRef = useRef(new THREE.Vector3());
  const nextPositionRef = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const worksState = deriveWorksPresentation(props.activePhase === "works" ? props.phaseProgress : props.activePhase === "about" ? 1 : 0);
    const aboutState = deriveAboutState(props.activePhase === "about" ? props.phaseProgress : 0);
    const stellaState = deriveStellaState(props.activePhase === "stella" ? props.phaseProgress : 0);
    const contactState = deriveContactState(props.activePhase === "contact" ? props.phaseProgress : 0);
    const phase = ALCHE_CAMERA_STATES[props.activePhase];

    let position = phase.position;
    let target = phase.target;
    let fov = phase.fov;

    if (props.activePhase === "stella") {
      position = [
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.about.position[0], ALCHE_CAMERA_STATES.stella.position[0], stellaState.passageMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.about.position[1], ALCHE_CAMERA_STATES.stella.position[1], stellaState.passageMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.about.position[2], ALCHE_CAMERA_STATES.stella.position[2], stellaState.passageMix),
      ];
      target = [
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.about.target[0], ALCHE_CAMERA_STATES.stella.target[0], stellaState.passageMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.about.target[1], ALCHE_CAMERA_STATES.stella.target[1], stellaState.passageMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.about.target[2], ALCHE_CAMERA_STATES.stella.target[2], stellaState.passageMix),
      ];
      fov = THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.about.fov, ALCHE_CAMERA_STATES.stella.fov, stellaState.passageMix);
    }

    if (props.activePhase === "works") {
      position = [
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.hero.position[0], ALCHE_CAMERA_STATES.works.position[0], worksState.cardMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.hero.position[1], ALCHE_CAMERA_STATES.works.position[1], worksState.cardMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.hero.position[2], ALCHE_CAMERA_STATES.works.position[2], worksState.cardMix),
      ];
      target = [
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.hero.target[0], ALCHE_CAMERA_STATES.works.target[0], worksState.cardMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.hero.target[1], ALCHE_CAMERA_STATES.works.target[1], worksState.cardMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.hero.target[2], ALCHE_CAMERA_STATES.works.target[2], worksState.cardMix),
      ];
      fov = THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.hero.fov, ALCHE_CAMERA_STATES.works.fov, worksState.cardMix);
    }

    if (props.activePhase === "about") {
      fov = THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.works.fov, ALCHE_CAMERA_STATES.about.fov, aboutState.flattenMix);
    }

    if (props.activePhase === "contact") {
      position = [
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.stella.position[0], ALCHE_CAMERA_STATES.contact.position[0], contactState.drainMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.stella.position[1], ALCHE_CAMERA_STATES.contact.position[1], contactState.drainMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.stella.position[2], ALCHE_CAMERA_STATES.contact.position[2], contactState.drainMix),
      ];
      target = [
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.stella.target[0], ALCHE_CAMERA_STATES.contact.target[0], contactState.drainMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.stella.target[1], ALCHE_CAMERA_STATES.contact.target[1], contactState.drainMix),
        THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.stella.target[2], ALCHE_CAMERA_STATES.contact.target[2], contactState.drainMix),
      ];
      fov = THREE.MathUtils.lerp(ALCHE_CAMERA_STATES.stella.fov, ALCHE_CAMERA_STATES.contact.fov, contactState.drainMix);
    }

    nextTargetRef.current.set(...target);
    nextPositionRef.current.set(...position);

    targetRef.current.lerp(nextTargetRef.current, 1 - Math.exp(-delta * 3.8));
    positionRef.current.lerp(nextPositionRef.current, 1 - Math.exp(-delta * 3.4));

    perspectiveCamera.position.copy(positionRef.current);
    perspectiveCamera.fov = THREE.MathUtils.damp(perspectiveCamera.fov, fov, 4, delta);
    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.lookAt(targetRef.current);
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#010204", 5.8, 20.6]} />
      <ambientLight intensity={0.08} color="#d9e4f6" />
      <spotLight
        position={[0, 5.4, 3]}
        angle={0.54}
        penumbra={0.92}
        intensity={32}
        decay={1.7}
        distance={18}
        color="#f2f5ff"
      />
      <pointLight position={[0, -1.2, 2.4]} intensity={1.6} color="#a7c9ff" distance={10} />

      <CurvedMediaWall activePhase={props.activePhase} phaseProgress={props.phaseProgress} introProgress={props.introProgress} />
      <FloatingAlcheWordmark
        activePhase={props.activePhase}
        phaseProgress={props.phaseProgress}
        introProgress={props.introProgress}
        reducedMotion={props.reducedMotion}
      />
      <CurvedWorkSweep activePhase={props.activePhase} phaseProgress={props.phaseProgress} />
      <WorksCardTrack
        activePhase={props.activePhase}
        phaseProgress={props.phaseProgress}
        introProgress={props.introProgress}
        reducedMotion={props.reducedMotion}
      />
      <StellaArchitecture activePhase={props.activePhase} phaseProgress={props.phaseProgress} />
      <HeroPrism
        activePhase={props.activePhase}
        heroShotId={props.heroShotId}
        phaseProgress={props.phaseProgress}
        introProgress={props.introProgress}
        reducedMotion={props.reducedMotion}
      />
      <AlchePostProcessing activePhase={props.activePhase} introProgress={props.introProgress} />
    </>
  );
}
