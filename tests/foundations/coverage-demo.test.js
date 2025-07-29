/**
 * Coverage Demo Test
 * 
 * Simple test to demonstrate and verify coverage collection works properly.
 * This test exercises basic functionality to ensure coverage metrics are accurate.
 */

import assert from 'assert';
import { TestRunner } from '../utils/test-helpers.js';

/**
 * Simple utility functions to test coverage
 */
class CoverageDemo {
  static add(a, b) {
    return a + b;
  }
  
  static multiply(a, b) {
    return a * b;
  }
  
  static divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }
  
  static isEven(num) {
    return num % 2 === 0;
  }
  
  static processArray(arr) {
    if (!Array.isArray(arr)) {
      return [];
    }
    
    return arr
      .filter(item => typeof item === 'number')
      .map(num => num * 2)
      .sort((a, b) => a - b);
  }
}

/**
 * Test suite for coverage demonstration
 */
export async function runTests(config = {}) {
  const runner = new TestRunner();

  runner.test('Basic arithmetic - addition', () => {
    assert.strictEqual(CoverageDemo.add(2, 3), 5);
    assert.strictEqual(CoverageDemo.add(-1, 1), 0);
    assert.strictEqual(CoverageDemo.add(0, 0), 0);
  });

  runner.test('Basic arithmetic - multiplication', () => {
    assert.strictEqual(CoverageDemo.multiply(3, 4), 12);
    assert.strictEqual(CoverageDemo.multiply(-2, 5), -10);
    assert.strictEqual(CoverageDemo.multiply(0, 100), 0);
  });

  runner.test('Division with error handling', () => {
    assert.strictEqual(CoverageDemo.divide(10, 2), 5);
    assert.strictEqual(CoverageDemo.divide(7, 2), 3.5);
    
    // Test error case
    assert.throws(() => {
      CoverageDemo.divide(5, 0);
    }, /Division by zero/);
  });

  runner.test('Even number detection', () => {
    assert.strictEqual(CoverageDemo.isEven(2), true);
    assert.strictEqual(CoverageDemo.isEven(3), false);
    assert.strictEqual(CoverageDemo.isEven(0), true);
    assert.strictEqual(CoverageDemo.isEven(-4), true);
    assert.strictEqual(CoverageDemo.isEven(-3), false);
  });

  runner.test('Array processing - valid input', () => {
    const input = [1, 'hello', 3, null, 5, 'world', 2];
    const expected = [2, 4, 6, 10]; // [1, 3, 5, 2] -> [2, 6, 10, 4] -> sorted
    const result = CoverageDemo.processArray(input);
    
    assert.deepStrictEqual(result, expected);
  });

  runner.test('Array processing - edge cases', () => {
    // Empty array
    assert.deepStrictEqual(CoverageDemo.processArray([]), []);
    
    // Non-array input
    assert.deepStrictEqual(CoverageDemo.processArray(null), []);
    assert.deepStrictEqual(CoverageDemo.processArray('not an array'), []);
    
    // Array with no numbers
    assert.deepStrictEqual(CoverageDemo.processArray(['a', 'b', 'c']), []);
    
    // Array with only numbers
    assert.deepStrictEqual(CoverageDemo.processArray([3, 1, 4, 2]), [2, 6, 8, 4]);
  });

  runner.test('Coverage metrics validation', () => {
    // This test ensures we're actually testing the functions
    // and that coverage collection is working
    
    // Test that all methods exist
    assert.strictEqual(typeof CoverageDemo.add, 'function');
    assert.strictEqual(typeof CoverageDemo.multiply, 'function');
    assert.strictEqual(typeof CoverageDemo.divide, 'function');
    assert.strictEqual(typeof CoverageDemo.isEven, 'function');
    assert.strictEqual(typeof CoverageDemo.processArray, 'function');
    
    // Test that we can call all methods without errors
    assert.doesNotThrow(() => CoverageDemo.add(1, 1));
    assert.doesNotThrow(() => CoverageDemo.multiply(1, 1));
    assert.doesNotThrow(() => CoverageDemo.divide(2, 1));
    assert.doesNotThrow(() => CoverageDemo.isEven(1));
    assert.doesNotThrow(() => CoverageDemo.processArray([1]));
  });

  return await runner.run();
}

// Allow running this test file directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests({ verbose: true })
    .then(results => {
      console.log('\n📊 Coverage Demo Test Results:');
      console.log(`   Passed: ${results.passed}`);
      console.log(`   Failed: ${results.failed}`);
      console.log(`   Skipped: ${results.skipped}`);
      
      if (process.env.NODE_V8_COVERAGE) {
        console.log('\n📈 Coverage collection is active!');
        console.log('   Run "npm run test:coverage:report" to see coverage reports');
      }
      
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}