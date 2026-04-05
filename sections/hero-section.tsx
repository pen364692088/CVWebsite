"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent } from "react";

import type { ArtifactView } from "@/data/artifacts";
import { HERO_ATMOSPHERE_LAYERS, HERO_PARTICLE_LAYOUT, HERO_PARTICLE_PRESETS, type AtmosphereLayer } from "@/data/atmosphere";
import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";
import { assetPath } from "@/lib/site";

import { LightTheFireGame } from "@/components/light-the-fire-game";
import { Reveal } from "@/components/reveal";

interface HeroSectionProps {
  copy: Dictionary["hero"];
  ritualCopy: Dictionary["game"];
  activeLens: ArchiveLens;
  artifacts: Array<ArtifactView & { caseNumber: string }>;
  onArtifactOpen: (slug: string) => void;
  onLensChange: (lens: ArchiveLens) => void;
}

interface AtmosphereLayerImageProps {
  layer: AtmosphereLayer;
  motionX: MotionValue<number>;
  motionY: MotionValue<number>;
  reducedMotion: boolean;
  compactViewport: boolean;
}

function AtmosphereLayerImage({ layer, motionX, motionY, reducedMotion, compactViewport }: AtmosphereLayerImageProps) {
  const x = useSpring(useTransform(motionX, [-1, 1], [-18 * layer.depth, 18 * layer.depth]), {
    stiffness: 72,
    damping: 20,
    mass: 0.5,
  });
  const y = useSpring(useTransform(motionY, [-1, 1], [-14 * layer.depth, 14 * layer.depth]), {
    stiffness: 72,
    damping: 20,
    mass: 0.5,
  });

  return (
    <motion.div
      className={`abyss-layer abyss-layer-${layer.id}`}
      style={
        reducedMotion
          ? {
              opacity: layer.mobileOpacity,
              mixBlendMode: layer.blendMode,
            }
          : {
              opacity: layer.opacity,
              mixBlendMode: layer.blendMode,
              x,
              y,
              scale: layer.scale ?? 1,
            }
      }
    >
      <Image
        src={assetPath(layer.src)}
        alt={layer.alt}
        fill
        priority={layer.id === "matte-scene"}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: compactViewport ? layer.mobileObjectPosition ?? layer.objectPosition : layer.objectPosition }}
      />
    </motion.div>
  );
}

