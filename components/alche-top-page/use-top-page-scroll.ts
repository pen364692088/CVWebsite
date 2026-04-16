"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { readAlcheHeroShotId, type AlcheHeroShotId } from "@/lib/alche-hero-lock";
import { getAlcheWorksShotOverride, readAlcheWorksShotId } from "@/lib/alche-works-shotbook";
import {
  ALCHE_SCROLLABLE_SECTION_IDS,
  ALCHE_TOP_RENDERABLE_SECTIONS,
  ALCHE_TOP_SCROLL_TUNING,
  ALCHE_TOP_SECTION_IDS,
  ALCHE_TOP_TIMINGS,
  clamp01,
  deriveGroupProgress,
  deriveWorksWordHandoff,
  getTopGroupForSection,
  normalizeTopRuntimeSection,
  type AlcheScrollableSectionId,
  type AlcheTopGroupId,
  type AlcheTopSectionId,
} from "@/lib/alche-top-page";

interface UseTopPageScrollOptions {
  sectionRefs: React.MutableRefObject<Record<AlcheScrollableSectionId, HTMLElement | null>>;
}

interface DebugState {
  section: AlcheTopSectionId;
  progress: number;
  intro: number;
  heroShotId: AlcheHeroShotId | null;
}

function readDebugState(): DebugState | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const shotId = readAlcheWorksShotId(params.get("alcheShot"));
  const section = params.get("alcheSection") ?? params.get("alchePhase");
  const heroShotId = readAlcheHeroShotId(params.get("alcheHeroShot"));
  if (shotId) {
    const shotOverride = getAlcheWorksShotOverride(shotId);
    if (!shotOverride) return null;
    return {
      section: normalizeTopRuntimeSection(shotOverride.section),
      progress: clamp01(shotOverride.progress),
      intro: clamp01(shotOverride.intro),
      heroShotId,
    };
  }
  if (!section || !ALCHE_TOP_SECTION_IDS.includes(section as AlcheTopSectionId)) return null;
  const normalizedSection = normalizeTopRuntimeSection(section as AlcheTopSectionId);

  return {
    section: normalizedSection,
    progress: clamp01(Number(params.get("alcheProgress") ?? (normalizedSection === "loading" ? "0" : "1"))),
    intro: clamp01(Number(params.get("alcheIntro") ?? (normalizedSection === "loading" ? "0.2" : "1"))),
    heroShotId,
  };
}

function getSectionProgress(node: HTMLElement | null) {
  if (!node) return 0;
  const rect = node.getBoundingClientRect();
  const travel = Math.max(rect.height - window.innerHeight, 1);
  return clamp01(-rect.top / travel);
}

function getAbsoluteTop(node: HTMLElement | null) {
  if (!node) return 0;
  const rect = node.getBoundingClientRect();
  return rect.top + window.scrollY;
}

function getWorksCardsProgress(sectionRefs: Record<AlcheScrollableSectionId, HTMLElement | null>) {
  const worksCards = sectionRefs.works_cards;
  if (!worksCards) return 0;

  const viewportLine = window.innerHeight * ALCHE_TOP_SCROLL_TUNING.activeViewport;
  const start = getAbsoluteTop(worksCards) - viewportLine;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
  return clamp01((window.scrollY - start) / Math.max(maxScroll - start, 1));
}

function getWorksWordHandoff(sectionRefs: Record<AlcheScrollableSectionId, HTMLElement | null>) {
  const worksIntro = sectionRefs.works_intro;
  const works = sectionRefs.works;
  const worksCards = sectionRefs.works_cards;
  if (!worksIntro || !works || !worksCards) return 0;

  const viewportLine = window.innerHeight * ALCHE_TOP_SCROLL_TUNING.activeViewport;
  const introStart = getAbsoluteTop(worksIntro) - viewportLine;
  const worksStart = getAbsoluteTop(works) - viewportLine;
  const cardsStart = getAbsoluteTop(worksCards) - viewportLine;
  const scrollY = window.scrollY;

  if (scrollY <= introStart) return 0;
  if (scrollY <= worksStart) {
    return clamp01(((scrollY - introStart) / Math.max(worksStart - introStart, 1)) * 0.45);
  }
  if (scrollY <= cardsStart) {
    return clamp01(0.45 + ((scrollY - worksStart) / Math.max(cardsStart - worksStart, 1)) * 0.55);
  }

  return 1;
}

