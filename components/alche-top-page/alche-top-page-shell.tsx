"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";

import {
  ALCHE_ENDMARK_DEBUG_STAGES,
  AlcheEndmarkOverlay,
  type AlcheEndmarkDebugStage,
  type AlcheEndmarkDebugState,
} from "@/components/alche-top-page/alche-endmark-overlay";
import { alcheTopPageCopy } from "@/data/alche-top-page";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import {
  ALCHE_TOP_MISSION_PANEL_LAYOUT,
  type AlchePointerDebugState,
  ALCHE_TOP_SCROLL_TRACK_SECTIONS,
  ALCHE_TOP_SECTION_IDS,
  ALCHE_TOP_SECTIONS,
  deriveMissionTransitionOverlayState,
  normalizeTopRuntimeSection,
  type AlcheScrollableSectionId,
  type AlcheTopSectionId,
} from "@/lib/alche-top-page";
import { readAlcheHeroShotId, type AlcheHeroShotId } from "@/lib/alche-hero-lock";
import {
  ALCHE_WORKS_CAPTURE_SHOTS,
  getDefaultAlcheWorksCardDebugMode,
  getAdjacentAlcheWorksShotId,
  getAlcheWorksShotOverride,
  readAlcheWorksShotId,
  resolveAlcheWorksCardDebugMode,
  type AlcheWorksCardDebugMode,
  type AlcheWorksShotId,
} from "@/lib/alche-works-shotbook";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { SITE, assetPath } from "@/lib/site";
import { useTopPageScroll } from "@/components/alche-top-page/use-top-page-scroll";

import styles from "@/components/alche-top-page/alche-top-page-shell.module.scss";

const AlcheTopPageCanvas = dynamic(
  () => import("@/components/alche-top-page/alche-top-page-canvas").then((module) => module.AlcheTopPageCanvas),
  { ssr: false },
);

interface AlcheTopPageShellProps {
  locale: Locale;
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

interface AlcheShellDebugOverride {
  section: AlcheTopSectionId;
  progress: number;
  intro: number;
  missionTurnProgress?: number;
  visionCoverProgress?: number;
  heroShotId: AlcheHeroShotId | null;
  shotId: AlcheWorksShotId | null;
}

function createShellDebugOverrideFromShot(shotId: AlcheWorksShotId, heroShotId: AlcheHeroShotId | null): AlcheShellDebugOverride | null {
  const shotOverride = getAlcheWorksShotOverride(shotId);
  if (!shotOverride) return null;

  return {
    ...shotOverride,
    section: normalizeTopRuntimeSection(shotOverride.section),
    missionTurnProgress: 0,
    visionCoverProgress: 0,
    heroShotId,
  };
}

function readShellDebugOverride(params: Pick<URLSearchParams, "get"> | null): AlcheShellDebugOverride | null {
  if (!params) return null;
  const shotId = readAlcheWorksShotId(params.get("alcheShot"));
  const heroShotId = readAlcheHeroShotId(params.get("alcheHeroShot"));
  if (shotId) {
    return createShellDebugOverrideFromShot(shotId, heroShotId);
  }

  const section = params.get("alcheSection");
  if (!section || !ALCHE_TOP_SECTION_IDS.includes(section as AlcheTopSectionId)) return null;
  const normalizedSection = normalizeTopRuntimeSection(section as AlcheTopSectionId);

  return {
    shotId: null,
    section: normalizedSection,
    progress: Number(params.get("alcheProgress") ?? (normalizedSection === "loading" ? "0" : "1")),
    intro: Number(params.get("alcheIntro") ?? (normalizedSection === "loading" ? "0.2" : "1")),
    missionTurnProgress:
      params.get("alcheMissionTurnProgress") === null ? undefined : Number(params.get("alcheMissionTurnProgress")),
    visionCoverProgress:
      params.get("alcheVisionCoverProgress") === null ? undefined : Number(params.get("alcheVisionCoverProgress")),
    heroShotId,
  };
}

function writeShellDebugOverrideToLocation(nextOverride: AlcheShellDebugOverride | null) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const normalizedOverride = nextOverride
    ? {
        ...nextOverride,
        section: normalizeTopRuntimeSection(nextOverride.section),
      }
    : null;

