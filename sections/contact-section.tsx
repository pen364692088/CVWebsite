import Image from "next/image";

import type { Dictionary } from "@/data/dictionaries";
import type { ContactLink, ResumeAsset } from "@/data/profile";
import { assetPath } from "@/lib/site";

import { Reveal } from "@/components/reveal";

interface ContactSectionProps {
  copy: Dictionary["contact"];
  contacts: ContactLink[];
  resume: ResumeAsset;
}

export function ContactSection({ copy, contacts, resume }: ContactSectionProps) {
  return (
    <section id="contact" className="section-shell">
      <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="space-y-5">
            <p className="section-kicker">{copy.eyebrow}</p>
            <h2 className="section-title">{copy.title}</h2>
            <p className="section-body">{copy.intro}</p>

            <div className="ritual-panel p-6">
              <h3 className="font-display text-2xl text-ivory">{copy.cardTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-mist">{copy.cardBody}</p>

              <div className="mt-6 grid gap-3">
                {contacts.map((item) =>
                  item.available ? (
                    <a
                      key={item.key}
                      href={item.key === "resume" ? assetPath(item.href) : item.href}
                      className="contact-link"
                      target={item.key === "resume" ? undefined : "_blank"}
                      rel={item.key === "resume" ? undefined : "noreferrer"}
                      download={item.key === "resume" ? true : undefined}
                    >
                      <span className="text-sm uppercase tracking-[0.22em] text-gold/80">{item.key}</span>
                      <span className="text-sm text-stone-200">{item.label}</span>
                    </a>
                  ) : (
                    <div key={item.key} className="contact-link opacity-70">
                      <span className="text-sm uppercase tracking-[0.22em] text-gold/80">{item.key}</span>
                      <span className="text-sm text-mist">{copy.unavailableLabel}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="ritual-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-kicker">{copy.previewLabel}</p>
                <h3 className="font-display text-2xl text-ivory">{copy.resumeTitle}</h3>
              </div>
              <a className="primary-button" href={assetPath(resume.pdf)} download>
                {copy.downloadLabel}
              </a>
            </div>

            <p className="mt-3 text-sm leading-7 text-mist">{copy.resumeBody}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {resume.previews.map((preview, index) => (
                <div key={preview} className="artifact-image-frame aspect-[4/5]">
                  <Image
                    src={assetPath(preview)}
                    alt={`${copy.previewLabel} ${index + 1}`}
                    fill
                    sizes="(min-width: 768px) 20rem, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
