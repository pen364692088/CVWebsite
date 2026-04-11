"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { alcheTopPageCopy } from "@/data/alche-top-page";
import type { ContactLink, StudioDossierAsset } from "@/data/profile";
import {
  ALCHE_SCROLLABLE_SECTION_IDS,
  ALCHE_TOP_GROUPS,
  ALCHE_TOP_HERO_HUD_VISIBILITY,
  ALCHE_TOP_MISSION_VISIBILITY,
  ALCHE_TOP_NEWS_VISIBILITY,
  ALCHE_TOP_SECTIONS,
  ALCHE_TOP_SERVICE_VISIBILITY,
  ALCHE_TOP_STELLLA_VISIBILITY,
  ALCHE_TOP_VISION_VISIBILITY,
  ALCHE_TOP_WORKS_VISIBILITY,
  deriveKvState,
  deriveMissionState,
  deriveOutroState,
  deriveServiceState,
  deriveStelllaState,
  deriveVisionState,
  deriveWorksIntroState,
  deriveWorksOutroState,
  deriveWorksState,
  type AlcheScrollableSectionId,
} from "@/lib/alche-top-page";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { useTopPageScroll } from "@/components/alche-top-page/use-top-page-scroll";

import styles from "@/components/alche-top-page/alche-top-page-shell.module.scss";

const AlcheTopPageCanvas = dynamic(
  () => import("@/components/alche-top-page/alche-top-page-canvas").then((module) => module.AlcheTopPageCanvas),
  { ssr: false },
);

interface AlcheTopPageShellProps {
  locale: Locale;
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

function isVisible(sectionList: readonly string[], activeSection: string) {
  return sectionList.includes(activeSection);
}

export function AlcheTopPageShell({ locale, contacts, dossier }: AlcheTopPageShellProps) {
  const copy = alcheTopPageCopy[locale];
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<AlcheScrollableSectionId, HTMLElement | null>>({
    kv: null,
    works_intro: null,
    works: null,
    works_outro: null,
    mission_in: null,
    mission: null,
    vision: null,
    vision_out: null,
    service_in: null,
    service: null,
    stellla: null,
    outro: null,
  });
  const [canRenderLive, setCanRenderLive] = useState(true);
  const { reducedMotion, activeSection, trackedSection, activeGroup, sectionProgress, groupProgress, introProgress, heroShotId, scrollToSection } =
    useTopPageScroll({
      sectionRefs,
    });

  const kvState = deriveKvState(introProgress);
  const worksIntroState =
    activeSection === "works_intro"
      ? deriveWorksIntroState(sectionProgress)
      : activeSection === "works" || activeSection === "works_outro"
        ? deriveWorksIntroState(1)
        : deriveWorksIntroState(0);
  const worksState =
    activeSection === "works"
      ? deriveWorksState(sectionProgress, copy.works.items.length)
      : activeSection === "works_outro"
        ? deriveWorksState(1, copy.works.items.length)
        : deriveWorksState(0, copy.works.items.length);
  const worksOutroState =
    activeSection === "works_outro"
      ? deriveWorksOutroState(sectionProgress)
      : activeSection === "mission_in" || activeSection === "mission"
        ? deriveWorksOutroState(1)
        : deriveWorksOutroState(0);
  const missionState =
    activeSection === "mission_in"
      ? deriveMissionState(sectionProgress)
      : activeSection === "mission" || activeSection === "vision" || activeSection === "vision_out"
        ? deriveMissionState(1)
        : deriveMissionState(0);
  const visionState =
    activeSection === "vision"
      ? deriveVisionState(sectionProgress)
      : activeSection === "vision_out" || activeSection === "service_in"
        ? deriveVisionState(1)
        : deriveVisionState(0);
  const serviceState =
    activeSection === "service_in"
      ? deriveServiceState(sectionProgress * 0.4, copy.service.items.length)
      : activeSection === "service"
        ? deriveServiceState(sectionProgress, copy.service.items.length)
        : activeSection === "stellla"
          ? deriveServiceState(1, copy.service.items.length)
          : deriveServiceState(0, copy.service.items.length);
  const stelllaState =
    activeSection === "stellla"
      ? deriveStelllaState(sectionProgress)
      : activeSection === "outro"
        ? deriveStelllaState(1)
        : deriveStelllaState(0);
  const outroState = activeSection === "outro" ? deriveOutroState(sectionProgress) : deriveOutroState(0);

  useEffect(() => {
    setCanRenderLive(supportsWebGL());
  }, []);

  function setSectionRef(sectionId: AlcheScrollableSectionId, node: HTMLElement | null) {
    sectionRefs.current[sectionId] = node;
  }

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;
    localStorage.setItem(SITE.localeStorageKey, nextLocale);
    router.push(`/${nextLocale}/`);
  }

