"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";

import { alcheContractCopy } from "@/data/alche-contract";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import {
  ALCHE_HUD_METRICS,
  ALCHE_PHASE_HEIGHTS,
  ALCHE_SCROLL_MACHINE,
  ALCHE_TIMINGS,
  deriveAboutState,
  deriveContactState,
  deriveStellaState,
  deriveWorksPresentation,
  remapRange,
  type AlchePhaseId,
} from "@/lib/alche-contract";
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
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

type OverlayStyle = CSSProperties & Record<`--${string}`, string>;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function AlchePhaseOneShell({ locale, contacts, dossier }: AlchePhaseOneShellProps) {
  const copy = alcheContractCopy[locale];
  const router = useRouter();
  const sectionRefs = useRef<Record<AlchePhaseId, HTMLElement | null>>({
    hero: null,
    works: null,
    about: null,
    stella: null,
    contact: null,
  });
  const stageRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const debugRef = useRef<HTMLDivElement | null>(null);
  const [canRenderLive, setCanRenderLive] = useState(true);
  const { reducedMotion, activePhase, heroShotId, phaseProgress, introProgress, scrollToPhase } = usePhaseScroll({
    sectionRefs,
  });

  const heroShot = heroShotId ? ALCHE_HERO_SHOTS[heroShotId] : null;
  const worksState = deriveWorksPresentation(activePhase === "works" ? phaseProgress : activePhase === "about" ? 1 : 0);
  const aboutState = deriveAboutState(activePhase === "about" ? phaseProgress : activePhase === "stella" || activePhase === "contact" ? 1 : 0);
  const stellaState = deriveStellaState(activePhase === "stella" ? phaseProgress : activePhase === "contact" ? 1 : 0);
  const contactState = deriveContactState(activePhase === "contact" ? phaseProgress : 0);

  useEffect(() => {
    setCanRenderLive(supportsWebGL());
  }, []);

  useEffect(() => {
    if (reducedMotion || heroShotId) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(stageRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: ALCHE_TIMINGS.overlayFade }, 0)
        .fromTo(navRef.current, { y: -24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: ALCHE_TIMINGS.navReveal }, 0.18)
        .fromTo(railRef.current, { x: -18, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: ALCHE_TIMINGS.railReveal }, 0.28)
        .fromTo(hudRef.current, { x: 24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: ALCHE_TIMINGS.hudReveal }, 0.42)
        .fromTo(debugRef.current, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.82 }, 0.52);
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

  const activeWorkCard = copy.works.cards[Math.min(copy.works.cards.length - 1, worksState.activeIndex)] ?? copy.works.cards[0];
  const captureNavOpacity = heroShot ? remapRange(heroShot.introProgress, 0.1, 0.44) : 1;
  const captureHudOpacity = heroShot ? remapRange(heroShot.introProgress, 0.52, 0.9) : 1;
  const heroHudOpacity =
    activePhase === "hero"
      ? heroShot?.heroOpacity ?? 1
      : activePhase === "works"
        ? 1 - remapRange(phaseProgress, 0.04, 0.24)
        : 0;
  const debugOpacity =
    activePhase === "hero"
      ? heroShot?.heroOpacity ?? 1
      : activePhase === "works"
        ? 1 - remapRange(phaseProgress, 0.02, 0.18)
        : 0;
  const worksPanelOpacity =
    activePhase === "works"
      ? worksState.cardMix
      : activePhase === "about"
        ? 1 - remapRange(phaseProgress, 0.02, 0.18)
        : 0;
  const aboutPanelOpacity = activePhase === "about" ? aboutState.emblemMix : 0;
  const stellaPanelOpacity = activePhase === "stella" ? stellaState.editorialMix : 0;
  const contactPanelOpacity = activePhase === "contact" ? contactState.footerMix : 0;

  const overlayVars = useMemo(
    () =>
      ({
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
        "--alche-hud-contrast": String(heroShot?.hudEmphasis.contrast ?? 0.92),
      }) as OverlayStyle,
    [heroShot],
  );

  const telemetry = useMemo(
    () => [
      { label: "INTRO", value: `${Math.round((heroShot?.introProgress ?? introProgress) * 100).toString().padStart(3, "0")}%` },
      { label: "STATE", value: ALCHE_SCROLL_MACHINE.find((item) => item.id === activePhase)?.code ?? "S-00" },
      { label: "FLOW", value: `${Math.round(phaseProgress * 100).toString().padStart(3, "0")}%` },
      { label: "WORLD", value: activePhase.toUpperCase() },
    ],
    [activePhase, heroShot, introProgress, phaseProgress],
  );

  return (
    <div className={styles.root}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.canvasLayer}>
          {canRenderLive ? (
            <AlcheRoomCanvas
              activePhase={activePhase}
              heroShotId={heroShotId}
              phaseProgress={phaseProgress}
              introProgress={heroShot ? Math.max(heroShot.introProgress, 0.98) : introProgress}
              reducedMotion={reducedMotion}
            />
          ) : (
            <div className={styles.fallback}>
              <p>WebGL unavailable. The DOM shell remains accessible, but the contract scene is disabled.</p>
            </div>
          )}
        </div>

        <div className={styles.overlay}>
          <div className={styles.loadingMask} style={{ opacity: heroShot ? 0 : 1 - introProgress }}>
            <p>{copy.loadingLabel}</p>
          </div>

          <div ref={navRef} className={styles.topBar} style={{ opacity: captureNavOpacity }}>
            <button type="button" className={styles.brand} onClick={() => scrollToPhase(sectionRefs.current.hero)}>
              <span className={styles.brandMark} aria-hidden="true" />
              <span className={styles.brandWord}>ALCHE</span>
            </button>

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

          <aside ref={railRef} className={styles.stateRail}>
            {ALCHE_SCROLL_MACHINE.map((item) => {
              const isActive = item.id === activePhase;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.railNode} ${isActive ? styles.railNodeActive : ""}`}
                  onClick={() => scrollToPhase(sectionRefs.current[item.id])}
                >
                  <span>{item.code}</span>
                  <strong>{copy.nav.items.find((entry) => entry.id === item.id)?.label ?? item.label}</strong>
                </button>
              );
            })}
          </aside>

          <aside ref={hudRef} className={styles.hud} style={{ ...overlayVars, opacity: heroHudOpacity * captureHudOpacity }}>
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
                {ALCHE_HUD_METRICS.map((metric, index) => (
                  <li key={metric} className={styles.hudItem}>
                    <span className={styles.hudItemIndex}>{String(index + 1).padStart(2, "0")}</span>
                    <span>{copy.hud.readouts[index] ?? metric}</span>
                  </li>
                ))}
              </ul>

              <div className={styles.notes}>
                <p className={styles.notesTitle}>{copy.hud.noteTitle}</p>
                <p className={styles.notesBody}>{copy.hud.noteBody}</p>
              </div>
            </div>
          </aside>

          <div ref={debugRef} className={styles.debugPanel} style={{ opacity: debugOpacity }}>
            <p className={styles.debugTitle}>MAIN LOGO MATERIAL</p>
            <div className={styles.debugGrid}>
              <span>roughness</span>
              <span>0.10</span>
              <span>noiseScale</span>
              <span>9.0</span>
              <span>refraction</span>
              <span>primary</span>
            </div>
          </div>

          <div className={styles.phasePanelWrap}>
            <section className={styles.phasePanel} style={{ opacity: worksPanelOpacity }}>
              <p className={styles.phaseEyebrow}>{copy.works.eyebrow}</p>
              <p className={styles.phaseCode}>{activeWorkCard.code}</p>
              <h2 className={styles.phaseTitle}>{activeWorkCard.title}</h2>
              <p className={styles.phaseLead}>{activeWorkCard.subtitle}</p>
              <p className={styles.phaseBody}>{copy.works.body}</p>
              <ul className={styles.metaList}>
                {activeWorkCard.meta.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={`${styles.phasePanel} ${styles.phasePanelLight}`} style={{ opacity: aboutPanelOpacity }}>
              <p className={styles.phaseEyebrow}>{copy.about.eyebrow}</p>
              <h2 className={styles.phaseTitle}>{copy.about.title}</h2>
              <p className={styles.phaseBody}>{copy.about.body}</p>
            </section>

            <section className={styles.stellaPanel} style={{ opacity: stellaPanelOpacity }}>
              <p className={styles.phaseEyebrow}>{copy.stella.eyebrow}</p>
              <h2 className={styles.stellaWord}>stella</h2>
              <p className={styles.phaseBody}>{copy.stella.body}</p>
            </section>

            <section className={styles.contactPanel} style={{ opacity: contactPanelOpacity }}>
              <p className={styles.phaseEyebrow}>{copy.contact.eyebrow}</p>
              <h2 className={styles.contactWord}>ALCHE</h2>
              <p className={styles.phaseBody}>{copy.contact.body}</p>
              <div className={styles.footerMeta}>
                <p className={styles.footerMetaTitle}>{copy.contact.linksTitle}</p>
                <div className={styles.footerLinks}>
                  {contacts.map((link) =>
                    link.available ? (
                      <a key={link.key} href={link.href} className={styles.footerLink} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <span key={link.key} className={`${styles.footerLink} ${styles.footerLinkMuted}`}>
                        {link.label || link.key}
                      </span>
                    ),
                  )}
                  {!dossier.available ? null : (
                    <a href={dossier.href} className={styles.footerLink} target="_blank" rel="noreferrer">
                      Dossier
                    </a>
                  )}
                </div>
                <p className={styles.companyLabel}>{copy.contact.companyLabel}</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <main className={styles.phaseTrack}>
        {(["hero", "works", "about", "stella", "contact"] as const).map((phaseId) => (
          <section
            key={phaseId}
            id={phaseId}
            ref={(node) => setSectionRef(phaseId, node)}
            className={`${styles.phaseSection} ${styles[`phaseSection${phaseId[0].toUpperCase()}${phaseId.slice(1)}`]}`}
            style={{ minHeight: ALCHE_PHASE_HEIGHTS[phaseId] }}
            aria-label={`${phaseId} phase`}
          >
            <h2 className="sr-only">{copy.nav.items.find((item) => item.id === phaseId)?.label ?? phaseId}</h2>
          </section>
        ))}
      </main>
    </div>
  );
}
