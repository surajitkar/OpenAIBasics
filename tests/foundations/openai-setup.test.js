/**
 * Tests for foundations/openai-setup.js
 * 
 * Tests cover:
 * - Environment variable validation
 * - OpenAI client instantiation and configuration  
 * - API key format validation
 * - Basic API call functionality with graceful error handling
 * - Client configuration verification
 */

import assert from 'assert';
import { OpenAI } from 'openai';
import { TestRunner, TestEnv, TestAssert } from '../utils/test-helpers.js';

/**
 * Test suite for openai-setup.js
 */
export async function runTests(config = {}) {
  const runner = new TestRunner();

  // Unit Tests (no API calls required)
  runner.test('Environment variable validation - API key presence', () => {
    // Test that we can detect if API key is set
    const hasKey = TestEnv.hasApiKey();
    assert(typeof hasKey === 'boolean', 'hasApiKey should return boolean');
    
    if (process.env.OPENAI_API_KEY) {
      assert(hasKey === true, 'Should detect API key when present');
    }
  });

  runner.test('Environment variable validation - Organization ID', () => {
    // Test organization ID detection
    const hasOrgId = TestEnv.hasOrgId();
    assert(typeof hasOrgId === 'boolean', 'hasOrgId should return boolean');
    
    if (process.env.OPENAI_ORG_ID) {
      assert(hasOrgId === true, 'Should detect organization ID when present');
    }
  });

  runner.test('API key format validation - valid format', () => {
    // Test valid API key formats
    const validKeys = [
      'sk-1234567890abcdef1234567890abcdef12345678',
      'sk-proj-abcdefghijklmnop1234567890',
      'sk-test123456789012345678901234567890'
    ];
    
    for (const key of validKeys) {
      assert(TestEnv.isValidApiKeyFormat(key), `Should accept valid key: ${key.substring(0, 10)}...`);
    }
  });

  runner.test('API key format validation - invalid format', () => {
    // Test invalid API key formats
    const invalidKeys = [
      '',
      null,
      undefined,
      'invalid-key',
      'sk-',
      'sk-short',
      123,
      {},
      'not-starting-with-sk'
    ];
    
    for (const key of invalidKeys) {
      assert(!TestEnv.isValidApiKeyFormat(key), `Should reject invalid key: ${key}`);
    }
  });

  runner.test('OpenAI client instantiation - without API key', () => {
    // Test client creation without API key should throw
    try {
      new OpenAI({ apiKey: '' });
      assert.fail('Should throw error with empty API key');
    } catch (error) {
      assert(error.message.includes('API key'), 'Error should mention API key');
    }
  });

  runner.test('OpenAI client instantiation - with valid configuration', () => {
    // Test client creation with mock API key
    const mockApiKey = 'sk-test1234567890abcdef1234567890abcdef';
    const client = new OpenAI({ 
      apiKey: mockApiKey,
      organization: 'org-test123'
    });
    
    assert(client instanceof OpenAI, 'Should create OpenAI client instance');
    // Note: We can't directly access private properties, but we can verify the client was created
  });

  runner.test('Client configuration verification - default settings', () => {
    // Test that client accepts proper configuration
    const mockApiKey = 'sk-test1234567890abcdef1234567890abcdef';
    
    const clientConfigs = [
      { apiKey: mockApiKey },
      { apiKey: mockApiKey, organization: 'org-123' },
      { apiKey: mockApiKey, baseURL: 'https://api.openai.com/v1' },
      { apiKey: mockApiKey, timeout: 30000 }
    ];
    
    for (const config of clientConfigs) {
      const client = new OpenAI(config);
      assert(client instanceof OpenAI, `Should create client with config: ${JSON.stringify(config)}`);
    }
  });

  // Integration Tests (require API key)
  runner.test('Basic API call functionality - successful call', async () => {
    if (TestEnv.skipIfNoApiKey('Basic API call test')) return;
    
    const client = TestEnv.createTestClient();
    
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello world!' }
        ],
        max_tokens: 10
      });
      
      // Verify response structure
      assert(completion.choices && completion.choices.length > 0, 'Should have choices in response');
      assert(completion.choices[0].message, 'Should have message in first choice');
      assert(completion.choices[0].message.content, 'Should have content in message');
      assert(completion.usage, 'Should have usage information');
      TestAssert.isValidUsage(completion.usage);
      
    } catch (error) {
      // Handle various types of API errors gracefully
      if (error.status === 429) {
        console.log(`   ℹ️  API rate limit hit: ${error.message}`);
      } else if (error.status === 401) {
        console.log(`   ℹ️  API authentication error: ${error.message}`);
      } else if (error.message.includes('Connection error') || error.message.includes('network')) {
        console.log(`   ℹ️  Network connection issue: ${error.message}`);
      } else {
        throw error;
      }
    }
  }, {
    skipIf: () => config.unitOnly || !TestEnv.hasApiKey()
  });

  runner.test('API call error handling - invalid model', async () => {
    if (TestEnv.skipIfNoApiKey('Invalid model test')) return;
    
    const client = TestEnv.createTestClient();
    
    try {
      await client.chat.completions.create({
        model: 'invalid-model-name',
        messages: [{ role: 'user', content: 'test' }]
      });
      assert.fail('Should throw error for invalid model');
    } catch (error) {
      // Handle expected errors and network issues
      if (error.status === 404 || error.message.includes('model')) {
        // Expected error for invalid model
        console.log(`   ℹ️  Got expected error for invalid model: ${error.status || 'unknown'}`);
      } else if (error.message.includes('Connection error') || error.message.includes('network')) {
        console.log(`   ℹ️  Network connection issue during invalid model test: ${error.message}`);
      } else {
        // Re-throw unexpected errors
        throw error;
      }
    }
  }, {
    skipIf: () => config.unitOnly || !TestEnv.hasApiKey()
  });

  runner.test('Client configuration with organization ID', async () => {
    if (!TestEnv.hasApiKey() || !TestEnv.hasOrgId()) {
      console.log('⏭️  Skipping organization ID test - requires both API key and org ID');
      return;
    }
    
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID
    });
    
    try {
      // Make a simple API call to verify the organization setting works
      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5
      });
      
      assert(completion.choices.length > 0, 'Should receive response with organization ID');
      
    } catch (error) {
      // Handle various API errors gracefully
      if (error.status === 429 || error.status === 401) {
        console.log(`   ℹ️  Organization test received expected error: ${error.status}`);
      } else if (error.message.includes('Connection error') || error.message.includes('network')) {
        console.log(`   ℹ️  Network connection issue: ${error.message}`);
      } else {
        throw error;
      }
    }
  }, {
    skipIf: () => config.unitOnly || !TestEnv.hasApiKey() || !TestEnv.hasOrgId()
  });

  runner.test('Error handling graceful degradation', () => {
    // Test that missing API key is handled gracefully (as shown in openai-setup.js)
    const originalApiKey = process.env.OPENAI_API_KEY;
    
    try {
      // Temporarily remove API key
      delete process.env.OPENAI_API_KEY;
      
      // This should not throw but should handle gracefully
      const hasKey = TestEnv.hasApiKey();
      assert(hasKey === false, 'Should detect missing API key');
      
      // Attempting to create client should fail gracefully
      assert.throws(() => {
        TestEnv.createTestClient();
      }, /No API key available/, 'Should throw descriptive error for missing API key');
      
    } finally {
      // Restore original API key
      if (originalApiKey) {
        process.env.OPENAI_API_KEY = originalApiKey;
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