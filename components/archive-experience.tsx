"use client";

import Image from "next/image";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { ArtifactView } from "@/data/artifacts";
import type { Dictionary } from "@/data/dictionaries";
import { experienceDictionaries } from "@/data/experience";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import type { ExperienceChapterId } from "@/lib/archive";
import { EXPERIENCE_CHAPTERS } from "@/lib/archive";
import type { Locale } from "@/lib/i18n";
import { assetPath } from "@/lib/site";

import { ArchiveExperienceStage } from "@/components/archive-experience-stage";

interface ArchiveExperienceProps {
  locale: Locale;
  dictionary: Dictionary;
  artifacts: ArtifactView[];
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

export function ArchiveExperience({
  locale,
  dictionary,
  artifacts,
  contacts,
  dossier,
}: ArchiveExperienceProps) {
  const experienceCopy = experienceDictionaries[locale];
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const sectionRefs = useRef<Record<ExperienceChapterId, HTMLElement | null>>({
    threshold: null,
    oath: null,
    egocore: null,
    "ashen-archive": null,
    openemotion: null,
    "contact-coda": null,
  });
  const [activeChapter, setActiveChapter] = useState<ExperienceChapterId>("threshold");
  const [activeProgress, setActiveProgress] = useState(0);
  const deferredProgress = useDeferredValue(activeProgress);

  const artifactMap = useMemo(
    () => new Map(artifacts.map((artifact) => [artifact.slug as ExperienceChapterId, artifact])),
    [artifacts],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (reducedMotion) {
      const handleScroll = () => {
        const viewportMid = window.innerHeight * 0.5;
        let nextChapter: ExperienceChapterId = "threshold";
        let nextProgress = 0;

        for (const chapterId of EXPERIENCE_CHAPTERS) {
          const section = sectionRefs.current[chapterId];
          if (!section) continue;

          const rect = section.getBoundingClientRect();
          if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
            nextChapter = chapterId;
            nextProgress = Math.min(Math.max((viewportMid - rect.top) / Math.max(rect.height, 1), 0), 1);
            break;
          }
        }

        startTransition(() => {
          setActiveChapter(nextChapter);
          setActiveProgress(nextProgress);
        });
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleScroll);
      };
    }

    const lenis = new Lenis({
      duration: 1.15,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };

    frame = window.requestAnimationFrame(raf);

    const triggers = EXPERIENCE_CHAPTERS.map((chapterId) => {
      const section = sectionRefs.current[chapterId];
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => startTransition(() => setActiveChapter(chapterId)),
        onEnterBack: () => startTransition(() => setActiveChapter(chapterId)),
        onUpdate: (self) => {
          if (!self.isActive) return;
          startTransition(() => setActiveProgress(self.progress));
        },
      });
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger?.kill());
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  function setSectionRef(chapterId: ExperienceChapterId, node: HTMLElement | null) {
    sectionRefs.current[chapterId] = node;
  }

