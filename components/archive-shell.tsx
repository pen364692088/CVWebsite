"use client";

import type { Locale } from "@/lib/i18n";

import type { Dictionary } from "@/data/dictionaries";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import { AlchePhaseOneShell } from "@/components/alche-phase-one/alche-phase-one-shell";

interface ArchiveShellProps {
  locale: Locale;
  dictionary: Dictionary;
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

export function ArchiveShell({ locale }: ArchiveShellProps) {
  return (
    <div className="relative overflow-hidden">
      <AlchePhaseOneShell locale={locale} />
    </div>
  );
}
