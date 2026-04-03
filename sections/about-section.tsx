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
          <div className="ritual-panel p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.dossier.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-gold/80">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-200">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {copy.tags.map((tag) => (
                <span key={tag} className="tag-pill">
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
