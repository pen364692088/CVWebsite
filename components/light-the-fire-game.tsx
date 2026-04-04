"use client";

import { motion, useReducedMotion } from "motion/react";

import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";

function SigilGlyph({ id }: { id: ArchiveLens }) {
  const stroke = "rgba(216,211,200,0.9)";
  const fill = "rgba(201,106,43,0.18)";

  if (id === "all") {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="sigil-glyph">
        <circle cx="24" cy="24" r="14" fill="none" stroke={stroke} strokeWidth="2" />
        <circle cx="24" cy="24" r="8" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M24 6v8M42 24h-8M24 42v-8M6 24h8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "moon") {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="sigil-glyph">
        <circle cx="22" cy="24" r="12" fill={fill} stroke={stroke} strokeWidth="2" />
        <circle cx="28" cy="20" r="10" fill="rgba(11,13,16,0.92)" />
      </svg>
    );
  }

  if (id === "tower") {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="sigil-glyph">
        <path d="M16 39V18l4-4 4 3 4-3 4 4v21Z" fill={fill} stroke={stroke} strokeWidth="2" />
        <path d="M20 15V9M28 15V9M24 11h8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="sigil-glyph">
      <path
        d="M24 9c6 5 8 9 8 14 0 5-3 9-8 16-5-7-8-11-8-16 0-5 2-9 8-14Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
      />
      <path d="M24 18c2 2 3 4 3 6 0 2-1 4-3 6-2-2-3-4-3-6 0-2 1-4 3-6Z" fill={stroke} />
    </svg>
  );
}

interface LightTheFireGameProps {
  copy: Dictionary["game"];
  activeLens: ArchiveLens;
  onLensChange: (lens: ArchiveLens) => void;
}

export function LightTheFireGame({ copy, activeLens, onLensChange }: LightTheFireGameProps) {
  const reducedMotion = useReducedMotion();
  const activeOption = copy.options.find((item) => item.id === activeLens) ?? copy.options[0];

  return (
    <div className="relic-layout">
      <div className="relic-stage sigil-filter-stage">
        <div className="sigil-filter-grid" role="group" aria-label={copy.title}>
          {copy.options.map((option, index) => (
            <motion.button
              key={option.id}
              type="button"
              className={`sigil-token sigil-filter-token ${activeLens === option.id ? "sigil-token-selected" : ""}`}
              aria-pressed={activeLens === option.id}
              onClick={() => onLensChange(option.id)}
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={reducedMotion ? undefined : { scale: 0.99 }}
              transition={{ duration: 0.16, delay: reducedMotion ? 0 : index * 0.02 }}
            >
              <span className="sigil-token-icon" aria-hidden="true">
                <SigilGlyph id={option.id} />
              </span>
              <span className="sigil-token-copy">
                <span className="sigil-token-label">{option.label}</span>
                <span className="sigil-token-title">{option.title}</span>
                <span className="sigil-token-text">{option.body}</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relic-console">
        <p className="text-sm leading-7 text-mist">{copy.instructions}</p>

        <div className="relic-status-bar">
          <div>
            <p className="artifact-meta-label">{copy.currentLensLabel}</p>
            <p aria-live="polite" className="artifact-meta-value">
              {activeOption.title}
            </p>
          </div>
          <div>
            <p className="artifact-meta-label">{copy.sigilLabel}</p>
            <p className="artifact-meta-value">{activeOption.label}</p>
          </div>
        </div>

        <div className="dossier-panel relic-annotation">
          <div className="space-y-3">
            <p className="section-kicker">{activeOption.label}</p>
            <h3 className="font-display text-2xl text-ivory">{activeOption.title}</h3>
            <p className="text-sm leading-7 text-mist">{activeOption.body}</p>
          </div>

          <a href="#artifacts" className="primary-button w-fit">
            {copy.focusCta}
          </a>
        </div>
      </div>
    </div>
  );
}
