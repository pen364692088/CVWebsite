import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

const root = process.cwd();

const remote = {
  heroCastleKeep:
    "https://images.pexels.com/photos/6022633/pexels-photo-6022633.jpeg?cs=srgb&dl=pexels-alesiakozik-6022633.jpg&fm=jpg",
  heroCastleSkyline:
    "https://images.pexels.com/photos/3811515/pexels-photo-3811515.jpeg?cs=srgb&dl=pexels-edocoledoco-3811515.jpg&fm=jpg",
  egoKnight:
    "https://images.pexels.com/photos/30829322/pexels-photo-30829322.jpeg?cs=srgb&dl=pexels-isabella-her-2149687972-30829322.jpg&fm=jpg",
  egoHelmet:
    "https://images.pexels.com/photos/30875362/pexels-photo-30875362.jpeg?cs=srgb&dl=pexels-isabella-her-2149687972-30875362.jpg&fm=jpg",
  ashenSword:
    "https://images.pexels.com/photos/36184606/pexels-photo-36184606.jpeg?cs=srgb&dl=pexels-marxph-36184606.jpg&fm=jpg",
  ashenFlame:
    "https://images.pexels.com/photos/12234032/pexels-photo-12234032.jpeg?cs=srgb&dl=pexels-nikiemmert-12234032.jpg&fm=jpg",
  openTome:
    "https://images.pexels.com/photos/31855386/pexels-photo-31855386.jpeg?cs=srgb&dl=pexels-md-photography-2150970498-31855386.jpg&fm=jpg",
  openManuscript:
    "https://images.pexels.com/photos/18062024/pexels-photo-18062024.jpeg?cs=srgb&dl=pexels-baris-turkoz-214377915-18062024.jpg&fm=jpg",
};

