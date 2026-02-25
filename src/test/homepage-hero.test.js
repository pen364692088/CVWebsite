// Test homepage hero section retro-futurism styling
import { strict as assert } from 'node:assert';

// Load and parse global.css
import { readFileSync } from 'node:fs';
const cssContent = readFileSync('./src/styles/global.css', 'utf8');

// Test 1: Verify hero section styling exists
console.log('Testing hero section styling...');
assert(cssContent.includes('.hero {'), 'Missing hero section styles');
assert(cssContent.includes('.hero::before'), 'Missing hero background gradient');
assert(cssContent.includes('hero-glow'), 'Missing hero glow animation');
console.log('✓ Hero section styling present');

// Test 2: Verify retro-futurism eyebrow styling
console.log('\nTesting hero eyebrow styling...');
assert(cssContent.includes('.hero .eyebrow'), 'Missing hero eyebrow specific styles');
assert(cssContent.includes('background: linear-gradient(135deg, var(--accent), var(--accent-secondary))'), 'Missing eyebrow gradient');
assert(cssContent.includes('background-clip: text'), 'Missing eyebrow background-clip');
console.log('✓ Hero eyebrow retro-futurism styling present');

// Test 3: Verify hero h1 styling
console.log('\nTesting hero h1 styling...');
assert(cssContent.includes('.hero h1'), 'Missing hero h1 specific styles');
assert(cssContent.includes('background: linear-gradient(135deg, var(--text), var(--accent), var(--accent-secondary))'), 'Missing hero h1 gradient');
assert(cssContent.includes('scanline'), 'Missing hero h1 scanline animation');
console.log('✓ Hero h1 retro-futurism styling present');

// Test 4: Verify hero paragraph styling
console.log('\nTesting hero paragraph styling...');
assert(cssContent.includes('.hero p'), 'Missing hero paragraph specific styles');
assert(cssContent.includes('.hero p::before'), 'Missing hero paragraph accent line');
console.log('✓ Hero paragraph retro-futurism styling present');

// Test 5: Verify retro-futurism button styling
console.log('\nTesting button styling...');
assert(cssContent.includes('.btn {'), 'Missing button base styles');
assert(cssContent.includes('box-shadow:'), 'Missing button glow effects');
assert(cssContent.includes('var(--accent)'), 'Missing accent color usage in buttons');
assert(cssContent.includes('var(--accent-secondary)'), 'Missing secondary accent color usage in buttons');
console.log('✓ Button retro-futurism styling present');

// Test 6: Verify metrics section styling
console.log('\nTesting metrics section styling...');
assert(cssContent.includes('.metrics'), 'Missing metrics section styles');
assert(cssContent.includes('.metric::before'), 'Missing metrics hover effects');
assert(cssContent.includes('.metric strong'), 'Missing metrics strong element styling');
console.log('✓ Metrics section retro-futurism styling present');

// Test 7: Verify accessibility features preserved
console.log('\nTesting accessibility features...');
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Missing reduced motion media query');
console.log('✓ Accessibility features preserved');

console.log('\n✅ All homepage hero styling tests passed!');