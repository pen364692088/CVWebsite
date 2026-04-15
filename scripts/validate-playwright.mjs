import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { setTimeout as delay } from "node:timers/promises";

import { chromium, devices } from "playwright";

const root = process.cwd();
const exportDir = path.join(root, "out");
const outputDir = path.join(root, ".playwright-artifacts", "alche-top-page");
const basePath = "/CVWebsite";
const baseUrl = "http://127.0.0.1:3000/CVWebsite";

fs.mkdirSync(outputDir, { recursive: true });

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
  { name: "loading-settled", search: "?alcheSection=loading&alcheIntro=0.4&alcheCapture=1" },
  { name: "kv-settled", search: "?alcheSection=kv&alcheIntro=1&alcheCapture=1" },
  { name: "works-intro-enter-early", search: "?alcheSection=works_intro&alcheProgress=0.62&alcheIntro=1&alcheCapture=1" },
  { name: "works-intro-settle", search: "?alcheSection=works_intro&alcheProgress=0.92&alcheIntro=1&alcheCapture=1" },
  { name: "works-hold", search: "?alcheSection=works&alcheProgress=0.22&alcheIntro=1&alcheCapture=1" },
  { name: "works-out", search: "?alcheSection=works&alcheProgress=0.92&alcheIntro=1&alcheCapture=1" },
  { name: "cards-boundary", search: "?alcheSection=works_cards&alcheProgress=0&alcheIntro=1&alcheCapture=1" },
  { name: "cards-enter", search: "?alcheSection=works_cards&alcheProgress=0.18&alcheIntro=1&alcheCapture=1" },
  { name: "cards-swap-mid", search: "?alcheSection=works_cards&alcheProgress=0.65&alcheIntro=1&alcheCapture=1" },
  { name: "cards-settled", search: "?alcheSection=works_cards&alcheProgress=0.72&alcheIntro=1&alcheCapture=1" },
];

