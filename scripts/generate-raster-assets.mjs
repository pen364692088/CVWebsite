import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

const root = process.cwd();

const assets = [
  { kind: "smoke-band", out: "public/atmosphere/smoke-band.jpg", width: 1800, height: 640, mime: "image/jpeg" },
  { kind: "ember-sprite", out: "public/atmosphere/ember-sprite.png", width: 192, height: 192, mime: "image/png" },
  { kind: "ash-sprite", out: "public/atmosphere/ash-sprite.png", width: 192, height: 192, mime: "image/png" },
  { kind: "ornament", out: "public/hero/abyss-ornament.png", width: 960, height: 180, mime: "image/png" },
  { kind: "dragon", out: "public/hero/abyss-dragon-silhouette.png", width: 1200, height: 520, mime: "image/png" },
  { kind: "egocore-diagram", out: "public/artifacts/egocore-diagram.jpg", width: 1600, height: 1200, mime: "image/jpeg" },
  { kind: "ashen-archive-diagram", out: "public/artifacts/ashen-archive-diagram.jpg", width: 1600, height: 1200, mime: "image/jpeg" },
  { kind: "openemotion-diagram", out: "public/artifacts/openemotion-diagram.jpg", width: 1600, height: 1200, mime: "image/jpeg" },
];

