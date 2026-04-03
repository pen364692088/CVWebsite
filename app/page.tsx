"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, resolvePreferredLocale, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

function resolveInitialLocale() {
  const stored = window.localStorage.getItem(SITE.localeStorageKey);
  if (stored && LOCALES.includes(stored as Locale)) return stored as Locale;

  return resolvePreferredLocale(window.navigator.languages);
}

export default function Home() {
  const [targetLocale, setTargetLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const locale = resolveInitialLocale();
    setTargetLocale(locale);
    window.location.replace(`./${locale}/`);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="ritual-panel max-w-2xl p-8 sm:p-10">
        <p className="section-kicker">Ashen Archive</p>
        <h1 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">Choosing your entry path.</h1>
        <p className="mt-4 text-sm leading-7 text-mist">
          The site will guide you to the best language match. If automatic routing does not happen, choose one below.
        </p>
        <p className="mt-3 text-sm text-gold/80">Target locale: {LOCALE_LABELS[targetLocale]}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {LOCALES.map((locale) => (
            <Link key={locale} href={`/${locale}/`} className="secondary-button">
              {LOCALE_LABELS[locale]}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