  function handleJump(chapterId: ExperienceChapterId) {
    const target = sectionRefs.current[chapterId];
    if (!target) return;

    if (!reducedMotion && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -24 });
      return;
    }

    target.scrollIntoView({ behavior: "auto", block: "start" });
  }

  return (
    <div className="experience-root">
      <ArchiveExperienceStage
        activeChapter={activeChapter}
        progress={deferredProgress}
        experienceCopy={experienceCopy}
        artifacts={artifacts}
      />

      <div className="experience-chrome">
        <div className="experience-toprail">
          <div>
            <p className="experience-toprail-brand">{dictionary.nav.title}</p>
            <p className="experience-toprail-caption">{experienceCopy.scrollLabel}</p>
          </div>
          <nav className="experience-nav" aria-label={experienceCopy.navLabel}>
            {EXPERIENCE_CHAPTERS.map((chapterId) => (
              <button
                key={chapterId}
                type="button"
                className={`experience-nav-link ${activeChapter === chapterId ? "experience-nav-link-active" : ""}`}
                onClick={() => handleJump(chapterId)}
              >
                {experienceCopy.chapterNav[chapterId]}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="experience-main">
        <section
          id="threshold"
          ref={(node) => setSectionRef("threshold", node)}
          className="experience-chapter experience-chapter-threshold"
        >
          <div className="experience-panel experience-panel-threshold">
            <div className="experience-threshold-copy">
              <p className="experience-kicker">{experienceCopy.threshold.kicker}</p>
              <h1 className="experience-title">{experienceCopy.threshold.title}</h1>
              <p className="experience-lead">{experienceCopy.threshold.lead}</p>
              <p className="experience-body">{experienceCopy.threshold.body}</p>
              <div className="experience-threshold-actions">
                <button type="button" className="primary-button" onClick={() => handleJump("oath")}>
                  {experienceCopy.threshold.primaryCta}
                </button>
                <button type="button" className="secondary-button" onClick={() => handleJump("egocore")}>
                  {experienceCopy.threshold.secondaryCta}
                </button>
              </div>
              <p className="experience-footnote">{experienceCopy.threshold.footnote}</p>
            </div>
          </div>
        </section>

        <section id="oath" ref={(node) => setSectionRef("oath", node)} className="experience-chapter experience-chapter-oath">
          <div className="experience-panel">
            <div className="experience-oath-grid">
              <div className="experience-copy-stack">
                <p className="experience-kicker">{experienceCopy.oath.kicker}</p>
                <h2 className="experience-section-title">{experienceCopy.oath.title}</h2>
                <p className="experience-lead">{experienceCopy.oath.lead}</p>
                <p className="experience-body">{experienceCopy.oath.body}</p>
                <div className="experience-proof-row">
                  {dictionary.hero.proofChips.map((item) => (
                    <span key={item} className="experience-proof-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="experience-ledger-panel">
                <p className="experience-ledger-label">{experienceCopy.oath.railLabel}</p>
                <h3 className="experience-ledger-title">{dictionary.about.title}</h3>
                <p className="experience-ledger-body">{dictionary.about.body}</p>
                <dl className="experience-dossier-grid">
                  {dictionary.about.dossier.map((item) => (
                    <div key={item.label} className="experience-dossier-row">
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {(["egocore", "ashen-archive", "openemotion"] as const).map((chapterId) => {
          const artifact = artifactMap.get(chapterId);
          if (!artifact) return null;
          const caseNumber = `A-${String(artifacts.findIndex((item) => item.slug === artifact.slug) + 1).padStart(2, "0")}`;

          return (
            <section
              key={chapterId}
              id={chapterId}
              ref={(node) => setSectionRef(chapterId, node)}
              className="experience-chapter experience-chapter-case"
            >
              <div className="experience-panel experience-panel-case">
                <div className="experience-case-copy">
                  <p className="experience-kicker">
                    {experienceCopy.caseSection.kickerPrefix} · {caseNumber}
                  </p>
                  <h2 className="experience-section-title">{artifact.title}</h2>
                  <p className="experience-case-meta">
                    <span>{artifact.category}</span>
                    <span>{artifact.role}</span>
                  </p>
                  <p className="experience-lead">{artifact.summary}</p>

                  <div className="experience-case-grid">
                    <article className="experience-detail-card">
                      <h3>{experienceCopy.caseSection.summaryLabel}</h3>
                      <p>{artifact.what}</p>
                    </article>

                    <article className="experience-detail-card">
                      <h3>{experienceCopy.caseSection.evidenceLabel}</h3>
                      <ul className="experience-list">
                        {artifact.evidence.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>

                    <article className="experience-detail-card">
                      <h3>{experienceCopy.caseSection.contributionLabel}</h3>
                      <ul className="experience-list">
                        {artifact.contribution.map((item) => (
                          <li key={item.lens + item.text}>{item.text}</li>
                        ))}
                      </ul>
                    </article>

                    <article className="experience-detail-card">
                      <h3>{experienceCopy.caseSection.technologiesLabel}</h3>
                      <ul className="experience-tag-list" aria-label={experienceCopy.caseSection.technologiesLabel}>
                        {artifact.technologies.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </article>

                    <article className="experience-detail-card experience-detail-card-wide">
                      <h3>{experienceCopy.caseSection.solvedLabel}</h3>
                      <p>{artifact.solved}</p>
                    </article>
                  </div>
                </div>

                <aside className="experience-case-media">
                  <p className="experience-media-label">{experienceCopy.caseSection.mediaLabel}</p>
                  <div className="experience-media-stack">
                    {artifact.media.map((item, index) =>
                      item.kind === "video" ? (
                        <div key={item.src} className="experience-media-frame">
                          <video
                            controls
                            preload="metadata"
                            poster={item.poster ? assetPath(item.poster) : undefined}
                            className="experience-media-video"
                            src={assetPath(item.src)}
                          >
                            {item.label}
                          </video>
                        </div>
                      ) : (
                        <div key={item.src} className="experience-media-frame">
                          <Image
                            src={assetPath(item.src)}
                            alt={item.alt}
                            fill
                            sizes="(min-width: 1200px) 34rem, (min-width: 768px) 42vw, 100vw"
                            className="experience-media-image"
                            style={{ objectPosition: artifact.mediaPosition?.[index] }}
                          />
                        </div>
                      ),
                    )}
                  </div>
                </aside>
              </div>
            </section>
          );
        })}

        <section
          id="contact-coda"
          ref={(node) => setSectionRef("contact-coda", node)}
          className="experience-chapter experience-chapter-contact"
        >
          <div className="experience-panel experience-panel-contact">
            <div className="experience-copy-stack">
              <p className="experience-kicker">{experienceCopy.contactCoda.kicker}</p>
              <h2 className="experience-section-title">{experienceCopy.contactCoda.title}</h2>
              <p className="experience-lead">{experienceCopy.contactCoda.lead}</p>
              <p className="experience-body">{experienceCopy.contactCoda.body}</p>
            </div>

            <div className="experience-contact-grid">
              <article className="experience-detail-card">
                <h3>{experienceCopy.contactCoda.linksLabel}</h3>
                <ul className="experience-link-list">
                  {contacts.map((contact) => (
                    <li key={contact.key}>
                      {contact.available ? (
                        <a href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                          {contact.label}
                        </a>
                      ) : (
                        <span className="experience-link-disabled">{contact.label || dictionary.contact.unavailableLabel}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="experience-detail-card">
                <h3>{experienceCopy.contactCoda.availabilityLabel}</h3>
                <p>{dictionary.contact.collaborationBody}</p>
                <ul className="experience-list">
                  {dictionary.contact.capabilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="experience-detail-card">
                <h3>{experienceCopy.contactCoda.dossierLabel}</h3>
                <p>{dictionary.contact.dossierBody}</p>
                {dossier.available ? (
                  <a className="text-sm text-amber-100 underline underline-offset-4" href={assetPath(dossier.href)}>
                    {dictionary.contact.dossierActionLabel}
                  </a>
                ) : (
                  <p className="experience-link-disabled">{dictionary.contact.dossierUnavailableLabel}</p>
                )}
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
