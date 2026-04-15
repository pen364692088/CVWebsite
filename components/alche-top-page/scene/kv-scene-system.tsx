"use client";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Text, configureTextBuilder } from "troika-three-text";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { ALCHE_HERO_LOCK, ALCHE_HERO_SHOTS } from "@/lib/alche-hero-lock";
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
import {
  createCurvedGridMaterial,
  createEmissiveWordMaterial,
  createPrismEdgeColor,
  createPrismMaterial,
} from "@/components/alche-top-page/scene/alche-top-page-materials";
import { createBentCardGeometry, placeOnArc } from "@/components/alche-top-page/scene/bent-card-helpers";
import { WordSegments, createPrismAShape, warpPrismGeometry } from "@/components/alche-top-page/scene/scene-helpers";
import { assetPath } from "@/lib/site";

configureTextBuilder({ useWorker: false });

interface KvSceneSystemProps {
  sceneState: AlcheTopSceneState;
  reducedMotion: boolean;
  backgroundOnly?: boolean;
  wallTexturePath: string;
  worksCardItems: readonly { title: string; imageSrc: string }[];
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
  xOffset: number;
  yOffset: number;
  depthOffset: number;
  scale: number;
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
    xOffset: THREE.MathUtils.lerp(from.xOffset, to.xOffset, mix),
    yOffset: THREE.MathUtils.lerp(from.yOffset, to.yOffset, mix),
    depthOffset: THREE.MathUtils.lerp(from.depthOffset, to.depthOffset, mix),
    scale: THREE.MathUtils.lerp(from.scale, to.scale, mix),
  };
}

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

