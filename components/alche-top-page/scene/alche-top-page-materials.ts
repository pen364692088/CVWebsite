"use client";

import * as THREE from "three";

import { ALCHE_TOP_KV_WALL_ARC_STRENGTH, ALCHE_TOP_MEDIA_WALL, ALCHE_TOP_WALL_TILE_DENSITY } from "@/lib/alche-top-page";

const ALCHE_TOP_WALL_SAFE_FLATTEN = 0.997;

function spectralPalette(t: number) {
  const a = new THREE.Color("#89f2ff");
  const b = new THREE.Color("#f8fbff");
  const c = new THREE.Color("#ffd9f4");
  const d = new THREE.Color("#fff0cb");

  if (t < 0.33) return a.clone().lerp(b, t / 0.33);
  if (t < 0.66) return b.clone().lerp(c, (t - 0.33) / 0.33);
  return c.clone().lerp(d, (t - 0.66) / 0.34);
}

export function createCurvedGridMaterial(_wallTexture: THREE.Texture) {
  const effectiveRadius = ALCHE_TOP_MEDIA_WALL.radius / ALCHE_TOP_KV_WALL_ARC_STRENGTH;

  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
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
    },
    vertexShader: `
      uniform float uFlatten;

      varying vec2 vMediaUv;
      varying float vProjectedX;

      void main() {
        float angle = atan(position.x, position.z);
        float angleUv = angle / 6.28318530718 + 0.5;
        float heightUv = position.y / ${Number(ALCHE_TOP_MEDIA_WALL.height / 2).toFixed(4)} * 0.5 + 0.5;

        vec3 transformed = position;
        float planarX = angle * ${effectiveRadius.toFixed(4)};
        float safeFlatten = min(uFlatten, ${ALCHE_TOP_WALL_SAFE_FLATTEN.toFixed(3)});
        transformed.x = mix(position.x, planarX, safeFlatten);
        transformed.z = mix(position.z, -${effectiveRadius.toFixed(4)}, safeFlatten);

        vec4 world = modelMatrix * vec4(transformed, 1.0);
        vMediaUv = vec2(angleUv, heightUv);
        vec4 clip = projectionMatrix * viewMatrix * world;
        vProjectedX = clip.x / max(clip.w, 0.0001) * 0.5 + 0.5;
        gl_Position = clip;
      }
    `,
    fragmentShader: `
      varying vec2 vMediaUv;
      varying float vProjectedX;

      uniform float uTime;
      uniform float uIntro;
      uniform float uWhiteMix;
      uniform float uGlow;
      uniform float uExposure;
      uniform float uFlatten;
      uniform float uSceneFade;

      float linePulse(float value, float width) {
        float grid = abs(fract(value - 0.5) - 0.5) / fwidth(value);
        return 1.0 - min(grid / width, 1.0);
      }

      void main() {
        vec2 uv = vMediaUv;
        vec2 microGridUv = vec2(
          vProjectedX * ${(ALCHE_TOP_MEDIA_WALL.cellColumns * ALCHE_TOP_WALL_TILE_DENSITY).toFixed(1)},
          uv.y * ${(ALCHE_TOP_MEDIA_WALL.cellRows * ALCHE_TOP_WALL_TILE_DENSITY).toFixed(1)}
        );
        vec2 frameGridUv = vec2(
          vProjectedX * ${((ALCHE_TOP_MEDIA_WALL.cellColumns * ALCHE_TOP_WALL_TILE_DENSITY) / 16).toFixed(1)},
          uv.y * ${((ALCHE_TOP_MEDIA_WALL.cellColumns * ALCHE_TOP_WALL_TILE_DENSITY) / 16).toFixed(1)}
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
        color *= mix(1.0, 0.97, uFlatten * 0.1);

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
