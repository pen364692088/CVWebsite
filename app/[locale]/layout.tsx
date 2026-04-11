import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { alcheContractCopy } from "@/data/alche-contract";
import { DocumentLocale } from "@/components/document-locale";
import { LOCALES, isLocale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = alcheContractCopy[locale];
  const path = `/${SITE.basePath.replace(/^\//, "")}/${locale}/`;

  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
    alternates: {
      canonical: path,
      languages: {
        en: `${SITE.basePath}/en/`,
        "zh-CN": `${SITE.basePath}/zh-CN/`,
        ja: `${SITE.basePath}/ja/`,
        ko: `${SITE.basePath}/ko/`,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return (
    <>
      <DocumentLocale locale={locale} />
      {children}
    </>
  );
}
