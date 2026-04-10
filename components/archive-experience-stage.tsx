"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import type { ArtifactView } from "@/data/artifacts";
import type { ExperienceCopy } from "@/data/experience";
import type { ExperienceChapterId } from "@/lib/archive";
import { assetPath } from "@/lib/site";

const ArchiveExperienceCanvas = dynamic(
  () => import("@/components/archive-experience-canvas").then((module) => module.ArchiveExperienceCanvas),
  { ssr: false },
);

interface ArchiveExperienceStageProps {
  activeChapter: ExperienceChapterId;
  progress: number;
  experienceCopy: ExperienceCopy;
  artifacts: ArtifactView[];
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ArchiveExperienceStage({
  activeChapter,
  progress,
  experienceCopy,
  artifacts,
}: ArchiveExperienceStageProps) {
  const reducedMotion = useReducedMotion();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canRenderLive, setCanRenderLive] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    setCanRenderLive(supportsWebGL());

    const media = window.matchMedia("(max-width: 900px)");
    const updateMobile = () => setIsMobile(media.matches);

    updateMobile();
    media.addEventListener("change", updateMobile);

    return () => {
      media.removeEventListener("change", updateMobile);
    };
  }, []);

  const posterSrc = useMemo(() => {
    if (activeChapter === "egocore") return artifacts.find((item) => item.slug === "egocore")?.cover;
    if (activeChapter === "ashen-archive") return artifacts.find((item) => item.slug === "ashen-archive")?.cover;
    if (activeChapter === "openemotion") return artifacts.find((item) => item.slug === "openemotion")?.cover;

    return "/hero/norwich-threshold-pexels.jpg";
  }, [activeChapter, artifacts]);

  const stageState = experienceCopy.stageStates[activeChapter];
  const liveMode = isHydrated && canRenderLive;

  return (
    <div className="experience-stage-frame" aria-hidden="true">
      <div className="experience-stage-backdrop">
        <Image
          src={assetPath(posterSrc ?? "/hero/norwich-threshold-pexels.jpg")}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`experience-stage-poster ${liveMode && isReady ? "experience-stage-poster-muted" : ""}`}
        />
        <div className="experience-stage-gradient" />
        <div className="experience-stage-vignette" />
        <div className="experience-stage-scanwash" />
      </div>

      {liveMode ? (
        <div className={`experience-stage-live ${isReady ? "experience-stage-live-ready" : ""}`}>
          <ArchiveExperienceCanvas
            activeChapter={activeChapter}
            progress={progress}
            isMobile={isMobile}
            reducedMotion={Boolean(reducedMotion)}
            onReady={() => setIsReady(true)}
          />
        </div>
      ) : null}

      <div className="experience-stage-overlay">
        <div className="experience-stage-diagnostic">
          <span>{experienceCopy.stageLabel}</span>
          <span>{stageState.label}</span>
        </div>
        <div className="experience-stage-status">
          <span>{stageState.status}</span>
          <span>
            {experienceCopy.motionModeLabel}:{" "}
            {Boolean(reducedMotion) || !liveMode ? experienceCopy.reducedMotionLabel : experienceCopy.liveMotionLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
