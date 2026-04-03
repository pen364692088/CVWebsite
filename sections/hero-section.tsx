"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import type { Dictionary } from "@/data/dictionaries";

import { Reveal } from "@/components/reveal";

export function HeroSection({ copy }: { copy: Dictionary["hero"] }) {
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <section
      className="relative isolate overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24"
      onMouseMove={(event) => {
        if (reducedMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 22;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 18;
        setOffset({ x, y });
      }}
    >
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="hero-glow left-[12%] top-[8%]"
          animate={reducedMotion ? undefined : { x: offset.x, y: offset.y, opacity: [0.42, 0.58, 0.46] }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="hero-glow right-[8%] top-[22%] bg-[radial-gradient(circle,rgba(90,42,36,0.5)_0%,transparent_68%)]"
          animate={reducedMotion ? undefined : { x: -offset.x * 0.7, y: offset.y * 0.5, opacity: [0.3, 0.4, 0.34] }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-[radial-gradient(circle_at_center,rgba(201,106,43,0.22)_0%,transparent_58%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="space-y-8">
          <Reveal>
            <p className="section-kicker">{copy.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="space-y-4">
              <p className="font-body text-sm uppercase tracking-[0.28em] text-gold/80">Zhouyu Liao</p>
              <h1 className="font-display text-5xl leading-none text-ivory sm:text-7xl">{copy.title}</h1>
              <p className="max-w-2xl text-lg text-stone-200 sm:text-xl">{copy.subtitle}</p>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="max-w-2xl text-base leading-8 text-mist sm:text-lg">{copy.body}</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-3">
              <a href="#about" className="primary-button">
                {copy.enterLabel}
              </a>
              <a href="#artifacts" className="secondary-button">
                {copy.projectLabel}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.24}>
          <div className="ritual-panel overflow-hidden p-6 sm:p-8">
            <div className="space-y-4">
              <p className="section-kicker">Archive Status</p>
              <p className="font-display text-2xl text-ivory">Calm systems. Controlled spectacle.</p>
              <p className="text-sm leading-7 text-mist">{copy.availability}</p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Unity systems",
                "Technical art tooling",
                "Playable visual fragments",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-mist"
                  animate={reducedMotion ? undefined : { y: [0, -4, 0] }}
                  transition={{ duration: 4 + index, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
