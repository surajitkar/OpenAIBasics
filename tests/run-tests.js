#!/usr/bin/env node
/**
 * Test Runner for OpenAI Basics Project
 * 
 * Runs all tests using Node.js built-in assert module.
 * Supports different test modes: unit, integration, or all tests.
 * 
 * Usage:
 *   node tests/run-tests.js                 # Run all tests
 *   node tests/run-tests.js --unit-only     # Run only unit tests
 *   node tests/run-tests.js --integration-only # Run only integration tests
 *   node tests/run-tests.js --verbose       # Run with verbose output
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, stat } from 'fs/promises';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Test runner configuration
 */
const config = {
  unitOnly: process.argv.includes('--unit-only'),
  integrationOnly: process.argv.includes('--integration-only'),
  verbose: process.argv.includes('--verbose'),
  testDir: __dirname // Changed to scan all test directories
};

/**
 * Color console output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  if (process.env.NO_COLOR) return text;
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Find all test files
 */
async function findTestFiles(dir) {
  const files = [];
  
  try {
    const entries = await readdir(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);
      
      if (stats.isFile() && entry.endsWith('.test.js')) {
        files.push(fullPath);
      } else if (stats.isDirectory() && entry !== 'utils') {
        // Skip utils directory, but recurse into other directories
        const subFiles = await findTestFiles(fullPath);
        files.push(...subFiles);
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error reading directory ${dir}:`, error.message);
    }
  }
  
  return files;
}

/**
 * Run a single test file
 */
async function runTestFile(testFile) {
  console.log(colorize(`\n📁 Running tests from: ${testFile}`, 'cyan'));
  console.log('─'.repeat(60));
  
  try {
    // Import and run the test file
    const testModule = await import(`file://${testFile}`);
    
    // Look for exported test runner or run function
    if (typeof testModule.runTests === 'function') {
      const results = await testModule.runTests(config);
      return results || { passed: 0, failed: 0, skipped: 0 };
    } else if (typeof testModule.default === 'function') {
      const results = await testModule.default(config);
      return results || { passed: 0, failed: 0, skipped: 0 };
    } else {
      console.log(colorize('⚠️  Test file does not export runTests function', 'yellow'));
      return { passed: 0, failed: 1, skipped: 0 };
    }
  } catch (error) {
    console.error(colorize(`❌ Error running test file: ${error.message}`, 'red'));
    if (config.verbose) {
      console.error(error.stack);
    }
    return { passed: 0, failed: 1, skipped: 0 };
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  const startTime = Date.now();
  
  // Print header
  console.log(colorize('🧪 OpenAI Basics Test Runner', 'bright'));
  console.log('═'.repeat(50));
  
  // Show configuration
  console.log(colorize('📋 Configuration:', 'blue'));
  console.log(`   Mode: ${config.unitOnly ? 'Unit tests only' : 
                       config.integrationOnly ? 'Integration tests only' : 'All tests'}`);
  console.log(`   Verbose: ${config.verbose}`);
  console.log(`   API Key available: ${process.env.OPENAI_API_KEY ? '✅' : '❌'}`);
  console.log(`   Organization ID available: ${process.env.OPENAI_ORG_ID ? '✅' : '❌'}`);
  
  // Find test files
  const testFiles = await findTestFiles(config.testDir);
  
  if (testFiles.length === 0) {
    console.log(colorize('\n⚠️  No test files found!', 'yellow'));
    console.log(`   Expected test files in: ${config.testDir}`);
    console.log('   Test files should end with .test.js');
    return false;
  }
  
  console.log(colorize(`\n🔍 Found ${testFiles.length} test file(s)`, 'blue'));
  
  // Run each test file
  const overallResults = { passed: 0, failed: 0, skipped: 0 };
  
  for (const testFile of testFiles) {
    const results = await runTestFile(testFile);
    if (results) {
      overallResults.passed += results.passed || 0;
      overallResults.failed += results.failed || 0;
      overallResults.skipped += results.skipped || 0;
    }
  }
  
  // Print final summary
  const duration = Date.now() - startTime;
  const total = overallResults.passed + overallResults.failed + overallResults.skipped;
  
  console.log('\n' + '═'.repeat(50));
  console.log(colorize('📊 Final Test Summary', 'bright'));
  console.log(`   Duration: ${duration}ms`);
  console.log(`   Total tests: ${total}`);
  console.log(`   ${colorize('Passed:', 'green')} ${overallResults.passed}`);
  console.log(`   ${colorize('Failed:', 'red')} ${overallResults.failed}`);
  console.log(`   ${colorize('Skipped:', 'yellow')} ${overallResults.skipped}`);
  
  if (overallResults.failed > 0) {
    console.log(colorize('\n❌ Some tests failed!', 'red'));
    return false;
  } else {
    console.log(colorize('\n✅ All tests passed!', 'green'));
    return true;
  }
}

/**
 * Show usage information
 */
function showUsage() {
  console.log(colorize('OpenAI Basics Test Runner', 'bright'));
  console.log('\nUsage:');
  console.log('  node tests/run-tests.js [options]');
  console.log('\nOptions:');
  console.log('  --unit-only         Run only unit tests (no API calls)');
  console.log('  --integration-only  Run only integration tests (requires API key)');
  console.log('  --verbose           Show detailed error information');
  console.log('  --help              Show this help message');
  console.log('\nEnvironment Variables:');
  console.log('  OPENAI_API_KEY      Required for integration tests');
  console.log('  OPENAI_ORG_ID       Optional organization ID');
  console.log('  NO_COLOR            Disable colored output');
}

/**
 * Handle errors and exit codes
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error(colorize('Unhandled Promise Rejection:', 'red'), reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(colorize('Uncaught Exception:', 'red'), error);
  process.exit(1);
});

// Main execution
if (process.argv.includes('--help')) {
  showUsage();
  process.exit(0);
}

runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(colorize('Fatal error:', 'red'), error);
    process.exit(1);
  });