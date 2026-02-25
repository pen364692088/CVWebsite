#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function testAboutPage() {
  console.log('🧪 Testing About page retro-futurism styling...\n');
  
  const aboutPagePath = join(__dirname, 'src', 'pages', 'about.astro');
  
  if (!existsSync(aboutPagePath)) {
    throw new Error('❌ about.astro not found at: ' + aboutPagePath);
  }
  
  const content = readFileSync(aboutPagePath, 'utf8');
  
  // Test 1: Page has retro-futurism hero section
  const hasHeroSection = content.includes('about-hero') && content.includes('hero-content');
  console.log(hasHeroSection ? '✅ Has retro-futurism hero section' : '❌ Missing retro-futurism hero section');
  
  // Test 2: Page uses retro-futurism CSS variables
  const hasRetroFuturismStyling = 
    content.includes('--accent') || 
    content.includes('--accent-secondary') ||
    content.includes('--surface') ||
    content.includes('--text-secondary');
  console.log(hasRetroFuturismStyling ? '✅ Uses retro-futurism CSS variables' : '❌ Missing retro-futurism styling');
  
  // Test 3: Page has gradient text effects
  const hasGradientText = content.includes('background: linear-gradient') && content.includes('background-clip: text');
  console.log(hasGradientText ? '✅ Has gradient text effects' : '❌ Missing gradient text effects');
  
  // Test 4: Page has animated elements
  const hasAnimations = content.includes('@keyframes') || content.includes('animation');
  console.log(hasAnimations ? '✅ Has animations' : '❌ Missing animations');
  
  // Test 5: Page has hover effects
  const hasHoverEffects = content.includes(':hover') && (content.includes('transform') || content.includes('box-shadow'));
  console.log(hasHoverEffects ? '✅ Has hover effects' : '❌ Missing hover effects');
  
  // Test 6: Page has accessibility support
  const hasAccessibility = content.includes('prefers-reduced-motion');
  console.log(hasAccessibility ? '✅ Has accessibility support' : '❌ Missing accessibility support');
  
  // Test 7: Page has value cards with icons
  const hasValueCards = content.includes('value-card') && content.includes('card-icon');
  console.log(hasValueCards ? '✅ Has value cards with icons' : '❌ Missing value cards');
  
  // Test 8: Page has scanline animation
  const hasScanline = content.includes('scanline') || content.includes('scan-line');
  console.log(hasScanline ? '✅ Has scanline animation' : '❌ Missing scanline animation');
  
  console.log('\n🎯 All About page tests completed!');
  
  return hasHeroSection && hasRetroFuturismStyling && hasGradientText && hasAnimations && 
         hasHoverEffects && hasAccessibility && hasValueCards && hasScanline;
}

// Run tests
try {
  const allTestsPassed = testAboutPage();
  process.exit(allTestsPassed ? 0 : 1);
} catch (error) {
  console.error('\n💥 Test failed:', error.message);
  process.exit(1);
}