"use client";

import { useEffect, useMemo, useState } from "react";

import type { ArtifactView } from "@/data/artifacts";
import type { Dictionary } from "@/data/dictionaries";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import {
  ARCHIVE_LENS_KEY,
  DEFAULT_ARCHIVE_LENS,
  isArchiveLens,
  type ArchiveLens,
} from "@/lib/archive";

import { ArtifactModal } from "@/components/artifact-modal";
import { AboutSection } from "@/sections/about-section";
import { ArtifactsSection } from "@/sections/artifacts-section";
import { ContactSection } from "@/sections/contact-section";
import { DisciplinesSection } from "@/sections/disciplines-section";
import { HeroSection } from "@/sections/hero-section";

interface ArchiveRelicBandProps {
  dictionary: Dictionary;
  artifacts: ArtifactView[];
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

function getCaseNumber(index: number) {
  return `A-${String(index + 1).padStart(2, "0")}`;
}

export function ArchiveRelicBand({ dictionary, artifacts, contacts, dossier }: ArchiveRelicBandProps) {
  const [activeLens, setActiveLens] = useState<ArchiveLens>(DEFAULT_ARCHIVE_LENS);
  const [activeArtifactSlug, setActiveArtifactSlug] = useState<string | null>(null);

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

  const artifactEntries = useMemo(
    () => artifacts.map((artifact, index) => ({ ...artifact, caseNumber: getCaseNumber(index) })),
    [artifacts],
  );

  const activeArtifact = artifactEntries.find((artifact) => artifact.slug === activeArtifactSlug) ?? null;

  return (
    <div className="relative overflow-hidden">
      <main>
        <HeroSection
          copy={dictionary.hero}
          ritualCopy={dictionary.game}
          activeLens={activeLens}
          artifacts={artifactEntries}
          onArtifactOpen={(slug) => setActiveArtifactSlug(slug)}
          onLensChange={setActiveLens}
        />
        <AboutSection copy={dictionary.about} />
        <DisciplinesSection copy={dictionary.disciplines} activeLens={activeLens} />
        <ArtifactsSection
          copy={dictionary.artifacts}
          artifacts={artifactEntries}
          activeLens={activeLens}
          activeLensTitle={currentLens.title}
          onArtifactOpen={(slug) => setActiveArtifactSlug(slug)}
        />
        <ContactSection copy={dictionary.contact} contacts={contacts} dossier={dossier} />
      </main>
      <ArtifactModal artifact={activeArtifact} dictionary={dictionary.artifacts} activeLens={activeLens} onClose={() => setActiveArtifactSlug(null)} />
    </div>
  );
}
