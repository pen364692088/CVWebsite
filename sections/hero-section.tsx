"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

import type { ArtifactView } from "@/data/artifacts";
import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";

interface HeroSectionProps {
  navCopy: Dictionary["nav"];
  copy: Dictionary["hero"];
  ritualCopy: Dictionary["game"];
  activeLens: ArchiveLens;
  artifacts: Array<ArtifactView & { caseNumber: string }>;
  onArtifactOpen: (slug: string) => void;
  onLensChange: (lens: ArchiveLens) => void;
}

type HeroState = "dormant" | "recognition" | "displacement" | "emergence" | "hold";

const HERO_SESSION_KEY = "ashen-archive-monolith-intro-played";
const PRIMARY_EASE = [0.22, 1, 0.36, 1] as const;
const SECONDARY_EASE = [0.32, 0.72, 0, 1] as const;
const STATE_ORDER: HeroState[] = ["dormant", "recognition", "displacement", "emergence", "hold"];

const TOP_NAV_CLASSNAMES = [
  "sealed-hero-nav-link-index",
  "sealed-hero-nav-link-archive",
  "sealed-hero-nav-link-lore",
] as const;

function getStateIndex(state: HeroState) {
  return STATE_ORDER.indexOf(state);
}

function buildTimeline(reducedMotion: boolean) {
  if (reducedMotion) {
    return [
      { state: "dormant" as const, delay: 0 },
      { state: "recognition" as const, delay: 260 },
      { state: "emergence" as const, delay: 780 },
      { state: "hold" as const, delay: 1380 },
    ];
  }

  return [
    { state: "dormant" as const, delay: 0 },
    { state: "recognition" as const, delay: 1200 },
    { state: "displacement" as const, delay: 2400 },
    { state: "emergence" as const, delay: 3600 },
    { state: "hold" as const, delay: 5200 },
  ];
}

