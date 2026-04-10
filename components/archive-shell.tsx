"use client";

import type { ArtifactView } from "@/data/artifacts";
import type { Dictionary } from "@/data/dictionaries";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import type { Locale } from "@/lib/i18n";

import { ArchiveExperience } from "@/components/archive-experience";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

interface ArchiveShellProps {
  locale: Locale;
  dictionary: Dictionary;
  artifacts: ArtifactView[];
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

export function ArchiveShell({ locale, dictionary, artifacts, contacts, dossier }: ArchiveShellProps) {
  return (
    <div className="relative overflow-hidden">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <ArchiveExperience
        locale={locale}
        dictionary={dictionary}
        artifacts={artifacts}
        contacts={contacts}
        dossier={dossier}
      />
      <SiteFooter dictionary={dictionary} />
    </div>
  );
}
