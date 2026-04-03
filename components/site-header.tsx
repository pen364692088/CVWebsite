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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href={`/${locale}/`} className="font-display text-lg tracking-[0.24em] text-ivory uppercase">
          {dictionary.nav.title}
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
