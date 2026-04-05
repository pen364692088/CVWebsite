"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useMemo, type CSSProperties, type PointerEvent } from "react";

import type { ArtifactView } from "@/data/artifacts";
import { HERO_ATMOSPHERE_LAYERS, HERO_PARTICLE_LAYOUT, HERO_PARTICLE_PRESETS } from "@/data/atmosphere";
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
            {HERO_ATMOSPHERE_LAYERS.map((layer) => (
              <Image
                key={layer.id}
                src={assetPath(layer.src)}
                alt={layer.alt}
                fill
                priority
                sizes="(min-width: 1280px) 64rem, (min-width: 768px) 78vw, 100vw"
                className="object-cover"
                style={{ objectPosition: layer.objectPosition }}
              />
            ))}
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

          <div className="sr-only">
            <p className="hero-nameplate">{copy.identity}</p>
            <p className="hero-brandline">{copy.studioCredit}</p>
            <h1 id="hero-title">{copy.archiveLabel}</h1>
            <p>{copy.subtitle}</p>
            <p>{copy.role}</p>
          </div>

          <div className="abyss-stage-hotspots">
            {navCopy.items.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`abyss-stage-hotspot abyss-stage-nav ${NAV_CLASSES[index]}`}
                data-nav={item.id}
              >
                <span className="sr-only">{item.label}</span>
              </a>
            ))}

            <a href="#artifacts" className="abyss-stage-hotspot abyss-stage-enter-hotspot" data-hotspot="enter">
              <span className="sr-only">{copy.enterLabel}</span>
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
                  <span className="sr-only">{artifact.displayTitle}</span>
                </motion.button>
              );
            })}

            <div id="fire" className="abyss-stage-ritual-row" role="group" aria-label={ritualCopy.title} style={{ pointerEvents: "none" }}>
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
                    <span className="sr-only">{option.label}</span>
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
