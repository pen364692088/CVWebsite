import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test footer component styling
function testFooterStyling() {
  console.log('Testing footer retro-futurism styling...');
  
  // Read the footer component
  const footerPath = path.join(__dirname, '../components/Footer.astro');
  const footerContent = fs.readFileSync(footerPath, 'utf8');
  
  // Test 1: Check for retro-futurism color usage
  const hasRetroColors = footerContent.includes('var(--accent)') || 
                        footerContent.includes('var(--accent-secondary)') ||
                        footerContent.includes('var(--surface)') ||
                        footerContent.includes('var(--bg-secondary)');
  assert.ok(hasRetroColors, 'Footer should use retro-futurism color variables');
  
  // Test 2: Check for gradient or glow effects
  const hasVisualEffects = footerContent.includes('gradient') || 
                          footerContent.includes('glow') ||
                          footerContent.includes('shadow') ||
                          footerContent.includes('animation');
  assert.ok(hasVisualEffects, 'Footer should have retro-futurism visual effects');
  
  // Test 3: Check for accessibility support
  const hasAccessibility = footerContent.includes('prefers-reduced-motion') ||
                          footerContent.includes('transition') ||
                          footerContent.includes('hover');
  assert.ok(hasAccessibility, 'Footer should maintain accessibility features');
  
  // Test 4: Check for proper semantic structure
  const hasSemanticFooter = footerContent.includes('<footer>') &&
                           footerContent.includes('</footer>');
  assert.ok(hasSemanticFooter, 'Footer should use proper semantic HTML');
  
  // Test 5: Check for responsive design
  const hasResponsive = footerContent.includes('@media') ||
                       footerContent.includes('flex-wrap') ||
                       footerContent.includes('gap');
  assert.ok(hasResponsive, 'Footer should have responsive design features');
  
  console.log('✅ All footer styling tests passed!');
}

// Test footer content and functionality
function testFooterContent() {
  console.log('Testing footer content and functionality...');
  
  const footerPath = path.join(__dirname, '../components/Footer.astro');
  const footerContent = fs.readFileSync(footerPath, 'utf8');
  
  // Test 1: Check for copyright year
  const hasCopyright = footerContent.includes('getFullYear()') ||
                      footerContent.includes('©');
  assert.ok(hasCopyright, 'Footer should include copyright information');
  
  // Test 2: Check for email link
  const hasEmailLink = footerContent.includes('mailto:') ||
                      footerContent.includes('href="mailto:');
  assert.ok(hasEmailLink, 'Footer should include email contact link');
  
  // Test 3: Check for container class usage
  const hasContainer = footerContent.includes('container') ||
                      footerContent.includes('footer-inner');
  assert.ok(hasContainer, 'Footer should use proper layout containers');
  
  console.log('✅ All footer content tests passed!');
}

// Run all tests
function runFooterTests() {
  try {
    testFooterStyling();
    testFooterContent();
    console.log('🎉 All footer tests completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Footer test failed:', error.message);
    return false;
  }
}

// Export for use in other test runners
export { runFooterTests };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFooterTests();
}