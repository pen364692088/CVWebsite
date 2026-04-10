"use client";

import * as THREE from "three";

function spectralPalette(t: number) {
  const a = new THREE.Color("#83f6ff");
  const b = new THREE.Color("#f7fbff");
  const c = new THREE.Color("#ffd4f2");
  const d = new THREE.Color("#fff2cb");

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
        vec2 uv = vec2(angle * 9.0 + 0.5, height * 0.84 + 0.5);

        float majorAngle = linePulse(uv.x * 14.0, 1.15);
        float minorAngle = linePulse(uv.x * 44.0 + sin(height * 1.6 + uTime * 0.06) * 0.15, 2.2) * 0.34;
        float majorHeight = linePulse(uv.y * 20.0, 1.2);
        float minorHeight = linePulse(uv.y * 52.0 + sin(angle * 12.0) * 0.22, 2.8) * 0.18;

        float centerBand = smoothstep(1.6, 0.0, abs(vWorldPos.y) * 0.34);
        float horizontalRim = smoothstep(0.95, 0.12, abs(angle));
        float forwardRim = smoothstep(-0.1, 0.82, vNormalWorld.z * 0.5 + 0.5);
        float technicalSweep = 0.5 + 0.5 * sin((angle * 18.0) + (height * 2.5) - uTime * 0.11);

        float lines = max(majorAngle, majorHeight);
        lines += minorAngle + minorHeight;
        lines += technicalSweep * 0.06 * centerBand;

        vec3 darkBase = vec3(0.005, 0.007, 0.01);
        vec3 lightBase = vec3(0.95, 0.96, 0.975);
        vec3 darkLines = vec3(0.86, 0.9, 0.98) * (0.1 + centerBand * 0.26 + horizontalRim * 0.2 + forwardRim * 0.1);
        vec3 lightLines = vec3(0.17, 0.18, 0.22) * 0.42;

        vec3 base = mix(darkBase, lightBase, uWhiteMix);
        vec3 lineColor = mix(darkLines, lightLines, uWhiteMix) * uGlow * uExposure;
        vec3 roomGlow = mix(vec3(0.0), vec3(0.03, 0.05, 0.08) * centerBand, 1.0 - uWhiteMix);

        float opacity = mix(0.94, 0.4, uWhiteMix) * mix(0.0, 1.0, uIntro);
        vec3 color = base + roomGlow + lineColor * lines;
        gl_FragColor = vec4(color, opacity);
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
      uIntensity: { value: isShell ? 0.52 : 1 },
      uResolution: { value: new THREE.Vector2(1440, 900) },
      uOpacity: { value: isShell ? 0.42 : 0.9 },
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
        vec3 a = vec3(0.50, 0.98, 1.0);
        vec3 b = vec3(0.98, 0.99, 1.0);
        vec3 c = vec3(1.0, 0.78, 0.95);
        vec3 d = vec3(1.0, 0.93, 0.74);

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

      vec3 roomField(vec2 uv, float channelShift, float whiteMix) {
        uv = lens(uv + vec2(channelShift * 0.01, channelShift * 0.004), 0.04 + channelShift * 0.02);
        vec2 centered = uv * 2.0 - 1.0;
        float angle = centered.x;
        float height = centered.y;
        float majorAngle = linePulse((angle + 1.0) * 8.0, 1.1);
        float minorAngle = linePulse((angle + 1.0) * 26.0 + sin(height * 7.0) * 0.2, 2.8) * 0.28;
        float majorHeight = linePulse((height + 1.0) * 10.5, 1.12);
        float minorHeight = linePulse((height + 1.0) * 28.0 + sin(angle * 9.0) * 0.14, 2.9) * 0.15;
        float vignette = smoothstep(1.12, 0.18, length(centered * vec2(0.92, 0.8)));
        vec3 darkBase = vec3(0.006, 0.008, 0.011);
        vec3 lightBase = vec3(0.97, 0.975, 0.985);
        vec3 darkLines = vec3(0.86, 0.9, 0.98) * 0.36;
        vec3 lightLines = vec3(0.15, 0.16, 0.19) * 0.3;
        vec3 base = mix(darkBase, lightBase, whiteMix);
        vec3 lines = mix(darkLines, lightLines, whiteMix) * (majorAngle + minorAngle + majorHeight + minorHeight);
        return base + lines * vignette;
      }

      void main() {
        vec3 normal = normalize(vNormalWorld);
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.75);
        vec2 screenUv = (vClipPos.xy / max(vClipPos.w, 0.0001)) * 0.5 + 0.5;
        vec2 distortion = normal.xy * (0.045 + fresnel * 0.08) + vec2(sin(vWorldPos.y * 6.0 + uTime * 0.5), cos(vWorldPos.x * 5.0 - uTime * 0.4)) * 0.008;

        vec3 refracted;
        refracted.r = roomField(screenUv + distortion * 0.55, 0.55, uWhiteMix).r;
        refracted.g = roomField(screenUv + distortion * 0.9, 0.0, uWhiteMix).g;
        refracted.b = roomField(screenUv + distortion * 1.25, -0.55, uWhiteMix).b;

        float interference = 0.5 + 0.5 * sin(vWorldPos.y * 8.6 + vWorldPos.x * 6.4 - uTime * 0.58 + fresnel * 4.0);
        float contour = linePulse((vWorldPos.y + 2.0) * 1.8 + vWorldPos.x * 0.6, 1.8) * 0.18;
        vec3 spectral = palette(clamp(fresnel * 0.78 + interference * 0.22, 0.0, 1.0));
        vec3 darkBody = mix(vec3(0.03, 0.04, 0.06), spectral, 0.58 + fresnel * 0.18);
        vec3 lightBody = mix(vec3(0.92, 0.94, 0.98), spectral, 0.18 + fresnel * 0.12);
        vec3 body = mix(darkBody, lightBody, uWhiteMix);

        vec3 color = mix(refracted, body, 0.22 + uShellMix * 0.36);
        color += spectral * fresnel * (0.55 + uShellMix * 0.35);
        color += contour * mix(vec3(0.45, 0.55, 0.72), vec3(0.2), uWhiteMix);
        color *= 0.84 + uIntensity * 0.28;

        float alpha = (0.48 + fresnel * 0.42 + uShellMix * 0.12) * uOpacity * mix(0.0, 1.0, uIntro);
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
        float ring = smoothstep(0.46, 0.12, abs(length(uv) - 0.36));
        float sweep = 0.5 + 0.5 * sin(atan(uv.y, uv.x) * 4.0 - uTime * 0.22);
        float pulse = 0.5 + 0.5 * sin(uTime * 0.3);
        vec3 dark = vec3(0.18, 0.52, 0.95);
        vec3 light = vec3(1.0);
        vec3 color = mix(dark, light, uWhiteMix);
        gl_FragColor = vec4(color * ring * (0.12 + sweep * 0.15 + pulse * 0.06) * uIntro, ring * 0.48 * uIntro);
      }
    `,
  });
}

export function createPrismEdgeColor(progress: number, whiteMix: number) {
  const spectral = spectralPalette((progress % 1 + 1) % 1);
  return whiteMix > 0.5 ? spectral.multiplyScalar(0.36) : spectral.multiplyScalar(0.84);
}
