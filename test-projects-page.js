#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function testProjectsPage() {
  console.log('🧪 Testing projects.astro page styling...\n');
  
  const projectsPagePath = join(__dirname, 'src', 'pages', 'projects.astro');
  
  if (!existsSync(projectsPagePath)) {
    throw new Error('❌ projects.astro not found at: ' + projectsPagePath);
  }
  
  const content = readFileSync(projectsPagePath, 'utf8');
  
  // Test 1: Page has hero section with retro-futurism styling
  const hasHeroSection = content.includes('class="hero"');
  console.log(hasHeroSection ? '✅ Has hero section' : '❌ Missing hero section');
  
  // Test 2: Hero has retro-futurism glow background
  const hasHeroGlow = content.includes('hero::before') && content.includes('--accent-soft');
  console.log(hasHeroGlow ? '✅ Has hero glow background' : '❌ Missing hero glow background');
  
  // Test 3: Hero has eyebrow gradient styling
  const hasEyebrowGradient = content.includes('hero .eyebrow') && content.includes('background: linear-gradient');
  console.log(hasEyebrowGradient ? '✅ Has eyebrow gradient styling' : '❌ Missing eyebrow gradient styling');
  
  // Test 4: Hero has heading with scanline animation
  const hasScanlineAnimation = content.includes('hero h1::after') && content.includes('scanline');
  console.log(hasScanlineAnimation ? '✅ Has scanline animation' : '❌ Missing scanline animation');
  
  // Test 5: Page has responsive grid layout
  const hasGridLayout = content.includes('grid-template-columns') && content.includes('@media');
  console.log(hasGridLayout ? '✅ Has responsive grid layout' : '❌ Missing responsive grid layout');
  
  // Test 6: Page has accessibility support
  const hasAccessibility = content.includes('prefers-reduced-motion');
  console.log(hasAccessibility ? '✅ Has accessibility support' : '❌ Missing accessibility support');
  
  // Test 7: Page uses ProjectCard components
  const usesProjectCards = content.includes('ProjectCard');
  console.log(usesProjectCards ? '✅ Uses ProjectCard components' : '❌ Missing ProjectCard components');
  
  // Test 8: Page has retro-futurism animations
  const hasAnimations = content.includes('@keyframes') && content.includes('animation');
  console.log(hasAnimations ? '✅ Has retro-futurism animations' : '❌ Missing animations');
  
  console.log('\n🎯 All projects page styling tests completed!');
  
  return hasHeroSection && hasHeroGlow && hasEyebrowGradient && hasScanlineAnimation && 
         hasGridLayout && hasAccessibility && usesProjectCards && hasAnimations;
}

// Run tests
try {
  const allTestsPassed = testProjectsPage();
  process.exit(allTestsPassed ? 0 : 1);
} catch (error) {
  console.error('\n💥 Test failed:', error.message);
  process.exit(1);
}