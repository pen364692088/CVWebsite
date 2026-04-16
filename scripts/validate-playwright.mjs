import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { setTimeout as delay } from "node:timers/promises";

import { chromium, devices } from "playwright";
import { generateAlcheReferenceFrames } from "./generate-alche-reference-frames.mjs";

const root = process.cwd();
const exportDir = path.join(root, "out");
const outputDir = path.join(root, ".playwright-artifacts", "alche-top-page");
const basePath = "/CVWebsite";
const baseUrl = "http://127.0.0.1:3000/CVWebsite";
const cliArgs = new Set(process.argv.slice(2));
const cardsOnlyMode = cliArgs.has("--cards-only");

fs.mkdirSync(outputDir, { recursive: true });

const worksShotbook = JSON.parse(fs.readFileSync(path.join(root, "data", "alche-works-shotbook.json"), "utf8"));
const worksShotNames = worksShotbook.shots.map((shot) => shot.id);

function withIdentityCardDebug(search) {
  return search.includes("alcheCardDebug=") ? search : `${search}${search.includes("?") ? "&" : "?"}alcheCardDebug=identity`;
}

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const expectedSections = ["kv", "works_intro", "works", "works_cards"];

const fixedStateShots = [
  { name: "loading-settled", search: withIdentityCardDebug("?alcheSection=loading&alcheIntro=0.4&alcheCapture=1") },
  { name: "kv-settled", search: withIdentityCardDebug("?alcheSection=kv&alcheIntro=1&alcheCapture=1") },
  { name: "works-intro-enter-early", search: withIdentityCardDebug("?alcheSection=works_intro&alcheProgress=0.62&alcheIntro=1&alcheCapture=1") },
  { name: "works-intro-settle", search: withIdentityCardDebug("?alcheSection=works_intro&alcheProgress=0.92&alcheIntro=1&alcheCapture=1") },
  { name: "works-hold", search: withIdentityCardDebug("?alcheSection=works&alcheProgress=0.22&alcheIntro=1&alcheCapture=1") },
  ...worksShotbook.shots.map((shot) => ({
    name: shot.id,
    search: withIdentityCardDebug(`?alcheShot=${shot.id}&alcheCapture=1`),
    override: {
      shotId: shot.id,
      section: shot.section,
      progress: shot.progress,
      intro: shot.intro,
      heroShotId: null,
    },
  })),
];

const referenceBoardShots = worksShotNames;
const cardsOnlyShotNames = new Set(referenceBoardShots);
const activeFixedStateShots = cardsOnlyMode
  ? fixedStateShots.filter((shot) => cardsOnlyShotNames.has(shot.name))
  : fixedStateShots;

const pointerInteractionShots = [
  { name: "kv-pointer-left-real", move: { x: 280, y: 240 } },
  { name: "kv-pointer-right-real", move: { x: 1160, y: 780 } },
];

const kvLockedCamera = {
  position: [0.02, 0.08, 5.38],
  target: [0.04, 0.02, -1.02],
};
const expectedWallWorldZ = -5;
const expectedWorksWorldZ = -4.9;
const expectedWorksWorldX = {
  "works-intro-enter-early": { min: -2.0, max: -1.4 },
  "works-intro-settle": { min: -0.35, max: 0.35 },
  "works-hold": { min: -0.2, max: 0.45 },
  "works-out": { min: 1.5, max: 2.25 },
};
const expectedHandoff = {
  "works-intro-enter-early": { min: 0.24, max: 0.32 },
  "works-intro-settle": { min: 0.38, max: 0.45 },
  "works-hold": { min: 0.5, max: 0.65 },
  "works-out": { min: 0.92, max: 1.0 },
  ...Object.fromEntries(worksShotNames.filter((shotName) => shotName !== "works-out").map((shotName) => [shotName, { min: 0.99, max: 1.01 }])),
};
const expectedShotStates = {
  "works-intro-enter-early": {
    mode: "hidden",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { min: 0.12, max: 0.34 },
    cardsOpacity: { max: 0.04 },
    moonflowOpacity: { min: 0.12, max: 0.5 },
  },
  "works-intro-settle": {
    mode: "hidden",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { min: 0.72, max: 1.01 },
    cardsOpacity: { max: 0.04 },
    moonflowOpacity: { max: 0.08 },
  },
  "works-hold": {
    mode: "hidden",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { min: 0.7, max: 1.01 },
    cardsOpacity: { max: 0.04 },
    moonflowOpacity: { max: 0.08 },
  },
  "works-out": {
    mode: "hidden",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.08 },
    cardsOpacity: { max: 0.04 },
    moonflowOpacity: { max: 0.02 },
  },
  "cards-a-entry": {
    mode: "single-card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    cardsLeadIndex: 0,
    card0Visible: true,
    card1Visible: false,
    card0Opacity: { min: 0.98, max: 1.01 },
  },
  "cards-a-center": {
    mode: "single-card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    cardsLeadIndex: 0,
    card0Visible: true,
    card1Visible: false,
    card0Opacity: { min: 0.98, max: 1.01 },
  },
  "cards-b-queue": {
    mode: "dual-card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    cardsLeadIndex: 0,
    card0Visible: true,
    card1Visible: true,
    card0Opacity: { min: 0.98, max: 1.01 },
    card1Opacity: { min: 0.98, max: 1.01 },
  },
  "cards-handoff-mid": {
    mode: "dual-card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    card0Visible: true,
    card1Visible: true,
    card0Opacity: { min: 0.98, max: 1.01 },
    card1Opacity: { min: 0.98, max: 1.01 },
  },
  "cards-settled": {
    mode: "dual-card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    cardsLeadIndex: 1,
    card0Visible: true,
    card1Visible: true,
    card0Opacity: { min: 0.98, max: 1.01 },
    card1Opacity: { min: 0.98, max: 1.01 },
  },
};

