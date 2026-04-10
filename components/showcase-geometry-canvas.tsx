"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import type { ShowcaseSectionId } from "@/lib/showcase";

interface ShowcaseGeometryCanvasProps {
  activeSection: ShowcaseSectionId;
  heroProgress: number;
  reducedMotion: boolean;
}

const SECTION_COLORS: Record<ShowcaseSectionId, { primary: string; accent: string; glow: string }> = {
  "hero-wordmark": { primary: "#c4d4ff", accent: "#d7dcff", glow: "#5f52e8" },
  "discipline-strip": { primary: "#d4d9ff", accent: "#bdd7ff", glow: "#3f7fff" },
  "showcase-wall": { primary: "#e3d7ff", accent: "#a8e8ff", glow: "#6e52ff" },
  "manifesto-inversion": { primary: "#ffffff", accent: "#a6d4ff", glow: "#d6d6d6" },
  "selected-work": { primary: "#d9deff", accent: "#d0f0ff", glow: "#566dff" },
  "contact-coda": { primary: "#d7d4dd", accent: "#f3e7ff", glow: "#5f6581" },
};

function createTriangleShape(scale: number) {
  const shape = new THREE.Shape();
  shape.moveTo(0, scale);
  shape.lineTo(-scale * 0.9, -scale * 0.68);
  shape.lineTo(scale * 0.9, -scale * 0.68);
  shape.closePath();
  return shape;
}

function GeometryScene({ activeSection, heroProgress, reducedMotion }: ShowcaseGeometryCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshPhysicalMaterial>>(null);
  const shellRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshBasicMaterial>>(null);
  const echoRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshBasicMaterial>>(null);
  const lineRef = useRef<THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>>(null);
  const ringRef = useRef<THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>>(null);
  const sparkRef = useRef<THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>>(null);

  const extrudeGeometry = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(createTriangleShape(1.28), {
      depth: 0.18,
      bevelEnabled: false,
    });
    geometry.center();
    return geometry;
  }, []);

  const shellGeometry = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(createTriangleShape(1.62), {
      depth: 0.04,
      bevelEnabled: false,
    });
    geometry.center();
    return geometry;
  }, []);

  const sparkPositions = useMemo(() => {
    const positions = new Float32Array(240 * 3);
    for (let index = 0; index < 240; index += 1) {
      const radius = 1.4 + Math.random() * 1.8;
      const angle = Math.random() * Math.PI * 2;
      const lift = (Math.random() - 0.5) * 2.2;
      positions[index * 3] = Math.cos(angle) * radius;
      positions[index * 3 + 1] = lift;
      positions[index * 3 + 2] = Math.sin(angle) * radius * 0.7;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    const colors = SECTION_COLORS[activeSection];
    const targetPrimary = new THREE.Color(colors.primary);
    const targetAccent = new THREE.Color(colors.accent);
    const targetGlow = new THREE.Color(colors.glow);
    const group = groupRef.current;
    const core = coreRef.current;
    const shell = shellRef.current;
    const echo = echoRef.current;
    const ring = ringRef.current;
    const line = lineRef.current;
    const sparks = sparkRef.current;

    if (!group || !core || !shell || !echo || !ring || !line || !sparks) return;

    const t = state.clock.elapsedTime;
    const drift = reducedMotion ? 0 : Math.sin(t * 0.4) * 0.06;
    const compression = heroProgress * 0.24;

    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, 0.4 + heroProgress * 0.35, 4, delta);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, 0.18 + drift, 4, delta);
    group.position.y = THREE.MathUtils.damp(group.position.y, 0.06 - heroProgress * 0.12, 4, delta);

    core.rotation.z += delta * (reducedMotion ? 0.08 : 0.18);
    core.material.color.lerp(targetPrimary, 0.08);
    core.material.emissive.lerp(targetGlow, 0.08);
    core.scale.setScalar(1 - compression * 0.2);

    shell.rotation.z -= delta * (reducedMotion ? 0.03 : 0.08);
    shell.material.color.lerp(targetAccent, 0.08);
    shell.position.z = -0.14;

    echo.rotation.z += delta * (reducedMotion ? 0.01 : 0.045);
    echo.material.color.lerp(targetGlow, 0.06);
    echo.position.set(0.36, -0.18, -0.36);

    line.material.color.lerp(targetAccent, 0.06);
    line.rotation.z -= delta * (reducedMotion ? 0.02 : 0.05);

    ring.material.color.lerp(targetGlow, 0.06);
    ring.rotation.x += delta * (reducedMotion ? 0.06 : 0.14);
    ring.rotation.y -= delta * (reducedMotion ? 0.03 : 0.08);
    ring.scale.setScalar(1.02 + Math.sin(t * 0.7) * (reducedMotion ? 0.01 : 0.035));

    sparks.rotation.y += delta * (reducedMotion ? 0.03 : 0.08);
    sparks.material.color.lerp(targetAccent, 0.05);
    sparks.material.opacity = activeSection === "manifesto-inversion" ? 0.12 : 0.3;
  });

  return (
    <>
      <ambientLight intensity={0.9} color="#f5f5ff" />
      <pointLight position={[2.2, 2.6, 2.8]} intensity={9} color={SECTION_COLORS[activeSection].glow} />
      <pointLight position={[-2.4, -1.4, 2.4]} intensity={5.4} color="#a8dbff" />
      <group ref={groupRef}>
        <mesh ref={coreRef} geometry={extrudeGeometry} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color="#d6deff"
            emissive="#4d54d4"
            emissiveIntensity={1.15}
            metalness={0.28}
            roughness={0.12}
            transmission={0.18}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>

        <mesh ref={shellRef} geometry={shellGeometry} position={[0, 0, -0.1]}>
          <meshBasicMaterial color="#c7d2ff" wireframe transparent opacity={0.55} />
        </mesh>

        <mesh ref={echoRef} geometry={shellGeometry} scale={[0.78, 0.78, 0.78]}>
          <meshBasicMaterial color="#7f62ff" transparent opacity={0.18} />
        </mesh>

        <lineSegments ref={lineRef}>
          <edgesGeometry args={[shellGeometry]} />
          <lineBasicMaterial color="#d7e0ff" transparent opacity={0.66} />
        </lineSegments>

        <mesh ref={ringRef} rotation={[0.88, 0.22, 0]}>
          <torusGeometry args={[1.62, 0.026, 18, 160]} />
          <meshBasicMaterial color="#616df0" transparent opacity={0.48} />
        </mesh>

        <points ref={sparkRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[sparkPositions, 3]}
              count={sparkPositions.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#d8dfff" size={0.03} sizeAttenuation transparent opacity={0.3} />
        </points>
      </group>
    </>
  );
}

export function ShowcaseGeometryCanvas(props: ShowcaseGeometryCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 4.4], fov: 34 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <GeometryScene {...props} />
    </Canvas>
  );
}
