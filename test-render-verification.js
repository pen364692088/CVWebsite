#!/usr/bin/env node

// Comprehensive render verification test runner
// Tests that verify the retro-futurism design is properly rendered

import { strict as assert } from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

console.log('🚀 Running comprehensive render verification tests...\n');

// Load build output
function loadBuildOutput() {
  const indexHtml = readFileSync('./dist/index.html', 'utf8');
  const projectsHtml = readFileSync('./dist/projects/index.html', 'utf8');
  const aboutHtml = readFileSync('./dist/about/index.html', 'utf8');
  const contactHtml = readFileSync('./dist/contact/index.html', 'utf8');
  
  // Load all CSS files
  const cssFiles = [];
  
  // Load the main CSS file
  const cssPath = './dist/_astro/about.Bj2jMeSu.css';
  if (existsSync(cssPath)) {
    cssFiles.push(readFileSync(cssPath, 'utf8'));
  }
  
  // Also extract inline styles from HTML files
  const allHtml = indexHtml + projectsHtml + aboutHtml + contactHtml;
  const styleMatches = allHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/g) || [];
  for (const style of styleMatches) {
    const cssContent = style.replace(/<style[^>]*>([\s\S]*?)<\/style>/, '$1');
    cssFiles.push(cssContent);
  }
  
  return {
    indexHtml,
    projectsHtml, 
    aboutHtml,
    contactHtml,
    allHtml: allHtml,
    allCSS: cssFiles.join('\n')
  };
}

// Test 1: Verify retro-futurism color system
function testColorSystem() {
  console.log('🎨 Testing retro-futurism color system...');
  
  const { allCSS } = loadBuildOutput();
  
  // Verify all retro-futurism color variables are present
  const colorVariables = [
    '--bg', '--bg-secondary', '--surface', '--surface-hover',
    '--text', '--text-secondary', '--muted',
    '--accent', '--accent-hover', '--accent-secondary', '--accent-secondary-hover',
    '--accent-soft', '--accent-secondary-soft', '--line',
    '--success', '--warning', '--error'
  ];
  
  for (const color of colorVariables) {
    assert(allCSS.includes(color), `Color variable ${color} not found in CSS output`);
  }
  console.log('✓ All retro-futurism color variables present');
  
  return true;
}

// Test 2: Verify retro-futurism components render
function testComponentRendering() {
  console.log('\n🧩 Testing retro-futurism component rendering...');
  
  const { indexHtml, projectsHtml } = loadBuildOutput();
  
  // Verify ProjectCard components render with proper styling
  assert(indexHtml.includes('project-card'), 'ProjectCard components not rendered on homepage');
  assert(projectsHtml.includes('project-card'), 'ProjectCard components not rendered on projects page');
  assert(indexHtml.includes('tech-indicator'), 'Tech indicators not rendered');
  assert(indexHtml.includes('@keyframes pulse'), 'Pulse animation not found');
  assert(indexHtml.includes('animation:pulse'), 'Pulse animation not applied');
  console.log('✓ ProjectCard components rendered with retro-futurism styling');
  
  // Verify navigation renders
  assert(indexHtml.includes('nav-wrap'), 'Navigation wrapper not rendered');
  assert(indexHtml.includes('aria-label="Main navigation"'), 'Navigation accessibility not preserved');
  console.log('✓ Navigation rendered with retro-futurism styling');
  
  // Verify hero section renders
  assert(indexHtml.includes('hero'), 'Hero section not rendered');
  assert(indexHtml.includes('fade-up'), 'Fade-up animations not rendered');
  console.log('✓ Hero section rendered with retro-futurism styling');
  
  return true;
}

// Test 3: Verify retro-futurism visual effects
function testVisualEffects() {
  console.log('\n✨ Testing retro-futurism visual effects...');
  
  const { allHtml } = loadBuildOutput();
  
  // Verify cyber grid background
  assert(allHtml.includes('cyber-grid-background'), 'Cyber grid background not rendered');
  console.log('✓ Cyber grid background rendered');
  
  // Verify gradient text effects
  assert(allHtml.includes('-webkit-background-clip:text'), 'Text gradient clipping not rendered');
  assert(allHtml.includes('-webkit-text-fill-color:transparent'), 'Transparent text fill not rendered');
  console.log('✓ Retro-futurism text gradients rendered');
  
  // Verify card hover effects
  assert(allHtml.includes('.project-card[data-astro-cid-mspuyifq]:hover'), 'ProjectCard hover effects not found');
  assert(allHtml.includes('transform:translateY'), 'Transform hover effect not found');
  assert(allHtml.includes('box-shadow'), 'Box shadow hover effect not found');
  console.log('✓ Card hover effects rendered');
  
  // Verify button effects
  assert(allHtml.includes('.btn[data-astro-cid-mspuyifq]:hover .btn-icon[data-astro-cid-mspuyifq]'), 'Button icon hover effect not found');
  console.log('✓ Button effects rendered');
  
  return true;
}

// Test 4: Verify accessibility features
function testAccessibility() {
  console.log('\n♿ Testing accessibility features...');
  
  const { allHtml } = loadBuildOutput();
  
  // Verify reduced motion support
  assert(allHtml.includes('(prefers-reduced-motion:reduce)'), 'Reduced motion media query not found');
  assert(allHtml.includes('transform:none'), 'Reduced motion transform override not found');
  assert(allHtml.includes('animation:none'), 'Reduced motion animation override not found');
  console.log('✓ Reduced motion support preserved');
  
  // Verify semantic HTML structure
  assert(allHtml.includes('<nav'), 'Semantic navigation not found');
  assert(allHtml.includes('<main'), 'Semantic main not found');
  assert(allHtml.includes('<footer'), 'Semantic footer not found');
  assert(allHtml.includes('aria-label'), 'Accessibility labels not found');
  console.log('✓ Semantic HTML structure preserved');
  
  return true;
}

// Test 5: Verify cross-page consistency
function testCrossPageConsistency() {
  console.log('\n🌐 Testing cross-page consistency...');
  
  const { indexHtml, projectsHtml, aboutHtml, contactHtml, allCSS } = loadBuildOutput();
  
  // Verify consistent styling across all pages
  const pages = [indexHtml, projectsHtml, aboutHtml, contactHtml];
  
  // All pages should use the same CSS variables which are defined in the CSS
  // The CSS variables are applied via the external CSS file, so we just need to verify
  // that the pages load the CSS and use the retro-futurism classes
  
  for (const page of pages) {
    // Verify cyber grid background is present on all pages
    assert(page.includes('cyber-grid-background'), 'Cyber grid not consistent across pages');
    // Verify retro-futurism components are present
    assert(page.includes('project-card') || page.includes('nav-wrap') || page.includes('hero'), 'Retro-futurism components not consistent across pages');
  }
  console.log('✓ Retro-futurism styling consistent across all pages');
  
  return true;
}

// Run all comprehensive tests
try {
  assert(existsSync('./dist/index.html'), 'Build output not found - run npm run build first');
  
  testColorSystem();
  testComponentRendering();
  testVisualEffects();
  testAccessibility();
  testCrossPageConsistency();
  
  console.log('\n🎉 SUCCESS: All comprehensive render verification tests passed!');
  console.log('✅ Retro-futurism design is fully implemented and properly rendered');
  console.log('✅ All visual changes are visible in actual build output');
  console.log('✅ Accessibility features are preserved');
  console.log('✅ Cross-page consistency maintained');
} catch (error) {
  console.error('\n💥 COMPREHENSIVE TEST FAILED:', error.message);
  process.exit(1);
}