#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function testProjectCardComponent() {
  console.log('🧪 Testing ProjectCard.astro component...\n');
  
  const projectCardPath = join(__dirname, 'src', 'components', 'ProjectCard.astro');
  
  if (!existsSync(projectCardPath)) {
    throw new Error('❌ ProjectCard.astro not found at: ' + projectCardPath);
  }
  
  const content = readFileSync(projectCardPath, 'utf8');
  
  // Test 1: Component has required props interface
  const hasPropsInterface = content.includes('interface Props');
  console.log(hasPropsInterface ? '✅ Has Props interface' : '❌ Missing Props interface');
  
  // Test 2: Component has required props
  const hasTitleProp = content.includes('title: string');
  const hasDescriptionProp = content.includes('description: string');
  const hasStackProp = content.includes('stack: string');
  console.log(hasTitleProp ? '✅ Has title prop' : '❌ Missing title prop');
  console.log(hasDescriptionProp ? '✅ Has description prop' : '❌ Missing description prop');
  console.log(hasStackProp ? '✅ Has stack prop' : '❌ Missing stack prop');
  
  // Test 3: Component uses retro-futurism styling
  const hasRetroFuturismStyling = 
    content.includes('--accent') || 
    content.includes('--accent-secondary') ||
    content.includes('--surface') ||
    content.includes('--text-secondary');
  console.log(hasRetroFuturismStyling ? '✅ Uses retro-futurism CSS variables' : '❌ Missing retro-futurism styling');
  
  // Test 4: Component has hover effects
  const hasHoverEffects = content.includes(':hover') && content.includes('transform');
  console.log(hasHoverEffects ? '✅ Has hover effects' : '❌ Missing hover effects');
  
  // Test 5: Component has accessibility support
  const hasAccessibility = content.includes('prefers-reduced-motion');
  console.log(hasAccessibility ? '✅ Has accessibility support' : '❌ Missing accessibility support');
  
  // Test 6: Component has animations
  const hasAnimations = content.includes('@keyframes') || content.includes('animation');
  console.log(hasAnimations ? '✅ Has animations' : '❌ Missing animations');
  
  console.log('\n🎯 All ProjectCard component tests completed!');
  
  return hasPropsInterface && hasTitleProp && hasDescriptionProp && hasStackProp && 
         hasRetroFuturismStyling && hasHoverEffects && hasAccessibility && hasAnimations;
}

// Run tests
try {
  const allTestsPassed = testProjectCardComponent();
  process.exit(allTestsPassed ? 0 : 1);
} catch (error) {
  console.error('\n💥 Test failed:', error.message);
  process.exit(1);
}