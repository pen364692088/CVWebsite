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
  "out/media/work-collection-of-ta.mp4",
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
  assert(html.includes('id="fire"'), `Missing mini game anchor in ${locale}`);
  assert(html.includes('id="artifacts"'), `Missing artifacts anchor in ${locale}`);
  assert(html.includes("archive-relic-stage"), `Missing relic stage shell in ${locale}`);
  assert(html.includes("archive-diagnostic-rail"), `Missing diagnostic rail in ${locale}`);
  assert(html.includes("work-collection-of-ta.mp4"), `Missing featured media in ${locale}`);
}

console.log("Static export verification passed.");
