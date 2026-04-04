import type { Dictionary } from "@/data/dictionaries";
import type { Locale } from "@/lib/i18n";

import { LightTheFireGame } from "@/components/light-the-fire-game";
import { Reveal } from "@/components/reveal";

interface GameSectionProps {
  copy: Dictionary["game"];
  locale: Locale;
}

export function GameSection({ copy, locale }: GameSectionProps) {
  return (
    <section id="fire" className="section-shell">
      <Reveal>
        <div className="mb-10 max-w-3xl space-y-4">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <p className="section-body">{copy.intro}</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <LightTheFireGame copy={copy} locale={locale} />
      </Reveal>
    </section>
  );
}