const laneTargets = {
  entryRightLower: {
    centerX: { min: 1040, max: 1320 },
    centerY: { min: 600, max: 800 },
    width: { min: 260, max: 460 },
  },
  leadCenter: {
    centerX: { min: 560, max: 840 },
    centerY: { min: 280, max: 470 },
    width: { min: 620, max: 980 },
  },
  supportLeft: {
    centerX: { min: 80, max: 280 },
    centerY: { min: 220, max: 400 },
    width: { min: 120, max: 320 },
  },
  queueRight: {
    centerX: { min: 1080, max: 1340 },
    centerY: { min: 430, max: 690 },
    width: { min: 220, max: 420 },
  },
};

function resolveRequestPath(requestPath) {
  const normalizedPath = requestPath === "/" ? basePath : requestPath;

  if (!normalizedPath.startsWith(basePath)) {
    return null;
  }

  const relativePath = normalizedPath.slice(basePath.length) || "/";
  const cleanPath = decodeURIComponent(relativePath).replace(/^\/+/, "");
  const candidate = path.join(exportDir, cleanPath);

  const relativeFromExport = path.relative(exportDir, candidate);
  if (relativeFromExport.startsWith("..") || path.isAbsolute(relativeFromExport)) {
    return null;
  }

  return candidate;
}

async function readRequestFile(requestPath) {
  const candidate = resolveRequestPath(requestPath);
  if (!candidate) return null;

  const candidates = requestPath.endsWith("/")
    ? [path.join(candidate, "index.html")]
    : [candidate, `${candidate}.html`, path.join(candidate, "index.html")];

  for (const filePath of candidates) {
    try {
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile()) return filePath;
    } catch {}
  }

  return null;
}