export function HeroSection({ navCopy, copy, ritualCopy, activeLens, artifacts, onArtifactOpen, onLensChange }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = !!prefersReducedMotion;
  const [heroState, setHeroState] = useState<HeroState>("dormant");
  const [isHovered, setIsHovered] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);

  const currentLens = useMemo(
    () => ritualCopy.options.find((option) => option.id === activeLens) ?? ritualCopy.options[0],
    [activeLens, ritualCopy.options],
  );

  const currentLensSummary = copy.lensSummary[activeLens];
  const phaseIndex = getStateIndex(heroState);
  const recognitionActive = phaseIndex >= getStateIndex("recognition");
  const displacementActive = !reducedMotion && phaseIndex >= getStateIndex("displacement");
  const emergenceActive = phaseIndex >= getStateIndex("emergence");
  const holdActive = phaseIndex >= getStateIndex("hold");

  const topNavItems = useMemo(() => navCopy.items.filter((item) => item.id !== "fire").slice(0, 3), [navCopy.items]);
  const archiveLabels = useMemo(
    () => [
      {
        id: "profile",
        label: topNavItems[0]?.label ?? "Profile",
        text: currentLens.title,
      },
      {
        id: "approach",
        label: topNavItems[1]?.label ?? "Approach",
        text: currentLensSummary.title,
      },
      {
        id: "archive",
        label: topNavItems[2]?.label ?? "Archive",
        text: artifacts[1]?.title ?? artifacts[0]?.title ?? navCopy.title,
      },
    ],
    [artifacts, currentLens.title, currentLensSummary.title, navCopy.title, topNavItems],
  );

  const archiveRail = useMemo(() => artifacts.slice(0, 3), [artifacts]);
  const monolithShift = displacementActive ? 12 : 0;
  const scrollScale = reducedMotion ? 1 : 1 - scrollRatio * 0.08;
  const scrollY = reducedMotion ? 0 : scrollRatio * -44;
  const hoverBoost = isHovered && holdActive ? 1 : 0;

  useEffect(() => {
    let frame = 0;

    const handleScroll = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        const nextRatio = Math.min(window.scrollY / Math.max(window.innerHeight * 0.68, 1), 1);
        setScrollRatio(nextRatio);
        frame = 0;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadyPlayed = window.sessionStorage.getItem(HERO_SESSION_KEY) === "true";

    if (alreadyPlayed) {
      setHeroState("hold");
      return;
    }

    const timers = buildTimeline(reducedMotion).map(({ state, delay }) =>
      window.setTimeout(() => {
        setHeroState(state);
      }, delay),
    );

    const completionDelay = reducedMotion ? 1450 : 5300;
    const completion = window.setTimeout(() => {
      window.sessionStorage.setItem(HERO_SESSION_KEY, "true");
    }, completionDelay);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completion);
    };
  }, [reducedMotion]);

  function handleEnterArchive(targetId = "artifacts") {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <section className="sealed-hero" aria-labelledby="hero-title">
      <div className="sealed-hero-shell">
        <div className="sealed-hero-topbar">
          <div className="sealed-hero-brand">
            <span className="sealed-hero-brand-mark" aria-hidden="true" />
            <div>
              <p className="sealed-hero-brand-name">{copy.identity}</p>
              <p className="sealed-hero-brand-subline">{copy.studioCredit}</p>
            </div>
          </div>

          <nav className="sealed-hero-nav" aria-label="Hero">
            {topNavItems.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`sealed-hero-nav-link ${TOP_NAV_CLASSNAMES[index] ?? ""}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <motion.div
          className="sealed-hero-stage"
          style={{ scale: scrollScale, y: scrollY }}
          transition={{ duration: 0.5, ease: PRIMARY_EASE }}
        >
          <div className="sealed-hero-environment" aria-hidden="true">
            <div className="sealed-hero-vignette" />
            <div className="sealed-hero-floor-glow" />
            <div className="sealed-hero-fog sealed-hero-fog-left" />
            <div className="sealed-hero-fog sealed-hero-fog-right" />
          </div>

          <motion.div
            className="sealed-monolith-wrap"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            transition={{ duration: 0.9, ease: PRIMARY_EASE }}
          >
            <div className="sealed-monolith-depth" aria-hidden="true" />

            <motion.div
              className="sealed-monolith"
              animate={{
                boxShadow: holdActive
                  ? "0 48px 120px rgba(0, 0, 0, 0.44)"
                  : "0 36px 90px rgba(0, 0, 0, 0.36)",
              }}
              transition={{ duration: 1.1, ease: PRIMARY_EASE }}
            >
              <motion.div
                className="sealed-monolith-front"
                animate={{
                  x: monolithShift,
                  opacity: 1,
                  filter: `brightness(${recognitionActive ? 1.04 + hoverBoost * 0.03 : 1})`,
                }}
                transition={{ duration: reducedMotion ? 0.45 : 1.02, ease: SECONDARY_EASE }}
              >
                <div className="sealed-monolith-front-texture" aria-hidden="true" />
                <div className="sealed-monolith-front-index sealed-monolith-front-index-left" aria-hidden="true">
                  <span>ZW</span>
                  <span>IDENT-0932</span>
                </div>
                <div className="sealed-monolith-front-index sealed-monolith-front-index-right" aria-hidden="true">
                  <span>ARCHIVE</span>
                  <span>ACCESS LEVEL 01</span>
                </div>

                {!reducedMotion ? (
                  <motion.div
                    className="sealed-monolith-scanline"
                    aria-hidden="true"
                    initial={{ opacity: 0, x: "-18%" }}
                    animate={
                      recognitionActive
                        ? { opacity: [0, 0.75, 0], x: ["-18%", "10%", "18%"] }
                        : { opacity: 0, x: "-18%" }
                    }
                    transition={{ duration: 1.18, ease: PRIMARY_EASE, times: [0, 0.35, 1] }}
                  />
                ) : null}

                <div className="sealed-monolith-titleblock">
                  <motion.p
                    className="sealed-monolith-name"
                    initial={false}
                    animate={{ opacity: recognitionActive ? 1 : 0.92, y: recognitionActive ? 0 : 4 }}
                    transition={{ duration: 0.5, ease: PRIMARY_EASE }}
                  >
                    {navCopy.identity}
                  </motion.p>
                  <motion.h1
                    id="hero-title"
                    className="sealed-monolith-statement"
                    initial={false}
                    animate={{ opacity: emergenceActive ? 1 : 0.86, y: emergenceActive ? 0 : 6 }}
                    transition={{ duration: 0.7, ease: PRIMARY_EASE }}
                  >
                    {copy.subtitle}
                  </motion.h1>
                </div>

                <motion.div
                  className="sealed-monolith-surface-details"
                  initial={false}
                  animate={{ opacity: recognitionActive ? 1 : 0, y: recognitionActive ? 0 : 4 }}
                  transition={{ duration: 0.55, ease: PRIMARY_EASE }}
                >
                  <span>{currentLens.label}</span>
                  <span>{copy.role}</span>
                </motion.div>
              </motion.div>

              <motion.div
                className="sealed-monolith-inner"
                initial={false}
                animate={{
                  opacity: emergenceActive ? 1 : 0,
                  x: emergenceActive ? 0 : -6,
                  clipPath: emergenceActive ? "inset(0% 0% 0% 0%)" : "inset(0% 100% 0% 0%)",
                }}
                transition={{ duration: reducedMotion ? 0.55 : 1.28, ease: PRIMARY_EASE }}
              >
                <motion.div
                  className="sealed-monolith-grid"
                  initial={false}
                  animate={{ opacity: emergenceActive ? 1 : 0 }}
                  transition={{ duration: 0.42, ease: PRIMARY_EASE }}
                />

                <div className="sealed-monolith-dossier">
                  <div className="sealed-monolith-dossier-header">
                    <span>{copy.archiveLabel}</span>
                    <span>{currentLensSummary.title}</span>
                  </div>

                  <div className="sealed-monolith-dossier-groups">
                    {archiveLabels.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="sealed-monolith-dossier-group"
                        initial={false}
                        animate={{ opacity: emergenceActive ? 1 : 0, y: emergenceActive ? 0 : 6 }}
                        transition={{
                          duration: 0.46,
                          delay: reducedMotion ? 0.08 + index * 0.04 : 0.16 + index * 0.08,
                          ease: PRIMARY_EASE,
                        }}
                      >
                        <p className="sealed-monolith-dossier-label">{item.label}</p>
                        <p className="sealed-monolith-dossier-value">{item.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.p
                    className="sealed-monolith-dossier-body"
                    initial={false}
                    animate={{ opacity: emergenceActive ? 1 : 0, y: emergenceActive ? 0 : 6 }}
                    transition={{ duration: 0.6, delay: reducedMotion ? 0.18 : 0.38, ease: PRIMARY_EASE }}
                  >
                    {currentLensSummary.body}
                  </motion.p>

                  <motion.div
                    className="sealed-monolith-dossier-footer"
                    initial={false}
                    animate={{ opacity: emergenceActive ? 1 : 0, y: emergenceActive ? 0 : 6 }}
                    transition={{ duration: 0.44, delay: reducedMotion ? 0.24 : 0.52, ease: PRIMARY_EASE }}
                  >
                    <button type="button" className="secondary-button sealed-monolith-cta" onClick={() => handleEnterArchive()}>
                      {copy.enterLabel}
                    </button>
                    <span className="sealed-monolith-cta-hint">{copy.projectLabel}</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="sealed-hero-bottomrail"
            initial={false}
            animate={{ opacity: recognitionActive ? 1 : 0.4, y: recognitionActive ? 0 : 8 }}
            transition={{ duration: 0.6, ease: PRIMARY_EASE }}
          >
            <div className="sealed-hero-bottomrail-rule" aria-hidden="true" />
            <div className="sealed-hero-bottomrail-items">
              {archiveRail.map((artifact, index) => (
                <button
                  key={artifact.slug}
                  type="button"
                  className="sealed-hero-index-item"
                  onClick={() => onArtifactOpen(artifact.slug)}
                >
                  <span className="sealed-hero-index-count">{String(index + 1).padStart(2, "0")}</span>
                  <span className="sealed-hero-index-label">{artifact.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="sealed-hero-side-note" aria-hidden="true">
          <span>Sealed Interface</span>
          <span>{heroState}</span>
        </div>

        <div className="sealed-hero-actions">
          <button type="button" className="primary-button" onClick={() => handleEnterArchive()}>
            {copy.enterLabel}
          </button>
          <button type="button" className="secondary-button" onClick={() => onLensChange(activeLens === "all" ? "moon" : "all")}>
            {activeLens === "all" ? ritualCopy.focusCta : currentLens.label}
          </button>
        </div>
      </div>
    </section>
  );
}
