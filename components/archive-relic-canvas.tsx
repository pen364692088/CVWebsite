"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";

import {
  RELIC_PRESETS,
  type ArchiveLens,
  type ArchivePhase,
  type RendererStats,
} from "@/lib/archive";

interface ArchiveRelicCanvasProps {
  activeLens: ArchiveLens;
  activePhase: ArchivePhase;
  isBandActive: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  onReady: () => void;
  onStats: (stats: RendererStats) => void;
}

type TargetShape = "shell" | "disciplineSplit" | "moonSigil" | "towerSigil" | "emberSigil";

function randomUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453123;
  return value - Math.floor(value);
}

function createRelicGeometry(isMobile: boolean) {
  const geometry = new THREE.IcosahedronGeometry(isMobile ? 1.5 : 1.72, isMobile ? 2 : 3);
  const position = geometry.getAttribute("position") as THREE.BufferAttribute;
  const vector = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vector.fromBufferAttribute(position, index).normalize();

    const radial =
      1 +
      Math.sin(vector.x * 3.2 + vector.y * 1.8) * 0.16 +
      Math.cos(vector.z * 4.3 - vector.x * 1.7) * 0.11 +
      Math.sin((vector.x + vector.z) * 6.2) * 0.04;

    vector.multiplyScalar(radial);
    vector.z *= 1.06;
    vector.y *= 0.96;
    position.setXYZ(index, vector.x, vector.y, vector.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

function sampleShape(
  count: number,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  isInside: (x: number, y: number) => boolean,
  depth = 0.14,
) {
  const points = new Float32Array(count * 3);
  let accepted = 0;
  let attempts = 0;

  while (accepted < count && attempts < count * 240) {
    attempts += 1;

    const x = THREE.MathUtils.lerp(bounds.minX, bounds.maxX, randomUnit(attempts * 0.91));
    const y = THREE.MathUtils.lerp(bounds.minY, bounds.maxY, randomUnit(attempts * 1.37));

    if (!isInside(x, y)) {
      continue;
    }

    points[accepted * 3] = x;
    points[accepted * 3 + 1] = y;
    points[accepted * 3 + 2] = (randomUnit(attempts * 1.83) - 0.5) * depth;
    accepted += 1;
  }

  return points;
}

function createShellTarget(count: number, radius: number, jitter: number) {
  const points = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1);
    const y = 1 - t * 2;
    const currentRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * index;
    const wobble = (randomUnit(index * 1.17) - 0.5) * jitter;

    points[index * 3] = (Math.cos(theta) * currentRadius + wobble) * radius;
    points[index * 3 + 1] = (y + wobble * 0.45) * radius;
    points[index * 3 + 2] = (Math.sin(theta) * currentRadius - wobble) * radius;
  }

  return points;
}

function createDisciplineSplitTarget(count: number, spread: number) {
  const points = new Float32Array(count * 3);
  const anchors = [
    new THREE.Vector3(-spread * 1.05, spread * 0.72, 0),
    new THREE.Vector3(spread * 1.08, spread * 0.58, spread * 0.15),
    new THREE.Vector3(0, -spread * 1.24, -spread * 0.12),
  ];

  for (let index = 0; index < count; index += 1) {
    const group = index % anchors.length;
    const anchor = anchors[group];
    const angle = randomUnit(index * 0.63 + group) * Math.PI * 2;
    const radius = spread * 0.34 + randomUnit(index * 1.41 + group) * spread * 0.46;
    const lift = (randomUnit(index * 1.83 + group) - 0.5) * spread * 0.6;

    points[index * 3] = anchor.x + Math.cos(angle) * radius * 0.72;
    points[index * 3 + 1] = anchor.y + Math.sin(angle) * radius * 0.54 + lift * 0.08;
    points[index * 3 + 2] = anchor.z + Math.sin(angle * 1.4) * radius * 0.34;
  }

  return points;
}

