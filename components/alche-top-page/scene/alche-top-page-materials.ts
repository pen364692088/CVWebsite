"use client";

import * as THREE from "three";

import { ALCHE_TOP_MEDIA_WALL, ALCHE_TOP_WALL_TILE_DENSITY } from "@/lib/alche-top-page";

const ALCHE_TOP_WALL_CURVED_GRID_DENSITY_SCALE = 1.45;
const ALCHE_TOP_WALL_CURVE_DEPTH_SCALE = 1.70352;

export interface MaskedPrismLineArtUniforms {
  uOpacity: { value: number };
}

export interface PrismSideRainbowUniforms {
  uTime: { value: number };
  uOpacity: { value: number };
  uRainbowMix: { value: number };
  uBlackMix: { value: number };
  uTargetFaceNormal: { value: THREE.Vector3 };
}

export interface PrismIceUniforms {
  uSceneTexture: { value: THREE.Texture | null };
  uViewportPx: { value: THREE.Vector2 };
  uMaskBoundary: { value: number };
  uClipMode: { value: number };
  uRefractionStrength: { value: number };
  uLensWarpStrength: { value: number };
  uChromaticStrength: { value: number };
  uSceneRefractionMix: { value: number };
}

function spectralPalette(t: number) {
  const a = new THREE.Color("#89f2ff");
  const b = new THREE.Color("#f8fbff");
  const c = new THREE.Color("#ffd9f4");
  const d = new THREE.Color("#fff0cb");

  if (t < 0.33) return a.clone().lerp(b, t / 0.33);
  if (t < 0.66) return b.clone().lerp(c, (t - 0.33) / 0.33);
  return c.clone().lerp(d, (t - 0.66) / 0.34);
}

