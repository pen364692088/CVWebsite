"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { AlchePostProcessing } from "@/components/alche-phase-one/alche-postprocessing";
import {
  createChamberPanelMaterial,
  createCurvedGridMaterial,
  createGalleryPlaneMaterial,
  createHaloMaterial,
  createPrismEdgeColor,
  createPrismMaterial,
} from "@/components/alche-phase-one/alche-room-materials";
import { ALCHE_HERO_LOCK, ALCHE_HERO_SHOTS, type AlcheHeroShotId } from "@/lib/alche-hero-lock";
import { ALCHE_CAMERA_STATES, ALCHE_ROOM, type AlchePhaseId } from "@/lib/alche-phase-one";

interface AlcheRoomSceneProps {
  activePhase: AlchePhaseId;
  heroShotId: AlcheHeroShotId | null;
  phaseProgress: number;
  introProgress: number;
  reducedMotion: boolean;
}

interface GalleryLayout {
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: number;
}

const GALLERY_LAYOUTS: readonly GalleryLayout[] = [
  { position: [-2.78, 0.92, -1.82], rotation: [-0.04, 0.54, -0.03], scale: 1.08 },
  { position: [2.46, 0.38, -2.28], rotation: [0.06, -0.56, 0.03], scale: 0.96 },
  { position: [-1.56, -0.92, -2.9], rotation: [0.08, 0.38, -0.04], scale: 0.88 },
  { position: [1.28, -0.24, -3.34], rotation: [-0.03, -0.3, 0.02], scale: 0.8 },
  { position: [0.18, 0.62, -4.06], rotation: [0.03, 0.18, 0], scale: 1.18 },
] as const;

const PANEL_LAYOUTS = Array.from({ length: ALCHE_ROOM.wallPanelCount }, (_, index) => {
  const columns = ALCHE_ROOM.wallPanelCount / 2;
  const row = index < columns ? 0 : 1;
  const column = index % columns;
  const spread = columns === 1 ? 0 : column / (columns - 1) - 0.5;
  return {
    angle: Math.PI + spread * 1.58,
    y: row === 0 ? 1.52 : -1.34,
    width: row === 0 ? 1.56 : 1.92,
    height: row === 0 ? 2.08 : 1.68,
    tilt: row === 0 ? -0.03 : 0.03,
    inset: row === 0 ? 0.48 : 0.42,
  };
});

const BRACE_LAYOUTS = Array.from({ length: ALCHE_ROOM.braceCount }, (_, index) => {
  const spread = index / (ALCHE_ROOM.braceCount - 1) - 0.5;
  return {
    angle: Math.PI + spread * 1.38,
    y: spread * 0.26,
    zRotation: spread < 0 ? -0.42 : 0.42,
  };
});

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

