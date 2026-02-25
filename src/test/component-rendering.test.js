// Component rendering tests for retro-futurism design
// Tests that verify individual components render with retro-futurism styling
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

console.log('🧩 Testing component rendering for retro-futurism design...\n');

// Test 1: Verify ProjectCard component renders with retro-futurism styling
function testProjectCardRendering() {
  console.log('Testing ProjectCard component rendering...');
  
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Verify ProjectCard structure is rendered
  assert(indexHtml.includes('project-card'), 'ProjectCard class not rendered');
  assert(indexHtml.includes('card-header'), 'Card header not rendered');
  assert(indexHtml.includes('tech-indicator'), 'Tech indicator not rendered');
  assert(indexHtml.includes('description'), 'Description not rendered');
  assert(indexHtml.includes('stack'), 'Stack not rendered');
  console.log('✓ ProjectCard structure rendered');
  
  // Verify retro-futurism styling is applied
  const projectCardCSS = readFileSync('./dist/index.html', 'utf8');
  assert(projectCardCSS.includes('--accent'), 'Accent color not applied to ProjectCard');
  assert(projectCardCSS.includes('--accent-secondary'), 'Secondary accent color not applied to ProjectCard');
  assert(projectCardCSS.includes('--surface'), 'Surface color not applied to ProjectCard');
  console.log('✓ Retro-futurism colors applied to ProjectCard');
  
  // Verify animations are present
  assert(projectCardCSS.includes('@keyframes pulse'), 'Pulse animation not found');
  assert(projectCardCSS.includes('animation:pulse'), 'Pulse animation not applied');
  console.log('✓ ProjectCard animations rendered');
  
  // Verify hover effects
  assert(projectCardCSS.includes('.project-card[data-astro-cid-mspuyifq]:hover'), 'ProjectCard hover effects not found');
  assert(projectCardCSS.includes('transform:translateY'), 'Transform hover effect not found');
  assert(projectCardCSS.includes('box-shadow'), 'Box shadow hover effect not found');
  console.log('✓ ProjectCard hover effects rendered');
  
  return true;
}

// Test 2: Verify navigation component renders with retro-futurism styling
function testNavigationRendering() {
  console.log('\nTesting navigation component rendering...');
  
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Verify navigation structure is rendered
  assert(indexHtml.includes('nav-wrap'), 'Navigation wrapper not rendered');
  assert(indexHtml.includes('nav'), 'Navigation element not rendered');
  assert(indexHtml.includes('brand'), 'Brand element not rendered');
  assert(indexHtml.includes('aria-label="Main navigation"'), 'Navigation aria-label not rendered');
  console.log('✓ Navigation structure rendered');
  
  // Verify navigation styling
  const navCSS = readFileSync('./dist/index.html', 'utf8');
  assert(navCSS.includes('--text'), 'Text color not applied to navigation');
  assert(navCSS.includes('--accent'), 'Accent color not applied to navigation');
  console.log('✓ Retro-futurism colors applied to navigation');
  
  return true;
}

// Test 3: Verify footer component renders with retro-futurism styling
function testFooterRendering() {
  console.log('\nTesting footer component rendering...');
  
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Verify footer structure is rendered
  assert(indexHtml.includes('footer'), 'Footer element not rendered');
  assert(indexHtml.includes('footer-inner'), 'Footer inner wrapper not rendered');
  assert(indexHtml.includes('footer-content'), 'Footer content not rendered');
  assert(indexHtml.includes('footer-copyright'), 'Footer copyright not rendered');
  assert(indexHtml.includes('footer-links'), 'Footer links not rendered');
  assert(indexHtml.includes('footer-glow'), 'Footer glow effect not rendered');
  console.log('✓ Footer structure rendered');
  
  // Verify footer styling
  const footerCSS = readFileSync('./dist/index.html', 'utf8');
  assert(footerCSS.includes('--accent-soft'), 'Accent soft color not applied to footer');
  assert(footerCSS.includes('--accent-secondary-soft'), 'Secondary accent soft color not applied to footer');
  console.log('✓ Retro-futurism colors applied to footer');
  
  return true;
}

// Test 4: Verify hero section renders with retro-futurism styling
function testHeroRendering() {
  console.log('\nTesting hero section rendering...');
  
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Verify hero structure is rendered
  assert(indexHtml.includes('hero'), 'Hero section not rendered');
  assert(indexHtml.includes('eyebrow'), 'Eyebrow element not rendered');
  assert(indexHtml.includes('fade-up'), 'Fade-up animation class not rendered');
  console.log('✓ Hero structure rendered');
  
  // Verify hero styling
  const heroCSS = readFileSync('./dist/index.html', 'utf8');
  assert(heroCSS.includes('--text'), 'Text color not applied to hero');
  assert(heroCSS.includes('--accent'), 'Accent color not applied to hero');
  console.log('✓ Retro-futurism colors applied to hero');
  
  // Verify fade-up animation
  assert(heroCSS.includes('.fade-up'), 'Fade-up animation class not found');
  console.log('✓ Hero animations rendered');
  
  return true;
}

// Test 5: Verify metrics section renders with retro-futurism styling
function testMetricsRendering() {
  console.log('\nTesting metrics section rendering...');
  
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Verify metrics structure is rendered
  assert(indexHtml.includes('metrics'), 'Metrics section not rendered');
  assert(indexHtml.includes('metric'), 'Metric elements not rendered');
  assert(indexHtml.includes('aria-label="Experience highlights"'), 'Metrics aria-label not rendered');
  console.log('✓ Metrics structure rendered');
  
  // Verify metrics styling
  const metricsCSS = readFileSync('./dist/index.html', 'utf8');
  assert(metricsCSS.includes('--surface'), 'Surface color not applied to metrics');
  assert(metricsCSS.includes('--text-secondary'), 'Secondary text color not applied to metrics');
  console.log('✓ Retro-futurism colors applied to metrics');
  
  return true;
}

// Test 6: Verify button components render with retro-futurism styling
function testButtonRendering() {
  console.log('\nTesting button component rendering...');
  
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Verify button structure is rendered
  assert(indexHtml.includes('btn'), 'Button elements not rendered');
  assert(indexHtml.includes('btn ghost'), 'Ghost button variant not rendered');
  console.log('✓ Button structure rendered');
  
  // Verify button styling
  const buttonCSS = readFileSync('./dist/index.html', 'utf8');
  assert(buttonCSS.includes('.btn[data-astro-cid-mspuyifq]:hover .btn-icon[data-astro-cid-mspuyifq]'), 'Button icon hover effect not found');
  console.log('✓ Retro-futurism button effects rendered');
  
  return true;
}

// Run all component rendering tests
try {
  assert(existsSync('./dist/index.html'), 'Build output not found - run npm run build first');
  
  testProjectCardRendering();
  testNavigationRendering();
  testFooterRendering();
  testHeroRendering();
  testMetricsRendering();
  testButtonRendering();
  
  console.log('\n🎯 All component rendering tests passed!');
  console.log('✅ All components render with retro-futurism styling');
} catch (error) {
  console.error('\n💥 Component rendering test failed:', error.message);
  process.exit(1);
}