const referenceBoardShots = ["works-out", "cards-boundary", "cards-enter", "cards-swap-mid", "cards-settled"];

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
  "cards-boundary": { min: 0.99, max: 1.01 },
  "cards-enter": { min: 0.99, max: 1.01 },
  "cards-swap-mid": { min: 0.99, max: 1.01 },
  "cards-settled": { min: 0.99, max: 1.01 },
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
  "cards-boundary": {
    mode: "card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    cardsLeadIndex: 0,
    card0Opacity: { min: 0.98, max: 1.01 },
    card1Opacity: { min: 0.98, max: 1.01 },
    card0X: { min: -0.65, max: -0.2 },
    card1X: { min: 0.6, max: 1.0 },
  },
  "cards-enter": {
    mode: "card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    cardsLeadIndex: 0,
    card0Opacity: { min: 0.98, max: 1.01 },
    card1Opacity: { min: 0.98, max: 1.01 },
    card0X: { min: -0.65, max: -0.2 },
    card1X: { min: 0.6, max: 1.0 },
  },
  "cards-swap-mid": {
    mode: "card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    card0Opacity: { min: 0.98, max: 1.01 },
    card1Opacity: { min: 0.98, max: 1.01 },
    card0X: { min: -1.25, max: -0.65 },
    card1X: { min: 0.05, max: 0.45 },
  },
  "cards-settled": {
    mode: "card-state",
    camera: kvLockedCamera,
    cameraTolerance: 0.08,
    worksOpacity: { max: 0.05 },
    cardsOpacity: { min: 0.98, max: 1.01 },
    moonflowOpacity: { max: 0.02 },
    cardsLeadIndex: 1,
    card0Opacity: { min: 0.98, max: 1.01 },
    card1Opacity: { min: 0.98, max: 1.01 },
    card0X: { min: -1.55, max: -1.1 },
    card1X: { min: -0.2, max: 0.05 },
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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function writeReferenceBoard() {
  const boardPath = path.join(outputDir, "reference-board.html");
  const shotsByName = new Map(fixedStateShots.map((shot) => [shot.name, shot]));
  const references = [
    { label: "Reference Home", src: path.relative(outputDir, path.join(root, "Task", "alche-reference-home.png")) },
    { label: "Reference Scroll Start", src: path.relative(outputDir, path.join(root, "Task", "滚动前.png")) },
  ].map((entry) => ({
    ...entry,
    src: entry.src.replaceAll(path.sep, "/"),
  }));
  const videoSrc = path.relative(outputDir, path.join(root, "Task", "参考视频.mp4")).replaceAll(path.sep, "/");
  const currentCards = referenceBoardShots
    .map((shotName) => {
      const shot = shotsByName.get(shotName);
      if (!shot) return "";
      return `
        <article class="panel">
          <img src="${escapeHtml(`${shotName}.png`)}" alt="${escapeHtml(shotName)}" />
          <h2>${escapeHtml(shotName)}</h2>
          <p>${escapeHtml(shot.search)}</p>
        </article>
      `;
    })
    .join("");
  const referenceCards = references
    .map(
      (entry) => `
        <article class="panel">
          <img src="${escapeHtml(entry.src)}" alt="${escapeHtml(entry.label)}" />
          <h2>${escapeHtml(entry.label)}</h2>
        </article>
      `,
    )
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
      .panel {
        border: 1px solid var(--border);
        background: rgba(8, 12, 18, 0.88);
        border-radius: 18px;
        padding: 14px;
      }
      .panel img, video {
        display: block;
        width: 100%;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: #000;
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
    <p>Current shots, static references, and the source video in one place.</p>

    <section class="section">
      <h2>Current Frames</h2>
      <div class="grid">${currentCards}</div>
    </section>

    <section class="section">
      <h2>Reference Stills</h2>
      <div class="grid">${referenceCards}</div>
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

async function captureFixedStates(browser) {
  const layerStates = new Map();
  for (const shot of fixedStateShots) {
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
      const sectionId = params.get("alcheSection");
      await page.waitForFunction(() => typeof window.__setAlcheDebugOverride === "function", undefined, { timeout: 5000 });
      await page.evaluate((nextOverride) => {
        window.__setAlcheDebugOverride?.(nextOverride);
      }, {
        section: sectionId,
        progress: Number(params.get("alcheProgress") ?? (sectionId === "loading" ? "0" : "1")),
        intro: Number(params.get("alcheIntro") ?? (sectionId === "loading" ? "0.2" : "1")),
        heroShotId: params.get("alcheHeroShot"),
      });
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
      await page.waitForTimeout(420);
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

        if (expected.mode === "card-state") {
          if (expected.cardsLeadIndex !== undefined) {
            assert(layerState.cardsLeadIndex === expected.cardsLeadIndex, `Expected lead card index ${expected.cardsLeadIndex} for ${shot.name}`);
          }
          assertRange(layerState.card0Opacity, expected.card0Opacity, `${shot.name} card0 opacity`);
          assertRange(layerState.card1Opacity, expected.card1Opacity, `${shot.name} card1 opacity`);
          assertRange(layerState.card0WorldX, expected.card0X, `${shot.name} card0 x`);
          assertRange(layerState.card1WorldX, expected.card1X, `${shot.name} card1 x`);
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
  const cardsBoundaryState = layerStates.get("cards-boundary");
  const cardsEnterState = layerStates.get("cards-enter");
  const cardsSwapMidState = layerStates.get("cards-swap-mid");
  const cardsSettledState = layerStates.get("cards-settled");
  if (earlyState && settleState && holdState && outState && cardsBoundaryState && cardsEnterState && cardsSwapMidState && cardsSettledState) {
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
    assert((holdState.cardsOpacity ?? 0) <= 0.04, "Expected cards to stay hidden during works hold.");
    assert((outState.cardsOpacity ?? 0) <= 0.04, "Expected cards to remain hidden until works fully exits.");
    assert((cardsBoundaryState.cardsOpacity ?? 0) > 0.98, "Expected cards to be fully visible immediately at works_cards boundary.");
    assert(cardsBoundaryState.cardsLeadIndex === 0, "Expected card 0 to lead at works_cards boundary.");
    assert(cardsEnterState.cardsLeadIndex === 0, "Expected card 0 to still lead at early works_cards.");
    assert(cardsSettledState.cardsLeadIndex === 1, "Expected card 1 to take over by settled works_cards.");
    assert((cardsBoundaryState.card0WorldX ?? 0) > (cardsSwapMidState.card0WorldX ?? 0), "Expected card0 to move left through the swap.");
    assert((cardsSwapMidState.card0WorldX ?? 0) > (cardsSettledState.card0WorldX ?? 0), "Expected card0 to continue left into its settled support slot.");
    assert((cardsBoundaryState.card1WorldX ?? 0) > (cardsSwapMidState.card1WorldX ?? 0), "Expected card1 to move inward from the right.");
    assert((cardsSwapMidState.card1WorldX ?? 0) > (cardsSettledState.card1WorldX ?? 0), "Expected card1 to continue inward into the center slot.");
    assert((cardsBoundaryState.card1WorldX ?? 0) > 0.6, "Expected card1 to begin on the right at boundary.");
    assert((cardsSwapMidState.card0WorldX ?? 0) < -0.6 && (cardsSwapMidState.card1WorldX ?? 0) < 0.5, "Expected both cards to be visibly mid-swap.");
    assert(approxEqual(earlyState.modelScale, holdState.modelScale, 0.01), "Expected center model scale to stay fixed through works.");
    assert(approxEqual(holdState.modelScale, cardsEnterState.modelScale, 0.01), "Expected center model scale to stay fixed into cards enter.");
    assert(approxEqual(cardsEnterState.modelScale, cardsSettledState.modelScale, 0.01), "Expected center model scale to stay fixed through cards swap.");
    assert(approxEqual(earlyState.modelWorldZ, holdState.modelWorldZ, 0.05), "Expected center model z to stay fixed through works.");
    assert(approxEqual(holdState.modelWorldZ, cardsEnterState.modelWorldZ, 0.05), "Expected center model z to stay fixed into cards enter.");
    assert(approxEqual(cardsEnterState.modelWorldZ, cardsSettledState.modelWorldZ, 0.05), "Expected center model z to stay fixed through cards swap.");
  }
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
    const browser = await chromium.launch({ headless: true });

    try {
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

      await captureFixedStates(browser);
      await captureRealWheelHandoff(browser);
      await capturePointerInteraction(browser);
      await writeReferenceBoard();
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

  console.log("Playwright validation passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