async function createStaticServer(port) {
  const server = http.createServer(async (req, res) => {
    const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`);
    const filePath = await readRequestFile(requestUrl.pathname);

    if (!filePath) {
      const fallback404 = path.join(exportDir, "404.html");
      if (fs.existsSync(fallback404)) {
        res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
        res.end(await fs.promises.readFile(fallback404));
        return;
      }

      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] ?? "application/octet-stream";
    res.writeHead(200, { "content-type": contentType });
    res.end(await fs.promises.readFile(filePath));
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });

  return server;
}

async function waitForServer(url, attempts = 20) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}

    await delay(250);
  }

  throw new Error(`Server did not become ready: ${url}`);
}

async function expectNoHorizontalOverflow(page, scenarioName) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth - window.innerWidth;
  });

  assert(overflow <= 1, `Horizontal overflow detected for ${scenarioName}: ${overflow}px`);
}

async function assertTopPageShell(page, scenarioName) {
  assert((await page.locator("canvas").count()) === 1, `Expected a single canvas for ${scenarioName}`);
  assert((await page.locator("body").textContent())?.includes("ALCHE"), `Missing ALCHE branding for ${scenarioName}`);

  for (const sectionId of expectedSections) {
    assert((await page.locator(`[data-top_section="${sectionId}"]`).count()) === 1, `Missing ${sectionId} section for ${scenarioName}`);
  }

  assert((await page.locator('[data-top_section="mission_in"]').count()) === 0, `Unexpected mission sections for ${scenarioName}`);
  assert((await page.locator("[data-top-scroll-indicator]").count()) === 0, `Unexpected top scroll indicator for ${scenarioName}`);
  assert((await page.locator('[data-top-panel="works"]').count()) === 0, `Unexpected works panel for ${scenarioName}`);
}

function approxEqual(a, b, tolerance = 0.03) {
  return Math.abs(a - b) <= tolerance;
}

function assertRange(value, range, label) {
  assert(value !== null && value !== undefined, `Missing ${label}`);
  if (range.min !== undefined) {
    assert(value >= range.min, `Expected ${label} >= ${range.min}, got ${value}`);
  }
  if (range.max !== undefined) {
    assert(value <= range.max, `Expected ${label} <= ${range.max}, got ${value}`);
  }
}

function assertCameraState(layerState, camera, tolerance, label) {
  assert(
    layerState.cameraPosition.every((value, index) => approxEqual(value, camera.position[index], tolerance)),
    `Expected ${label} camera position`,
  );
  assert(
    layerState.cameraTarget.every((value, index) => approxEqual(value, camera.target[index], tolerance)),
    `Expected ${label} camera target`,
  );
}

function assertCardAheadOfModel(layerState, cardWorldZ, label) {
  assert(cardWorldZ !== null && layerState.modelWorldZ !== null, `Missing ${label} depth`);
  assert(cardWorldZ > layerState.modelWorldZ + 0.8, `Expected ${label} clearly ahead of model`);
}

function assertScreenGap(layerState, minimumGap, label) {
  const leftRight = layerState.card0ScreenRight;
  const rightLeft = layerState.card1ScreenLeft;
  const gap = rightLeft - leftRight;

  assert(leftRight !== null && rightLeft !== null, `Missing ${label} screen bounds`);
  assert(gap >= minimumGap, `Expected ${label} screen gap >= ${minimumGap}, got ${gap}`);
}

function getCardScreenCenterX(layerState, cardIndex) {
  const left = layerState[`card${cardIndex}ScreenLeft`];
  const right = layerState[`card${cardIndex}ScreenRight`];
  assert(left !== null && right !== null, `Missing card${cardIndex} screen x bounds`);
  return (left + right) * 0.5;
}

function getCardScreenCenterY(layerState, cardIndex) {
  const top = layerState[`card${cardIndex}ScreenTop`];
  const bottom = layerState[`card${cardIndex}ScreenBottom`];
  assert(top !== null && bottom !== null, `Missing card${cardIndex} screen y bounds`);
  return (top + bottom) * 0.5;
}

function getCardScreenWidth(layerState, cardIndex) {
  const left = layerState[`card${cardIndex}ScreenLeft`];
  const right = layerState[`card${cardIndex}ScreenRight`];
  assert(left !== null && right !== null, `Missing card${cardIndex} screen width`);
  return right - left;
}

function assertCardInLane(layerState, cardIndex, lane, label) {
  const centerX = getCardScreenCenterX(layerState, cardIndex);
  const centerY = getCardScreenCenterY(layerState, cardIndex);
  const width = getCardScreenWidth(layerState, cardIndex);
  assertRange(centerX, lane.centerX, `${label} card${cardIndex} lane center x`);
  assertRange(centerY, lane.centerY, `${label} card${cardIndex} lane center y`);
  assertRange(width, lane.width, `${label} card${cardIndex} lane width`);
}

function assertCardVisibility(layerState, cardIndex, expectedVisible, label) {
  assert(layerState[`card${cardIndex}Visible`] === expectedVisible, `Expected ${label} card${cardIndex} visible=${expectedVisible}`);
}

function assertCardSeparation(layerState, minimumGap, label) {
  const leftRight = layerState.card0ScreenRight;
  const rightLeft = layerState.card1ScreenLeft;
  assert(leftRight !== null && rightLeft !== null, `Missing ${label} separation bounds`);
  const gap = rightLeft - leftRight;
  assert(gap >= minimumGap, `Expected ${label} screen gap >= ${minimumGap}, got ${gap}`);
}

async function waitForShotLayerState(page, shotName, expectedState) {
  if (!expectedState) {
    await page.waitForTimeout(420);
    return;
  }

  await page.waitForFunction(
    ({ shotName: currentShotName, expected }) => {
      const state = window.__getAlcheLayerDebugState?.();
      if (!state) return false;

      const hasBounds = (cardIndex) =>
        state[`card${cardIndex}ScreenLeft`] !== null &&
        state[`card${cardIndex}ScreenRight`] !== null &&
        state[`card${cardIndex}ScreenTop`] !== null &&
        state[`card${cardIndex}ScreenBottom`] !== null;
      const lacksBounds = (cardIndex) =>
        state[`card${cardIndex}ScreenLeft`] === null &&
        state[`card${cardIndex}ScreenRight`] === null &&
        state[`card${cardIndex}ScreenTop`] === null &&
        state[`card${cardIndex}ScreenBottom`] === null;

      if (expected.mode === "single-card-state") {
        const card0Ready = expected.card0Visible ? hasBounds(0) : lacksBounds(0);
        const card1Ready = expected.card1Visible ? hasBounds(1) : lacksBounds(1);
        return (
          state.cardsOpacity !== null &&
          state.card0Opacity !== null &&
          (expected.card1Visible ? state.card1Opacity !== null : state.card1Opacity === null) &&
          state.card0Visible === expected.card0Visible &&
          state.card1Visible === expected.card1Visible &&
          card0Ready &&
          card1Ready
        );
      }

      if (expected.mode === "dual-card-state") {
        return (
          state.cardsOpacity !== null &&
          state.card0Opacity !== null &&
          state.card1Opacity !== null &&
          state.card0Visible === expected.card0Visible &&
          state.card1Visible === expected.card1Visible &&
          hasBounds(0) &&
          hasBounds(1)
        );
      }

      if (expected.mode === "hidden") {
        return (
          state.cardsOpacity !== null &&
          state.worksOpacity !== null &&
          state.card0Visible === false &&
          state.card1Visible === false &&
          lacksBounds(0) &&
          lacksBounds(1)
        );
      }

      if (currentShotName === "works-out") {
        return state.cardsOpacity !== null && state.card0Visible === false && state.card1Visible === false;
      }

      return state.modelWorldZ !== null;
    },
    { shotName, expected: expectedState },
    { timeout: 5000 },
  );

  await page.waitForTimeout(180);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatLayerStateSummary(layerState) {
  if (!layerState) return "debug: unavailable";

  const card0CenterX =
    layerState.card0ScreenLeft !== null && layerState.card0ScreenRight !== null
      ? ((layerState.card0ScreenLeft + layerState.card0ScreenRight) * 0.5).toFixed(1)
      : "null";
  const card0CenterY =
    layerState.card0ScreenTop !== null && layerState.card0ScreenBottom !== null
      ? ((layerState.card0ScreenTop + layerState.card0ScreenBottom) * 0.5).toFixed(1)
      : "null";
  const card1CenterX =
    layerState.card1ScreenLeft !== null && layerState.card1ScreenRight !== null
      ? ((layerState.card1ScreenLeft + layerState.card1ScreenRight) * 0.5).toFixed(1)
      : "null";
  const card1CenterY =
    layerState.card1ScreenTop !== null && layerState.card1ScreenBottom !== null
      ? ((layerState.card1ScreenTop + layerState.card1ScreenBottom) * 0.5).toFixed(1)
      : "null";
  const screenGap =
    layerState.card0ScreenRight !== null && layerState.card1ScreenLeft !== null
      ? (layerState.card1ScreenLeft - layerState.card0ScreenRight).toFixed(1)
      : "null";

  return [
    `debug: c0=${layerState.card0Visible ? "on" : "off"} @ ${card0CenterX},${card0CenterY}`,
    `debug: c1=${layerState.card1Visible ? "on" : "off"} @ ${card1CenterX},${card1CenterY}`,
    `debug: lead=${layerState.cardsLeadIndex ?? "null"} gap=${screenGap}`,
  ].join(" | ");
}

async function writeReferenceBoard(layerStates) {
  const boardPath = path.join(outputDir, "reference-board.html");
  const shotsByName = new Map(fixedStateShots.map((shot) => [shot.name, shot]));
  const videoSrc = path.relative(outputDir, path.join(root, "Task", "参考视频.mp4")).replaceAll(path.sep, "/");
  const shotRows = worksShotbook.shots
    .map((shot) => {
      const capture = shotsByName.get(shot.id);
      const taskStillSrc = shot.reference.taskStillPath
        ? path.relative(outputDir, path.join(root, shot.reference.taskStillPath)).replaceAll(path.sep, "/")
        : null;
      const layerState = layerStates.get(shot.id) ?? null;
      return `
        <section class="shot">
          <div class="shotMeta">
            <h2>${escapeHtml(shot.id)}</h2>
            <p>${escapeHtml(capture?.search ?? "")}</p>
            <p>${escapeHtml(`section=${shot.section} progress=${shot.progress.toFixed(2)} intro=${shot.intro.toFixed(2)}`)}</p>
            <p>${escapeHtml(`videoTime=${shot.reference.videoTime.toFixed(2)}s`)}</p>
            <p>${escapeHtml(formatLayerStateSummary(layerState))}</p>
          </div>
          <div class="shotGrid">
            <article class="panel">
              <img src="${escapeHtml(`${shot.id}.png`)}" alt="${escapeHtml(`${shot.id} current`)}" />
              <h2>Current</h2>
            </article>
            <article class="panel">
              <img src="${escapeHtml(`reference-video/${shot.id}.png`)}" alt="${escapeHtml(`${shot.id} video reference`)}" />
              <h2>Video Reference</h2>
            </article>
            <article class="panel">
              ${
                taskStillSrc
                  ? `<img src="${escapeHtml(taskStillSrc)}" alt="${escapeHtml(`${shot.id} task still`)}" />`
                  : `<div class="placeholder">No task still</div>`
              }
              <h2>Task Still</h2>
            </article>
          </div>
        </section>
      `;
    })
    .join("");
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Alche Cards Reference Board</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #050608;
        --panel: #101317;
        --border: rgba(255, 255, 255, 0.12);
        --text: #f5f7fb;
        --muted: #a8b0bd;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 24px;
        background: radial-gradient(circle at top, #18202d, var(--bg) 42%);
        color: var(--text);
        font-family: "IBM Plex Mono", ui-monospace, monospace;
      }
      h1, h2 { margin: 0; }
      p { margin: 0; color: var(--muted); }
      .section { margin-top: 28px; }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
        margin-top: 16px;
      }
      .shot {
        margin-top: 18px;
        border: 1px solid var(--border);
        background: rgba(8, 12, 18, 0.88);
        border-radius: 20px;
        padding: 16px;
      }
      .shotMeta {
        display: grid;
        gap: 6px;
      }
      .shotGrid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
        margin-top: 14px;
      }
      .panel {
        border: 1px solid var(--border);
        background: rgba(8, 12, 18, 0.88);
        border-radius: 18px;
        padding: 14px;
      }
      .panel img, video, .placeholder {
        display: block;
        width: 100%;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: #000;
      }
      .placeholder {
        min-height: 180px;
        display: grid;
        place-items: center;
        color: var(--muted);
        font-size: 12px;
      }
      .panel h2 {
        font-size: 14px;
        margin-top: 10px;
      }
      .panel p {
        font-size: 12px;
        margin-top: 8px;
        line-height: 1.5;
        word-break: break-all;
      }
    </style>
  </head>
  <body>
    <h1>ALCHE Cards Reference Board</h1>
    <p>Current shots, extracted video references, task stills, and the source video in one place.</p>

    <section class="section">
      <h2>Shotbook</h2>
      ${shotRows}
    </section>

    <section class="section">
      <h2>Reference Video</h2>
      <div class="grid">
        <article class="panel">
          <video controls preload="metadata" src="${escapeHtml(videoSrc)}"></video>
          <h2>Task/参考视频.mp4</h2>
        </article>
      </div>
    </section>
  </body>
</html>`;

  await fs.promises.writeFile(boardPath, html, "utf8");
}

async function runScenario(browser, scenario) {
  const context = await browser.newContext(
    scenario.device
      ? {
          ...scenario.device,
          locale: scenario.locale,
        }
      : {
          viewport: scenario.viewport,
          locale: scenario.locale,
        },
  );

  try {
    const page = await context.newPage();
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.waitForURL(`**${scenario.expectedPath}`, { timeout: 5000 });
    await page.waitForFunction(
      () => document.querySelectorAll("canvas").length === 1 && document.querySelector("[data-active-section]") !== null,
      undefined,
      { timeout: 8000 },
    );

    await assertTopPageShell(page, scenario.name);

    await expectNoHorizontalOverflow(page, scenario.name);
    await page.screenshot({
      path: path.join(outputDir, `${scenario.name}.png`),
      fullPage: false,
    });
  } finally {
    await context.close();
  }
}

async function captureFixedStates(browser, shots) {
  const layerStates = new Map();
  for (const shot of shots) {
    console.log(`Capturing ${shot.name}...`);
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1080 },
      locale: "en-US",
      reducedMotion: "reduce",
    });

    try {
      const page = await context.newPage();
      await page.goto(`${baseUrl}/en/${shot.search}`, { waitUntil: "networkidle" });
      await assertTopPageShell(page, shot.name);
      const params = new URLSearchParams(shot.search.slice(1));
      const override = shot.override ?? {
        section: params.get("alcheSection"),
        progress: Number(params.get("alcheProgress") ?? ((params.get("alcheSection") ?? "loading") === "loading" ? "0" : "1")),
        intro: Number(params.get("alcheIntro") ?? ((params.get("alcheSection") ?? "loading") === "loading" ? "0.2" : "1")),
        heroShotId: params.get("alcheHeroShot"),
      };
      const sectionId = override.section;
      await page.waitForFunction(() => typeof window.__setAlcheDebugOverride === "function", undefined, { timeout: 5000 });
      await page.evaluate((nextOverride) => {
        window.__setAlcheDebugOverride?.(nextOverride);
      }, override);
      if (sectionId && sectionId !== "loading") {
        try {
          await page.waitForFunction(
            (expectedSection) => {
              const root = document.querySelector("[data-active-section]");
              const loadingOverlay = document.querySelector("[data-loading-overlay]");
              return (
                root?.getAttribute("data-render-active-section") === expectedSection &&
                root?.getAttribute("data-render-intro-ready") === "true" &&
                loadingOverlay?.getAttribute("data-render-hidden") === "true"
              );
            },
            sectionId,
            { timeout: 2500 },
          );
        } catch {
          await page.waitForFunction(
            (expectedSection) => {
              const root = document.querySelector("[data-active-section]");
              const loadingOverlay = document.querySelector("[data-loading-overlay]");
              return (
                root?.getAttribute("data-active-section") === expectedSection &&
                root?.getAttribute("data-intro-ready") === "true" &&
                loadingOverlay?.getAttribute("data-hidden") === "true"
              );
            },
            sectionId,
            { timeout: 5000 },
          );
        }
      } else {
        try {
          await page.waitForFunction(
            () => document.querySelector("[data-active-section]")?.getAttribute("data-render-active-section") === "loading",
            undefined,
            { timeout: 2500 },
          );
        } catch {
          await page.waitForFunction(
            () => document.querySelector("[data-active-section]")?.getAttribute("data-active-section") === "loading",
            undefined,
            { timeout: 5000 },
          );
        }
      }
      await page.waitForFunction(() => typeof window.__getAlcheLayerDebugState === "function", undefined, { timeout: 5000 });
      await waitForShotLayerState(page, shot.name, expectedShotStates[shot.name]);
      const layerState = await page.evaluate(() => window.__getAlcheLayerDebugState?.() ?? null);
      layerStates.set(shot.name, layerState);
      assert(layerState, `Missing layer debug state for ${shot.name}`);

      if (shot.name in expectedShotStates) {
        const expected = expectedShotStates[shot.name];
        assertCameraState(layerState, expected.camera, expected.cameraTolerance, shot.name);
        assert(approxEqual(layerState.wallWorldZ, expectedWallWorldZ), `Expected wall world z for ${shot.name}`);
        assert((layerState.wallRotationY ?? 0) <= 0.02 && (layerState.wallRotationY ?? 0) >= -0.02, `Expected wall rotation locked for ${shot.name}`);
        assert(approxEqual(layerState.worksWorldZ, expectedWorksWorldZ, 0.05), `Expected WORKS world z for ${shot.name}`);
        assertRange(layerState.worksHandoff, expectedHandoff[shot.name] ?? { min: 0.99, max: 1.01 }, `${shot.name} works handoff`);
        assertRange(layerState.worksOpacity ?? 0, expected.worksOpacity, `${shot.name} works opacity`);
        assertRange(layerState.cardsOpacity ?? 0, expected.cardsOpacity, `${shot.name} cards opacity`);
        assertRange(layerState.moonflowOpacity ?? 0, expected.moonflowOpacity, `${shot.name} moonflow opacity`);
        assertRange(layerState.modelScale, { min: 0.5, max: 1.2 }, `${shot.name} model scale`);

        if (expected.mode === "single-card-state") {
          if (expected.cardsLeadIndex !== undefined) {
            assert(layerState.cardsLeadIndex === expected.cardsLeadIndex, `Expected lead card index ${expected.cardsLeadIndex} for ${shot.name}`);
          }
          assertCardVisibility(layerState, 0, expected.card0Visible, shot.name);
          assertCardVisibility(layerState, 1, expected.card1Visible, shot.name);
          assertRange(layerState.card0Opacity, expected.card0Opacity, `${shot.name} card0 opacity`);
          assert((layerState.card0ScreenLeft ?? 0) < (layerState.card0ScreenRight ?? 0), `Expected ${shot.name} card0 screen bounds`);
          assert(layerState.card1Opacity === null, `Expected ${shot.name} card1 opacity to be null while hidden`);
          assert(layerState.card1ScreenLeft === null && layerState.card1ScreenRight === null, `Expected ${shot.name} card1 screen bounds to be null while hidden`);
          assert(layerState.cardsSupportWorldX === null && layerState.cardsSupportWorldZ === null, `Expected ${shot.name} support card debug to stay null while B is hidden`);
          assertCardAheadOfModel(layerState, layerState.card0WorldZ, `${shot.name} card0`);
          assertCardAheadOfModel(layerState, layerState.cardsLeadWorldZ, `${shot.name} lead card`);
        } else if (expected.mode === "dual-card-state") {
          if (expected.cardsLeadIndex !== undefined) {
            assert(layerState.cardsLeadIndex === expected.cardsLeadIndex, `Expected lead card index ${expected.cardsLeadIndex} for ${shot.name}`);
          }
          assertCardVisibility(layerState, 0, expected.card0Visible, shot.name);
          assertCardVisibility(layerState, 1, expected.card1Visible, shot.name);
          assertRange(layerState.card0Opacity, expected.card0Opacity, `${shot.name} card0 opacity`);
          assertRange(layerState.card1Opacity, expected.card1Opacity, `${shot.name} card1 opacity`);
          assert((layerState.card0ScreenLeft ?? 0) < (layerState.card0ScreenRight ?? 0), `Expected ${shot.name} card0 screen bounds`);
          assert((layerState.card1ScreenLeft ?? 0) < (layerState.card1ScreenRight ?? 0), `Expected ${shot.name} card1 screen bounds`);
          assertCardAheadOfModel(layerState, layerState.card0WorldZ, `${shot.name} card0`);
          assertCardAheadOfModel(layerState, layerState.card1WorldZ, `${shot.name} card1`);
          assertCardAheadOfModel(layerState, layerState.cardsLeadWorldZ, `${shot.name} lead card`);
          assertCardAheadOfModel(layerState, layerState.cardsSupportWorldZ, `${shot.name} support card`);
        } else if (expected.cardsLeadIndex !== undefined) {
          assert(layerState.cardsLeadIndex === expected.cardsLeadIndex, `Expected lead card index ${expected.cardsLeadIndex} for ${shot.name}`);
          assertRange(layerState.cardsLeadWorldX, expected.cardsLeadX, `${shot.name} lead card x`);
          assertRange(layerState.cardsSupportWorldX, expected.cardsSupportX, `${shot.name} support card x`);
          assertCardAheadOfModel(layerState, layerState.cardsLeadWorldZ, `${shot.name} lead card`);
          assertCardAheadOfModel(layerState, layerState.cardsSupportWorldZ, `${shot.name} support card`);
          assert((layerState.cardsLeadOpacity ?? 0) >= (layerState.cardsSupportOpacity ?? 0) * 0.82, `Expected lead card to remain visually dominant for ${shot.name}`);
        } else {
          assert((layerState.cardsOpacity ?? 0) <= 0.08, `Expected cards hidden during ${shot.name}`);
          assertRange(layerState.worksWorldX, expectedWorksWorldX[shot.name], `${shot.name} works x`);
          assert(Math.abs(layerState.worksRotationY ?? 0) <= 0.001, `Expected WORKS rotation.y frozen for ${shot.name}`);
          assert(layerState.modelWorldZ > layerState.worksWorldZ, `Expected model ahead of WORKS for ${shot.name}`);
        }

        if ((layerState.moonflowOpacity ?? 0) > 0.04) {
          assert(layerState.modelWorldZ > layerState.moonflowWorldZ, `Expected model ahead of MOONFLOW for ${shot.name}`);
        }
        assert(layerState.worksDepthTest === true, `Expected WORKS depthTest enabled for ${shot.name}`);
        assert(layerState.worksDepthWrite === false, `Expected WORKS depthWrite disabled for ${shot.name}`);
        assert(layerState.worksTransparent === true, `Expected WORKS transparent material for ${shot.name}`);
      }
      await page.screenshot({
        path: path.join(outputDir, `${shot.name}.png`),
        fullPage: false,
      });
      await page.close();
    } finally {
      await context.close();
    }
  }
  const earlyState = layerStates.get("works-intro-enter-early");
  const settleState = layerStates.get("works-intro-settle");
  const holdState = layerStates.get("works-hold");
  const outState = layerStates.get("works-out");
  const cardsAEntryState = layerStates.get("cards-a-entry");
  const cardsACenterState = layerStates.get("cards-a-center");
  const cardsBQueueState = layerStates.get("cards-b-queue");
  const cardsHandoffMidState = layerStates.get("cards-handoff-mid");
  const cardsSettledState = layerStates.get("cards-settled");

  if (earlyState && settleState && holdState && outState) {
    assert(earlyState.worksHandoff < settleState.worksHandoff, "Expected WORKS handoff to increase through intro.");
    assert(settleState.worksHandoff < holdState.worksHandoff, "Expected WORKS handoff to continue into hold.");
    assert(holdState.worksHandoff < outState.worksHandoff, "Expected WORKS handoff to continue into out.");
    assert(earlyState.worksWorldX < settleState.worksWorldX, "Expected WORKS to move right during enter.");
    assert(Math.abs((settleState.worksWorldX ?? 0) - (holdState.worksWorldX ?? 0)) < 0.6, "Expected WORKS to hold near center before fade.");
    assert(holdState.worksWorldX < outState.worksWorldX, "Expected WORKS to move right again during out.");
    assert((earlyState.moonflowOpacity ?? 0) > (settleState.moonflowOpacity ?? 0), "Expected MOONFLOW to fade out only once.");
    assert((settleState.moonflowOpacity ?? 0) >= (holdState.moonflowOpacity ?? 0), "Expected MOONFLOW to stay off after fade.");
    assert((holdState.moonflowOpacity ?? 0) >= (outState.moonflowOpacity ?? 0), "Expected MOONFLOW to remain off into out.");
    assert((earlyState.worksOpacity ?? 0) < (settleState.worksOpacity ?? 0), "Expected WORKS to fade in during enter.");
    assert(Math.abs((settleState.worksOpacity ?? 0) - (holdState.worksOpacity ?? 0)) < 0.16, "Expected WORKS to hold opacity in center.");
    assert((holdState.worksOpacity ?? 0) > (outState.worksOpacity ?? 0), "Expected WORKS to fade out once.");
  }

  if (outState && cardsAEntryState && cardsACenterState && cardsBQueueState && cardsHandoffMidState && cardsSettledState) {
    if (holdState) {
      assert((holdState.cardsOpacity ?? 0) <= 0.04, "Expected cards to stay hidden during works hold.");
    }
    assert((outState.cardsOpacity ?? 0) <= 0.04, "Expected cards to remain hidden until works fully exits.");
    assert((cardsAEntryState.cardsOpacity ?? 0) > 0.98, "Expected card A to appear immediately in works_cards.");
    assert(cardsAEntryState.cardsLeadIndex === 0, "Expected card 0 to lead during A entry.");
    assert(cardsACenterState.cardsLeadIndex === 0, "Expected card 0 to still lead at A center.");
    assert(cardsBQueueState.cardsLeadIndex === 0, "Expected card 0 to still lead while B queues.");
    assert(cardsSettledState.cardsLeadIndex === 1, "Expected card 1 to take over by settled works_cards.");
    assert(cardsAEntryState.card1Visible === false && cardsACenterState.card1Visible === false, "Expected card B to remain unloaded through A center.");
    assert(cardsBQueueState.card1Visible === true, "Expected card B to load only during queue.");
    assertCardInLane(cardsAEntryState, 0, laneTargets.entryRightLower, "cards-a-entry");
    assertCardInLane(cardsACenterState, 0, laneTargets.leadCenter, "cards-a-center");
    assertCardInLane(cardsBQueueState, 0, laneTargets.leadCenter, "cards-b-queue");
    assertCardInLane(cardsBQueueState, 1, laneTargets.queueRight, "cards-b-queue");
    assertCardInLane(cardsSettledState, 0, laneTargets.supportLeft, "cards-settled");
    assertCardInLane(cardsSettledState, 1, laneTargets.leadCenter, "cards-settled");
    assertCardSeparation(cardsBQueueState, 12, "cards-b-queue");
    assertCardSeparation(cardsHandoffMidState, 12, "cards-handoff-mid");
    assertCardSeparation(cardsSettledState, 12, "cards-settled");
    assert(getCardScreenCenterX(cardsAEntryState, 0) > getCardScreenCenterX(cardsACenterState, 0), "Expected card A to move from right toward center first.");
    assert(getCardScreenCenterX(cardsACenterState, 0) > getCardScreenCenterX(cardsHandoffMidState, 0), "Expected card A to continue left during handoff.");
    assert(getCardScreenCenterX(cardsHandoffMidState, 0) > getCardScreenCenterX(cardsSettledState, 0), "Expected card A to finish in the left-upper support slot.");
    assert(getCardScreenCenterY(cardsAEntryState, 0) > getCardScreenCenterY(cardsACenterState, 0), "Expected card A to move upward from right-lower into center.");
    assert(getCardScreenCenterY(cardsSettledState, 0) < getCardScreenCenterY(cardsACenterState, 0), "Expected card A to end above center in the left-upper slot.");
    assert(getCardScreenCenterX(cardsBQueueState, 1) > getCardScreenCenterX(cardsHandoffMidState, 1), "Expected card B to move left from queue into center.");
    assert(getCardScreenCenterX(cardsHandoffMidState, 1) > getCardScreenCenterX(cardsSettledState, 1), "Expected card B to continue left into the lead slot.");
    assert(getCardScreenCenterY(cardsBQueueState, 1) > getCardScreenCenterY(cardsHandoffMidState, 1), "Expected card B to move upward from right-lower into center.");
    assert(getCardScreenCenterY(cardsHandoffMidState, 1) > getCardScreenCenterY(cardsSettledState, 1), "Expected card B to keep moving upward into the center slot.");
    assert((cardsSettledState.card0ScreenRight ?? 0) >= 120, "Expected settled A to remain meaningfully visible in frame.");
    assert((cardsSettledState.card0ScreenLeft ?? 0) >= 0 && (cardsSettledState.card0ScreenRight ?? 0) <= 1440, "Expected settled A to remain fully in frame.");
    const stableModelReference = holdState ?? outState;
    assert(stableModelReference, "Missing stable model reference state.");
    if (holdState && earlyState) {
      assert(approxEqual(earlyState.modelScale, holdState.modelScale, 0.01), "Expected center model scale to stay fixed through works.");
      assert(approxEqual(earlyState.modelWorldZ, holdState.modelWorldZ, 0.05), "Expected center model z to stay fixed through works.");
    }
    assert(approxEqual(stableModelReference.modelScale, cardsACenterState.modelScale, 0.01), "Expected center model scale to stay fixed into cards center.");
    assert(approxEqual(cardsACenterState.modelScale, cardsSettledState.modelScale, 0.01), "Expected center model scale to stay fixed through cards swap.");
    assert(approxEqual(stableModelReference.modelWorldZ, cardsACenterState.modelWorldZ, 0.05), "Expected center model z to stay fixed into cards center.");
    assert(approxEqual(cardsACenterState.modelWorldZ, cardsSettledState.modelWorldZ, 0.05), "Expected center model z to stay fixed through cards swap.");
  }

  return layerStates;
}