function CurvedRoom({
  activePhase,
  heroShotId,
  introProgress,
}: {
  activePhase: AlchePhaseId;
  heroShotId: AlcheHeroShotId | null;
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
    const phase = ALCHE_CAMERA_STATES[activePhase];
    const heroShot = activePhase === "hero" && heroShotId ? ALCHE_HERO_SHOTS[heroShotId] : null;
    if (!roomRef.current) return;

    roomRef.current.rotation.y = THREE.MathUtils.damp(roomRef.current.rotation.y, phase.hudBias * 0.06, 2.4, delta);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uIntro.value = introProgress;
    material.uniforms.uGlow.value = THREE.MathUtils.damp(
      material.uniforms.uGlow.value,
      heroShot?.chamberMassing.roomGlow ?? phase.roomGlow,
      3.8,
      delta,
    );
    material.uniforms.uExposure.value = THREE.MathUtils.damp(
      material.uniforms.uExposure.value,
      heroShot?.chamberMassing.roomExposure ?? phase.roomExposure,
      3.4,
      delta,
    );
    material.uniforms.uWhiteMix.value = THREE.MathUtils.damp(
      material.uniforms.uWhiteMix.value,
      phase.whiteMix,
      3.8,
      delta,
    );
  });

  return (
    <mesh ref={roomRef} geometry={geometry}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function ChamberArchitecture({
  activePhase,
  heroShotId,
  introProgress,
}: {
  activePhase: AlchePhaseId;
  heroShotId: AlcheHeroShotId | null;
  introProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const portalRef = useRef<THREE.Group>(null);
  const panelMaterial = useMemo(() => createChamberPanelMaterial(), []);
  const trimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0d1016",
        emissive: "#202939",
        emissiveIntensity: 0.1,
        metalness: 0.82,
        roughness: 0.72,
        transparent: true,
        opacity: 0.94,
      }),
    [],
  );
  const panelAccentMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#d8e3f2",
        transparent: true,
        opacity: 0.16,
      }),
    [],
  );
  const braceMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#dfe7f4",
        transparent: true,
        opacity: 0.18,
      }),
    [],
  );
  const wireMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#dfe7f5",
        transparent: true,
        opacity: 0.22,
      }),
    [],
  );
  const panelGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 0.12), []);
  const insetGeometry = useMemo(() => new THREE.BoxGeometry(1, 1, 0.04), []);
  const ribGeometry = useMemo(() => new THREE.BoxGeometry(0.035, 1, 0.04), []);
  const capGeometry = useMemo(() => new THREE.BoxGeometry(1, 0.028, 0.03), []);
  const braceGeometry = useMemo(() => new THREE.BoxGeometry(0.05, 4.3, 0.05), []);
  const panelEdges = useMemo(() => new THREE.EdgesGeometry(panelGeometry, 18), [panelGeometry]);
  const portalGeometry = useMemo(() => new THREE.BoxGeometry(4.4, 3.4, 0.16), []);
  const portalInsetGeometry = useMemo(() => new THREE.BoxGeometry(3.2, 2.32, 0.06), []);
  const finGeometry = useMemo(() => new THREE.BoxGeometry(0.18, 3.76, 0.22), []);
  const centralBraceGeometry = useMemo(() => new THREE.BoxGeometry(0.075, 5.8, 0.075), []);
  const portalEdges = useMemo(() => new THREE.EdgesGeometry(portalGeometry, 18), [portalGeometry]);

  useEffect(() => {
    return () => {
      panelGeometry.dispose();
      insetGeometry.dispose();
      ribGeometry.dispose();
      capGeometry.dispose();
      braceGeometry.dispose();
      panelEdges.dispose();
      portalGeometry.dispose();
      portalInsetGeometry.dispose();
      finGeometry.dispose();
      centralBraceGeometry.dispose();
      portalEdges.dispose();
      panelMaterial.dispose();
      trimMaterial.dispose();
      panelAccentMaterial.dispose();
      braceMaterial.dispose();
      wireMaterial.dispose();
    };
  }, [
    braceGeometry,
    braceMaterial,
    capGeometry,
    centralBraceGeometry,
    finGeometry,
    insetGeometry,
    panelAccentMaterial,
    panelEdges,
    panelGeometry,
    panelMaterial,
    portalEdges,
    portalGeometry,
    portalInsetGeometry,
    ribGeometry,
    trimMaterial,
    wireMaterial,
  ]);

  useFrame((_, delta) => {
    const phase = ALCHE_CAMERA_STATES[activePhase];
    const heroShot = activePhase === "hero" && heroShotId ? ALCHE_HERO_SHOTS[heroShotId] : null;
    if (!groupRef.current) return;

    const presence = introProgress < 0.8 ? introProgress / 0.8 : 1;
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      activePhase === "works" ? -0.18 : activePhase === "vision" ? -0.42 : 0,
      2.8,
      delta,
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, phase.hudBias * -0.08, 2.8, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      activePhase === "works" ? 0.02 : 0,
      2.6,
      delta,
    );

    const panelBias = heroShot?.chamberMassing.panelBias ?? 1;
    const braceBias = heroShot?.chamberMassing.braceBias ?? 1;
    const rearWallBias = heroShot?.chamberMassing.rearWallEmphasis ?? 1;

    panelMaterial.emissiveIntensity = THREE.MathUtils.damp(
      panelMaterial.emissiveIntensity,
      (activePhase === "works" ? 0.12 : 0.08) * presence * panelBias,
      3.4,
      delta,
    );
    panelMaterial.opacity = THREE.MathUtils.damp(
      panelMaterial.opacity,
      Math.min(0.96, 0.92 * presence * panelBias),
      3.2,
      delta,
    );
    trimMaterial.emissiveIntensity = THREE.MathUtils.damp(
      trimMaterial.emissiveIntensity,
      (activePhase === "works" ? 0.16 : activePhase === "vision" ? 0.08 : 0.11) * rearWallBias,
      3.2,
      delta,
    );
    panelAccentMaterial.opacity = THREE.MathUtils.damp(
      panelAccentMaterial.opacity,
      (activePhase === "works" ? 0.22 : 0.13) * presence * panelBias,
      3.4,
      delta,
    );
    braceMaterial.opacity = THREE.MathUtils.damp(
      braceMaterial.opacity,
      (activePhase === "works" ? 0.22 : 0.16) * presence * braceBias,
      3.4,
      delta,
    );
    wireMaterial.opacity = THREE.MathUtils.damp(
      wireMaterial.opacity,
      (activePhase === "works" ? 0.28 : 0.18) * presence * Math.max(panelBias, rearWallBias * 0.92),
      3.2,
      delta,
    );

    if (portalRef.current) {
      portalRef.current.position.z = THREE.MathUtils.damp(
        portalRef.current.position.z,
        -4.28 + (rearWallBias - 1) * -0.24,
        3,
        delta,
      );
      const nextScale = THREE.MathUtils.damp(portalRef.current.scale.x, 1 + (rearWallBias - 1) * 0.12, 3, delta);
      portalRef.current.scale.setScalar(nextScale);
    }
  });

  return (
    <group ref={groupRef}>
      {PANEL_LAYOUTS.map((panel, index) => {
        const radius = ALCHE_ROOM.radius - panel.inset;
        const x = Math.sin(panel.angle) * radius;
        const z = Math.cos(panel.angle) * radius;

        return (
          <group key={`panel-${index}`} position={[x, panel.y, z]} rotation={[0, panel.angle, panel.tilt]}>
            <mesh geometry={panelGeometry} scale={[panel.width, panel.height, 1]}>
              <primitive object={panelMaterial} attach="material" />
            </mesh>
            <mesh geometry={insetGeometry} position={[0, 0, 0.06]} scale={[panel.width * 0.84, panel.height * 0.78, 1]}>
              <primitive object={trimMaterial} attach="material" />
            </mesh>
            <mesh geometry={ribGeometry} position={[-panel.width * 0.38, 0, 0.07]} scale={[1, panel.height * 0.86, 1]}>
              <primitive object={panelAccentMaterial} attach="material" />
            </mesh>
            <mesh geometry={ribGeometry} position={[panel.width * 0.38, 0, 0.07]} scale={[1, panel.height * 0.86, 1]}>
              <primitive object={panelAccentMaterial} attach="material" />
            </mesh>
            <mesh geometry={capGeometry} position={[0, panel.height * 0.32, 0.075]} scale={[panel.width * 0.66, 1, 1]}>
              <primitive object={panelAccentMaterial} attach="material" />
            </mesh>
            <mesh geometry={capGeometry} position={[0, -panel.height * 0.32, 0.075]} scale={[panel.width * 0.72, 1, 1]}>
              <primitive object={panelAccentMaterial} attach="material" />
            </mesh>
            <lineSegments geometry={panelEdges} scale={[panel.width, panel.height, 1]}>
              <primitive object={wireMaterial} attach="material" />
            </lineSegments>
          </group>
        );
      })}

      {BRACE_LAYOUTS.map((brace, index) => {
        const radius = ALCHE_ROOM.radius - 0.32;
        const x = Math.sin(brace.angle) * radius;
        const z = Math.cos(brace.angle) * radius;

        return (
          <mesh
            key={`brace-${index}`}
            geometry={braceGeometry}
            position={[x, brace.y, z]}
            rotation={[0, brace.angle, brace.zRotation]}
          >
            <primitive object={braceMaterial} attach="material" />
          </mesh>
        );
      })}

      <group ref={portalRef} position={[0, 0.18, -4.28]}>
        <mesh geometry={portalGeometry}>
          <primitive object={panelMaterial} attach="material" />
        </mesh>
        <mesh geometry={portalInsetGeometry} position={[0, 0.08, 0.08]}>
          <primitive object={trimMaterial} attach="material" />
        </mesh>
        <lineSegments geometry={portalEdges}>
          <primitive object={wireMaterial} attach="material" />
        </lineSegments>
        <mesh geometry={finGeometry} position={[-2.26, 0.06, 0.16]}>
          <primitive object={braceMaterial} attach="material" />
        </mesh>
        <mesh geometry={finGeometry} position={[2.26, 0.06, 0.16]}>
          <primitive object={braceMaterial} attach="material" />
        </mesh>
      </group>

      <group position={[0, 0.18, -2.54]}>
        <mesh geometry={centralBraceGeometry} position={[-1.54, 0.48, 0]} rotation={[0, 0, -0.42]}>
          <primitive object={braceMaterial} attach="material" />
        </mesh>
        <mesh geometry={centralBraceGeometry} position={[1.54, 0.48, 0]} rotation={[0, 0, 0.42]}>
          <primitive object={braceMaterial} attach="material" />
        </mesh>
        <mesh geometry={centralBraceGeometry} position={[-2.18, 0.48, -0.24]} rotation={[0, 0, -0.42]}>
          <primitive object={braceMaterial} attach="material" />
        </mesh>
        <mesh geometry={centralBraceGeometry} position={[2.18, 0.48, -0.24]} rotation={[0, 0, 0.42]}>
          <primitive object={braceMaterial} attach="material" />
        </mesh>
      </group>
    </group>
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
  const guideRef = useRef<THREE.Group>(null);

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
  const bracketGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  useMemo(() => {
    const points = new Float32Array([
      -2.5, 1.86, 0, -1.62, 1.86, 0, -2.5, 1.86, 0, -2.5, 1.02, 0,
      2.5, 1.86, 0, 1.62, 1.86, 0, 2.5, 1.86, 0, 2.5, 1.02, 0,
      -2.5, -1.88, 0, -1.62, -1.88, 0, -2.5, -1.88, 0, -2.5, -1.04, 0,
      2.5, -1.88, 0, 1.62, -1.88, 0, 2.5, -1.88, 0, 2.5, -1.04, 0,
      -2.2, 0.0, 0, -1.48, 0.0, 0,
      2.2, 0.0, 0, 1.48, 0.0, 0,
    ]);
    bracketGeometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
  }, [bracketGeometry]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      edgesGeometry.dispose();
      haloGeometry.dispose();
      bracketGeometry.dispose();
      coreMaterial.dispose();
      shellMaterial.dispose();
      haloMaterial.dispose();
    };
  }, [bracketGeometry, coreMaterial, edgesGeometry, geometry, haloGeometry, haloMaterial, shellMaterial]);

  useFrame((state, delta) => {
    const phase = ALCHE_CAMERA_STATES[activePhase];
    const heroShot = activePhase === "hero" && heroShotId ? ALCHE_HERO_SHOTS[heroShotId] : null;
    const freezeHeroShot = Boolean(heroShot);
    const floatY = reducedMotion || freezeHeroShot ? 0 : Math.sin(state.clock.elapsedTime * 0.62) * 0.05;
    const phaseRoll = reducedMotion || freezeHeroShot ? 0 : Math.sin(state.clock.elapsedTime * 0.18) * 0.024;
    const lockPosition = ALCHE_HERO_LOCK.prism.position;
    const lockRotation = ALCHE_HERO_LOCK.prism.rotation;
    const lockScale = ALCHE_HERO_LOCK.prism.scale;
    const targetPosition =
      activePhase === "hero"
        ? new THREE.Vector3(
            lockPosition[0] + (heroShot?.prismEmphasis.positionOffset[0] ?? 0),
            lockPosition[1] + floatY + (heroShot?.prismEmphasis.positionOffset[1] ?? 0),
            lockPosition[2] + (heroShot?.prismEmphasis.positionOffset[2] ?? 0),
          )
        : new THREE.Vector3(0, floatY, activePhase === "works" ? 0.06 : activePhase === "vision" ? -0.06 : 0);
    const targetRotation =
      activePhase === "hero"
        ? new THREE.Euler(
            lockRotation[0] + phaseRoll + (heroShot?.prismEmphasis.rotationOffset[0] ?? 0),
            lockRotation[1] + (heroShot?.prismEmphasis.rotationOffset[1] ?? 0),
            lockRotation[2] + (heroShot?.prismEmphasis.rotationOffset[2] ?? 0),
          )
        : new THREE.Euler(
            0.22 + phaseRoll,
            prismRef.current?.rotation.y ?? 0,
            activePhase === "vision" ? 0.08 : activePhase === "service" ? -0.04 : 0,
          );
    const targetScale =
      activePhase === "hero"
        ? lockScale * (heroShot?.prismEmphasis.scale ?? 1) * (1 - phaseProgress * 0.012)
        : phase.prismScale * 0.84 * (1 - phaseProgress * 0.018);

    coreMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    coreMaterial.uniforms.uIntro.value = introProgress;
    coreMaterial.uniforms.uResolution.value.set(size.width, size.height);
    coreMaterial.uniforms.uWhiteMix.value = THREE.MathUtils.damp(
      coreMaterial.uniforms.uWhiteMix.value,
      phase.whiteMix,
      3.8,
      delta,
    );
    coreMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(
      coreMaterial.uniforms.uIntensity.value,
      activePhase === "hero" ? 1.22 : activePhase === "works" ? 1.08 : 0.94,
      4,
      delta,
    );

    shellMaterial.uniforms.uTime.value = state.clock.elapsedTime + 0.72;
    shellMaterial.uniforms.uIntro.value = introProgress * 0.96;
    shellMaterial.uniforms.uResolution.value.set(size.width, size.height);
    shellMaterial.uniforms.uWhiteMix.value = coreMaterial.uniforms.uWhiteMix.value;
    shellMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(
      shellMaterial.uniforms.uIntensity.value,
      activePhase === "hero" ? 0.66 : activePhase === "works" ? 0.54 : 0.46,
      4,
      delta,
    );

    haloMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    haloMaterial.uniforms.uIntro.value = introProgress;
    haloMaterial.uniforms.uWhiteMix.value = THREE.MathUtils.damp(
      haloMaterial.uniforms.uWhiteMix.value,
      phase.whiteMix,
      3.8,
      delta,
    );

    if (prismRef.current) {
      prismRef.current.position.x = THREE.MathUtils.damp(prismRef.current.position.x, targetPosition.x, 4, delta);
      prismRef.current.position.y = THREE.MathUtils.damp(prismRef.current.position.y, targetPosition.y, 4, delta);
      prismRef.current.position.z = THREE.MathUtils.damp(prismRef.current.position.z, targetPosition.z, 3.8, delta);
      prismRef.current.rotation.x = THREE.MathUtils.damp(prismRef.current.rotation.x, targetRotation.x, 4, delta);
      prismRef.current.rotation.y = freezeHeroShot
        ? THREE.MathUtils.damp(prismRef.current.rotation.y, targetRotation.y, 4, delta)
        : prismRef.current.rotation.y + delta * (reducedMotion ? 0.06 : activePhase === "works" ? 0.11 : 0.084);
      prismRef.current.rotation.z = THREE.MathUtils.damp(prismRef.current.rotation.z, targetRotation.z, 3, delta);
      prismRef.current.scale.setScalar(THREE.MathUtils.damp(prismRef.current.scale.x, targetScale, 4.2, delta));
    }

    if (shellRef.current && prismRef.current) {
      shellRef.current.position.copy(prismRef.current.position);
      shellRef.current.rotation.copy(prismRef.current.rotation);
      shellRef.current.rotation.y *= -0.82;
      shellRef.current.rotation.z += delta * 0.022;
      shellRef.current.scale.setScalar(prismRef.current.scale.x * 1.038);
    }

    if (edgeRef.current && prismRef.current) {
      edgeRef.current.position.copy(prismRef.current.position);
      edgeRef.current.rotation.copy(prismRef.current.rotation);
      edgeRef.current.scale.setScalar(prismRef.current.scale.x * 1.003);
      edgeRef.current.material.color.copy(createPrismEdgeColor(state.clock.elapsedTime * 0.06, phase.whiteMix));
        edgeRef.current.material.opacity = THREE.MathUtils.damp(
        edgeRef.current.material.opacity,
        activePhase === "outro" ? 0.18 : activePhase === "works" ? 0.54 : 0.42,
        4,
        delta,
      );
    }

    if (haloRef.current) {
      haloRef.current.rotation.z = freezeHeroShot
        ? THREE.MathUtils.damp(haloRef.current.rotation.z, 0.12, 3, delta)
        : haloRef.current.rotation.z + delta * 0.045;
      haloRef.current.position.z = -0.74;
      haloRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.26) * 0.03);
    }

    if (guideRef.current) {
      guideRef.current.rotation.z = THREE.MathUtils.damp(
        guideRef.current.rotation.z,
        activePhase === "works" ? 0.05 : activePhase === "service" ? -0.03 : 0,
        3.4,
        delta,
      );
      guideRef.current.scale.setScalar(
        THREE.MathUtils.damp(guideRef.current.scale.x, activePhase === "hero" ? 1 : 0.94, 4, delta),
      );
      guideRef.current.position.y = prismRef.current?.position.y ?? 0;
      guideRef.current.position.z = -0.2;
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

      <group ref={guideRef}>
        <lineSegments geometry={bracketGeometry}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.16} />
        </lineSegments>
      </group>
    </>
  );
}

