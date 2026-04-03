import type { Dictionary } from "@/data/dictionaries";

import { Reveal } from "@/components/reveal";

export function AboutSection({ copy }: { copy: Dictionary["about"] }) {
  return (
    <section id="about" className="section-shell">
      <div className="section-grid">
        <Reveal>
          <div className="space-y-4">
            <p className="section-kicker">{copy.eyebrow}</p>
            <h2 className="section-title">{copy.title}</h2>
            <p className="section-body">{copy.body}</p>
            <p className="section-body">{copy.service}</p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="archive-sheet pt-5">
            <div className="dossier-list">
              {copy.dossier.map((item) => (
                <div key={item.label} className="dossier-row">
                  <p className="text-xs uppercase tracking-[0.22em] text-gold/78">{item.label}</p>
                  <p className="text-sm leading-7 text-stone-200">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="dossier-tag-grid">
              {copy.tags.map((tag) => (
                <span key={tag} className="dossier-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
