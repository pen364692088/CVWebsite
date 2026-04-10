const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
  await page.goto('http://127.0.0.1:4173/CVWebsite/en/', { waitUntil: 'networkidle' });

  const data = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('.abyss-reference-stage img'));
    return imgs.map((img, idx) => {
      const cs = getComputedStyle(img);
      const rect = img.getBoundingClientRect();
      return {
        idx: idx + 1,
        src: img.getAttribute('src'),
        className: img.className,
        natural: img.naturalWidth + 'x' + img.naturalHeight,
        rendered: Math.round(rect.width) + 'x' + Math.round(rect.height),
        ratioNatural: Number((img.naturalWidth / (img.naturalHeight || 1)).toFixed(3)),
        ratioRendered: Number((rect.width / (rect.height || 1)).toFixed(3)),
        objectFit: cs.objectFit || img.style.objectFit || 'inline',
      };
    });
  });

  for (const row of data) {
    const delta = Math.abs(row.ratioNatural - row.ratioRendered);
    const warn = delta > 0.25 ? '⚠' : ' ';
    console.log(warn + ' #' + row.idx + ' ' + row.src);
    console.log('  class=' + row.className);
    console.log('  natural=' + row.natural + ' rendered=' + row.rendered + ' naturalRatio=' + row.ratioNatural + ' renderedRatio=' + row.ratioRendered + ' objectFit=' + row.objectFit);
  }

  await browser.close();
})();
