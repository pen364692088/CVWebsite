"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { ALCHE_CAMERA_STATES, ALCHE_ROOM, type AlchePhaseId } from "@/lib/alche-phase-one";
import {
  createCurvedGridMaterial,
  createHaloMaterial,
  createPrismEdgeColor,
  createPrismMaterial,
} from "@/components/alche-phase-one/alche-room-materials";

interface AlcheRoomSceneProps {
  activePhase: AlchePhaseId;
  phaseProgress: number;
  introProgress: number;
  reducedMotion: boolean;
}

function createPrismAShape(scale: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, scale * 1.22);
  shape.lineTo(-scale * 0.9, -scale * 1.16);
  shape.lineTo(-scale * 0.48, -scale * 1.16);
  shape.lineTo(-scale * 0.18, -scale * 0.36);
  shape.lineTo(scale * 0.18, -scale * 0.36);
  shape.lineTo(scale * 0.48, -scale * 1.16);
  shape.lineTo(scale * 0.9, -scale * 1.16);
  shape.closePath();

  const aperture = new THREE.Path();
  aperture.moveTo(0, scale * 0.56);
  aperture.lineTo(-scale * 0.3, -scale * 0.24);
  aperture.lineTo(scale * 0.3, -scale * 0.24);
  aperture.closePath();
  shape.holes.push(aperture);

  const crossbar = new THREE.Path();
  crossbar.moveTo(-scale * 0.24, -scale * 0.02);
  crossbar.lineTo(scale * 0.24, -scale * 0.02);
  crossbar.lineTo(scale * 0.16, scale * 0.1);
  crossbar.lineTo(-scale * 0.16, scale * 0.1);
  crossbar.closePath();
  shape.holes.push(crossbar);

  return shape;
}