function createMoonSigilTarget(count: number, scale: number) {
  return sampleShape(
    count,
    { minX: -1.2 * scale, maxX: 1.2 * scale, minY: -1.1 * scale, maxY: 1.1 * scale },
    (x, y) => {
      const outer = (x + 0.2 * scale) ** 2 + y ** 2 <= (1.02 * scale) ** 2;
      const inner = (x - 0.26 * scale) ** 2 + (y - 0.06 * scale) ** 2 <= (0.8 * scale) ** 2;
      return outer && !inner;
    },
  );
}

function createTowerSigilTarget(count: number, scale: number) {
  return sampleShape(
    count,
    { minX: -0.95 * scale, maxX: 0.95 * scale, minY: -1.2 * scale, maxY: 1.08 * scale },
    (x, y) => {
      const body = x > -0.38 * scale && x < 0.38 * scale && y > -0.95 * scale && y < 0.72 * scale;
      const leftTower = x > -0.74 * scale && x < -0.18 * scale && y > 0.12 * scale && y < 1.02 * scale;
      const rightTower = x > 0.18 * scale && x < 0.74 * scale && y > 0.12 * scale && y < 1.02 * scale;
      const bridge = x > -0.82 * scale && x < 0.82 * scale && y > -1.12 * scale && y < -0.74 * scale;
      return body || leftTower || rightTower || bridge;
    },
  );
}

function createEmberSigilTarget(count: number, scale: number) {
  return sampleShape(
    count,
    { minX: -0.92 * scale, maxX: 0.92 * scale, minY: -1.18 * scale, maxY: 1.12 * scale },
    (x, y) => {
      const bulb = x * x + (y + 0.18 * scale) * (y + 0.18 * scale) <= (0.86 * scale) ** 2;
      const taperWidth = Math.max(0.06, (1.04 * scale - y) * 0.38);
      const taper = y > -0.18 * scale && y < 1.08 * scale && Math.abs(x) < taperWidth;
      return bulb || taper;
    },
  );
}

function getTargetShape(activeLens: ArchiveLens, activePhase: ArchivePhase): TargetShape {
  if (activePhase === "disciplines") {
    return "disciplineSplit";
  }

  if (activePhase === "sigils" && activeLens !== "all") {
    if (activeLens === "moon") return "moonSigil";
    if (activeLens === "tower") return "towerSigil";
    return "emberSigil";
  }

  return "shell";
}

function SceneBootstrap({
  isMobile,
  onReady,
}: {
  isMobile: boolean;
  onReady: () => void;
}) {
  const { camera, gl, invalidate, scene } = useThree();

  useEffect(() => {
    let cancelled = false;
    const environmentScene = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(gl);
    const renderTarget = pmrem.fromScene(environmentScene, isMobile ? 0.05 : 0.035);

    scene.environment = renderTarget.texture;
    scene.background = null;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = isMobile ? 1.02 : 1.1;
    gl.setClearColor(0x000000, 0);

    Promise.resolve(typeof gl.compileAsync === "function" ? gl.compileAsync(scene, camera) : undefined)
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          onReady();
          invalidate();
        }
      });

    return () => {
      cancelled = true;
      scene.environment = null;
      renderTarget.dispose();
      pmrem.dispose();
    };
  }, [camera, gl, invalidate, isMobile, onReady, scene]);

  return null;
}

function StatsSampler({
  isBandActive,
  onStats,
}: {
  isBandActive: boolean;
  onStats: (stats: RendererStats) => void;
}) {
  const { gl } = useThree();

  useEffect(() => {
    const timer = window.setInterval(() => {
      const nextStats = {
        calls: gl.info.render.calls,
        points: gl.info.render.points,
      };

      onStats(nextStats);
    }, isBandActive ? 1000 : 1500);

    return () => {
      window.clearInterval(timer);
    };
  }, [gl, isBandActive, onStats]);

  return null;
}

