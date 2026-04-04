"use client";

import { useEffect, useState } from "react";

import type { ArtifactView } from "@/data/artifacts";
import type { Dictionary } from "@/data/dictionaries";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import type { Locale } from "@/lib/i18n";
import { ARCHIVE_LENS_KEY, DEFAULT_ARCHIVE_LENS, isArchiveLens, type ArchiveLens } from "@/lib/archive";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AboutSection } from "@/sections/about-section";
import { ArtifactsSection } from "@/sections/artifacts-section";
import { ContactSection } from "@/sections/contact-section";
import { DisciplinesSection } from "@/sections/disciplines-section";
import { GameSection } from "@/sections/game-section";
import { HeroSection } from "@/sections/hero-section";

interface ArchiveShellProps {
  locale: Locale;
  dictionary: Dictionary;
  artifacts: ArtifactView[];
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

export function ArchiveShell({ locale, dictionary, artifacts, contacts, dossier }: ArchiveShellProps) {
  const [activeLens, setActiveLens] = useState<ArchiveLens>(DEFAULT_ARCHIVE_LENS);
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

  return (
    <div className="relative overflow-hidden">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main>
        <HeroSection copy={dictionary.hero} activeLens={activeLens} />
        <AboutSection copy={dictionary.about} />
        <DisciplinesSection copy={dictionary.disciplines} activeLens={activeLens} />
        <ArtifactsSection copy={dictionary.artifacts} artifacts={artifacts} activeLens={activeLens} activeLensTitle={currentLens.title} />
        <GameSection copy={dictionary.game} activeLens={activeLens} onLensChange={setActiveLens} />
        <ContactSection copy={dictionary.contact} contacts={contacts} dossier={dossier} />
      </main>
      <SiteFooter dictionary={dictionary} />
    </div>
  );
}
