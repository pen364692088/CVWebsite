"use client";

import type { Dictionary } from "@/data/dictionaries";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import type { Locale } from "@/lib/i18n";

import { ArchiveExperience } from "@/components/archive-experience";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { showcaseDictionaries } from "@/data/showcase";

interface ArchiveShellProps {
  locale: Locale;
  dictionary: Dictionary;
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

export function ArchiveShell({ locale, dictionary, contacts, dossier }: ArchiveShellProps) {
  const showcase = showcaseDictionaries[locale];

  return (
    <div className="relative overflow-hidden">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <ArchiveExperience
        locale={locale}
        dictionary={dictionary}
        contacts={contacts}
        dossier={dossier}
      />
      <SiteFooter line={showcase.footerLine} />
    </div>
  );
}
