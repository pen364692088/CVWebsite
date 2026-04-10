"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { startTransition, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Dictionary } from "@/data/dictionaries";
import { showcaseDictionaries } from "@/data/showcase";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import type { Locale } from "@/lib/i18n";
import { assetPath } from "@/lib/site";
import { SHOWCASE_SECTION_IDS, type ShowcaseSectionId } from "@/lib/showcase";

const ShowcaseGeometryCanvas = dynamic(
  () => import("@/components/showcase-geometry-canvas").then((module) => module.ShowcaseGeometryCanvas),
  { ssr: false },
);

interface ArchiveExperienceProps {
  locale: Locale;
  dictionary: Dictionary;
  contacts: ContactLink[];
  dossier: StudioDossierAsset;
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ArchiveExperience({ locale, dictionary, contacts, dossier }: ArchiveExperienceProps) {
  const copy = showcaseDictionaries[locale];
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);
  const sectionRefs = useRef<Record<ShowcaseSectionId, HTMLElement | null>>({
    "hero-wordmark": null,
    "discipline-strip": null,
    "showcase-wall": null,
    "manifesto-inversion": null,
    "selected-work": null,
    "contact-coda": null,
  });
  const [activeSection, setActiveSection] = useState<ShowcaseSectionId>("hero-wordmark");
  const [heroProgress, setHeroProgress] = useState(0);
  const [wallProgress, setWallProgress] = useState(0);
  const [canRenderLive, setCanRenderLive] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const deferredHeroProgress = useDeferredValue(heroProgress);

  const heroImage = copy.wall.panels[0].asset;
  const manifestoImage = copy.wall.panels[4].asset;
  const navLabelMap = useMemo(
    () => Object.fromEntries(copy.nav.items.map((item) => [item.id, item.label])) as Record<ShowcaseSectionId, string>,
    [copy.nav.items],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    setIsHydrated(true);
    setCanRenderLive(supportsWebGL());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (reducedMotion) {
      const handleScroll = () => {
        const viewportMid = window.innerHeight * 0.5;
        let nextSection: ShowcaseSectionId = "hero-wordmark";

        for (const sectionId of SHOWCASE_SECTION_IDS) {
          const section = sectionRefs.current[sectionId];
          if (!section) continue;

          const rect = section.getBoundingClientRect();
          if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
            nextSection = sectionId;
            break;
          }
        }

        const heroSection = sectionRefs.current["hero-wordmark"];
        const wallSection = sectionRefs.current["showcase-wall"];

        if (heroSection) {
          const rect = heroSection.getBoundingClientRect();
          const progress = Math.min(Math.max((window.innerHeight - rect.top) / Math.max(rect.height, 1), 0), 1);
          setHeroProgress(progress);
        }

        if (wallSection) {
          const rect = wallSection.getBoundingClientRect();
          const progress = Math.min(Math.max((window.innerHeight - rect.top) / Math.max(rect.height, 1), 0), 1);
          setWallProgress(progress);
        }

        startTransition(() => setActiveSection(nextSection));
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
      duration: 1.05,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.95,
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

    const sectionTriggers = SHOWCASE_SECTION_IDS.map((sectionId) => {
      const section = sectionRefs.current[sectionId];
      if (!section) return null;

      return ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => startTransition(() => setActiveSection(sectionId)),
        onEnterBack: () => startTransition(() => setActiveSection(sectionId)),
      });
    });

    const heroSection = sectionRefs.current["hero-wordmark"];
    const wallSection = sectionRefs.current["showcase-wall"];
    const heroTrigger = heroSection
      ? ScrollTrigger.create({
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => setHeroProgress(self.progress),
        })
      : null;
    const wallTrigger = wallSection
      ? ScrollTrigger.create({
          trigger: wallSection,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => setWallProgress(self.progress),
        })
      : null;

    ScrollTrigger.refresh();

    return () => {
      sectionTriggers.forEach((trigger) => trigger?.kill());
      heroTrigger?.kill();
      wallTrigger?.kill();
      window.cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  function setSectionRef(sectionId: ShowcaseSectionId, node: HTMLElement | null) {
    sectionRefs.current[sectionId] = node;
  }

  function handleJump(sectionId: ShowcaseSectionId) {
    const target = sectionRefs.current[sectionId];
    if (!target) return;

    if (!reducedMotion && lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -24 });
      return;
    }

