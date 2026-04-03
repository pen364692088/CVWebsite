"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

import type { Dictionary } from "@/data/dictionaries";
import { assetPath } from "@/lib/site";

import { ArtifactModal } from "@/components/artifact-modal";
import { Reveal } from "@/components/reveal";

interface ArtifactView {
  slug: string;
  featured: boolean;
  cover: string;
  title: string;
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

export function ArtifactsSection({ copy, artifacts }: ArtifactsSectionProps) {
  const [activeArtifact, setActiveArtifact] = useState<ArtifactView | null>(null);

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
        {artifacts.map((artifact, index) => (
          <Reveal key={artifact.slug} delay={index * 0.07}>
            <motion.button
              type="button"
              className={`group artifact-card ${artifact.featured ? "lg:row-span-2" : ""}`}
              whileHover={{ y: -4 }}
              onClick={() => setActiveArtifact(artifact)}
              aria-haspopup="dialog"
              aria-label={`${copy.openLabel}: ${artifact.title}`}
            >
              <div className={`artifact-image-frame ${artifact.featured ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                <Image
                  src={assetPath(artifact.cover)}
                  alt={artifact.title}
                  fill
                  sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 28rem, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02] saturate-70 brightness-75 sepia-[0.15]"
                />
              </div>

              <div className="space-y-4 p-6 text-left">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-3xl text-ivory">{artifact.title}</h3>
                  {artifact.featured ? <span className="tag-pill">{copy.featuredLabel}</span> : null}
                </div>
                <p className="text-sm leading-7 text-mist">{artifact.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {artifact.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          </Reveal>
        ))}
      </div>

      <ArtifactModal artifact={activeArtifact} dictionary={copy} onClose={() => setActiveArtifact(null)} />
    </section>
  );
}