function FloatingAlcheWordmark({ sceneState, reducedMotion }: KvSceneSystemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const material = useMemo(() => {
    const created = createEmissiveWordMaterial("#ffffff");
    created.opacity = 0;
    created.emissiveIntensity = 0;
    return created;
  }, []);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const visibility = sceneState.kv.wordVisibility * sceneState.kv.visible;
    const pointer = reducedMotion ? 0 : state.pointer.x * 0.08;

    groupRef.current.visible = visibility > 0.001;
    if (!groupRef.current.visible) {
      material.opacity = 0;
      material.emissiveIntensity = 0;
      return;
    }

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, pointer, 2.8, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(
      groupRef.current.position.y,
      -0.12 + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.22) * 0.03) * visibility,
      2.8,
      delta,
    );
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, -3.06, 3, delta);
    groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, 1.32 + visibility * 0.05, 3, delta));
    material.opacity = THREE.MathUtils.damp(material.opacity, visibility, 4, delta);
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 2.2 + visibility * 5.2, 4, delta);
  });

  return (
    <group ref={groupRef} position={[0, -0.12, -3.06]} scale={1.32} visible={false}>
      <WordSegments word="ALCHE" material={material} scale={1.18} depth={0.045} />
    </group>
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
  reducedMotion,
  layerDebugRef,
}: Pick<KvSceneSystemProps, "sceneState" | "worksCardItems" | "reducedMotion" | "layerDebugRef">) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const texturePaths = useMemo(() => worksCardItems.map((item) => assetPath(item.imageSrc)), [worksCardItems]);
  const textures = useLoader(THREE.TextureLoader, texturePaths);
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
  const entryRightLowerPose = ALCHE_TOP_WORKS_CARDS.entryRightLower;
  const leadCenterPose = ALCHE_TOP_WORKS_CARDS.leadCenter;
  const queueRightLowerPose = ALCHE_TOP_WORKS_CARDS.queueRightLower;
  const supportLeftUpperPose = ALCHE_TOP_WORKS_CARDS.supportLeftUpper;
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
  const materials = useMemo(
    () =>
      textures.map(
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
    [textures],
  );

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.needsUpdate = true;
    });

    return () => {
      geometry.dispose();
      materials.forEach((material) => material.dispose());
    };
  }, [geometry, materials, textures]);

  useFrame((state, delta) => {
    if (!groupRef.current || !leftRef.current || !rightRef.current || materials.length < 2) return;

    const cardsVisible = sceneState.activeSection === "works_cards";
    const progress = sceneState.sectionProgress;
    const aEntryMoveMix =
      cardsVisible ? smoothstep(remapRange(progress, 0, ALCHE_TOP_WORKS_CARDS.aEntryMoveEnd)) : 0;
    const bQueueMix =
      cardsVisible ? smoothstep(remapRange(progress, ALCHE_TOP_WORKS_CARDS.aEntryEnd, ALCHE_TOP_WORKS_CARDS.bQueueEnd)) : 0;
    const handoffMix =
      cardsVisible ? smoothstep(remapRange(progress, ALCHE_TOP_WORKS_CARDS.bQueueEnd, ALCHE_TOP_WORKS_CARDS.handoffEnd)) : 0;
    const card0Visible = cardsVisible;
    const card1Visible = cardsVisible && progress >= ALCHE_TOP_WORKS_CARDS.aEntryEnd;
    const leadIndex = !cardsVisible
      ? null
      : progress < ALCHE_TOP_WORKS_CARDS.bQueueEnd
        ? 0
        : handoffMix >= 0.5
          ? 1
          : 0;
    const supportIndex = !card1Visible || leadIndex === null ? null : leadIndex === 0 ? 1 : 0;
    const card0Pose =
      progress < ALCHE_TOP_WORKS_CARDS.aEntryMoveEnd
        ? lerpWorksCardPose(entryRightLowerPose, leadCenterPose, aEntryMoveMix)
        : progress < ALCHE_TOP_WORKS_CARDS.bQueueEnd
          ? leadCenterPose
          : progress < ALCHE_TOP_WORKS_CARDS.handoffEnd
            ? lerpWorksCardPose(leadCenterPose, supportLeftUpperPose, handoffMix)
            : supportLeftUpperPose;
    const card1Pose =
      progress < ALCHE_TOP_WORKS_CARDS.aEntryEnd
        ? entryRightLowerPose
        : progress < ALCHE_TOP_WORKS_CARDS.bQueueEnd
          ? lerpWorksCardPose(entryRightLowerPose, queueRightLowerPose, bQueueMix)
          : progress < ALCHE_TOP_WORKS_CARDS.handoffEnd
            ? lerpWorksCardPose(queueRightLowerPose, leadCenterPose, handoffMix)
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
    const card0Float = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.48) * 0.012;
    const card1Float = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.34 + 1.4) * 0.008;

    placeOnArc(leftRef.current, card0Pose.angle, ALCHE_TOP_WORKS_CARDS.trackRadius, card0Pose.yOffset);
    leftRef.current.position.x += card0Pose.xOffset;
    leftRef.current.position.z += ALCHE_TOP_WORKS_CARDS.frontOffsetZ + card0Pose.depthOffset;
    leftRef.current.position.y = THREE.MathUtils.damp(leftRef.current.position.y, card0Pose.yOffset + card0Float, 4.2, delta);
    leftRef.current.scale.setScalar(THREE.MathUtils.damp(leftRef.current.scale.x, card0Pose.scale, 4.2, delta));

    placeOnArc(rightRef.current, card1Pose.angle, ALCHE_TOP_WORKS_CARDS.trackRadius, card1Pose.yOffset);
    rightRef.current.position.x += card1Pose.xOffset;
    rightRef.current.position.z += ALCHE_TOP_WORKS_CARDS.frontOffsetZ + card1Pose.depthOffset;
    rightRef.current.position.y = THREE.MathUtils.damp(rightRef.current.position.y, card1Pose.yOffset + card1Float, 4.2, delta);
    rightRef.current.scale.setScalar(THREE.MathUtils.damp(rightRef.current.scale.x, card1Pose.scale, 4.2, delta));

    materials[0].opacity = card0Visible ? 1 : 0;
    materials[1].opacity = card1Visible ? 1 : 0;

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
      mesh.material = new THREE.MeshStandardMaterial({
        color: "#fff8f8",
        emissive: "#8f1228",
        emissiveIntensity: 0.28,
        roughness: 0.68,
        metalness: 0.04,
        map,
        side: THREE.DoubleSide,
      });
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

    return { scene: cloned, map };
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

    const visibility =
      sceneState.activeSection === "works_intro" || sceneState.activeSection === "works"
        ? sceneState.kv.visible
        : sceneState.kv.wordVisibility * sceneState.kv.visible;
    const pointerYaw = 0;
    const pointerPitch = 0;
    if (pointerDebugRef) {
      pointerDebugRef.current.r3fPointerX = state.pointer.x;
      pointerDebugRef.current.r3fPointerY = state.pointer.y;
    }
    groupRef.current.visible = visibility > 0.001;
    if (!groupRef.current.visible) {
      if (pointerDebugRef) {
        pointerDebugRef.current.modelRotationX = groupRef.current.rotation.x;
        pointerDebugRef.current.modelRotationY = groupRef.current.rotation.y;
        pointerDebugRef.current.modelRotationZ = groupRef.current.rotation.z;
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
      ALCHE_TOP_CENTER_MODEL.baseRotationX + pointerPitch,
      ALCHE_TOP_CENTER_MODEL.rotationDamp,
      delta,
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      ALCHE_TOP_CENTER_MODEL.baseRotationY + pointerYaw,
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

function HeroPrism({ sceneState, reducedMotion }: KvSceneSystemProps) {
  const { size } = useThree();
  const prismRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.ShaderMaterial>>(null);
  const shellRef = useRef<THREE.Mesh<THREE.ExtrudeGeometry, THREE.ShaderMaterial>>(null);
  const edgeRef = useRef<THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>>(null);
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
  const coreMaterial = useMemo(() => createPrismMaterial("core"), []);
  const shellMaterial = useMemo(() => createPrismMaterial("shell"), []);
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetRotation = useMemo(() => new THREE.Euler(), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      edgesGeometry.dispose();
      coreMaterial.dispose();
      shellMaterial.dispose();
    };
  }, [coreMaterial, edgesGeometry, geometry, shellMaterial]);

  useFrame((state, delta) => {
    const heroShot = sceneState.heroShotId ? ALCHE_HERO_SHOTS[sceneState.heroShotId] : null;
    const pointerYaw = reducedMotion || sceneState.heroShotId ? 0 : state.pointer.x * 0.22;
    const pointerPitch = reducedMotion || sceneState.heroShotId ? 0 : state.pointer.y * 0.08;
    const floatY = reducedMotion || sceneState.heroShotId ? 0 : Math.sin(state.clock.elapsedTime * 0.62) * 0.04;

    const lockPosition = ALCHE_HERO_LOCK.prism.position;
    const lockRotation = ALCHE_HERO_LOCK.prism.rotation;

    const introHandoff = sceneState.worksIntro.handoffMix;
    const missionFade = Math.max(sceneState.missionIn.whiteMix, sceneState.mission.emblemMix);
    const residualVisibility = sceneState.kv.prismVisibility * sceneState.kv.visible;
    const worksIntroResidualFade =
      sceneState.activeSection === "works_intro" ? 1 - THREE.MathUtils.smoothstep(introHandoff, 0.12, 0.78) * 0.82 : 1;

    if (sceneState.activeSection === "kv" || sceneState.activeSection === "loading" || sceneState.activeSection === "works_intro") {
      targetPosition.set(
        lockPosition[0] + (heroShot?.prismEmphasis.positionOffset[0] ?? 0) + introHandoff * 0.54,
        lockPosition[1] + floatY + (heroShot?.prismEmphasis.positionOffset[1] ?? 0) - introHandoff * 0.06,
        lockPosition[2] + (heroShot?.prismEmphasis.positionOffset[2] ?? 0) - introHandoff * 1.02,
      );
      targetRotation.set(
        lockRotation[0] + pointerPitch + (heroShot?.prismEmphasis.rotationOffset[0] ?? 0),
        lockRotation[1] + pointerYaw + (heroShot?.prismEmphasis.rotationOffset[1] ?? 0) - introHandoff * 0.5,
        lockRotation[2] + (heroShot?.prismEmphasis.rotationOffset[2] ?? 0),
      );
    } else if (sceneState.activeSection === "works" || sceneState.activeSection === "works_outro") {
      targetPosition.set(0.54, -0.06 + floatY, -1.46);
      targetRotation.set(0.1, 0.18, 0);
    } else if (sceneState.activeSection === "mission_in") {
      targetPosition.set(0.06, 0.02, -1.14);
      targetRotation.set(0.02, 0.0, 0.0);
    } else {
      targetPosition.set(0.08, 0.02, -1.42);
      targetRotation.set(0, -1.08, 0);
    }

    const targetScale =
      sceneState.activeSection === "kv" || sceneState.activeSection === "loading"
        ? sceneState.kv.prismScale
        : sceneState.activeSection === "works_intro"
          ? THREE.MathUtils.lerp(sceneState.kv.prismScale, 0.22, THREE.MathUtils.smoothstep(introHandoff, 0.16, 0.86))
          : sceneState.activeSection === "works"
            ? 0.28 - sceneState.works.cardMix * 0.08
            : sceneState.activeSection === "works_outro"
              ? 0.14 - sceneState.worksOutro.clearMix * 0.08
              : 0.3 - missionFade * 0.18;

    const whiteMix = clamp01(sceneState.missionIn.whiteMix + sceneState.mission.whiteMix * 0.86 + sceneState.vision.lineMix * 0.4);
    const coreOpacityTarget = residualVisibility * (sceneState.activeSection === "mission_in" ? 1 - missionFade : worksIntroResidualFade);
    const shellOpacityTarget = coreOpacityTarget * (sceneState.activeSection === "works_intro" ? 0.24 : 0.34);
    const edgeOpacityTarget =
      sceneState.activeSection === "mission_in"
        ? 0.42 * (1 - sceneState.missionIn.emblemMix)
        : coreOpacityTarget * (sceneState.activeSection === "works_intro" ? 0.28 : 0.54);

    coreMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    coreMaterial.uniforms.uIntro.value = sceneState.introProgress;
    coreMaterial.uniforms.uResolution.value.set(size.width, size.height);
    coreMaterial.uniforms.uWhiteMix.value = THREE.MathUtils.damp(coreMaterial.uniforms.uWhiteMix.value, whiteMix, 3.8, delta);
    coreMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(coreMaterial.uniforms.uIntensity.value, sceneState.activeSection === "kv" ? 1.18 : 0.96, 4, delta);
    coreMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(coreMaterial.uniforms.uOpacity.value, coreOpacityTarget * 0.76, 4, delta);

    shellMaterial.uniforms.uTime.value = state.clock.elapsedTime + 0.72;
    shellMaterial.uniforms.uIntro.value = sceneState.introProgress * 0.96;
    shellMaterial.uniforms.uResolution.value.set(size.width, size.height);
    shellMaterial.uniforms.uWhiteMix.value = coreMaterial.uniforms.uWhiteMix.value;
    shellMaterial.uniforms.uIntensity.value = THREE.MathUtils.damp(shellMaterial.uniforms.uIntensity.value, 0.48, 4, delta);
    shellMaterial.uniforms.uOpacity.value = THREE.MathUtils.damp(shellMaterial.uniforms.uOpacity.value, shellOpacityTarget, 4, delta);

    if (prismRef.current) {
      prismRef.current.position.x = THREE.MathUtils.damp(prismRef.current.position.x, targetPosition.x, 4, delta);
      prismRef.current.position.y = THREE.MathUtils.damp(prismRef.current.position.y, targetPosition.y, 4, delta);
      prismRef.current.position.z = THREE.MathUtils.damp(prismRef.current.position.z, targetPosition.z, 4, delta);
      prismRef.current.rotation.x = THREE.MathUtils.damp(prismRef.current.rotation.x, targetRotation.x, 4, delta);
      prismRef.current.rotation.y = THREE.MathUtils.damp(prismRef.current.rotation.y, targetRotation.y, 4, delta);
      prismRef.current.rotation.z = THREE.MathUtils.damp(prismRef.current.rotation.z, targetRotation.z, 4, delta);
      prismRef.current.scale.setScalar(THREE.MathUtils.damp(prismRef.current.scale.x, targetScale, 4.2, delta));
    }

    if (shellRef.current && prismRef.current) {
      shellRef.current.position.copy(prismRef.current.position);
      shellRef.current.rotation.copy(prismRef.current.rotation);
      shellRef.current.scale.setScalar(prismRef.current.scale.x * 1.026);
    }

    if (edgeRef.current && prismRef.current) {
      edgeRef.current.position.copy(prismRef.current.position);
      edgeRef.current.rotation.copy(prismRef.current.rotation);
      edgeRef.current.scale.setScalar(prismRef.current.scale.x * 1.003);
      edgeRef.current.material.color.copy(createPrismEdgeColor(state.clock.elapsedTime * 0.06, coreMaterial.uniforms.uWhiteMix.value));
      edgeRef.current.material.opacity = THREE.MathUtils.damp(edgeRef.current.material.opacity, edgeOpacityTarget * 0.82, 4, delta);
    }
  });

  return (
    <>
      <mesh ref={shellRef} geometry={geometry}>
        <primitive object={shellMaterial} attach="material" />
      </mesh>

      <mesh ref={prismRef} geometry={geometry}>
        <primitive object={coreMaterial} attach="material" />
      </mesh>

      <lineSegments ref={edgeRef} geometry={edgesGeometry}>
        <lineBasicMaterial color="#d8e4ff" transparent opacity={0.68} />
      </lineSegments>
    </>
  );
}

export function KvSceneSystem({ backgroundOnly = false, ...props }: KvSceneSystemProps) {
  return (
    <>
      <CurvedMediaWall
        sceneState={props.sceneState}
        wallTexturePath={props.wallTexturePath}
        layerDebugRef={props.layerDebugRef}
      />
      {backgroundOnly ? <WallWordSweep {...props} /> : null}
      {backgroundOnly ? (
        <WorksCardPair
          sceneState={props.sceneState}
          worksCardItems={props.worksCardItems}
          reducedMotion={props.reducedMotion}
          layerDebugRef={props.layerDebugRef}
        />
      ) : null}
      {backgroundOnly ? <MoonflowTitle {...props} /> : null}
      {backgroundOnly ? <CenterHeroModel {...props} /> : null}
      {backgroundOnly ? null : <FloatingAlcheWordmark {...props} />}
      {backgroundOnly ? null : <HeroPrism {...props} />}
    </>
  );
}
