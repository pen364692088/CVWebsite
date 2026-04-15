import * as THREE from "three";

interface BentCardGeometryOptions {
  width?: number;
  height?: number;
  radius?: number;
  segments?: number;
}

export function createBentCardGeometry({
  width = 2.6,
  height = 1.55,
  radius = 6,
  segments = 80,
}: BentCardGeometryOptions = {}) {
  const geometry = new THREE.PlaneGeometry(width, height, segments, 1);
  const positions = geometry.attributes.position;

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const angle = x / radius;
    const bentX = Math.sin(angle) * radius;
    const bentZ = Math.cos(angle) * radius - radius;

    positions.setXYZ(index, bentX, y, bentZ);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  return geometry;
}

export function placeOnArc(object: THREE.Object3D, angle: number, trackRadius: number, y = 0) {
  object.position.set(Math.sin(angle) * trackRadius, y, Math.cos(angle) * trackRadius);
  object.lookAt(0, y, 0);
}
