"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";

import type { Dictionary } from "@/data/dictionaries";
import { ARCHIVE_UNLOCK_EVENT, ARCHIVE_UNLOCK_KEY } from "@/lib/archive";

type SigilId = "moon" | "tower" | "ember";

const SOCKET_POSITIONS: Record<SigilId, { left: string; top: string }> = {
  moon: { left: "24%", top: "33%" },
  tower: { left: "76%", top: "30%" },
  ember: { left: "50%", top: "72%" },
};

function emptyPlacements(): Record<SigilId, boolean> {
  return {
    moon: false,
    tower: false,
    ember: false,
  };
}

function SigilGlyph({ id, ghost = false }: { id: SigilId; ghost?: boolean }) {
  const stroke = ghost ? "rgba(216,211,200,0.34)" : "rgba(216,211,200,0.92)";
  const fill = ghost ? "rgba(216,211,200,0.06)" : "rgba(201,106,43,0.22)";

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
  locale: string;
}

export function LightTheFireGame({ copy, locale }: LightTheFireGameProps) {
  const reducedMotion = useReducedMotion();
  const instructionsId = useId();
  const statusId = useId();
  const [placements, setPlacements] = useState<Record<SigilId, boolean>>(emptyPlacements);
  const [selectedSigil, setSelectedSigil] = useState<SigilId | null>(null);
  const [archiveUnlocked, setArchiveUnlocked] = useState(false);
  const [statusText, setStatusText] = useState(copy.instructions);
  const [rejectedSocket, setRejectedSocket] = useState<SigilId | null>(null);

  const restoredCount = Object.values(placements).filter(Boolean).length;

  useEffect(() => {
    if (window.localStorage.getItem(ARCHIVE_UNLOCK_KEY) === "true") {
      setArchiveUnlocked(true);
      setPlacements({ moon: true, tower: true, ember: true });
      setStatusText(copy.successBody);
    }
  }, [copy.successBody]);

  function pickSigil(id: SigilId) {
    setPlacements((current) => ({ ...current, [id]: false }));
    setSelectedSigil(id);
    const sigil = copy.sigils.find((item) => item.id === id);
    setStatusText(sigil ? `${copy.selectLabel}: ${sigil.label}` : copy.instructions);
  }

  function unlockArchive() {
    setArchiveUnlocked(true);
    setStatusText(copy.successBody);
    window.localStorage.setItem(ARCHIVE_UNLOCK_KEY, "true");
    window.dispatchEvent(new Event(ARCHIVE_UNLOCK_EVENT));
  }

  function placeSigil(socketId: SigilId, sourceId: SigilId | null) {
    if (!sourceId) return;

    if (sourceId !== socketId) {
      setRejectedSocket(socketId);
      setStatusText(copy.failedLabel);
      window.setTimeout(() => setRejectedSocket((current) => (current === socketId ? null : current)), 320);
      return;
    }

    const unlocksArchive = !placements[socketId] && restoredCount === copy.sigils.length - 1;
    setPlacements((current) => ({ ...current, [socketId]: true }));
    setSelectedSigil(null);

    if (unlocksArchive) {
      window.setTimeout(unlockArchive, 20);
      return;
    }

    setStatusText(copy.instructions);
  }

  function resetRitual() {
    setPlacements(emptyPlacements());
    setSelectedSigil(null);
    setRejectedSocket(null);
    setStatusText(copy.instructions);
  }

  function clearSelection() {
    setSelectedSigil(null);
    setStatusText(copy.instructions);
  }

  return (
    <div className="relic-layout">
      <div
        className="relic-stage sigil-stage"
        aria-describedby={`${instructionsId} ${statusId}`}
        onKeyDownCapture={(event) => {
          if (event.key === "Escape") {
            clearSelection();
          }
        }}
      >
        <div className="sigil-stage-ring" aria-hidden="true" />
        <div className="sigil-stage-ring sigil-stage-ring-inner" aria-hidden="true" />

        {copy.sigils.map((sigil) => {
          const filled = placements[sigil.id];
          const position = SOCKET_POSITIONS[sigil.id];

          return (
            <button
              key={sigil.id}
              type="button"
              className={`sigil-socket ${filled ? "sigil-socket-filled" : ""} ${
                rejectedSocket === sigil.id ? "sigil-socket-reject" : ""
              }`}
              style={position}
              onClick={() => {
                if (filled) {
                  pickSigil(sigil.id);
                  return;
                }

                placeSigil(sigil.id, selectedSigil);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const sourceId = event.dataTransfer.getData("text/plain") as SigilId;
                placeSigil(sigil.id, sourceId);
              }}
              aria-label={`${copy.socketLabel}: ${sigil.socket}`}
            >
              <span className="sigil-socket-shell" aria-hidden="true">
                <SigilGlyph id={sigil.id} ghost={!filled} />
              </span>
              {filled ? (
                <span className="sigil-socket-token" aria-hidden="true">
                  <SigilGlyph id={sigil.id} />
                </span>
              ) : null}
              <span className="sigil-socket-label">{sigil.socket}</span>
            </button>
          );
        })}

        <motion.div
          className={`relic-core ${archiveUnlocked ? "relic-core-unlocked" : ""}`}
          animate={
            reducedMotion
              ? undefined
              : archiveUnlocked
                ? { scale: [1, 1.04, 1], opacity: [0.92, 1, 0.94] }
                : { scale: [0.98, 1.02, 1], opacity: [0.84, 0.92, 0.86] }
          }
          transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
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
              {archiveUnlocked ? copy.successBody : statusText}
            </p>
          </div>
          <div>
            <p className="artifact-meta-label">{copy.progressLabel}</p>
            <p className="artifact-meta-value">
              {restoredCount} / {copy.sigils.length}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relic-tray-header">
            <div>
              <p className="artifact-meta-label">{copy.trayLabel}</p>
              <p className="artifact-meta-value">
                {selectedSigil
                  ? `${copy.selectLabel}: ${copy.sigils.find((item) => item.id === selectedSigil)?.label ?? ""}`
                  : copy.instructions}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="secondary-button" onClick={clearSelection} disabled={!selectedSigil}>
                {copy.clearSelectionLabel}
              </button>
              <button type="button" className="secondary-button" onClick={resetRitual}>
                {copy.replayLabel}
              </button>
            </div>
          </div>

          <div className="sigil-tray" aria-label={copy.trayLabel}>
            {copy.sigils.map((sigil) => {
              if (placements[sigil.id]) return null;

              return (
                <button
                  key={sigil.id}
                  type="button"
                  draggable
                  className={`sigil-token ${selectedSigil === sigil.id ? "sigil-token-selected" : ""}`}
                  onClick={() => {
                    const nextSelected = selectedSigil === sigil.id ? null : sigil.id;
                    setSelectedSigil(nextSelected);
                    setStatusText(nextSelected ? `${copy.selectLabel}: ${sigil.label}` : copy.instructions);
                  }}
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", sigil.id);
                    setSelectedSigil(sigil.id);
                    setStatusText(`${copy.selectLabel}: ${sigil.label}`);
                  }}
                  aria-label={`${copy.trayLabel}: ${sigil.label}`}
                  aria-pressed={selectedSigil === sigil.id}
                >
                  <SigilGlyph id={sigil.id} />
                  <span className="sigil-token-text">{sigil.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="artifact-annex min-h-0">
          <div className="space-y-3">
            <p className="section-kicker">{copy.successTitle}</p>
            <h3 className="font-display text-2xl text-ivory">{copy.successTitle}</h3>
            <p className="text-sm leading-7 text-mist">{archiveUnlocked ? copy.successBody : copy.instructions}</p>
          </div>

          {archiveUnlocked ? (
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