const pageSource = String.raw`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        background: transparent;
      }
      canvas {
        display: block;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas"></canvas>
    <script>
      const IVORY = [232, 220, 195];
      const GOLD = [196, 158, 96];
      const EMBER = [244, 132, 54];
      const EMBER2 = [255, 191, 108];

      function mulberry32(seed) {
        return function() {
          let t = seed += 0x6D2B79F5;
          t = Math.imul(t ^ t >>> 15, t | 1);
          t ^= t + Math.imul(t ^ t >>> 7, t | 61);
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
      }

      function hashString(input) {
        let hash = 2166136261;
        for (let i = 0; i < input.length; i += 1) {
          hash ^= input.charCodeAt(i);
          hash = Math.imul(hash, 16777619);
        }
        return hash >>> 0;
      }

      function rgb(parts, alpha = 1) {
        return "rgba(" + parts[0] + "," + parts[1] + "," + parts[2] + "," + alpha + ")";
      }

      function drawNoise(ctx, width, height, rng, alpha = 0.08) {
        ctx.save();
        for (let i = 0; i < 3400; i += 1) {
          const x = rng() * width;
          const y = rng() * height;
          const value = Math.floor(110 + rng() * 120);
          ctx.fillStyle = "rgba(" + value + "," + value + "," + value + "," + (alpha * rng()).toFixed(3) + ")";
          ctx.fillRect(x, y, 1, 1);
        }
        ctx.restore();
      }

      function fillBackground(ctx, width, height, rng) {
        const base = ctx.createLinearGradient(0, 0, 0, height);
        base.addColorStop(0, "rgb(14, 16, 20)");
        base.addColorStop(0.54, "rgb(18, 18, 24)");
        base.addColorStop(1, "rgb(8, 8, 10)");
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < 120; i += 1) {
          const x = rng() * width;
          const y = rng() * height;
          const radius = 90 + rng() * Math.min(width, height) * 0.12;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          const color = rng() > 0.4 ? [58, 34, 24] : [24, 34, 46];
          gradient.addColorStop(0, rgb(color, 0.15 + rng() * 0.09));
          gradient.addColorStop(1, rgb(color, 0));
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        drawNoise(ctx, width, height, rng, 0.05);
      }

      function vignette(ctx, width, height, strength = 0.72) {
        const gradient = ctx.createRadialGradient(width * 0.5, height * 0.46, Math.min(width, height) * 0.16, width * 0.5, height * 0.52, Math.max(width, height) * 0.76);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.72, "rgba(0,0,0," + strength.toFixed(2) + ")");
        gradient.addColorStop(1, "rgba(0,0,0,0.94)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      function strokePanel(ctx, x, y, width, height, radius = 22) {
        ctx.save();
        ctx.strokeStyle = "rgba(198, 166, 122, 0.44)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, radius);
        ctx.stroke();
        ctx.strokeStyle = "rgba(232, 220, 195, 0.09)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x + 18, y + 18, width - 36, height - 36, Math.max(12, radius - 8));
        ctx.stroke();
        ctx.restore();
      }

      function drawSmokeBlob(ctx, x, y, width, height, alpha) {
        ctx.save();
        ctx.filter = "blur(22px)";
        ctx.fillStyle = "rgba(188,190,194," + alpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function drawEmber(ctx, x, y, radius, alpha) {
        ctx.save();
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, "rgba(255,248,232," + (alpha * 0.95).toFixed(3) + ")");
        gradient.addColorStop(0.24, "rgba(255,198,124," + alpha.toFixed(3) + ")");
        gradient.addColorStop(0.62, "rgba(244,132,54," + (alpha * 0.7).toFixed(3) + ")");
        gradient.addColorStop(1, "rgba(244,132,54,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function drawOrnament(ctx, width, height) {
        const cy = height / 2;
        ctx.strokeStyle = "rgba(196,158,96,0.92)";
        ctx.lineWidth = 6;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowColor = "rgba(255,214,156,0.34)";
        ctx.shadowBlur = 16;

        function wing(direction) {
          ctx.beginPath();
          ctx.moveTo(width / 2 + direction * 18, cy);
          ctx.bezierCurveTo(width / 2 + direction * 96, cy - 40, width / 2 + direction * 124, cy - 54, width / 2 + direction * 172, cy - 24);
          ctx.bezierCurveTo(width / 2 + direction * 200, cy - 6, width / 2 + direction * 214, cy + 8, width / 2 + direction * 242, cy);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(width / 2 + direction * 44, cy + 6);
          ctx.bezierCurveTo(width / 2 + direction * 108, cy + 34, width / 2 + direction * 146, cy + 44, width / 2 + direction * 196, cy + 16);
          ctx.stroke();

          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(width / 2 + direction * 176, cy - 8, 28, direction > 0 ? Math.PI * 1.02 : -0.06, direction > 0 ? Math.PI * 1.64 : Math.PI * 0.64);
          ctx.stroke();
          ctx.lineWidth = 6;
        }

        wing(-1);
        wing(1);

        ctx.fillStyle = "rgba(234,226,210,0.8)";
        ctx.beginPath();
        ctx.moveTo(width / 2, cy - 22);
        ctx.lineTo(width / 2 + 22, cy);
        ctx.lineTo(width / 2, cy + 22);
        ctx.lineTo(width / 2 - 22, cy);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        for (let i = 0; i < 90; i += 1) {
          ctx.fillStyle = "rgba(255,228,184," + (0.05 + Math.random() * 0.08).toFixed(3) + ")";
          ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
        }
      }

      function drawDragon(ctx, width, height) {
        ctx.save();
        ctx.translate(width * 0.03, height * 0.02);
        ctx.fillStyle = "rgba(10, 11, 14, 0.82)";
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.moveTo(width * 0.45, height * 0.56);
        ctx.lineTo(width * 0.36, height * 0.42);
        ctx.lineTo(width * 0.28, height * 0.34);
        ctx.lineTo(width * 0.17, height * 0.28);
        ctx.lineTo(width * 0.08, height * 0.3);
        ctx.lineTo(width * 0.02, height * 0.38);
        ctx.lineTo(width * 0.08, height * 0.44);
        ctx.lineTo(width * 0.2, height * 0.46);
        ctx.lineTo(width * 0.3, height * 0.45);
        ctx.lineTo(width * 0.4, height * 0.47);
        ctx.lineTo(width * 0.48, height * 0.52);
        ctx.lineTo(width * 0.62, height * 0.32);
        ctx.lineTo(width * 0.76, height * 0.22);
        ctx.lineTo(width * 0.91, height * 0.23);
        ctx.lineTo(width * 0.98, height * 0.3);
        ctx.lineTo(width * 0.95, height * 0.38);
        ctx.lineTo(width * 0.86, height * 0.43);
        ctx.lineTo(width * 0.72, height * 0.44);
        ctx.lineTo(width * 0.63, height * 0.46);
        ctx.lineTo(width * 0.56, height * 0.49);
        ctx.lineTo(width * 0.6, height * 0.55);
        ctx.lineTo(width * 0.68, height * 0.62);
        ctx.lineTo(width * 0.76, height * 0.71);
        ctx.lineTo(width * 0.74, height * 0.78);
        ctx.lineTo(width * 0.66, height * 0.76);
        ctx.lineTo(width * 0.56, height * 0.66);
        ctx.lineTo(width * 0.48, height * 0.59);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(width * 0.49, height * 0.44);
        ctx.lineTo(width * 0.53, height * 0.34);
        ctx.lineTo(width * 0.57, height * 0.26);
        ctx.lineTo(width * 0.64, height * 0.24);
        ctx.lineTo(width * 0.67, height * 0.28);
        ctx.lineTo(width * 0.64, height * 0.33);
        ctx.lineTo(width * 0.6, height * 0.38);
        ctx.lineTo(width * 0.59, height * 0.43);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      function drawDiagramScene(ctx, width, height, mode, rng) {
        fillBackground(ctx, width, height, rng);
        strokePanel(ctx, 36, 36, width - 72, height - 72, 30);
        strokePanel(ctx, 90, 90, width - 180, height - 180, 26);

        if (mode === "egocore") {
          ctx.save();
          ctx.strokeStyle = "rgba(196,158,96,0.36)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.5, height * 0.25, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.5, height * 0.18, 0, Math.PI * 2);
          ctx.stroke();
          for (const x of [0.17, 0.5, 0.83]) {
            strokePanel(ctx, width * x - 140, height * 0.2, 280, height * 0.6, 22);
          }
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
            const x1 = width * 0.5 + Math.cos(angle) * height * 0.18;
            const y1 = height * 0.5 + Math.sin(angle) * height * 0.18;
            const x2 = width * 0.5 + Math.cos(angle) * height * 0.25;
            const y2 = height * 0.5 + Math.sin(angle) * height * 0.25;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "rgba(232,220,195,0.22)";
            ctx.stroke();
          }
          drawEmber(ctx, width * 0.5, height * 0.5, height * 0.09, 0.7);
          ctx.beginPath();
          ctx.moveTo(width * 0.28, height * 0.5);
          ctx.lineTo(width * 0.5, height * 0.5);
          ctx.lineTo(width * 0.72, height * 0.5);
          ctx.strokeStyle = "rgba(232,220,195,0.18)";
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        } else if (mode === "ashen-archive") {
          strokePanel(ctx, width * 0.14, height * 0.18, width * 0.72, height * 0.62, 28);
          ctx.save();
          ctx.strokeStyle = "rgba(232,220,195,0.24)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.4, height * 0.18, 0, Math.PI * 2);
          ctx.stroke();
          drawEmber(ctx, width * 0.5, height * 0.4, height * 0.075, 0.72);
          for (const box of [
            [width * 0.19, height * 0.55, width * 0.18, height * 0.22],
            [width * 0.41, height * 0.46, width * 0.18, height * 0.28],
            [width * 0.63, height * 0.55, width * 0.18, height * 0.22],
          ]) {
            strokePanel(ctx, box[0], box[1], box[2], box[3], 20);
          }
          ctx.beginPath();
          ctx.moveTo(width * 0.5, height * 0.47);
          ctx.lineTo(width * 0.5, height * 0.55);
          ctx.lineTo(width * 0.28, height * 0.55);
          ctx.moveTo(width * 0.5, height * 0.55);
          ctx.lineTo(width * 0.72, height * 0.55);
          ctx.strokeStyle = "rgba(232,220,195,0.18)";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        } else {
          ctx.save();
          ctx.strokeStyle = "rgba(196,158,96,0.34)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.45, height * 0.22, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 0.45, height * 0.15, 0, Math.PI * 2);
          ctx.stroke();
          drawEmber(ctx, width * 0.5, height * 0.45, height * 0.085, 0.68);
          for (const angle of [220, 258, 298, 342, 18, 58, 102, 146]) {
            const radians = angle * Math.PI / 180;
            const x = width * 0.5 + Math.cos(radians) * width * 0.22;
            const y = height * 0.45 + Math.sin(radians) * height * 0.18;
            ctx.beginPath();
            ctx.moveTo(width * 0.5, height * 0.45);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "rgba(232,220,195,0.14)";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 26, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(232,220,195,0.24)";
            ctx.stroke();
          }
          ctx.restore();
        }

        for (let i = 0; i < 120; i += 1) {
          drawEmber(ctx, rng() * width, rng() * height, 1.4 + rng() * 4, 0.12 + rng() * 0.22);
        }
        vignette(ctx, width, height, 0.68);
      }

      function render(kind, width, height) {
        const canvas = document.getElementById("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        const rng = mulberry32(hashString(kind));

        ctx.clearRect(0, 0, width, height);

        if (kind === "smoke-band") {
          ctx.fillStyle = "rgb(0,0,0)";
          ctx.fillRect(0, 0, width, height);
          for (let i = 0; i < 110; i += 1) {
            drawSmokeBlob(
              ctx,
              rng() * width,
              height * (0.48 + rng() * 0.48),
              120 + rng() * 240,
              34 + rng() * 76,
              0.055 + rng() * 0.095,
            );
          }
          for (let i = 0; i < 34; i += 1) {
            drawEmber(ctx, rng() * width, height * (0.6 + rng() * 0.36), 10 + rng() * 28, 0.12 + rng() * 0.18);
          }
        } else if (kind === "ember-sprite") {
          drawEmber(ctx, width * 0.5, height * 0.5, width * 0.34, 0.9);
          for (let i = 0; i < 18; i += 1) {
            drawEmber(ctx, width * (0.2 + rng() * 0.6), height * (0.18 + rng() * 0.6), 3 + rng() * 10, 0.16 + rng() * 0.36);
          }
        } else if (kind === "ash-sprite") {
          ctx.save();
          ctx.filter = "blur(1.6px)";
          for (let i = 0; i < 48; i += 1) {
            const x = width * (0.1 + rng() * 0.8);
            const y = height * (0.1 + rng() * 0.8);
            const radius = 1 + rng() * 8;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, "rgba(220,220,220," + (0.16 + rng() * 0.2).toFixed(3) + ")");
            gradient.addColorStop(1, "rgba(220,220,220,0)");
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else if (kind === "ornament") {
          drawOrnament(ctx, width, height);
        } else if (kind === "dragon") {
          drawDragon(ctx, width, height);
        } else if (kind.endsWith("-diagram")) {
          drawDiagramScene(ctx, width, height, kind.replace("-diagram", ""), rng);
        }

        const asJpeg = kind === "smoke-band" || kind.endsWith("-diagram");
        return canvas.toDataURL(asJpeg ? "image/jpeg" : "image/png", 0.9);
      }

      window.renderAsset = render;
    </script>
  </body>
</html>
`;

function decodeDataUrl(dataUrl) {
  const payload = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Buffer.from(payload, "base64");
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(pageSource);

  for (const asset of assets) {
    const dataUrl = await page.evaluate(
      ({ kind, width, height }) => window.renderAsset(kind, width, height),
      { kind: asset.kind, width: asset.width, height: asset.height },
    );

    const output = path.join(root, asset.out);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, decodeDataUrl(dataUrl));
    console.log(`generated ${asset.out}`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