function RelicSceneContent({
  activeLens,
  activePhase,
  isMobile,
  reducedMotion,
}: {
  activeLens: ArchiveLens;
  activePhase: ArchivePhase;
  isMobile: boolean;
  reducedMotion: boolean;
}) {
  const preset = RELIC_PRESETS[activeLens];
  const materialColor = useMemo(() => new THREE.Color(preset.color), [preset.color]);
  const emissiveColor = useMemo(() => new THREE.Color(preset.emissive), [preset.emissive]);
  const particleColor = useMemo(() => new THREE.Color(preset.particleColor), [preset.particleColor]);
  const pointCount = isMobile ? 160 : 512;
  const geometry = useMemo(() => createRelicGeometry(isMobile), [isMobile]);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pointsMaterialRef = useRef<THREE.PointsMaterial>(null);
  const currentPositionsRef = useRef<Float32Array | null>(null);

  const particleTargets = useMemo(
    () => ({
      shell: createShellTarget(pointCount, isMobile ? 1.85 : 2.1, isMobile ? 0.08 : 0.12),
      disciplineSplit: createDisciplineSplitTarget(pointCount, isMobile ? 1.18 : 1.36),
      moonSigil: createMoonSigilTarget(pointCount, isMobile ? 1.16 : 1.34),
      towerSigil: createTowerSigilTarget(pointCount, isMobile ? 1.12 : 1.3),
      emberSigil: createEmberSigilTarget(pointCount, isMobile ? 1.1 : 1.28),
    }),
    [isMobile, pointCount],
  );

  const particleGeometry = useMemo(() => {
    const nextGeometry = new THREE.BufferGeometry();
    const seedPositions = particleTargets.shell.slice();
    const attribute = new THREE.BufferAttribute(seedPositions, 3);
    attribute.setUsage(THREE.DynamicDrawUsage);
    nextGeometry.setAttribute("position", attribute);
    currentPositionsRef.current = seedPositions;
    return nextGeometry;
  }, [particleTargets.shell]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      particleGeometry.dispose();
    };
  }, [geometry, particleGeometry]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const material = materialRef.current;
    const points = pointsRef.current;
    const pointsMaterial = pointsMaterialRef.current;
    const positionAttribute = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
    const currentPositions = currentPositionsRef.current;

    if (!mesh || !material || !points || !pointsMaterial || !currentPositions) {
      return;
    }

    const targetShape = getTargetShape(activeLens, activePhase);
    const targetPositions = particleTargets[targetShape];
    const pointerX = reducedMotion ? 0 : state.pointer.x;
    const pointerY = reducedMotion ? 0 : state.pointer.y;
    const elapsed = state.clock.elapsedTime;

    const breath = reducedMotion || activePhase !== "hero" ? 0 : Math.sin(elapsed * 0.9) * 0.028;
    const targetScale = activePhase === "sigils" ? 0.88 : activePhase === "disciplines" ? 0.93 : 1;
    const targetY = activePhase === "disciplines" ? 0.08 : 0;
    const baseRotationX = 0.18 + (activePhase === "disciplines" ? 0.14 : 0) + pointerY * 0.14;
    const baseRotationZ = (activePhase === "sigils" ? 0.12 : 0) + pointerX * 0.18;

    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetY, 4.2, delta);
    mesh.rotation.x = THREE.MathUtils.damp(mesh.rotation.x, baseRotationX, 4.2, delta);
    mesh.rotation.z = THREE.MathUtils.damp(mesh.rotation.z, baseRotationZ, 4.2, delta);
    mesh.rotation.y += delta * (activeLens === "tower" ? 0.16 : activeLens === "ember" ? 0.22 : 0.14);

    const nextScale = THREE.MathUtils.damp(mesh.scale.x, targetScale + breath, 4.2, delta);
    mesh.scale.setScalar(nextScale);

    material.color.lerp(materialColor, 0.08);
    material.emissive.lerp(emissiveColor, 0.08);
    material.clearcoat = THREE.MathUtils.damp(material.clearcoat, preset.clearcoat, 4.2, delta);
    material.iridescence = THREE.MathUtils.damp(material.iridescence, preset.iridescence, 4.2, delta);
    material.ior = THREE.MathUtils.damp(material.ior, preset.ior, 4.2, delta);
    material.roughness = THREE.MathUtils.damp(material.roughness, preset.roughness, 4.2, delta);
    material.metalness = THREE.MathUtils.damp(material.metalness, preset.metalness, 4.2, delta);
    material.dispersion = THREE.MathUtils.damp(material.dispersion, isMobile ? 0 : preset.dispersion, 4.2, delta);
    material.transmission = THREE.MathUtils.damp(
      material.transmission,
      isMobile ? 0 : preset.transmission,
      4.2,
      delta,
    );

    pointsMaterial.color.lerp(particleColor, 0.08);
    pointsMaterial.size = THREE.MathUtils.damp(
      pointsMaterial.size,
      (isMobile ? 0.82 : 1) * preset.pointSize,
      4.2,
      delta,
    );

    const lerpFactor = reducedMotion ? 0.28 : 0.08;

    for (let index = 0; index < currentPositions.length; index += 3) {
      let targetX = targetPositions[index];
      let targetYPosition = targetPositions[index + 1];
      let targetZ = targetPositions[index + 2];

      if (!reducedMotion && activeLens === "ember") {
        targetZ += Math.sin(elapsed * 1.8 + index * 0.06) * preset.particleJitter * 0.11;
      }

      currentPositions[index] = THREE.MathUtils.lerp(currentPositions[index], targetX, lerpFactor);
      currentPositions[index + 1] = THREE.MathUtils.lerp(currentPositions[index + 1], targetYPosition, lerpFactor);
      currentPositions[index + 2] = THREE.MathUtils.lerp(currentPositions[index + 2], targetZ, lerpFactor);
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.74} color="#d9d5ca" />
      <directionalLight position={[2.8, 2.2, 4.8]} intensity={2.2} color="#f4dec2" />
      <pointLight position={[-2.4, -1.8, 2.8]} intensity={10} distance={8} decay={2} color="#c96a2b" />
      <pointLight position={[2.2, 1.8, -1.2]} intensity={4.2} distance={8} decay={2} color="#8c7751" />

      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          ref={materialRef}
          color={preset.color}
          emissive={preset.emissive}
          emissiveIntensity={0.32}
          clearcoat={preset.clearcoat}
          clearcoatRoughness={0.08}
          iridescence={preset.iridescence}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[120, 360]}
          ior={preset.ior}
          dispersion={isMobile ? 0 : preset.dispersion}
          transmission={isMobile ? 0 : preset.transmission}
          thickness={1.2}
          attenuationDistance={1.9}
          attenuationColor="#ffffff"
          roughness={preset.roughness}
          metalness={preset.metalness}
          envMapIntensity={1.8}
        />
      </mesh>

      <points ref={pointsRef} geometry={particleGeometry}>
        <pointsMaterial
          ref={pointsMaterialRef}
          color={preset.particleColor}
          size={(isMobile ? 0.82 : 1) * preset.pointSize}
          sizeAttenuation
          transparent
          opacity={0.82}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

export function ArchiveRelicCanvas({
  activeLens,
  activePhase,
  isBandActive,
  isMobile,
  reducedMotion,
  onReady,
  onStats,
}: ArchiveRelicCanvasProps) {
  return (
    <Canvas
      className="archive-relic-canvas"
      dpr={isMobile ? [1, 1.2] : [1, 1.6]}
      frameloop={isBandActive && !reducedMotion ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.15, isMobile ? 5.7 : 6.25], fov: isMobile ? 40 : 34, near: 0.1, far: 30 }}
    >
      <SceneBootstrap isMobile={isMobile} onReady={onReady} />
      <StatsSampler isBandActive={isBandActive} onStats={onStats} />
      <RelicSceneContent
        activeLens={activeLens}
        activePhase={activePhase}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
