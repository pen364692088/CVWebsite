"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useMemo, type CSSProperties, type PointerEvent } from "react";

import type { ArtifactView } from "@/data/artifacts";
import { HERO_PARTICLE_LAYOUT, HERO_PARTICLE_PRESETS, HERO_STAGE_ASSETS } from "@/data/atmosphere";
import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";
import { assetPath } from "@/lib/site";

interface HeroSectionProps {
  navCopy: Dictionary["nav"];
  copy: Dictionary["hero"];
  ritualCopy: Dictionary["game"];
  activeLens: ArchiveLens;
  artifacts: Array<ArtifactView & { caseNumber: string }>;
  onArtifactOpen: (slug: string) => void;
  onLensChange: (lens: ArchiveLens) => void;
}

const NAV_CLASSES = [
  "abyss-stage-nav-oaths",
  "abyss-stage-nav-artifacts",
  "abyss-stage-nav-lore",
  "abyss-stage-nav-ritual",
] as const;

const CARD_CLASSES = [
  "abyss-stage-card-one",
  "abyss-stage-card-two",
  "abyss-stage-card-three",
] as const;

type ActiveRitualLens = Exclude<ArchiveLens, "all">;

const RITUAL_CLASS_BY_LENS: Record<ActiveRitualLens, string> = {
  ember: "abyss-stage-ritual-flame",
  tower: "abyss-stage-ritual-spirit",
  moon: "abyss-stage-ritual-raven",
};

