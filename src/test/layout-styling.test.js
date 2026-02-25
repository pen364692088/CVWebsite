// Test retro-futurism layout styling
import { strict as assert } from 'node:assert';

// Load and parse global.css
import { readFileSync } from 'node:fs';
const cssContent = readFileSync('./src/styles/global.css', 'utf8');

// Load and parse BaseLayout.astro
const layoutContent = readFileSync('./src/layouts/BaseLayout.astro', 'utf8');

console.log('Testing retro-futurism layout styling...');

// Test 1: Verify cyber grid background is present
assert(cssContent.includes('.cyber-grid-background'), 'Missing cyber grid background class');
assert(cssContent.includes('background-image'), 'Missing background image for cyber grid');
assert(cssContent.includes('linear-gradient(var(--accent-soft) 1px, transparent 1px)'), 'Missing cyber grid gradient');
console.log('✓ Cyber grid background styling implemented');

// Test 2: Verify cyber grid animation
assert(cssContent.includes('@keyframes grid-pulse'), 'Missing grid pulse animation');
assert(cssContent.includes('animation: grid-pulse'), 'Missing grid pulse animation application');
console.log('✓ Cyber grid animation implemented');

// Test 3: Verify retro-futurism card styling
assert(cssContent.includes('.card::before'), 'Missing card gradient overlay');
assert(cssContent.includes('linear-gradient(45deg, var(--accent), var(--accent-secondary), var(--accent))'), 'Missing retro-futurism card gradient');
assert(cssContent.includes('box-shadow') && cssContent.includes('var(--accent-soft)'), 'Missing retro-futurism card glow');
console.log('✓ Retro-futurism card styling implemented');

// Test 4: Verify retro-futurism button styling
assert(cssContent.includes('.btn::before'), 'Missing button scanline effect');
assert(cssContent.includes('background: linear-gradient(90deg, transparent, var(--accent-soft), transparent)'), 'Missing button scanline gradient');
console.log('✓ Retro-futurism button styling implemented');

// Test 5: Verify retro-futurism heading styling
assert(cssContent.includes('background: linear-gradient(135deg, var(--text), var(--accent))'), 'Missing heading gradient');
assert(cssContent.includes('background-clip: text'), 'Missing text background clipping');
assert(cssContent.includes('-webkit-text-fill-color: transparent'), 'Missing transparent text fill');
assert(cssContent.includes('h1::after'), 'Missing heading underline effect');
assert(cssContent.includes('background: linear-gradient(90deg, var(--accent), var(--accent-secondary))'), 'Missing heading underline gradient');
console.log('✓ Retro-futurism heading styling implemented');

// Test 6: Verify cyber grid is included in BaseLayout
assert(layoutContent.includes('cyber-grid-background'), 'Cyber grid not included in BaseLayout');
assert(layoutContent.includes('<div class="cyber-grid-background"></div>'), 'Cyber grid div not found in BaseLayout');
console.log('✓ Cyber grid integrated into BaseLayout');

// Test 7: Verify semantic HTML structure is preserved
assert(layoutContent.includes('<html lang="en">'), 'Missing HTML lang attribute');
assert(layoutContent.includes('<head>'), 'Missing head element');
assert(layoutContent.includes('<body>'), 'Missing body element');
assert(layoutContent.includes('<main'), 'Missing main element');
assert(layoutContent.includes('Nav />'), 'Missing nav component');
assert(layoutContent.includes('Footer />'), 'Missing footer component');
console.log('✓ Semantic HTML structure preserved');

// Test 8: Verify accessibility features maintained
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Missing reduced motion media query');
assert(cssContent.includes('animation-duration: 0.01ms !important'), 'Missing reduced motion animation override');
console.log('✓ Accessibility features maintained');

console.log('\n✅ All retro-futurism layout styling tests passed!');