// Render verification tests for retro-futurism design
// Tests actual build output to verify visual changes are rendered
import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

console.log('🧪 Testing render verification for retro-futurism design...\n');

// Test 1: Verify homepage renders with retro-futurism elements
function testHomepageRendering() {
  console.log('Testing homepage rendering...');
  
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Verify cyber grid background is rendered
  assert(indexHtml.includes('cyber-grid-background'), 'Cyber grid background not rendered');
  assert(indexHtml.includes('<div class="cyber-grid-background"></div>'), 'Cyber grid div not found');
  console.log('✓ Cyber grid background rendered');
  
  // Verify retro-futurism project cards are rendered
  assert(indexHtml.includes('project-card'), 'Project cards not rendered');
  assert(indexHtml.includes('tech-indicator'), 'Tech indicators not rendered');
  assert(indexHtml.includes('pulse'), 'Pulse animation not rendered');
  console.log('✓ Retro-futurism project cards rendered');
  
  // Verify retro-futurism button styling is rendered
  assert(indexHtml.includes('btn-text'), 'Button text styling not rendered');
  assert(indexHtml.includes('btn-icon'), 'Button icon styling not rendered');
  console.log('✓ Retro-futurism button styling rendered');
  
  // Verify gradient text effects are rendered (handling minified CSS)
  assert(indexHtml.includes('-webkit-background-clip:text'), 'Text gradient clipping not rendered');
  assert(indexHtml.includes('-webkit-text-fill-color:transparent'), 'Transparent text fill not rendered');
  console.log('✓ Retro-futurism text gradients rendered');
  
  // Verify reduced motion support is preserved
  assert(indexHtml.includes('prefers-reduced-motion'), 'Reduced motion support not preserved');
  console.log('✓ Reduced motion support preserved');
  
  return true;
}

// Test 2: Verify projects page renders with retro-futurism styling
function testProjectsPageRendering() {
  console.log('\nTesting projects page rendering...');
  
  const projectsHtml = readFileSync('./dist/projects/index.html', 'utf8');
  
  // Verify retro-futurism project cards are present
  assert(projectsHtml.includes('project-card'), 'Project cards not rendered on projects page');
  assert(projectsHtml.includes('tech-indicator'), 'Tech indicators not rendered on projects page');
  console.log('✓ Retro-futurism project cards rendered on projects page');
  
  // Verify retro-futurism card hover effects
  assert(projectsHtml.includes(':hover'), 'Hover effects not rendered');
  assert(projectsHtml.includes('transform'), 'Transform effects not rendered');
  console.log('✓ Retro-futurism card hover effects rendered');
  
  return true;
}

// Test 3: Verify about page renders with retro-futurism elements
function testAboutPageRendering() {
  console.log('\nTesting about page rendering...');
  
  const aboutHtml = readFileSync('./dist/about/index.html', 'utf8');
  
  // Verify retro-futurism layout is applied
  assert(aboutHtml.includes('cyber-grid-background'), 'Cyber grid background not rendered on about page');
  assert(aboutHtml.includes('card'), 'Card elements not rendered on about page');
  console.log('✓ Retro-futurism layout rendered on about page');
  
  return true;
}

// Test 4: Verify contact page renders with retro-futurism styling
function testContactPageRendering() {
  console.log('\nTesting contact page rendering...');
  
  const contactHtml = readFileSync('./dist/contact/index.html', 'utf8');
  
  // Verify retro-futurism contact link styling
  assert(contactHtml.includes('contact-link'), 'Contact link elements not rendered on contact page');
  assert(contactHtml.includes('link-indicator'), 'Link indicator elements not rendered on contact page');
  console.log('✓ Retro-futurism contact elements rendered on contact page');
  
  return true;
}

// Test 5: Verify CSS variables are applied in rendered output
function testCSSVariablesApplied() {
  console.log('\nTesting CSS variables application...');
  
  // Load both HTML and CSS files
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Load the main CSS file directly
  const cssFiles = [];
  
  // Load the known CSS file
  const cssPath = './dist/_astro/about.Bj2jMeSu.css';
  if (existsSync(cssPath)) {
    cssFiles.push(readFileSync(cssPath, 'utf8'));
  }
  
  const allContent = indexHtml + cssFiles.join('\n');
  
  // Verify retro-futurism color variables are used
  const retroColors = [
    '--bg',
    '--bg-secondary', 
    '--surface',
    '--surface-hover',
    '--text',
    '--text-secondary',
    '--muted',
    '--accent',
    '--accent-hover',
    '--accent-secondary',
    '--accent-secondary-hover',
    '--accent-soft',
    '--accent-secondary-soft',
    '--line',
    '--success',
    '--warning',
    '--error'
  ];
  
  for (const color of retroColors) {
    assert(allContent.includes(color), `Retro-futurism color variable ${color} not applied`);
  }
  console.log('✓ All retro-futurism color variables applied');
  
  return true;
}

// Test 6: Verify retro-futurism animations are rendered
function testAnimationsRendered() {
  console.log('\nTesting retro-futurism animations...');
  
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  
  // Verify key animations are present
  assert(indexHtml.includes('@keyframes'), 'CSS keyframes not rendered');
  assert(indexHtml.includes('animation:'), 'CSS animations not applied');
  console.log('✓ Retro-futurism animations rendered');
  
  return true;
}

// Run all render verification tests
try {
  assert(existsSync('./dist/index.html'), 'Build output not found - run npm run build first');
  
  testHomepageRendering();
  testProjectsPageRendering();
  testAboutPageRendering();
  testContactPageRendering();
  testCSSVariablesApplied();
  testAnimationsRendered();
  
  console.log('\n🎯 All render verification tests passed!');
  console.log('✅ Retro-futurism design is properly rendered in build output');
} catch (error) {
  console.error('\n💥 Render verification failed:', error.message);
  process.exit(1);
}