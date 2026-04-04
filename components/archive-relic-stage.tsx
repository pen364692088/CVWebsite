"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens, ArchivePhase, RendererStats } from "@/lib/archive";
import { assetPath } from "@/lib/site";

const ArchiveRelicCanvas = dynamic(
  () => import("@/components/archive-relic-canvas").then((module) => module.ArchiveRelicCanvas),
  { ssr: false },
);

interface ArchiveRelicStageProps {
  activeLens: ArchiveLens;
  activePhase: ArchivePhase;
  currentLens: Dictionary["game"]["options"][number];
  copy: Dictionary["relic"];
  isBandActive: boolean;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ArchiveRelicStage({
  activeLens,
  activePhase,
  currentLens,
  copy,
  isBandActive,
}: ArchiveRelicStageProps) {
  const reducedMotion = useReducedMotion();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [canRenderLive, setCanRenderLive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState<RendererStats>({ calls: 0, points: 0 });
  const handleReady = useCallback(() => setIsReady(true), []);
  const handleStats = useCallback((nextStats: RendererStats) => setStats(nextStats), []);

  useEffect(() => {
    setIsHydrated(true);

    const media = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(media.matches);

    updateMobile();
    media.addEventListener("change", updateMobile);

    const params = new URLSearchParams(window.location.search);
    const forceFallback = params.get("relic") === "fallback";
    setCanRenderLive(!forceFallback && supportsWebGL());

    return () => {
      media.removeEventListener("change", updateMobile);
    };
  }, []);

  const shouldRenderLive = isHydrated && canRenderLive;
  const phaseLabel = copy.phaseNames[activePhase];
  const modeLabel = copy.modeNames[activeLens];

  const diagnosticRows = useMemo(
    () => [
      { label: copy.sigilLabel, value: currentLens.label },
      { label: copy.phaseLabel, value: phaseLabel },
      { label: copy.modeLabel, value: modeLabel },
      { label: copy.callsLabel, value: String(stats.calls) },
      { label: copy.pointsLabel, value: String(stats.points) },
    ],
    [copy.callsLabel, copy.modeLabel, copy.phaseLabel, copy.pointsLabel, copy.sigilLabel, currentLens.label, modeLabel, phaseLabel, stats.calls, stats.points],
  );

  return (
    <aside className="archive-band-stage-column">
      <div className="archive-band-stage-sticky">
        <div
          className={`archive-relic-stage ${isReady ? "archive-relic-stage-live" : ""}`}
          data-phase={activePhase}
          data-lens={activeLens}
          role="img"
          aria-label={copy.fallbackAlt}
        >
          <div className={`archive-relic-poster ${shouldRenderLive && isReady ? "archive-relic-poster-underlay" : ""}`}>
            <Image
              src={assetPath("/hero/norwich-threshold-pexels.jpg")}
              alt={copy.fallbackAlt}
              fill
              priority
              sizes="(min-width: 900px) 40vw, 100vw"
              className="archive-relic-poster-image"
            />
            <div className="archive-relic-poster-vignette" aria-hidden="true" />
            <div className="archive-relic-poster-fire" aria-hidden="true" />
          </div>

          {shouldRenderLive ? (
            <ArchiveRelicCanvas
              activeLens={activeLens}
              activePhase={activePhase}
              isBandActive={isBandActive}
              isMobile={isMobile}
              reducedMotion={Boolean(reducedMotion)}
              onReady={handleReady}
              onStats={handleStats}
            />
          ) : null}

          {!shouldRenderLive && isHydrated ? <p className="archive-relic-status">{copy.unsupportedLabel}</p> : null}

          <dl className="archive-diagnostic-rail" aria-label="Relic diagnostics">
            {diagnosticRows.map((row) => (
              <div key={row.label} className="archive-diagnostic-row">
                <dt className="archive-diagnostic-label">{row.label}</dt>
                <dd className="archive-diagnostic-value">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  );
}
