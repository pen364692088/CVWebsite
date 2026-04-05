import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";

import { LightTheFireGame } from "@/components/light-the-fire-game";
import { Reveal } from "@/components/reveal";

interface GameSectionProps {
  copy: Dictionary["game"];
  activeLens: ArchiveLens;
  onLensChange: (lens: ArchiveLens) => void;
}

export function GameSection({ copy, activeLens, onLensChange }: GameSectionProps) {
  return (
    <section id="fire" className="section-shell abyss-ritual-section">
      <Reveal>
        <div className="section-heading-center ritual-section-heading">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <p className="section-body section-body-centered">{copy.intro}</p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <LightTheFireGame copy={copy} activeLens={activeLens} onLensChange={onLensChange} />
      </Reveal>
    </section>
  );
}
