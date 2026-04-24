"use client";

import { gsap } from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

export const ALCHE_ENDMARK_DEBUG_STAGES = ["black", "guides", "outline", "fill", "settled"] as const;

export type AlcheEndmarkDebugStage = (typeof ALCHE_ENDMARK_DEBUG_STAGES)[number];
type AlcheEndmarkStage = "idle" | AlcheEndmarkDebugStage;

export interface AlcheEndmarkDebugState {
  stage: AlcheEndmarkStage;
  ready: boolean;
  visible: boolean;
  triggerActive: boolean;
  debugStage: AlcheEndmarkDebugStage | null;
}

interface AlcheEndmarkOverlayProps {
  assetUrl: string;
  triggerActive: boolean;
  reducedMotion: boolean;
  captureMode: boolean;
  debugStage: AlcheEndmarkDebugStage | null;
  timeScale: number;
  onDebugStateChange?: (state: AlcheEndmarkDebugState) => void;
}

interface AlcheEndmarkHandles {
  svg: SVGSVGElement;
  bgGlow: SVGGElement | null;
  grid: SVGGElement | null;
  guidePersistent: SVGGElement | null;
  guideFade: SVGGElement | null;
  outline: SVGGElement | null;
  fill: SVGGElement | null;
  fillRevealRect: SVGRectElement | null;
  guideDraws: SVGGeometryElement[];
  outlineDraws: SVGGeometryElement[];
}

interface DrawTweenState {
  element: SVGGeometryElement;
  length: number;
  offset: number;
}

interface AlcheEndmarkRenderState {
  overlayAlpha: number;
  bgGlowAlpha: number;
  gridAlpha: number;
  guidePersistentAlpha: number;
  guideFadeAlpha: number;
  outlineAlpha: number;
  fillAlpha: number;
  fillRevealWidth: number;
}

function isGeometryElement(node: Element): node is SVGGeometryElement {
  return typeof (node as SVGGeometryElement).getTotalLength === "function";
}

function prepareDrawElements(elements: SVGGeometryElement[]) {
  for (const element of elements) {
    const length = Math.max(element.getTotalLength(), 1);
    element.setAttribute("stroke-dasharray", `${length}`);
    element.setAttribute("stroke-dashoffset", `${length}`);
  }
}

function setNodeAlpha(node: Element | null, alpha: number) {
  const clamped = Math.min(Math.max(alpha, 0), 1);
  if (node instanceof SVGElement) {
    node.setAttribute("opacity", clamped.toFixed(3));
    node.setAttribute("visibility", clamped <= 0.001 ? "hidden" : "visible");
    return;
  }
  if (node instanceof HTMLElement) {
    node.style.opacity = clamped.toFixed(3);
    node.style.visibility = clamped <= 0.001 ? "hidden" : "visible";
  }
}

function applyDrawState(drawState: DrawTweenState) {
  drawState.element.setAttribute("stroke-dasharray", `${drawState.length}`);
  drawState.element.setAttribute("stroke-dashoffset", `${Math.max(drawState.offset, 0)}`);
}

