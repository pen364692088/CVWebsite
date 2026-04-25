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

for (const locale of ["en", "zh-CN", "ja", "ko"]) {
  const html = read(`out/${locale}/index.html`);
  assert(html.includes('id="kv"'), `Missing kv section in ${locale}`);
  assert(html.includes('id="works_intro"'), `Missing works_intro section in ${locale}`);
  assert(html.includes('id="works"'), `Missing works section in ${locale}`);
  assert(html.includes('id="works_cards"'), `Missing works_cards section in ${locale}`);
  assert(html.includes('id="works_outro"'), `Missing works_outro section in ${locale}`);
  assert(html.includes('id="mission_in"'), `Missing mission_in section in ${locale}`);
  assert(html.includes('id="outro"'), `Missing outro section in ${locale}`);
  assert(html.includes("MOONFLOW"), `Missing MOONFLOW wordmark in ${locale}`);
  assert(html.includes("data-top_section=\"kv\""), `Missing kv data-top_section marker in ${locale}`);
  assert(html.includes("data-top_section=\"works_intro\""), `Missing works_intro data-top_section marker in ${locale}`);
  assert(html.includes("data-top_section=\"works\""), `Missing works data-top_section marker in ${locale}`);
  assert(html.includes("data-top_section=\"works_cards\""), `Missing works_cards data-top_section marker in ${locale}`);
  assert(html.includes("data-top_section=\"works_outro\""), `Missing works_outro data-top_section marker in ${locale}`);
  assert(html.includes("data-top_section=\"mission_in\""), `Missing mission_in data-top_section marker in ${locale}`);
  assert(html.includes("data-top_section=\"outro\""), `Missing outro data-top_section marker in ${locale}`);
  assert(html.includes("data-mission-transition"), `Missing mission transition overlay in ${locale}`);
  assert(html.includes("data-mission-panel"), `Missing mission panel in ${locale}`);
  assert(html.includes("data-endmark-footer"), `Missing endmark footer overlay in ${locale}`);
  assert(html.includes("data-endmark-footer-progress"), `Missing endmark footer progress marker in ${locale}`);
  assert(html.includes("data-endmark-footer-visible"), `Missing endmark footer visible marker in ${locale}`);
  assert(!html.includes("data-mission-outline"), `Unexpected mission outline in ${locale}`);
  assert(!html.includes("data-top-scroll-indicator"), `Unexpected top scroll indicator in ${locale}`);
}

console.log("Static export verification passed.");
