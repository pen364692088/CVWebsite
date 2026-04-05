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
  return (
    <header className="site-header site-header-ghost">
      <nav className="sr-only" aria-label="Primary">
        {dictionary.nav.items.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>

      <Link href={`/${locale}/`} className="sr-only" aria-label={dictionary.nav.title}>
        {dictionary.nav.title}
      </Link>

      <div className="header-locale-shell header-locale-shell-floating">
        <span className="header-floating-ornament" aria-hidden="true">
          <Image
            src={assetPath("/reference-crops/dark-fantasy-pack/ornament-wide.png")}
            alt=""
            width={476}
            height={60}
            className="header-ornament"
          />
        </span>
        <LocaleSwitcher currentLocale={locale} label={dictionary.nav.languageLabel} />
      </div>
    </header>
  );
}
