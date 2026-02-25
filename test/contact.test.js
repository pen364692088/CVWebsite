import assert from 'assert';
import fs from 'fs';
import path from 'path';

// Test contact page styling and structure
function testContactPage() {
  const contactFile = path.join(process.cwd(), 'src/pages/contact.astro');
  const contactContent = fs.readFileSync(contactFile, 'utf8');

  // Test 1: Contact page has retro-futurism hero section
  assert(
    contactContent.includes('class="hero"'),
    'Contact page should have hero section'
  );
  
  // Test 2: Contact page uses retro-futurism styling
  assert(
    contactContent.includes('var(--accent)') || contactContent.includes('var(--accent-secondary)'),
    'Contact page should use retro-futurism color variables'
  );

  // Test 3: Contact card has enhanced styling
  assert(
    contactContent.includes('class="card') || contactContent.includes("class='card"),
    'Contact page should have styled card component'
  );

  // Test 4: Contact links are clearly visible with indicators
  assert(
    contactContent.includes('contact-link') && contactContent.includes('link-indicator'),
    'Contact links should have enhanced styling with indicators'
  );

  // Test 5: Accessibility support for reduced motion
  assert(
    contactContent.includes('prefers-reduced-motion') || contactContent.includes('transition'),
    'Contact page should have accessibility considerations'
  );

  // Test 6: Contact page has proper layout structure
  assert(
    contactContent.includes('container') && contactContent.includes('grid'),
    'Contact page should use container and grid layout'
  );

  // Test 7: Contact items have proper spacing and borders
  assert(
    contactContent.includes('contact-item') && contactContent.includes('var(--space-md)'),
    'Contact items should have proper spacing'
  );

  console.log('✅ All contact page tests passed!');
  return true;
}

// Run the tests
try {
  testContactPage();
} catch (error) {
  console.error('❌ Contact page test failed:', error.message);
  process.exit(1);
}