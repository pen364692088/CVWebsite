import type { Dictionary } from "@/data/dictionaries";

import { Reveal } from "@/components/reveal";

export function DisciplinesSection({ copy }: { copy: Dictionary["disciplines"] }) {
  return (
    <section id="disciplines" className="section-shell">
      <Reveal>
        <div className="mb-10 max-w-3xl space-y-4">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <p className="section-body">{copy.intro}</p>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {copy.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <article className="ritual-card h-full">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-lg text-gold">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-2xl text-ivory">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-mist">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