async function capturePointerInteraction(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    locale: "en-US",
    reducedMotion: "no-preference",
  });

  try {
    const page = await context.newPage();
    await page.goto(`${baseUrl}/en/?alchePointerDebug=1`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelectorAll("canvas").length === 1, undefined, { timeout: 5000 });
    await assertTopPageShell(page, "kv-pointer-interaction");
    await page.waitForFunction(
      () =>
        typeof window.__setAlcheDebugOverride === "function" &&
        typeof window.__getAlchePointerDebugState === "function" &&
        typeof window.__getAlcheHeroModelRotation === "function",
      undefined,
      { timeout: 5000 },
    );
    await page.evaluate(() => {
      window.__setAlcheDebugOverride?.({
        section: "kv",
        progress: 1,
        intro: 1,
        heroShotId: null,
      });
    });
    await page.waitForFunction(
      () => {
        const root = document.querySelector("[data-active-section]");
        const loadingOverlay = document.querySelector("[data-loading-overlay]");
        return (
          root?.getAttribute("data-render-active-section") === "kv" &&
          root?.getAttribute("data-render-intro-ready") === "true" &&
          loadingOverlay?.getAttribute("data-render-hidden") === "true"
        );
      },
      undefined,
      { timeout: 5000 },
    );
    await page.waitForTimeout(400);

    const rotations = [];
    for (const shot of pointerInteractionShots) {
      await page.mouse.move(shot.move.x, shot.move.y);
      await page.waitForFunction(
        ({ clientX, clientY, expectLeft }) => {
          const debug = window.__getAlchePointerDebugState?.();
          const rotation = window.__getAlcheHeroModelRotation?.();
          if (!debug || !rotation) return false;
          const domMatches =
            debug.domPointerInside &&
            debug.domPointerClientX !== null &&
            debug.domPointerClientY !== null &&
            Math.abs(debug.domPointerClientX - clientX) < 6 &&
            Math.abs(debug.domPointerClientY - clientY) < 6;
          const r3fMatches = expectLeft
            ? debug.r3fPointerX < -0.45 && debug.r3fPointerY > 0.45
            : debug.r3fPointerX > 0.45 && debug.r3fPointerY < -0.35;
          const rotationMatches = Math.abs(rotation.y - 0.58) < 0.03 && Math.abs(rotation.x + 0.22) < 0.03;
          return domMatches && r3fMatches && rotationMatches;
        },
        {
          clientX: shot.move.x,
          clientY: shot.move.y,
          expectLeft: shot.name.includes("left"),
        },
        { timeout: 5000 },
      );
      await page.waitForTimeout(120);
      const debug = await page.evaluate(() => window.__getAlchePointerDebugState?.() ?? null);
      const rotation = await page.evaluate(() => window.__getAlcheHeroModelRotation?.() ?? null);
      rotations.push({ name: shot.name, debug, rotation });
      await page.screenshot({
        path: path.join(outputDir, `${shot.name}.png`),
        fullPage: false,
      });
    }

    const leftRotation = rotations[0]?.rotation;
    const rightRotation = rotations[1]?.rotation;
    const leftDebug = rotations[0]?.debug;
    const rightDebug = rotations[1]?.debug;
    assert(leftDebug && rightDebug, "Missing pointer debug samples.");
    assert(leftRotation && rightRotation, "Missing hero model rotation samples.");
    assert(leftDebug.domPointerInside && rightDebug.domPointerInside, "Expected DOM pointer to enter the canvas event source.");
    assert(leftDebug.r3fPointerX < rightDebug.r3fPointerX, "Expected real mouse movement to change R3F pointer x.");
    assert(leftDebug.r3fPointerY > rightDebug.r3fPointerY, "Expected real mouse movement to change R3F pointer y.");
    assert(Math.abs(leftRotation.y - rightRotation.y) < 0.01, "Expected frozen hero model yaw during control-variable pass.");
    assert(Math.abs(leftRotation.x - rightRotation.x) < 0.01, "Expected frozen hero model pitch during control-variable pass.");
  } finally {
    await context.close();
  }
}

