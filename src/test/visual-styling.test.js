// Visual styling tests for retro-futurism design
// Tests that verify specific visual design elements are rendered
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

console.log('🎨 Testing visual styling for retro-futurism design...\n');

// Load the built CSS files
function loadBuiltCSS() {
  const cssFiles = [];
  
  // Load the main CSS file directly
  const cssPath = './dist/_astro/about.Bj2jMeSu.css';
  if (existsSync(cssPath)) {
    cssFiles.push(readFileSync(cssPath, 'utf8'));
  }
  
  // Also check inline styles in HTML
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  const styleMatches = indexHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
  for (const style of styleMatches) {
    const cssContent = style.replace(/<style[^>]*>([\s\S]*?)<\/style>/, '$1');
    cssFiles.push(cssContent);
  }
  
  return cssFiles.join('\n');
}

// Test 1: Verify retro-futurism color palette is applied
function testColorPaletteApplied() {
  console.log('Testing retro-futurism color palette...');
  
  const cssContent = loadBuiltCSS();
  
  // Verify dark background colors are used
  const darkColors = [
    '--bg',
    '--bg-secondary', 
    '--surface',
    '--surface-hover'
  ];
  
  for (const color of darkColors) {
    assert(cssContent.includes(color), `Dark color ${color} not applied`);
  }
  console.log('✓ Dark background colors applied');
  
  // Verify neon accent colors are used
  const neonColors = [
    '--accent',
    '--accent-hover',
    '--accent-secondary',
    '--accent-secondary-hover',
    '--accent-soft',
    '--accent-secondary-soft'
  ];
  
  for (const color of neonColors) {
    assert(cssContent.includes(color), `Neon color ${color} not applied`);
  }
  console.log('✓ Neon accent colors applied');
  
  return true;
}

// Test 2: Verify cyber grid styling is present
function testCyberGridStyling() {
  console.log('\nTesting cyber grid styling...');
  
  const cssContent = loadBuiltCSS();
  
  // Verify cyber grid background properties
  assert(cssContent.includes('.cyber-grid-background'), 'Cyber grid class not found');
  assert(cssContent.includes('background-image'), 'Background image property not found');
  assert(cssContent.includes('linear-gradient'), 'Linear gradients not found');
  console.log('✓ Cyber grid background styling present');
  
  // Verify grid animation
  assert(cssContent.includes('@keyframes'), 'CSS keyframes not found');
  assert(cssContent.includes('animation:'), 'CSS animation property not found');
  console.log('✓ Cyber grid animation present');
  
  return true;
}

// Test 3: Verify retro-futurism card styling
function testCardStyling() {
  console.log('\nTesting retro-futurism card styling...');
  
  const cssContent = loadBuiltCSS();
  
  // Verify card gradient effects (handling minified CSS)
  assert(cssContent.includes('.card:before'), 'Card gradient overlay not found');
  assert(cssContent.includes('linear-gradient(45deg'), '45-degree gradient not found');
  console.log('✓ Card gradient effects present');
  
  // Verify card glow effects
  assert(cssContent.includes('box-shadow'), 'Box shadow property not found');
  assert(cssContent.includes('var(--accent-soft)'), 'Accent soft glow not found');
  console.log('✓ Card glow effects present');
  
  // Verify card hover effects
  assert(cssContent.includes('.card:hover'), 'Card hover effects not found');
  assert(cssContent.includes('transform'), 'Transform property not found');
  console.log('✓ Card hover effects present');
  
  return true;
}

// Test 4: Verify retro-futurism button styling
function testButtonStyling() {
  console.log('\nTesting retro-futurism button styling...');
  
  const cssContent = loadBuiltCSS();
  
  // Verify button scanline effects (handling minified CSS)
  assert(cssContent.includes('.btn:before'), 'Button scanline overlay not found');
  assert(cssContent.includes('background:linear-gradient(90deg'), 'Scanline gradient not found');
  console.log('✓ Button scanline effects present');
  
  // Verify button icon animation
  assert(cssContent.includes('btn-icon'), 'Button icon styling not found');
  console.log('✓ Button icon animation present');
  
  return true;
}

// Test 5: Verify retro-futurism text styling
function testTextStyling() {
  console.log('\nTesting retro-futurism text styling...');
  
  const cssContent = loadBuiltCSS();
  
  // Verify gradient text effects (handling minified CSS)
  assert(cssContent.includes('-webkit-background-clip:text'), 'Text background clipping not found');
  assert(cssContent.includes('-webkit-text-fill-color:transparent'), 'Transparent text fill not found');
  console.log('✓ Gradient text effects present');
  
  // Verify heading underline effects (handling minified CSS)
  assert(cssContent.includes('h1:after'), 'Heading underline not found');
  assert(cssContent.includes('linear-gradient(90deg'), 'Heading underline gradient not found');
  console.log('✓ Heading underline effects present');
  
  return true;
}

// Test 6: Verify accessibility features
function testAccessibilityFeatures() {
  console.log('\nTesting accessibility features...');
  
  const cssContent = loadBuiltCSS();
  
  // Verify reduced motion support - looking for the actual implementation
  assert(cssContent.includes('(prefers-reduced-motion:reduce)'), 'Reduced motion media query not found');
  assert(cssContent.includes('transform:none'), 'Reduced motion transform override not found');
  assert(cssContent.includes('animation:none'), 'Reduced motion animation override not found');
  console.log('✓ Reduced motion support present');
  
  return true;
}

// Run all visual styling tests
try {
  assert(existsSync('./dist/index.html'), 'Build output not found - run npm run build first');
  
  testColorPaletteApplied();
  testCyberGridStyling();
  testCardStyling();
  testButtonStyling();
  testTextStyling();
  testAccessibilityFeatures();
  
  console.log('\n🎯 All visual styling tests passed!');
  console.log('✅ Retro-futurism visual design is properly implemented');
} catch (error) {
  console.error('\n💥 Visual styling test failed:', error.message);
  process.exit(1);
}