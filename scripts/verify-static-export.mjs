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
  assert(html.includes('id="kv"'), `Missing kv section in ${locale}`);
  assert(html.includes('id="works_intro"'), `Missing works_intro section in ${locale}`);
  assert(html.includes('id="works"'), `Missing works phase in ${locale}`);
  assert(html.includes('id="works_outro"'), `Missing works_outro section in ${locale}`);
  assert(html.includes('id="mission_in"'), `Missing mission_in section in ${locale}`);
  assert(html.includes('id="mission"'), `Missing mission section in ${locale}`);
  assert(html.includes('id="vision"'), `Missing vision section in ${locale}`);
  assert(html.includes('id="vision_out"'), `Missing vision_out section in ${locale}`);
  assert(html.includes('id="service_in"'), `Missing service_in section in ${locale}`);
  assert(html.includes('id="service"'), `Missing service section in ${locale}`);
  assert(html.includes('id="stellla"'), `Missing stellla section in ${locale}`);
  assert(html.includes('id="outro"'), `Missing outro section in ${locale}`);
  assert(html.includes("ALCHE"), `Missing ALCHE wordmark in ${locale}`);
  assert(html.includes("TOP PAGE RUNTIME"), `Missing runtime HUD in ${locale}`);
  assert(html.includes("data-top-scroll-indicator"), `Missing top scroll indicator in ${locale}`);
  assert(html.includes("data-top_section=\"works_intro\""), `Missing data-top_section markers in ${locale}`);
  assert(html.includes("News"), `Missing News rail in ${locale}`);
}

console.log("Static export verification passed.");