export function createPrismIceMaterial(map: THREE.Texture, uniforms: PrismIceUniforms) {
  const material = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    emissive: "#f4fbff",
    emissiveIntensity: 0,
    roughness: 0.18,
    metalness: 0.02,
    map,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uViewportPx = uniforms.uViewportPx;
    shader.uniforms.uMaskBoundary = uniforms.uMaskBoundary;
    shader.uniforms.uClipMode = uniforms.uClipMode;
    shader.uniforms.uSceneTexture = uniforms.uSceneTexture;
    shader.uniforms.uRefractionStrength = uniforms.uRefractionStrength;
    shader.uniforms.uLensWarpStrength = uniforms.uLensWarpStrength;
    shader.uniforms.uChromaticStrength = uniforms.uChromaticStrength;
    shader.uniforms.uSceneRefractionMix = uniforms.uSceneRefractionMix;
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "void main() {",
        `
          uniform sampler2D uSceneTexture;
          uniform vec2 uViewportPx;
          uniform float uMaskBoundary;
          uniform float uClipMode;
          uniform float uRefractionStrength;
          uniform float uLensWarpStrength;
          uniform float uChromaticStrength;
          uniform float uSceneRefractionMix;

          float alcheIceHash(vec2 p) {
            p = fract(p * vec2(123.34, 345.45));
            p += dot(p, p + 34.345);
            return fract(p.x * p.y);
          }

          float alcheIceNoise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = alcheIceHash(i);
            float b = alcheIceHash(i + vec2(1.0, 0.0));
            float c = alcheIceHash(i + vec2(0.0, 1.0));
            float d = alcheIceHash(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }

          float alcheIceFbm(vec2 p) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int i = 0; i < 4; i++) {
              value += alcheIceNoise(p) * amplitude;
              p = p * 2.07 + vec2(7.13, 3.71);
              amplitude *= 0.5;
            }
            return value;
          }

          void main() {
            float screenY = gl_FragCoord.y / max(uViewportPx.y, 1.0);
            float epsilon = 0.75 / max(uViewportPx.y, 1.0);
            if (uClipMode < 0.5) {
              if (screenY < uMaskBoundary - epsilon) discard;
            } else {
              if (screenY >= uMaskBoundary - epsilon) discard;
            }
        `,
      )
      .replace(
        "#include <dithering_fragment>",
        `
          float iceFresnel = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 1.65);
          float iceBaseAlpha = gl_FragColor.a;
          #ifdef USE_MAP
            vec2 iceUv = vMapUv;
            float grainNoise = alcheIceNoise(iceUv * 124.0 + vec2(3.7, 8.2));
            float broadNoise = alcheIceFbm(iceUv * 7.0 + vec2(2.1, 6.4));
            vec2 noiseWarp = vec2(
              alcheIceFbm(iceUv * 5.2 + vec2(11.0, 17.0)),
              alcheIceFbm(iceUv * 5.8 + vec2(29.0, 5.0))
            ) - 0.5;
            vec2 paneUv = iceUv - 0.5;
            float roundedBox = pow(abs(paneUv.x), 8.0) + pow(abs(paneUv.y), 8.0);
            float glassBody = clamp((1.0 - roundedBox * 190.0) * 3.0, 0.0, 1.0);
            float glassBorder =
              clamp((0.95 - roundedBox * 178.0) * 8.0, 0.0, 1.0) -
              clamp((0.78 - roundedBox * 178.0) * 8.0, 0.0, 1.0);
            float glassShadow =
              clamp((1.5 - roundedBox * 210.0) * 1.35, 0.0, 1.0) -
              clamp((1.0 - roundedBox * 210.0) * 1.35, 0.0, 1.0);
            float lensStrength = clamp((1.0 - roundedBox * 58.0) * 0.34, -0.36, 0.36);
            vec2 lensUv = clamp((iceUv - 0.5) * (1.0 - lensStrength) + 0.5 + noiseWarp * 0.055, vec2(0.001), vec2(0.999));
            vec2 blurStep = vec2(1.0 / 1024.0);
            vec4 lensMap =
              texture2D(map, lensUv) * 0.4 +
              texture2D(map, clamp(lensUv + vec2(blurStep.x * 7.0, 0.0), vec2(0.001), vec2(0.999))) * 0.15 +
              texture2D(map, clamp(lensUv - vec2(blurStep.x * 7.0, 0.0), vec2(0.001), vec2(0.999))) * 0.15 +
              texture2D(map, clamp(lensUv + vec2(0.0, blurStep.y * 7.0), vec2(0.001), vec2(0.999))) * 0.15 +
              texture2D(map, clamp(lensUv - vec2(0.0, blurStep.y * 7.0), vec2(0.001), vec2(0.999))) * 0.15;
            float iceBand = smoothstep(
              0.76,
              0.985,
              sin((lensUv.y + lensUv.x * 0.34) * 31.0 + sin(lensUv.x * 19.0 + broadNoise * 5.0) * 2.1 + broadNoise * 6.5) * 0.5 + 0.5
            );
            float iceCloud = smoothstep(
              0.48 + broadNoise * 0.1,
              1.0,
              sin((lensUv.x + noiseWarp.x * 0.08) * 12.0 + sin((lensUv.y + noiseWarp.y * 0.08) * 10.0) * 2.8) * sin(lensUv.y * 15.0 + 1.7 + broadNoise * 4.0) * 0.5 + 0.5
            );
            float iceCrack = smoothstep(
              0.965,
              0.998,
              sin((lensUv.x * 1.4 + lensUv.y * 0.92) * 93.0 + sin(lensUv.x * 41.0 + broadNoise * 8.0) * 3.0) * 0.5 + 0.5
            ) * mix(0.45, 1.0, grainNoise);
            float lensTransition = smoothstep(0.0, 1.0, glassBody + glassBorder);
            float refractionCaustic = smoothstep(0.42, 0.95, broadNoise + grainNoise * 0.25) * glassBody;
            vec2 screenUv = clamp(gl_FragCoord.xy / max(uViewportPx, vec2(1.0)), vec2(0.001), vec2(0.999));
            vec2 radialWarp = (paneUv + noiseWarp * 0.08) * (1.35 - roundedBox * 18.0);
            radialWarp = clamp(radialWarp, vec2(-0.82), vec2(0.82));
            vec2 bandWarp = vec2(
              sin((iceUv.y + broadNoise * 0.09) * 18.0 + iceUv.x * 5.5),
              cos((iceUv.x + grainNoise * 0.04) * 11.0 + iceUv.y * 6.2)
            );
            float refractMask = lensTransition * (0.35 + glassBody * 0.65);
            vec2 sceneOffset =
              (radialWarp * uLensWarpStrength * 1.18 + noiseWarp * 0.82 + bandWarp * iceBand * 0.32) *
              uRefractionStrength *
              refractMask;
            vec2 sceneUv = clamp(screenUv + sceneOffset, vec2(0.001), vec2(0.999));
            vec2 nearSceneUv = clamp(screenUv + sceneOffset * 0.42, vec2(0.001), vec2(0.999));
            vec2 chromaOffset = normalize(sceneOffset + vec2(0.0001, -0.0002)) * uChromaticStrength * refractMask;
            float sceneRefractionMix = clamp(uSceneRefractionMix, 0.0, 1.0);
            vec3 sceneColor = lensMap.rgb;
            if (sceneRefractionMix > 0.001) {
              vec3 nearSceneColor = texture2D(uSceneTexture, nearSceneUv).rgb;
              vec3 farSceneColor = vec3(
                texture2D(uSceneTexture, clamp(sceneUv + chromaOffset, vec2(0.001), vec2(0.999))).r,
                texture2D(uSceneTexture, sceneUv).g,
                texture2D(uSceneTexture, clamp(sceneUv - chromaOffset, vec2(0.001), vec2(0.999))).b
              );
              sceneColor = mix(nearSceneColor, farSceneColor, 0.36 + iceBand * 0.16 + glassBorder * 0.12);
            }
            vec3 lensColor = lensMap.rgb;
            lensColor = mix(lensColor, sceneColor, refractMask * 0.96 * sceneRefractionMix);
            lensColor += vec3(0.94, 0.98, 1.0) * glassBody * 0.14;
            lensColor += vec3(0.88, 0.94, 0.98) * glassBorder * 0.42;
            lensColor += vec3(0.28, 0.31, 0.33) * glassShadow * 0.2;
            gl_FragColor.rgb = mix(gl_FragColor.rgb, lensColor, lensTransition * 0.42);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, sceneColor, refractMask * iceBaseAlpha * 1.08 * sceneRefractionMix);
            gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.31, 0.33, 0.34), iceCloud * 0.15);
            gl_FragColor.rgb += vec3(0.94, 0.985, 1.0) * iceBand * 0.34;
            gl_FragColor.rgb += vec3(0.84, 0.91, 0.96) * iceBand * iceFresnel * 0.18;
            gl_FragColor.rgb += vec3(0.86, 0.95, 1.0) * refractionCaustic * iceFresnel * 0.16;
            gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.16, 0.18, 0.2), iceCrack * 0.2);
            gl_FragColor.rgb += (grainNoise - 0.5) * vec3(0.018) * iceBaseAlpha;
            gl_FragColor.a = min(iceBaseAlpha + iceBaseAlpha * (iceCloud * 0.14 + iceBand * 0.18 + glassBorder * 0.25 + refractMask * 0.32), 0.86);
          #endif
          gl_FragColor.rgb += vec3(0.45, 0.55, 0.62) * iceFresnel * 0.16;
          gl_FragColor.rgb += vec3(0.94, 0.98, 1.0) * iceFresnel * 0.24;
          gl_FragColor.a = min(gl_FragColor.a + iceBaseAlpha * iceFresnel * 0.2, 0.86);
          #include <dithering_fragment>
        `,
      );
  };
  material.customProgramCacheKey = () => `alche-prism-ice:${uniforms.uClipMode.value}`;
  material.needsUpdate = true;

  return material;
}

