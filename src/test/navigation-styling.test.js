// Test retro-futurism navigation styling
import { strict as assert } from 'node:assert';

// Load and parse global.css
import { readFileSync } from 'node:fs';
const cssContent = readFileSync('./src/styles/global.css', 'utf8');

// Load and parse Nav.astro
const navContent = readFileSync('./src/components/Nav.astro', 'utf8');

console.log('Testing retro-futurism navigation styling...');

// Test 1: Verify retro-futurism navigation wrapper styling
assert(cssContent.includes('.nav-wrap') || navContent.includes('.nav-wrap'), 'Missing nav-wrap class');
assert(navContent.includes('backdrop-filter: blur(12px)'), 'Missing backdrop filter for navigation');
assert(navContent.includes('background: color-mix(in srgb, var(--surface)'), 'Missing retro-futurism navigation background');
assert(navContent.includes('box-shadow') && navContent.includes('rgba(0, 217, 255, 0.3)'), 'Missing retro-futurism navigation glow');
console.log('✓ Retro-futurism navigation wrapper styling implemented');

// Test 2: Verify retro-futurism brand styling
assert(navContent.includes('.brand'), 'Missing brand class');
assert(navContent.includes('background: linear-gradient(135deg, var(--text), var(--accent))'), 'Missing brand gradient');
assert(navContent.includes('background-clip: text'), 'Missing brand text clipping');
assert(navContent.includes('-webkit-text-fill-color: transparent'), 'Missing brand transparent text');
assert(navContent.includes('.brand::after'), 'Missing brand underline effect');
console.log('✓ Retro-futurism brand styling implemented');

// Test 3: Verify retro-futurism navigation link styling
assert(navContent.includes('a::before'), 'Missing navigation link scanline effect');
assert(navContent.includes('background: linear-gradient(90deg, transparent, var(--accent-soft), transparent)'), 'Missing navigation link scanline gradient');
assert(navContent.includes('a:hover'), 'Missing navigation link hover effects');
assert(navContent.includes('box-shadow: 0 0 12px rgba(0, 217, 255, 0.3)'), 'Missing navigation link hover glow');
console.log('✓ Retro-futurism navigation link styling implemented');

// Test 4: Verify retro-futurism active link styling
assert(navContent.includes('a.active'), 'Missing active link styling');
assert(navContent.includes('background: color-mix(in srgb, var(--accent-soft)'), 'Missing active link background');
assert(navContent.includes('box-shadow:') && navContent.includes('inset 0 0 8px rgba(0, 217, 255, 0.2)'), 'Missing active link inset glow');
assert(navContent.includes('a.active::after'), 'Missing active link indicator');
assert(navContent.includes('background: linear-gradient(90deg, var(--accent), var(--accent-secondary))'), 'Missing active link indicator gradient');
console.log('✓ Retro-futurism active link styling implemented');

// Test 5: Verify mobile responsiveness
assert(navContent.includes('@media (max-width: 700px)'), 'Missing mobile responsiveness media query');
assert(navContent.includes('flex-direction: column'), 'Missing mobile flex direction');
assert(navContent.includes('justify-content: flex-start'), 'Missing mobile alignment');
console.log('✓ Mobile responsiveness preserved');

// Test 6: Verify accessibility features maintained
assert(navContent.includes('@media (prefers-reduced-motion: reduce)'), 'Missing reduced motion media query in navigation');
assert(navContent.includes('transition-duration: 0.01ms !important'), 'Missing reduced motion transition override');
console.log('✓ Accessibility features maintained');

// Test 7: Verify semantic HTML structure
assert(navContent.includes('<header'), 'Missing header element');
assert(navContent.includes('<nav aria-label="Main navigation"'), 'Missing nav element with aria-label');
assert(navContent.includes('<ul>'), 'Missing unordered list');
assert(navContent.includes('aria-current='), 'Missing aria-current attribute');
console.log('✓ Semantic HTML structure preserved');

console.log('\n✅ All retro-futurism navigation styling tests passed!');