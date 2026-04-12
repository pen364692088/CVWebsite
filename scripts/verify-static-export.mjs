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
  assert(html.includes("ALCHE"), `Missing ALCHE wordmark in ${locale}`);
  assert(html.includes("data-top_section=\"kv\""), `Missing kv data-top_section marker in ${locale}`);
  assert(!html.includes('id="works_intro"'), `Unexpected works_intro section in ${locale}`);
  assert(!html.includes("data-top-scroll-indicator"), `Unexpected top scroll indicator in ${locale}`);
}

console.log("Static export verification passed.");
