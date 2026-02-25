#!/usr/bin/env node

/**
 * Screenshot capture script for Astro CV Website
 * This script documents the screenshot capture process for before/after comparisons
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PAGES = [
  { name: 'Home', url: '/index.html', description: 'Main landing page with hero section' },
  { name: 'About', url: '/about/index.html', description: 'About page with biography and skills' },
  { name: 'Projects', url: '/projects/index.html', description: 'Projects showcase with cards' },
  { name: 'Contact', url: '/contact/index.html', description: 'Contact form and information' },
  { name: 'Resume', url: '/resume/index.html', description: 'Resume/CV page' }
];

const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

// Create screenshot documentation
function generateScreenshotDocumentation() {
  const timestamp = new Date().toISOString().split('T')[0];
  
  const doc = {
    timestamp,
    pages: PAGES.map(page => ({
      ...page,
      before: `${page.name.toLowerCase()}-before-${timestamp}.png`,
      after: `${page.name.toLowerCase()}-after-${timestamp}.png`,
      status: 'pending'
    })),
    instructions: {
      before: 'Capture screenshots of current state before implementing redesign',
      after: 'Capture screenshots after retro-futurism redesign is complete',
      requirements: [
        'Use 1920x1080 viewport',
        'Capture full page screenshots',
        'Save as PNG format',
        'Store in docs/screenshots directory'
      ]
    }
  };

  return doc;
}

// Main execution
function main() {
  console.log('📸 Screenshot Capture Documentation Generator');
  console.log('=============================================\n');

  // Create screenshots directory
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    console.log('✅ Created screenshots directory:', SCREENSHOT_DIR);
  }

  // Generate documentation
  const doc = generateScreenshotDocumentation();
  
  // Save documentation
  const docPath = path.join(SCREENSHOT_DIR, 'screenshot-manifest.json');
  fs.writeFileSync(docPath, JSON.stringify(doc, null, 2));
  console.log('✅ Created screenshot manifest:', docPath);

  // Generate README
  const readme = `# Screenshots Documentation

## Before/After Screenshot Capture

This directory contains screenshot documentation for the retro-futurism redesign.

### Pages to Capture

${PAGES.map(page => `- **${page.name}**: ${page.url} - ${page.description}`).join('\n')}

### Capture Instructions

1. **Before Capture** (Current State):
   - Run \`npm run build\`
   - Serve the dist folder locally
   - Capture screenshots of all pages
   - Save as: \`<page>-before-YYYY-MM-DD.png\`

2. **After Capture** (Redesign Complete):
   - Run \`npm run build\` after redesign
   - Serve the dist folder locally  
   - Capture screenshots of all pages
   - Save as: \`<page>-after-YYYY-MM-DD.png\`

### Requirements

- Viewport: 1920x1080
- Format: PNG
- Full page screenshots
- Store in this directory

### Status

Generated: ${doc.timestamp}
Status: ${doc.pages.every(p => p.status === 'pending') ? 'Pending Capture' : 'Partially Complete'}
`;

  const readmePath = path.join(SCREENSHOT_DIR, 'README.md');
  fs.writeFileSync(readmePath, readme);
  console.log('✅ Created README:', readmePath);

  console.log('\n📋 Next Steps:');
  console.log('1. Serve the built site: npx serve dist');
  console.log('2. Capture before screenshots of all pages');
  console.log('3. Implement the retro-futurism redesign');
  console.log('4. Capture after screenshots of all pages');
  console.log('5. Update docs/assets-sources.md with screenshot information');
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}

export { generateScreenshotDocumentation, PAGES };