export function createCurvedGridMaterial(_wallTexture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uWhiteMix: { value: 0 },
      uGlow: { value: 0.7 },
      uExposure: { value: 1 },
      uFlatten: { value: 0 },
      uSceneFade: { value: 1 },
      uWallRadius: { value: 5 },
      uWallHalfWidth: { value: 11 },
      uWallHalfHeight: { value: 5.7 },
      uViewportPx: { value: new THREE.Vector2(1, 1) },
    },
    vertexShader: `
      attribute float aWallU;
      attribute float aWallV;

      uniform float uFlatten;
      uniform float uWallRadius;
      uniform float uWallHalfWidth;
      uniform float uWallHalfHeight;

      varying vec2 vMediaUv;

      void main() {
        float safeFlatten = clamp(uFlatten, 0.0, 1.0);
        float flattenMix = smoothstep(0.0, 1.0, safeFlatten);
        float curveMix = 1.0 - flattenMix;
        float radius = max(uWallRadius, 0.001);
        float wallU = aWallU * uWallHalfWidth;
        float wallV = aWallV * uWallHalfHeight;
        float planeZ = mix(radius, -radius, flattenMix);
        float curveDepth = radius * ${ALCHE_TOP_WALL_CURVE_DEPTH_SCALE.toFixed(5)};
        float edgeSag = (1.0 - cos(min(abs(aWallU), 1.0) * 1.5707963)) * curveDepth * curveMix;
        float z = planeZ - curveDepth * curveMix + edgeSag;

        vec3 transformed = vec3(wallU, wallV, z);

        vec4 world = modelMatrix * vec4(transformed, 1.0);
        vMediaUv = vec2(aWallU * 0.5 + 0.5, aWallV * 0.5 + 0.5);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec2 vMediaUv;

      uniform float uTime;
      uniform float uIntro;
      uniform float uWhiteMix;
      uniform float uGlow;
      uniform float uExposure;
      uniform float uFlatten;
      uniform float uSceneFade;
      uniform vec2 uViewportPx;

      float linePulse(float value, float width) {
        float grid = abs(fract(value - 0.5) - 0.5) / fwidth(value);
        return 1.0 - min(grid / width, 1.0);
      }

      void main() {
        vec2 uv = vMediaUv;
        float flattenMix = smoothstep(0.0, 1.0, clamp(uFlatten, 0.0, 1.0));
        float gridDensityScale = mix(${ALCHE_TOP_WALL_CURVED_GRID_DENSITY_SCALE.toFixed(2)}, 1.0, flattenMix);
        vec2 gridUv = (uv - 0.5) * gridDensityScale + 0.5;
        vec2 microGridUv = vec2(
          gridUv.x * ${(ALCHE_TOP_MEDIA_WALL.cellColumns * ALCHE_TOP_WALL_TILE_DENSITY).toFixed(1)},
          gridUv.y * ${(ALCHE_TOP_MEDIA_WALL.cellRows * ALCHE_TOP_WALL_TILE_DENSITY).toFixed(1)}
        );
        vec2 frameGridUv = vec2(
          gridUv.x * ${ALCHE_TOP_MEDIA_WALL.cellColumns.toFixed(1)},
          gridUv.y * ${ALCHE_TOP_MEDIA_WALL.cellRows.toFixed(1)}
        );
        float microV = linePulse(microGridUv.x, 1.05);
        float microH = linePulse(microGridUv.y, 1.05);
        float frameV = linePulse(frameGridUv.x, 1.75);
        float frameH = linePulse(frameGridUv.y, 1.75);
        float microGrid = clamp(microV + microH, 0.0, 1.0);
        float frameGrid = clamp(frameV + frameH, 0.0, 1.0);
        float verticalShade = 1.0 - abs(uv.y - 0.5) * 0.05;
        float introExposure = mix(0.94, 1.0, smoothstep(0.0, 0.92, uIntro));

        vec3 baseColor = vec3(0.972, 0.976, 0.98);
        vec3 microLineColor = vec3(0.82, 0.835, 0.85);
        vec3 frameLineColor = vec3(0.08, 0.085, 0.095);
        vec3 color = mix(baseColor, microLineColor, microGrid * 0.88);
        color = mix(color, frameLineColor, frameGrid * 0.9);
        color *= verticalShade * introExposure * uExposure;
        color = mix(color, vec3(dot(color, vec3(0.3333333))), uWhiteMix * 0.06);
        color *= mix(1.0, 0.992, uFlatten);

        float alpha = 0.995 * uIntro * uSceneFade;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

export function createGalleryPlaneMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uVisibility: { value: 0 },
      uWhiteMix: { value: 0 },
      uIndex: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;

      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;

      uniform float uTime;
      uniform float uVisibility;
      uniform float uWhiteMix;
      uniform float uIndex;

      float linePulse(float value, float width) {
        float grid = abs(fract(value - 0.5) - 0.5) / fwidth(value);
        return 1.0 - min(grid / width, 1.0);
      }

      void main() {
        vec2 uv = vUv;
        vec2 centered = uv - 0.5;
        float frame = smoothstep(0.06, 0.0, min(min(uv.x, uv.y), min(1.0 - uv.x, 1.0 - uv.y)));
        float diagonal = linePulse((uv.x + uv.y * 0.72 + uIndex * 0.17) * 10.0, 1.8) * 0.16;
        float scan = linePulse(uv.y * 38.0 + uTime * 0.2, 2.4) * 0.08;
        float slabA = smoothstep(0.14, 0.145, uv.y) * (1.0 - smoothstep(0.28, 0.285, uv.y));
        float slabB = smoothstep(0.43, 0.435, uv.y) * (1.0 - smoothstep(0.72, 0.725, uv.y));
        float caption = smoothstep(0.79, 0.794, uv.y) * (1.0 - smoothstep(0.9, 0.905, uv.y));
        float rim = smoothstep(0.7, 0.04, abs(centered.x * 0.88 + centered.y * 1.3 - 0.08)) * 0.16;

        vec3 darkBase = vec3(0.052, 0.06, 0.076);
        vec3 lightBase = vec3(0.96, 0.965, 0.975);
        vec3 darkInk = vec3(0.66, 0.76, 0.92);
        vec3 lightInk = vec3(0.14, 0.15, 0.18);
        vec3 base = mix(darkBase, lightBase, uWhiteMix);
        vec3 ink = mix(darkInk, lightInk, uWhiteMix);

        vec3 color = base;
        color += ink * (frame * 0.28 + diagonal * 0.52 + scan * 0.62);
        color += ink * (slabA * 0.08 + slabB * 0.06 + caption * 0.07);
        color += rim * mix(vec3(0.44, 0.68, 0.84), vec3(0.18), uWhiteMix);
        color += mix(vec3(0.06, 0.22, 0.26), vec3(0.05), uWhiteMix) * smoothstep(0.82, 0.06, length(centered * vec2(0.9, 0.72))) * 0.26;

        float alpha = (0.045 + frame * 0.18 + diagonal * 0.12 + slabB * 0.06) * uVisibility;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

export function createMaskedPrismLineArtMaterial(uniforms?: MaskedPrismLineArtUniforms) {
  const sharedUniforms: MaskedPrismLineArtUniforms =
    uniforms ??
    {
      uOpacity: { value: 0 },
    };

  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    uniforms: {
      uOpacity: sharedUniforms.uOpacity,
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vModelPos;
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;

      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vUv = uv;
        vModelPos = position;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        vWorldPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform float uOpacity;

      varying vec2 vUv;
      varying vec3 vModelPos;
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;

      float linePulse(float value, float width) {
        float grid = abs(fract(value - 0.5) - 0.5) / fwidth(value);
        return 1.0 - min(grid / width, 1.0);
      }

      void main() {
        vec2 uv = vUv;
        vec3 normal = normalize(vNormalWorld);
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.25);

        float diagonalA = linePulse((vModelPos.y + vModelPos.x * 0.22 + 1.8) * 2.9, 1.25) * 0.34;
        float diagonalB = linePulse((vModelPos.y - vModelPos.x * 0.38 + 1.25) * 3.3, 1.2) * 0.26;
        float vertical = linePulse((vModelPos.x + 0.72) * 5.2, 1.4) * 0.18;
        float horizontal = linePulse((vModelPos.y + 1.55) * 5.8, 1.45) * 0.14;
        float uvFrame = smoothstep(0.08, 0.0, min(min(uv.x, uv.y), min(1.0 - uv.x, 1.0 - uv.y))) * 0.42;
        float uvDiagonal = linePulse((uv.x + uv.y * 0.82) * 8.5, 1.2) * 0.18;
        float uvCross = linePulse((uv.x - uv.y * 0.94 + 0.18) * 10.0, 1.2) * 0.14;
        float contour = smoothstep(0.16, 0.84, fresnel) * 0.52;

        float lineField = diagonalA + diagonalB + vertical + horizontal + uvFrame + uvDiagonal + uvCross + contour;
        float alpha = clamp(lineField, 0.0, 1.0) * uOpacity;
        vec3 color = vec3(0.58, 0.62, 0.7);

        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

export function createPrismSideRainbowMaterial(uniforms?: PrismSideRainbowUniforms) {
  const sharedUniforms: PrismSideRainbowUniforms =
    uniforms ??
    {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uRainbowMix: { value: 0 },
      uBlackMix: { value: 0 },
      uTargetFaceNormal: { value: new THREE.Vector3(-0.866025, 0.5, 0) },
    };

  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
    uniforms: {
      uTime: sharedUniforms.uTime,
      uOpacity: sharedUniforms.uOpacity,
      uRainbowMix: sharedUniforms.uRainbowMix,
      uBlackMix: sharedUniforms.uBlackMix,
      uTargetFaceNormal: sharedUniforms.uTargetFaceNormal,
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vModelPos;
      varying vec3 vWorldPos;

      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vUv = uv;
        vModelPos = position;
        vWorldPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uOpacity;
      uniform float uRainbowMix;
      uniform float uBlackMix;
      uniform vec3 uTargetFaceNormal;

      varying vec2 vUv;
      varying vec3 vModelPos;
      varying vec3 vWorldPos;

      vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        rgb = rgb * rgb * (3.0 - 2.0 * rgb);
        return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec3 faceNormalModel = normalize(cross(dFdx(vModelPos), dFdy(vModelPos)));
        vec3 targetFaceNormal = normalize(uTargetFaceNormal);
        float faceMask = smoothstep(0.985, 0.9985, dot(faceNormalModel, targetFaceNormal));
        if (faceMask <= 0.0001 || uOpacity <= 0.0001) discard;

        vec3 worldNormal = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - abs(dot(viewDir, worldNormal)), 1.7);

        float flowA = sin(vModelPos.y * 3.2 + vModelPos.x * 1.45 + uTime * 0.78);
        float flowB = sin(vModelPos.x * 4.9 - vModelPos.y * 1.18 - uTime * 0.64);
        float flowC = sin((vModelPos.x + vModelPos.y) * 2.7 + uTime * 0.42);
        float warp = flowA * 0.11 + flowB * 0.09 + flowC * 0.07;
        float hue = fract(
          0.12 +
          vUv.y * 0.18 +
          vModelPos.y * 0.12 +
          vModelPos.x * 0.08 +
          warp +
          uTime * 0.028
        );

        float band = sin((vModelPos.y * 2.2 - vModelPos.x * 1.05) * 2.6 + uTime * 0.9) * 0.5 + 0.5;
        float grain = hash21(gl_FragCoord.xy * 0.91 + vec2(uTime * 24.0, uTime * 16.0));
        float sparkle = smoothstep(0.76, 0.995, grain) * (0.22 + uRainbowMix * 0.14);
        float saturation = mix(0.68, 0.98, uRainbowMix);
        float value = 0.84 + band * 0.14 + fresnel * 0.18 + sparkle * 0.24;

        vec3 rainbow = hsv2rgb(vec3(hue, saturation, min(value, 1.0)));
        rainbow = mix(rainbow, vec3(0.985, 0.985, 1.0), 0.06 + fresnel * 0.05);
        vec3 finalColor = mix(rainbow, vec3(0.0), clamp(uBlackMix, 0.0, 1.0));
        float alpha = faceMask * uOpacity * (0.96 + fresnel * 0.18);

        gl_FragColor = vec4(finalColor, alpha);
      }
    `,
  });
}

