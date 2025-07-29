#!/usr/bin/env node
/**
 * Simple test coverage verification script
 * This script runs the test coverage and displays the results
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Running Test Coverage Analysis...');
console.log('=====================================\n');

// Run the coverage command
const coverageProcess = spawn('npm', ['run', 'test:coverage-unit'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

coverageProcess.on('close', (code) => {
  console.log(`\n📊 Coverage analysis completed with exit code: ${code}`);
  
  if (code === 0) {
    console.log('✅ Coverage analysis successful!');
    console.log('\n📁 Coverage reports generated in:');
    console.log('   - HTML report: coverage/index.html');
    console.log('   - Text summary: displayed above');
    console.log('   - JSON summary: coverage/coverage-summary.json');
  } else {
    console.log('❌ Coverage analysis failed');
  }
  
  process.exit(code);
});

coverageProcess.on('error', (error) => {
  console.error('❌ Failed to run coverage analysis:', error.message);
  process.exit(1);
});