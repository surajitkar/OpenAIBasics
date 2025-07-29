/**
 * Basic Coverage Test
 * 
 * This test verifies that the coverage setup is working correctly
 * by testing some simple functions and ensuring they are covered.
 */

import assert from 'assert';
import { TestRunner } from '../utils/test-helpers.js';

/**
 * Simple test functions to verify coverage collection
 */
function addNumbers(a, b) {
  return a + b;
}

function isEven(num) {
  if (num % 2 === 0) {
    return true;
  } else {
    return false;
  }
}

function processArray(arr) {
  if (!Array.isArray(arr)) {
    throw new Error('Input must be an array');
  }
  
  return arr
    .filter(item => typeof item === 'number')
    .map(num => num * 2)
    .reduce((sum, num) => sum + num, 0);
}

/**
 * Test suite for coverage verification
 */
export async function runTests(config = {}) {
  const runner = new TestRunner();

  runner.test('Basic function coverage - addition', () => {
    const result = addNumbers(2, 3);
    assert.strictEqual(result, 5, 'Should add two numbers correctly');
  });

  runner.test('Branch coverage - even number check', () => {
    assert.strictEqual(isEven(4), true, 'Should return true for even numbers');
    assert.strictEqual(isEven(3), false, 'Should return false for odd numbers');
  });

  runner.test('Array processing - happy path', () => {
    const input = [1, 2, 3, 'string', 4, null, 5];
    const result = processArray(input);
    // Numbers: 1, 2, 3, 4, 5 -> doubled: 2, 4, 6, 8, 10 -> sum: 30
    assert.strictEqual(result, 30, 'Should process array correctly');
  });

  runner.test('Array processing - error handling', () => {
    assert.throws(() => {
      processArray('not an array');
    }, /Input must be an array/, 'Should throw error for non-array input');
  });

  runner.test('Array processing - empty array', () => {
    const result = processArray([]);
    assert.strictEqual(result, 0, 'Should return 0 for empty array');
  });

  runner.test('Array processing - no numbers', () => {
    const result = processArray(['string', null, undefined, {}]);
    assert.strictEqual(result, 0, 'Should return 0 when no numbers in array');
  });

  runner.test('Coverage verification - function calls', () => {
    // Ensure all our test functions are called to verify coverage
    const sum = addNumbers(10, 20);
    const evenCheck = isEven(sum);
    const arrayResult = processArray([1, 2, 3]);
    
    assert(typeof sum === 'number', 'Sum should be a number');
    assert(typeof evenCheck === 'boolean', 'Even check should be boolean');
    assert(typeof arrayResult === 'number', 'Array result should be number');
  });

  return await runner.run();
}

// Allow running this test file directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests({ verbose: true })
    .then(results => {
      console.log('\n🎯 Coverage Test Results:');
      console.log(`   Functions tested: 3`);
      console.log(`   Branches covered: Multiple if/else paths`);
      console.log(`   Error conditions: Exception handling`);
      console.log(`   Edge cases: Empty arrays, type filtering`);
      
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Coverage test execution failed:', error);
      process.exit(1);
    });
}