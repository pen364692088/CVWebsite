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
    <header className="sticky top-0 z-40 border-b border-white/8 bg-night/72 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-6 px-5 py-3.5 sm:px-8">
        <Link href={`/${locale}/`} className="header-mark">
          <span className="header-title">{dictionary.nav.title}</span>
          <span className="header-identity">{dictionary.nav.identity}</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-5 text-sm text-mist lg:flex" aria-label="Primary">
            {dictionary.nav.items.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="interactive-link">
                {item.label}
              </a>
            ))}
          </nav>

          <LocaleSwitcher currentLocale={locale} label={dictionary.nav.languageLabel} />
        </div>
      </div>
    </header>
  );
}