export function AlcheEndmarkOverlay({
  assetUrl,
  triggerActive,
  reducedMotion,
  captureMode,
  debugStage,
  timeScale,
  onDebugStateChange,
}: AlcheEndmarkOverlayProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const svgHostRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const handlesRef = useRef<AlcheEndmarkHandles | null>(null);
  const applyRenderStateRef = useRef<(() => void) | null>(null);
  const applyStageSnapshotRef = useRef<((stage: AlcheEndmarkDebugStage) => void) | null>(null);
  const autoStartedRef = useRef(false);
  const reducedMotionTimeoutRef = useRef<number | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<AlcheEndmarkStage>("idle");
  const [loadError, setLoadError] = useState<string | null>(null);

  const debugState = useMemo<AlcheEndmarkDebugState>(
    () => ({
      stage,
      ready,
      visible,
      triggerActive,
      debugStage,
    }),
    [debugStage, ready, stage, triggerActive, visible],
  );

  useEffect(() => {
    onDebugStateChange?.(debugState);
  }, [debugState, onDebugStateChange]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const host = window as typeof window & {
      __getAlcheEndmarkDebugState?: () => AlcheEndmarkDebugState;
    };

    host.__getAlcheEndmarkDebugState = () => debugState;

    return () => {
      delete host.__getAlcheEndmarkDebugState;
    };
  }, [debugState]);

  useEffect(() => {
    let cancelled = false;

    fetch(assetUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load endmark SVG: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        if (cancelled) return;
        setSvgMarkup(text);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setSvgMarkup(null);
        setLoadError(error instanceof Error ? error.message : "unknown");
      });

    return () => {
      cancelled = true;
    };
  }, [assetUrl]);

  useEffect(() => {
    const rootNode = rootRef.current;
    const svgHost = svgHostRef.current;

    if (!svgMarkup || !rootNode || !svgHost) {
      setReady(false);
      return;
    }

    let animationFrame = 0;

    const build = () => {
      svgHost.innerHTML = svgMarkup;
      const svg = svgHost.querySelector("svg");
      if (!(svg instanceof SVGSVGElement)) {
        setReady(false);
        return;
      }

      const handles: AlcheEndmarkHandles = {
        svg,
        bgGlow: svg.querySelector<SVGGElement>("#bgGlow"),
        grid: svg.querySelector<SVGGElement>("#grid"),
        guidePersistent: svg.querySelector<SVGGElement>("#guidePersistent"),
        guideFade: svg.querySelector<SVGGElement>("#guideFade"),
        outline: svg.querySelector<SVGGElement>("#outline"),
        fill: svg.querySelector<SVGGElement>("#fill"),
        fillRevealRect: svg.querySelector<SVGRectElement>("#fillRevealRect"),
        guideDraws: Array.from(svg.querySelectorAll('[data-draw="guide"]')).filter(isGeometryElement),
        outlineDraws: Array.from(svg.querySelectorAll('[data-draw="outline"]')).filter(isGeometryElement),
      };

      handlesRef.current = handles;

      timelineRef.current?.kill();
      timelineRef.current = null;

      const guideDrawStates = handles.guideDraws.map((element) => ({
        element,
        length: Math.max(element.getTotalLength(), 1),
        offset: Math.max(element.getTotalLength(), 1),
      }));
      const outlineDrawStates = handles.outlineDraws.map((element) => ({
        element,
        length: Math.max(element.getTotalLength(), 1),
        offset: Math.max(element.getTotalLength(), 1),
      }));
      const renderState: AlcheEndmarkRenderState = {
        overlayAlpha: 0,
        bgGlowAlpha: 0,
        gridAlpha: 0,
        guidePersistentAlpha: 0,
        guideFadeAlpha: 0,
        outlineAlpha: 0,
        fillAlpha: 0,
        fillRevealWidth: 0,
      };

      const applyRenderState = () => {
        rootNode.style.opacity = renderState.overlayAlpha.toFixed(3);
        rootNode.style.visibility = renderState.overlayAlpha <= 0.001 ? "hidden" : "visible";
        setNodeAlpha(handles.bgGlow, renderState.bgGlowAlpha);
        setNodeAlpha(handles.grid, renderState.gridAlpha);
        setNodeAlpha(handles.guidePersistent, renderState.guidePersistentAlpha);
        setNodeAlpha(handles.guideFade, renderState.guideFadeAlpha);
        setNodeAlpha(handles.outline, renderState.outlineAlpha);
        setNodeAlpha(handles.fill, renderState.fillAlpha);
        if (handles.fillRevealRect) {
          handles.fillRevealRect.setAttribute("width", String(renderState.fillRevealWidth));
        }
        for (const drawState of guideDrawStates) {
          applyDrawState(drawState);
        }
        for (const drawState of outlineDrawStates) {
          applyDrawState(drawState);
        }
      };

      const resetRenderState = () => {
        renderState.overlayAlpha = 0;
        renderState.bgGlowAlpha = 0;
        renderState.gridAlpha = 0;
        renderState.guidePersistentAlpha = 0;
        renderState.guideFadeAlpha = 0;
        renderState.outlineAlpha = 0;
        renderState.fillAlpha = 0;
        renderState.fillRevealWidth = 0;
        for (const drawState of guideDrawStates) {
          drawState.offset = drawState.length;
        }
        for (const drawState of outlineDrawStates) {
          drawState.offset = drawState.length;
        }
        applyRenderState();
      };

      const applyStageSnapshot = (targetStage: AlcheEndmarkDebugStage) => {
        resetRenderState();
        renderState.overlayAlpha = targetStage === "black" ? 0.92 : 1;
        renderState.bgGlowAlpha = targetStage === "black" ? 0.22 : 1;
        renderState.gridAlpha = targetStage === "black" ? 0.46 : 1;

        if (targetStage === "guides" || targetStage === "outline" || targetStage === "fill" || targetStage === "settled") {
          renderState.guidePersistentAlpha = targetStage === "settled" ? 0.42 : 1;
          renderState.guideFadeAlpha = targetStage === "settled" ? 0.18 : 1;
          for (const drawState of guideDrawStates) {
            drawState.offset = 0;
          }
        }

        if (targetStage === "outline" || targetStage === "fill" || targetStage === "settled") {
          renderState.outlineAlpha = 1;
          for (const drawState of outlineDrawStates) {
            drawState.offset = 0;
          }
        }

        if (targetStage === "fill" || targetStage === "settled") {
          renderState.fillAlpha = 1;
          renderState.fillRevealWidth = targetStage === "settled" ? 1920 : 1240;
        }

        applyRenderState();
      };

      resetRenderState();
      prepareDrawElements(handles.guideDraws);
      prepareDrawElements(handles.outlineDraws);

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power2.out" },
      });

      timeline.call(() => {
        setVisible(true);
        setStage("black");
      }, undefined, 0);

      timeline.to(
        renderState,
        {
          overlayAlpha: 1,
          duration: 0.4,
          onUpdate: applyRenderState,
        },
        0,
      );
      timeline.to(
        renderState,
        {
          bgGlowAlpha: 1,
          gridAlpha: 1,
          duration: 0.32,
          onUpdate: applyRenderState,
        },
        0.28,
      );

      timeline.call(() => {
        setVisible(true);
        setStage("guides");
      }, undefined, 0.46);
      timeline.to(
        renderState,
        {
          guidePersistentAlpha: 1,
          guideFadeAlpha: 1,
          duration: 0.18,
          onUpdate: applyRenderState,
        },
        0.42,
      );
      guideDrawStates.forEach((drawState, index) => {
        timeline.to(
          drawState,
          {
            offset: 0,
            duration: 0.24,
            onUpdate: applyRenderState,
          },
          0.48 + index * 0.07,
        );
      });

      timeline.call(() => {
        setStage("outline");
      }, undefined, 1.44);
      timeline.to(
        renderState,
        {
          outlineAlpha: 1,
          duration: 0.14,
          onUpdate: applyRenderState,
        },
        1.36,
      );
      outlineDrawStates.forEach((drawState, index) => {
        timeline.to(
          drawState,
          {
            offset: 0,
            duration: 0.22,
            onUpdate: applyRenderState,
          },
          1.38 + index * 0.09,
        );
      });

      timeline.call(() => {
        setStage("fill");
      }, undefined, 2.18);
      timeline.to(
        renderState,
        {
          fillAlpha: 1,
          duration: 0.16,
          onUpdate: applyRenderState,
        },
        2.12,
      );
      timeline.to(
        renderState,
        {
          fillRevealWidth: 1920,
          duration: 0.72,
          onUpdate: applyRenderState,
        },
        2.16,
      );

      timeline.to(
        renderState,
        {
          guideFadeAlpha: 0.18,
          guidePersistentAlpha: 0.42,
          duration: 0.42,
          onUpdate: applyRenderState,
        },
        2.36,
      );

      timeline.call(() => {
        setStage("settled");
      }, undefined, 2.92);

      timeline.timeScale(Math.max(timeScale, 0.1));
      applyRenderState();
      applyRenderStateRef.current = applyRenderState;
      applyStageSnapshotRef.current = applyStageSnapshot;
      timelineRef.current = timeline;
      setReady(true);
    };

    animationFrame = window.requestAnimationFrame(build);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      timelineRef.current?.kill();
      timelineRef.current = null;
      handlesRef.current = null;
      applyRenderStateRef.current = null;
      applyStageSnapshotRef.current = null;
      svgHost.innerHTML = "";
      setReady(false);
    };
  }, [svgMarkup, timeScale]);

  useEffect(() => {
    return () => {
      if (reducedMotionTimeoutRef.current !== null) {
        window.clearTimeout(reducedMotionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || !rootRef.current) return;

    const timeline = timelineRef.current;
    const applyRenderState = applyRenderStateRef.current;
    const applyStageSnapshot = applyStageSnapshotRef.current;
    if (!timeline || !applyRenderState || !applyStageSnapshot) return;
    timeline.timeScale(Math.max(timeScale, 0.1));

    if (reducedMotionTimeoutRef.current !== null) {
      window.clearTimeout(reducedMotionTimeoutRef.current);
      reducedMotionTimeoutRef.current = null;
    }

    const reset = () => {
      autoStartedRef.current = false;
      timeline.pause();
      timeline.progress(0);
      applyRenderState();
      setVisible(false);
      setStage("idle");
    };

    if (debugStage) {
      autoStartedRef.current = false;
      timeline.pause();
      applyStageSnapshot(debugStage);
      setVisible(true);
      setStage(debugStage);
      return;
    }

    if (!triggerActive) {
      reset();
      return;
    }

    if (captureMode) {
      return;
    }

    if (reducedMotion) {
      autoStartedRef.current = true;
      timeline.pause();
      applyStageSnapshot("black");
      setVisible(true);
      setStage("black");
      reducedMotionTimeoutRef.current = window.setTimeout(() => {
        timeline.pause();
        applyStageSnapshot("settled");
        setVisible(true);
        setStage("settled");
      }, 180);
      return;
    }

    if (!autoStartedRef.current) {
      autoStartedRef.current = true;
      setVisible(true);
      timeline.play(0);
    }
  }, [captureMode, debugStage, ready, reducedMotion, timeScale, triggerActive]);

  return (
    <div
      ref={rootRef}
      data-endmark-overlay
      data-endmark-ready={ready ? "true" : "false"}
      data-endmark-visible={visible ? "true" : "false"}
      data-endmark-stage={stage}
      data-endmark-error={loadError ? "true" : "false"}
      style={{ visibility: "hidden" }}
    >
      <div ref={svgHostRef} data-endmark-svg-host />
    </div>
  );
}
