"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

import type { ArtifactView } from "@/data/artifacts";
import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";
import { assetPath } from "@/lib/site";

import { ArtifactModal } from "@/components/artifact-modal";
import { Reveal } from "@/components/reveal";

interface ArtifactsSectionProps {
  copy: Dictionary["artifacts"];
  artifacts: ArtifactView[];
  activeLens: ArchiveLens;
  activeLensTitle: string;
}

function getCaseNumber(index: number) {
  return `A-${String(index + 1).padStart(2, "0")}`;
}

function getArtifactPriority(artifact: ArtifactView, activeLens: ArchiveLens) {
  if (activeLens === "all") {
    return artifact.featured ? 20 : 10;
  }

  if (!artifact.lenses.includes(activeLens)) {
    return artifact.featured ? 5 : 0;
  }

  return 100 - artifact.lenses.length * 10 + (artifact.featured ? 5 : 0);
}

export function ArtifactsSection({ copy, artifacts, activeLens, activeLensTitle }: ArtifactsSectionProps) {
  const [activeArtifact, setActiveArtifact] = useState<(ArtifactView & { caseNumber: string }) | null>(null);

  const sortedArtifacts = useMemo(
    () =>
      [...artifacts].sort((left, right) => {
        return getArtifactPriority(right, activeLens) - getArtifactPriority(left, activeLens);
      }),
    [activeLens, artifacts],
  );

  const leadArtifact =
    sortedArtifacts.find((artifact) => activeLens === "all" || artifact.lenses.includes(activeLens)) ?? sortedArtifacts[0];

  return (
    <section id="artifacts" className="section-shell">
      <Reveal>
        <div className="mb-10 max-w-3xl space-y-4">
          <p className="section-kicker">{copy.eyebrow}</p>
          <h2 className="section-title">{copy.title}</h2>
          <p className="section-body">{copy.intro}</p>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
        {sortedArtifacts.map((artifact, index) => {
          const caseNumber = getCaseNumber(artifacts.findIndex((item) => item.slug === artifact.slug));
          const isFocused = activeLens === "all" || artifact.lenses.includes(activeLens);

          return (
            <Reveal key={artifact.slug} delay={index * 0.07} className={artifact.featured ? "lg:row-span-2" : ""}>
              <motion.button
                type="button"
                className={`group artifact-card h-full ${isFocused ? "artifact-card-active" : "artifact-card-muted"}`}
                whileHover={{ y: -4 }}
                onClick={() => setActiveArtifact({ ...artifact, caseNumber })}
                aria-haspopup="dialog"
                aria-label={`${copy.openLabel}: ${artifact.title}`}
              >
                <div className="artifact-ledger">
                  <span>
                    {copy.caseLabel} {caseNumber}
                  </span>
                  <span>{artifact.featured ? copy.featuredLabel : artifact.category}</span>
                </div>

                <div className={`artifact-image-frame ${artifact.featured ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                  <Image
                    src={assetPath(artifact.cover)}
                    alt={artifact.title}
                    fill
                    sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 28rem, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.02] saturate-70 brightness-75 sepia-[0.15]"
                  />
                </div>

                <div className="artifact-plaque">
                  <div className="space-y-3">
                    <h3 className="font-display text-3xl text-ivory">{artifact.title}</h3>
                    <p className="artifact-role">{artifact.role}</p>
                    <p className="text-sm leading-7 text-mist">{artifact.summary}</p>
                  </div>

                  <div className="artifact-meta-grid">
                    <div>
                      <p className="artifact-meta-label">{copy.categoryLabel}</p>
                      <p className="artifact-meta-value">{artifact.category}</p>
                    </div>
                    <div>
                      <p className="artifact-meta-label">{copy.roleLabel}</p>
                      <p className="artifact-meta-value">{artifact.role}</p>
                    </div>
                  </div>

                  <div className="artifact-proof-block">
                    <p className="artifact-meta-label">{copy.evidenceLabel}</p>
                    <ul className="artifact-proof-list">
                      {artifact.evidence.slice(0, 2).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {artifact.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="artifact-open-link">{copy.openLabel}</p>
                </div>
              </motion.button>
            </Reveal>
          );
        })}
      </div>

      {leadArtifact ? (
        <Reveal delay={0.22}>
          <aside className="artifact-annex" aria-live="polite">
            <div className="space-y-3">
              <p className="section-kicker">{copy.shelfLabel}</p>
              <h3 className="font-display text-3xl text-ivory">
                {activeLens === "all" ? copy.shelfTitle : leadArtifact.title}
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-mist">
                {activeLens === "all" ? copy.shelfBody : leadArtifact.solved}
              </p>
            </div>

            <div className="artifact-meta-grid">
              <div>
                <p className="artifact-meta-label">{copy.lensLabel}</p>
                <p className="artifact-meta-value">{activeLensTitle}</p>
              </div>
              <div>
                <p className="artifact-meta-label">{copy.roleLabel}</p>
                <p className="artifact-meta-value">{leadArtifact.role}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setActiveArtifact({
                    ...leadArtifact,
                    caseNumber: getCaseNumber(artifacts.findIndex((artifact) => artifact.slug === leadArtifact.slug)),
                  })
                }
              >
                {copy.shelfCta}
              </button>
            </div>
          </aside>
        </Reveal>
      ) : null}

      <ArtifactModal artifact={activeArtifact} dictionary={copy} activeLens={activeLens} onClose={() => setActiveArtifact(null)} />
    </section>
  );
}