function CurvedRoom({
  activePhase,
  introProgress,
}: {
  activePhase: AlchePhaseId;
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
    if (!roomRef.current) return;

    roomRef.current.rotation.y += delta * 0.018;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uIntro.value = introProgress;
    material.uniforms.uGlow.value = THREE.MathUtils.damp(material.uniforms.uGlow.value, phase.roomGlow, 3.8, delta);
    material.uniforms.uExposure.value = THREE.MathUtils.damp(
      material.uniforms.uExposure.value,
      phase.roomExposure,
      3.6,
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

function HeroPrism({
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
  const { size } = useThree();
  const prismRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.ShaderMaterial>>(null);
  const shellRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.ShaderMaterial>>(null);
  const haloRef = useRef<THREE.Mesh<THREE.RingGeometry, THREE.ShaderMaterial>>(null);
  const edgeRef = useRef<THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>>(null);
  const guideRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const created = new THREE.ExtrudeGeometry(createPrismAShape(1.15), {
      depth: 0.56,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.065,
      bevelThickness: 0.08,
      curveSegments: 20,
    });
    created.center();
    return created;
  }, []);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry, 16), [geometry]);
  const haloGeometry = useMemo(() => new THREE.RingGeometry(1.55, 2.7, 160), []);
  const coreMaterial = useMemo(() => createPrismMaterial("core"), []);
  const shellMaterial = useMemo(() => createPrismMaterial("shell"), []);
  const haloMaterial = useMemo(() => createHaloMaterial(), []);
  const bracketGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  useMemo(() => {
    const points = new Float32Array([
      -2.4, 1.7, 0, -1.68, 1.7, 0, -2.4, 1.7, 0, -2.4, 0.98, 0,
      2.4, 1.7, 0, 1.68, 1.7, 0, 2.4, 1.7, 0, 2.4, 0.98, 0,
      -2.4, -1.7, 0, -1.68, -1.7, 0, -2.4, -1.7, 0, -2.4, -0.98, 0,
      2.4, -1.7, 0, 1.68, -1.7, 0, 2.4, -1.7, 0, 2.4, -0.98, 0,
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
    const floatY = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.84) * 0.08;
    const phaseRoll = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.03;
    const targetScale = phase.prismScale * (1 - phaseProgress * 0.024);

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
      activePhase === "hero" ? 1.15 : activePhase === "works" ? 1.02 : 0.9,
      4,
      delta,
    );

    shellMaterial.uniforms.uTime.value = state.clock.elapsedTime + 0.85;
    shellMaterial.uniforms.uIntro.value = introProgress * 0.96;
    shellMaterial.uniforms.uResolution.value.set(size.width, size.height);
    shellMaterial.uniforms.uWhiteMix.value = coreMaterial.uniforms.uWhiteMix.value;
    shellMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(
      shellMaterial.uniforms.uIntensity.value,
      activePhase === "hero" ? 0.58 : 0.48,
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
      prismRef.current.position.y = THREE.MathUtils.damp(prismRef.current.position.y, floatY, 4.4, delta);
      prismRef.current.rotation.x = THREE.MathUtils.damp(prismRef.current.rotation.x, 0.16 + phaseRoll, 4.2, delta);
      prismRef.current.rotation.y += delta * (reducedMotion ? 0.08 : activePhase === "works" ? 0.2 : 0.15);
      prismRef.current.rotation.z = THREE.MathUtils.damp(
        prismRef.current.rotation.z,
        activePhase === "vision" ? 0.08 : 0,
        3.2,
        delta,
      );
      prismRef.current.scale.setScalar(THREE.MathUtils.damp(prismRef.current.scale.x, targetScale, 4.6, delta));
    }

    if (shellRef.current && prismRef.current) {
      shellRef.current.position.copy(prismRef.current.position);
      shellRef.current.rotation.copy(prismRef.current.rotation);
      shellRef.current.rotation.y *= -0.76;
      shellRef.current.rotation.z += delta * 0.032;
      shellRef.current.scale.setScalar(prismRef.current.scale.x * 1.035);
    }

    if (edgeRef.current && prismRef.current) {
      edgeRef.current.position.copy(prismRef.current.position);
      edgeRef.current.rotation.copy(prismRef.current.rotation);
      edgeRef.current.scale.setScalar(prismRef.current.scale.x * 1.002);
      edgeRef.current.material.color.copy(createPrismEdgeColor(state.clock.elapsedTime * 0.08, phase.whiteMix));
      edgeRef.current.material.opacity = THREE.MathUtils.damp(
        edgeRef.current.material.opacity,
        activePhase === "outro" ? 0.28 : 0.68,
        4.2,
        delta,
      );
    }

    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.075;
      haloRef.current.position.z = -0.68;
      haloRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.34) * 0.045);
    }

    if (guideRef.current) {
      guideRef.current.rotation.z = THREE.MathUtils.damp(
        guideRef.current.rotation.z,
        activePhase === "works" ? 0.07 : activePhase === "service" ? -0.04 : 0,
        3.4,
        delta,
      );
      guideRef.current.scale.setScalar(
        THREE.MathUtils.damp(guideRef.current.scale.x, activePhase === "hero" ? 1 : 0.92, 4.2, delta),
      );
      guideRef.current.position.y = prismRef.current?.position.y ?? 0;
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
          <lineBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </lineSegments>
      </group>
    </>
  );
}

