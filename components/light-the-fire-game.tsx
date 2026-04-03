"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type Point = { x: number; y: number };
type Ember = Point & { id: string };
export type GameState = "idle" | "exploring" | "readyToIgnite" | "ignited" | "replay";

const embers: Ember[] = [
  { id: "ember-north", x: 18, y: 30 },
  { id: "ember-east", x: 78, y: 42 },
  { id: "ember-west", x: 36, y: 72 },
];

const firePoint = { x: 62, y: 76 };

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

interface LightTheFireGameProps {
  copy: {
    intro: string;
    instructions: string;
    progressLabel: string;
    startLabel: string;
    readyLabel: string;
    igniteLabel: string;
    replayLabel: string;
    unlockedTitle: string;
    unlockedBody: string;
    unlockedCta: string;
  };
  locale: string;
}

export function LightTheFireGame({ copy, locale }: LightTheFireGameProps) {
  const reducedMotion = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const [orb, setOrb] = useState<Point>({ x: 14, y: 60 });
  const [state, setState] = useState<GameState>("idle");
  const [collected, setCollected] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const canIgnite = collected.length === embers.length && distance(orb, firePoint) < 14;

  useEffect(() => {
    if (state === "idle" && collected.length > 0) {
      setState("exploring");
    }
  }, [collected.length, state]);

  useEffect(() => {
    if (collected.length === embers.length && state !== "ignited") {
      setState("readyToIgnite");
    }
  }, [collected.length, state]);

  const statusText = useMemo(() => {
    if (state === "ignited") return copy.unlockedBody;
    if (state === "readyToIgnite") return copy.readyLabel;
    return copy.instructions;
  }, [copy.instructions, copy.readyLabel, copy.unlockedBody, state]);

  function updateOrb(next: Point) {
    const clamped = {
      x: Math.min(92, Math.max(8, next.x)),
      y: Math.min(88, Math.max(12, next.y)),
    };

    setOrb(clamped);
    setCollected((current) => {
      const nextCollected = [...current];

      for (const ember of embers) {
        if (!nextCollected.includes(ember.id) && distance(clamped, ember) < 10) {
          nextCollected.push(ember.id);
        }
      }

      return nextCollected;
    });
  }

  function pointFromClient(clientX: number, clientY: number): Point | null {
    const board = boardRef.current;
    if (!board) return null;

    const rect = board.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    return { x, y };
  }

  function handlePointerMove(clientX: number, clientY: number) {
    const point = pointFromClient(clientX, clientY);
    if (!point) return;

    if (state === "idle") setState("exploring");
    updateOrb(point);
  }

  function handleIgnite() {
    if (!canIgnite) return;
    setState("ignited");
  }

  function handleReplay() {
    setOrb({ x: 14, y: 60 });
    setCollected([]);
    setIsDragging(false);
    setState("replay");
    window.setTimeout(() => setState("idle"), 20);
  }

  return (
    <div className="space-y-5">
      <p className="max-w-2xl text-sm leading-6 text-mist">{copy.intro}</p>

      <div
        ref={boardRef}
        className="game-board group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0e10]"
        tabIndex={0}
        role="application"
        aria-label={copy.instructions}
        onPointerDown={(event) => {
          setIsDragging(true);
          handlePointerMove(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (!isDragging) return;
          handlePointerMove(event.clientX, event.clientY);
        }}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
        onTouchStart={(event) => {
          const touch = event.touches[0];
          if (!touch) return;
          setIsDragging(true);
          handlePointerMove(touch.clientX, touch.clientY);
        }}
        onTouchMove={(event) => {
          const touch = event.touches[0];
          if (!touch) return;
          handlePointerMove(touch.clientX, touch.clientY);
        }}
        onTouchEnd={() => setIsDragging(false)}
        onKeyDown={(event) => {
          const step = 4;

          if (state === "idle") setState("exploring");

          if (event.key === "ArrowUp") updateOrb({ x: orb.x, y: orb.y - step });
          if (event.key === "ArrowDown") updateOrb({ x: orb.x, y: orb.y + step });
          if (event.key === "ArrowLeft") updateOrb({ x: orb.x - step, y: orb.y });
          if (event.key === "ArrowRight") updateOrb({ x: orb.x + step, y: orb.y });
          if (event.key === "Enter") handleIgnite();
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#4a3120_0%,transparent_38%),radial-gradient(circle_at_75%_15%,rgba(90,42,36,0.45),transparent_30%),linear-gradient(180deg,#131519_0%,#08090b_100%)]"
          animate={reducedMotion ? undefined : { opacity: [0.94, 1, 0.95] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />

        {embers.map((ember) => {
          const found = collected.includes(ember.id);
          return (
            <motion.div
              key={ember.id}
              className={`absolute h-3 w-3 rounded-full ${found ? "bg-gold" : "bg-ember/60"}`}
              style={{ left: `${ember.x}%`, top: `${ember.y}%` }}
              animate={
                reducedMotion
                  ? undefined
                  : {
                      scale: found ? 1 : [0.8, 1.15, 0.9],
                      opacity: found ? 0.95 : [0.3, 0.8, 0.35],
                    }
              }
              transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
          );
        })}

        <button
          type="button"
          className={`absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border transition ${
            canIgnite
              ? "border-ember/80 bg-ember/15 shadow-[0_0_40px_rgba(201,106,43,0.35)]"
              : "border-gold/20 bg-gold/5"
          }`}
          style={{ left: `${firePoint.x}%`, top: `${firePoint.y}%` }}
          onClick={handleIgnite}
          aria-label={copy.igniteLabel}
        >
          <span className={`mx-auto block h-8 w-8 rounded-full ${state === "ignited" ? "bg-ember" : "bg-gold/35"}`} />
        </button>

        <motion.div
          className="pointer-events-none absolute h-16 w-16 rounded-full border border-ivory/30 bg-ivory/8 shadow-[0_0_80px_rgba(216,211,200,0.3)]"
          style={{ left: `${orb.x}%`, top: `${orb.y}%`, translateX: "-50%", translateY: "-50%" }}
          animate={reducedMotion ? undefined : { scale: [1, 1.06, 0.98] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--orb-x,_50%)_var(--orb-y,_50%),rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_var(--orb-x,_50%)_var(--orb-y,_50%),transparent_0%,rgba(0,0,0,0.72)_25%,rgba(0,0,0,0.9)_65%)]"
          style={
            {
              "--orb-x": `${orb.x}%`,
              "--orb-y": `${orb.y}%`,
            } as CSSProperties
          }
        />

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold">{copy.progressLabel}</p>
            <p className="text-sm text-ivory">
              {collected.length} / {embers.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="secondary-button" onClick={() => setState("exploring")}>
              {copy.startLabel}
            </button>
            <button type="button" className="primary-button" onClick={handleIgnite} disabled={!canIgnite}>
              {copy.igniteLabel}
            </button>
            <button type="button" className="secondary-button" onClick={handleReplay}>
              {copy.replayLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] px-5 py-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p aria-live="polite" className="text-sm leading-6 text-mist">
            {statusText}
          </p>
        </div>
        <div className="flex flex-col justify-between gap-3 lg:items-end">
          <div className="text-right">
            <p className="font-display text-xl text-ivory">{copy.unlockedTitle}</p>
            <p className="text-sm text-mist">{state === "ignited" ? copy.unlockedBody : copy.instructions}</p>
          </div>
          <Link href={`/${locale}/#contact`} className="primary-button inline-flex w-fit items-center">
            {copy.unlockedCta}
          </Link>
        </div>
      </div>
    </div>
  );
}
