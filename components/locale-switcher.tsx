"use client";

import { useRouter } from "next/navigation";

import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

interface LocaleSwitcherProps {
  currentLocale: Locale;
  label: string;
}

export function LocaleSwitcher({ currentLocale, label }: LocaleSwitcherProps) {
  const router = useRouter();

  function handleChange(nextLocale: Locale) {
    if (nextLocale === currentLocale) return;

    localStorage.setItem(SITE.localeStorageKey, nextLocale);

    const hash = window.location.hash;
    router.push(`/${nextLocale}/${hash}`);
  }

  return (
    <label className="flex items-center gap-3 text-sm text-mist" aria-label={label}>
      <span className="sr-only">{label}</span>
      <select
        className="language-select"
        value={currentLocale}
        onChange={(event) => handleChange(event.target.value as Locale)}
      >
        {LOCALES.map((locale) => (
          <option key={locale} value={locale}>
            {LOCALE_LABELS[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
