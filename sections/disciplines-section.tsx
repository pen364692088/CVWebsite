import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";

import { Reveal } from "@/components/reveal";

interface DisciplinesSectionProps {
  copy: Dictionary["disciplines"];
  activeLens: ArchiveLens;
}

export function DisciplinesSection({ copy, activeLens }: DisciplinesSectionProps) {
  return (
    <section id="disciplines" className="section-shell archive-chamber-section">
      <Reveal>
        <div className="section-heading-center mb-10 space-y-4">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <div className="section-ornament" aria-hidden="true" />
          <p className="section-body section-body-centered">{copy.intro}</p>
        </div>
      </Reveal>

      <div className="discipline-list archive-register">
        {copy.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <article
              className={`discipline-item ${
                activeLens === "all" ? "discipline-item-active" : item.lenses.includes(activeLens) ? "discipline-item-active" : "discipline-item-muted"
              }`}
            >
              <div className="discipline-count">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="discipline-copy">
                <h3 className="font-display text-2xl text-ivory lg:text-[2rem]">{item.title}</h3>
                <p className="text-sm leading-7 text-mist lg:max-w-xl">{item.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
