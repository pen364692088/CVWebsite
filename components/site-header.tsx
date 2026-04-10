import Link from "next/link";

import type { Dictionary } from "@/data/dictionaries";
import type { Locale } from "@/lib/i18n";

import { LocaleSwitcher } from "@/components/locale-switcher";

interface SiteHeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  return (
    <header className="site-header site-header-ghost">
      <Link href={`/${locale}/`} className="sr-only" aria-label={dictionary.nav.title}>
        {dictionary.nav.title}
      </Link>

      <div className="header-locale-shell header-locale-shell-floating">
        <LocaleSwitcher currentLocale={locale} label={dictionary.nav.languageLabel} />
      </div>
    </header>
  );
}
