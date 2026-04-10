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
  "out/reference-crops/dark-fantasy-pack/ornament-wide.png",
  "out/reference-crops/dark-fantasy-pack/knight.png",
  "out/reference-crops/dark-fantasy-pack/book.png",
  "out/reference-crops/dark-fantasy-pack/flame-sword-altar.png",
  "out/artifacts/egocore-dossier-v3.png",
  "out/artifacts/ashen-archive-dossier-v3.png",
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
  assert(html.includes(expectedIdentity[locale]), `Missing personal identity in ${locale}`);
  assert(html.includes("流月工作室"), `Missing studio brand in ${locale}`);
  assert(html.includes('class="experience-root"'), `Missing experience root in ${locale}`);
  assert(html.includes('id="threshold"'), `Missing threshold chapter in ${locale}`);
  assert(html.includes('id="egocore"'), `Missing EgoCore chapter anchor in ${locale}`);
  assert(html.includes('id="ashen-archive"'), `Missing Ashen Archive chapter anchor in ${locale}`);
  assert(html.includes('id="openemotion"'), `Missing OpenEmotion chapter anchor in ${locale}`);
  assert(html.includes('id="contact-coda"'), `Missing contact coda chapter anchor in ${locale}`);
  assert(html.includes("EgoCore"), `Missing EgoCore artifact in ${locale}`);
  assert(html.includes("OpenEmotion"), `Missing OpenEmotion artifact in ${locale}`);
}

console.log("Static export verification passed.");
