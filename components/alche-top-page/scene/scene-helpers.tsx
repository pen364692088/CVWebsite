"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

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

export function buildWordLayout(word: string, spacing = 0.26) {
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

export function WordSegments({
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

export function createPrismAShape(scale: number) {
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

export function warpPrismGeometry(geometry: THREE.ExtrudeGeometry) {
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

export function createBentCardGeometry() {
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
