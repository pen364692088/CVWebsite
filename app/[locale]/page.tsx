import { notFound } from "next/navigation";

import { contactLinks, studioDossierAsset } from "@/data/profile";
import { dictionaries } from "@/data/dictionaries";
import { ArchiveShell } from "@/components/archive-shell";
import { isLocale } from "@/lib/i18n";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const dictionary = dictionaries[locale];

  return (
    <ArchiveShell
      locale={locale}
      dictionary={dictionary}
      contacts={contactLinks}
      dossier={studioDossierAsset}
    />
  );
}
