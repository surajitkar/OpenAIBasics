#!/usr/bin/env node
/**
 * Coverage Demonstration Script
 * 
 * This script demonstrates the test coverage functionality by:
 * 1. Running unit tests with coverage
 * 2. Displaying coverage summary
 * 3. Showing which files need more tests
 */

import { spawn } from 'child_process';
import { readFile, access } from 'fs/promises';
import { join } from 'path';

console.log('🎯 OpenAI Hackathon Starter - Test Coverage Demo');
console.log('================================================\n');

console.log('📋 Coverage Configuration:');
console.log('   • Tool: c8 (Node.js coverage)');
console.log('   • Target: 70% lines, 70% functions, 60% branches');
console.log('   • Reports: HTML, Text, JSON');
console.log('   • Mode: Unit tests (no API key required)\n');

console.log('🔍 Source Files Included in Coverage:');
console.log('   • foundations/ - OpenAI setup and cost analysis');
console.log('   • advanced/ - Function calling and weather API');
console.log('   • agents/ - Agent SDK demonstrations');
console.log('   • assistants/ - Assistant API examples');
console.log('   • chatbot/ - Interactive chatbot');
console.log('   • index.js, demo-all.js - Main entry points\n');

console.log('🧪 Running Unit Tests with Coverage...');
console.log('─'.repeat(50));

// Run coverage analysis
const coverageProcess = spawn('npm', ['run', 'test:coverage-unit'], {
  stdio: 'inherit',
  shell: true
});

coverageProcess.on('close', async (code) => {
  console.log('\n' + '─'.repeat(50));
  
  if (code === 0) {
    console.log('✅ Coverage Analysis Completed Successfully!\n');
    
    // Try to read and display coverage summary
    try {
      const summaryPath = join(process.cwd(), 'coverage', 'coverage-summary.json');
      await access(summaryPath);
      
      const summaryData = await readFile(summaryPath, 'utf-8');
      const summary = JSON.parse(summaryData);
      
      console.log('📊 Coverage Summary:');
      console.log('   Lines:      ' + summary.total.lines.pct + '%');
      console.log('   Functions:  ' + summary.total.functions.pct + '%');
      console.log('   Branches:   ' + summary.total.branches.pct + '%');
      console.log('   Statements: ' + summary.total.statements.pct + '%\n');
      
      // Show file-by-file breakdown
      console.log('📁 File Coverage Breakdown:');
      Object.entries(summary).forEach(([file, data]) => {
        if (file !== 'total' && data.lines) {
          const fileName = file.replace(process.cwd() + '/', '');
          const linesPct = data.lines.pct;
          const status = linesPct >= 70 ? '✅' : linesPct >= 50 ? '⚠️' : '❌';
          console.log(`   ${status} ${fileName}: ${linesPct}% lines`);
        }
      });
      
    } catch (error) {
      console.log('ℹ️  Coverage summary not available (this is normal for first run)');
    }
    
    console.log('\n📖 Next Steps:');
    console.log('   1. Open coverage/index.html in your browser for detailed report');
    console.log('   2. Run "npm run test:coverage" for full coverage with integration tests');
    console.log('   3. Add tests for uncovered files to improve coverage');
    console.log('   4. See tests/COVERAGE.md for detailed documentation\n');
    
    console.log('🚀 Coverage Commands Available:');
    console.log('   npm run test:coverage        # Full coverage analysis');
    console.log('   npm run test:coverage-unit   # Unit tests only');
    console.log('   npm run coverage:check       # Check coverage thresholds');
    console.log('   npm run coverage:report      # Generate reports from existing data');
    
  } else {
    console.log('❌ Coverage analysis failed with exit code:', code);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure all dependencies are installed: npm install');
    console.log('   2. Check that test files are valid');
    console.log('   3. Review error messages above for specific issues');
  }
  
  process.exit(code);
});

coverageProcess.on('error', (error) => {
  console.error('❌ Failed to run coverage analysis:', error.message);
  console.log('\n🔧 Make sure you have run: npm install');
  process.exit(1);
});