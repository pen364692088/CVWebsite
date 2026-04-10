"use client";

import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { startTransition, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ALCHE_PHASE_IDS, ALCHE_TIMINGS, type AlchePhaseId } from "@/lib/alche-phase-one";

interface UsePhaseScrollOptions {
  sectionRefs: React.MutableRefObject<Record<AlchePhaseId, HTMLElement | null>>;
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
  const lenisRef = useRef<Lenis | null>(null);
  const [activePhase, setActivePhase] = useState<AlchePhaseId>("hero");
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [introProgress, setIntroProgress] = useState(reducedMotion ? 1 : 0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const intro = { value: reducedMotion ? 1 : 0 };
    const heroSection = sectionRefs.current.hero;
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

    const sectionTriggers = ALCHE_PHASE_IDS.map((phaseId) => {
      const section = sectionRefs.current[phaseId];
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => startTransition(() => setActivePhase(phaseId)),
        onEnterBack: () => startTransition(() => setActivePhase(phaseId)),
      });
    });

    const heroTrigger = heroSection
      ? ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => setPhaseProgress(self.progress),
        })
      : null;

    if (reducedMotion) {
      const onScroll = () => {
        setActivePhase(findPhaseAtViewport(sectionRefs.current));
        if (heroSection) {
          const rect = heroSection.getBoundingClientRect();
          const progress = Math.min(Math.max((window.innerHeight - rect.top) / Math.max(rect.height, 1), 0), 1);
          setPhaseProgress(progress);
        }
      };

      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        introTween.kill();
        heroTrigger?.kill();
        sectionTriggers.forEach((trigger) => trigger?.kill());
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    }

    ScrollTrigger.refresh();

    return () => {
      introTween.kill();
      heroTrigger?.kill();
      sectionTriggers.forEach((trigger) => trigger?.kill());
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
    phaseProgress,
    introProgress,
    scrollToPhase,
  };
}

