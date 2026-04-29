"use client";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Text, configureTextBuilder } from "troika-three-text";

import {
  type AlcheWorksCardDebugMode,
  getCompensatedAlcheWorksCardPoseDefinition,
  getAlcheWorksCardPoseDefinition,
  getAlcheWorksCardsSegment,
} from "@/lib/alche-works-shotbook";
import {
  ALCHE_TOP_CENTER_MODEL,
  ALCHE_TOP_MOONFLOW,
  ALCHE_TOP_KV_WALL_ARC_STRENGTH,
  ALCHE_TOP_MEDIA_WALL,
  deriveMissionPanelBoundaryFromProgress,
  deriveMissionTransitionOverlayState,
  ALCHE_TOP_WORKS_CARDS,
  ALCHE_TOP_WALL_WORD,
  ALCHE_TOP_WALL_TILE_DENSITY,
  clamp01,
  remapRange,
  smoothstep,
  type AlcheLayerDebugState,
  type AlchePointerDebugState,
  type AlcheTopSceneState,
} from "@/lib/alche-top-page";
import {
  createCurvedGridMaterial,
  createPrismIceMaterial,
  type PrismIceUniforms,
  createMaskedPrismLineArtMaterial,
  type MaskedPrismLineArtUniforms,
  createPrismSideRainbowMaterial,
  type PrismSideRainbowUniforms,
} from "@/components/alche-top-page/scene/alche-top-page-materials";
import { createBentCardGeometry, placeOnArc } from "@/components/alche-top-page/scene/bent-card-helpers";
import { assetPath } from "@/lib/site";

configureTextBuilder({ useWorker: false });

interface KvSceneSystemProps {
  sceneState: AlcheTopSceneState;
  reducedMotion: boolean;
  wallTexturePath: string;
  worksCardItems: readonly { title: string; imageSrc: string }[];
  cardDebugMode: AlcheWorksCardDebugMode;
  captureMode: boolean;
  worksWordHandoff: number;
  renderMode: "full" | "edge-overlay";
  pointerOverride?: { x: number; y: number } | null;
  pointerDebugRef?: { current: AlchePointerDebugState };
  layerDebugRef?: { current: AlcheLayerDebugState };
}

interface CurvedMediaWallProps {
  sceneState: AlcheTopSceneState;
  wallTexturePath: string;
  layerDebugRef?: { current: AlcheLayerDebugState };
}

interface ScreenBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface WorksCardPose {
  angle: number;
  radiusOffset: number;
  yOffset: number;
  scale: number;
}

interface CenterHeroRenderState {
  shadedScene: THREE.Group;
  edgeScene: THREE.Group;
  maskedLineArtScene: THREE.Group;
  rainbowScene: THREE.Group;
  modelScale: number;
  iceTexture: THREE.Texture;
  shadedMaterials: THREE.MeshStandardMaterial[];
  hiddenMaterial: THREE.MeshBasicMaterial;
  edgeMaterial: THREE.LineBasicMaterial;
  maskedLineArtMaterial: THREE.ShaderMaterial;
  rainbowMaterial: THREE.ShaderMaterial;
  shadedGeometries: Set<THREE.BufferGeometry>;
  edgeGeometries: THREE.EdgesGeometry[];
  prismIceUniforms: PrismIceUniforms;
  sceneTextureFallback: THREE.DataTexture;
  maskedLineArtUniforms: MaskedPrismLineArtUniforms;
  rainbowUniforms: PrismSideRainbowUniforms;
}

const ALCHE_TOP_PRISM_ICE_OPACITY = 0.66;
const ALCHE_TOP_PRISM_REFRACTION_TARGET_MAX = 512;
const ALCHE_TOP_PRISM_REFRACTION_CHANGE_INTERVAL = 1 / 5;
const ALCHE_TOP_PRISM_REFRACTION_IDLE_INTERVAL = 0.5;

const leadCenterPose = getAlcheWorksCardPoseDefinition("lead-center");
const cardForwardAxis = new THREE.Vector3(0, 0, 1);

function configureCardTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
}

function createIdentityCardTexture(label: "A" | "B", background: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to create card debug canvas context.");
  }

  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(255,255,255,0.68)";
  context.lineWidth = 14;
  context.strokeRect(28, 28, canvas.width - 56, canvas.height - 56);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = '700 420px "IBM Plex Mono", "Arial Black", sans-serif';
  context.fillText(label, canvas.width * 0.5, canvas.height * 0.54);

  const texture = new THREE.CanvasTexture(canvas);
  configureCardTexture(texture);
  return texture;
}