export function HeroSection({ navCopy, copy, ritualCopy, activeLens, artifacts, onArtifactOpen, onLensChange }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = !!prefersReducedMotion;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const stageX = useSpring(useTransform(pointerX, [-1, 1], [-6, 6]), {
    stiffness: 70,
    damping: 18,
    mass: 0.5,
  });
  const stageY = useSpring(useTransform(pointerY, [-1, 1], [-8, 8]), {
    stiffness: 70,
    damping: 18,
    mass: 0.5,
  });

  const particleLimit = useMemo(
    () =>
      Math.min(
        HERO_PARTICLE_LAYOUT.length,
        HERO_PARTICLE_PRESETS.reduce((sum, preset) => sum + (reducedMotion ? preset.reducedMotionCount : preset.count), 0),
      ),
    [reducedMotion],
  );

  const visibleParticles = useMemo(() => HERO_PARTICLE_LAYOUT.slice(0, particleLimit), [particleLimit]);

  const ritualOptions = useMemo(
    () =>
      (["ember", "tower", "moon"] as const).map((lens: ActiveRitualLens) => {
        const option = ritualCopy.options.find((item) => item.id === lens);
        if (!option) {
          throw new Error(`Missing ritual option for lens: ${lens}`);
        }

        return { ...option, id: lens } as typeof option & { id: ActiveRitualLens };
      }),
    [ritualCopy.options],
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || window.innerWidth < 900) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointerX.set(x);
    pointerY.set(y);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section className="abyss-hero" aria-labelledby="hero-title">
      <div className="abyss-hero-shell">
        <div className="abyss-reference-stage" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
          <motion.div
            className="abyss-reference-image"
            aria-hidden="true"
            style={reducedMotion ? undefined : { x: stageX, y: stageY }}
          >
            <div className="abyss-stage-backdrop" />
            <div className="abyss-stage-moon-haze" />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.castleMoon.src)}
              alt=""
              aria-hidden="true"
              width={640}
              height={448}
              priority
              className="abyss-stage-castle"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.dragon.src)}
              alt=""
              aria-hidden="true"
              width={408}
              height={240}
              priority
              className="abyss-stage-dragon"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.flameSwordAltar.src)}
              alt=""
              aria-hidden="true"
              width={420}
              height={320}
              priority
              className="abyss-stage-altar"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.smokeBand.src)}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="(min-width: 1280px) 64rem, (min-width: 768px) 78vw, 100vw"
              className="abyss-stage-smoke object-cover"
            />

            <Image
              src={assetPath(HERO_STAGE_ASSETS.emberMidOverlay.src)}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="abyss-stage-ember-overlay abyss-stage-ember-overlay-mid object-cover"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.emberBottomOverlay.src)}
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="100vw"
              className="abyss-stage-ember-overlay abyss-stage-ember-overlay-bottom object-cover"
            />

            <Image
              src={assetPath(HERO_STAGE_ASSETS.dividerTop.src)}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="abyss-stage-frame abyss-stage-frame-top"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.dividerMid.src)}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="abyss-stage-frame abyss-stage-frame-side abyss-stage-frame-left"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.dividerMid.src)}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="abyss-stage-frame abyss-stage-frame-side abyss-stage-frame-right"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.dividerBottom.src)}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="abyss-stage-frame abyss-stage-frame-bottom"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.dividerCorner.src)}
              alt=""
              aria-hidden="true"
              width={240}
              height={240}
              className="abyss-stage-corner abyss-stage-corner-tl"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.dividerCorner.src)}
              alt=""
              aria-hidden="true"
              width={240}
              height={240}
              className="abyss-stage-corner abyss-stage-corner-tr"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.dividerCorner.src)}
              alt=""
              aria-hidden="true"
              width={240}
              height={240}
              className="abyss-stage-corner abyss-stage-corner-bl"
            />
            <Image
              src={assetPath(HERO_STAGE_ASSETS.dividerCorner.src)}
              alt=""
              aria-hidden="true"
              width={240}
              height={240}
              className="abyss-stage-corner abyss-stage-corner-br"
            />
          </motion.div>

          <div className="abyss-particle-field abyss-particle-field-stage" aria-hidden="true">
            {visibleParticles.map((particle, index) => {
              const preset = HERO_PARTICLE_PRESETS[index % HERO_PARTICLE_PRESETS.length];

              return (
                <span
                  key={`${preset.id}-${particle.x}-${particle.y}`}
                  className={`abyss-particle abyss-particle-${preset.id}`}
                  style={
                    {
                      "--particle-x": particle.x,
                      "--particle-y": particle.y,
                      "--particle-scale": String(particle.scale),
                      "--particle-delay": `${particle.delay}s`,
                      "--particle-rotate": `${particle.rotate}deg`,
                      "--particle-duration": `${preset.minDuration + (index % 4) * ((preset.maxDuration - preset.minDuration) / 3)}s`,
                      "--particle-opacity": String(preset.baseOpacity),
                      backgroundImage: `url(${assetPath(preset.src)})`,
                    } as CSSProperties
                  }
                />
              );
            })}
          </div>

          <div className="abyss-stage-copy">
            <p className="hero-nameplate">{copy.identity}</p>
            <p className="hero-brandline">{copy.studioCredit}</p>
            <Image
              src={assetPath(HERO_STAGE_ASSETS.ornamentWide.src)}
              alt=""
              aria-hidden="true"
              width={476}
              height={60}
              className="abyss-stage-copy-ornament"
            />
            <h1 id="hero-title" className="abyss-stage-title">
              {copy.archiveLabel}
            </h1>
            <p className="abyss-stage-subtitle">{copy.subtitle}</p>
            <p className="abyss-stage-role">{copy.role}</p>
          </div>

          <div className="abyss-stage-hotspots">
            {navCopy.items.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`abyss-stage-hotspot abyss-stage-nav ${NAV_CLASSES[index]}`}
                data-nav={item.id}
              >
                <span className="abyss-stage-nav-label">{item.label}</span>
              </a>
            ))}

            <a href="#artifacts" className="abyss-stage-hotspot abyss-stage-enter-hotspot" data-hotspot="enter">
              <Image
                src={assetPath(HERO_STAGE_ASSETS.enterButton.src)}
                alt=""
                aria-hidden="true"
                fill
                sizes="(min-width: 768px) 17rem, 13rem"
                className="abyss-stage-button-art object-contain"
              />
              <Image
                src={assetPath(HERO_STAGE_ASSETS.sealGlyph.src)}
                alt=""
                aria-hidden="true"
                width={40}
                height={40}
                className="abyss-stage-button-seal"
              />
              <span className="abyss-stage-button-label">{copy.enterLabel}</span>
            </a>

            {artifacts.map((artifact, index) => {
              const isFocused = activeLens === "all" || artifact.lenses.includes(activeLens);

              return (
                <motion.button
                  key={artifact.slug}
                  type="button"
                  className={`abyss-stage-hotspot abyss-stage-card ${CARD_CLASSES[index]} ${
                    isFocused ? "abyss-stage-card-focused" : ""
                  }`}
                  data-artifact={artifact.slug}
                  aria-haspopup="dialog"
                  aria-label={`${artifact.displayTitle} / ${artifact.title}`}
                  whileHover={reducedMotion ? undefined : { scale: 1.01 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.996 }}
                  onClick={() => onArtifactOpen(artifact.slug)}
                >
                  <span className="relic-altar-glow" aria-hidden="true" />
                  <span className="abyss-stage-card-frame" aria-hidden="true">
                    <Image
                      src={assetPath(HERO_STAGE_ASSETS.dividerTop.src)}
                      alt=""
                      aria-hidden="true"
                      width={320}
                      height={320}
                      className="abyss-stage-card-frame-top object-cover"
                    />
                    <Image
                      src={assetPath(HERO_STAGE_ASSETS.dividerMid.src)}
                      alt=""
                      aria-hidden="true"
                      width={320}
                      height={320}
                      className="abyss-stage-card-frame-left object-cover"
                    />
                    <Image
                      src={assetPath(HERO_STAGE_ASSETS.dividerBottom.src)}
                      alt=""
                      aria-hidden="true"
                      width={320}
                      height={320}
                      className="abyss-stage-card-frame-bottom object-cover"
                    />
                    <Image
                      src={assetPath(HERO_STAGE_ASSETS.dividerMid.src)}
                      alt=""
                      aria-hidden="true"
                      width={320}
                      height={320}
                      className="abyss-stage-card-frame-right object-cover"
                    />
                  </span>
                  <div className="artifact-ledger abyss-stage-card-ledger">
                    <span>{copy.projectLabel}</span>
                    <span>{artifact.title}</span>
                  </div>
                  <div className="artifact-image-frame abyss-stage-card-image">
                    <Image
                      src={assetPath(artifact.cover)}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(min-width: 1280px) 22rem, (min-width: 768px) 18rem, 40vw"
                      className="object-contain transition duration-500 group-hover:scale-[1.02] saturate-75 brightness-90 sepia-[0.14]"
                      style={{ objectPosition: artifact.coverPosition }}
                    />
                  </div>
                  <div className="artifact-plaque relic-card-plaque abyss-stage-card-plaque">
                    <div className="space-y-2">
                      <p className="artifact-role">{artifact.displaySubtitle}</p>
                      <h3 className="relic-card-title">{artifact.displayTitle}</h3>
                      <p className="abyss-stage-card-body">{artifact.displayBody}</p>
                    </div>
                    <p className="artifact-open-link">{artifact.displayCta}</p>
                  </div>
                </motion.button>
              );
            })}

            <div id="fire" className="abyss-stage-ritual-row" role="group" aria-label={ritualCopy.title} style={{ pointerEvents: "none" }}>
              <Image
                src={assetPath(HERO_STAGE_ASSETS.ritualStack.src)}
                alt=""
                aria-hidden="true"
                width={480}
                height={280}
                className="abyss-stage-ritual-art"
              />
              {ritualOptions.map((option) => {
                const isActive = activeLens === option.id;

                return (
                <motion.button
                  key={option.id}
                  type="button"
                  className={`abyss-stage-hotspot abyss-stage-ritual ${RITUAL_CLASS_BY_LENS[option.id]} ${
                    isActive ? "abyss-stage-ritual-active" : ""
                  }`}
                    data-lens={option.id}
                    aria-pressed={isActive}
                    aria-label={option.label}
                    style={{ pointerEvents: "auto" }}
                    whileHover={reducedMotion ? undefined : { scale: 1.01 }}
                    whileTap={reducedMotion ? undefined : { scale: 0.994 }}
                    onClick={() => onLensChange(isActive ? "all" : option.id)}
                  >
                    <Image
                      src={assetPath(HERO_STAGE_ASSETS.unsealButton.src)}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="(min-width: 1024px) 13vw, 20vw"
                      className="abyss-stage-ritual-plate object-cover"
                    />
                    <span className="abyss-stage-ritual-label">{option.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
