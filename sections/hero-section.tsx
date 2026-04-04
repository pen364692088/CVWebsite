"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import type { Dictionary } from "@/data/dictionaries";
import { SITE, assetPath } from "@/lib/site";

import { Reveal } from "@/components/reveal";

export function HeroSection({ copy }: { copy: Dictionary["hero"] }) {
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <section
      className="hero-stage"
      onMouseMove={(event) => {
        if (reducedMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 22;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;
        setOffset({ x, y });
      }}
    >
      <div className="hero-grid">
        <div className="hero-copy space-y-7">
          <Reveal>
            <p className="section-kicker">{copy.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="hero-brandline text-sm uppercase tracking-[0.24em]">{SITE.studioName}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              <h1 className="font-display text-[clamp(4.4rem,10vw,8.4rem)] leading-[0.88] text-ivory">{copy.title}</h1>
              <p className="hero-subtitle">{copy.subtitle}</p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="hero-body">{copy.body}</p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="flex flex-wrap gap-3">
              <a href="#about" className="primary-button">
                {copy.enterLabel}
              </a>
              <a href="#artifacts" className="secondary-button">
                {copy.projectLabel}
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.28}>
            <p className="hero-availability">{copy.availability}</p>
          </Reveal>
        </div>

        <Reveal delay={0.14} className="hero-tableau-reveal">
          <div className="hero-tableau">
            <motion.div
              className="hero-scene"
              animate={reducedMotion ? undefined : { x: offset.x * 0.28, y: offset.y * 0.2 }}
              transition={{ type: "spring", stiffness: 48, damping: 20, mass: 1.05 }}
            >
              <Image
                src={assetPath("/hero/norwich-threshold-pexels.jpg")}
                alt="A dark stone arch opening toward a distant cathedral tower, treated as an archive threshold."
                fill
                priority
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="hero-scene-image"
              />
              <div className="hero-scene-vignette" />
              <div className="hero-scene-shadow" />
              <p className="hero-scene-plaque">Plate I · Threshold Study</p>

              <Image
                src={assetPath("/hero/dragon-trace.svg")}
                alt=""
                aria-hidden="true"
                width={500}
                height={280}
                className="hero-dragon-trace"
              />

              <Image
                src={assetPath("/hero/guardian-remnant.svg")}
                alt=""
                aria-hidden="true"
                width={280}
                height={620}
                className="hero-guardian-remnant"
              />

              <motion.div
                className="hero-firelight"
                animate={reducedMotion ? undefined : { opacity: [0.72, 0.92, 0.76], scale: [0.98, 1.03, 0.99] }}
                transition={{ duration: 5.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <span className="hero-fire-core" />
              </motion.div>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