    target.scrollIntoView({ behavior: "auto", block: "start" });
  }

  const heroShift = reducedMotion ? 0 : deferredHeroProgress * 84;
  const heroScale = reducedMotion ? 1 : 1 - deferredHeroProgress * 0.08;
  const wallOffset = reducedMotion ? 0 : (wallProgress - 0.5) * 42;

  return (
    <div className="showcase-root">
      <div className="showcase-grid-backdrop" aria-hidden="true" />
      <div className="showcase-grid-vignette" aria-hidden="true" />
      <div className="showcase-grid-pulse" aria-hidden="true" />

      <div className="showcase-chrome">
        <div className="showcase-toprail">
          <div className="showcase-toprail-brand">
            <span>{copy.hero.status}</span>
            <span>{navLabelMap[activeSection]}</span>
          </div>
          <nav className="showcase-nav" aria-label={copy.nav.ariaLabel}>
            {copy.nav.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`showcase-nav-link ${activeSection === item.id ? "showcase-nav-link-active" : ""}`}
                onClick={() => handleJump(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="showcase-main">
        <section
          id="hero-wordmark"
          ref={(node) => setSectionRef("hero-wordmark", node)}
          className="showcase-section showcase-section-hero"
        >
          <div className="showcase-hero-sticky">
            <div className="showcase-hero-grid">
              <div className="showcase-hero-copy">
                <p className="showcase-eyebrow">{copy.hero.eyebrow}</p>
                <div className="showcase-wordmark-shell" style={{ transform: `translateY(${-heroShift}px) scale(${heroScale})` }}>
                  <p className="showcase-wordmark-line">ASHEN</p>
                  <p className="showcase-wordmark-line showcase-wordmark-line-offset">ARCHIVE</p>
                </div>
                <p className="showcase-lead">{copy.hero.lead}</p>
                <p className="showcase-body">{copy.hero.body}</p>
                <div className="showcase-hero-actions">
                  <button type="button" className="primary-button" onClick={() => handleJump("showcase-wall")}>
                    {copy.hero.primaryCta}
                  </button>
                  <button type="button" className="secondary-button" onClick={() => handleJump("manifesto-inversion")}>
                    {copy.hero.secondaryCta}
                  </button>
                </div>
                <div className="showcase-hero-metrics">
                  <p className="showcase-mini-label">{copy.hero.metricLabel}</p>
                  <ul className="showcase-mini-list">
                    {copy.hero.metrics.map((metric) => (
                      <li key={metric}>{metric}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="showcase-hero-visual">
                <div className="showcase-hero-image-shell">
                  <Image
                    src={assetPath(heroImage)}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1200px) 48vw, 100vw"
                    className="showcase-hero-image"
                  />
                  {isHydrated && canRenderLive ? (
                    <div className="showcase-hero-canvas">
                      <ShowcaseGeometryCanvas
                        activeSection={activeSection}
                        heroProgress={deferredHeroProgress}
                        reducedMotion={Boolean(reducedMotion)}
                      />
                    </div>
                  ) : null}
                </div>
                <div className="showcase-hero-hud">
                  <span>01 / Wordmark compression</span>
                  <span>02 / Triangle field</span>
                  <span>03 / Directed motion</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="discipline-strip"
          ref={(node) => setSectionRef("discipline-strip", node)}
          className="showcase-section"
        >
          <div className="showcase-shell">
            <header className="showcase-section-heading">
              <p className="showcase-eyebrow">{copy.disciplines.eyebrow}</p>
              <h2 className="showcase-section-title">{copy.disciplines.title}</h2>
              <p className="showcase-body showcase-body-compact">{copy.disciplines.intro}</p>
            </header>

            <div className="showcase-discipline-grid">
              {copy.disciplines.items.map((item, index) => (
                <article key={item.title} className="showcase-discipline-card">
                  <p className="showcase-discipline-index">{String(index + 1).padStart(2, "0")}</p>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="showcase-wall"
          ref={(node) => setSectionRef("showcase-wall", node)}
          className="showcase-section showcase-section-wall"
        >
          <div className="showcase-shell showcase-wall-layout">
            <header className="showcase-section-heading showcase-wall-copy">
              <p className="showcase-eyebrow">{copy.wall.eyebrow}</p>
              <h2 className="showcase-section-title">{copy.wall.title}</h2>
              <p className="showcase-body">{copy.wall.intro}</p>
            </header>

            <div className="showcase-wall-grid" style={{ transform: `translate3d(0, ${wallOffset}px, 0)` }}>
              {copy.wall.panels.map((panel, index) => (
                <article
                  key={panel.title}
                  className={`showcase-wall-panel showcase-wall-panel-${panel.variant}`}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="showcase-wall-panel-image">
                    <Image
                      src={assetPath(panel.asset)}
                      alt=""
                      fill
                      sizes="(min-width: 1200px) 30rem, (min-width: 768px) 45vw, 100vw"
                      className="showcase-wall-image"
                    />
                  </div>
                  <div className="showcase-wall-panel-copy">
                    <p className="showcase-mini-label">{panel.title}</p>
                    <p>{panel.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="manifesto-inversion"
          ref={(node) => setSectionRef("manifesto-inversion", node)}
          className="showcase-section showcase-section-light"
        >
          <div className="showcase-light-shell">
            <div className="showcase-light-graphic">
              <Image
                src={assetPath(manifestoImage)}
                alt=""
                fill
                sizes="(min-width: 1200px) 34vw, 100vw"
                className="showcase-light-image"
              />
            </div>

            <div className="showcase-light-copy">
              <p className="showcase-light-eyebrow">{copy.manifesto.eyebrow}</p>
              <h2 className="showcase-light-title">{copy.manifesto.title}</h2>
              <p className="showcase-light-lead">{copy.manifesto.lead}</p>
              <p className="showcase-light-body">{copy.manifesto.body}</p>
              <div className="showcase-principle-grid">
                {copy.manifesto.principles.map((principle) => (
                  <article key={principle.label} className="showcase-principle-card">
                    <h3>{principle.label}</h3>
                    <p>{principle.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="selected-work"
          ref={(node) => setSectionRef("selected-work", node)}
          className="showcase-section"
        >
          <div className="showcase-shell">
            <header className="showcase-section-heading">
              <p className="showcase-eyebrow">{copy.selectedWork.eyebrow}</p>
              <h2 className="showcase-section-title">{copy.selectedWork.title}</h2>
              <p className="showcase-body showcase-body-compact">{copy.selectedWork.intro}</p>
            </header>

            <div className="showcase-work-grid">
              {copy.selectedWork.cards.map((card) => (
                <article key={card.title} className="showcase-work-card">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <ul className="showcase-work-bullets">
                    {card.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact-coda"
          ref={(node) => setSectionRef("contact-coda", node)}
          className="showcase-section"
        >
          <div className="showcase-shell showcase-contact-shell">
            <div className="showcase-contact-copy">
              <p className="showcase-eyebrow">{copy.contact.eyebrow}</p>
              <h2 className="showcase-section-title">{copy.contact.title}</h2>
              <p className="showcase-lead">{copy.contact.lead}</p>
              <p className="showcase-body">{copy.contact.body}</p>
            </div>

            <div className="showcase-contact-grid">
              <article className="showcase-contact-card">
                <p className="showcase-mini-label">{copy.contact.linksLabel}</p>
                <ul className="showcase-contact-links">
                  {contacts.map((contact) => (
                    <li key={contact.key}>
                      {contact.available ? (
                        <a href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                          {contact.label}
                        </a>
                      ) : (
                        <span>{contact.label || dictionary.contact.unavailableLabel}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="showcase-contact-card">
                <p className="showcase-mini-label">{copy.contact.availabilityLabel}</p>
                <ul className="showcase-work-bullets">
                  {copy.contact.availability.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="showcase-contact-card">
                <p className="showcase-mini-label">{copy.contact.dossierLabel}</p>
                {dossier.available ? (
                  <a className="showcase-contact-dossier" href={assetPath(dossier.href)}>
                    {dictionary.contact.dossierActionLabel}
                  </a>
                ) : (
                  <p className="showcase-body showcase-body-compact">{dictionary.contact.dossierUnavailableLabel}</p>
                )}
                <p className="showcase-contact-note">{copy.contact.note}</p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