function localDataUrl(relPath, mime) {
  const absolute = path.join(root, relPath);
  const buffer = fs.readFileSync(absolute);
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

function mulberry32(seed) {
  return function next() {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function emberMarkup(seed, count, config) {
  const random = mulberry32(seed);
  return Array.from({ length: count }, (_, index) => {
    const left = config.leftMin + random() * (config.leftMax - config.leftMin);
    const top = config.topMin + random() * (config.topMax - config.topMin);
    const size = config.sizeMin + random() * (config.sizeMax - config.sizeMin);
    const opacity = config.opacityMin + random() * (config.opacityMax - config.opacityMin);
    const delay = -(random() * 10).toFixed(2);
    const duration = (config.durationMin + random() * (config.durationMax - config.durationMin)).toFixed(2);
    return `<span class="ember ${config.className ?? ""}" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px;opacity:${opacity.toFixed(3)};animation-delay:${delay}s;animation-duration:${duration}s" data-index="${index}"></span>`;
  }).join("");
}

function candleMarkup(candles) {
  return candles
    .map(
      (candle) => `
        <span class="candle" style="left:${candle.left}%;bottom:${candle.bottom}%;transform:scale(${candle.scale})">
          <span class="candle-flame"></span>
        </span>
      `,
    )
    .join("");
}

function buildDocument(content, extraCss = "") {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <style>
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          background: #050608;
          color: white;
          font-family: Georgia, serif;
        }

        body {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
        }

        .capture {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 24%, rgba(255, 225, 187, 0.08), transparent 18%),
            linear-gradient(180deg, rgba(15, 17, 22, 0.94), rgba(7, 8, 10, 0.98)),
            #07080a;
        }

        .capture::before {
          content: "";
          position: absolute;
          inset: 18px;
          border: 1px solid rgba(198, 166, 122, 0.18);
          border-radius: 24px;
          pointer-events: none;
          z-index: 20;
        }

        .capture::after {
          content: "";
          position: absolute;
          inset: 0;
        background:
            radial-gradient(circle at 50% 46%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.66) 76%, rgba(0, 0, 0, 0.9) 100%),
            linear-gradient(180deg, rgba(4, 5, 8, 0.04), rgba(4, 5, 8, 0.14) 45%, rgba(4, 5, 8, 0.82) 100%);
          pointer-events: none;
          z-index: 19;
        }

        .grain {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.26) 0 1px, transparent 1px),
            radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.22) 0 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.18) 0 1px, transparent 1px);
          background-size: 9px 9px, 13px 13px, 11px 11px;
          mix-blend-mode: soft-light;
          z-index: 18;
        }

        .blend-screen {
          mix-blend-mode: screen;
        }

        .blend-lighten {
          mix-blend-mode: lighten;
        }

        .soft-mask {
          position: absolute;
          inset: 0;
        background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.02) 24%, rgba(0, 0, 0, 0.18) 54%, rgba(0, 0, 0, 0.82) 100%),
            linear-gradient(90deg, rgba(0, 0, 0, 0.46), rgba(0, 0, 0, 0.02) 28%, rgba(0, 0, 0, 0.02) 72%, rgba(0, 0, 0, 0.5));
          z-index: 16;
        }

        .ember-field {
          position: absolute;
          inset: 0;
          z-index: 17;
          pointer-events: none;
        }

        .ember {
          position: absolute;
          display: block;
          border-radius: 999px;
          background:
            radial-gradient(circle, rgba(255, 246, 226, 0.96) 0%, rgba(255, 197, 126, 0.92) 18%, rgba(233, 123, 41, 0.7) 52%, rgba(233, 123, 41, 0) 100%);
          filter: blur(0.4px);
          transform: translate(-50%, -50%);
          animation: emberFloat ease-in-out infinite;
        }

        .ember.deep {
          background:
            radial-gradient(circle, rgba(255, 244, 228, 0.92) 0%, rgba(255, 172, 103, 0.88) 14%, rgba(216, 98, 28, 0.72) 48%, rgba(216, 98, 28, 0) 100%);
        }

        @keyframes emberFloat {
          0%, 100% { transform: translate(-50%, -50%) scale(0.96); }
          50% { transform: translate(-50%, calc(-50% - 8px)) scale(1.05); }
        }

        .candle {
          position: absolute;
          z-index: 14;
          width: 24px;
          height: 78px;
          margin-left: -12px;
          transform-origin: center bottom;
        }

        .candle::before {
          content: "";
          position: absolute;
          inset: 18px 5px 0;
          border-radius: 5px 5px 10px 10px;
          background:
            linear-gradient(180deg, rgba(255, 246, 236, 0.96), rgba(217, 202, 184, 0.98) 80%, rgba(164, 143, 122, 0.96));
          box-shadow:
            0 0 0 1px rgba(54, 45, 36, 0.3),
            0 10px 18px rgba(0, 0, 0, 0.28);
        }

        .candle::after {
          content: "";
          position: absolute;
          left: 9px;
          top: 11px;
          width: 6px;
          height: 14px;
          border-radius: 999px;
          background: #1e1712;
        }

        .candle-flame {
          position: absolute;
          left: 3px;
          top: 0;
          width: 18px;
          height: 30px;
          border-radius: 50% 50% 55% 55%;
          background:
            radial-gradient(circle at 52% 34%, rgba(255, 248, 232, 0.98), rgba(255, 204, 138, 0.96) 34%, rgba(250, 132, 33, 0.86) 70%, rgba(250, 132, 33, 0) 100%);
          filter: blur(0.35px);
          transform: rotate(-4deg);
          box-shadow: 0 0 18px rgba(255, 168, 74, 0.42);
        }

        .plaque-border {
          position: absolute;
          inset: 24px;
          border-radius: 26px;
          border: 1px solid rgba(198, 166, 122, 0.24);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.03),
            inset 0 0 0 12px rgba(0, 0, 0, 0.1);
          z-index: 15;
          pointer-events: none;
        }

        .relic-frame {
          position: absolute;
          inset: 58px 62px 112px;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(216, 196, 154, 0.14);
          background: rgba(5, 6, 8, 0.76);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.03),
            0 26px 52px rgba(0, 0, 0, 0.36);
          z-index: 10;
        }

        .relic-frame img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .relic-vignette {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(5, 6, 8, 0.52), rgba(5, 6, 8, 0.08) 28%, rgba(5, 6, 8, 0.14) 62%, rgba(5, 6, 8, 0.72) 100%),
            linear-gradient(90deg, rgba(5, 6, 8, 0.46), rgba(5, 6, 8, 0.02) 26%, rgba(5, 6, 8, 0.02) 74%, rgba(5, 6, 8, 0.46));
          z-index: 12;
        }

        .dossier-panel {
          position: absolute;
          overflow: hidden;
          border-radius: 24px;
          border: 1px solid rgba(216, 196, 154, 0.16);
          background: rgba(7, 8, 10, 0.78);
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.02),
            0 20px 48px rgba(0, 0, 0, 0.34);
        }

        .dossier-panel::after {
          content: "";
          position: absolute;
          inset: 14px;
          border-radius: inherit;
          border: 1px solid rgba(216, 196, 154, 0.08);
          pointer-events: none;
        }

        .dossier-panel img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ledger-line {
          position: absolute;
          border-top: 1px solid rgba(216, 196, 154, 0.22);
          z-index: 12;
        }

        .ledger-node {
          position: absolute;
          width: 18px;
          height: 18px;
          margin: -9px 0 0 -9px;
          border-radius: 999px;
          background:
            radial-gradient(circle, rgba(255, 244, 230, 0.98), rgba(255, 194, 128, 0.92) 36%, rgba(220, 108, 30, 0.62) 68%, rgba(220, 108, 30, 0) 100%);
          box-shadow: 0 0 18px rgba(255, 172, 84, 0.36);
          z-index: 13;
        }

        ${extraCss}
      </style>
    </head>
    <body>${content}</body>
  </html>`;
}

async function waitForImages(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0),
  );
}

async function renderAsset(browser, html, outputPath, options) {
  const page = await browser.newPage({
    viewport: {
      width: options.viewportWidth ?? options.width + 96,
      height: options.viewportHeight ?? options.height + 96,
    },
    deviceScaleFactor: 1,
  });

  await page.setContent(html, { waitUntil: "domcontentloaded" });
  await waitForImages(page);

  const locator = page.locator("#capture");
  await locator.screenshot({
    path: path.join(root, outputPath),
    type: options.type ?? "jpeg",
    quality: options.quality ?? 90,
  });

  await page.close();
  console.log(`generated ${outputPath}`);
}

function heroHtml(dragonDataUrl, rearSmokeDataUrl) {
  const embers = emberMarkup(914, 94, {
    leftMin: 4,
    leftMax: 96,
    topMin: 46,
    topMax: 96,
    sizeMin: 4,
    sizeMax: 22,
    opacityMin: 0.18,
    opacityMax: 0.44,
    durationMin: 5,
    durationMax: 11,
    className: "deep",
  });

  return buildDocument(
    `
      <section id="capture" class="capture hero-v2">
        <div class="hero-sky"></div>
        <div class="hero-moon"></div>
        <div class="hero-castle-skyline">
          <img src="${remote.heroCastleSkyline}" alt="" />
        </div>
        <div class="hero-castle-keep">
          <img src="${remote.heroCastleKeep}" alt="" />
        </div>
        <img class="hero-rear-smoke blend-screen" src="${rearSmokeDataUrl}" alt="" />
        <img class="hero-dragon" src="${dragonDataUrl}" alt="" />
        <div class="hero-land hero-land-left"></div>
        <div class="hero-land hero-land-right"></div>
        <div class="hero-path-glow"></div>
        <div class="hero-center-mist"></div>
        <div class="hero-bottom-haze"></div>
        <div class="ember-field">${embers}</div>
        <div class="grain"></div>
      </section>
    `,
    `
      .hero-v2 {
        width: 1800px;
        height: 1200px;
        border-radius: 34px;
      }

      .hero-sky {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 52% 22%, rgba(244, 222, 190, 0.08), transparent 18%),
          linear-gradient(180deg, rgba(16, 18, 24, 0.86), rgba(8, 9, 11, 1) 78%);
      }

      .hero-moon {
        position: absolute;
        width: 680px;
        height: 680px;
        left: 52%;
        top: 7%;
        border-radius: 999px;
        background:
          radial-gradient(circle at 48% 44%, rgba(255, 244, 228, 0.98), rgba(236, 221, 198, 0.96) 30%, rgba(198, 186, 168, 0.9) 62%, rgba(155, 148, 138, 0.66) 78%, rgba(155, 148, 138, 0) 100%);
        box-shadow:
          0 0 56px rgba(232, 220, 204, 0.24),
          0 0 140px rgba(232, 220, 204, 0.14);
        filter: blur(0.2px);
        z-index: 2;
      }

      .hero-moon::before,
      .hero-moon::after {
        content: "";
        position: absolute;
        border-radius: 999px;
        background: rgba(118, 111, 104, 0.12);
      }

      .hero-moon::before {
        inset: 120px 190px 250px 150px;
        transform: rotate(16deg);
      }

      .hero-moon::after {
        inset: 248px 120px 128px 250px;
      }

      .hero-castle-skyline,
      .hero-castle-keep,
      .hero-rear-smoke,
      .hero-dragon {
        position: absolute;
        user-select: none;
        -webkit-user-drag: none;
      }

      .hero-castle-skyline {
        width: 1080px;
        height: 320px;
        right: 0;
        bottom: 248px;
        overflow: hidden;
        clip-path: polygon(0 100%, 0 52%, 14% 36%, 24% 30%, 36% 18%, 52% 24%, 62% 16%, 74% 10%, 88% 18%, 100% 30%, 100% 100%);
        z-index: 4;
      }

      .hero-castle-skyline img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center 66%;
        filter: grayscale(0.42) sepia(0.22) saturate(0.56) contrast(1.18) brightness(0.34);
        opacity: 0.68;
        mix-blend-mode: screen;
      }

      .hero-castle-keep {
        width: 560px;
        height: 760px;
        right: 220px;
        top: 174px;
        overflow: hidden;
        clip-path: polygon(14% 100%, 14% 48%, 20% 28%, 32% 10%, 44% 6%, 56% 12%, 68% 8%, 80% 18%, 86% 30%, 90% 100%);
        z-index: 5;
      }

      .hero-castle-keep img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 56% 42%;
        filter: grayscale(0.22) sepia(0.16) saturate(0.82) contrast(1.18) brightness(0.72);
        opacity: 0.96;
        mix-blend-mode: screen;
        transform: scale(1.12);
      }

      .hero-rear-smoke {
        inset: -5% -2% auto -2%;
        width: 104%;
        height: 78%;
        object-fit: cover;
        filter: grayscale(1) brightness(0.72) contrast(1.14) blur(2px);
        opacity: 0.2;
        z-index: 7;
      }

      .hero-dragon {
        width: 430px;
        left: 146px;
        top: 150px;
        filter: brightness(0.62) contrast(1.28) drop-shadow(0 0 18px rgba(230, 220, 210, 0.1));
        opacity: 0.5;
        mix-blend-mode: screen;
        z-index: 8;
      }

      .hero-land {
        position: absolute;
        bottom: -12px;
        width: 54%;
        height: 42%;
        z-index: 11;
        background:
          linear-gradient(180deg, rgba(15, 17, 22, 0), rgba(8, 8, 9, 0.92) 18%, rgba(5, 5, 6, 1)),
          linear-gradient(135deg, rgba(34, 18, 14, 0.2), rgba(5, 5, 6, 0) 36%);
      }

      .hero-land-left {
        left: -6%;
        clip-path: polygon(0 100%, 0 42%, 18% 34%, 34% 26%, 48% 30%, 64% 46%, 86% 60%, 100% 100%);
      }

      .hero-land-right {
        right: -7%;
        clip-path: polygon(0 100%, 18% 60%, 34% 44%, 54% 28%, 70% 22%, 100% 40%, 100% 100%);
      }

      .hero-path-glow {
        position: absolute;
        left: 34%;
        right: 14%;
        bottom: 0;
        height: 34%;
        background:
          radial-gradient(circle at 50% 78%, rgba(244, 132, 54, 0.16), rgba(244, 132, 54, 0) 38%),
          linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.26) 28%, rgba(0, 0, 0, 0.9) 100%);
        clip-path: polygon(42% 0, 58% 0, 92% 100%, 8% 100%);
        z-index: 12;
      }

      .hero-center-mist {
        position: absolute;
        left: 18%;
        right: 18%;
        bottom: 18%;
        height: 28%;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(208, 210, 214, 0.28), rgba(208, 210, 214, 0) 72%);
        filter: blur(40px);
        z-index: 13;
      }

      .hero-bottom-haze {
        position: absolute;
        left: -4%;
        right: -4%;
        bottom: -2%;
        height: 28%;
        background:
          linear-gradient(180deg, rgba(5, 6, 8, 0), rgba(5, 6, 8, 0.82)),
          radial-gradient(circle at 30% 34%, rgba(210, 214, 216, 0.1), rgba(210, 214, 216, 0) 30%),
          radial-gradient(circle at 72% 42%, rgba(210, 214, 216, 0.08), rgba(210, 214, 216, 0) 28%);
        filter: blur(18px);
        z-index: 14;
      }
    `,
  );
}

function smokeHtml() {
  const embers = emberMarkup(1204, 46, {
    leftMin: 2,
    leftMax: 98,
    topMin: 58,
    topMax: 94,
    sizeMin: 8,
    sizeMax: 28,
    opacityMin: 0.12,
    opacityMax: 0.28,
    durationMin: 6,
    durationMax: 10,
  });

  const random = mulberry32(88);
  const plumes = Array.from({ length: 38 }, () => {
    const left = (random() * 100).toFixed(2);
    const top = (44 + random() * 38).toFixed(2);
    const width = (220 + random() * 420).toFixed(1);
    const height = (70 + random() * 140).toFixed(1);
    const opacity = (0.09 + random() * 0.12).toFixed(3);
    return `<span class="smoke-plume" style="left:${left}%;top:${top}%;width:${width}px;height:${height}px;opacity:${opacity}"></span>`;
  }).join("");

  return buildDocument(
    `
      <section id="capture" class="capture smoke-v2">
        <div class="smoke-base"></div>
        <div class="smoke-clouds">${plumes}</div>
        <div class="ember-field">${embers}</div>
      </section>
    `,
    `
      .smoke-v2 {
        width: 1800px;
        height: 640px;
        border-radius: 0;
      }

      .smoke-v2::before,
      .smoke-v2::after {
        display: none;
      }

      .smoke-base {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.98) 56%, rgba(7, 8, 10, 1) 100%);
      }

      .smoke-clouds,
      .smoke-plume {
        position: absolute;
      }

      .smoke-clouds {
        inset: 0;
      }

      .smoke-plume {
        border-radius: 999px;
        background: radial-gradient(circle, rgba(216, 218, 222, 0.82), rgba(160, 164, 170, 0.18) 56%, rgba(160, 164, 170, 0) 100%);
        filter: blur(34px);
        transform: translate(-50%, -50%);
      }
    `,
  );
}

function coverHtml(kind) {
  const sources = {
    egocore: {
      base: remote.egoKnight,
      second: remote.egoHelmet,
      candles: [
        { left: 14, bottom: 7, scale: 0.78 },
        { left: 83, bottom: 8, scale: 0.76 },
      ],
      className: "cover-egocore",
      embers: emberMarkup(221, 34, {
        leftMin: 8,
        leftMax: 92,
        topMin: 48,
        topMax: 92,
        sizeMin: 4,
        sizeMax: 16,
        opacityMin: 0.12,
        opacityMax: 0.28,
        durationMin: 6,
        durationMax: 10,
      }),
    },
    "ashen-archive": {
      base: remote.ashenSword,
      second: remote.ashenFlame,
      candles: [
        { left: 14, bottom: 8, scale: 0.9 },
        { left: 27, bottom: 11, scale: 0.68 },
        { left: 73, bottom: 11, scale: 0.68 },
        { left: 86, bottom: 8, scale: 0.9 },
      ],
      className: "cover-ashen",
      embers: emberMarkup(443, 44, {
        leftMin: 10,
        leftMax: 90,
        topMin: 42,
        topMax: 96,
        sizeMin: 4,
        sizeMax: 20,
        opacityMin: 0.14,
        opacityMax: 0.34,
        durationMin: 5,
        durationMax: 10,
        className: "deep",
      }),
    },
    openemotion: {
      base: remote.openTome,
      second: remote.openManuscript,
      candles: [
        { left: 16, bottom: 8, scale: 0.74 },
        { left: 84, bottom: 9, scale: 0.74 },
      ],
      className: "cover-openemotion",
      embers: emberMarkup(772, 24, {
        leftMin: 12,
        leftMax: 88,
        topMin: 54,
        topMax: 94,
        sizeMin: 3,
        sizeMax: 14,
        opacityMin: 0.08,
        opacityMax: 0.22,
        durationMin: 6,
        durationMax: 11,
      }),
    },
  }[kind];

  return buildDocument(
    `
      <section id="capture" class="capture cover-v2 ${sources.className}">
        <div class="plaque-border"></div>
        <div class="relic-frame">
          ${sources.second ? `<img class="cover-second blend-screen" src="${sources.second}" alt="" />` : ""}
          <img class="cover-base" src="${sources.base}" alt="" />
          <div class="relic-vignette"></div>
        </div>
        <div class="cover-floor-glow"></div>
        <div class="cover-rune-arcs"></div>
        ${candleMarkup(sources.candles)}
        <div class="ember-field">${sources.embers}</div>
        <div class="grain"></div>
      </section>
    `,
    `
      .cover-v2 {
        width: 1200px;
        height: 1500px;
        border-radius: 30px;
      }

      .cover-base,
      .cover-second {
        filter: grayscale(0.12) sepia(0.22) saturate(0.82) contrast(1.1) brightness(0.74);
      }

      .cover-second {
        opacity: 0.34;
        filter: grayscale(0.18) sepia(0.18) saturate(0.72) contrast(1.08) brightness(0.56);
      }

      .cover-floor-glow {
        position: absolute;
        left: 24%;
        right: 24%;
        bottom: 16%;
        height: 18%;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(244, 132, 54, 0.28), rgba(244, 132, 54, 0) 72%);
        filter: blur(16px);
        z-index: 13;
      }

      .cover-rune-arcs {
        position: absolute;
        left: 26%;
        right: 26%;
        bottom: 26%;
        height: 22%;
        z-index: 13;
        background:
          radial-gradient(circle at 50% 90%, transparent 0 46%, rgba(198, 166, 122, 0.2) 47%, transparent 48%) center bottom / 100% 100% no-repeat,
          radial-gradient(circle at 50% 90%, transparent 0 62%, rgba(198, 166, 122, 0.12) 63%, transparent 64%) center bottom / 100% 100% no-repeat;
        opacity: 0.78;
      }

      .cover-egocore .cover-base {
        object-position: center 30%;
        filter: grayscale(0.18) sepia(0.14) saturate(0.68) contrast(1.16) brightness(0.74);
        transform: scale(1.16);
      }

      .cover-egocore .cover-second {
        object-position: center 18%;
        opacity: 0.2;
        transform: scale(1.16) translate(20%, -4%);
      }

      .cover-egocore .cover-floor-glow {
        left: 28%;
        right: 28%;
        bottom: 18%;
      }

      .cover-ashen .cover-base {
        object-position: center 36%;
        filter: grayscale(0.18) sepia(0.22) saturate(0.84) contrast(1.16) brightness(0.72);
        transform: scale(1.02);
      }

      .cover-ashen .cover-second {
        object-position: center 52%;
        opacity: 0.62;
        filter: grayscale(0.08) sepia(0.24) saturate(0.9) contrast(1.12) brightness(0.72);
        transform: scale(1.14);
      }

      .cover-ashen .cover-floor-glow {
        left: 30%;
        right: 30%;
        bottom: 17%;
        height: 20%;
      }

      .cover-openemotion .cover-base {
        object-position: center 34%;
        filter: grayscale(0.12) sepia(0.26) saturate(0.92) contrast(1.12) brightness(0.7);
        transform: scale(1.08);
      }

      .cover-openemotion .cover-second {
        object-position: center 48%;
        opacity: 0.2;
        filter: grayscale(0.08) sepia(0.18) saturate(0.76) contrast(1.04) brightness(0.58);
        transform: scale(1.1);
      }

      .cover-openemotion .cover-floor-glow {
        left: 30%;
        right: 30%;
        bottom: 15%;
        height: 16%;
      }
    `,
  );
}

function dossierHtml(kind) {
  const variants = {
    egocore: {
      left: remote.egoKnight,
      right: remote.ashenSword,
      className: "dossier-egocore",
    },
    "ashen-archive": {
      left: remote.heroCastleKeep,
      right: remote.ashenSword,
      className: "dossier-ashen",
    },
    openemotion: {
      left: remote.openTome,
      right: remote.openManuscript,
      className: "dossier-openemotion",
    },
  }[kind];

  const embers = emberMarkup(
    kind === "openemotion" ? 333 : kind === "ashen-archive" ? 222 : 111,
    32,
    {
      leftMin: 4,
      leftMax: 96,
      topMin: 10,
      topMax: 94,
      sizeMin: 3,
      sizeMax: 14,
      opacityMin: 0.08,
      opacityMax: 0.22,
      durationMin: 6,
      durationMax: 10,
    },
  );

  return buildDocument(
    `
      <section id="capture" class="capture dossier-v2 ${variants.className}">
        <div class="plaque-border"></div>
        <div class="dossier-panel dossier-main">
          <img src="${variants.left}" alt="" />
        </div>
        <div class="dossier-panel dossier-side">
          <img src="${variants.right}" alt="" />
        </div>
        <div class="dossier-panel dossier-inset dossier-inset-a"></div>
        <div class="dossier-panel dossier-inset dossier-inset-b"></div>
        <div class="ledger-line line-a"></div>
        <div class="ledger-line line-b"></div>
        <div class="ledger-line line-c"></div>
        <div class="ledger-node node-a"></div>
        <div class="ledger-node node-b"></div>
        <div class="ledger-node node-c"></div>
        <div class="ember-field">${embers}</div>
        <div class="grain"></div>
      </section>
    `,
    `
      .dossier-v2 {
        width: 1600px;
        height: 1200px;
        border-radius: 30px;
      }

      .dossier-main {
        left: 70px;
        top: 76px;
        width: 54%;
        height: 66%;
        z-index: 11;
      }

      .dossier-side {
        right: 70px;
        top: 118px;
        width: 32%;
        height: 44%;
        z-index: 11;
      }

      .dossier-inset {
        width: 170px;
        height: 170px;
        background:
          linear-gradient(180deg, rgba(13, 15, 19, 0.92), rgba(7, 8, 10, 0.98)),
          #07080a;
        z-index: 11;
      }

      .dossier-inset-a {
        right: 230px;
        bottom: 154px;
      }

      .dossier-inset-b {
        right: 70px;
        bottom: 84px;
      }

      .dossier-main img,
      .dossier-side img {
        filter: grayscale(0.14) sepia(0.2) saturate(0.84) contrast(1.12) brightness(0.72);
      }

      .ledger-line.line-a {
        left: 56%;
        top: 38%;
        width: 180px;
      }

      .ledger-line.line-b {
        left: 66%;
        top: 68%;
        width: 160px;
      }

      .ledger-line.line-c {
        left: 73%;
        top: 78%;
        width: 100px;
      }

      .ledger-node.node-a {
        left: 56%;
        top: 38%;
      }

      .ledger-node.node-b {
        left: 66%;
        top: 68%;
      }

      .ledger-node.node-c {
        left: 73%;
        top: 78%;
      }

      .dossier-egocore .dossier-main img {
        object-position: center 30%;
      }

      .dossier-egocore .dossier-side img {
        object-position: center 38%;
      }

      .dossier-ashen .dossier-main img {
        object-position: center 42%;
        filter: grayscale(0.16) sepia(0.26) saturate(0.74) contrast(1.12) brightness(0.66);
      }

      .dossier-ashen .dossier-side img {
        object-position: center 42%;
        filter: grayscale(0.14) sepia(0.24) saturate(0.86) contrast(1.12) brightness(0.7);
      }

      .dossier-openemotion .dossier-main img {
        object-position: center 34%;
      }

      .dossier-openemotion .dossier-side img {
        object-position: center 52%;
      }
    `,
  );
}

async function main() {
  const dragonDataUrl = localDataUrl("public/hero/abyss-dragon-silhouette.png", "image/png");
  const rearSmokeDataUrl = localDataUrl("public/atmosphere/smoke-veils-unsplash.jpg", "image/jpeg");
  const browser = await chromium.launch({ headless: true });

  const outputs = [
    {
      html: heroHtml(dragonDataUrl, rearSmokeDataUrl),
      out: "public/hero/abyss-hero-matte-v2.jpg",
      width: 1800,
      height: 1200,
      type: "jpeg",
      quality: 90,
      viewportWidth: 1900,
      viewportHeight: 1300,
    },
    {
      html: smokeHtml(),
      out: "public/atmosphere/smoke-band-v2.jpg",
      width: 1800,
      height: 640,
      type: "jpeg",
      quality: 88,
      viewportWidth: 1860,
      viewportHeight: 720,
    },
    {
      html: coverHtml("egocore"),
      out: "public/artifacts/egocore-cover-v2.jpg",
      width: 1200,
      height: 1500,
      type: "jpeg",
      quality: 90,
      viewportWidth: 1280,
      viewportHeight: 1580,
    },
    {
      html: coverHtml("ashen-archive"),
      out: "public/artifacts/ashen-archive-cover-v2.jpg",
      width: 1200,
      height: 1500,
      type: "jpeg",
      quality: 90,
      viewportWidth: 1280,
      viewportHeight: 1580,
    },
    {
      html: coverHtml("openemotion"),
      out: "public/artifacts/openemotion-cover-v2.jpg",
      width: 1200,
      height: 1500,
      type: "jpeg",
      quality: 90,
      viewportWidth: 1280,
      viewportHeight: 1580,
    },
    {
      html: dossierHtml("egocore"),
      out: "public/artifacts/egocore-dossier-v2.jpg",
      width: 1600,
      height: 1200,
      type: "jpeg",
      quality: 90,
      viewportWidth: 1680,
      viewportHeight: 1280,
    },
    {
      html: dossierHtml("ashen-archive"),
      out: "public/artifacts/ashen-archive-dossier-v2.jpg",
      width: 1600,
      height: 1200,
      type: "jpeg",
      quality: 90,
      viewportWidth: 1680,
      viewportHeight: 1280,
    },
    {
      html: dossierHtml("openemotion"),
      out: "public/artifacts/openemotion-dossier-v2.jpg",
      width: 1600,
      height: 1200,
      type: "jpeg",
      quality: 90,
      viewportWidth: 1680,
      viewportHeight: 1280,
    },
  ];

  for (const output of outputs) {
    await renderAsset(browser, output.html, output.out, output);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
