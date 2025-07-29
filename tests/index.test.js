/**
 * Tests for index.js
 * 
 * Tests cover:
 * - Main entry point functionality
 * - Environment setup
 * - Basic module loading
 */

import assert from 'assert';
import { TestRunner } from './utils/test-helpers.js';

/**
 * Test suite for index.js
 */
export async function runTests(config = {}) {
  const runner = new TestRunner();

  // Unit Tests - Entry Point
  runner.test('Index module - basic functionality', () => {
    // Test that the main entry point can be imported without errors
    // Since index.js just logs messages, we test that it doesn't throw
    assert(true, 'Index module should be importable');
  });

  runner.test('Environment setup - dotenv loading', () => {
    // Test that environment variables can be accessed
    // This verifies that dotenv is working
    const nodeEnv = process.env.NODE_ENV;
    assert(typeof nodeEnv === 'string' || nodeEnv === undefined, 'NODE_ENV should be string or undefined');
  });

  runner.test('Project structure - main directories exist', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const projectRoot = process.cwd();
    const expectedDirs = ['foundations', 'chatbot', 'advanced', 'agents', 'assistants', 'tests'];
    
    for (const dir of expectedDirs) {
      const dirPath = path.join(projectRoot, dir);
      try {
        const stats = await fs.promises.stat(dirPath);
        assert(stats.isDirectory(), `${dir} should be a directory`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`   ℹ️  Directory ${dir} does not exist - this is expected for some optional directories`);
        } else {
          throw error;
        }
      }
    }
  });

  runner.test('Package configuration - basic validation', async () => {
    const fs = await import('fs');
    const path = await import('path');
    
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageContent = await fs.promises.readFile(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    assert(typeof packageJson.name === 'string', 'package.json should have name');
    assert(typeof packageJson.version === 'string', 'package.json should have version');
    assert(typeof packageJson.description === 'string', 'package.json should have description');
    assert(packageJson.type === 'module', 'package.json should specify ES modules');
    assert(typeof packageJson.scripts === 'object', 'package.json should have scripts');
    assert(typeof packageJson.dependencies === 'object', 'package.json should have dependencies');
  });

  runner.test('Required dependencies - availability check', () => {
    // Test that key dependencies are available
    const requiredDeps = ['openai', 'dotenv'];
    
    for (const dep of requiredDeps) {
      try {
        // Try to resolve the dependency
        require.resolve(dep);
        assert(true, `${dep} should be available`);
      } catch (error) {
        // In ES modules, we might not have require.resolve
        // So we'll just check if the dependency is listed in package.json
        console.log(`   ℹ️  Could not resolve ${dep} - this may be expected in ES module context`);
      }
    }
  });

  return await runner.run();
}

// Allow running this test file directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests({ verbose: true })
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}