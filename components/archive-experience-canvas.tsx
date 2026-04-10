"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import type { ExperienceChapterId } from "@/lib/archive";

interface ArchiveExperienceCanvasProps {
  activeChapter: ExperienceChapterId;
  progress: number;
  isMobile: boolean;
  reducedMotion: boolean;
  onReady: () => void;
}

interface ChapterPreset {
  base: string;
  accent: string;
  emissive: string;
  chamberY: number;
  chamberZ: number;
  monolithHeight: number;
  monolithWidth: number;
  ringScale: number;
  rotationY: number;
  particleSpin: number;
  sigil: Array<[number, number, number]>;
}

const CHAPTER_PRESETS: Record<ExperienceChapterId, ChapterPreset> = {
  threshold: {
    base: "#121416",
    accent: "#b79362",
    emissive: "#3e2816",
    chamberY: 0,
    chamberZ: 0,
    monolithHeight: 2.9,
    monolithWidth: 0.72,
    ringScale: 1.1,
    rotationY: 0.12,
    particleSpin: 0.07,
    sigil: [
      [0, 1.2, 0],
      [0.96, 0.48, 0],
      [0.96, -0.48, 0],
      [0, -1.2, 0],
      [-0.96, -0.48, 0],
      [-0.96, 0.48, 0],
    ],
  },
  oath: {
    base: "#0e1118",
    accent: "#ced3de",
    emissive: "#152235",
    chamberY: 0.1,
    chamberZ: -0.12,
    monolithHeight: 3.15,
    monolithWidth: 0.66,
    ringScale: 1.24,
    rotationY: 0.22,
    particleSpin: 0.05,
    sigil: [
      [-1.05, 1.0, 0],
      [1.05, 1.0, 0],
      [1.05, -1.0, 0],
      [-1.05, -1.0, 0],
    ],
  },
  egocore: {
    base: "#0d1115",
    accent: "#90a4c2",
    emissive: "#1d2d45",
    chamberY: -0.08,
    chamberZ: 0.16,
    monolithHeight: 3.42,
    monolithWidth: 0.58,
    ringScale: 1.34,
    rotationY: 0.38,
    particleSpin: 0.09,
    sigil: [
      [0, 1.26, 0],
      [0.44, 0.18, 0],
      [1.08, -0.2, 0],
      [0.24, -0.64, 0],
      [0.24, -1.2, 0],
      [-0.24, -1.2, 0],
      [-0.24, -0.64, 0],
      [-1.08, -0.2, 0],
      [-0.44, 0.18, 0],
    ],
  },
  "ashen-archive": {
    base: "#16100f",
    accent: "#e0b772",
    emissive: "#502b17",
    chamberY: 0.06,
    chamberZ: 0.28,
    monolithHeight: 2.74,
    monolithWidth: 0.8,
    ringScale: 1.44,
    rotationY: 0.54,
    particleSpin: 0.11,
    sigil: [
      [0, 1.22, 0],
      [0.94, 0.12, 0],
      [0.3, -0.22, 0],
      [0.48, -1.16, 0],
      [0, -0.78, 0],
      [-0.48, -1.16, 0],
      [-0.3, -0.22, 0],
      [-0.94, 0.12, 0],
    ],
  },
  openemotion: {
    base: "#120f16",
    accent: "#d7c0e5",
    emissive: "#3a2345",
    chamberY: 0.14,
    chamberZ: 0.1,
    monolithHeight: 2.98,
    monolithWidth: 0.74,
    ringScale: 1.3,
    rotationY: 0.72,
    particleSpin: 0.06,
    sigil: [
      [0.62, 1.02, 0],
      [0.08, 1.14, 0],
      [-0.54, 0.8, 0],
      [-0.92, 0.1, 0],
      [-0.78, -0.7, 0],
      [-0.14, -1.1, 0],
      [0.58, -0.88, 0],
      [0.88, -0.28, 0],
      [0.66, 0.26, 0],
      [0.24, 0.62, 0],
      [-0.16, 0.58, 0],
      [0.18, 0.12, 0],
      [0.42, -0.22, 0],
      [0.3, -0.56, 0],
      [-0.08, -0.72, 0],
      [-0.44, -0.54, 0],
      [-0.54, -0.04, 0],
      [-0.34, 0.44, 0],
      [0.06, 0.8, 0],
    ],
  },
  "contact-coda": {
    base: "#111214",
    accent: "#c9c4b4",
    emissive: "#2c2a24",
    chamberY: -0.02,
    chamberZ: -0.14,
    monolithHeight: 2.58,
    monolithWidth: 0.9,
    ringScale: 1.04,
    rotationY: 0.08,
    particleSpin: 0.03,
    sigil: [
      [-0.9, 0.5, 0],
      [-0.45, 0.96, 0],
      [0.45, 0.96, 0],
      [0.9, 0.5, 0],
      [0.9, -0.3, 0],
      [0.45, -0.86, 0],
      [-0.45, -0.86, 0],
      [-0.9, -0.3, 0],
    ],
  },
};

function createParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const radius = 1.8 + Math.random() * 2.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[index * 3 + 1] = (Math.cos(phi) * radius * 0.7) + (Math.random() - 0.5) * 0.6;
    positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
  }

  return positions;
}

function ExperienceScene({
  activeChapter,
  progress,
  isMobile,
  reducedMotion,
  onReady,
}: Omit<ArchiveExperienceCanvasProps, "onReady"> & { onReady: () => void }) {
  const chamberRef = useRef<THREE.Group>(null);
  const monolithRef = useRef<THREE.Mesh<THREE.BoxGeometry, THREE.MeshPhysicalMaterial>>(null);
  const ringOuterRef = useRef<THREE.Mesh<THREE.TorusGeometry, THREE.MeshStandardMaterial>>(null);
  const ringInnerRef = useRef<THREE.Mesh<THREE.TorusGeometry, THREE.MeshStandardMaterial>>(null);
  const sigilRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null);
  const particlesRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null);
  const floorRef = useRef<THREE.Mesh<THREE.CircleGeometry, THREE.MeshStandardMaterial>>(null);
  const particlePositions = useMemo(() => createParticlePositions(isMobile ? 220 : 420), [isMobile]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    const points = sigilRef.current;
    if (!points) return;

    const sigilPoints = CHAPTER_PRESETS[activeChapter].sigil.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const geometry = new THREE.BufferGeometry().setFromPoints(sigilPoints);
    points.geometry.dispose();
    points.geometry = geometry;
  }, [activeChapter]);

  useFrame((state, delta) => {
    const preset = CHAPTER_PRESETS[activeChapter];
    const chamber = chamberRef.current;
    const monolith = monolithRef.current;
    const ringOuter = ringOuterRef.current;
    const ringInner = ringInnerRef.current;
    const sigil = sigilRef.current;
    const particles = particlesRef.current;
    const floor = floorRef.current;

    if (!chamber || !monolith || !ringOuter || !ringInner || !sigil || !particles || !floor) return;

    const t = state.clock.elapsedTime;
    const drift = reducedMotion ? 0 : Math.sin(t * 0.38) * 0.05;
    const chapterLift = (progress - 0.5) * (reducedMotion ? 0.04 : 0.18);
    const targetColor = new THREE.Color(preset.base);
    const accentColor = new THREE.Color(preset.accent);
    const emissiveColor = new THREE.Color(preset.emissive);

    chamber.position.x = THREE.MathUtils.damp(chamber.position.x, Math.sin(t * 0.18) * (reducedMotion ? 0.02 : 0.08), 4, delta);
    chamber.position.y = THREE.MathUtils.damp(chamber.position.y, preset.chamberY + chapterLift + drift, 4, delta);
    chamber.position.z = THREE.MathUtils.damp(chamber.position.z, preset.chamberZ, 4, delta);
    chamber.rotation.y = THREE.MathUtils.damp(chamber.rotation.y, preset.rotationY + Math.sin(t * 0.16) * 0.04, 4, delta);

    monolith.scale.x = THREE.MathUtils.damp(monolith.scale.x, preset.monolithWidth, 5, delta);
    monolith.scale.y = THREE.MathUtils.damp(monolith.scale.y, preset.monolithHeight, 5, delta);
    monolith.material.color.lerp(targetColor, 0.07);
    monolith.material.emissive.lerp(emissiveColor, 0.08);
    monolith.material.roughness = THREE.MathUtils.damp(monolith.material.roughness, activeChapter === "ashen-archive" ? 0.2 : 0.34, 5, delta);

    ringOuter.scale.x = THREE.MathUtils.damp(ringOuter.scale.x, preset.ringScale, 5, delta);
    ringOuter.scale.y = THREE.MathUtils.damp(ringOuter.scale.y, preset.ringScale, 5, delta);
    ringOuter.material.color.lerp(accentColor, 0.08);
    ringOuter.rotation.z += delta * (reducedMotion ? 0.02 : 0.08);
    ringOuter.rotation.y = THREE.MathUtils.damp(ringOuter.rotation.y, preset.rotationY * 0.6, 4, delta);

    ringInner.scale.x = THREE.MathUtils.damp(ringInner.scale.x, preset.ringScale * 0.74, 5, delta);
    ringInner.scale.y = THREE.MathUtils.damp(ringInner.scale.y, preset.ringScale * 0.74, 5, delta);
    ringInner.material.color.lerp(emissiveColor, 0.08);
    ringInner.rotation.z -= delta * (reducedMotion ? 0.015 : 0.05);
    ringInner.rotation.x = THREE.MathUtils.damp(ringInner.rotation.x, 1.1 + preset.rotationY * 0.35, 4, delta);

    sigil.material.color.lerp(accentColor, 0.08);
    sigil.position.z = THREE.MathUtils.damp(sigil.position.z, 0.8, 5, delta);
    sigil.rotation.z += delta * (reducedMotion ? 0.005 : 0.03);

    particles.rotation.y += delta * preset.particleSpin;
    particles.rotation.x = THREE.MathUtils.damp(particles.rotation.x, 1.22, 4, delta);
    particles.material.color.lerp(accentColor, 0.06);
    particles.material.opacity = reducedMotion ? 0.18 : 0.34;

    floor.material.color.lerp(new THREE.Color("#15171b"), 0.04);
    floor.material.emissive.lerp(emissiveColor, 0.04);
    floor.material.emissiveIntensity = reducedMotion ? 0.05 : 0.12;
  });

  return (
    <>
      <color attach="background" args={["#050607"]} />
      <fog attach="fog" args={["#050607", 5.2, 11.6]} />
      <ambientLight intensity={0.8} color="#ebe4d8" />
      <directionalLight position={[2.8, 3.2, 4.1]} intensity={1.4} color="#f2d2a2" />
      <pointLight position={[-2.4, 1.2, 2.8]} intensity={1.2} color="#6f87c4" />
      <group ref={chamberRef}>
        <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.25, 0]}>
          <circleGeometry args={[3.2, 64]} />
          <meshStandardMaterial color="#15171b" emissive="#241912" roughness={0.82} metalness={0.05} />
        </mesh>

        <mesh ref={ringOuterRef} rotation={[1.35, 0, 0]}>
          <torusGeometry args={[1.55, 0.04, 18, 160]} />
          <meshStandardMaterial color="#c8b08a" emissive="#3d2418" roughness={0.3} metalness={0.74} />
        </mesh>

        <mesh ref={ringInnerRef} rotation={[0.6, 0, 0]}>
          <torusGeometry args={[1.1, 0.026, 18, 120]} />
          <meshStandardMaterial color="#b6b0c2" emissive="#271826" roughness={0.24} metalness={0.68} />
        </mesh>

        <points ref={sigilRef} position={[0, 0.14, 0.82]}>
          <bufferGeometry />
          <pointsMaterial color="#d8c49d" size={isMobile ? 0.04 : 0.05} sizeAttenuation transparent opacity={0.9} />
        </points>

        <mesh ref={monolithRef} position={[0, 0.08, 0]}>
          <boxGeometry args={[0.72, 1, 0.24, 6, 8, 3]} />
          <meshPhysicalMaterial
            color="#111318"
            emissive="#22160f"
            roughness={0.34}
            metalness={0.58}
            clearcoat={0.72}
            clearcoatRoughness={0.18}
          />
        </mesh>

        <points ref={particlesRef} position={[0, 0.16, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particlePositions, 3]}
              count={particlePositions.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#cdb892" size={isMobile ? 0.018 : 0.024} sizeAttenuation transparent opacity={0.34} />
        </points>
      </group>
    </>
  );
}

export function ArchiveExperienceCanvas(props: ArchiveExperienceCanvasProps) {
  return (
    <Canvas
      dpr={props.isMobile ? [1, 1.25] : [1, 1.6]}
      camera={{ position: [0, 0.24, 5.6], fov: props.isMobile ? 38 : 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ExperienceScene {...props} />
    </Canvas>
  );
}
