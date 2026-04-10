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
  "out/showcase/triangle-grid-wide.jpg",
  "out/showcase/triangle-grid-crop-left.jpg",
  "out/showcase/triangle-grid-crop-right.jpg",
  "out/showcase/triangle-grid-crop-center.jpg",
  "out/showcase/a-spectrum-white.jpg",
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
  assert(html.includes('class="showcase-root"'), `Missing showcase root in ${locale}`);
  assert(html.includes('id="hero-wordmark"'), `Missing hero-wordmark chapter in ${locale}`);
  assert(html.includes('id="discipline-strip"'), `Missing discipline-strip chapter in ${locale}`);
  assert(html.includes('id="showcase-wall"'), `Missing showcase-wall chapter in ${locale}`);
  assert(html.includes('id="manifesto-inversion"'), `Missing manifesto-inversion chapter in ${locale}`);
  assert(html.includes('id="selected-work"'), `Missing selected-work chapter in ${locale}`);
  assert(html.includes('id="contact-coda"'), `Missing contact coda chapter anchor in ${locale}`);
  assert(html.includes("ASHEN"), `Missing ASHEN wordmark in ${locale}`);
  assert(html.includes("ARCHIVE"), `Missing ARCHIVE wordmark in ${locale}`);
}

console.log("Static export verification passed.");
