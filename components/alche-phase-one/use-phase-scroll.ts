"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { startTransition, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { readAlcheHeroShotId, type AlcheHeroShotId } from "@/lib/alche-hero-lock";
import { ALCHE_PHASE_IDS, ALCHE_TIMINGS, clamp01, type AlchePhaseId } from "@/lib/alche-contract";

interface UsePhaseScrollOptions {
  sectionRefs: React.MutableRefObject<Record<AlchePhaseId, HTMLElement | null>>;
}

function readDebugState() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const phase = params.get("alchePhase");
  const heroShotId = readAlcheHeroShotId(params.get("alcheHeroShot"));
  if (!phase || !ALCHE_PHASE_IDS.includes(phase as AlchePhaseId)) return null;

  const intro = Number(params.get("alcheIntro") ?? "1");
  const progress = Number(params.get("alcheProgress") ?? (phase === "hero" ? "0" : "1"));

  return {
    phase: phase as AlchePhaseId,
    heroShotId,
    intro: clamp01(intro),
    progress: clamp01(progress),
  };
}

function getSectionProgress(node: HTMLElement | null) {
  if (!node) return 0;
  const rect = node.getBoundingClientRect();
  const travel = Math.max(rect.height - window.innerHeight, 1);
  return clamp01(-rect.top / travel);
}

function findPhaseAtViewport(sectionRefs: Record<AlchePhaseId, HTMLElement | null>) {
  const mid = window.innerHeight * 0.5;
  for (const phaseId of ALCHE_PHASE_IDS) {
    const node = sectionRefs[phaseId];
    if (!node) continue;
    const rect = node.getBoundingClientRect();
    if (rect.top <= mid && rect.bottom >= mid) return phaseId;
  }
  return "hero" as const;
}

export function usePhaseScroll({ sectionRefs }: UsePhaseScrollOptions) {
  const reducedMotion = useReducedMotion();
  const debugState = typeof window === "undefined" ? null : readDebugState();
  const lenisRef = useRef<Lenis | null>(null);
  const activePhaseRef = useRef<AlchePhaseId>(debugState?.phase ?? "hero");
  const phaseProgressRef = useRef<Record<AlchePhaseId, number>>({
    hero: debugState?.phase === "hero" ? debugState.progress : 0,
    works: debugState?.phase === "works" ? debugState.progress : 0,
    about: debugState?.phase === "about" ? debugState.progress : 0,
    stella: debugState?.phase === "stella" ? debugState.progress : 0,
    contact: debugState?.phase === "contact" ? debugState.progress : 0,
  });
  const [activePhase, setActivePhase] = useState<AlchePhaseId>(debugState?.phase ?? "hero");
  const [heroShotId, setHeroShotId] = useState<AlcheHeroShotId | null>(debugState?.heroShotId ?? null);
  const [phaseProgress, setPhaseProgress] = useState(debugState?.progress ?? 0);
  const [introProgress, setIntroProgress] = useState(debugState?.intro ?? (reducedMotion ? 1 : 0));

  useEffect(() => {
    activePhaseRef.current = activePhase;
  }, [activePhase]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nextDebugState = readDebugState();
    if (nextDebugState) {
      setActivePhase(nextDebugState.phase);
      setHeroShotId(nextDebugState.heroShotId);
      setPhaseProgress(nextDebugState.progress);
      setIntroProgress(nextDebugState.intro);
      phaseProgressRef.current[nextDebugState.phase] = nextDebugState.progress;
      return;
    }

    setHeroShotId(null);

    const intro = { value: reducedMotion ? 1 : 0 };
    let frame = 0;
    let lenis: Lenis | null = null;

    if (!reducedMotion) {
      lenis = new Lenis({
        duration: ALCHE_TIMINGS.scrollDuration,
        lerp: ALCHE_TIMINGS.scrollLerp,
        smoothWheel: true,
        touchMultiplier: 1,
      });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = window.requestAnimationFrame(raf);
      };
      frame = window.requestAnimationFrame(raf);
    }

    const introTween = gsap.to(intro, {
      value: 1,
      duration: reducedMotion ? 0.01 : ALCHE_TIMINGS.canvasReveal,
      ease: reducedMotion ? "none" : "power3.out",
      onUpdate: () => setIntroProgress(intro.value),
    });

    const activeTriggers = ALCHE_PHASE_IDS.map((phaseId) => {
      const section = sectionRefs.current[phaseId];
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () =>
          startTransition(() => {
            setActivePhase(phaseId);
            setPhaseProgress(phaseProgressRef.current[phaseId] ?? 0);
          }),
        onEnterBack: () =>
          startTransition(() => {
            setActivePhase(phaseId);
            setPhaseProgress(phaseProgressRef.current[phaseId] ?? 0);
          }),
      });
    });

    const progressTriggers = ALCHE_PHASE_IDS.map((phaseId) => {
      const section = sectionRefs.current[phaseId];
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          phaseProgressRef.current[phaseId] = self.progress;
          if (phaseId === activePhaseRef.current || self.isActive) {
            setPhaseProgress(self.progress);
          }
        },
      });
    });

    if (reducedMotion) {
      const onScroll = () => {
        const phaseId = findPhaseAtViewport(sectionRefs.current);
        const progress = getSectionProgress(sectionRefs.current[phaseId]);
        phaseProgressRef.current[phaseId] = progress;
        setActivePhase(phaseId);
        setPhaseProgress(progress);
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

    return () => {
      introTween.kill();
      activeTriggers.forEach((trigger) => trigger?.kill());
      progressTriggers.forEach((trigger) => trigger?.kill());
      if (frame) window.cancelAnimationFrame(frame);
      lenis?.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion, sectionRefs]);

  function scrollToPhase(target: HTMLElement | null) {
    if (!target) return;

    if (!reducedMotion && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -16 });
      return;
    }

    target.scrollIntoView({ behavior: "auto", block: "start" });
  }

  return {
    reducedMotion: Boolean(reducedMotion),
    activePhase,
    heroShotId,
    phaseProgress,
    introProgress,
    scrollToPhase,
  };
}
