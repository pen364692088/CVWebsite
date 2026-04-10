"use client";

import * as THREE from "three";

function spectralPalette(t: number) {
  const a = new THREE.Color("#89f2ff");
  const b = new THREE.Color("#f8fbff");
  const c = new THREE.Color("#ffd9f4");
  const d = new THREE.Color("#fff0cb");

  if (t < 0.33) return a.clone().lerp(b, t / 0.33);
  if (t < 0.66) return b.clone().lerp(c, (t - 0.33) / 0.33);
  return c.clone().lerp(d, (t - 0.66) / 0.34);
}

export function createCurvedGridMaterial() {
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
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vNormalWorld;

      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vNormalWorld;

      uniform float uTime;
      uniform float uIntro;
      uniform float uWhiteMix;
      uniform float uGlow;
      uniform float uExposure;

      float linePulse(float value, float width) {
        float grid = abs(fract(value - 0.5) - 0.5) / fwidth(value);
        return 1.0 - min(grid / width, 1.0);
      }

      void main() {
        float angle = atan(vWorldPos.x, vWorldPos.z) / 3.14159265359;
        float height = vWorldPos.y * 1.42;
        vec2 uv = vec2(angle * 9.5 + 0.5, height * 0.84 + 0.5);

        float macroAngle = linePulse(uv.x * 12.0, 1.08);
        float microAngle = linePulse(uv.x * 38.0 + sin(height * 1.4 + uTime * 0.04) * 0.14, 2.6) * 0.22;
        float macroHeight = linePulse(uv.y * 18.0, 1.16);
        float microHeight = linePulse(uv.y * 52.0 + sin(angle * 11.0) * 0.18, 3.0) * 0.14;
        float diagonal = linePulse((angle + height * 0.42 + 1.0) * 14.0, 2.4) * 0.11;

        float centerBand = smoothstep(1.65, 0.0, abs(vWorldPos.y) * 0.32);
        float forwardRim = smoothstep(-0.15, 0.82, vNormalWorld.z * 0.5 + 0.5);
        float sideRim = smoothstep(0.96, 0.18, abs(angle));
        float lines = max(macroAngle, macroHeight) + microAngle + microHeight + diagonal;

        vec3 darkBase = vec3(0.004, 0.0055, 0.008);
        vec3 lightBase = vec3(0.95, 0.96, 0.975);
        vec3 darkLines = vec3(0.87, 0.91, 0.98) * (0.08 + centerBand * 0.24 + sideRim * 0.18 + forwardRim * 0.12);
        vec3 lightLines = vec3(0.14, 0.15, 0.18) * 0.38;
        vec3 base = mix(darkBase, lightBase, uWhiteMix);
        vec3 lineColor = mix(darkLines, lightLines, uWhiteMix) * uGlow * uExposure;
        vec3 chamberLift = mix(vec3(0.0), vec3(0.018, 0.03, 0.055) * centerBand, 1.0 - uWhiteMix);

        float opacity = mix(0.96, 0.44, uWhiteMix) * mix(0.0, 1.0, uIntro);
        vec3 color = base + chamberLift + lineColor * lines;
        gl_FragColor = vec4(color, opacity);
      }
    `,
  });
}

export function createChamberPanelMaterial() {
  return new THREE.MeshStandardMaterial({
    color: "#090b0f",
    emissive: "#111824",
    emissiveIntensity: 0.08,
    metalness: 0.72,
    roughness: 0.9,
    transparent: true,
    opacity: 0.92,
  });
}

export function createGalleryPlaneMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uVisibility: { value: 0 },
      uWhiteMix: { value: 0 },
      uIndex: { value: 0 },
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
        float slabA = smoothstep(0.11, 0.115, uv.y) * (1.0 - smoothstep(0.27, 0.275, uv.y));
        float slabB = smoothstep(0.45, 0.455, uv.y) * (1.0 - smoothstep(0.67, 0.675, uv.y));
        float slabC = smoothstep(0.76, 0.765, uv.y) * (1.0 - smoothstep(0.89, 0.895, uv.y));
        float highlight = smoothstep(0.6, 0.0, abs(centered.x * 0.9 + centered.y * 1.4 - 0.08)) * 0.12;

        vec3 darkBase = vec3(0.012, 0.015, 0.02);
        vec3 lightBase = vec3(0.94, 0.95, 0.965);
        vec3 darkInk = vec3(0.76, 0.83, 0.93);
        vec3 lightInk = vec3(0.14, 0.15, 0.18);
        vec3 base = mix(darkBase, lightBase, uWhiteMix);
        vec3 ink = mix(darkInk, lightInk, uWhiteMix);

        vec3 color = base;
        color += ink * (frame * 0.32 + diagonal + scan);
        color += ink * (slabA * 0.08 + slabB * 0.1 + slabC * 0.06);
        color += highlight * mix(vec3(0.34, 0.44, 0.62), vec3(0.18), uWhiteMix);

        float alpha = (0.1 + frame * 0.36 + diagonal * 0.35 + slabB * 0.2) * uVisibility;
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
        uv = lens(uv + vec2(shift * 0.01, shift * 0.003), 0.03 + shift * 0.015);
        vec2 centered = uv * 2.0 - 1.0;
        float angle = centered.x;
        float height = centered.y;
        float arc = linePulse((angle + 1.0) * 7.5, 1.2);
        float vertical = linePulse((height + 1.0) * 10.0, 1.2);
        float micro = linePulse((angle + height * 0.4 + 1.0) * 20.0, 2.8) * 0.18;
        float vignette = smoothstep(1.14, 0.16, length(centered * vec2(0.92, 0.8)));
        vec3 darkBase = vec3(0.006, 0.008, 0.011);
        vec3 lightBase = vec3(0.97, 0.975, 0.985);
        vec3 darkLines = vec3(0.85, 0.9, 0.98) * 0.3;
        vec3 lightLines = vec3(0.15, 0.16, 0.19) * 0.3;
        vec3 base = mix(darkBase, lightBase, whiteMix);
        vec3 lineColor = mix(darkLines, lightLines, whiteMix);
        return base + lineColor * (arc + vertical + micro) * vignette;
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
        gl_FragColor = vec4(color * ring * (0.07 + sweep * 0.1 + pulse * 0.03) * uIntro, ring * 0.24 * uIntro);
      }
    `,
  });
}

export function createPrismEdgeColor(progress: number, whiteMix: number) {
  const spectral = spectralPalette((progress % 1 + 1) % 1);
  return whiteMix > 0.5 ? spectral.multiplyScalar(0.32) : spectral.multiplyScalar(0.72);
}
