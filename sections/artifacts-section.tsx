"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import type { Dictionary } from "@/data/dictionaries";
import { ARCHIVE_UNLOCK_EVENT, ARCHIVE_UNLOCK_KEY } from "@/lib/archive";
import { assetPath } from "@/lib/site";

import { ArtifactModal } from "@/components/artifact-modal";
import { Reveal } from "@/components/reveal";

interface ArtifactView {
  slug: string;
  featured: boolean;
  cover: string;
  title: string;
  category: string;
  role: string;
  summary: string;
  tags: string[];
  what: string;
  contribution: string[];
  technologies: string[];
  solved: string;
  media: Array<{
    kind: "image" | "video";
    src: string;
    alt: string;
    label: string;
    poster?: string;
  }>;
}

interface ArtifactsSectionProps {
  copy: Dictionary["artifacts"];
  artifacts: ArtifactView[];
}

function getCaseNumber(index: number) {
  return `A-${String(index + 1).padStart(2, "0")}`;
}

export function ArtifactsSection({ copy, artifacts }: ArtifactsSectionProps) {
  const [activeArtifact, setActiveArtifact] = useState<(ArtifactView & { caseNumber: string }) | null>(null);
  const [archiveUnlocked, setArchiveUnlocked] = useState(false);

  const featuredArtifact = artifacts.find((artifact) => artifact.featured) ?? artifacts[0];

  useEffect(() => {
    function syncUnlockState() {
      setArchiveUnlocked(window.localStorage.getItem(ARCHIVE_UNLOCK_KEY) === "true");
    }

    syncUnlockState();
    window.addEventListener(ARCHIVE_UNLOCK_EVENT, syncUnlockState);
    window.addEventListener("storage", syncUnlockState);

    return () => {
      window.removeEventListener(ARCHIVE_UNLOCK_EVENT, syncUnlockState);
      window.removeEventListener("storage", syncUnlockState);
    };
  }, []);

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
        {artifacts.map((artifact, index) => {
          const caseNumber = getCaseNumber(index);

          return (
            <Reveal key={artifact.slug} delay={index * 0.07} className={artifact.featured ? "lg:row-span-2" : ""}>
              <motion.button
                type="button"
                className="group artifact-card h-full"
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

      <Reveal delay={0.22}>
        <aside className="artifact-annex" aria-live="polite">
          <div className="space-y-3">
            <p className="section-kicker">{archiveUnlocked ? copy.unlockTitle : copy.lockedLabel}</p>
            <h3 className="font-display text-3xl text-ivory">
              {archiveUnlocked ? featuredArtifact.title : copy.lockedLabel}
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-mist">
              {archiveUnlocked ? copy.unlockBody : copy.lockedBody}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {archiveUnlocked ? (
              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  setActiveArtifact({
                    ...featuredArtifact,
                    caseNumber: getCaseNumber(artifacts.findIndex((artifact) => artifact.slug === featuredArtifact.slug)),
                  })
                }
              >
                {copy.unlockCta}
              </button>
            ) : (
              <span className="secondary-button" aria-disabled="true">
                {copy.lockedLabel}
              </span>
            )}
          </div>
        </aside>
      </Reveal>

      <ArtifactModal artifact={activeArtifact} dictionary={copy} onClose={() => setActiveArtifact(null)} />
    </section>
  );
}
