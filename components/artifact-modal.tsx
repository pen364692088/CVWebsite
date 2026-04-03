"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

import type { Dictionary } from "@/data/dictionaries";
import { assetPath } from "@/lib/site";

interface ArtifactModalProps {
  artifact: {
    slug: string;
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
  } | null;
  dictionary: Dictionary["artifacts"];
  onClose: () => void;
}

export function ArtifactModal({ artifact, dictionary, onClose }: ArtifactModalProps) {
  const reducedMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!artifact) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [artifact, onClose]);

  return (
    <AnimatePresence>
      {artifact ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${artifact.slug}-title`}
            className="ritual-panel relative w-full max-w-5xl p-6 sm:p-8"
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 0.28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={closeRef} type="button" className="absolute right-5 top-5 icon-button" onClick={onClose}>
              {dictionary.closeLabel}
            </button>

            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-5">
                <div>
                  <p className="section-kicker">{dictionary.featuredLabel}</p>
                  <h2 id={`${artifact.slug}-title`} className="font-display text-3xl text-ivory sm:text-4xl">
                    {artifact.title}
                  </h2>
                  <p className="mt-3 max-w-3xl text-base leading-7 text-mist">{artifact.summary}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {artifact.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="detail-block sm:col-span-2">
                    <h3>{dictionary.whatLabel}</h3>
                    <p>{artifact.what}</p>
                  </div>
                  <div className="detail-block">
                    <h3>{dictionary.contributionLabel}</h3>
                    <ul className="space-y-2 text-sm leading-6 text-mist">
                      {artifact.contribution.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-block">
                    <h3>{dictionary.techLabel}</h3>
                    <ul className="space-y-2 text-sm leading-6 text-mist">
                      {artifact.technologies.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-block sm:col-span-2">
                    <h3>{dictionary.solvedLabel}</h3>
                    <p>{artifact.solved}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-xl text-ivory">{dictionary.mediaLabel}</h3>
                <div className="grid gap-4">
                  {artifact.media.map((item) =>
                    item.kind === "video" ? (
                      <div key={item.src} className="media-frame">
                        <video
                          controls
                          preload="metadata"
                          poster={item.poster ? assetPath(item.poster) : undefined}
                          className="h-full w-full rounded-[inherit] object-cover"
                          src={assetPath(item.src)}
                        >
                          {item.label}
                        </video>
                      </div>
                    ) : (
                      <div key={item.src} className="media-frame">
                        <Image
                          src={assetPath(item.src)}
                          alt={item.alt}
                          fill
                          sizes="(min-width: 1024px) 28rem, 100vw"
                          className="rounded-[inherit] object-cover"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