export function createPrismMaterial(layer: "core" | "shell" = "core") {
  const isShell = layer === "shell";

  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uWhiteMix: { value: 0 },
      uIntensity: { value: isShell ? 0.44 : 1 },
      uResolution: { value: new THREE.Vector2(1440, 900) },
      uOpacity: { value: isShell ? 0.24 : 0.7 },
      uShellMix: { value: isShell ? 1 : 0 },
    },
    vertexShader: `
      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      varying vec4 vClipPos;

      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        vClipPos = projectionMatrix * viewMatrix * world;
        gl_Position = vClipPos;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntro;
      uniform float uWhiteMix;
      uniform float uIntensity;
      uniform vec2 uResolution;
      uniform float uOpacity;
      uniform float uShellMix;

      varying vec3 vNormalWorld;
      varying vec3 vWorldPos;
      varying vec4 vClipPos;

      vec3 palette(float t) {
        vec3 a = vec3(0.48, 0.97, 1.0);
        vec3 b = vec3(0.98, 0.995, 1.0);
        vec3 c = vec3(1.0, 0.82, 0.95);
        vec3 d = vec3(1.0, 0.94, 0.76);

        if (t < 0.33) return mix(a, b, t / 0.33);
        if (t < 0.66) return mix(b, c, (t - 0.33) / 0.33);
        return mix(c, d, (t - 0.66) / 0.34);
      }

      float linePulse(float value, float width) {
        float grid = abs(fract(value - 0.5) - 0.5) / fwidth(value);
        return 1.0 - min(grid / width, 1.0);
      }

      vec2 lens(vec2 uv, float amount) {
        vec2 p = uv * 2.0 - 1.0;
        float r2 = dot(p, p);
        p *= 1.0 + r2 * amount;
        return p * 0.5 + 0.5;
      }

      vec3 chamberField(vec2 uv, float shift, float whiteMix) {
        uv = lens(uv + vec2(shift * 0.008, shift * 0.003), 0.028 + shift * 0.01);
        vec2 wallUv = uv;
        vec2 cellUv = vec2(wallUv.x * 26.0, wallUv.y * 14.0);
        float seamV = linePulse(cellUv.x, 0.92);
        float seamH = linePulse(cellUv.y, 0.92);
        float microV = linePulse(cellUv.x * 4.0, 2.8) * 0.14;
        float microH = linePulse(cellUv.y * 4.0, 2.8) * 0.14;
        float coreBand = smoothstep(0.88, 0.1, abs(wallUv.x - 0.5)) * smoothstep(0.94, 0.24, abs(wallUv.y - 0.48));
        float wordBars = smoothstep(0.28, 0.24, abs(wallUv.y - 0.5));

        vec3 darkBase = vec3(0.006, 0.008, 0.011);
        vec3 lightBase = vec3(0.97, 0.975, 0.985);
        vec3 darkLines = vec3(0.85, 0.9, 0.98) * 0.28;
        vec3 lightLines = vec3(0.15, 0.16, 0.19) * 0.3;
        vec3 base = mix(darkBase, lightBase, whiteMix);
        vec3 lineColor = mix(darkLines, lightLines, whiteMix);
        vec3 wordGlow = mix(vec3(0.92), vec3(0.16), whiteMix);

        vec3 color = base + lineColor * (seamV + seamH + microV + microH);
        color += wordGlow * coreBand * wordBars * 0.42;
        return color;
      }

      void main() {
        vec3 normal = normalize(vNormalWorld);
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.1);
        vec2 screenUv = (vClipPos.xy / max(vClipPos.w, 0.0001)) * 0.5 + 0.5;

        vec2 flow = vec2(
          sin(vWorldPos.y * 3.4 + uTime * 0.28),
          cos(vWorldPos.x * 4.2 - uTime * 0.24)
        ) * 0.003;
        vec2 normalDrift = normal.xy * (0.018 + fresnel * 0.048) + flow;

        vec3 refracted;
        refracted.r = chamberField(screenUv + normalDrift * 0.62, 0.5, uWhiteMix).r;
        refracted.g = chamberField(screenUv + normalDrift * 0.96, 0.0, uWhiteMix).g;
        refracted.b = chamberField(screenUv + normalDrift * 1.28, -0.5, uWhiteMix).b;

        float liquid = 0.5 + 0.5 * sin(vWorldPos.y * 5.8 + vWorldPos.x * 2.4 - uTime * 0.34);
        float verticalBias = smoothstep(-1.2, 1.4, vWorldPos.y);
        float contour = linePulse((vWorldPos.y + vWorldPos.x * 0.2 + 2.0) * 1.45, 2.2) * 0.09;

        vec3 spectral = palette(clamp(fresnel * 0.8 + liquid * 0.2, 0.0, 1.0));
        vec3 darkBody = mix(vec3(0.018, 0.022, 0.034), spectral, 0.5 + fresnel * 0.12);
        vec3 lightBody = mix(vec3(0.95, 0.965, 0.99), spectral, 0.16 + fresnel * 0.08);
        vec3 body = mix(darkBody, lightBody, uWhiteMix);
        body = mix(body, spectral, verticalBias * 0.06);

        vec3 color = mix(refracted, body, 0.34 + uShellMix * 0.22);
        color += spectral * fresnel * (0.26 + uShellMix * 0.12);
        color += contour * mix(vec3(0.42, 0.52, 0.72), vec3(0.18), uWhiteMix);
        color *= 0.92 + uIntensity * 0.16;

        float alpha = (0.34 + fresnel * 0.24 + uShellMix * 0.06) * uOpacity * mix(0.0, 1.0, uIntro);
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

export function createHaloMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uIntro: { value: 0 },
      uWhiteMix: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;

      uniform float uTime;
      uniform float uIntro;
      uniform float uWhiteMix;

      void main() {
        vec2 uv = vUv - 0.5;
        float ring = smoothstep(0.48, 0.12, abs(length(uv) - 0.36));
        float sweep = 0.5 + 0.5 * sin(atan(uv.y, uv.x) * 4.0 - uTime * 0.18);
        float pulse = 0.5 + 0.5 * sin(uTime * 0.26);
        vec3 dark = vec3(0.16, 0.4, 0.84);
        vec3 light = vec3(1.0);
        vec3 color = mix(dark, light, uWhiteMix);
        gl_FragColor = vec4(color * ring * (0.06 + sweep * 0.08 + pulse * 0.03) * uIntro, ring * 0.24 * uIntro);
      }
    `,
  });
}

export function createEmissiveWordMaterial(color = "#ffffff") {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 2.4,
    metalness: 0.08,
    roughness: 0.24,
    transparent: true,
    opacity: 1,
  });
}

export function createStructureMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#0a0d12",
    emissive: "#1d2534",
    emissiveIntensity: 0.2,
    metalness: 0.42,
    roughness: 0.76,
    transparent: true,
    opacity: 0,
  });
}

export function createPrismEdgeColor(progress: number, whiteMix: number) {
  const spectral = spectralPalette((progress % 1 + 1) % 1);
  return whiteMix > 0.5 ? spectral.multiplyScalar(0.32) : spectral.multiplyScalar(0.72);
}