async function captureRealWheelHandoff(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    locale: "en-US",
    reducedMotion: "no-preference",
  });

  try {
    const page = await context.newPage();
    await page.goto(`${baseUrl}/en/?alchePointerDebug=1`, { waitUntil: "networkidle" });
    await assertTopPageShell(page, "works-wheel-handoff");
    await page.waitForFunction(
      () =>
        document.querySelector("[data-active-section]")?.getAttribute("data-intro-ready") === "true" &&
        typeof window.__getAlcheLayerDebugState === "function",
      undefined,
      { timeout: 8000 },
    );
    await page.mouse.move(720, 540);

    const samples = [];
    const capturedShots = new Set();

    for (let step = 0; step < 28; step += 1) {
      await page.mouse.wheel(0, 420);
      await page.waitForTimeout(520);
      const snapshot = await page.evaluate((stepLabel) => {
        const root = document.querySelector("[data-active-section]");
        const layerState = window.__getAlcheLayerDebugState?.() ?? null;
        return {
          step: stepLabel,
          scrollY: Math.round(window.scrollY),
          active: root?.getAttribute("data-active-section"),
          tracked: root?.getAttribute("data-tracked-section"),
          introReady: root?.getAttribute("data-intro-ready"),
          handoff: layerState?.worksHandoff ?? null,
          worksOpacity: layerState?.worksOpacity ?? null,
          moonflowOpacity: layerState?.moonflowOpacity ?? null,
          worksWorldX: layerState?.worksWorldX ?? null,
          worksRotationY: layerState?.worksRotationY ?? null,
          modelWorldZ: layerState?.modelWorldZ ?? null,
          worksWorldZ: layerState?.worksWorldZ ?? null,
        };
      }, step);
      samples.push(snapshot);

      if (snapshot.handoff !== null && snapshot.handoff >= 0.24 && !capturedShots.has("works-wheel-intro")) {
        await page.screenshot({
          path: path.join(outputDir, "works-wheel-intro.png"),
          fullPage: false,
        });
        capturedShots.add("works-wheel-intro");
      }

      if (snapshot.handoff !== null && snapshot.handoff >= 0.55 && !capturedShots.has("works-wheel-hold")) {
        await page.screenshot({
          path: path.join(outputDir, "works-wheel-hold.png"),
          fullPage: false,
        });
        capturedShots.add("works-wheel-hold");
      }

      if (
        snapshot.active === "works" &&
        snapshot.handoff !== null &&
        snapshot.handoff >= 0.6 &&
        snapshot.worksOpacity !== null &&
        snapshot.worksOpacity >= 0.12
      ) {
        break;
      }
    }

    const handoffSamples = samples.filter((sample) => sample.handoff !== null);
    const introSample = handoffSamples.find((sample) => sample.handoff >= 0.24 && sample.handoff <= 0.45);
    const worksSample = handoffSamples.find((sample) => sample.handoff >= 0.55 && (sample.worksOpacity ?? 0) >= 0.12);
    assert(introSample, "Expected real wheel scrolling to begin the WORKS handoff.");
    assert(worksSample, "Expected real wheel scrolling to reach the WORKS hold region.");
    assert(introSample.step < worksSample.step, "Expected WORKS intro motion to occur before hold during real wheel scrolling.");
    for (let index = 1; index < handoffSamples.length; index += 1) {
      const previous = handoffSamples[index - 1].handoff ?? 0;
      const next = handoffSamples[index].handoff ?? 0;
      assert(next + 0.02 >= previous, "Expected real wheel handoff to stay monotonic while scrolling down.");
    }
    assert(introSample.worksRotationY !== null && Math.abs(introSample.worksRotationY) <= 0.001, "Expected WORKS rotation to stay frozen during real wheel intro.");
    assert(worksSample.worksRotationY !== null && Math.abs(worksSample.worksRotationY) <= 0.001, "Expected WORKS rotation to stay frozen during real wheel hold.");
    assert(introSample.modelWorldZ !== null && introSample.worksWorldZ !== null && introSample.modelWorldZ > introSample.worksWorldZ, "Expected model ahead of WORKS during real wheel intro.");
    assert(worksSample.modelWorldZ !== null && worksSample.worksWorldZ !== null && worksSample.modelWorldZ > worksSample.worksWorldZ, "Expected model ahead of WORKS during real wheel hold.");
    assert(introSample.moonflowOpacity !== null && worksSample.moonflowOpacity !== null && introSample.moonflowOpacity > worksSample.moonflowOpacity, "Expected MOONFLOW to fade down through the real wheel handoff.");
    assert((introSample.worksOpacity ?? 0) < (worksSample.worksOpacity ?? 0), "Expected WORKS opacity to rise between intro and hold during real wheel scrolling.");
  } finally {
    await context.close();
  }
}

