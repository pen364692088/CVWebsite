import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), "utf8");
}

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

const expectedFiles = [
  "out/index.html",
  "out/en/index.html",
  "out/zh-CN/index.html",
  "out/ja/index.html",
  "out/ko/index.html",
  "out/hero/abyss-hero-matte-v2.jpg",
  "out/hero/abyss-dragon-silhouette.png",
  "out/hero/abyss-ornament.png",
  "out/atmosphere/smoke-band-v2.jpg",
  "out/atmosphere/ember-sprite.png",
  "out/atmosphere/ash-sprite.png",
  "out/artifacts/egocore-cover-v2.jpg",
  "out/artifacts/egocore-dossier-v2.jpg",
  "out/artifacts/ashen-archive-cover-v2.jpg",
  "out/artifacts/ashen-archive-dossier-v2.jpg",
  "out/artifacts/openemotion-cover-v2.jpg",
  "out/artifacts/openemotion-dossier-v2.jpg",
];

for (const file of expectedFiles) {
  assert(exists(file), `Missing exported file: ${file}`);
}

const rootHtml = read("out/index.html");
assert(rootHtml.includes("Choosing your entry path."), "Root locale gateway text missing");

const expectedIdentity = {
  en: "Zhouyu Liao",
  "zh-CN": "周宇辽",
  ja: "Zhouyu Liao",
  ko: "Zhouyu Liao",
};

for (const locale of ["en", "zh-CN", "ja", "ko"]) {
  const html = read(`out/${locale}/index.html`);
  assert(html.includes("Ashen Archive"), `Missing site title in ${locale}`);
  assert(html.includes(expectedIdentity[locale]), `Missing personal identity in ${locale}`);
  assert(html.includes("流月工作室"), `Missing studio brand in ${locale}`);
  assert(html.includes('class="abyss-hero"'), `Missing abyss hero shell in ${locale}`);
  assert(html.includes('id="fire"'), `Missing mini game anchor in ${locale}`);
  assert(html.includes('id="artifacts"'), `Missing artifacts anchor in ${locale}`);
  assert(html.includes("relic-altar-card"), `Missing ritual relic cards in ${locale}`);
  assert(html.includes("sigil-filter-grid"), `Missing ritual strip in ${locale}`);
  assert(html.includes("EgoCore"), `Missing EgoCore artifact in ${locale}`);
  assert(html.includes("OpenEmotion"), `Missing OpenEmotion artifact in ${locale}`);
}

console.log("Static export verification passed.");
