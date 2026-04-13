"use client";

import * as THREE from "three";

interface RoundedLetterBlueprint {
  width: number;
  build: (cursor: number) => THREE.Shape[];
}

function roundedRectShape(width: number, height: number, radius: number, x = 0, y = 0, rot = 0) {
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;
  const clampedRadius = Math.min(radius, halfWidth, halfHeight);
  const shape = new THREE.Shape();
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);

  const transformPoint = (pointX: number, pointY: number) =>
    new THREE.Vector2(pointX * cos - pointY * sin + x, pointX * sin + pointY * cos + y);
  const moveTo = (pointX: number, pointY: number) => {
    const point = transformPoint(pointX, pointY);
    shape.moveTo(point.x, point.y);
  };
  const lineTo = (pointX: number, pointY: number) => {
    const point = transformPoint(pointX, pointY);
    shape.lineTo(point.x, point.y);
  };
  const quadraticCurveTo = (controlX: number, controlY: number, pointX: number, pointY: number) => {
    const control = transformPoint(controlX, controlY);
    const point = transformPoint(pointX, pointY);
    shape.quadraticCurveTo(control.x, control.y, point.x, point.y);
  };

  moveTo(-halfWidth + clampedRadius, -halfHeight);
  lineTo(halfWidth - clampedRadius, -halfHeight);
  quadraticCurveTo(halfWidth, -halfHeight, halfWidth, -halfHeight + clampedRadius);
  lineTo(halfWidth, halfHeight - clampedRadius);
  quadraticCurveTo(halfWidth, halfHeight, halfWidth - clampedRadius, halfHeight);
  lineTo(-halfWidth + clampedRadius, halfHeight);
  quadraticCurveTo(-halfWidth, halfHeight, -halfWidth, halfHeight - clampedRadius);
  lineTo(-halfWidth, -halfHeight + clampedRadius);
  quadraticCurveTo(-halfWidth, -halfHeight, -halfWidth + clampedRadius, -halfHeight);

  return shape;
}

function roundedRectPath(path: THREE.Path, width: number, height: number, radius: number, x = 0, y = 0) {
  const halfWidth = width * 0.5;
  const halfHeight = height * 0.5;
  const clampedRadius = Math.min(radius, halfWidth, halfHeight);

  path.moveTo(x - halfWidth + clampedRadius, y - halfHeight);
  path.lineTo(x + halfWidth - clampedRadius, y - halfHeight);
  path.quadraticCurveTo(x + halfWidth, y - halfHeight, x + halfWidth, y - halfHeight + clampedRadius);
  path.lineTo(x + halfWidth, y + halfHeight - clampedRadius);
  path.quadraticCurveTo(x + halfWidth, y + halfHeight, x + halfWidth - clampedRadius, y + halfHeight);
  path.lineTo(x - halfWidth + clampedRadius, y + halfHeight);
  path.quadraticCurveTo(x - halfWidth, y + halfHeight, x - halfWidth, y + halfHeight - clampedRadius);
  path.lineTo(x - halfWidth, y - halfHeight + clampedRadius);
  path.quadraticCurveTo(x - halfWidth, y - halfHeight, x - halfWidth + clampedRadius, y - halfHeight);
}

function roundedRingShape(width: number, height: number, stroke: number, radius: number, x = 0, y = 0) {
  const shape = new THREE.Shape();
  roundedRectPath(shape, width, height, radius, x, y);

  const hole = new THREE.Path();
  roundedRectPath(hole, width - stroke * 2, height - stroke * 2, Math.max(radius - stroke * 0.6, stroke * 0.45), x, y);
  shape.holes.push(hole);

  return shape;
}

const ROUNDED_LETTERS: Record<string, RoundedLetterBlueprint> = {
  M: {
    width: 1.58,
    build: (cursor) => [
      roundedRectShape(0.2, 1.92, 0.1, cursor + 0.14, 0),
      roundedRectShape(0.2, 1.92, 0.1, cursor + 1.44, 0),
      roundedRectShape(0.19, 1.72, 0.095, cursor + 0.56, 0.02, -0.42),
      roundedRectShape(0.19, 1.72, 0.095, cursor + 1.02, 0.02, 0.42),
    ],
  },
  O: {
    width: 1.22,
    build: (cursor) => [roundedRingShape(1.02, 1.74, 0.18, 0.34, cursor + 0.61, 0)],
  },
  N: {
    width: 1.2,
    build: (cursor) => [
      roundedRectShape(0.2, 1.92, 0.1, cursor + 0.14, 0),
      roundedRectShape(0.2, 1.92, 0.1, cursor + 1.06, 0),
      roundedRectShape(0.18, 1.98, 0.09, cursor + 0.6, 0, -0.5),
    ],
  },
  F: {
    width: 0.98,
    build: (cursor) => [
      roundedRectShape(0.2, 1.92, 0.1, cursor + 0.14, 0),
      roundedRectShape(0.82, 0.18, 0.09, cursor + 0.49, 0.84),
      roundedRectShape(0.6, 0.17, 0.085, cursor + 0.39, 0.08),
    ],
  },
  L: {
    width: 0.92,
    build: (cursor) => [
      roundedRectShape(0.2, 1.92, 0.1, cursor + 0.14, 0),
      roundedRectShape(0.72, 0.18, 0.09, cursor + 0.43, -0.86),
    ],
  },
  W: {
    width: 1.7,
    build: (cursor) => [
      roundedRectShape(0.18, 1.72, 0.09, cursor + 0.14, 0.02, 0.1),
      roundedRectShape(0.18, 1.72, 0.09, cursor + 0.56, -0.02, -0.28),
      roundedRectShape(0.18, 1.72, 0.09, cursor + 1.06, -0.02, 0.28),
      roundedRectShape(0.18, 1.72, 0.09, cursor + 1.52, 0.02, -0.1),
    ],
  },
};

export function createRoundedWordGeometry(word: string, depth: number, spacing = 0.14) {
  let cursor = 0;
  const shapes: THREE.Shape[] = [];

  for (const letter of word) {
    const blueprint = ROUNDED_LETTERS[letter];
    if (!blueprint) continue;
    shapes.push(...blueprint.build(cursor));
    cursor += blueprint.width + spacing;
  }

  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: false,
    curveSegments: 18,
    steps: 1,
  });

  geometry.computeBoundingBox();
  const width = geometry.boundingBox ? geometry.boundingBox.max.x - geometry.boundingBox.min.x : 0;
  geometry.center();
  geometry.computeVertexNormals();

  return { geometry, width };
}