async function run() {
  const server = await createStaticServer(3000);

  try {
    await waitForServer(`${baseUrl}/en/`);
    generateAlcheReferenceFrames({ root, outputDir: path.join(outputDir, "reference-video") });
    const browser = await chromium.launch({ headless: true });

    try {
      if (!cardsOnlyMode) {
        const scenarios = [
          {
            name: "desktop-en",
            locale: "en-US",
            expectedPath: "/en/",
            viewport: { width: 1440, height: 1080 },
          },
          {
            name: "tablet-ja",
            locale: "ja-JP",
            expectedPath: "/ja/",
            viewport: { width: 834, height: 1194 },
          },
          {
            name: "mobile-zh",
            locale: "zh-CN",
            expectedPath: "/zh-CN/",
            device: devices["iPhone 12"],
          },
        ];

        for (const scenario of scenarios) {
          await runScenario(browser, scenario);
        }
      }

      const layerStates = await captureFixedStates(browser, activeFixedStateShots);
      if (!cardsOnlyMode) {
        await captureRealWheelHandoff(browser);
        await capturePointerInteraction(browser);
      }
      await writeReferenceBoard(layerStates);
    } finally {
      await browser.close();
    }
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  console.log(`Playwright validation passed (${cardsOnlyMode ? "cards-only" : "full"}).`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