  if (!normalizedOverride) {
    url.searchParams.delete("alcheShot");
    url.searchParams.delete("alcheSection");
    url.searchParams.delete("alcheProgress");
    url.searchParams.delete("alcheIntro");
    url.searchParams.delete("alcheMissionTurnProgress");
    url.searchParams.delete("alcheVisionCoverProgress");
    url.searchParams.delete("alcheHeroShot");
  } else {
    if (normalizedOverride.shotId) {
      url.searchParams.set("alcheShot", normalizedOverride.shotId);
      url.searchParams.delete("alcheSection");
      url.searchParams.delete("alcheProgress");
      url.searchParams.delete("alcheIntro");
    } else {
      url.searchParams.delete("alcheShot");
      url.searchParams.set("alcheSection", normalizedOverride.section);
      url.searchParams.set("alcheProgress", String(normalizedOverride.progress));
      url.searchParams.set("alcheIntro", String(normalizedOverride.intro));
    }

    if (normalizedOverride.heroShotId) {
      url.searchParams.set("alcheHeroShot", normalizedOverride.heroShotId);
    } else {
      url.searchParams.delete("alcheHeroShot");
    }

    if (normalizedOverride.missionTurnProgress === undefined) {
      url.searchParams.delete("alcheMissionTurnProgress");
    } else {
      url.searchParams.set("alcheMissionTurnProgress", String(normalizedOverride.missionTurnProgress));
    }

    if (normalizedOverride.visionCoverProgress === undefined) {
      url.searchParams.delete("alcheVisionCoverProgress");
    } else {
      url.searchParams.set("alcheVisionCoverProgress", String(normalizedOverride.visionCoverProgress));
    }
  }

  window.history.replaceState(window.history.state, "", url.toString());
}

function writeAlcheCardDebugModeToLocation(nextMode: AlcheWorksCardDebugMode) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const defaultMode = getDefaultAlcheWorksCardDebugMode(url.searchParams, url.hostname);
  if (nextMode === defaultMode) {
    url.searchParams.delete("alcheCardDebug");
  } else {
    url.searchParams.set("alcheCardDebug", nextMode);
  }

  window.history.replaceState(window.history.state, "", url.toString());
}

function readEndmarkDebugStage(params: Pick<URLSearchParams, "get"> | null): AlcheEndmarkDebugStage | null {
  if (!params) return null;
  const stage = params.get("alcheEndmarkStage");
  if (!stage) return null;
  return ALCHE_ENDMARK_DEBUG_STAGES.includes(stage as AlcheEndmarkDebugStage)
    ? (stage as AlcheEndmarkDebugStage)
    : null;
}

function readEndmarkTimeScale(params: Pick<URLSearchParams, "get"> | null) {
  if (!params) return 1;
  const rawValue = params.get("alcheEndmarkTimeScale");
  if (!rawValue) return 1;
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(Math.max(parsed, 0.1), 40);
}

