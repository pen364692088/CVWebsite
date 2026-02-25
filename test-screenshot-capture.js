#!/usr/bin/env node

/**
 * Test for screenshot capture documentation system
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import assert from 'assert';

// Test configuration
const PROJECT_ROOT = process.cwd();
const DOCS_DIR = join(PROJECT_ROOT, 'docs');
const SCREENSHOTS_DIR = join(DOCS_DIR, 'screenshots');
const ASSETS_SOURCES_FILE = join(DOCS_DIR, 'assets-sources.md');
const SCREENSHOT_MANIFEST = join(SCREENSHOTS_DIR, 'screenshot-manifest.json');
const SCREENSHOT_README = join(SCREENSHOTS_DIR, 'README.md');

// Test cases
function testScreenshotDirectoryExists() {
  console.log('📁 Testing screenshot directory exists...');
  assert(existsSync(SCREENSHOTS_DIR), 'Screenshots directory should exist');
  console.log('✅ Screenshots directory exists');
}

function testScreenshotManifestExists() {
  console.log('📋 Testing screenshot manifest exists...');
  assert(existsSync(SCREENSHOT_MANIFEST), 'Screenshot manifest should exist');
  console.log('✅ Screenshot manifest exists');
}

function testScreenshotManifestContent() {
  console.log('📄 Testing screenshot manifest content...');
  const manifest = JSON.parse(readFileSync(SCREENSHOT_MANIFEST, 'utf8'));
  
  assert(manifest.timestamp, 'Manifest should have timestamp');
  assert(Array.isArray(manifest.pages), 'Manifest should have pages array');
  assert(manifest.pages.length === 5, 'Should have 5 pages documented');
  
  const expectedPages = ['Home', 'About', 'Projects', 'Contact', 'Resume'];
  const pageNames = manifest.pages.map(p => p.name);
  expectedPages.forEach(page => {
    assert(pageNames.includes(page), `Should include ${page} page`);
  });
  
  console.log('✅ Screenshot manifest has correct content');
}

function testScreenshotReadmeExists() {
  console.log('📖 Testing screenshot README exists...');
  assert(existsSync(SCREENSHOT_README), 'Screenshot README should exist');
  console.log('✅ Screenshot README exists');
}

function testAssetsSourcesUpdated() {
  console.log('📝 Testing assets-sources.md is updated...');
  assert(existsSync(ASSETS_SOURCES_FILE), 'assets-sources.md should exist');
  
  const content = readFileSync(ASSETS_SOURCES_FILE, 'utf8');
  assert(content.includes('Screenshots'), 'Should include Screenshots section');
  assert(content.includes('Before/After'), 'Should include Before/After documentation');
  assert(content.includes('Pending Capture'), 'Should indicate pending capture status');
  
  console.log('✅ assets-sources.md is properly updated');
}

function testCaptureScriptExists() {
  console.log('🛠️ Testing capture script exists...');
  const scriptPath = join(PROJECT_ROOT, 'scripts', 'capture-screenshots.js');
  assert(existsSync(scriptPath), 'Capture script should exist');
  console.log('✅ Capture script exists');
}

// Run all tests
function runTests() {
  console.log('🧪 Running screenshot capture tests...\n');
  
  try {
    testScreenshotDirectoryExists();
    testScreenshotManifestExists();
    testScreenshotManifestContent();
    testScreenshotReadmeExists();
    testAssetsSourcesUpdated();
    testCaptureScriptExists();
    
    console.log('\n🎉 All screenshot capture tests passed!');
    return true;
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    return false;
  }
}

// Run if called directly
if (process.argv[1] === import.meta.url) {
  runTests();
}

export { runTests };