function findSectionAtViewport(sectionRefs: Record<AlcheScrollableSectionId, HTMLElement | null>) {
  const viewportLine = window.innerHeight * ALCHE_TOP_SCROLL_TUNING.activeViewport;

  for (const sectionId of ALCHE_TOP_RENDERABLE_SECTIONS) {
    const node = sectionRefs[sectionId];
    if (!node) continue;
    const rect = node.getBoundingClientRect();
    if (rect.top <= viewportLine && rect.bottom >= viewportLine) return sectionId;
  }

  return "kv" as const;
}

export function useTopPageScroll({ sectionRefs }: UseTopPageScrollOptions) {
  const reducedMotion = useReducedMotion();
  const debugState = typeof window === "undefined" ? null : readDebugState();
  const lenisRef = useRef<Lenis | null>(null);
  const trackedSectionRef = useRef<AlcheScrollableSectionId>(debugState?.section === "loading" ? "kv" : (debugState?.section ?? "kv"));
  const introRef = useRef(debugState?.intro ?? (reducedMotion ? 1 : 0));
  const worksCardsProgressRef = useRef(debugState?.section === "works_cards" ? debugState.progress : 0);
  const progressRef = useRef<Record<AlcheScrollableSectionId, number>>(
    Object.fromEntries(
      ALCHE_SCROLLABLE_SECTION_IDS.map((sectionId) => [sectionId, debugState?.section === sectionId ? debugState.progress : 0]),
    ) as Record<AlcheScrollableSectionId, number>,
  );

  const [activeSection, setActiveSection] = useState<AlcheTopSectionId>(debugState?.section ?? "loading");
  const [trackedSection, setTrackedSection] = useState<AlcheScrollableSectionId>(
    debugState?.section === "loading" ? "kv" : (debugState?.section ?? "kv"),
  );
  const [sectionProgress, setSectionProgress] = useState(debugState?.progress ?? 0);
  const [worksCardsProgress, setWorksCardsProgress] = useState(debugState?.section === "works_cards" ? debugState.progress : 0);
  const [introProgress, setIntroProgress] = useState(debugState?.intro ?? (reducedMotion ? 1 : 0));
  const [heroShotId, setHeroShotId] = useState<AlcheHeroShotId | null>(debugState?.heroShotId ?? null);
  const [worksWordHandoff, setWorksWordHandoff] = useState(debugState ? deriveWorksWordHandoff(debugState.section, debugState.progress) : 0);
  const renderDebugState = typeof window === "undefined" ? null : readDebugState();
  const resolvedTrackedSection =
    renderDebugState?.section === "loading"
      ? "kv"
      : ((renderDebugState?.section as AlcheScrollableSectionId | undefined) ?? trackedSection);
  const resolvedActiveSection = renderDebugState?.section ?? activeSection;
  const resolvedSectionProgress = renderDebugState?.progress ?? sectionProgress;
  const resolvedWorksCardsProgress =
    renderDebugState?.section === "works_cards" ? renderDebugState.progress : worksCardsProgress;
  const resolvedIntroProgress = renderDebugState?.intro ?? introProgress;
  const resolvedHeroShotId = renderDebugState?.heroShotId ?? heroShotId;
  const resolvedWorksWordHandoff =
    renderDebugState ? deriveWorksWordHandoff(renderDebugState.section, renderDebugState.progress) : worksWordHandoff;

  useEffect(() => {
    trackedSectionRef.current = trackedSection;
  }, [trackedSection]);

  useEffect(() => {
    introRef.current = introProgress;
  }, [introProgress]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nextDebugState = readDebugState();
    if (nextDebugState) {
      const debugTracked = nextDebugState.section === "loading" ? "kv" : (nextDebugState.section as AlcheScrollableSectionId);
      trackedSectionRef.current = debugTracked;
      progressRef.current[debugTracked] = nextDebugState.progress;
      worksCardsProgressRef.current = nextDebugState.section === "works_cards" ? nextDebugState.progress : 0;
      setTrackedSection(debugTracked);
      setActiveSection(nextDebugState.section);
      setSectionProgress(nextDebugState.progress);
      setWorksCardsProgress(nextDebugState.section === "works_cards" ? nextDebugState.progress : 0);
      setIntroProgress(nextDebugState.intro);
      setHeroShotId(nextDebugState.heroShotId);
      setWorksWordHandoff(deriveWorksWordHandoff(nextDebugState.section, nextDebugState.progress));
      return;
    }

    setHeroShotId(null);

    const intro = { value: reducedMotion ? 1 : 0 };
    let frame = 0;
    let lenis: Lenis | null = null;

    const syncDisplaySection = (sectionId: AlcheScrollableSectionId, progress: number) => {
      const displaySection: AlcheTopSectionId = intro.value < 0.98 ? "loading" : sectionId;
      startTransition(() => {
        setTrackedSection(sectionId);
        setActiveSection(displaySection);
        setSectionProgress(progress);
      });
    };

    const syncWorksCardsProgress = () => {
      const nextProgress = getWorksCardsProgress(sectionRefs.current);
      worksCardsProgressRef.current = nextProgress;
      setWorksCardsProgress(nextProgress);
    };

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: ALCHE_TOP_SCROLL_TUNING.duration,
        lerp: ALCHE_TOP_SCROLL_TUNING.lerp,
        smoothWheel: true,
        wheelMultiplier: ALCHE_TOP_SCROLL_TUNING.wheelMultiplier,
        touchMultiplier: ALCHE_TOP_SCROLL_TUNING.touchMultiplier,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", () => {
        ScrollTrigger.update();
        setWorksWordHandoff(getWorksWordHandoff(sectionRefs.current));
        syncWorksCardsProgress();
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(raf);
      };
      frame = window.requestAnimationFrame(raf);
    }

    const introTween = gsap.to(intro, {
      value: 1,
      duration: reducedMotion ? 0.01 : ALCHE_TOP_TIMINGS.introDuration,
      ease: reducedMotion ? "none" : "power3.out",
      onUpdate: () => {
        introRef.current = intro.value;
        setIntroProgress(intro.value);
        if (intro.value >= 0.98) {
          const sectionId = trackedSectionRef.current;
          setActiveSection(sectionId);
          setSectionProgress(progressRef.current[sectionId] ?? 0);
        } else {
          setActiveSection("loading");
        }
      },
    });

    const activeTriggers = ALCHE_TOP_RENDERABLE_SECTIONS.map((sectionId) => {
      const section = sectionRefs.current[sectionId];
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: ALCHE_TOP_SCROLL_TUNING.activeTriggerStart,
        end: ALCHE_TOP_SCROLL_TUNING.activeTriggerEnd,
        onEnter: () => syncDisplaySection(sectionId, progressRef.current[sectionId] ?? 0),
        onEnterBack: () => syncDisplaySection(sectionId, progressRef.current[sectionId] ?? 0),
      });
    });

    const progressTriggers = ALCHE_TOP_RENDERABLE_SECTIONS.map((sectionId) => {
      const section = sectionRefs.current[sectionId];
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current[sectionId] = self.progress;
          setWorksWordHandoff(getWorksWordHandoff(sectionRefs.current));
          if (sectionId === trackedSectionRef.current || self.isActive) {
            setSectionProgress(self.progress);
          }
        },
      });
    });

    if (reducedMotion) {
      const onScroll = () => {
        const nextSection = findSectionAtViewport(sectionRefs.current);
        const progress = getSectionProgress(sectionRefs.current[nextSection]);
        progressRef.current[nextSection] = progress;
        syncWorksCardsProgress();
        setWorksWordHandoff(getWorksWordHandoff(sectionRefs.current));
        syncDisplaySection(nextSection, progress);
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      return () => {
        introTween.kill();
        activeTriggers.forEach((trigger) => trigger?.kill());
        progressTriggers.forEach((trigger) => trigger?.kill());
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    ScrollTrigger.refresh();
    syncWorksCardsProgress();
    setWorksWordHandoff(getWorksWordHandoff(sectionRefs.current));

    return () => {
      introTween.kill();
      activeTriggers.forEach((trigger) => trigger?.kill());
      progressTriggers.forEach((trigger) => trigger?.kill());
      if (frame) window.cancelAnimationFrame(frame);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion, sectionRefs]);

  const activeGroup = useMemo<AlcheTopGroupId | null>(() => getTopGroupForSection(resolvedActiveSection), [resolvedActiveSection]);
  const groupProgress = useMemo(
    () => deriveGroupProgress(resolvedActiveSection, resolvedSectionProgress),
    [resolvedActiveSection, resolvedSectionProgress],
  );

  function scrollToSection(target: HTMLElement | null) {
    if (!target) return;

    if (!reducedMotion && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -16 });
      return;
    }

    target.scrollIntoView({ behavior: "auto", block: "start" });
  }

  return {
    reducedMotion: Boolean(reducedMotion),
    activeSection: resolvedActiveSection,
    trackedSection: resolvedTrackedSection,
    activeGroup,
    sectionProgress: resolvedSectionProgress,
    worksCardsProgress: resolvedWorksCardsProgress,
    groupProgress,
    introProgress: resolvedIntroProgress,
    heroShotId: resolvedHeroShotId,
    worksWordHandoff: resolvedWorksWordHandoff,
    scrollToSection,
  };
}
