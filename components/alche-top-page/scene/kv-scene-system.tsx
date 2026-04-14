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

  useFrame((_, delta) => {
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

  useFrame((_, delta) => {
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
  layerDebugRef,
}: Pick<KvSceneSystemProps, "sceneState" | "worksCardItems" | "layerDebugRef">) {
  const groupRef = useRef<THREE.Group>(null);
  const leftRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>>(null);
  const rightRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>>(null);
  const texturePaths = useMemo(() => worksCardItems.map((item) => assetPath(item.imageSrc)), [worksCardItems]);
  const textures = useLoader(THREE.TextureLoader, texturePaths);
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

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return;

    placeOnArc(leftRef.current, ALCHE_TOP_WORKS_CARDS.leadAngle, ALCHE_TOP_WORKS_CARDS.trackRadius);
    leftRef.current.scale.setScalar(ALCHE_TOP_WORKS_CARDS.leadScale);
    placeOnArc(rightRef.current, ALCHE_TOP_WORKS_CARDS.supportAngle, ALCHE_TOP_WORKS_CARDS.trackRadius);
    rightRef.current.scale.setScalar(ALCHE_TOP_WORKS_CARDS.supportScale);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || !leftRef.current || !rightRef.current) return;

    const isCardsStage = sceneState.activeSection === "works_cards";
    const enterMix = isCardsStage
      ? smoothstep(remapRange(sceneState.sectionProgress, ALCHE_TOP_WORKS_CARDS.enterStart, ALCHE_TOP_WORKS_CARDS.enterEnd))
      : 0;

    groupRef.current.visible = enterMix > 0.001;
    materials.forEach((material) => {
      material.opacity = THREE.MathUtils.damp(material.opacity, enterMix, 5.2, delta);
    });
    leftRef.current.scale.setScalar(
      THREE.MathUtils.damp(leftRef.current.scale.x, ALCHE_TOP_WORKS_CARDS.leadScale * (0.96 + enterMix * 0.04), 4.2, delta),
    );
    rightRef.current.scale.setScalar(
      THREE.MathUtils.damp(rightRef.current.scale.x, ALCHE_TOP_WORKS_CARDS.supportScale * (0.96 + enterMix * 0.04), 4.2, delta),
    );

    if (layerDebugRef) {
      layerDebugRef.current.cardsOpacity = Math.max(...materials.map((material) => material.opacity));
      layerDebugRef.current.cardsSupportWorldZ = leftRef.current.getWorldPosition(new THREE.Vector3()).z;
      layerDebugRef.current.cardsLeadWorldZ = rightRef.current.getWorldPosition(new THREE.Vector3()).z;
    }
  });

  return (
    <group ref={groupRef} position={[0, ALCHE_TOP_WORKS_CARDS.groupY, ALCHE_TOP_WORKS_CARDS.groupZ]} visible={false}>
      <mesh ref={leftRef} geometry={geometry} material={materials[0]} />
      <mesh ref={rightRef} geometry={geometry} material={materials[1]} />
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
          return;
        }
        mesh.material.dispose();
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
      {backgroundOnly ? <WorksCardPair sceneState={props.sceneState} worksCardItems={props.worksCardItems} layerDebugRef={props.layerDebugRef} /> : null}
      {backgroundOnly ? <MoonflowTitle {...props} /> : null}
      {backgroundOnly ? <CenterHeroModel {...props} /> : null}
      {backgroundOnly ? null : <FloatingAlcheWordmark {...props} />}
      {backgroundOnly ? null : <HeroPrism {...props} />}
    </>
  );
}
