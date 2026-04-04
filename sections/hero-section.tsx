"use client";

import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";

import { Reveal } from "@/components/reveal";

interface HeroSectionProps {
  copy: Dictionary["hero"];
  activeLens: ArchiveLens;
}

export function HeroSection({ copy, activeLens }: HeroSectionProps) {
  const focus = copy.lensSummary[activeLens];

  return (
    <section className="hero-stage hero-stage-band">
      <div className="hero-grid">
        <div className="hero-copy space-y-7">
          <Reveal>
            <p className="section-kicker">{copy.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="hero-archive-label">{copy.archiveLabel}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              <h1 className="hero-identity">{copy.identity}</h1>
              <p className="hero-brandline text-sm uppercase tracking-[0.24em]">{copy.studioCredit}</p>
              <p className="hero-subtitle">{copy.role}</p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="hero-body">{copy.body}</p>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="hero-proof-list" aria-label="Core proof points">
              {copy.proofChips.map((item) => (
                <li key={item} className="hero-proof-chip">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="flex flex-wrap gap-3">
              <a href="#about" className="primary-button">
                {copy.enterLabel}
              </a>
              <a href="#artifacts" className="secondary-button">
                {copy.projectLabel}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="hero-availability">{copy.availability}</p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="hero-focus-card hero-focus-card-inline">
              <p className="artifact-meta-label">{copy.focusLabel}</p>
              <h2 className="hero-focus-title">{focus.title}</h2>
              <p className="hero-focus-body">{focus.body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
