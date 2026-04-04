import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/data/dictionaries";
import type { Locale } from "@/lib/i18n";
import { assetPath } from "@/lib/site";

import { LocaleSwitcher } from "@/components/locale-switcher";

interface SiteHeaderProps {
  locale: Locale;
  dictionary: Dictionary;
}

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const leftItems = dictionary.nav.items.slice(0, 2);
  const rightItems = dictionary.nav.items.slice(2);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={`/${locale}/`} className="header-mark">
          <span className="header-title">{dictionary.nav.title}</span>
          <span className="header-identity">{dictionary.nav.identity}</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="header-nav-shell" aria-label="Primary">
            {leftItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="interactive-link">
                {item.label}
              </a>
            ))}
            <span className="header-ornament-shell" aria-hidden="true">
              <Image src={assetPath("/hero/abyss-ornament.svg")} alt="" width={280} height={44} className="header-ornament" />
            </span>
            {rightItems.map((item) => (
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
