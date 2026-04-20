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
import { createCurvedGridMaterial } from "@/components/alche-top-page/scene/alche-top-page-materials";
import { createBentCardGeometry, placeOnArc } from "@/components/alche-top-page/scene/bent-card-helpers";
import { assetPath } from "@/lib/site";

configureTextBuilder({ useWorker: false });

interface KvSceneSystemProps {
  sceneState: AlcheTopSceneState;
  reducedMotion: boolean;
  wallTexturePath: string;
  worksCardItems: readonly { title: string; imageSrc: string }[];
  cardDebugMode: AlcheWorksCardDebugMode;
  worksWordHandoff: number;
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

const entryRightLowerPose = getAlcheWorksCardPoseDefinition("entry-right-lower");
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

const ALCHE_TOP_WALL_CULL_SAFE_THRESHOLD = 0.72;

function CurvedMediaWall({ sceneState, wallTexturePath, layerDebugRef }: CurvedMediaWallProps) {
  const roomRef = useRef<THREE.Mesh<THREE.CylinderGeometry, THREE.ShaderMaterial>>(null);
  const wallTexture = useLoader(THREE.TextureLoader, wallTexturePath);
  const material = useMemo(() => createCurvedGridMaterial(wallTexture), [wallTexture]);
  const effectiveRadius = ALCHE_TOP_MEDIA_WALL.radius / ALCHE_TOP_KV_WALL_ARC_STRENGTH;
  const geometry = useMemo(
    () =>
      new THREE.CylinderGeometry(
        effectiveRadius,
        effectiveRadius,
        ALCHE_TOP_MEDIA_WALL.height,
        ALCHE_TOP_MEDIA_WALL.radialSegments,
        ALCHE_TOP_MEDIA_WALL.heightSegments,
        true,
      ),
    [effectiveRadius],
  );

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
    material.uniforms.uViewportPx.value.set(state.size.width, state.size.height);
    const nextSide = material.uniforms.uFlatten.value >= ALCHE_TOP_WALL_CULL_SAFE_THRESHOLD ? THREE.DoubleSide : THREE.BackSide;
    if (material.side !== nextSide) {
      material.side = nextSide;
      material.needsUpdate = true;
    }
    if (layerDebugRef) {
      const worldPosition = roomRef.current.getWorldPosition(new THREE.Vector3());
      layerDebugRef.current.wallWorldZ = worldPosition.z;
      layerDebugRef.current.wallRotationY = roomRef.current.rotation.y;
    }
  });

  return (
    <mesh ref={roomRef} geometry={geometry} position={[0, 0, ALCHE_TOP_MEDIA_WALL.worldZ]}>
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
    () => new THREE.Vector3(0, ALCHE_TOP_MOONFLOW.y, -effectiveRadius * ALCHE_TOP_MOONFLOW.depthMix),
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
    const entryMix = smoothstep(clamp01(segment.phase === "entry" ? segment.mix : 1));
    const queueMix = smoothstep(clamp01(segment.phase === "queue" ? segment.mix : segment.phase === "handoff" || segment.phase === "settled" ? 1 : 0));
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
    const card0Visible = cardsVisible;
    const card1Visible =
      inWorksOutro
        ? cardsVisible && outroMix < 0.985
        : cardsSequenceVisible &&
          (segment.phase === "handoff" || segment.phase === "settled" || (segment.phase === "queue" && queueMix >= 0.18));
    const leadIndex = !cardsVisible ? null : inWorksOutro ? 1 : segment.phase === "entry" || segment.phase === "queue" ? 0 : handoffMix >= 0.5 ? 1 : 0;
    const supportIndex = !card1Visible || leadIndex === null ? null : leadIndex === 0 ? 1 : 0;
    const card0Pose =
      inWorksOutro
        ? compensatedSupportLeftUpperPose
        : segment.phase === "entry"
          ? lerpWorksCardPose(entryRightLowerPose, leadCenterPose, entryMix)
          : segment.phase === "queue"
            ? leadCenterPose
          : segment.phase === "handoff"
              ? lerpWorksCardPose(leadCenterPose, compensatedSupportLeftUpperPose, handoffMix)
              : compensatedSupportLeftUpperPose;
    const card1Pose =
      inWorksOutro
        ? lerpWorksCardPose(leadCenterPose, compensatedWorksOutroLeftClearPose, outroMix)
        : segment.phase === "entry"
          ? compensatedQueueRightLowerOffscreenPose
          : segment.phase === "queue"
            ? lerpWorksCardPose(compensatedQueueRightLowerOffscreenPose, compensatedQueueRightLowerPose, queueMix)
            : segment.phase === "handoff"
              ? lerpWorksCardPose(compensatedQueueRightLowerPose, leadCenterPose, handoffMix)
              : leadCenterPose;

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
  reducedMotion: _reducedMotion,
  wallTexturePath,
  pointerOverride: _pointerOverride,
  pointerDebugRef,
  layerDebugRef,
}: Pick<KvSceneSystemProps, "sceneState" | "reducedMotion" | "wallTexturePath" | "pointerOverride" | "pointerDebugRef" | "layerDebugRef">) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, assetPath(ALCHE_TOP_CENTER_MODEL.path));
  const baseTexture = useLoader(THREE.TextureLoader, wallTexturePath);
  const effectiveRadius = ALCHE_TOP_MEDIA_WALL.radius / ALCHE_TOP_KV_WALL_ARC_STRENGTH;
  const targetPosition = useMemo(
    () => new THREE.Vector3(0, ALCHE_TOP_CENTER_MODEL.y, -effectiveRadius * ALCHE_TOP_MOONFLOW.depthMix + ALCHE_TOP_CENTER_MODEL.depthOffset),
    [effectiveRadius],
  );
  const texturedScene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    const map = baseTexture.clone();
    const materials: THREE.MeshStandardMaterial[] = [];
    map.colorSpace = THREE.SRGBColorSpace;
    map.flipY = false;
    map.wrapS = THREE.ClampToEdgeWrapping;
    map.wrapT = THREE.ClampToEdgeWrapping;
    map.minFilter = THREE.LinearFilter;
    map.magFilter = THREE.LinearFilter;
    map.generateMipmaps = false;
    map.needsUpdate = true;

    cloned.traverse((child) => {
      if (!("isMesh" in child) || child.isMesh !== true) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.renderOrder = 4;
      const material = new THREE.MeshStandardMaterial({
        color: "#fff8f8",
        emissive: "#8f1228",
        emissiveIntensity: 0,
        roughness: 0.68,
        metalness: 0.04,
        map,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      });
      mesh.material = material;
      materials.push(material);
    });

    const bounds = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    bounds.getSize(size);
    const modelHeight = Math.max(size.y, 0.0001);
    const scale = ALCHE_TOP_CENTER_MODEL.targetHeight / modelHeight;
    cloned.scale.setScalar(scale);
    bounds.setFromObject(cloned);
    const center = bounds.getCenter(new THREE.Vector3());
    cloned.position.sub(center);

    return { scene: cloned, map, materials };
  }, [baseTexture, gltf.scene]);

  useEffect(() => {
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
      texturedScene.map.dispose();
      texturedScene.scene.traverse((child) => {
        if (!("isMesh" in child) || child.isMesh !== true) return;
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => material.dispose());
        } else {
          mesh.material.dispose();
        }
        mesh.geometry.dispose();
      });
    };
  }, [texturedScene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const missionPanelProgress =
      sceneState.activeSection === "works_outro"
        ? sceneState.worksOutro.clearMix * 0.42
        : sceneState.activeSection === "mission_in"
          ? 0.42 + sceneState.missionIn.flattenMix * 0.58
          : 0;
    const missionOcclusionFade =
      sceneState.activeSection === "mission_in" ? smoothstep(remapRange(missionPanelProgress, 0.8, 0.98)) : 0;
    const visibility =
      sceneState.activeSection === "works_intro" || sceneState.activeSection === "works" || sceneState.activeSection === "works_outro"
        ? sceneState.kv.visible
        : sceneState.activeSection === "mission_in"
          ? sceneState.kv.prismVisibility * sceneState.kv.visible * (1 - missionOcclusionFade)
          : sceneState.kv.prismVisibility * sceneState.kv.visible;

    if (pointerDebugRef) {
      pointerDebugRef.current.r3fPointerX = state.pointer.x;
      pointerDebugRef.current.r3fPointerY = state.pointer.y;
    }

    texturedScene.materials.forEach((material) => {
      material.opacity = THREE.MathUtils.damp(material.opacity, visibility, 4, delta);
      material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 0.28 * visibility, 4, delta);
    });

    groupRef.current.visible = visibility > 0.001 || texturedScene.materials.some((material) => material.opacity > 0.001);
    if (!groupRef.current.visible) {
      if (pointerDebugRef) {
        pointerDebugRef.current.modelRotationX = groupRef.current.rotation.x;
        pointerDebugRef.current.modelRotationY = groupRef.current.rotation.y;
        pointerDebugRef.current.modelRotationZ = groupRef.current.rotation.z;
      }
      if (layerDebugRef) {
        layerDebugRef.current.modelWorldZ = null;
        layerDebugRef.current.modelScale = null;
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
      ALCHE_TOP_CENTER_MODEL.baseRotationX,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      ALCHE_TOP_CENTER_MODEL.baseRotationY,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      ALCHE_TOP_CENTER_MODEL.baseRotationZ,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    if (pointerDebugRef) {
      pointerDebugRef.current.modelRotationX = groupRef.current.rotation.x;
      pointerDebugRef.current.modelRotationY = groupRef.current.rotation.y;
      pointerDebugRef.current.modelRotationZ = groupRef.current.rotation.z;
    }
    if (layerDebugRef) {
      const worldPosition = groupRef.current.getWorldPosition(new THREE.Vector3());
      layerDebugRef.current.modelWorldZ = worldPosition.z;
      layerDebugRef.current.modelScale = groupRef.current.scale.x;
    }
  });

  return <primitive ref={groupRef} object={texturedScene.scene} visible={false} />;
}

export function KvSceneSystem(props: KvSceneSystemProps) {
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