export function AlcheTopPageShell({ locale }: AlcheTopPageShellProps) {
  const copy = alcheTopPageCopy[locale];
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [canvasEventSource, setCanvasEventSource] = useState<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<AlcheScrollableSectionId, HTMLElement | null>>({
    kv: null,
    works_intro: null,
    works: null,
    works_cards: null,
    works_outro: null,
    mission_in: null,
    mission: null,
    vision: null,
    vision_out: null,
    service_in: null,
    service: null,
    stellla: null,
    outro: null,
  });
  const [canRenderLive, setCanRenderLive] = useState(true);
  const [captureMode, setCaptureMode] = useState(false);
  const [pointerDebugEnabled, setPointerDebugEnabled] = useState(false);
  const [pointerDebugState, setPointerDebugState] = useState<AlchePointerDebugState | null>(null);
  const [endmarkDebugState, setEndmarkDebugState] = useState<AlcheEndmarkDebugState>({
    stage: "idle",
    ready: false,
    visible: false,
    triggerActive: false,
    debugStage: null,
    overlayAlpha: 0,
    bgGlowAlpha: 0,
    gridAlpha: 0,
    guidePersistentAlpha: 0,
    guideFadeAlpha: 0,
    outlineAlpha: 0,
    fillAlpha: 0,
    fillRevealWidth: 0,
  });
  const [debugOverrideVersion, setDebugOverrideVersion] = useState(0);
  const {
    reducedMotion,
    activeSection,
    trackedSection,
    sectionProgress,
    worksCardsProgress,
    introProgress,
    missionTurnProgress,
    visionCoverProgress,
    endmarkFooterProgress,
    heroShotId,
    worksWordHandoff,
    scrollToSection,
  } =
    useTopPageScroll({
      sectionRefs,
    });
  const runtimeSearchParams = typeof window === "undefined" ? null : new URLSearchParams(window.location.search);
  const debugOverride = readShellDebugOverride(runtimeSearchParams);
  const endmarkDebugStage = readEndmarkDebugStage(runtimeSearchParams);
  const endmarkTimeScale = readEndmarkTimeScale(runtimeSearchParams);
  const endmarkDisabled = runtimeSearchParams?.get("alcheDisableEndmark") === "1";
  const debugUiHidden = runtimeSearchParams?.get("alcheHideDebugUi") === "1";
  const runtimeHostname = typeof window === "undefined" ? null : window.location.hostname;
  const currentCardDebugMode = resolveAlcheWorksCardDebugMode(runtimeSearchParams, runtimeHostname);
  const currentSectionProgress = debugOverride?.progress ?? sectionProgress;
  const currentWorksCardsProgress = debugOverride ? (debugOverride.section === "works_cards" ? debugOverride.progress : 0) : worksCardsProgress;
  const currentIntroProgress = debugOverride?.intro ?? introProgress;
  const currentHeroShotId = debugOverride?.heroShotId ?? heroShotId;
  const kvWallTexturePath = assetPath("/alche-top-page/kv/hero-wall-grid-white.png");
  const worksCardItems = copy.works.items.slice(0, 2).map((item) => ({
    title: item.title,
    imageSrc: item.imageSrc,
  }));
  const introSettled = currentIntroProgress > 0.995 || captureMode;
  const baseTrackedSection =
    debugOverride?.section === "loading" ? "kv" : ((debugOverride?.section as AlcheScrollableSectionId | undefined) ?? trackedSection ?? "kv");
  const currentActiveSection = normalizeTopRuntimeSection(
    debugOverride?.section ?? (introSettled ? baseTrackedSection : activeSection),
  );
  const currentTrackedSection = currentActiveSection === "loading" ? "kv" : baseTrackedSection;
  const currentShotId = debugOverride?.shotId ?? null;
  const endmarkBlueprintPath = assetPath("/alche-top-page/endmark/alche-wordmark-blueprint.svg");
  const endmarkTriggerActive = !endmarkDisabled && visionCoverProgress >= 0.98;
  const visibleEndmarkFooterProgress = endmarkDebugState.stage === "settled" ? endmarkFooterProgress : 0;
  const endmarkFooterVisible = visibleEndmarkFooterProgress > 0.01;
  const showShotSelector = !debugUiHidden && !captureMode && currentShotId !== null;
  const showCardDebugToggle =
    !debugUiHidden && !captureMode && (runtimeHostname === "localhost" || runtimeHostname === "127.0.0.1" || currentShotId !== null);
  const { missionPanelProgress } = deriveMissionTransitionOverlayState(currentActiveSection, currentSectionProgress);
  const missionPanelVisible = missionPanelProgress > 0.001;
  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    stageRef.current = node;
    setCanvasEventSource(node);
  }, []);

  useEffect(() => {
    setCanRenderLive(supportsWebGL());
  }, []);

  const handleShotOverride = useCallback(
    (shotId: AlcheWorksShotId | null) => {
      if (typeof window === "undefined") return;
      const host = window as typeof window & {
        __setAlcheDebugOverride?: (nextOverride: AlcheShellDebugOverride | null) => void;
      };
      const nextOverride = shotId ? createShellDebugOverrideFromShot(shotId, currentHeroShotId) : null;
      host.__setAlcheDebugOverride?.(nextOverride);
    },
    [currentHeroShotId],
  );

  const handleCardDebugModeChange = useCallback((nextMode: AlcheWorksCardDebugMode) => {
    if (typeof window === "undefined") return;
    writeAlcheCardDebugModeToLocation(nextMode);
    flushSync(() => {
      setDebugOverrideVersion((currentValue) => currentValue + 1);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setCaptureMode(params.get("alcheCapture") === "1");
    setPointerDebugEnabled(params.get("alchePointerDebug") === "1");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !pointerDebugEnabled) {
      setPointerDebugState(null);
      return;
    }

    const host = window as typeof window & {
      __getAlchePointerDebugState?: () => AlchePointerDebugState | null;
    };

    const interval = window.setInterval(() => {
      setPointerDebugState(host.__getAlchePointerDebugState?.() ?? null);
    }, 120);

    setPointerDebugState(host.__getAlchePointerDebugState?.() ?? null);

    return () => {
      window.clearInterval(interval);
    };
  }, [pointerDebugEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window as typeof window & {
      __setAlcheDebugOverride?: (nextOverride: AlcheShellDebugOverride | null) => void;
      __setAlcheSceneOverride?: (nextOverride: {
        section: AlcheTopSectionId;
        progress: number;
        intro: number;
        missionTurnProgress?: number;
        visionCoverProgress?: number;
        heroShotId: AlcheHeroShotId | null;
      } | null) => void;
    };

    host.__setAlcheDebugOverride = (nextOverride) => {
      const normalizedOverride = nextOverride
        ? {
            ...nextOverride,
            section: normalizeTopRuntimeSection(nextOverride.section),
          }
        : null;

      writeShellDebugOverrideToLocation(normalizedOverride);

      flushSync(() => {
        setDebugOverrideVersion((currentValue) => currentValue + 1);
      });
      host.__setAlcheSceneOverride?.(
        normalizedOverride
          ? {
              section: normalizedOverride.section,
              progress: normalizedOverride.progress,
              intro: normalizedOverride.intro,
              missionTurnProgress: normalizedOverride.missionTurnProgress,
              visionCoverProgress: normalizedOverride.visionCoverProgress,
              heroShotId: normalizedOverride.heroShotId,
            }
          : null,
      );

      const stage = stageRef.current;
      if (!stage) return;

      const nextTrackedSection =
        normalizedOverride?.section === "loading" ? "kv" : ((normalizedOverride?.section as AlcheScrollableSectionId | undefined) ?? "kv");
      const nextIntroSettled = Boolean(normalizedOverride && normalizedOverride.section !== "loading");
      const loadingOverlay = stage.querySelector<HTMLElement>("[data-loading-overlay]");

      stage.setAttribute("data-active-section", normalizedOverride?.section ?? "loading");
      stage.setAttribute("data-tracked-section", nextTrackedSection);
      stage.setAttribute("data-intro-ready", nextIntroSettled ? "true" : "false");
      loadingOverlay?.setAttribute("data-hidden", nextIntroSettled ? "true" : "false");
    };

    flushSync(() => {
      setDebugOverrideVersion((currentValue) => currentValue + 1);
    });

    return () => {
      delete host.__setAlcheDebugOverride;
    };
  }, []);
  function setSectionRef(sectionId: AlcheScrollableSectionId, node: HTMLElement | null) {
    sectionRefs.current[sectionId] = node;
  }

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;
    localStorage.setItem(SITE.localeStorageKey, nextLocale);
    router.push(`/${nextLocale}/`);
  }

  const stageStyle = useMemo(
    () =>
      ({
        "--alche-intro": currentIntroProgress.toFixed(3),
        "--alche-mission-panel-progress": missionPanelProgress.toFixed(3),
        "--alche-mission-panel-top-vh": ALCHE_TOP_MISSION_PANEL_LAYOUT.topVh.toString(),
        "--alche-mission-panel-travel-vh": ALCHE_TOP_MISSION_PANEL_LAYOUT.travelVh.toString(),
        "--alche-mission-panel-bottom-vh": ALCHE_TOP_MISSION_PANEL_LAYOUT.bottomVh.toString(),
        "--alche-endmark-footer-progress": visibleEndmarkFooterProgress.toFixed(3),
        "--alche-endmark-footer-offset": `${((1 - visibleEndmarkFooterProgress) * 2).toFixed(3)}rem`,
      }) as CSSProperties,
    [currentIntroProgress, missionPanelProgress, visibleEndmarkFooterProgress],
  );

  return (
    <div
      ref={setRootRef}
      className={styles.root}
      style={stageStyle}
      data-active-section={currentActiveSection}
      data-tracked-section={currentTrackedSection}
      data-intro-ready={introSettled ? "true" : "false"}
      data-render-active-section={currentActiveSection}
      data-render-tracked-section={currentTrackedSection}
      data-render-intro-ready={introSettled ? "true" : "false"}
      data-render-debug-version={debugOverrideVersion}
      data-pointer-debug={pointerDebugEnabled ? "true" : "false"}
      data-mission-panel-visible={missionPanelVisible ? "true" : "false"}
      data-mission-panel-progress={missionPanelProgress.toFixed(3)}
      data-endmark-stage={endmarkDebugState.stage}
      data-endmark-visible={endmarkDebugState.visible ? "true" : "false"}
      data-endmark-ready={endmarkDebugState.ready ? "true" : "false"}
      data-endmark-footer-progress={visibleEndmarkFooterProgress.toFixed(3)}
      data-endmark-footer-visible={endmarkFooterVisible ? "true" : "false"}
    >
      <div className={styles.stage}>
        <div className={styles.canvasLayer}>
          {canRenderLive ? (
            <AlcheTopPageCanvas
              activeSection={currentActiveSection}
              sectionProgress={currentSectionProgress}
              worksCardsProgress={currentWorksCardsProgress}
              introProgress={currentIntroProgress}
              missionTurnProgress={missionTurnProgress}
              visionCoverProgress={visionCoverProgress}
              heroShotId={currentHeroShotId}
              cardDebugMode={currentCardDebugMode}
              reducedMotion={reducedMotion}
              kvWallTexturePath={kvWallTexturePath}
              worksCardItems={worksCardItems}
              workCount={worksCardItems.length}
              serviceCount={copy.service.items.length}
              canvasEventSource={canvasEventSource}
              pointerDebugEnabled={pointerDebugEnabled}
              worksWordHandoff={worksWordHandoff}
              renderMode="full"
            />
          ) : (
            <div className={styles.fallback}>WebGL unavailable. The DOM shell remains available.</div>
          )}
        </div>

        <div className={styles.overlay}>
          <div className={styles.loadingOverlay} data-loading-overlay data-hidden={introSettled} data-render-hidden={introSettled}>
            <p className={styles.loadingEyebrow}>{copy.loading.eyebrow}</p>
            <p className={styles.loadingBody}>{copy.loading.body}</p>
            <div className={styles.loadingRule}>
              <span style={{ transform: `scaleX(${Math.max(currentIntroProgress, 0.02)})` }} />
            </div>
          </div>

          <div
            className={styles.missionTransition}
            data-mission-transition
            data-visible={missionPanelVisible ? "true" : "false"}
            aria-hidden={missionPanelVisible ? "false" : "true"}
          >
            <div className={styles.missionTransitionPanel} data-mission-panel />
          </div>

          {canRenderLive ? (
            <div className={styles.edgeOverlayLayer}>
              <AlcheTopPageCanvas
                activeSection={currentActiveSection}
                sectionProgress={currentSectionProgress}
                worksCardsProgress={currentWorksCardsProgress}
                introProgress={currentIntroProgress}
                missionTurnProgress={missionTurnProgress}
                visionCoverProgress={visionCoverProgress}
                heroShotId={currentHeroShotId}
                cardDebugMode={currentCardDebugMode}
                reducedMotion={reducedMotion}
                kvWallTexturePath={kvWallTexturePath}
                worksCardItems={worksCardItems}
                workCount={worksCardItems.length}
                serviceCount={copy.service.items.length}
                canvasEventSource={null}
                pointerDebugEnabled={false}
                worksWordHandoff={worksWordHandoff}
                renderMode="edge-overlay"
              />
            </div>
          ) : null}

          <div className={styles.endmarkOverlay}>
            <AlcheEndmarkOverlay
              assetUrl={endmarkBlueprintPath}
              triggerActive={endmarkTriggerActive}
              reducedMotion={reducedMotion}
              captureMode={captureMode}
              debugStage={endmarkDebugStage}
              timeScale={endmarkTimeScale}
              onDebugStateChange={setEndmarkDebugState}
            />
            <div
              className={styles.endmarkFooter}
              data-endmark-footer
              data-visible={endmarkFooterVisible ? "true" : "false"}
              aria-hidden="true"
            >
              <div className={styles.endmarkFooterColumns}>
                {copy.outro.footer.columns.map((column) => (
                  <div key={column.title} className={styles.endmarkFooterColumn}>
                    <span className={styles.endmarkFooterHeading}>{column.title}</span>
                    {column.items.map((item) => (
                      <span key={item} className={styles.endmarkFooterItem}>
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
              </div>

              <div className={styles.endmarkFooterAside}>
                <div className={styles.endmarkFooterActions}>
                  {copy.outro.footer.actions.map((action) => (
                    <span key={action} className={styles.endmarkFooterAction}>
                      {action}
                    </span>
                  ))}
                </div>
                <div className={styles.endmarkFooterLegal}>
                  {copy.outro.footer.legalLinks.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <span className={styles.endmarkFooterCopyright}>{copy.outro.footer.copyright}</span>
              </div>
            </div>
          </div>

          <header className={styles.header}>
            <button type="button" className={styles.headerBrand} onClick={() => scrollToSection(sectionRefs.current.kv)}>
              <span className={styles.headerBrandWord}>MOONFLOW</span>
            </button>

            <div className={styles.headerRight}>
              <button type="button" className={styles.soundToggle} aria-label={copy.header.soundLabel}>
                <span />
                <span />
                <span />
              </button>

              <label className={styles.localeField}>
                <span className="sr-only">{copy.header.localeLabel}</span>
                <select
                  className={styles.localeSelect}
                  value={locale}
                  onChange={(event) => handleLocaleChange(event.target.value as Locale)}
                >
                  {LOCALES.map((entry) => (
                    <option key={entry} value={entry}>
                      {LOCALE_LABELS[entry]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </header>
        </div>

        {pointerDebugEnabled ? (
          <div
            data-pointer-debug-panel
            style={{
              position: "absolute",
              left: "1rem",
              bottom: "1rem",
              zIndex: 30,
              maxWidth: "min(26rem, calc(100vw - 2rem))",
              padding: "0.8rem 0.9rem",
              borderRadius: "0.75rem",
              background: "rgba(8, 8, 12, 0.82)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#fff",
              fontFamily: "\"IBM Plex Mono\", \"Courier New\", monospace",
              fontSize: "0.68rem",
              lineHeight: 1.55,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              pointerEvents: "none",
              whiteSpace: "pre-wrap",
            }}
          >
            {[
              `reduced: ${pointerDebugState?.reducedMotion ? "true" : "false"} / prefers: ${
                pointerDebugState?.prefersReducedMotion ? "true" : "false"
              }`,
              `dom: ${pointerDebugState?.domPointerInside ? "inside" : "outside"} x=${
                pointerDebugState?.domPointerClientX?.toFixed(1) ?? "null"
              } y=${pointerDebugState?.domPointerClientY?.toFixed(1) ?? "null"}`,
              `r3f: x=${pointerDebugState?.r3fPointerX?.toFixed(3) ?? "0.000"} y=${
                pointerDebugState?.r3fPointerY?.toFixed(3) ?? "0.000"
              }`,
              `model: x=${pointerDebugState?.modelRotationX?.toFixed(3) ?? "null"} y=${
                pointerDebugState?.modelRotationY?.toFixed(3) ?? "null"
              } z=${pointerDebugState?.modelRotationZ?.toFixed(3) ?? "null"}`,
            ].join("\n")}
          </div>
        ) : null}
        {showShotSelector || showCardDebugToggle ? (
          <div
            data-alche-shot-selector
            style={{
              position: "absolute",
              right: "1rem",
              bottom: pointerDebugEnabled ? "10rem" : "1rem",
              zIndex: 30,
              width: "min(22rem, calc(100vw - 2rem))",
              padding: "0.8rem 0.9rem",
              borderRadius: "0.85rem",
              background: "rgba(8, 8, 12, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#fff",
              fontFamily: "\"IBM Plex Mono\", \"Courier New\", monospace",
              fontSize: "0.7rem",
              lineHeight: 1.5,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              pointerEvents: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
              <strong style={{ fontSize: "0.74rem" }}>{showShotSelector ? "MOONFLOW Shotbook" : "MOONFLOW Card Debug"}</strong>
              <span style={{ color: "rgba(255,255,255,0.62)" }}>
                {currentShotId ?? "manual"} / {currentCardDebugMode}
              </span>
            </div>
            {showShotSelector ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0.5rem", marginTop: "0.65rem" }}>
                <select
                  value={currentShotId ?? ""}
                  onChange={(event) => handleShotOverride(readAlcheWorksShotId(event.target.value))}
                  style={{
                    minWidth: 0,
                    padding: "0.5rem 0.65rem",
                    borderRadius: "0.6rem",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(18,22,28,0.95)",
                    color: "#fff",
                    font: "inherit",
                    textTransform: "none",
                  }}
                >
                  <option value="">manual / non-shot</option>
                  {ALCHE_WORKS_CAPTURE_SHOTS.map((shot) => (
                    <option key={shot.id} value={shot.id}>
                      {shot.id}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => currentShotId && handleShotOverride(getAdjacentAlcheWorksShotId(currentShotId, -1))}
                  disabled={!currentShotId || !getAdjacentAlcheWorksShotId(currentShotId, -1)}
                  style={{
                    padding: "0.5rem 0.7rem",
                    borderRadius: "0.6rem",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(18,22,28,0.95)",
                    color: "#fff",
                    font: "inherit",
                  }}
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => currentShotId && handleShotOverride(getAdjacentAlcheWorksShotId(currentShotId, 1))}
                  disabled={!currentShotId || !getAdjacentAlcheWorksShotId(currentShotId, 1)}
                  style={{
                    padding: "0.5rem 0.7rem",
                    borderRadius: "0.6rem",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(18,22,28,0.95)",
                    color: "#fff",
                    font: "inherit",
                  }}
                >
                  Next
                </button>
              </div>
            ) : null}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
              {(["identity", "poster"] as const).map((mode) => {
                const selected = currentCardDebugMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleCardDebugModeChange(mode)}
                    style={{
                      padding: "0.5rem 0.7rem",
                      borderRadius: "0.6rem",
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: selected ? "rgba(124, 156, 255, 0.24)" : "rgba(18,22,28,0.95)",
                      color: "#fff",
                      font: "inherit",
                    }}
                  >
                    {mode === "identity" ? "Identity" : "Poster"}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <main className={styles.sectionTrack}>
        {ALCHE_TOP_SCROLL_TRACK_SECTIONS.map((sectionId) => {
          const section = ALCHE_TOP_SECTIONS.find((entry) => entry.id === sectionId);
          if (!section) return null;

          return (
          <section
            key={section.id}
            id={section.id}
            ref={(node) => setSectionRef(section.id, node)}
            className={`${styles.section} ${styles[`section${section.id[0].toUpperCase()}${section.id.slice(1)}`] ?? ""}`}
            style={{ minHeight: section.minHeight }}
            data-top_section={section.id}
            data-snap-ratio={section.snapRatio}
            aria-label={section.label}
          >
            <h2 className="sr-only">{section.label}</h2>
          </section>
          );
        })}
      </main>
    </div>
  );
}