function WorksGalleryStub({
  activePhase,
  introProgress,
  reducedMotion,
}: {
  activePhase: AlchePhaseId;
  introProgress: number;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cardRefs = useRef<Array<THREE.Group | null>>([]);
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(2.56, 1.58, 1, 1), []);
  const backingGeometry = useMemo(() => new THREE.BoxGeometry(2.68, 1.7, 0.08), []);
  const planeEdges = useMemo(() => new THREE.EdgesGeometry(planeGeometry), [planeGeometry]);
  const frameMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#e1e8f5",
        transparent: true,
        opacity: 0.18,
      }),
    [],
  );
  const backingMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#06080d",
        transparent: true,
        opacity: 0.16,
      }),
    [],
  );
  const planeMaterials = useMemo(
    () => GALLERY_LAYOUTS.map(() => createGalleryPlaneMaterial()),
    [],
  );

  useEffect(() => {
    return () => {
      planeGeometry.dispose();
      backingGeometry.dispose();
      planeEdges.dispose();
      frameMaterial.dispose();
      backingMaterial.dispose();
      planeMaterials.forEach((material) => material.dispose());
    };
  }, [backingGeometry, backingMaterial, frameMaterial, planeEdges, planeGeometry, planeMaterials]);

  useFrame((state, delta) => {
    const phase = ALCHE_CAMERA_STATES[activePhase];
    const galleryMix = activePhase === "works" ? 1 : activePhase === "service" ? 0.56 : activePhase === "vision" ? 0.18 : 0;
    const introGate = introProgress < 0.92 ? 0 : (introProgress - 0.92) / 0.08;

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, phase.hudBias * 0.38, 2.6, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, activePhase === "works" ? -0.02 : 0, 2.6, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, -phase.galleryDepth * 0.18, 2.8, delta);
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        activePhase === "works" ? -0.04 : 0,
        2.4,
        delta,
      );
    }

    planeMaterials.forEach((material, index) => {
      const node = cardRefs.current[index];
      if (!node) return;

      const layout = GALLERY_LAYOUTS[index];
      const drift = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.32 + index * 0.9) * 0.05;
      const depthPush = phase.galleryDepth * (0.36 + index * 0.18);
      const visibilityTarget = Math.min(1, galleryMix * (0.74 + index * 0.06) * introGate);

      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uWhiteMix.value = THREE.MathUtils.damp(
        material.uniforms.uWhiteMix.value,
        phase.whiteMix,
        3.4,
        delta,
      );
      material.uniforms.uVisibility.value = THREE.MathUtils.damp(
        material.uniforms.uVisibility.value,
        visibilityTarget,
        3.8,
        delta,
      );
      material.uniforms.uIndex.value = index;

      node.position.x = THREE.MathUtils.damp(node.position.x, layout.position[0], 3, delta);
      node.position.y = THREE.MathUtils.damp(node.position.y, layout.position[1] + drift, 3, delta);
      node.position.z = THREE.MathUtils.damp(node.position.z, layout.position[2] - depthPush, 3, delta);
      node.rotation.x = THREE.MathUtils.damp(node.rotation.x, layout.rotation[0], 3, delta);
      node.rotation.y = THREE.MathUtils.damp(
        node.rotation.y,
        layout.rotation[1] - phase.galleryDepth * 0.08,
        3,
        delta,
      );
      node.rotation.z = THREE.MathUtils.damp(node.rotation.z, layout.rotation[2], 3, delta);
      const nextScale = THREE.MathUtils.damp(node.scale.x, layout.scale * (0.88 + galleryMix * 0.12), 3.2, delta);
      node.scale.setScalar(nextScale);
    });

    frameMaterial.opacity = THREE.MathUtils.damp(
      frameMaterial.opacity,
      activePhase === "works" ? 0.52 : activePhase === "service" ? 0.24 : 0.08,
      3.6,
      delta,
    );
    backingMaterial.opacity = THREE.MathUtils.damp(
      backingMaterial.opacity,
      activePhase === "works" ? 0.34 : activePhase === "service" ? 0.16 : 0.04,
      3.6,
      delta,
    );
  });

  return (
    <group ref={groupRef}>
      {GALLERY_LAYOUTS.map((layout, index) => (
        <group
          key={`gallery-${index}`}
          ref={(node) => {
            cardRefs.current[index] = node;
          }}
          position={layout.position}
          rotation={layout.rotation}
          scale={layout.scale}
        >
          <mesh geometry={backingGeometry} position={[0, 0, -0.08]}>
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

export function AlcheRoomScene(props: AlcheRoomSceneProps) {
  const { camera } = useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const targetRef = useRef(new THREE.Vector3(...ALCHE_HERO_LOCK.camera.target));
  const positionRef = useRef(new THREE.Vector3(...ALCHE_HERO_LOCK.camera.position));
  const nextTargetRef = useRef(new THREE.Vector3());
  const nextPositionRef = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const phase = ALCHE_CAMERA_STATES[props.activePhase];
    const targetFov = props.activePhase === "hero" ? ALCHE_HERO_LOCK.camera.fov : 33.5;

    nextTargetRef.current.set(...phase.target);
    nextPositionRef.current.set(...phase.position);

    targetRef.current.lerp(nextTargetRef.current, 1 - Math.exp(-delta * 3.8));
    positionRef.current.lerp(nextPositionRef.current, 1 - Math.exp(-delta * 3.4));

    perspectiveCamera.position.copy(positionRef.current);
    perspectiveCamera.fov = THREE.MathUtils.damp(perspectiveCamera.fov, targetFov, 4, delta);
    perspectiveCamera.updateProjectionMatrix();
    perspectiveCamera.lookAt(targetRef.current);
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#020305", 6.6, 18.6]} />
      <ambientLight intensity={0.14} color="#d9e4f6" />
      <spotLight
        position={[0, 4.8, 3.2]}
        angle={0.48}
        penumbra={0.9}
        intensity={42}
        decay={1.7}
        distance={18}
        color="#eef2ff"
      />
      <spotLight
        position={[-4.2, 1.2, 0.8]}
        angle={0.42}
        penumbra={1}
        intensity={16}
        decay={1.9}
        distance={14}
        color="#88beff"
      />
      <spotLight
        position={[4.6, 1.6, -0.8]}
        angle={0.36}
        penumbra={1}
        intensity={11}
        decay={1.9}
        distance={13}
        color="#ffd8f0"
      />
      <pointLight position={[0, -2.2, -2.6]} intensity={2.2} color="#8cb2ff" distance={9} />

      <CurvedRoom activePhase={props.activePhase} heroShotId={props.heroShotId} introProgress={props.introProgress} />
      <ChamberArchitecture
        activePhase={props.activePhase}
        heroShotId={props.heroShotId}
        introProgress={props.introProgress}
      />
      <WorksGalleryStub
        activePhase={props.activePhase}
        introProgress={props.introProgress}
        reducedMotion={props.reducedMotion}
      />
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
