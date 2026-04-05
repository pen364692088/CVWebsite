"use client";

import { motion, useReducedMotion } from "motion/react";

import type { Dictionary } from "@/data/dictionaries";
import type { ArchiveLens } from "@/lib/archive";

function RitualCommandIcon({ id }: { id: ArchiveLens }) {
  const stroke = "rgba(216, 211, 200, 0.92)";
  const ember = "rgba(201, 106, 43, 0.88)";

  if (id === "ember") {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="ritual-command-icon-svg">
        <path d="M24 8c5 5 8 9 8 14 0 6-3 10-8 18-5-8-8-12-8-18 0-5 3-9 8-14Z" fill="none" stroke={stroke} strokeWidth="2.2" />
        <path d="M24 17c2 2 3 4 3 6s-1 4-3 7c-2-3-3-5-3-7s1-4 3-6Z" fill={ember} />
      </svg>
    );
  }

  if (id === "tower") {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48" className="ritual-command-icon-svg">
        <circle cx="24" cy="24" r="13.5" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M18 31V19l3-3 3 2 3-2 3 3v12Z" fill="none" stroke={stroke} strokeWidth="2.2" />
        <path d="M20 14h8" stroke={ember} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="ritual-command-icon-svg">
      <path d="M8 32c7-8 14-11 21-11 5 0 9 1 12 3-3 1-5 3-7 6-2 3-4 6-8 8-6 3-12 2-18-6Z" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="34.5" cy="21.5" r="1.5" fill={ember} />
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
  const ritualOptions = copy.options.filter((option) => option.id !== "all");
  const activeOption = copy.options.find((item) => item.id === activeLens) ?? copy.options[0];

  return (
    <div className="ritual-command-frame">
      <div className="ritual-command-grid" role="group" aria-label={copy.title}>
        {ritualOptions.map((option, index) => {
          const isActive = activeLens === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              className={`ritual-command-button ${isActive ? "ritual-command-button-active" : ""}`}
              aria-pressed={isActive}
              onClick={() => onLensChange(isActive ? "all" : option.id)}
              whileHover={reducedMotion ? undefined : { y: -2 }}
              whileTap={reducedMotion ? undefined : { scale: 0.992 }}
              transition={{ duration: 0.16, delay: reducedMotion ? 0 : index * 0.03 }}
            >
              <span className="ritual-command-fire" aria-hidden="true" />
              <span className="ritual-command-icon" aria-hidden="true">
                <RitualCommandIcon id={option.id} />
              </span>
              <span className="ritual-command-label">{option.label}</span>
              <span className="ritual-command-body">{option.body}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="ritual-command-status">
        <div className="ritual-command-status-copy">
          <p className="artifact-meta-label">{copy.currentLensLabel}</p>
          <p aria-live="polite" className="artifact-meta-value">
            {activeOption.title}
          </p>
        </div>

        <a href="#artifacts" className="secondary-button ritual-command-link">
          {copy.focusCta}
        </a>
      </div>
    </div>
  );
}