export function HeroSection({ copy, ritualCopy, activeLens, artifacts, onArtifactOpen, onLensChange }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const reducedMotion = !!prefersReducedMotion;

  const dragonOffsetX = useSpring(useTransform(pointerX, [-1, 1], [-10, 10]), {
    stiffness: 72,
    damping: 18,
    mass: 0.45,
  });
  const dragonOffsetY = useSpring(useTransform(pointerY, [-1, 1], [-8, 8]), {
    stiffness: 72,
    damping: 18,
    mass: 0.45,
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsCompactViewport(media.matches);

    apply();
    media.addEventListener("change", apply);

    return () => media.removeEventListener("change", apply);
  }, []);

  const particleLimit = useMemo(() => {
    const key = reducedMotion ? "reducedMotionCount" : isCompactViewport ? "mobileCount" : "count";

    return Math.min(
      HERO_PARTICLE_LAYOUT.length,
      HERO_PARTICLE_PRESETS.reduce((sum, preset) => sum + preset[key], 0),
    );
  }, [isCompactViewport, reducedMotion]);

  const visibleParticles = useMemo(() => HERO_PARTICLE_LAYOUT.slice(0, particleLimit), [particleLimit]);

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
        <div className="abyss-hero-stage" onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
          <div className="abyss-hero-backdrop" aria-hidden="true">
            {HERO_ATMOSPHERE_LAYERS.map((layer) => (
              <AtmosphereLayerImage
                key={layer.id}
                layer={layer}
                motionX={pointerX}
                motionY={pointerY}
                reducedMotion={!!reducedMotion}
                compactViewport={isCompactViewport}
              />
            ))}
            <motion.div
              className="abyss-dragon-trace"
              style={reducedMotion ? undefined : { x: dragonOffsetX, y: dragonOffsetY }}
            >
              <Image
                src={assetPath("/hero/abyss-dragon-silhouette.png")}
                alt=""
                width={620}
                height={260}
                className="h-auto w-full"
              />
            </motion.div>
            <div className="abyss-moon-haze" />
            <div className="abyss-hero-vignette" />
            <div className="abyss-particle-field" aria-hidden="true">
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
          </div>

          <div className="abyss-hero-content">
            <div className="abyss-hero-copy abyss-hero-copy-centered">
              <Reveal>
                <p className="section-kicker hero-stage-kicker">{copy.eyebrow}</p>
              </Reveal>

              <Reveal delay={0.05}>
                <div className="hero-stage-lines">
                  <p className="hero-nameplate">{copy.identity}</p>
                  <p className="hero-brandline">{copy.studioCredit}</p>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="space-y-5">
                  <h1 id="hero-title" className="abyss-hero-title">
                    {copy.archiveLabel}
                  </h1>
                  <p className="hero-subtitle hero-subtitle-centered">{copy.subtitle}</p>
                  <p className="hero-stage-note">{copy.role}</p>
                </div>
              </Reveal>

              <Reveal delay={0.28}>
                <div className="hero-cta-row hero-cta-row-centered">
                  <a href="#artifacts" className="primary-button hero-main-button">
                    <span>{copy.enterLabel}</span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="abyss-ritual-dock">
            <Reveal delay={0.2}>
              <div className="abyss-ritual-copy abyss-ritual-copy-centered">
                <div className="abyss-ritual-divider" aria-hidden="true">
                  <span />
                  <span className="abyss-ritual-divider-seal" />
                  <span />
                </div>
                <p className="section-kicker">{copy.ritualLabel}</p>
                <p className="abyss-ritual-text">{copy.ritualIntro}</p>
              </div>
            </Reveal>

            <div className="abyss-ritual-grid">
              {artifacts.map((artifact, index) => {
                const isActive = activeLens === "all" || artifact.lenses.includes(activeLens);

                return (
                  <Reveal key={artifact.slug} delay={0.24 + index * 0.05}>
                    <motion.button
                      type="button"
                      className={`relic-altar-card ${artifact.featured ? "relic-altar-card-featured" : ""} ${isActive ? "relic-altar-card-active" : "relic-altar-card-muted"}`}
                      whileHover={reducedMotion ? undefined : { y: -6 }}
                      whileTap={reducedMotion ? undefined : { scale: 0.995 }}
                      transition={{ duration: 0.22 }}
                      onClick={() => onArtifactOpen(artifact.slug)}
                      aria-haspopup="dialog"
                      aria-label={`${copy.cardCtaLabel}: ${artifact.title}`}
                    >
                      <div className="relic-altar-glow" aria-hidden="true" />
                      <div className="relic-altar-runes" aria-hidden="true" />
                      <div className="artifact-ledger">
                        <span>{artifact.caseNumber}</span>
                        <span>{artifact.title}</span>
                      </div>
                      <div className={`artifact-image-frame ${artifact.featured ? "aspect-[5/6]" : "aspect-[4/5]"}`}>
                        <Image
                          src={assetPath(artifact.cover)}
                          alt={artifact.title}
                          fill
                          sizes="(min-width: 1280px) 22rem, (min-width: 768px) 30vw, 92vw"
                          className="object-cover"
                          style={{ objectPosition: artifact.coverPosition }}
                        />
                      </div>
                      <div className="artifact-plaque relic-card-plaque">
                        <div className="space-y-2">
                          <h3 className="relic-card-title">{artifact.displayTitle}</h3>
                          <p className="relic-card-subtitle">{artifact.displayBody}</p>
                          <p className="relic-card-project">{artifact.displaySubtitle}</p>
                        </div>
                        <span className="relic-card-cta">{artifact.displayCta}</span>
                      </div>
                    </motion.button>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.42}>
              <div id="fire" className="abyss-command-dock">
                <LightTheFireGame copy={ritualCopy} activeLens={activeLens} onLensChange={onLensChange} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