  const worksVisible = isVisible(ALCHE_TOP_WORKS_VISIBILITY, activeSection);
  const missionVisible = isVisible(ALCHE_TOP_MISSION_VISIBILITY, activeSection);
  const visionVisible = isVisible(ALCHE_TOP_VISION_VISIBILITY, activeSection);
  const serviceVisible = isVisible(ALCHE_TOP_SERVICE_VISIBILITY, activeSection);
  const stelllaVisible = isVisible(ALCHE_TOP_STELLLA_VISIBILITY, activeSection);
  const heroHudVisible = isVisible(ALCHE_TOP_HERO_HUD_VISIBILITY, activeSection);
  const newsVisible = isVisible(ALCHE_TOP_NEWS_VISIBILITY, activeSection);
  const activeWork = copy.works.items[Math.min(copy.works.items.length - 1, worksState.activeIndex)] ?? copy.works.items[0];
  const activeService = copy.service.items[Math.min(copy.service.items.length - 1, serviceState.activeIndex)] ?? copy.service.items[0];

  const stageStyle = useMemo(
    () =>
      ({
        "--alche-intro": introProgress.toFixed(3),
        "--alche-group-progress": groupProgress.toFixed(3),
      }) as CSSProperties,
    [groupProgress, introProgress],
  );

  const telemetry = useMemo(
    () => [
      { label: "SECTION", value: activeSection.toUpperCase() },
      { label: "TRACKED", value: trackedSection.toUpperCase() },
      { label: "GROUP", value: activeGroup?.toUpperCase() ?? "NONE" },
      { label: "FLOW", value: `${Math.round(sectionProgress * 100).toString().padStart(3, "0")}%` },
    ],
    [activeGroup, activeSection, sectionProgress, trackedSection],
  );

