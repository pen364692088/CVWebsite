// Test retro-futurism color system
import { strict as assert } from 'node:assert';

// Simulate CSS custom properties extraction
function getCSSVariables(css) {
  const variables = {};
  const rootMatch = css.match(/:root\s*{([^}]+)}/s);
  if (rootMatch) {
    const rootContent = rootMatch[1];
    const varMatches = rootContent.matchAll(/--([a-zA-Z0-9-]+):\s*([^;]+);/g);
    for (const match of varMatches) {
      variables[match[1]] = match[2].trim();
    }
  }
  return variables;
}

// Load and parse global.css
import { readFileSync } from 'node:fs';
const cssContent = readFileSync('./src/styles/global.css', 'utf8');
const cssVars = getCSSVariables(cssContent);

// Test 1: Verify retro-futurism color variables exist
const requiredColors = [
  'bg',
  'bg-secondary', 
  'surface',
  'surface-hover',
  'text',
  'text-secondary',
  'muted',
  'accent',
  'accent-hover',
  'accent-secondary',
  'accent-secondary-hover',
  'accent-soft',
  'accent-secondary-soft',
  'line',
  'success',
  'warning',
  'error'
];

console.log('Testing color variables...');
for (const color of requiredColors) {
  assert(cssVars[color], `Missing color variable: --${color}`);
  console.log(`✓ --${color}: ${cssVars[color]}`);
}

// Test 2: Verify dark theme colors (lower brightness values)
const bgColors = [
  { name: 'bg', value: cssVars['bg'] },
  { name: 'bg-secondary', value: cssVars['bg-secondary'] },
  { name: 'surface', value: cssVars['surface'] }
];

console.log('\nTesting dark theme colors...');
for (const color of bgColors) {
  // Extract hex value and convert to RGB
  const hex = color.value.match(/#([0-9a-fA-F]{6})/)?.[1];
  if (hex) {
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    assert(brightness < 128, `${color.name} should be dark (brightness: ${brightness.toFixed(2)})`);
    console.log(`✓ ${color.name} is dark enough (brightness: ${brightness.toFixed(2)})`);
  }
}

// Test 3: Verify neon/cyberpunk accent colors
const neonColors = [
  { name: 'accent', value: cssVars['accent'] },
  { name: 'accent-secondary', value: cssVars['accent-secondary'] }
];

console.log('\nTesting neon accent colors...');
for (const color of neonColors) {
  const hex = color.value.match(/#([0-9a-fA-F]{6})/)?.[1];
  if (hex) {
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    // Neon colors should have high saturation
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;
    assert(saturation > 0.5, `${color.name} should be highly saturated (saturation: ${saturation.toFixed(2)})`);
    console.log(`✓ ${color.name} is saturated enough (saturation: ${saturation.toFixed(2)})`);
  }
}

// Test 4: Verify prefers-reduced-motion is preserved
console.log('\nTesting reduced motion support...');
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Missing reduced motion media query');
console.log('✓ prefers-reduced-motion media query preserved');

// Test 5: Verify accessibility contrast ratios (basic check)
console.log('\nTesting contrast ratios...');
const textPrimary = cssVars['text'];
const bgPrimary = cssVars['bg'];

// Simple contrast check - text should be significantly different from background
function getLuminance(hex) {
  const match = hex.match(/#([0-9a-fA-F]{6})/)?.[1];
  if (!match) return 0;
  const r = parseInt(match.substr(0, 2), 16) / 255;
  const g = parseInt(match.substr(2, 2), 16) / 255;
  const b = parseInt(match.substr(4, 2), 16) / 255;
  
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
}

const textLum = getLuminance(textPrimary);
const bgLum = getLuminance(bgPrimary);
const contrast = (Math.max(textLum, bgLum) + 0.05) / (Math.min(textLum, bgLum) + 0.05);

assert(contrast >= 4.5, `Text contrast ratio too low: ${contrast.toFixed(2)} (should be ≥ 4.5 for WCAG AA)`);
console.log(`✓ Text contrast ratio: ${contrast.toFixed(2)} (passes WCAG AA)`);

console.log('\n✅ All color system tests passed!');