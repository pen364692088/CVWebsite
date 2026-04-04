"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ArtifactView } from "@/data/artifacts";
import type { Dictionary } from "@/data/dictionaries";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import {
  ARCHIVE_LENS_KEY,
  DEFAULT_ARCHIVE_LENS,
  DEFAULT_ARCHIVE_PHASE,
  isArchiveLens,
  type ArchivePhase,
  type ArchiveLens,
} from "@/lib/archive";

import { ArchiveRelicStage } from "@/components/archive-relic-stage";
import { AboutSection } from "@/sections/about-section";
import { ArtifactsSection } from "@/sections/artifacts-section";
import { ContactSection } from "@/sections/contact-section";
import { DisciplinesSection } from "@/sections/disciplines-section";
import { GameSection } from "@/sections/game-section";
import { HeroSection } from "@/sections/hero-section";

interface ArchiveRelicBandProps {
  dictionary: Dictionary;
  artifacts: ArtifactView[];
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

export function ArchiveRelicBand({ dictionary, artifacts, contacts, dossier }: ArchiveRelicBandProps) {
  const [activeLens, setActiveLens] = useState<ArchiveLens>(DEFAULT_ARCHIVE_LENS);
  const [activePhase, setActivePhase] = useState<ArchivePhase>(DEFAULT_ARCHIVE_PHASE);
  const [isBandActive, setIsBandActive] = useState(true);
  const bandRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const disciplinesRef = useRef<HTMLDivElement>(null);
  const sigilsRef = useRef<HTMLDivElement>(null);

  const currentLens = dictionary.game.options.find((option) => option.id === activeLens) ?? dictionary.game.options[0];

  useEffect(() => {
    const storedLens = window.localStorage.getItem(ARCHIVE_LENS_KEY);
    if (isArchiveLens(storedLens)) {
      setActiveLens(storedLens);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ARCHIVE_LENS_KEY, activeLens);
  }, [activeLens]);

  useEffect(() => {
    const ratios = new Map<ArchivePhase, number>([
      ["hero", 0],
      ["disciplines", 0],
      ["sigils", 0],
    ]);

    const phaseObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const phase = entry.target.getAttribute("data-archive-phase") as ArchivePhase | null;
          if (!phase) continue;
          ratios.set(phase, entry.intersectionRatio);
        }

        const nextPhase = (["hero", "disciplines", "sigils"] as ArchivePhase[]).reduce((bestPhase, phase) =>
          (ratios.get(phase) ?? 0) >= (ratios.get(bestPhase) ?? 0) ? phase : bestPhase,
        "hero");

        setActivePhase(nextPhase);
      },
      {
        threshold: [0.15, 0.3, 0.45, 0.6, 0.8],
        rootMargin: "-18% 0px -18% 0px",
      },
    );

    const bandObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsBandActive(entry?.isIntersecting ?? false);
      },
      { threshold: [0.05, 0.12, 0.24] },
    );

    for (const node of [heroRef.current, disciplinesRef.current, sigilsRef.current]) {
      if (node) phaseObserver.observe(node);
    }

    if (bandRef.current) {
      bandObserver.observe(bandRef.current);
    }

    return () => {
      phaseObserver.disconnect();
      bandObserver.disconnect();
    };
  }, []);

  const artifactsSection = useMemo(
    () => (
      <ArtifactsSection
        copy={dictionary.artifacts}
        artifacts={artifacts}
        activeLens={activeLens}
        activeLensTitle={currentLens.title}
      />
    ),
    [activeLens, artifacts, currentLens.title, dictionary.artifacts],
  );

  return (
    <div className="relative overflow-hidden">
      <main>
        <div ref={bandRef} className="archive-band-shell">
          <div className="archive-band-grid">
            <div className="archive-band-copy">
              <div ref={heroRef} data-archive-phase="hero">
                <HeroSection copy={dictionary.hero} activeLens={activeLens} />
              </div>
              <AboutSection copy={dictionary.about} />
              <div ref={disciplinesRef} data-archive-phase="disciplines">
                <DisciplinesSection copy={dictionary.disciplines} activeLens={activeLens} />
              </div>
              <div ref={sigilsRef} data-archive-phase="sigils">
                <GameSection copy={dictionary.game} activeLens={activeLens} onLensChange={setActiveLens} />
              </div>
            </div>

            <ArchiveRelicStage
              activeLens={activeLens}
              activePhase={activePhase}
              currentLens={currentLens}
              copy={dictionary.relic}
              isBandActive={isBandActive}
            />
          </div>
        </div>

        {artifactsSection}
        <ContactSection copy={dictionary.contact} contacts={contacts} dossier={dossier} />
      </main>
    </div>
  );
}
