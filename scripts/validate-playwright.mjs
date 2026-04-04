import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { setTimeout as delay } from "node:timers/promises";

import { chromium, devices } from "playwright";

const root = process.cwd();
const exportDir = path.join(root, "out");
const outputDir = path.join(root, ".playwright-artifacts");
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
  if (!candidate) {
    return null;
  }

  const candidates = requestPath.endsWith("/")
    ? [path.join(candidate, "index.html")]
    : [candidate, `${candidate}.html`, path.join(candidate, "index.html")];

  for (const filePath of candidates) {
    try {
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile()) {
        return filePath;
      }
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
      if (response.ok) {
        return;
      }
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
          expectedIdentity: "Zhouyu Liao",
          viewport: { width: 1440, height: 1080 },
        },
        {
          name: "tablet-ja",
          locale: "ja-JP",
          expectedPath: "/ja/",
          expectedIdentity: "Zhouyu Liao",
          viewport: { width: 834, height: 1194 },
        },
        {
          name: "mobile-zh",
          locale: "zh-CN",
          expectedPath: "/zh-CN/",
          expectedIdentity: "周宇辽",
          device: devices["iPhone 12"],
        },
      ];

      for (const scenario of scenarios) {
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

        const page = await context.newPage();
        await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
        await page.waitForURL(`**${scenario.expectedPath}`, { timeout: 5000 });

        const hero = page.locator("h1");
        await hero.waitFor({ state: "visible" });
        assert((await hero.textContent())?.includes(scenario.expectedIdentity), `Missing personal identity for ${scenario.name}`);
        const archiveLabel = page.locator(".hero-archive-label");
        await archiveLabel.waitFor({ state: "visible" });
        assert((await archiveLabel.textContent())?.includes("Ashen Archive"), `Missing archive title for ${scenario.name}`);
        const brandline = page.locator(".hero-brandline");
        await brandline.waitFor({ state: "visible" });
        assert((await brandline.textContent())?.includes("流月工作室"), `Missing studio support line for ${scenario.name}`);
        const relicStage = page.locator(".archive-relic-stage");
        await relicStage.waitFor({ state: "visible" });
        assert((await page.locator(".archive-diagnostic-rail").count()) === 1, `Missing diagnostic rail for ${scenario.name}`);
        assert((await page.locator(".archive-relic-poster-image").count()) === 1, `Missing relic poster layer for ${scenario.name}`);
        await expectNoHorizontalOverflow(page, scenario.name);

        const artifactButton = page.locator('button[aria-haspopup="dialog"]').first();
        await artifactButton.scrollIntoViewIfNeeded();
        await artifactButton.click();
        await page.locator('[role="dialog"]').waitFor({ state: "visible" });
        await page.keyboard.press("Escape");
        await page.locator('[role="dialog"]').waitFor({ state: "hidden" });

        for (const section of ["#about", "#disciplines", "#artifacts", "#fire", "#contact"]) {
          await page.locator(section).scrollIntoViewIfNeeded();
          await delay(150);
        }

        assert((await page.locator("#contact .dossier-panel").count()) === 1, `Missing contact dossier panel for ${scenario.name}`);
        await page.screenshot({
          path: path.join(outputDir, `${scenario.name}.png`),
          fullPage: true,
        });

        await context.close();
      }

      const gameContext = await browser.newContext({
        viewport: { width: 1280, height: 900 },
        locale: "en-US",
      });

      try {
        const gamePage = await gameContext.newPage();
        await gamePage.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
        const phaseValue = gamePage.locator(".archive-diagnostic-row").filter({ hasText: "Phase" }).locator(".archive-diagnostic-value");
        const modeValue = gamePage.locator(".archive-diagnostic-row").filter({ hasText: "Material mode" }).locator(".archive-diagnostic-value");

        await gamePage.locator(".archive-relic-stage canvas").waitFor({ state: "visible" });
        assert((await phaseValue.textContent())?.includes("Threshold"), "Initial relic phase should start at Threshold");

        await gamePage.locator("#disciplines").scrollIntoViewIfNeeded();
        await gamePage.waitForTimeout(250);
        assert((await phaseValue.textContent())?.includes("Discipline"), "Phase did not switch at Disciplines");

        await gamePage.locator("#fire").scrollIntoViewIfNeeded();
        await gamePage.waitForTimeout(250);
        assert((await phaseValue.textContent())?.includes("Sigil"), "Phase did not switch at Reading Sigils");

        await gamePage.getByRole("button", { name: /Moon Crest/i }).click();

        const currentFocus = gamePage.locator("#fire .relic-status-bar .artifact-meta-value").first();
        await currentFocus.waitFor({ state: "visible" });
        assert((await currentFocus.textContent())?.includes("Unity Systems"), "Sigil filter did not update current focus");
        assert((await modeValue.textContent())?.includes("Ordered"), "Material mode did not respond to sigil filter");

        const heroFocus = gamePage.locator(".hero-focus-title");
        await heroFocus.waitFor({ state: "visible" });
        assert((await heroFocus.textContent())?.includes("Unity Systems"), "Hero focus card did not respond to sigil filter");

        const firstArtifactTitle = gamePage.locator('#artifacts button[aria-haspopup="dialog"] h3').first();
        await firstArtifactTitle.scrollIntoViewIfNeeded();
        assert(
          (await firstArtifactTitle.textContent())?.includes("Mobile Systems, Quietly Tuned"),
          "Artifact ordering did not shift toward the selected lens",
        );

        const reducedMotionContext = await browser.newContext({
          viewport: { width: 1280, height: 900 },
          locale: "en-US",
          reducedMotion: "reduce",
        });

        try {
          const reducedMotionPage = await reducedMotionContext.newPage();
          await reducedMotionPage.goto(`${baseUrl}/en/`, { waitUntil: "networkidle" });
          await reducedMotionPage.locator("#fire").scrollIntoViewIfNeeded();
          await reducedMotionPage.getByRole("button", { name: /Ember Seal/i }).click();
          const reducedModeValue = reducedMotionPage
            .locator(".archive-diagnostic-row")
            .filter({ hasText: "Material mode" })
            .locator(".archive-diagnostic-value");
          await reducedModeValue.waitFor({ state: "visible" });
          assert((await reducedModeValue.textContent())?.includes("Ember"), "Reduced motion lens switching failed");
        } finally {
          await reducedMotionContext.close();
        }

        const fallbackPage = await gameContext.newPage();
        await fallbackPage.goto(`${baseUrl}/en/?relic=fallback`, { waitUntil: "networkidle" });
        await fallbackPage.locator(".archive-relic-status").waitFor({ state: "visible" });
        assert((await fallbackPage.locator(".archive-relic-status").textContent())?.includes("Realtime relic unavailable"), "Fallback poster did not appear when relic was forced off");
        await fallbackPage.close();
      } finally {
        await gameContext.close();
      }
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
