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
        <nav className="header-nav-shell header-nav-shell-left" aria-label="Primary">
          {leftItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="interactive-link">
              {item.label}
            </a>
          ))}
        </nav>

        <Link href={`/${locale}/`} className="header-mark" aria-label={dictionary.nav.title}>
          <span className="sr-only">{dictionary.nav.title}</span>
          <span className="header-ornament-shell" aria-hidden="true">
            <Image src={assetPath("/hero/abyss-ornament.png")} alt="" width={280} height={44} className="header-ornament" />
          </span>
        </Link>

        <nav className="header-nav-shell header-nav-shell-right" aria-label="Primary">
          {rightItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="interactive-link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-locale-shell">
          <LocaleSwitcher currentLocale={locale} label={dictionary.nav.languageLabel} />
        </div>
      </div>
    </header>
  );
}
