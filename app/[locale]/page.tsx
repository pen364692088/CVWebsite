import { notFound } from "next/navigation";

import { contactLinks, studioDossierAsset } from "@/data/profile";
import { AlcheTopPageShell } from "@/components/alche-top-page/alche-top-page-shell";
import { isLocale } from "@/lib/i18n";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return (
    <AlcheTopPageShell locale={locale} contacts={contactLinks} dossier={studioDossierAsset} />
  );
}
