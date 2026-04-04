import { notFound } from "next/navigation";

import { contactLinks, studioDossierAsset } from "@/data/profile";
import { dictionaries } from "@/data/dictionaries";
import { getArtifacts } from "@/data/artifacts";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AboutSection } from "@/sections/about-section";
import { ArtifactsSection } from "@/sections/artifacts-section";
import { DisciplinesSection } from "@/sections/disciplines-section";
import { GameSection } from "@/sections/game-section";
import { ContactSection } from "@/sections/contact-section";
import { HeroSection } from "@/sections/hero-section";
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
    <div className="relative overflow-hidden">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main>
        <HeroSection copy={dictionary.hero} />
        <AboutSection copy={dictionary.about} />
        <DisciplinesSection copy={dictionary.disciplines} />
        <ArtifactsSection copy={dictionary.artifacts} artifacts={artifacts} />
        <GameSection copy={dictionary.game} locale={locale} />
        <ContactSection copy={dictionary.contact} contacts={contactLinks} dossier={studioDossierAsset} />
      </main>
      <SiteFooter dictionary={dictionary} />
    </div>
  );
}
