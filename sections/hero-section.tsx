"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import type { Dictionary } from "@/data/dictionaries";
import { assetPath } from "@/lib/site";

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
      <div className="hero-visual">
        <motion.div
          className="absolute inset-0"
          animate={reducedMotion ? undefined : { x: offset.x * -0.2, y: offset.y * -0.16, scale: [1, 1.02, 1] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Image
            src={assetPath("/hero/ashen-threshold.svg")}
            alt="An ashen stone threshold lit by a small fire in a dark archive-like ruin."
            fill
            priority
            sizes="100vw"
            className="hero-visual-image object-cover object-center"
          />
        </motion.div>

        <motion.div
          className="hero-mist"
          animate={reducedMotion ? undefined : { x: [0, 24, 0], opacity: [0.6, 0.84, 0.64] }}
          transition={{ duration: 11, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-[12%] h-44 bg-[radial-gradient(circle_at_center,rgba(201,106,43,0.24)_0%,transparent_58%)]"
          animate={reducedMotion ? undefined : { opacity: [0.56, 0.78, 0.6] }}
          transition={{ duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />

        {[
          { left: "62%", top: "58%", size: "0.32rem", delay: 0 },
          { left: "58%", top: "63%", size: "0.4rem", delay: 1.2 },
          { left: "66%", top: "61%", size: "0.28rem", delay: 2.1 },
        ].map((ember) => (
          <motion.span
            key={`${ember.left}-${ember.top}`}
            className="ember-speck"
            style={{ left: ember.left, top: ember.top, width: ember.size, height: ember.size }}
            animate={reducedMotion ? undefined : { y: [0, -12, -22], opacity: [0, 0.92, 0] }}
            transition={{
              duration: 5.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
              delay: ember.delay,
            }}
          />
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-copy space-y-7">
          <Reveal>
            <p className="section-kicker">{copy.eyebrow}</p>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="hero-brandline text-sm uppercase tracking-[0.24em]">Zhouyu Liao</p>
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
            <p className="text-xs uppercase tracking-[0.24em] text-gold/84">{copy.availability}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