function TechnicalPlanes({
  activePhase,
  introProgress,
}: {
  activePhase: AlchePhaseId;
  introProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const planeGeometry = useMemo(() => new THREE.PlaneGeometry(2.24, 1.38, 1, 1), []);
  const planeEdges = useMemo(() => new THREE.EdgesGeometry(planeGeometry), [planeGeometry]);
  const planeMaterials = useMemo(
    () =>
      Array.from({ length: ALCHE_ROOM.technicalPlaneCount }, (_, index) => {
        return new THREE.MeshBasicMaterial({
          color: index % 2 === 0 ? "#d9e2f0" : "#cfd9e8",
          transparent: true,
          opacity: 0.08,
        });
      }),
    [],
  );

  useEffect(() => {
    return () => {
      planeGeometry.dispose();
      planeEdges.dispose();
      planeMaterials.forEach((material) => material.dispose());
    };
  }, [planeEdges, planeGeometry, planeMaterials]);

  useFrame((state, delta) => {
    const phase = ALCHE_CAMERA_STATES[activePhase];
    if (!groupRef.current) return;

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, phase.hudBias, 2.8, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, -0.3, 2.8, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, -0.05, 2.4, delta);

    groupRef.current.children.forEach((child, index) => {
      const group = child as THREE.Group;
      const direction = index % 2 === 0 ? 1 : -1;
      const plane = group.children[0] as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
      const lines = group.children[1] as THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>;
      const phaseVisible = activePhase !== "hero" || introProgress > 0.92;
      const wobble = Math.sin(state.clock.elapsedTime * 0.3 + index * 0.8) * 0.04;

      group.visible = phaseVisible;
      group.position.x = direction * (3.0 + phase.planeSpread * 1.25 + index * 0.28);
      group.position.y = 0.92 - index * 0.92 + wobble;
      group.position.z = -0.95 - index * 0.36;
      group.rotation.y = direction * (0.28 - phase.planeSpread * 0.14);
      group.rotation.x = -0.05 + index * 0.02;
      group.scale.setScalar(activePhase === "works" ? 1 : activePhase === "service" ? 0.95 : 0.74);

      plane.material.opacity = THREE.MathUtils.damp(
        plane.material.opacity,
        activePhase === "works" ? 0.18 : activePhase === "service" ? 0.12 : 0.045,
        4,
        delta,
      );
      lines.material.opacity = THREE.MathUtils.damp(
        lines.material.opacity,
        activePhase === "works" ? 0.64 : activePhase === "service" ? 0.46 : 0.14,
        4,
        delta,
      );
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: ALCHE_ROOM.technicalPlaneCount }).map((_, index) => (
        <group key={index}>
          <mesh geometry={planeGeometry} material={planeMaterials[index]} />
          <lineSegments geometry={planeEdges}>
            <lineBasicMaterial color="#dfe8f4" transparent opacity={0.34} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
}

export function AlcheRoomScene(props: AlcheRoomSceneProps) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(...ALCHE_CAMERA_STATES.hero.target));
  const positionRef = useRef(new THREE.Vector3(...ALCHE_CAMERA_STATES.hero.position));
  const nextTargetRef = useRef(new THREE.Vector3());
  const nextPositionRef = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const phase = ALCHE_CAMERA_STATES[props.activePhase];

    nextTargetRef.current.set(...phase.target);
    nextPositionRef.current.set(...phase.position);

    targetRef.current.lerp(nextTargetRef.current, 1 - Math.exp(-delta * 3.8));
    positionRef.current.lerp(nextPositionRef.current, 1 - Math.exp(-delta * 3.4));

    camera.position.copy(positionRef.current);
    camera.lookAt(targetRef.current);
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 7.4, 18]} />
      <ambientLight intensity={0.22} color="#e6edf8" />
      <pointLight position={[0, 2.2, 4.5]} intensity={5.1} color="#eef3ff" />
      <pointLight position={[-3.5, -1.4, 1.5]} intensity={3.1} color="#7eb7ff" />
      <pointLight position={[3.3, 0.7, -0.9]} intensity={2.9} color="#ffd2ee" />

      <CurvedRoom activePhase={props.activePhase} introProgress={props.introProgress} />
      <TechnicalPlanes activePhase={props.activePhase} introProgress={props.introProgress} />
      <HeroPrism
        activePhase={props.activePhase}
        phaseProgress={props.phaseProgress}
        introProgress={props.introProgress}
        reducedMotion={props.reducedMotion}
      />
    </>
  );
}
