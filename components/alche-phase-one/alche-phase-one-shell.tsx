"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";

import { alchePhaseOneCopy } from "@/data/alche-phase-one";
import {
  ALCHE_CAMERA_STATES,
  ALCHE_HUD_METRICS,
  ALCHE_PHASE_HEIGHTS,
  ALCHE_SCROLL_MACHINE,
  ALCHE_TIMINGS,
  type AlchePhaseId,
} from "@/lib/alche-phase-one";
import { ALCHE_HERO_LOCK, ALCHE_HERO_SHOTS } from "@/lib/alche-hero-lock";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { usePhaseScroll } from "@/components/alche-phase-one/use-phase-scroll";

import styles from "@/components/alche-phase-one/alche-phase-one-shell.module.scss";

const AlcheRoomCanvas = dynamic(
  () => import("@/components/alche-phase-one/alche-room-canvas").then((module) => module.AlcheRoomCanvas),
  { ssr: false },
);

interface AlchePhaseOneShellProps {
  locale: Locale;
}

type HeroOverlayStyle = CSSProperties & Record<`--${string}`, string>;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function AlchePhaseOneShell({ locale }: AlchePhaseOneShellProps) {
  const copy = alchePhaseOneCopy[locale];
  const router = useRouter();
  const sectionRefs = useRef<Record<AlchePhaseId, HTMLElement | null>>({
    hero: null,
    works: null,
    vision: null,
    service: null,
    outro: null,
  });
  const stageRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const heroCopyRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLHeadingElement | null>(null);
  const [canRenderLive, setCanRenderLive] = useState(true);
  const { reducedMotion, activePhase, heroShotId, phaseProgress, introProgress, scrollToPhase } = usePhaseScroll({
    sectionRefs,
  });
  const heroShot = heroShotId ? ALCHE_HERO_SHOTS[heroShotId] : null;

  useEffect(() => {
    setCanRenderLive(supportsWebGL());
  }, []);

  useEffect(() => {
    if (reducedMotion || heroShotId) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(
          stageRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: ALCHE_TIMINGS.overlayFade },
          0,
        )
        .fromTo(
          navRef.current,
          { y: -28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: ALCHE_TIMINGS.navReveal },
          ALCHE_TIMINGS.roomRevealDelay,
        )
        .fromTo(
          wordmarkRef.current,
          { yPercent: 11, autoAlpha: 0, filter: "blur(10px)", letterSpacing: "-0.12em" },
          {
            yPercent: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            letterSpacing: "-0.085em",
            duration: ALCHE_TIMINGS.wordmarkReveal,
          },
          ALCHE_TIMINGS.wordmarkOffset,
        )
        .fromTo(
          heroCopyRef.current,
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: ALCHE_TIMINGS.heroCopyReveal },
          ALCHE_TIMINGS.heroCopyOffset,
        )
        .fromTo(
          hudRef.current,
          { x: 24, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: ALCHE_TIMINGS.hudReveal },
          ALCHE_TIMINGS.hudOffset,
        );
    }, stageRef);

    return () => context.revert();
  }, [heroShotId, reducedMotion]);

  function setSectionRef(phase: AlchePhaseId, node: HTMLElement | null) {
    sectionRefs.current[phase] = node;
  }

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;
    localStorage.setItem(SITE.localeStorageKey, nextLocale);
    router.push(`/${nextLocale}/`);
  }

  const futurePhase = activePhase === "hero" ? "works" : activePhase;
  const heroLift = reducedMotion ? 0 : phaseProgress * 54;
  const heroOpacity =
    activePhase === "hero" ? (heroShot?.heroOpacity ?? 1) : reducedMotion ? 0.82 : 0.54;
  const cameraDepth = ALCHE_CAMERA_STATES[activePhase].position[2].toFixed(2);
  const heroRevealProgress = heroShot ? heroShot.introProgress : introProgress;
  const canvasIntroProgress = heroShot ? Math.max(heroRevealProgress, 0.98) : heroRevealProgress;
  const hudContrast = heroShot ? heroShot.hudEmphasis.contrast : 0.84;
  const telemetry = useMemo(
    () => [
      { label: "INTRO", value: `${Math.round(heroRevealProgress * 100).toString().padStart(3, "0")}%` },
      { label: "STATE", value: ALCHE_SCROLL_MACHINE.find((item) => item.id === activePhase)?.code ?? "S-00" },
      { label: "CAM_Z", value: cameraDepth },
      { label: "PRG", value: `${Math.round(phaseProgress * 100).toString().padStart(3, "0")}%` },
    ],
    [activePhase, cameraDepth, heroRevealProgress, phaseProgress],
  );
  const captureNavOpacity = heroShot ? Math.min(Math.max((heroRevealProgress - 0.12) / 0.36, 0), 1) : undefined;
  const captureWordmarkOpacity = heroShot ? Math.min(Math.max((heroRevealProgress - 0.42) / 0.56, 0), 1) : undefined;
  const captureCopyOpacity = heroShot ? Math.min(Math.max((heroRevealProgress - 0.46) / 0.5, 0), 1) : undefined;
  const captureHudOpacity = heroShot ? Math.min(Math.max((heroRevealProgress - 0.58) / 0.36, 0), 1) : undefined;
  const overlayVars = useMemo(
    () =>
      ({
        "--alche-hero-copy-max-width": ALCHE_HERO_LOCK.typography.heroCopyMaxWidth,
        "--alche-wordmark-font-size": ALCHE_HERO_LOCK.typography.wordmarkFontSize,
        "--alche-wordmark-tracking": ALCHE_HERO_LOCK.typography.wordmarkTracking,
        "--alche-wordmark-line-height": String(ALCHE_HERO_LOCK.typography.wordmarkLineHeight),
        "--alche-wordmark-left": ALCHE_HERO_LOCK.typography.wordmarkLeft,
        "--alche-wordmark-top": ALCHE_HERO_LOCK.typography.wordmarkTop,
        "--alche-wordmark-baseline-offset": ALCHE_HERO_LOCK.typography.wordmarkBaselineOffset,
        "--alche-hero-body-width": ALCHE_HERO_LOCK.typography.bodyBlockWidth,
        "--alche-hero-lift": `${heroLift}px`,
        "--alche-hud-top": ALCHE_HERO_LOCK.hud.top,
        "--alche-hud-right": ALCHE_HERO_LOCK.hud.right,
        "--alche-hud-width": ALCHE_HERO_LOCK.hud.width,
        "--alche-hud-frame-opacity": String(
          ALCHE_HERO_LOCK.hud.frameOpacity * (heroShot?.hudEmphasis.frameOpacity ?? 1),
        ),
        "--alche-hud-telemetry-opacity": String(
          ALCHE_HERO_LOCK.hud.telemetryOpacity * (heroShot?.hudEmphasis.telemetryOpacity ?? 1),
        ),
        "--alche-hud-list-opacity": String(ALCHE_HERO_LOCK.hud.listOpacity * (heroShot?.hudEmphasis.listOpacity ?? 1)),
        "--alche-hud-contrast": String(hudContrast),
      }) as HeroOverlayStyle,
    [heroLift, heroShot, hudContrast],
  );
  const wordmarkStyle = heroShot
    ? (() => {
        const wordmarkOpacity = captureWordmarkOpacity ?? 1;
        return {
          opacity: wordmarkOpacity,
          filter: `blur(${(1 - wordmarkOpacity) * 10}px)`,
          letterSpacing: `calc(${ALCHE_HERO_LOCK.typography.wordmarkTracking} - ${(1 - wordmarkOpacity) * 0.03}em)`,
        } satisfies CSSProperties;
      })()
    : undefined;
  const heroCopyStyle = heroShot
    ? ({ opacity: captureCopyOpacity } satisfies CSSProperties)
    : undefined;
  const hudStyle = heroShot
    ? ({ opacity: captureHudOpacity } satisfies CSSProperties)
    : undefined;
  const navStyle = heroShot
    ? ({ opacity: captureNavOpacity } satisfies CSSProperties)
    : undefined;

  return (
    <div className={styles.root}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.canvasLayer}>
          {canRenderLive ? (
            <AlcheRoomCanvas
              activePhase={activePhase}
              heroShotId={heroShotId}
              phaseProgress={phaseProgress}
              introProgress={canvasIntroProgress}
              reducedMotion={reducedMotion}
            />
          ) : (
            <div className={styles.fallback}>
              <p>WebGL unavailable. Phase 1 fallback keeps the scroll/state shell alive, but not the room.</p>
            </div>
          )}
        </div>

        <div className={styles.overlay}>
          <div ref={navRef} className={styles.topBar} style={navStyle}>
            <div className={styles.brand}>
              <span className={styles.brandMark} aria-hidden="true" />
              <div className={styles.brandText}>
                <span>ALCHE STUDIO</span>
                <span>PHASE 1 PROTOTYPE</span>
              </div>
            </div>

            <div className={styles.navCluster}>
              <nav className={styles.nav} aria-label={copy.nav.ariaLabel}>
                {copy.nav.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.navButton} ${activePhase === item.id ? styles.navButtonActive : ""}`}
                    onClick={() => scrollToPhase(sectionRefs.current[item.id])}
                  >
                    <span className={styles.navCode}>
                      {ALCHE_SCROLL_MACHINE.find((entry) => entry.id === item.id)?.code ?? "S-00"}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <label className={styles.localeField}>
                <span className="sr-only">{copy.nav.localeLabel}</span>
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
          </div>

          <div className={styles.heroOverlay} style={{ ...overlayVars, opacity: heroOpacity }}>
            <div
              ref={heroCopyRef}
              className={styles.heroCopy}
              style={heroCopyStyle}
            >
              <p className={styles.eyebrow}>{copy.hero.eyebrow}</p>
              <h1 ref={wordmarkRef} className={styles.wordmark} style={wordmarkStyle}>
                ALCHE
              </h1>
              <div className={styles.wordmarkShadow} aria-hidden="true" style={wordmarkStyle}>
                ALCHE
              </div>
              <div className={styles.heroBody}>
                <p className={styles.lead}>{copy.hero.lead}</p>
                <p className={styles.body}>{copy.hero.body}</p>
                <p className={styles.scrollCue}>{copy.hero.scrollLabel}</p>
              </div>
            </div>

            <aside ref={hudRef} className={styles.hud} style={hudStyle}>
              <div className={styles.hudFrame}>
                <div className={styles.hudHeader}>
                  <p className={styles.hudTitle}>{copy.hud.title}</p>
                  <p className={styles.hudSubtitle}>{copy.hud.subtitle}</p>
                </div>

                <div className={styles.telemetry}>
                  {telemetry.map((item) => (
                    <div key={item.label} className={styles.telemetryItem}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  ))}
                </div>

                <ul className={styles.hudList}>
                  {[...ALCHE_HUD_METRICS].map((metric, index) => (
                    <li key={metric} className={styles.hudItem}>
                      <span className={styles.hudItemIndex}>{String(index + 1).padStart(2, "0")}</span>
                      <span>{copy.hud.readouts[index] ?? metric}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.stateMachine}>
                  <p className={styles.stateMachineTitle}>STATE MACHINE</p>
                  <div className={styles.stateMachineList}>
                    {ALCHE_SCROLL_MACHINE.map((item) => {
                      const isActive = item.id === futurePhase;
                      return (
                        <div key={item.id} className={`${styles.stateNode} ${isActive ? styles.stateNodeActive : ""}`}>
                          <span>{item.code}</span>
                          <strong>{item.label}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.notes}>
                  <p className={styles.notesTitle}>{copy.notes.title}</p>
                  <p className={styles.notesBody}>{copy.notes.body}</p>
                </div>
              </div>
            </aside>
          </div>

          <div className={styles.futureIndicator}>
            <span>ACTIVE</span>
            <span>{copy.nav.items.find((item) => item.id === futurePhase)?.label ?? futurePhase}</span>
          </div>
        </div>
      </div>

      <main className={styles.phaseTrack}>
        <section
          id="hero"
          ref={(node) => setSectionRef("hero", node)}
          className={`${styles.phaseSection} ${styles.phaseSectionHero}`}
          style={{ minHeight: ALCHE_PHASE_HEIGHTS.hero }}
          aria-label="Hero phase"
        />

        {(["works", "vision", "service", "outro"] as const).map((phaseId) => (
          <section
            key={phaseId}
            id={phaseId}
            ref={(node) => setSectionRef(phaseId, node)}
            className={`${styles.phaseSection} ${
              phaseId === "works"
                ? styles.phaseSectionWorks
                : phaseId === "vision"
                  ? styles.phaseSectionVision
                  : phaseId === "service"
                    ? styles.phaseSectionService
                    : styles.phaseSectionOutro
            }`}
            style={{ minHeight: ALCHE_PHASE_HEIGHTS[phaseId] }}
            aria-label={`${phaseId} phase`}
          >
            <div className={`${styles.phaseBeacon} ${activePhase === phaseId ? styles.activeBeacon : ""}`}>
              <p className={styles.phaseIndex}>{copy.sections[phaseId].index}</p>
              <h2 className={styles.phaseLabel}>{copy.sections[phaseId].label}</h2>
              <p className={styles.phaseNote}>{copy.sections[phaseId].note}</p>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
