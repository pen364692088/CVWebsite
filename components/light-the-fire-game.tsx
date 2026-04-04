"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";

import type { Dictionary } from "@/data/dictionaries";
import { ARCHIVE_UNLOCK_EVENT, ARCHIVE_UNLOCK_KEY } from "@/lib/archive";

export type GameState = "idle" | "solving" | "readyToIgnite" | "ignited" | "failed";

const RING_SEGMENTS = [12, 8, 6];
const INITIAL_RINGS = [3, 7, 1];
const MAX_MOVES = 12;
const RING_SIZES = [100, 74, 48];

interface LightTheFireGameProps {
  copy: Dictionary["game"];
  locale: string;
}

function normalize(value: number, segments: number) {
  return (value + segments) % segments;
}

function isSolved(rings: number[]) {
  return rings.every((value) => value === 0);
}

export function LightTheFireGame({ copy, locale }: LightTheFireGameProps) {
  const reducedMotion = useReducedMotion();
  const instructionsId = useId();
  const statusId = useId();
  const [ringPositions, setRingPositions] = useState(INITIAL_RINGS);
  const [movesRemaining, setMovesRemaining] = useState(MAX_MOVES);
  const [selectedRing, setSelectedRing] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [archiveUnlocked, setArchiveUnlocked] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(ARCHIVE_UNLOCK_KEY) === "true") {
      setArchiveUnlocked(true);
      setGameState("ignited");
    }
  }, []);

  function beginRite() {
    if (gameState === "readyToIgnite" || gameState === "ignited") return;
    setGameState(isSolved(ringPositions) ? "readyToIgnite" : "solving");
  }

  function rotateRing(index: number, direction: -1 | 1) {
    if (gameState === "failed" || gameState === "ignited") return;

    const nextPositions = ringPositions.map((value, ringIndex) =>
      ringIndex === index ? normalize(value + direction, RING_SEGMENTS[ringIndex]) : value,
    );
    const nextMoves = Math.max(movesRemaining - 1, 0);
    const solved = isSolved(nextPositions);

    setSelectedRing(index);
    setRingPositions(nextPositions);
    setMovesRemaining(nextMoves);

    if (solved) {
      setGameState("readyToIgnite");
      return;
    }

    if (nextMoves === 0) {
      setGameState("failed");
      return;
    }

    setGameState("solving");
  }

  function releaseArchive() {
    if (!isSolved(ringPositions)) return;

    setArchiveUnlocked(true);
    setGameState("ignited");
    window.localStorage.setItem(ARCHIVE_UNLOCK_KEY, "true");
    window.dispatchEvent(new Event(ARCHIVE_UNLOCK_EVENT));
  }

  function resetPuzzle() {
    setRingPositions(INITIAL_RINGS);
    setMovesRemaining(MAX_MOVES);
    setSelectedRing(0);
    setGameState("idle");
  }

  function handleKeyDown(event: import("react").KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedRing((current) => normalize(current - 1, copy.ringLabels.length));
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedRing((current) => normalize(current + 1, copy.ringLabels.length));
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (gameState === "idle") beginRite();
      rotateRing(selectedRing, -1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (gameState === "idle") beginRite();
      rotateRing(selectedRing, 1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (gameState === "idle" || gameState === "failed") {
        beginRite();
        return;
      }

      if (gameState === "readyToIgnite") {
        releaseArchive();
      }
    }
  }

  let statusText = copy.instructions;
  if (gameState === "failed") statusText = copy.failedLabel;
  if (gameState === "readyToIgnite") statusText = copy.readyLabel;
  if (archiveUnlocked || gameState === "ignited") statusText = copy.unlockedBody;

  return (
    <div className="relic-layout">
      <div
        className="relic-stage"
        tabIndex={0}
        aria-describedby={`${instructionsId} ${statusId}`}
        aria-label={copy.instructions}
        onKeyDown={handleKeyDown}
      >
        <div className="relic-axis" aria-hidden="true" />

        {copy.ringLabels.map((label, index) => {
          const segments = RING_SEGMENTS[index];
          const size = RING_SIZES[index];

          return (
            <div key={label} className="relic-ring-shell" style={{ width: `${size}%`, height: `${size}%` }}>
              <motion.div
                className={`relic-ring ${selectedRing === index ? "relic-ring-selected" : ""} ${
                  archiveUnlocked ? "relic-ring-unlocked" : ""
                }`}
                animate={reducedMotion ? undefined : { rotate: (360 / segments) * ringPositions[index] }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              >
                {Array.from({ length: segments }).map((_, glyphIndex) => (
                  <span
                    key={`${label}-${glyphIndex}`}
                    className={`relic-glyph ${glyphIndex === 0 ? "relic-glyph-target" : ""}`}
                    style={{
                      transform: `translate(-50%, -50%) rotate(${(360 / segments) * glyphIndex}deg) translateY(calc(${size / -2}% + 0.55rem))`,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          );
        })}

        <motion.div
          className={`relic-core ${archiveUnlocked ? "relic-core-unlocked" : ""}`}
          animate={reducedMotion ? undefined : { scale: archiveUnlocked ? [1, 1.04, 1] : [0.98, 1.02, 1] }}
          transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <span className="relic-core-mark" aria-hidden="true" />
        </motion.div>
      </div>

      <div className="relic-console">
        <p id={instructionsId} className="text-sm leading-7 text-mist">
          {copy.instructions}
        </p>

        <div className="relic-status-bar">
          <div>
            <p className="artifact-meta-label">{copy.statusLabel}</p>
            <p id={statusId} aria-live="polite" className="artifact-meta-value">
              {statusText}
            </p>
          </div>
          <div>
            <p className="artifact-meta-label">{copy.movesLabel}</p>
            <p className="artifact-meta-value">{movesRemaining}</p>
          </div>
        </div>

        <div className="space-y-3">
          {copy.ringLabels.map((label, index) => (
            <div key={label} className="relic-control-row">
              <button
                type="button"
                className={`relic-select ${selectedRing === index ? "relic-select-active" : ""}`}
                onClick={() => setSelectedRing(index)}
                aria-pressed={selectedRing === index}
              >
                {label}
              </button>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="secondary-button relic-rotate"
                  onClick={() => {
                    if (gameState === "idle") beginRite();
                    rotateRing(index, -1);
                  }}
                  disabled={gameState === "failed" || gameState === "ignited"}
                  aria-label={`${label}: ${copy.rotateLeftLabel}`}
                >
                  {copy.rotateLeftLabel}
                </button>
                <button
                  type="button"
                  className="secondary-button relic-rotate"
                  onClick={() => {
                    if (gameState === "idle") beginRite();
                    rotateRing(index, 1);
                  }}
                  disabled={gameState === "failed" || gameState === "ignited"}
                  aria-label={`${label}: ${copy.rotateRightLabel}`}
                >
                  {copy.rotateRightLabel}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="secondary-button"
            onClick={beginRite}
            disabled={gameState === "solving" || gameState === "readyToIgnite"}
          >
            {copy.startLabel}
          </button>
          <button type="button" className="primary-button" onClick={releaseArchive} disabled={!isSolved(ringPositions)}>
            {copy.igniteLabel}
          </button>
          <button type="button" className="secondary-button" onClick={resetPuzzle}>
            {copy.replayLabel}
          </button>
        </div>

        <div className="artifact-annex min-h-0">
          <div className="space-y-3">
            <p className="section-kicker">{copy.unlockedTitle}</p>
            <h3 className="font-display text-2xl text-ivory">{copy.unlockedTitle}</h3>
            <p className="text-sm leading-7 text-mist">
              {archiveUnlocked || gameState === "ignited" ? copy.unlockedBody : copy.instructions}
            </p>
          </div>

          {archiveUnlocked || gameState === "ignited" ? (
            <Link href={`/${locale}/#artifacts`} className="primary-button w-fit">
              {copy.unlockedCta}
            </Link>
          ) : (
            <span className="secondary-button w-fit" aria-disabled="true">
              {copy.unlockedCta}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
