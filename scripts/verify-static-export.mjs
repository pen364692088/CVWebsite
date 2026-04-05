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
  "out/hero/echoes-abyss-stage-v1.png",
  "out/hero/abyss-ornament-v2.png",
  "out/atmosphere/ember-sprite.png",
  "out/atmosphere/ash-sprite.png",
  "out/artifacts/egocore-cover-v3.png",
  "out/artifacts/egocore-dossier-v3.png",
  "out/artifacts/ashen-archive-cover-v3.png",
  "out/artifacts/ashen-archive-dossier-v3.png",
  "out/artifacts/openemotion-cover-v3.png",
  "out/artifacts/openemotion-dossier-v3.png",
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
  assert(html.includes("Echoes of the Abyss"), `Missing hero title in ${locale}`);
  assert(html.includes(expectedIdentity[locale]), `Missing personal identity in ${locale}`);
  assert(html.includes("流月工作室"), `Missing studio brand in ${locale}`);
  assert(html.includes('class="abyss-reference-stage"'), `Missing reference-aligned hero stage in ${locale}`);
  assert(html.includes('id="fire"'), `Missing mini game anchor in ${locale}`);
  assert(html.includes('id="artifacts"'), `Missing artifacts anchor in ${locale}`);
  assert(html.includes("abyss-stage-card"), `Missing staged ritual card hotspots in ${locale}`);
  assert(html.includes("abyss-stage-ritual"), `Missing ritual strip hotspots in ${locale}`);
  assert(html.includes("EgoCore"), `Missing EgoCore artifact in ${locale}`);
  assert(html.includes("OpenEmotion"), `Missing OpenEmotion artifact in ${locale}`);
}

console.log("Static export verification passed.");
