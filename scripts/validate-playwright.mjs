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

const expectedSections = [
  "kv",
  "works_intro",
  "works",
  "works_outro",
  "mission_in",
  "mission",
  "vision",
  "vision_out",
  "service_in",
  "service",
  "stellla",
  "outro",
];

const fixedStateShots = [
  { name: "loading-settled", search: "?alcheSection=loading&alcheIntro=0.4&alcheCapture=1" },
  { name: "kv-settled", search: "?alcheSection=kv&alcheIntro=1&alcheCapture=1" },
  { name: "works-intro-handoff", search: "?alcheSection=works_intro&alcheProgress=0.55&alcheIntro=1&alcheCapture=1" },
  { name: "works-settled", search: "?alcheSection=works&alcheProgress=0.55&alcheIntro=1&alcheCapture=1" },
  { name: "works-outro-clearing", search: "?alcheSection=works_outro&alcheProgress=0.7&alcheIntro=1&alcheCapture=1" },
  { name: "mission-settled", search: "?alcheSection=mission&alcheProgress=0.6&alcheIntro=1&alcheCapture=1" },
  { name: "vision-settled", search: "?alcheSection=vision&alcheProgress=0.6&alcheIntro=1&alcheCapture=1" },
  { name: "service-settled", search: "?alcheSection=service&alcheProgress=0.6&alcheIntro=1&alcheCapture=1" },
  { name: "stellla-settled", search: "?alcheSection=stellla&alcheProgress=0.7&alcheIntro=1&alcheCapture=1" },
  { name: "outro-settled", search: "?alcheSection=outro&alcheProgress=0.75&alcheIntro=1&alcheCapture=1" },
];

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
  assert((await page.locator("[data-top-scroll-indicator]").count()) === 1, `Missing top scroll indicator for ${scenarioName}`);
  assert((await page.locator("canvas").count()) === 1, `Expected a single canvas for ${scenarioName}`);
  assert((await page.locator("body").textContent())?.includes("ALCHE"), `Missing ALCHE branding for ${scenarioName}`);

  for (const sectionId of expectedSections) {
    assert((await page.locator(`[data-top_section="${sectionId}"]`).count()) === 1, `Missing ${sectionId} section for ${scenarioName}`);
  }
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

    await assertTopPageShell(page, scenario.name);
    assert((await page.textContent("body"))?.includes("TOP PAGE RUNTIME"), `Missing runtime debug panel for ${scenario.name}`);

    for (const sectionId of ["works_intro", "works", "mission", "vision", "service", "stellla", "outro"]) {
      await page.locator(`#${sectionId}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
    }

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
  for (const shot of fixedStateShots) {
    console.log(`Capturing ${shot.name}...`);
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1080 },
      locale: "en-US",
    });

    try {
      const page = await context.newPage();
      await page.goto(`${baseUrl}/en/${shot.search}`, { waitUntil: "networkidle" });
      await assertTopPageShell(page, shot.name);
      await page.waitForTimeout(150);
      await page.evaluate(() => {
        const canvas = document.querySelector("canvas");
        if (canvas) canvas.remove();
      });
      await page.screenshot({
        path: path.join(outputDir, `${shot.name}.png`),
        fullPage: false,
      });
      await page.close();
    } finally {
      await context.close();
    }
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
