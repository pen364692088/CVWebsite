import { notFound } from "next/navigation";

import { contactLinks, studioDossierAsset } from "@/data/profile";
import { dictionaries } from "@/data/dictionaries";
import { getArtifacts } from "@/data/artifacts";
import { ArchiveShell } from "@/components/archive-shell";
import { isLocale } from "@/lib/i18n";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const dictionary = dictionaries[locale];
  const artifacts = getArtifacts(locale);

  return (
    <ArchiveShell
      locale={locale}
      dictionary={dictionary}
      artifacts={artifacts}
      contacts={contactLinks}
      dossier={studioDossierAsset}
    />
  );
}
