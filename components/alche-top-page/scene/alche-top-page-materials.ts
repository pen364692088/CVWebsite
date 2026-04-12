"use client";

import * as THREE from "three";

import { ALCHE_TOP_MEDIA_WALL } from "@/lib/alche-top-page";

function spectralPalette(t: number) {
  const a = new THREE.Color("#89f2ff");
  const b = new THREE.Color("#f8fbff");
  const c = new THREE.Color("#ffd9f4");
  const d = new THREE.Color("#fff0cb");

  if (t < 0.33) return a.clone().lerp(b, t / 0.33);
  if (t < 0.66) return b.clone().lerp(c, (t - 0.33) / 0.33);
  return c.clone().lerp(d, (t - 0.66) / 0.34);
}

export function createCurvedGridMaterial(glyphTexture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uGlyphMap: { value: glyphTexture },
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
      varying vec3 vWorldPos;

      void main() {
        float angle = atan(position.x, position.z);
        float angleUv = angle / 6.28318530718 + 0.5;
        float heightUv = position.y / ${Number(ALCHE_TOP_MEDIA_WALL.height / 2).toFixed(4)} * 0.5 + 0.5;

        vec3 transformed = position;
        float planarX = angle * ${ALCHE_TOP_MEDIA_WALL.radius.toFixed(4)};
        transformed.x = mix(position.x, planarX, uFlatten);
        transformed.z = mix(position.z, -${ALCHE_TOP_MEDIA_WALL.radius.toFixed(4)}, uFlatten);

        vec4 world = modelMatrix * vec4(transformed, 1.0);
        vWorldPos = world.xyz;
        vMediaUv = vec2(angleUv, heightUv);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec2 vMediaUv;
      varying vec3 vWorldPos;

      uniform sampler2D uGlyphMap;
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

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      void main() {
        vec2 uv = vMediaUv;
        vec2 cellUv = vec2(uv.x * ${ALCHE_TOP_MEDIA_WALL.cellColumns.toFixed(1)}, uv.y * ${ALCHE_TOP_MEDIA_WALL.cellRows.toFixed(1)});
        vec2 cellId = floor(cellUv);
        vec2 local = fract(cellUv);
        vec2 panelUv = vec2(uv.x * 7.0, uv.y * 4.0);

        float coarseV = linePulse(panelUv.x + sin(uv.y * 3.2 + uTime * 0.01) * 0.02, 0.46);
        float coarseH = linePulse(panelUv.y, 0.46);
        float seamV = linePulse(cellUv.x, 1.05);
        float seamH = linePulse(cellUv.y, 1.05);
        float microV = linePulse(cellUv.x * 4.0 + sin(uv.y * 16.0 + uTime * 0.02) * 0.04, 2.6) * 0.14;
        float microH = linePulse(cellUv.y * 4.0 + sin(uv.x * 14.0 - uTime * 0.018) * 0.04, 2.6) * 0.14;

        float inactive = step(0.82, hash21(cellId * 0.071));
        float cellMask = (1.0 - inactive) * 0.2;

        float panelA = smoothstep(0.10, 0.12, uv.x) * (1.0 - smoothstep(0.28, 0.30, uv.x));
        panelA *= smoothstep(0.08, 0.12, uv.y) * (1.0 - smoothstep(0.68, 0.72, uv.y));
        float panelB = smoothstep(0.34, 0.36, uv.x) * (1.0 - smoothstep(0.58, 0.60, uv.x));
        panelB *= smoothstep(0.24, 0.28, uv.y) * (1.0 - smoothstep(0.92, 0.96, uv.y));
        float panelC = smoothstep(0.62, 0.64, uv.x) * (1.0 - smoothstep(0.88, 0.90, uv.x));
        panelC *= smoothstep(0.06, 0.10, uv.y) * (1.0 - smoothstep(0.58, 0.62, uv.y));
        float panelD = smoothstep(0.56, 0.58, uv.x) * (1.0 - smoothstep(0.72, 0.74, uv.x));
        panelD *= smoothstep(0.62, 0.66, uv.y) * (1.0 - smoothstep(0.94, 0.98, uv.y));
        float panelField = max(max(panelA, panelB), max(panelC, panelD));

        vec2 glyphUv = vec2(fract(uv.x * 1.12 + 0.06), 1.0 - clamp(uv.y, 0.0, 1.0));
        float glyph = texture2D(uGlyphMap, glyphUv).r;
        float glyphPresence = smoothstep(0.02, 0.2, glyph) * (0.42 + panelField * 0.78);

        float centerColumn = 1.0 - smoothstep(0.0, 0.25, abs(uv.x - 0.5));
        float centerGlow = centerColumn * (0.34 + 0.66 * smoothstep(0.08, 0.92, uv.y));
        float centerPulse = 0.92 + sin(uTime * 0.35 + uv.y * 9.0) * 0.08;

        vec3 darkBase = vec3(0.010, 0.008, 0.020);
        vec3 lightBase = vec3(0.95, 0.95, 0.98);
        vec3 darkInk = vec3(0.32, 0.38, 0.76);
        vec3 lightInk = vec3(0.14, 0.14, 0.18);
        vec3 base = mix(darkBase, lightBase, uWhiteMix);
        vec3 ink = mix(darkInk, lightInk, uWhiteMix);
        vec3 violet = mix(vec3(0.22, 0.12, 0.72), vec3(0.20), uWhiteMix);
        vec3 blueViolet = mix(vec3(0.16, 0.26, 0.86), vec3(0.24), uWhiteMix);
        vec3 lineInk = mix(vec3(0.05, 0.05, 0.08), vec3(0.18), uWhiteMix);

        vec3 color = base;
        color += violet * panelField * 0.52 * uExposure;
        color += blueViolet * cellMask;
        color += mix(vec3(0.08, 0.07, 0.14), vec3(0.2), uWhiteMix) * (coarseV * 1.14 + coarseH * 1.14);
        color += lineInk * (seamV * 0.18 + seamH * 0.18 + microV + microH) * (0.84 + uGlow * 0.32);
        color += mix(vec3(0.42, 0.38, 0.62), vec3(0.28), uWhiteMix) * glyphPresence * 0.78;
        color += mix(violet, blueViolet, 0.55) * centerGlow * centerPulse * (0.42 + uGlow * 0.28);
        color += vec3(0.74, 0.78, 1.0) * pow(centerGlow, 2.2) * 0.22;
        color *= mix(1.0, 0.9, uFlatten * 0.18);

        float edgeFade = 1.0 - smoothstep(0.18, 1.1, abs(uv.x - 0.5) * 2.0);
        float alpha = mix(0.98, 0.46, uWhiteMix) * uIntro * uSceneFade * edgeFade;
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