  return (
    <div ref={stageRef} className={styles.root} style={stageStyle}>
      <div className={styles.stage}>
        <div className={styles.canvasLayer}>
          {canRenderLive ? (
            <AlcheTopPageCanvas
              activeSection={activeSection}
              sectionProgress={sectionProgress}
              introProgress={introProgress}
              heroShotId={heroShotId}
              reducedMotion={reducedMotion}
            />
          ) : (
            <div className={styles.fallback}>WebGL unavailable. The DOM shell remains available.</div>
          )}
        </div>

        <div className={styles.overlay}>
          <div className={styles.loadingOverlay} data-hidden={introProgress > 0.995}>
            <p className={styles.loadingEyebrow}>{copy.loading.eyebrow}</p>
            <p className={styles.loadingBody}>{copy.loading.body}</p>
            <div className={styles.loadingRule}>
              <span style={{ transform: `scaleX(${Math.max(introProgress, 0.02)})` }} />
            </div>
          </div>

          <header className={styles.header}>
            <button type="button" className={styles.headerBrand} onClick={() => scrollToSection(sectionRefs.current.kv)}>
              <span className={styles.headerBrandWord}>ALCHE</span>
            </button>

            <nav className={styles.headerNav} aria-label={copy.header.navAria}>
              {copy.header.navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.headerNavButton} ${
                    (item.id === "works" && activeGroup === "works") ||
                    (item.id === "about" && (activeGroup === "about" || activeGroup === "vision")) ||
                    (item.id === "stellla" && activeSection === "stellla") ||
                    (item.id === "news" && activeGroup === "top")
                      ? styles.headerNavButtonActive
                      : ""
                  }`}
                  onClick={() => scrollToSection(sectionRefs.current[item.target])}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className={styles.headerRight}>
              <button type="button" className={styles.headerAction} onClick={() => scrollToSection(sectionRefs.current.outro)}>
                {copy.header.contactLabel} / {copy.header.recruitLabel}
              </button>

              <button type="button" className={styles.soundToggle} aria-label={copy.header.soundLabel}>
                <span />
                <span />
                <span />
              </button>

              <label className={styles.localeField}>
                <span className="sr-only">{copy.header.localeLabel}</span>
                <select
                  className={styles.localeSelect}
                  value={locale}
                  onChange={(event) => handleLocaleChange(event.target.value as Locale)}
                >
                  {LOCALES.map((entry) => (
                    <option key={entry} value={entry}>
                      {LOCALE_LABELS[entry]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </header>

          <aside className={styles.scrollIndicator} aria-label={copy.indicator.title} data-top-scroll-indicator>
            {ALCHE_TOP_GROUPS.map((group) => {
              const isActive = activeGroup === group.id;
              const activeSubIndex = Math.max(group.subsections.indexOf(trackedSection), 0);

              return (
                <div key={group.id} className={`${styles.scrollIndicatorGroup} ${isActive ? styles.scrollIndicatorGroupActive : ""}`}>
                  <button
                    type="button"
                    className={styles.scrollIndicatorMain}
                    onClick={() => scrollToSection(sectionRefs.current[group.scrollTarget])}
                  >
                    <span className={styles.scrollIndicatorLine} />
                    <span className={styles.scrollIndicatorLabel}>{copy.indicator.groups[group.id]}</span>
                  </button>

                  <div className={styles.scrollIndicatorSubs}>
                    {group.subsections.map((subsection, index) => (
                      <button
                        key={subsection}
                        type="button"
                        className={`${styles.scrollIndicatorSub} ${
                          isActive && activeSubIndex === index ? styles.scrollIndicatorSubActive : ""
                        }`}
                        onClick={() => scrollToSection(sectionRefs.current[subsection])}
                        aria-label={`${copy.indicator.groups[group.id]} ${index + 1}`}
                      >
                        <span />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </aside>

          <aside className={styles.newsRail} style={{ opacity: newsVisible ? 1 : 0, pointerEvents: newsVisible ? "auto" : "none" }}>
            <p className={styles.newsTitle}>{copy.news.title}</p>
            <div className={styles.newsList}>
              {copy.news.items.map((item) => (
                <article key={`${item.date}-${item.title}`} className={styles.newsItem}>
                  <p className={styles.newsDate}>{item.date}</p>
                  {item.href ? (
                    <a className={styles.newsLink} href={item.href} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>
                  ) : (
                    <p className={styles.newsLink}>{item.title}</p>
                  )}
                </article>
              ))}
            </div>
          </aside>

          <aside
            className={styles.heroHud}
            style={{
              opacity: heroHudVisible ? kvState.hudReveal * (1 - worksIntroState.alcheFade * 0.72) : 0,
              pointerEvents: heroHudVisible ? "auto" : "none",
            }}
          >
            <div className={styles.heroHudFrame}>
              <p className={styles.heroHudTitle}>{copy.hud.title}</p>
              <p className={styles.heroHudSubtitle}>{copy.hud.subtitle}</p>

              <div className={styles.telemetry}>
                {telemetry.map((item) => (
                  <div key={item.label} className={styles.telemetryItem}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <ul className={styles.metricList}>
                {copy.hud.metrics.map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>

              <p className={styles.heroHudNote}>{copy.hud.note}</p>
            </div>
          </aside>

          <div
            className={styles.debugPanel}
            style={{ opacity: heroHudVisible ? kvState.hudReveal * 0.92 : 0, pointerEvents: heroHudVisible ? "auto" : "none" }}
          >
            <p>MAIN LOGO / STRUCTURE</p>
            <div>
              <span>state</span>
              <strong>{activeSection}</strong>
              <span>intro</span>
              <strong>{Math.round(introProgress * 100)}%</strong>
            </div>
          </div>

          <section
            className={styles.worksPanel}
            style={{
              opacity: worksVisible ? Math.max(worksIntroState.handoffMix, worksState.cardMix, 1 - worksOutroState.clearMix) : 0,
              pointerEvents: worksVisible ? "auto" : "none",
            }}
          >
            <p className={styles.panelEyebrow}>{copy.works.eyebrow}</p>
            <h2 className={styles.panelTitle}>{copy.works.title}</h2>
            <p className={styles.panelBody}>{copy.works.body}</p>

            <div className={styles.worksMeta}>
              <div className={styles.worksMetaHeader}>
                <span>{activeWork.code}</span>
                <span>{activeWork.date}</span>
              </div>
              <h3>{activeWork.title}</h3>
              <p>{activeWork.subtitle}</p>
              <ul className={styles.tagList}>
                {activeWork.categories.map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            </div>

            <div className={styles.worksList}>
              {copy.works.items.map((item, index) => (
                <button
                  key={item.code}
                  type="button"
                  className={`${styles.worksListItem} ${index === worksState.activeIndex ? styles.worksListItemActive : ""}`}
                  onClick={() => scrollToSection(sectionRefs.current.works)}
                >
                  <span>{item.date}</span>
                  <strong>{item.title}</strong>
                </button>
              ))}
            </div>
          </section>

          <section
            className={styles.missionPanel}
            style={{
              opacity: missionVisible ? Math.max(missionState.flattenMix, missionState.whiteMix) : 0,
              pointerEvents: missionVisible ? "auto" : "none",
            }}
          >
            <p className={styles.panelEyebrow}>{copy.mission.eyebrow}</p>
            <h2 className={styles.panelTitle}>{copy.mission.title}</h2>
            <p className={styles.panelBody}>{copy.mission.body}</p>
          </section>

          <section
            className={styles.visionPanel}
            style={{
              opacity: visionVisible ? Math.max(visionState.lineMix, visionState.densityMix) : 0,
              pointerEvents: visionVisible ? "auto" : "none",
            }}
          >
            <p className={styles.panelEyebrow}>{copy.vision.eyebrow}</p>
            <h2 className={styles.panelTitle}>{copy.vision.title}</h2>
            <p className={styles.panelBody}>{copy.vision.body}</p>
          </section>

          <section
            className={styles.servicePanel}
            style={{
              opacity: serviceVisible ? Math.max(serviceState.densityMix, 0.12) : 0,
              pointerEvents: serviceVisible ? "auto" : "none",
            }}
          >
            <p className={styles.panelEyebrow}>{copy.service.eyebrow}</p>
            <h2 className={styles.panelTitle}>{copy.service.title}</h2>
            <div className={styles.serviceList}>
              {copy.service.items.map((item, index) => (
                <article key={item.code} className={`${styles.serviceItem} ${index === serviceState.activeIndex ? styles.serviceItemActive : ""}`}>
                  <span>{item.code}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
            <div className={styles.serviceFocus}>
              <span>{activeService.code}</span>
              <strong>{activeService.title}</strong>
            </div>
          </section>

          <section
            className={styles.stelllaPanel}
            style={{
              opacity: stelllaVisible ? Math.max(stelllaState.architectureMix, stelllaState.editorialMix) : 0,
              pointerEvents: stelllaVisible ? "auto" : "none",
            }}
          >
            <p className={styles.panelEyebrow}>{copy.stellla.eyebrow}</p>
            <h2 className={styles.stelllaWord}>{copy.stellla.title}</h2>
            <p className={styles.panelBody}>{copy.stellla.body}</p>
            <div className={styles.stelllaFrame} data-visible={stelllaState.frameMix > 0.5}>
              <span>{copy.stellla.frameLabel}</span>
            </div>
          </section>
        </div>
      </div>

      <main className={styles.sectionTrack}>
        {ALCHE_TOP_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(node) => setSectionRef(section.id, node)}
            className={`${styles.section} ${styles[`section${section.id[0].toUpperCase()}${section.id.slice(1)}`] ?? ""}`}
            style={{ minHeight: section.minHeight }}
            data-top_section={section.id}
            data-snap-ratio={section.snapRatio}
            aria-label={section.label}
          >
            <h2 className="sr-only">{section.label}</h2>
            {section.id === "outro" ? (
              <footer className={styles.footer}>
                <div className={styles.footerTop}>
                  <div className={styles.footerColumns}>
                    <div className={styles.footerColumn}>
                      <a href="#kv">Top</a>
                      <a href="#works">Works</a>
                      <a href="#mission">About</a>
                    </div>
                    <div className={styles.footerColumn}>
                      <a href="#vision">Vision</a>
                      <a href="#service">Service</a>
                      <a href="#stellla">stellla</a>
                    </div>
                    <div className={styles.footerColumn}>
                      <p className={styles.footerColumnTitle}>{copy.outro.linksTitle}</p>
                      {contacts.map((link) =>
                        link.available ? (
                          <a key={link.key} href={link.href} target="_blank" rel="noreferrer">
                            {link.label}
                          </a>
                        ) : (
                          <span key={link.key}>{link.label || link.key}</span>
                        ),
                      )}
                      {!dossier.available ? null : (
                        <a href={dossier.href} target="_blank" rel="noreferrer">
                          Dossier
                        </a>
                      )}
                    </div>
                  </div>

                  <div className={styles.footerAside}>
                    <p className={styles.panelEyebrow}>{copy.outro.eyebrow}</p>
                    <h2 className={styles.footerTitle}>{copy.outro.title}</h2>
                    <p className={styles.footerBody}>{copy.outro.body}</p>
                    <div className={styles.footerLegal}>
                      <p>{copy.outro.legalTitle}</p>
                      <div className={styles.footerLegalLinks}>
                        <a href="#outro">{copy.outro.privacyLabel}</a>
                        <a href="#outro">{copy.outro.licenseLabel}</a>
                      </div>
                    </div>
                    <p className={styles.footerCompany}>{copy.outro.companyLabel}</p>
                  </div>
                </div>

                <div className={styles.footerBottom}>
                  <span>{copy.outro.copyright}</span>
                  <strong className={styles.footerWordmark} style={{ opacity: outroState.wordmarkMix }}>
                    ALCHE
                  </strong>
                </div>
              </footer>
            ) : null}
          </section>
        ))}
      </main>
    </div>
  );
}
