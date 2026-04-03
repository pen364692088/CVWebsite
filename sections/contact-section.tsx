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
      <div className="space-y-6">
        <Reveal>
          <div className="space-y-5">
            <p className="section-kicker">{copy.eyebrow}</p>
            <h2 className="section-title">{copy.title}</h2>
            <p className="section-body">{copy.intro}</p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="signal-sheet pt-5">
            <div className="space-y-4">
              <div>
                <p className="section-kicker">{copy.cardTitle}</p>
                <h3 className="font-display text-2xl text-ivory">{copy.cardTitle}</h3>
              </div>
              <p className="max-w-lg text-sm leading-7 text-mist">{copy.cardBody}</p>

              <div>
                {contacts.map((item) =>
                  item.available ? (
                    <a
                      key={item.key}
                      href={item.key === "resume" ? assetPath(item.href) : item.href}
                      className="signal-link"
                      target={item.key === "resume" ? undefined : "_blank"}
                      rel={item.key === "resume" ? undefined : "noreferrer"}
                      download={item.key === "resume" ? true : undefined}
                    >
                      <span className="text-xs uppercase tracking-[0.22em] text-gold/80">{item.key}</span>
                      <span className="text-sm text-stone-200">{item.label}</span>
                    </a>
                  ) : (
                    <div key={item.key} className="signal-link opacity-70">
                      <span className="text-xs uppercase tracking-[0.22em] text-gold/80">{item.key}</span>
                      <span className="text-sm text-mist">{copy.unavailableLabel}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="section-kicker">{copy.previewLabel}</p>
                <h3 className="font-display text-2xl text-ivory">{copy.resumeTitle}</h3>
              </div>
              <a className="primary-button" href={assetPath(resume.pdf)} download>
                {copy.downloadLabel}
              </a>
            </div>

            <p className="mt-3 text-sm leading-7 text-mist">{copy.resumeBody}</p>

            <div className="resume-preview-grid">
              {resume.previews.map((preview, index) => (
                <div key={preview} className="resume-preview-card">
                  <Image
                    src={assetPath(preview)}
                    alt={`${copy.previewLabel} ${index + 1}`}
                    fill
                    sizes="(min-width: 768px) 20rem, 100vw"
                    className="object-cover saturate-60 brightness-65 sepia-[0.28]"
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
