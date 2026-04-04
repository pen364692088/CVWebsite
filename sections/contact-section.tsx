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
          <div className="signal-frame">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="section-kicker">{copy.cardTitle}</p>
                <h3 className="font-display text-2xl text-ivory">{copy.cardTitle}</h3>
                <p className="max-w-lg text-sm leading-7 text-mist">{copy.cardBody}</p>
              </div>

              <ul className="signal-route-list">
                {contacts.map((item) => (
                  <li key={item.key}>
                    {item.available ? (
                      <a
                        href={item.key === "resume" ? assetPath(item.href) : item.href}
                        className="signal-route"
                        target={item.key === "resume" ? undefined : "_blank"}
                        rel={item.key === "resume" ? undefined : "noreferrer"}
                        download={item.key === "resume" ? true : undefined}
                      >
                        <span className="signal-route-key">{item.key}</span>
                        <span className="signal-route-value">{item.label}</span>
                      </a>
                    ) : (
                      <div className="signal-route signal-route-disabled" aria-disabled="true">
                        <span className="signal-route-key">{item.key}</span>
                        <span className="signal-route-value">{copy.unavailableLabel}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="resume-folio">
              <div className="space-y-3">
                <p className="section-kicker">{copy.previewLabel}</p>
                <h3 className="font-display text-2xl text-ivory">{copy.resumeTitle}</h3>
                <p className="max-w-xl text-sm leading-7 text-mist">{copy.resumeBody}</p>
              </div>

              <a className="primary-button w-fit" href={assetPath(resume.pdf)} download>
                {copy.downloadLabel}
              </a>

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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
