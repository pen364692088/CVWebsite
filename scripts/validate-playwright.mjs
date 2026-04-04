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
        assert((await hero.textContent())?.includes("Ashen Archive"), `Missing brand signal for ${scenario.name}`);
        const brandline = page.locator(".hero-brandline");
        await brandline.waitFor({ state: "visible" });
        assert((await brandline.textContent())?.includes("流月工作室"), `Missing studio brand for ${scenario.name}`);
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

        assert((await page.locator(".dossier-panel").count()) === 1, `Missing studio dossier panel for ${scenario.name}`);
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
        const gameBoard = gamePage.locator(".relic-stage").first();
        await gameBoard.scrollIntoViewIfNeeded();
        await gamePage.getByRole("button", { name: "Sigil tray: Moon Crest" }).click();
        await gamePage.getByRole("button", { name: "Socket: Moon Socket" }).click();
        await gamePage.getByRole("button", { name: "Sigil tray: Tower Mark" }).click();
        await gamePage.getByRole("button", { name: "Socket: Tower Socket" }).click();
        await gamePage.getByRole("button", { name: "Sigil tray: Ember Seal" }).click();
        await gamePage.getByRole("button", { name: "Socket: Ember Socket" }).click();
        await gamePage.getByRole("heading", { name: "The seal breaks." }).waitFor();
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
