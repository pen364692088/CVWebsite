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

      <div className="discipline-list">
        {copy.items.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <article className="discipline-item">
              <div className="discipline-count">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-2xl text-ivory lg:text-[2rem]">{item.title}</h3>
              <p className="text-sm leading-7 text-mist lg:max-w-xl">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
