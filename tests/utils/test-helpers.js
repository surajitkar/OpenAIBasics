/**
 * Test Helper Utilities
 * 
 * Shared utilities for testing across the OpenAI Basics project.
 * Uses Node.js built-in assert module for testing.
 */

import assert from 'assert';
import { OpenAI } from 'openai';

/**
 * Environment validation helpers
 */
export class TestEnv {
  /**
   * Check if API key is available for integration tests
   */
  static hasApiKey() {
    return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim());
  }

  /**
   * Check if organization ID is available
   */
  static hasOrgId() {
    return !!(process.env.OPENAI_ORG_ID && process.env.OPENAI_ORG_ID.trim());
  }

  /**
   * Validate API key format (basic validation)
   */
  static isValidApiKeyFormat(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') return false;
    // OpenAI API keys typically start with 'sk-' and are 51+ characters
    return apiKey.startsWith('sk-') && apiKey.length >= 20;
  }

  /**
   * Skip test if no API key is available
   */
  static skipIfNoApiKey(testName) {
    if (!this.hasApiKey()) {
      console.log(`⏭️  Skipping integration test "${testName}" - no API key available`);
      return true;
    }
    return false;
  }

  /**
   * Create a test OpenAI client with validation
   */
  static createTestClient() {
    if (!this.hasApiKey()) {
      throw new Error('No API key available for testing');
    }
    
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID || undefined
    });
  }
}

/**
 * Mock data generators for testing
 */
export class MockData {
  /**
   * Generate mock OpenAI chat completion response
   */
  static mockChatCompletion(overrides = {}) {
    return {
      id: 'chatcmpl-test123',
      object: 'chat.completion',
      created: Date.now(),
      model: 'gpt-4o-mini',
      choices: [{
        index: 0,
        message: {
          role: 'assistant',
          content: 'This is a test response'
        },
        finish_reason: 'stop'
      }],
      usage: {
        prompt_tokens: 10,
        completion_tokens: 15,
        total_tokens: 25
      },
      ...overrides
    };
  }

  /**
   * Generate mock conversation messages
   */
  static mockMessages(count = 2) {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' }
    ];
    
    for (let i = 0; i < count; i++) {
      messages.push({ role: 'user', content: `Test message ${i + 1}` });
      if (i < count - 1) {
        messages.push({ role: 'assistant', content: `Test response ${i + 1}` });
      }
    }
    
    return messages;
  }

  /**
   * Generate mock usage data for cost calculations
   */
  static mockUsage(model = 'gpt-4o-mini') {
    const baseUsage = {
      'gpt-4o-mini': { prompt_tokens: 50, completion_tokens: 30, total_tokens: 80 },
      'gpt-4o': { prompt_tokens: 100, completion_tokens: 75, total_tokens: 175 },
      'gpt-3.5-turbo': { prompt_tokens: 40, completion_tokens: 25, total_tokens: 65 }
    };
    
    return baseUsage[model] || baseUsage['gpt-4o-mini'];
  }
}

/**
 * Test assertion helpers
 */
export class TestAssert {
  /**
   * Assert that a value is a valid cost (number >= 0)
   */
  static isValidCost(cost, message = 'Invalid cost value') {
    assert(typeof cost === 'number', `${message}: must be a number`);
    assert(cost >= 0, `${message}: must be >= 0`);
    assert(!isNaN(cost), `${message}: must not be NaN`);
  }

  /**
   * Assert that token usage object has required properties
   */
  static isValidUsage(usage, message = 'Invalid usage object') {
    assert(usage && typeof usage === 'object', `${message}: must be an object`);
    assert(typeof usage.prompt_tokens === 'number', `${message}: prompt_tokens must be a number`);
    assert(typeof usage.completion_tokens === 'number', `${message}: completion_tokens must be a number`);
    assert(typeof usage.total_tokens === 'number', `${message}: total_tokens must be a number`);
    assert(usage.total_tokens === usage.prompt_tokens + usage.completion_tokens, 
           `${message}: total_tokens must equal prompt + completion tokens`);
  }

  /**
   * Assert that a number is approximately equal (for floating point comparisons)
   */
  static approximately(actual, expected, tolerance = 0.000001, message = 'Values not approximately equal') {
    const diff = Math.abs(actual - expected);
    assert(diff <= tolerance, `${message}: ${actual} ≈ ${expected} (diff: ${diff}, tolerance: ${tolerance})`);
  }

  /**
   * Assert that an object has required properties
   */
  static hasProperties(obj, properties, message = 'Object missing required properties') {
    assert(obj && typeof obj === 'object', `${message}: must be an object`);
    for (const prop of properties) {
      assert(obj.hasOwnProperty(prop), `${message}: missing property '${prop}'`);
    }
  }
}

/**
 * Test runner utilities
 */
export class TestRunner {
  constructor() {
    this.tests = [];
    this.results = { passed: 0, failed: 0, skipped: 0 };
  }

  /**
   * Add a test to the runner
   */
  test(name, testFn, options = {}) {
    this.tests.push({ name, testFn, options });
  }

  /**
   * Run all tests
   */
  async run() {
    console.log(`🧪 Running ${this.tests.length} tests...\n`);
    
    for (const { name, testFn, options } of this.tests) {
      try {
        // Check if test should be skipped
        if (options.skipIf && options.skipIf()) {
          console.log(`⏭️  SKIP: ${name}`);
          this.results.skipped++;
          continue;
        }

        // Run the test
        await testFn();
        console.log(`✅ PASS: ${name}`);
        this.results.passed++;
      } catch (error) {
        console.log(`❌ FAIL: ${name}`);
        console.log(`   Error: ${error.message}`);
        if (options.verbose) {
          console.log(`   Stack: ${error.stack}`);
        }
        this.results.failed++;
      }
    }

    return this.printSummary();
  }

  /**
   * Print test results summary
   */
  printSummary() {
    const total = this.results.passed + this.results.failed + this.results.skipped;
    console.log(`\n📊 Test Summary:`);
    console.log(`   Total: ${total}`);
    console.log(`   Passed: ${this.results.passed}`);
    console.log(`   Failed: ${this.results.failed}`);
    console.log(`   Skipped: ${this.results.skipped}`);
    
    if (this.results.failed > 0) {
      console.log(`\n❌ ${this.results.failed} test(s) failed`);
    } else {
      console.log(`\n✅ All tests passed!`);
    }
    
    return this.results;
  }
}

/**
 * Pricing data for cost calculations (matches token-cost-demo.js)
 */
export const PRICING = {
  'gpt-4o-mini': { input: 0.150, output: 0.600 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 }
};

/**
 * Calculate expected cost for testing
 */
export function calculateExpectedCost(usage, model) {
  if (!PRICING[model]) {
    throw new Error(`Unknown model: ${model}`);
  }
  
  const pricing = PRICING[model];
  const inputCost = (usage.prompt_tokens / 1_000_000) * pricing.input;
  const outputCost = (usage.completion_tokens / 1_000_000) * pricing.output;
  
  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost
  };
}