function createIcePrismTexture() {
  if (typeof document === "undefined") {
    const data = new Uint8Array([246, 250, 252, 255]);
    const texture = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Failed to create prism ice texture canvas context.");
  }

  let seed = 0x5d2f3a91;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };

  const { width, height } = canvas;
  const base = context.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#fbfdff");
  base.addColorStop(0.42, "#f3f7fa");
  base.addColorStop(0.7, "#e6edf0");
  base.addColorStop(1, "#d8dee1");
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);

  context.globalCompositeOperation = "multiply";
  for (let index = 0; index < 22; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = 90 + random() * 240;
    const cloud = context.createRadialGradient(x, y, 0, x, y, radius);
    cloud.addColorStop(0, `rgba(54, 62, 68, ${0.15 + random() * 0.14})`);
    cloud.addColorStop(0.62, `rgba(102, 112, 120, ${0.06 + random() * 0.09})`);
    cloud.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = cloud;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  context.globalCompositeOperation = "multiply";
  for (let index = 0; index < 10; index += 1) {
    const y = height * (0.08 + random() * 0.84);
    const slope = -0.34 + random() * 0.68;
    context.lineWidth = 30 + random() * 82;
    context.strokeStyle = `rgba(48, 54, 58, ${0.06 + random() * 0.09})`;
    context.beginPath();
    context.moveTo(-160, y - slope * 160);
    context.lineTo(width + 160, y + slope * (width + 160));
    context.stroke();
  }

  context.globalCompositeOperation = "screen";
  for (let index = 0; index < 14; index += 1) {
    const y = height * (0.12 + random() * 0.78);
    const slope = -0.28 + random() * 0.56;
    context.lineWidth = 42 + random() * 72;
    context.strokeStyle = `rgba(255,255,255, ${0.3 + random() * 0.3})`;
    context.beginPath();
    context.moveTo(-120, y - slope * 120);
    context.lineTo(width + 120, y + slope * (width + 120));
    context.stroke();
  }

  context.globalCompositeOperation = "source-over";
  for (let index = 0; index < 18; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const length = 180 + random() * 520;
    const angle = -0.9 + random() * 1.8;
    const endX = x + Math.cos(angle) * length;
    const endY = y + Math.sin(angle) * length;
    context.lineWidth = 1.5 + random() * 3.8;
    context.strokeStyle =
      index % 3 === 0
        ? `rgba(236, 242, 245, ${0.12 + random() * 0.12})`
        : `rgba(156, 172, 184, ${0.1 + random() * 0.12})`;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(endX, endY);
    context.stroke();
  }

  for (let index = 0; index < 42; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const length = 70 + random() * 220;
    const angle = -0.65 + random() * 1.3;
    context.lineWidth = 0.8 + random() * 1.8;
    context.strokeStyle = `rgba(70, 78, 84, ${0.07 + random() * 0.1})`;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    context.stroke();
  }

  context.globalCompositeOperation = "source-over";
  for (let index = 0; index < 1400; index += 1) {
    const alpha = 0.01 + random() * 0.018;
    const value = 64 + Math.floor(random() * 90);
    context.fillStyle = `rgba(${value}, ${value + 6}, ${value + 10}, ${alpha})`;
    context.fillRect(random() * width, random() * height, 1 + random() * 1.6, 1 + random() * 1.6);
  }

  for (let index = 0; index < 90; index += 1) {
    const x = random() * width;
    const y = random() * height;
    const length = 18 + random() * 72;
    const angle = random() * Math.PI * 2;
    context.lineWidth = 0.5 + random() * 1.2;
    context.strokeStyle = `rgba(82, 92, 100, ${0.025 + random() * 0.045})`;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function measureObjectScreenBounds(
  object: THREE.Object3D,
  camera: THREE.Camera,
  viewportWidth: number,
  viewportHeight: number,
  box: THREE.Box3,
  points: THREE.Vector3[],
  projected: THREE.Vector3,
  target: ScreenBounds,
) {
  box.setFromObject(object);
  if (box.isEmpty()) {
    target.left = Number.NaN;
    target.right = Number.NaN;
    target.top = Number.NaN;
    target.bottom = Number.NaN;
    return target;
  }

  const min = box.min;
  const max = box.max;
  const corners = [
    [min.x, min.y, min.z],
    [min.x, min.y, max.z],
    [min.x, max.y, min.z],
    [min.x, max.y, max.z],
    [max.x, min.y, min.z],
    [max.x, min.y, max.z],
    [max.x, max.y, min.z],
    [max.x, max.y, max.z],
  ] as const;

  let minScreenX = Number.POSITIVE_INFINITY;
  let maxScreenX = Number.NEGATIVE_INFINITY;
  let minScreenY = Number.POSITIVE_INFINITY;
  let maxScreenY = Number.NEGATIVE_INFINITY;

  corners.forEach(([x, y, z], index) => {
    points[index].set(x, y, z);
    projected.copy(points[index]).project(camera);
    const screenX = ((projected.x + 1) * 0.5) * viewportWidth;
    const screenY = ((1 - projected.y) * 0.5) * viewportHeight;
    minScreenX = Math.min(minScreenX, screenX);
    maxScreenX = Math.max(maxScreenX, screenX);
    minScreenY = Math.min(minScreenY, screenY);
    maxScreenY = Math.max(maxScreenY, screenY);
  });

  target.left = THREE.MathUtils.clamp(minScreenX, 0, viewportWidth);
  target.right = THREE.MathUtils.clamp(maxScreenX, 0, viewportWidth);
  target.top = THREE.MathUtils.clamp(minScreenY, 0, viewportHeight);
  target.bottom = THREE.MathUtils.clamp(maxScreenY, 0, viewportHeight);
  return target;
}

function lerpWorksCardPose(from: WorksCardPose, to: WorksCardPose, mix: number): WorksCardPose {
  return {
    angle: THREE.MathUtils.lerp(from.angle, to.angle, mix),
    radiusOffset: THREE.MathUtils.lerp(from.radiusOffset, to.radiusOffset, mix),
    yOffset: THREE.MathUtils.lerp(from.yOffset, to.yOffset, mix),
    scale: THREE.MathUtils.lerp(from.scale, to.scale, mix),
  };
}

interface WorksCardTrackTiming {
  queueStart: number;
  queueEnd: number;
  leadEnd: number;
  supportStart: number | null;
  supportEnd: number | null;
}

interface ResolveWorksCardTrackPoseOptions {
  progress: number;
  timing: WorksCardTrackTiming;
  queueOffscreenPose: WorksCardPose;
  queuePose: WorksCardPose;
  leadPose: WorksCardPose;
  supportPose: WorksCardPose;
}

function normalizeTrackWindow(progress: number, start: number, end: number) {
  return smoothstep(clamp01((progress - start) / Math.max(end - start, 0.0001)));
}

function resolveWorksCardTrackPose({
  progress,
  timing,
  queueOffscreenPose,
  queuePose,
  leadPose,
  supportPose,
}: ResolveWorksCardTrackPoseOptions): WorksCardPose {
  if (progress <= timing.queueEnd) {
    return lerpWorksCardPose(queueOffscreenPose, queuePose, normalizeTrackWindow(progress, timing.queueStart, timing.queueEnd));
  }

  if (progress <= timing.leadEnd) {
    return lerpWorksCardPose(queuePose, leadPose, normalizeTrackWindow(progress, timing.queueEnd, timing.leadEnd));
  }

  if (timing.supportStart !== null && timing.supportEnd !== null && progress >= timing.supportStart) {
    return lerpWorksCardPose(leadPose, supportPose, normalizeTrackWindow(progress, timing.supportStart, timing.supportEnd));
  }

  return leadPose;
}

function isWorksCardTrackVisible(progress: number, timing: WorksCardTrackTiming) {
  const queueMix = normalizeTrackWindow(progress, timing.queueStart, timing.queueEnd);
  return progress > timing.queueStart && queueMix >= 0.18;
}

const ALCHE_TOP_WALL_PARAMETRIC_WIDTH_RATIO = 2.25;
const ALCHE_TOP_WALL_PARAMETRIC_HEIGHT_RATIO = 1.04;

function createParametricWallGeometry() {
  const widthSegments = ALCHE_TOP_MEDIA_WALL.radialSegments * 2;
  const heightSegments = ALCHE_TOP_MEDIA_WALL.heightSegments * 2;

  const positions: number[] = [];
  const wallU: number[] = [];
  const wallV: number[] = [];
  const indices: number[] = [];

  for (let row = 0; row <= heightSegments; row += 1) {
    const v = row / Math.max(heightSegments, 1) * 2 - 1;

    for (let column = 0; column <= widthSegments; column += 1) {
      const u = column / Math.max(widthSegments, 1) * 2 - 1;
      positions.push(u, v, 0);
      wallU.push(u);
      wallV.push(v);
    }
  }

  const rowStride = widthSegments + 1;
  for (let row = 0; row < heightSegments; row += 1) {
    for (let column = 0; column < widthSegments; column += 1) {
      const a = row * rowStride + column;
      const b = row * rowStride + column + 1;
      const c = (row + 1) * rowStride + column + 1;
      const d = (row + 1) * rowStride + column;
      indices.push(a, b, d, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aWallU", new THREE.Float32BufferAttribute(wallU, 1));
  geometry.setAttribute("aWallV", new THREE.Float32BufferAttribute(wallV, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

function CurvedMediaWall({ sceneState, wallTexturePath, layerDebugRef }: CurvedMediaWallProps) {
  const roomRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null);
  const wallTexture = useLoader(THREE.TextureLoader, wallTexturePath);
  const material = useMemo(() => createCurvedGridMaterial(wallTexture), [wallTexture]);
  const effectiveRadius = ALCHE_TOP_MEDIA_WALL.radius / ALCHE_TOP_KV_WALL_ARC_STRENGTH;
  const geometry = useMemo(() => createParametricWallGeometry(), []);

  useEffect(() => {
    wallTexture.colorSpace = THREE.SRGBColorSpace;
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.minFilter = THREE.LinearFilter;
    wallTexture.magFilter = THREE.LinearFilter;
    wallTexture.generateMipmaps = false;
    wallTexture.repeat.set(
      ALCHE_TOP_MEDIA_WALL.cellColumns * ALCHE_TOP_WALL_TILE_DENSITY,
      ALCHE_TOP_MEDIA_WALL.cellRows * ALCHE_TOP_WALL_TILE_DENSITY,
    );
    wallTexture.needsUpdate = true;
  }, [wallTexture]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    if (!roomRef.current) return;

    const wallVisible = sceneState.kv.wallVisibility * sceneState.kv.visible;

    roomRef.current.rotation.y = THREE.MathUtils.damp(roomRef.current.rotation.y, 0, 2.4, delta);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uIntro.value = sceneState.introProgress;
    material.uniforms.uGlow.value = THREE.MathUtils.damp(material.uniforms.uGlow.value, sceneState.kv.wallGlow, 3.4, delta);
    material.uniforms.uExposure.value = THREE.MathUtils.damp(material.uniforms.uExposure.value, sceneState.kv.wallExposure, 3.4, delta);
    material.uniforms.uWhiteMix.value = THREE.MathUtils.damp(material.uniforms.uWhiteMix.value, sceneState.kv.wallWhiteMix, 3.4, delta);
    material.uniforms.uFlatten.value = THREE.MathUtils.damp(material.uniforms.uFlatten.value, sceneState.kv.wallFlatten, 3.2, delta);
    material.uniforms.uSceneFade.value = THREE.MathUtils.damp(material.uniforms.uSceneFade.value, wallVisible, 3.2, delta);
    material.uniforms.uWallRadius.value = effectiveRadius;
    material.uniforms.uWallHalfWidth.value = effectiveRadius * ALCHE_TOP_WALL_PARAMETRIC_WIDTH_RATIO;
    material.uniforms.uWallHalfHeight.value = ALCHE_TOP_MEDIA_WALL.height * 0.5 * ALCHE_TOP_WALL_PARAMETRIC_HEIGHT_RATIO;
    material.uniforms.uViewportPx.value.set(state.size.width, state.size.height);
    if (layerDebugRef) {
      const worldPosition = roomRef.current.getWorldPosition(new THREE.Vector3());
      layerDebugRef.current.wallWorldZ = worldPosition.z;
      layerDebugRef.current.wallRotationY = roomRef.current.rotation.y;
    }
  });

  return (
    <mesh ref={roomRef} geometry={geometry} position={[0, 0, ALCHE_TOP_MEDIA_WALL.worldZ]} frustumCulled={false}>
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function MoonflowTitle({ sceneState, worksWordHandoff, layerDebugRef }: KvSceneSystemProps) {
  const { camera, size } = useThree();
  const textRef = useRef<Text>(null);
  const effectiveRadius = ALCHE_TOP_MEDIA_WALL.radius / ALCHE_TOP_KV_WALL_ARC_STRENGTH;
  const fontPath = useMemo(() => assetPath(ALCHE_TOP_MOONFLOW.fontPath), []);
  const targetPosition = useMemo(
    () => new THREE.Vector3(0, ALCHE_TOP_MOONFLOW.y, -effectiveRadius * ALCHE_TOP_MOONFLOW.depthMix + ALCHE_TOP_MOONFLOW.zOffset),
    [effectiveRadius],
  );
  const measuredWidthRef = useRef(1);
  const textReadyRef = useRef(false);
  const text = useMemo(() => new Text(), []);

  useEffect(() => {
    textReadyRef.current = false;
    text.text = "MOONFLOW";
    text.font = fontPath;
    text.fontSize = ALCHE_TOP_MOONFLOW.baseFontSize;
    text.anchorX = "center";
    text.anchorY = "middle";
    text.textAlign = "center";
    text.whiteSpace = "nowrap";
    text.letterSpacing = ALCHE_TOP_MOONFLOW.letterSpacing;
    text.color = 0x070707;
    text.fillOpacity = 0;
    text.renderOrder = 1;
    text.position.set(0, ALCHE_TOP_MOONFLOW.y, targetPosition.z);
    const isLocalValidation =
      window.location.hostname === "127.0.0.1" &&
      !window.location.search.includes("alcheCapture=1");
    const syncDelay = isLocalValidation ? 6000 : 0;
    const syncHandle = window.setTimeout(() => {
      text.sync(() => {
        const bounds = text.textRenderInfo?.blockBounds;
        measuredWidthRef.current = bounds ? Math.max(bounds[2] - bounds[0], 0.0001) : 1;
        textReadyRef.current = true;
      });
    }, syncDelay);

    return () => {
      window.clearTimeout(syncHandle);
      text.dispose();
    };
  }, [fontPath, targetPosition.z, text]);

  useFrame((state, delta) => {
    if (!textRef.current) return;

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const handoff = sceneState.activeSection === "loading" ? 0 : worksWordHandoff;
    const baseVisibility = sceneState.kv.visible * (sceneState.activeSection === "loading" || sceneState.activeSection === "kv" ? sceneState.kv.wordVisibility : 1);
    const handoffFade = 1 - smoothstep(remapRange(handoff, 0.18, 0.36));
    const visibility = baseVisibility * handoffFade;
    const distance = perspectiveCamera.position.distanceTo(targetPosition);
    const viewportHeight = 2 * Math.tan(THREE.MathUtils.degToRad(perspectiveCamera.fov * 0.5)) * distance;
    const viewportWidth = viewportHeight * (size.width / Math.max(size.height, 1));
    const targetScale = (viewportWidth * ALCHE_TOP_MOONFLOW.widthRatio) / measuredWidthRef.current;
    const ready = textReadyRef.current;
    textRef.current.visible = ready;
    textRef.current.frustumCulled = false;
    if (!ready) {
      textRef.current.fillOpacity = 0;
      return;
    }

    textRef.current.position.x = THREE.MathUtils.damp(textRef.current.position.x, targetPosition.x, 3.6, delta);
    textRef.current.position.y = THREE.MathUtils.damp(textRef.current.position.y, targetPosition.y, 3.6, delta);
    textRef.current.position.z = THREE.MathUtils.damp(textRef.current.position.z, targetPosition.z, 3.6, delta);
    textRef.current.rotation.set(0, 0, 0);
    textRef.current.scale.setScalar(THREE.MathUtils.damp(textRef.current.scale.x, targetScale, 3.8, delta));
    textRef.current.fillOpacity = THREE.MathUtils.damp(textRef.current.fillOpacity ?? 0, visibility * 0.98, 4.2, delta);
    if (layerDebugRef) {
      const worldPosition = textRef.current.getWorldPosition(new THREE.Vector3());
      layerDebugRef.current.worksHandoff = handoff;
      layerDebugRef.current.moonflowWorldZ = worldPosition.z;
      layerDebugRef.current.moonflowOpacity = textRef.current.fillOpacity ?? 0;
    }
  });

  return <primitive ref={textRef} object={text} visible={false} />;
}

function WallWordSweep({ sceneState, worksWordHandoff, layerDebugRef }: KvSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<Text>(null);
  const effectiveRadius = ALCHE_TOP_MEDIA_WALL.radius / ALCHE_TOP_KV_WALL_ARC_STRENGTH;
  const radius = effectiveRadius - ALCHE_TOP_WALL_WORD.wallInset;
  const localDepth = ALCHE_TOP_WALL_WORD.worldZ - ALCHE_TOP_MEDIA_WALL.worldZ + ALCHE_TOP_WALL_WORD.surfaceOffset;
  const fontPath = useMemo(() => assetPath(ALCHE_TOP_WALL_WORD.fontPath), []);
  const textReadyRef = useRef(false);
  const text = useMemo(() => new Text(), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x09090b,
        transparent: true,
        opacity: 0,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [],
  );

  useEffect(() => {
    const curvedText = text as Text & { curveRadius?: number; depthOffset?: number };
    textReadyRef.current = false;
    text.text = ALCHE_TOP_WALL_WORD.text;
    text.font = fontPath;
    text.fontSize = ALCHE_TOP_WALL_WORD.fontSize;
    text.anchorX = "center";
    text.anchorY = "middle";
    text.textAlign = "center";
    text.whiteSpace = "nowrap";
    text.color = 0x09090b;
    text.fillOpacity = 1;
    curvedText.curveRadius = radius;
    curvedText.depthOffset = ALCHE_TOP_WALL_WORD.polygonDepthOffset;
    text.material = material;
    text.frustumCulled = false;
    text.position.set(0, ALCHE_TOP_WALL_WORD.y, localDepth);
    text.sync(() => {
      textReadyRef.current = true;
    });

    return () => {
      textReadyRef.current = false;
      text.dispose();
      material.dispose();
    };
  }, [fontPath, localDepth, material, radius, text]);

  useFrame((state, delta) => {
    if (!groupRef.current || !textRef.current) return;

    const ready = textReadyRef.current;
    groupRef.current.visible = ready;
    textRef.current.visible = ready;
    if (!ready) {
      material.opacity = 0;
      return;
    }

    const handoff = worksWordHandoff;
    const enterMix = smoothstep(remapRange(handoff, ALCHE_TOP_WALL_WORD.enterStart, ALCHE_TOP_WALL_WORD.enterEnd));
    const fadeMix = smoothstep(remapRange(handoff, ALCHE_TOP_WALL_WORD.holdEnd, ALCHE_TOP_WALL_WORD.fadeEnd));
    const targetX =
      handoff <= ALCHE_TOP_WALL_WORD.enterEnd
        ? THREE.MathUtils.lerp(ALCHE_TOP_WALL_WORD.enterX, ALCHE_TOP_WALL_WORD.centerX, enterMix)
        : handoff <= ALCHE_TOP_WALL_WORD.holdEnd
          ? ALCHE_TOP_WALL_WORD.centerX
          : THREE.MathUtils.lerp(ALCHE_TOP_WALL_WORD.centerX, ALCHE_TOP_WALL_WORD.exitX, fadeMix);
    const opacityTarget =
      handoff < ALCHE_TOP_WALL_WORD.enterStart
        ? 0
        : handoff <= ALCHE_TOP_WALL_WORD.enterEnd
          ? enterMix
          : handoff <= ALCHE_TOP_WALL_WORD.holdEnd
            ? 1
            : 1 - fadeMix;

    textRef.current.position.x = THREE.MathUtils.damp(textRef.current.position.x, targetX, 4.4, delta);
    textRef.current.rotation.set(0, 0, 0);
    material.opacity = THREE.MathUtils.damp(material.opacity, opacityTarget * ALCHE_TOP_WALL_WORD.fillOpacity, 5, delta);
    if (layerDebugRef) {
      const worldPosition = textRef.current.getWorldPosition(new THREE.Vector3());
      layerDebugRef.current.worksWorldX = worldPosition.x;
      layerDebugRef.current.worksWorldZ = worldPosition.z;
      layerDebugRef.current.worksRotationY = textRef.current.rotation.y;
      layerDebugRef.current.worksHandoff = handoff;
      layerDebugRef.current.worksOpacity = material.opacity;
      layerDebugRef.current.worksDepthTest = material.depthTest;
      layerDebugRef.current.worksDepthWrite = material.depthWrite;
      layerDebugRef.current.worksTransparent = material.transparent;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, ALCHE_TOP_MEDIA_WALL.worldZ]} visible={false}>
      <primitive ref={textRef} object={text} visible={false} />
    </group>
  );
}

function WorksCardPair({
  sceneState,
  worksCardItems,
  cardDebugMode,
  reducedMotion,
  worksWordHandoff,
  layerDebugRef,
}: Pick<KvSceneSystemProps, "sceneState" | "worksCardItems" | "cardDebugMode" | "reducedMotion" | "worksWordHandoff" | "layerDebugRef">) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const texturePaths = useMemo(() => worksCardItems.map((item) => assetPath(item.imageSrc)), [worksCardItems]);
  const posterTextures = useLoader(THREE.TextureLoader, texturePaths);
  const identityTextures = useMemo(
    () => [createIdentityCardTexture("A", "#242934"), createIdentityCardTexture("B", "#242934")] as const,
    [],
  );
  const card0WorldRef = useRef(new THREE.Vector3());
  const card1WorldRef = useRef(new THREE.Vector3());
  const card0ScreenBoundsRef = useRef<ScreenBounds>({ left: 0, right: 0, top: 0, bottom: 0 });
  const card1ScreenBoundsRef = useRef<ScreenBounds>({ left: 0, right: 0, top: 0, bottom: 0 });
  const leadWorldRef = useRef(new THREE.Vector3());
  const supportWorldRef = useRef(new THREE.Vector3());
  const projectedRef = useRef(new THREE.Vector3());
  const card0BoxRef = useRef(new THREE.Box3());
  const card1BoxRef = useRef(new THREE.Box3());
  const card0PointsRef = useRef(Array.from({ length: 8 }, () => new THREE.Vector3()));
  const card1PointsRef = useRef(Array.from({ length: 8 }, () => new THREE.Vector3()));
  const card0FacingTargetRef = useRef(new THREE.Vector3());
  const card1FacingTargetRef = useRef(new THREE.Vector3());
  const card0ForwardRef = useRef(new THREE.Vector3());
  const card1ForwardRef = useRef(new THREE.Vector3());
  const pinnedShotMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("alcheShot");
  const geometry = useMemo(
    () =>
      createBentCardGeometry({
        width: ALCHE_TOP_WORKS_CARDS.width,
        height: ALCHE_TOP_WORKS_CARDS.height,
        radius: ALCHE_TOP_WORKS_CARDS.bendRadius,
        segments: ALCHE_TOP_WORKS_CARDS.segments,
      }),
    [],
  );
  const posterMaterials = useMemo(
    () =>
      posterTextures.map(
        (texture) =>
          new THREE.MeshStandardMaterial({
            map: texture,
            color: "#ffffff",
            roughness: 0.35,
            metalness: 0,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
          }),
      ),
    [posterTextures],
  );
  const identityMaterials = useMemo(
    () =>
      identityTextures.map(
        (texture) =>
          new THREE.MeshBasicMaterial({
            map: texture,
            color: "#ffffff",
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0,
            toneMapped: false,
          }),
      ),
    [identityTextures],
  );
  const materials = cardDebugMode === "identity" ? identityMaterials : posterMaterials;

  useEffect(() => {
    posterTextures.forEach((texture) => {
      configureCardTexture(texture);
    });
  }, [posterTextures]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      posterMaterials.forEach((material) => material.dispose());
      identityMaterials.forEach((material) => material.dispose());
      identityTextures.forEach((texture) => texture.dispose());
    };
  }, [geometry, identityMaterials, identityTextures, posterMaterials]);

  useFrame((state, delta) => {
    if (!groupRef.current || !leftRef.current || !rightRef.current || materials.length < 2) return;

    const inWorksCards = sceneState.activeSection === "works_cards";
    const inWorksOutro = sceneState.activeSection === "works_outro";
    const outroMix = inWorksOutro ? smoothstep(clamp01(sceneState.worksOutro.clearMix)) : sceneState.activeSection === "mission_in" ? 1 : 0;
    const cardsVisible = worksWordHandoff >= 0.985 && (inWorksCards || inWorksOutro) && outroMix < 0.999;
    const progress = sceneState.worksCardsProgress;
    const segment = getAlcheWorksCardsSegment(progress);
    const handoffMix = smoothstep(clamp01(segment.phase === "handoff" ? segment.mix : segment.phase === "settled" ? 1 : 0));
    const cardsSequenceVisible = cardsVisible && inWorksCards;
    const compensatedQueueRightLowerOffscreenPose = getCompensatedAlcheWorksCardPoseDefinition(
      "queue-right-lower-offscreen",
      state.size.width,
      state.size.height,
    );
    const compensatedQueueRightLowerPose = getCompensatedAlcheWorksCardPoseDefinition(
      "queue-right-lower",
      state.size.width,
      state.size.height,
    );
    const compensatedSupportLeftUpperPose = getCompensatedAlcheWorksCardPoseDefinition(
      "support-left-upper",
      state.size.width,
      state.size.height,
    );
    const compensatedWorksOutroLeftClearPose = {
      ...compensatedSupportLeftUpperPose,
      angle: compensatedSupportLeftUpperPose.angle - 0.18,
      radiusOffset: compensatedSupportLeftUpperPose.radiusOffset + 0.18,
      yOffset: compensatedSupportLeftUpperPose.yOffset + 0.04,
    };
    const card0Timing: WorksCardTrackTiming = {
      queueStart: 0,
      queueEnd: segment.entryShot.progress,
      leadEnd: segment.centerShot.progress,
      supportStart: segment.queueShot.progress,
      supportEnd: segment.settledShot.progress,
    };
    const card1Timing: WorksCardTrackTiming = {
      queueStart: segment.centerShot.progress,
      queueEnd: segment.queueShot.progress,
      leadEnd: segment.settledShot.progress,
      supportStart: null,
      supportEnd: null,
    };
    const card0Visible =
      inWorksOutro || !cardsSequenceVisible ? cardsVisible : cardsSequenceVisible && isWorksCardTrackVisible(progress, card0Timing);
    const card1Visible =
      inWorksOutro
        ? cardsVisible && outroMix < 0.985
        : cardsSequenceVisible && isWorksCardTrackVisible(progress, card1Timing);
    const leadIndex = !cardsVisible ? null : inWorksOutro ? 1 : segment.phase === "entry" || segment.phase === "queue" ? 0 : handoffMix >= 0.5 ? 1 : 0;
    const supportIndex = !card1Visible || leadIndex === null ? null : leadIndex === 0 ? 1 : 0;
    const card0Pose =
      inWorksOutro
        ? compensatedSupportLeftUpperPose
        : resolveWorksCardTrackPose({
            progress,
            timing: card0Timing,
            queueOffscreenPose: compensatedQueueRightLowerOffscreenPose,
            queuePose: compensatedQueueRightLowerPose,
            leadPose: leadCenterPose,
            supportPose: compensatedSupportLeftUpperPose,
          });
    const card1Pose =
      inWorksOutro
        ? lerpWorksCardPose(leadCenterPose, compensatedWorksOutroLeftClearPose, outroMix)
        : resolveWorksCardTrackPose({
            progress,
            timing: card1Timing,
            queueOffscreenPose: compensatedQueueRightLowerOffscreenPose,
            queuePose: compensatedQueueRightLowerPose,
            leadPose: leadCenterPose,
            supportPose: compensatedSupportLeftUpperPose,
          });

    groupRef.current.visible = cardsVisible && (card0Visible || card1Visible);
    leftRef.current.visible = card0Visible;
    rightRef.current.visible = card1Visible;
    if (!cardsVisible) {
      materials.forEach((material) => {
        material.opacity = THREE.MathUtils.damp(material.opacity, 0, 6.2, delta);
      });
      if (layerDebugRef) {
        layerDebugRef.current.cardsOpacity = 0;
        layerDebugRef.current.cardsLeadIndex = null;
        layerDebugRef.current.cardsLeadOpacity = null;
        layerDebugRef.current.cardsSupportOpacity = null;
        layerDebugRef.current.card0Opacity = null;
        layerDebugRef.current.card1Opacity = null;
        layerDebugRef.current.card0WorldX = null;
        layerDebugRef.current.card0WorldZ = null;
        layerDebugRef.current.card1WorldX = null;
        layerDebugRef.current.card1WorldZ = null;
        layerDebugRef.current.card0ArcAngle = null;
        layerDebugRef.current.card1ArcAngle = null;
        layerDebugRef.current.card0FacingError = null;
        layerDebugRef.current.card1FacingError = null;
        layerDebugRef.current.card0ScreenLeft = null;
        layerDebugRef.current.card0ScreenRight = null;
        layerDebugRef.current.card0ScreenTop = null;
        layerDebugRef.current.card0ScreenBottom = null;
        layerDebugRef.current.card1ScreenLeft = null;
        layerDebugRef.current.card1ScreenRight = null;
        layerDebugRef.current.card1ScreenTop = null;
        layerDebugRef.current.card1ScreenBottom = null;
        layerDebugRef.current.card0Visible = false;
        layerDebugRef.current.card1Visible = false;
        layerDebugRef.current.cardsLeadWorldX = null;
        layerDebugRef.current.cardsLeadWorldZ = null;
        layerDebugRef.current.cardsSupportWorldX = null;
        layerDebugRef.current.cardsSupportWorldZ = null;
      }
      return;
    }
    const card0Float = reducedMotion || pinnedShotMode ? 0 : Math.sin(state.clock.elapsedTime * 0.48) * 0.012;
    const card1Float = reducedMotion || pinnedShotMode ? 0 : Math.sin(state.clock.elapsedTime * 0.34 + 1.4) * 0.008;
    const card0TargetY = card0Pose.yOffset + card0Float;
    const card1TargetY = card1Pose.yOffset + card1Float;
    const card0Radius = Math.max(0.001, ALCHE_TOP_WORKS_CARDS.baseRadius + card0Pose.radiusOffset);
    const card1Radius = Math.max(0.001, ALCHE_TOP_WORKS_CARDS.baseRadius + card1Pose.radiusOffset);

    placeOnArc(leftRef.current, {
      angle: card0Pose.angle,
      radius: card0Radius,
      centerX: ALCHE_TOP_WORKS_CARDS.arcCenterX,
      centerZ: ALCHE_TOP_WORKS_CARDS.arcCenterZ,
      y: card0Pose.yOffset,
    });
    leftRef.current.position.y = pinnedShotMode
      ? card0TargetY
      : THREE.MathUtils.damp(leftRef.current.position.y, card0TargetY, 4.2, delta);
    leftRef.current.scale.setScalar(
      pinnedShotMode ? card0Pose.scale : THREE.MathUtils.damp(leftRef.current.scale.x, card0Pose.scale, 4.2, delta),
    );

    placeOnArc(rightRef.current, {
      angle: card1Pose.angle,
      radius: card1Radius,
      centerX: ALCHE_TOP_WORKS_CARDS.arcCenterX,
      centerZ: ALCHE_TOP_WORKS_CARDS.arcCenterZ,
      y: card1Pose.yOffset,
    });
    rightRef.current.position.y = pinnedShotMode
      ? card1TargetY
      : THREE.MathUtils.damp(rightRef.current.position.y, card1TargetY, 4.2, delta);
    rightRef.current.scale.setScalar(
      pinnedShotMode ? card1Pose.scale : THREE.MathUtils.damp(rightRef.current.scale.x, card1Pose.scale, 4.2, delta),
    );

    const card0TargetOpacity = card0Visible ? (inWorksOutro ? 1 - outroMix * 0.72 : 1) : 0;
    const card1TargetOpacity = card1Visible ? (inWorksOutro ? 1 - outroMix : 1) : 0;
    materials[0].opacity = card0TargetOpacity;
    materials[1].opacity = card1TargetOpacity;

    if (layerDebugRef) {
      leftRef.current.getWorldPosition(card0WorldRef.current);
      measureObjectScreenBounds(
        leftRef.current,
        state.camera,
        state.size.width,
        state.size.height,
        card0BoxRef.current,
        card0PointsRef.current,
        projectedRef.current,
        card0ScreenBoundsRef.current,
      );

      if (card1Visible) {
        rightRef.current.getWorldPosition(card1WorldRef.current);
        measureObjectScreenBounds(
          rightRef.current,
          state.camera,
          state.size.width,
          state.size.height,
          card1BoxRef.current,
          card1PointsRef.current,
          projectedRef.current,
          card1ScreenBoundsRef.current,
        );
      }

      if (leadIndex === 0) {
        leadWorldRef.current.copy(card0WorldRef.current);
      } else if (leadIndex === 1 && card1Visible) {
        leadWorldRef.current.copy(card1WorldRef.current);
      }

      if (supportIndex === 0) {
        supportWorldRef.current.copy(card0WorldRef.current);
      } else if (supportIndex === 1 && card1Visible) {
        supportWorldRef.current.copy(card1WorldRef.current);
      }

      layerDebugRef.current.cardsOpacity = Math.max(card0Visible ? materials[0].opacity : 0, card1Visible ? materials[1].opacity : 0);
      layerDebugRef.current.cardsLeadIndex = leadIndex;
      layerDebugRef.current.cardsLeadOpacity = leadIndex === null ? null : materials[leadIndex]?.opacity ?? null;
      layerDebugRef.current.cardsSupportOpacity = supportIndex === null ? null : materials[supportIndex]?.opacity ?? null;
      layerDebugRef.current.card0Opacity = card0Visible ? materials[0]?.opacity ?? null : null;
      layerDebugRef.current.card1Opacity = card1Visible ? materials[1]?.opacity ?? null : null;
      layerDebugRef.current.card0WorldX = card0WorldRef.current.x;
      layerDebugRef.current.card0WorldZ = card0WorldRef.current.z;
      layerDebugRef.current.card1WorldX = card1Visible ? card1WorldRef.current.x : null;
      layerDebugRef.current.card1WorldZ = card1Visible ? card1WorldRef.current.z : null;
      card0FacingTargetRef.current
        .set(
          leftRef.current.position.x - ALCHE_TOP_WORKS_CARDS.arcCenterX,
          0,
          leftRef.current.position.z - ALCHE_TOP_WORKS_CARDS.arcCenterZ,
        )
        .normalize();
      card0ForwardRef.current.copy(cardForwardAxis).applyQuaternion(leftRef.current.quaternion).setY(0).normalize();
      layerDebugRef.current.card0ArcAngle = Math.atan2(
        leftRef.current.position.x - ALCHE_TOP_WORKS_CARDS.arcCenterX,
        leftRef.current.position.z - ALCHE_TOP_WORKS_CARDS.arcCenterZ,
      );
      layerDebugRef.current.card0FacingError = card0ForwardRef.current.angleTo(card0FacingTargetRef.current);

      if (card1Visible) {
        card1FacingTargetRef.current
          .set(
            rightRef.current.position.x - ALCHE_TOP_WORKS_CARDS.arcCenterX,
            0,
            rightRef.current.position.z - ALCHE_TOP_WORKS_CARDS.arcCenterZ,
          )
          .normalize();
        card1ForwardRef.current.copy(cardForwardAxis).applyQuaternion(rightRef.current.quaternion).setY(0).normalize();
        layerDebugRef.current.card1ArcAngle = Math.atan2(
          rightRef.current.position.x - ALCHE_TOP_WORKS_CARDS.arcCenterX,
          rightRef.current.position.z - ALCHE_TOP_WORKS_CARDS.arcCenterZ,
        );
        layerDebugRef.current.card1FacingError = card1ForwardRef.current.angleTo(card1FacingTargetRef.current);
      } else {
        layerDebugRef.current.card1ArcAngle = null;
        layerDebugRef.current.card1FacingError = null;
      }
      layerDebugRef.current.card0ScreenLeft = card0ScreenBoundsRef.current.left;
      layerDebugRef.current.card0ScreenRight = card0ScreenBoundsRef.current.right;
      layerDebugRef.current.card0ScreenTop = card0ScreenBoundsRef.current.top;
      layerDebugRef.current.card0ScreenBottom = card0ScreenBoundsRef.current.bottom;
      layerDebugRef.current.card1ScreenLeft = card1Visible ? card1ScreenBoundsRef.current.left : null;
      layerDebugRef.current.card1ScreenRight = card1Visible ? card1ScreenBoundsRef.current.right : null;
      layerDebugRef.current.card1ScreenTop = card1Visible ? card1ScreenBoundsRef.current.top : null;
      layerDebugRef.current.card1ScreenBottom = card1Visible ? card1ScreenBoundsRef.current.bottom : null;
      layerDebugRef.current.card0Visible = card0Visible;
      layerDebugRef.current.card1Visible = card1Visible;
      layerDebugRef.current.cardsLeadWorldX = leadIndex === null ? null : leadWorldRef.current.x;
      layerDebugRef.current.cardsLeadWorldZ = leadIndex === null ? null : leadWorldRef.current.z;
      layerDebugRef.current.cardsSupportWorldX = supportIndex === null ? null : supportWorldRef.current.x;
      layerDebugRef.current.cardsSupportWorldZ = supportIndex === null ? null : supportWorldRef.current.z;
    }
  });

  return (
    <group ref={groupRef} position={[0, ALCHE_TOP_WORKS_CARDS.groupY, ALCHE_TOP_WORKS_CARDS.groupZ]} visible={false}>
      <mesh ref={leftRef} geometry={geometry} material={materials[0]} renderOrder={6} />
      <mesh ref={rightRef} geometry={geometry} material={materials[1]} renderOrder={6} />
    </group>
  );
}

function CenterHeroModel({
  sceneState,
  captureMode,
  reducedMotion: _reducedMotion,
  renderMode,
  pointerOverride: _pointerOverride,
  pointerDebugRef,
  layerDebugRef,
}: Pick<
  KvSceneSystemProps,
  "sceneState" | "captureMode" | "reducedMotion" | "wallTexturePath" | "renderMode" | "pointerOverride" | "pointerDebugRef" | "layerDebugRef"
>) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, assetPath(ALCHE_TOP_CENTER_MODEL.path));
  const effectiveRadius = ALCHE_TOP_MEDIA_WALL.radius / ALCHE_TOP_KV_WALL_ARC_STRENGTH;
  const targetPosition = useMemo(
    () =>
      new THREE.Vector3(
        0,
        ALCHE_TOP_CENTER_MODEL.y,
        -effectiveRadius * ALCHE_TOP_CENTER_MODEL.depthMix + ALCHE_TOP_CENTER_MODEL.depthOffset,
      ),
    [effectiveRadius],
  );
  const backgroundRenderTarget = useMemo(() => {
    const target = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: true,
      stencilBuffer: false,
      generateMipmaps: false,
    });
    target.texture.name = "alche-prism-background-refraction";
    target.texture.colorSpace = THREE.SRGBColorSpace;
    return target;
  }, []);
  const drawingBufferSize = useMemo(() => new THREE.Vector2(1, 1), []);
  const lastRefractionCaptureTimeRef = useRef(-Infinity);
  const refractionCaptureCountRef = useRef(0);
  const lastRefractionStateKeyRef = useRef("");
  const texturedScene = useMemo<CenterHeroRenderState>(() => {
    const shadedScene = gltf.scene.clone(true) as THREE.Group;
    const edgeScene = gltf.scene.clone(true) as THREE.Group;
    const maskedLineArtScene = gltf.scene.clone(true) as THREE.Group;
    const rainbowScene = gltf.scene.clone(true) as THREE.Group;
    const iceTexture = createIcePrismTexture();
    const sceneTextureFallback = new THREE.DataTexture(new Uint8Array([246, 250, 252, 255]), 1, 1, THREE.RGBAFormat);
    sceneTextureFallback.colorSpace = THREE.SRGBColorSpace;
    sceneTextureFallback.needsUpdate = true;
    const shadedMaterials: THREE.MeshStandardMaterial[] = [];
    const shadedGeometries = new Set<THREE.BufferGeometry>();
    const edgeGeometries: THREE.EdgesGeometry[] = [];
    const prismIceUniforms: PrismIceUniforms = {
      uSceneTexture: { value: sceneTextureFallback },
      uViewportPx: { value: new THREE.Vector2(1, 1) },
      uMaskBoundary: { value: -1 },
      uClipMode: { value: 0 },
      uRefractionStrength: { value: 0.24 },
      uLensWarpStrength: { value: 1.65 },
      uChromaticStrength: { value: 0.0035 },
      uSceneRefractionMix: { value: 1 },
    };
    const maskedLineArtUniforms: MaskedPrismLineArtUniforms = {
      uOpacity: { value: 0 },
    };
    const rainbowUniforms: PrismSideRainbowUniforms = {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uRainbowMix: { value: 0 },
      uBlackMix: { value: 0 },
      uTargetFaceNormal: {
        value: new THREE.Vector3(...ALCHE_TOP_CENTER_MODEL.rainbowFaceNormal),
      },
    };
    const hiddenMaterial = new THREE.MeshBasicMaterial({
      transparent: false,
      opacity: 1,
      colorWrite: false,
      depthWrite: true,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide,
    });
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: "#707985",
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: true,
      toneMapped: false,
    });
    const maskedLineArtMaterial = createMaskedPrismLineArtMaterial(maskedLineArtUniforms);
    const rainbowMaterial = createPrismSideRainbowMaterial(rainbowUniforms);
    const prismIceMaterial = createPrismIceMaterial(iceTexture, prismIceUniforms);
    shadedMaterials.push(prismIceMaterial);

    shadedScene.traverse((child) => {
      if (!("isMesh" in child) || child.isMesh !== true) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 4;
      mesh.material = prismIceMaterial;
      shadedGeometries.add(mesh.geometry as THREE.BufferGeometry);
    });

    edgeScene.traverse((child) => {
      if (!("isMesh" in child) || child.isMesh !== true) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 5;
      mesh.material = hiddenMaterial;
      const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry as THREE.BufferGeometry);
      const lines = new THREE.LineSegments(edgesGeometry, edgeMaterial);
      lines.renderOrder = 7;
      lines.frustumCulled = false;
      edgeGeometries.push(edgesGeometry);
      mesh.add(lines);
    });

    maskedLineArtScene.traverse((child) => {
      if (!("isMesh" in child) || child.isMesh !== true) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 6;
      mesh.material = maskedLineArtMaterial;
    });

    rainbowScene.traverse((child) => {
      if (!("isMesh" in child) || child.isMesh !== true) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 5.5;
      mesh.material = rainbowMaterial;
    });

    const bounds = new THREE.Box3().setFromObject(shadedScene);
    const size = new THREE.Vector3();
    bounds.getSize(size);
    const modelHeight = Math.max(size.y, 0.0001);
    const scale = ALCHE_TOP_CENTER_MODEL.targetHeight / modelHeight;
    shadedScene.scale.setScalar(scale);
    edgeScene.scale.setScalar(scale);
    maskedLineArtScene.scale.setScalar(scale);
    rainbowScene.scale.setScalar(scale);
    bounds.setFromObject(shadedScene);
    const center = bounds.getCenter(new THREE.Vector3());
    shadedScene.position.sub(center);
    edgeScene.position.sub(center);
    maskedLineArtScene.position.sub(center);
    rainbowScene.position.sub(center);

    return {
      shadedScene,
      edgeScene,
      maskedLineArtScene,
      rainbowScene,
      modelScale: scale,
      iceTexture,
      shadedMaterials,
      hiddenMaterial,
      edgeMaterial,
      maskedLineArtMaterial,
      rainbowMaterial,
      shadedGeometries,
      edgeGeometries,
      prismIceUniforms,
      sceneTextureFallback,
      maskedLineArtUniforms,
      rainbowUniforms,
    };
  }, [gltf.scene]);

  useEffect(() => {
    if (renderMode !== "full") return;
    if (typeof window === "undefined") return;

    const host = window as typeof window & {
      __getAlcheHeroModelRotation?: () => { x: number; y: number; z: number } | null;
    };

    host.__getAlcheHeroModelRotation = () => {
      if (!groupRef.current) return null;
      return {
        x: groupRef.current.rotation.x,
        y: groupRef.current.rotation.y,
        z: groupRef.current.rotation.z,
      };
    };

    return () => {
      delete host.__getAlcheHeroModelRotation;
    };
  }, [renderMode, texturedScene]);

  useEffect(
    () => () => {
      texturedScene.iceTexture.dispose();
      texturedScene.sceneTextureFallback.dispose();
      texturedScene.shadedMaterials.forEach((material) => material.dispose());
      texturedScene.hiddenMaterial.dispose();
      texturedScene.edgeMaterial.dispose();
      texturedScene.maskedLineArtMaterial.dispose();
      texturedScene.rainbowMaterial.dispose();
      texturedScene.shadedGeometries.forEach((geometry) => geometry.dispose());
      texturedScene.edgeGeometries.forEach((geometry) => geometry.dispose());
      backgroundRenderTarget.dispose();
    },
    [backgroundRenderTarget, texturedScene],
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const { missionPanelProgress } = deriveMissionTransitionOverlayState(sceneState.activeSection, sceneState.sectionProgress);
    const splitEnabled = sceneState.activeSection === "mission_in";
    const maskBoundary = splitEnabled ? deriveMissionPanelBoundaryFromProgress(missionPanelProgress) : -1;
    const visibility =
      splitEnabled
        ? sceneState.kv.prismVisibility
        : sceneState.activeSection === "works_intro" || sceneState.activeSection === "works" || sceneState.activeSection === "works_outro"
        ? sceneState.kv.visible
        : sceneState.kv.prismVisibility * sceneState.kv.visible;

    if (pointerDebugRef) {
      pointerDebugRef.current.r3fPointerX = state.pointer.x;
      pointerDebugRef.current.r3fPointerY = state.pointer.y;
    }

    state.gl.getDrawingBufferSize(drawingBufferSize);
    texturedScene.prismIceUniforms.uViewportPx.value.copy(drawingBufferSize);
    texturedScene.prismIceUniforms.uMaskBoundary.value = maskBoundary;
    texturedScene.rainbowUniforms.uTime.value = state.clock.elapsedTime;

    const missionPanelActive = missionPanelProgress > 0.001;
    const splitFullFade = splitEnabled ? smoothstep(remapRange(missionPanelProgress, 0.62, 0.84)) : 0;
    const fullBridgeVisibility = splitEnabled ? visibility * (1 - splitFullFade) : visibility;
    const edgeBridgeVisibility =
      renderMode === "edge-overlay" && missionPanelActive
        ? splitEnabled
          ? visibility
          : sceneState.activeSection === "works_outro"
          ? visibility * smoothstep(remapRange(missionPanelProgress, 0.08, 0.36))
          : 0
        : 0;
    const edgeOverlayActive = renderMode === "edge-overlay" && edgeBridgeVisibility > 0.001;
    const iceVisibilityTarget = renderMode === "full" ? fullBridgeVisibility : 0;
    texturedScene.prismIceUniforms.uSceneRefractionMix.value = splitEnabled ? 0.28 : 1;
    texturedScene.shadedMaterials.forEach((material) => {
      const iceDamp = splitEnabled ? 10 : 4;
      material.opacity = THREE.MathUtils.damp(material.opacity, iceVisibilityTarget * ALCHE_TOP_PRISM_ICE_OPACITY, iceDamp, delta);
      material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, iceVisibilityTarget * 0.18, iceDamp, delta);
    });
    const edgeDamp = missionPanelActive ? 10 : 4;
    texturedScene.edgeMaterial.opacity = THREE.MathUtils.damp(
      texturedScene.edgeMaterial.opacity,
      edgeBridgeVisibility,
      edgeDamp,
      delta,
    );
    texturedScene.maskedLineArtUniforms.uOpacity.value = THREE.MathUtils.damp(
      texturedScene.maskedLineArtUniforms.uOpacity.value,
      edgeBridgeVisibility * 0.86,
      edgeDamp,
      delta,
    );
    texturedScene.rainbowUniforms.uOpacity.value = THREE.MathUtils.damp(
      texturedScene.rainbowUniforms.uOpacity.value,
      splitEnabled ? edgeBridgeVisibility * sceneState.kv.prismRainbowMix * 0.92 : 0,
      edgeDamp,
      delta,
    );
    texturedScene.rainbowUniforms.uRainbowMix.value = THREE.MathUtils.damp(
      texturedScene.rainbowUniforms.uRainbowMix.value,
      splitEnabled ? sceneState.kv.prismRainbowMix : 0,
      edgeDamp,
      delta,
    );
    texturedScene.rainbowUniforms.uBlackMix.value = THREE.MathUtils.damp(
      texturedScene.rainbowUniforms.uBlackMix.value,
      splitEnabled ? sceneState.kv.prismRainbowBlackMix : 0,
      edgeDamp,
      delta,
    );

    const prismFullOpacity = texturedScene.shadedMaterials.reduce((maxOpacity, material) => Math.max(maxOpacity, material.opacity), 0);
    const prismEdgeOpacity = texturedScene.edgeMaterial.opacity;
    const prismLineOpacity = texturedScene.maskedLineArtUniforms.uOpacity.value;
    if (layerDebugRef) {
      if (renderMode === "full") {
        layerDebugRef.current.prismFullOpacity = prismFullOpacity;
      } else {
        layerDebugRef.current.prismEdgeOpacity = prismEdgeOpacity;
        layerDebugRef.current.prismLineOpacity = prismLineOpacity;
      }
    }

    const shadedVisible =
      renderMode === "full" && (iceVisibilityTarget > 0.001 || texturedScene.shadedMaterials.some((material) => material.opacity > 0.001));
    const edgeVisible =
      renderMode === "edge-overlay" &&
      (edgeOverlayActive || prismEdgeOpacity > 0.001 || prismLineOpacity > 0.001 || texturedScene.rainbowUniforms.uOpacity.value > 0.001);
    const rainbowVisible =
      edgeVisible &&
      splitEnabled &&
      (sceneState.kv.prismRainbowMix > 0.001 || texturedScene.rainbowUniforms.uOpacity.value > 0.001);
    texturedScene.shadedScene.visible = shadedVisible;
    texturedScene.edgeScene.visible = edgeVisible;
    texturedScene.maskedLineArtScene.visible = edgeVisible;
    texturedScene.rainbowScene.visible = rainbowVisible;
    groupRef.current.visible = shadedVisible || edgeVisible;
    if (!groupRef.current.visible) {
      if (pointerDebugRef) {
        pointerDebugRef.current.modelRotationX = groupRef.current.rotation.x;
        pointerDebugRef.current.modelRotationY = groupRef.current.rotation.y;
        pointerDebugRef.current.modelRotationZ = groupRef.current.rotation.z;
      }
      if (layerDebugRef) {
        layerDebugRef.current.modelWorldZ = null;
        layerDebugRef.current.modelScale = null;
        layerDebugRef.current.prismGroupScale = null;
      }
      return;
    }

    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      targetPosition.x,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      targetPosition.y,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      targetPosition.z,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      sceneState.kv.prismRotationX,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      sceneState.kv.prismRotationY,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      sceneState.kv.prismRotationZ,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    const targetGroupScale = sceneState.kv.prismGroupScale;
    const nextGroupScale = THREE.MathUtils.damp(
      groupRef.current.scale.x,
      targetGroupScale,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.scale.setScalar(nextGroupScale);
    if (pointerDebugRef) {
      pointerDebugRef.current.modelRotationX = groupRef.current.rotation.x;
      pointerDebugRef.current.modelRotationY = groupRef.current.rotation.y;
      pointerDebugRef.current.modelRotationZ = groupRef.current.rotation.z;
    }
    if (layerDebugRef) {
      const worldPosition = groupRef.current.getWorldPosition(new THREE.Vector3());
      layerDebugRef.current.modelWorldZ = worldPosition.z;
      layerDebugRef.current.modelScale = texturedScene.modelScale * groupRef.current.scale.x;
      layerDebugRef.current.prismGroupScale = groupRef.current.scale.x;
    }

    const refractionStateKey = [
      sceneState.activeSection,
      Math.round(sceneState.sectionProgress * 200),
      Math.round(sceneState.worksCardsProgress * 200),
      Math.round(sceneState.kv.wallFlatten * 200),
      Math.round(sceneState.camera.fov * 100),
      ...sceneState.camera.position.map((value) => Math.round(value * 100)),
      ...sceneState.camera.target.map((value) => Math.round(value * 100)),
    ].join(":");
    const refractionStateChanged = refractionStateKey !== lastRefractionStateKeyRef.current;
    const secondsSinceRefractionCapture = state.clock.elapsedTime - lastRefractionCaptureTimeRef.current;
    const refractionCaptureInterval = refractionStateChanged
      ? ALCHE_TOP_PRISM_REFRACTION_CHANGE_INTERVAL
      : ALCHE_TOP_PRISM_REFRACTION_IDLE_INTERVAL;
    const refractionVisibleEnough = iceVisibilityTarget > 0.04 || prismFullOpacity > 0.04;
    if (
      renderMode === "full" &&
      !splitEnabled &&
      shadedVisible &&
      refractionVisibleEnough &&
      (!captureMode || refractionCaptureCountRef.current < 1) &&
      secondsSinceRefractionCapture >= refractionCaptureInterval
    ) {
      lastRefractionCaptureTimeRef.current = state.clock.elapsedTime;
      lastRefractionStateKeyRef.current = refractionStateKey;
      refractionCaptureCountRef.current += 1;
      const targetScale = Math.min(
        1,
        ALCHE_TOP_PRISM_REFRACTION_TARGET_MAX / Math.max(drawingBufferSize.x, drawingBufferSize.y, 1),
      );
      const targetWidth = Math.max(1, Math.floor(drawingBufferSize.x * targetScale));
      const targetHeight = Math.max(1, Math.floor(drawingBufferSize.y * targetScale));
      if (backgroundRenderTarget.width !== targetWidth || backgroundRenderTarget.height !== targetHeight) {
        backgroundRenderTarget.setSize(targetWidth, targetHeight);
      }

      const previousRenderTarget = state.gl.getRenderTarget();
      const previousAutoClear = state.gl.autoClear;
      const previousXrEnabled = state.gl.xr.enabled;
      const previousShadowAutoUpdate = state.gl.shadowMap.autoUpdate;
      const previousShadedVisible = texturedScene.shadedScene.visible;

      texturedScene.shadedScene.visible = false;
      state.gl.xr.enabled = false;
      state.gl.shadowMap.autoUpdate = false;
      state.gl.autoClear = true;
      state.gl.setRenderTarget(backgroundRenderTarget);
      state.gl.clear(true, true, true);
      state.gl.render(state.scene, state.camera);
      state.gl.setRenderTarget(previousRenderTarget);
      state.gl.autoClear = previousAutoClear;
      state.gl.xr.enabled = previousXrEnabled;
      state.gl.shadowMap.autoUpdate = previousShadowAutoUpdate;
      texturedScene.shadedScene.visible = previousShadedVisible;
      texturedScene.prismIceUniforms.uSceneTexture.value = backgroundRenderTarget.texture;
    }

    if (layerDebugRef && renderMode === "full") {
      const lastCaptureTime = lastRefractionCaptureTimeRef.current;
      layerDebugRef.current.prismRefractionCaptureCount = refractionCaptureCountRef.current;
      layerDebugRef.current.prismRefractionTargetWidth = backgroundRenderTarget.width;
      layerDebugRef.current.prismRefractionTargetHeight = backgroundRenderTarget.height;
      layerDebugRef.current.prismRefractionLastCaptureMs = Number.isFinite(lastCaptureTime) ? Math.round(lastCaptureTime * 1000) : null;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <primitive object={texturedScene.shadedScene} />
      <primitive object={texturedScene.edgeScene} />
      <primitive object={texturedScene.rainbowScene} />
      <primitive object={texturedScene.maskedLineArtScene} />
    </group>
  );
}

export function KvSceneSystem(props: KvSceneSystemProps) {
  if (props.renderMode === "edge-overlay") {
    return <CenterHeroModel {...props} />;
  }

  return (
    <>
      <CurvedMediaWall
        sceneState={props.sceneState}
        wallTexturePath={props.wallTexturePath}
        layerDebugRef={props.layerDebugRef}
      />
      <WallWordSweep {...props} />
      <WorksCardPair
        sceneState={props.sceneState}
        worksCardItems={props.worksCardItems}
        cardDebugMode={props.cardDebugMode}
        reducedMotion={props.reducedMotion}
        worksWordHandoff={props.worksWordHandoff}
        layerDebugRef={props.layerDebugRef}
      />
      <MoonflowTitle {...props} />
      <CenterHeroModel {...props} />
    </>
  );
}
