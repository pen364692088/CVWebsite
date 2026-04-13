"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";

import { alcheTopPageCopy } from "@/data/alche-top-page";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import {
  ALCHE_TOP_RENDERABLE_SECTIONS,
  ALCHE_TOP_RUNTIME_MODE,
  ALCHE_TOP_SECTION_IDS,
  ALCHE_TOP_SECTIONS,
  normalizeTopRuntimeSection,
  type AlcheScrollableSectionId,
  type AlcheTopSectionId,
} from "@/lib/alche-top-page";
import { readAlcheHeroShotId } from "@/lib/alche-hero-lock";
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

function readShellDebugOverride(params: Pick<URLSearchParams, "get"> | null) {
  if (!params) return null;
  const section = params.get("alcheSection");
  if (!section || !ALCHE_TOP_SECTION_IDS.includes(section as AlcheTopSectionId)) return null;
  const normalizedSection = normalizeTopRuntimeSection(section as AlcheTopSectionId);

  return {
    section: normalizedSection,
    progress: Number(params.get("alcheProgress") ?? (normalizedSection === "loading" ? "0" : "1")),
    intro: Number(params.get("alcheIntro") ?? (normalizedSection === "loading" ? "0.2" : "1")),
    heroShotId: readAlcheHeroShotId(params.get("alcheHeroShot")),
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
    url.searchParams.delete("alcheSection");
    url.searchParams.delete("alcheProgress");
    url.searchParams.delete("alcheIntro");
    url.searchParams.delete("alcheHeroShot");
  } else {
    url.searchParams.set("alcheSection", normalizedOverride.section);
    url.searchParams.set("alcheProgress", String(normalizedOverride.progress));
    url.searchParams.set("alcheIntro", String(normalizedOverride.intro));

    if (normalizedOverride.heroShotId) {
      url.searchParams.set("alcheHeroShot", normalizedOverride.heroShotId);
    } else {
      url.searchParams.delete("alcheHeroShot");
    }
  }

  window.history.replaceState(window.history.state, "", url.toString());
}

type AlcheShellDebugOverride = NonNullable<ReturnType<typeof readShellDebugOverride>>;

export function AlcheTopPageShell({ locale }: AlcheTopPageShellProps) {
  const copy = alcheTopPageCopy[locale];
  const router = useRouter();
  const kvOnly = ALCHE_TOP_RUNTIME_MODE === "kv-only";
  const stageRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<AlcheScrollableSectionId, HTMLElement | null>>({
    kv: null,
    works_intro: null,
    works: null,
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
  const [debugOverrideVersion, setDebugOverrideVersion] = useState(0);
  const { reducedMotion, activeSection, trackedSection, sectionProgress, introProgress, heroShotId, scrollToSection } =
    useTopPageScroll({
      sectionRefs,
    });
  const debugOverride = typeof window === "undefined" ? null : readShellDebugOverride(new URLSearchParams(window.location.search));
  const currentActiveSection = normalizeTopRuntimeSection(debugOverride?.section ?? activeSection);
  const currentTrackedSection =
    currentActiveSection === "loading"
      ? "kv"
      : ((debugOverride?.section as AlcheScrollableSectionId | undefined) ?? trackedSection ?? "kv");
  const currentSectionProgress = debugOverride?.progress ?? sectionProgress;
  const currentIntroProgress = debugOverride?.intro ?? introProgress;
  const currentHeroShotId = debugOverride?.heroShotId ?? heroShotId;
  const kvWallTexturePath = assetPath("/alche-top-page/kv/hero-wall-grid-white.png");

  useEffect(() => {
    setCanRenderLive(supportsWebGL());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCaptureMode(new URLSearchParams(window.location.search).get("alcheCapture") === "1");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window as typeof window & {
      __setAlcheDebugOverride?: (nextOverride: AlcheShellDebugOverride | null) => void;
      __setAlcheSceneOverride?: (nextOverride: AlcheShellDebugOverride | null) => void;
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
      host.__setAlcheSceneOverride?.(normalizedOverride);

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
  const introSettled = currentActiveSection !== "loading" && (currentIntroProgress > 0.995 || captureMode);

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
      }) as CSSProperties,
    [currentIntroProgress],
  );

  return (
    <div
      ref={stageRef}
      className={styles.root}
      style={stageStyle}
      data-active-section={currentActiveSection}
      data-tracked-section={currentTrackedSection}
      data-intro-ready={introSettled ? "true" : "false"}
      data-render-active-section={currentActiveSection}
      data-render-tracked-section={currentTrackedSection}
      data-render-intro-ready={introSettled ? "true" : "false"}
      data-render-debug-version={debugOverrideVersion}
    >
      <div className={styles.stage}>
        <div className={styles.canvasLayer}>
          {canRenderLive ? (
            <AlcheTopPageCanvas
              activeSection={currentActiveSection}
              sectionProgress={currentSectionProgress}
              introProgress={currentIntroProgress}
              heroShotId={currentHeroShotId}
              reducedMotion={reducedMotion}
              kvOnly={kvOnly}
              kvWallTexturePath={kvWallTexturePath}
              workCount={copy.works.items.length}
              serviceCount={copy.service.items.length}
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

          <header className={styles.header}>
            <button type="button" className={styles.headerBrand} onClick={() => scrollToSection(sectionRefs.current.kv)}>
              <span className={styles.headerBrandWord}>ALCHE</span>
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
      </div>

      <main className={styles.sectionTrack}>
        {ALCHE_TOP_RENDERABLE_SECTIONS.map((sectionId) => {
          const section = ALCHE_TOP_SECTIONS.find((entry) => entry.id === sectionId);
          if (!section) return null;

          return (
          <section
            key={section.id}
            id={section.id}
            ref={(node) => setSectionRef(section.id, node)}
            className={`${styles.section} ${styles[`section${section.id[0].toUpperCase()}${section.id.slice(1)}`] ?? ""}`}
            style={{ minHeight: kvOnly ? "100svh" : section.minHeight }}
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
