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
];

for (const file of expectedFiles) {
  assert(exists(file), `Missing exported file: ${file}`);
}

const rootHtml = read("out/index.html");
assert(rootHtml.includes("Choosing your entry path."), "Root locale gateway text missing");

const expectedIdentity = {
  en: "Zhouyu Liao",
  "zh-CN": "Zhouyu Liao",
  ja: "Zhouyu Liao",
  ko: "Zhouyu Liao",
};

for (const locale of ["en", "zh-CN", "ja", "ko"]) {
  const html = read(`out/${locale}/index.html`);
  assert(html.includes(expectedIdentity[locale]), `Missing personal identity in ${locale}`);
  assert(html.includes('id="hero"'), `Missing hero phase in ${locale}`);
  assert(html.includes('id="works"'), `Missing works phase in ${locale}`);
  assert(html.includes('id="about"'), `Missing about phase in ${locale}`);
  assert(html.includes('id="stella"'), `Missing stella phase in ${locale}`);
  assert(html.includes('id="contact"'), `Missing contact phase in ${locale}`);
  assert(html.includes("ALCHE"), `Missing ALCHE wordmark in ${locale}`);
  assert(html.includes("TOP PAGE RUNTIME"), `Missing HUD title in ${locale}`);
}

console.log("Static export verification passed.");
