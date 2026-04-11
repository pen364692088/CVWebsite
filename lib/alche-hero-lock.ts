export const ALCHE_HERO_SHOT_IDS = [
  "intro-forming",
  "hero-settled",
  "chamber-read",
  "prism-read",
  "hud-legible",
] as const;

export type AlcheHeroShotId = (typeof ALCHE_HERO_SHOT_IDS)[number];

export interface AlcheHeroLock {
  camera: {
    position: readonly [number, number, number];
    target: readonly [number, number, number];
    fov: number;
  };
  prism: {
    position: readonly [number, number, number];
    rotation: readonly [number, number, number];
    scale: number;
  };
  typography: {
    heroCopyMaxWidth: string;
    wordmarkFontSize: string;
    wordmarkTracking: string;
    wordmarkLineHeight: number;
    wordmarkLeft: string;
    wordmarkTop: string;
    wordmarkBaselineOffset: string;
    bodyBlockWidth: string;
  };
  hud: {
    top: string;
    right: string;
    width: string;
    frameOpacity: number;
    telemetryOpacity: number;
    listOpacity: number;
  };
}

export interface AlcheHeroShotConfig {
  introProgress: number;
  heroOpacity: number;
  chamberMassing: {
    roomGlow: number;
    roomExposure: number;
    rearWallEmphasis: number;
    panelBias: number;
    braceBias: number;
  };
  prismEmphasis: {
    positionOffset: readonly [number, number, number];
    rotationOffset: readonly [number, number, number];
    scale: number;
  };
  hudEmphasis: {
    frameOpacity: number;
    telemetryOpacity: number;
    listOpacity: number;
    contrast: number;
  };
}

export const ALCHE_HERO_LOCK: AlcheHeroLock = {
  camera: {
    position: [0.2, 0.18, 5.42],
    target: [0.22, 0.14, -0.56],
    fov: 31.2,
  },
  prism: {
    position: [1.04, -0.05, -0.32],
    rotation: [0.15, 0.38, 0.008],
    scale: 0.68,
  },
  typography: {
    heroCopyMaxWidth: "76rem",
    wordmarkFontSize: "clamp(8rem, 25vw, 23.4rem)",
    wordmarkTracking: "-0.102em",
    wordmarkLineHeight: 0.78,
    wordmarkLeft: "-0.08rem",
    wordmarkTop: "-0.3rem",
    wordmarkBaselineOffset: "0.12rem",
    bodyBlockWidth: "24rem",
  },
  hud: {
    top: "10.72rem",
    right: "1.85rem",
    width: "14.6rem",
    frameOpacity: 0.8,
    telemetryOpacity: 0.92,
    listOpacity: 0.84,
  },
};

export const ALCHE_HERO_SHOTS: Record<AlcheHeroShotId, AlcheHeroShotConfig> = {
  "intro-forming": {
    introProgress: 0.88,
    heroOpacity: 1,
    chamberMassing: {
      roomGlow: 0.7,
      roomExposure: 0.74,
      rearWallEmphasis: 1.02,
      panelBias: 0.68,
      braceBias: 0.64,
    },
    prismEmphasis: {
      positionOffset: [0, 0.02, -0.04],
      rotationOffset: [0.01, -0.03, 0],
      scale: 0.94,
    },
    hudEmphasis: {
      frameOpacity: 0.42,
      telemetryOpacity: 0.36,
      listOpacity: 0.34,
      contrast: 0.54,
    },
  },
  "hero-settled": {
    introProgress: 1,
    heroOpacity: 1,
    chamberMassing: {
      roomGlow: 0.74,
      roomExposure: 0.76,
      rearWallEmphasis: 1.42,
      panelBias: 0.88,
      braceBias: 0.8,
    },
    prismEmphasis: {
      positionOffset: [0.02, 0, -0.02],
      rotationOffset: [0, -0.01, 0],
      scale: 1.02,
    },
    hudEmphasis: {
      frameOpacity: 0.88,
      telemetryOpacity: 0.88,
      listOpacity: 0.84,
      contrast: 0.9,
    },
  },
  "chamber-read": {
    introProgress: 1,
    heroOpacity: 1,
    chamberMassing: {
      roomGlow: 0.78,
      roomExposure: 0.76,
      rearWallEmphasis: 1.9,
      panelBias: 0.92,
      braceBias: 0.78,
    },
    prismEmphasis: {
      positionOffset: [0.2, 0, -0.36],
      rotationOffset: [0.01, -0.06, 0],
      scale: 0.82,
    },
    hudEmphasis: {
      frameOpacity: 0.68,
      telemetryOpacity: 0.66,
      listOpacity: 0.62,
      contrast: 0.78,
    },
  },
  "prism-read": {
    introProgress: 1,
    heroOpacity: 1,
    chamberMassing: {
      roomGlow: 0.68,
      roomExposure: 0.72,
      rearWallEmphasis: 1.02,
      panelBias: 0.66,
      braceBias: 0.62,
    },
    prismEmphasis: {
      positionOffset: [0.02, 0, 0.18],
      rotationOffset: [0.015, 0.05, 0.004],
      scale: 1.3,
    },
    hudEmphasis: {
      frameOpacity: 0.58,
      telemetryOpacity: 0.54,
      listOpacity: 0.5,
      contrast: 0.68,
    },
  },
  "hud-legible": {
    introProgress: 1,
    heroOpacity: 1,
    chamberMassing: {
      roomGlow: 0.78,
      roomExposure: 0.8,
      rearWallEmphasis: 1.14,
      panelBias: 0.76,
      braceBias: 0.7,
    },
    prismEmphasis: {
      positionOffset: [-0.22, 0, -0.1],
      rotationOffset: [0, -0.06, 0],
      scale: 0.82,
    },
    hudEmphasis: {
      frameOpacity: 1.08,
      telemetryOpacity: 1.08,
      listOpacity: 1.06,
      contrast: 1.16,
    },
  },
};

export function readAlcheHeroShotId(value: string | null): AlcheHeroShotId | null {
  if (!value) return null;
  return ALCHE_HERO_SHOT_IDS.includes(value as AlcheHeroShotId) ? (value as AlcheHeroShotId) : null;
}
