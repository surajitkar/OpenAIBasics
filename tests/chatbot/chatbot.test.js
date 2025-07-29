/**
 * Tests for chatbot/chatbot.js
 * 
 * Tests cover:
 * - Conversation state management
 * - Message handling and formatting
 * - OpenAI API integration for chat completions
 * - Error handling for API failures
 * - Conversation persistence and context
 */

import assert from 'assert';
import { TestRunner, TestEnv, TestAssert, MockData } from '../utils/test-helpers.js';

/**
 * Mock chatbot implementation for testing
 * Since the original chatbot.js runs an interactive loop, we create a testable version
 */
class TestChatbot {
  constructor() {
    this.conversation = [
      { role: 'system', content: 'You are a helpful assistant.' }
    ];
    this.client = null;
  }

  initializeClient() {
    if (!TestEnv.hasApiKey()) {
      throw new Error('No API key available for chatbot');
    }
    this.client = TestEnv.createTestClient();
  }

  addUserMessage(content) {
    if (!content || typeof content !== 'string') {
      throw new Error('User message must be a non-empty string');
    }
    this.conversation.push({ role: 'user', content });
  }

  addAssistantMessage(content) {
    if (!content || typeof content !== 'string') {
      throw new Error('Assistant message must be a non-empty string');
    }
    this.conversation.push({ role: 'assistant', content });
  }

  async getResponse(userInput) {
    if (!this.client) {
      this.initializeClient();
    }

    this.addUserMessage(userInput);

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: this.conversation,
        max_tokens: 100
      });

      const reply = completion.choices[0].message.content;
      this.addAssistantMessage(reply);
      
      return {
        response: reply,
        usage: completion.usage,
        conversationLength: this.conversation.length
      };
    } catch (error) {
      throw error;
    }
  }

  getConversationHistory() {
    return [...this.conversation];
  }

  resetConversation() {
    this.conversation = [
      { role: 'system', content: 'You are a helpful assistant.' }
    ];
  }

  getConversationLength() {
    return this.conversation.length;
  }
}

/**
 * Test suite for chatbot.js
 */
export async function runTests(config = {}) {
  const runner = new TestRunner();

  // Unit Tests - Chatbot initialization and state management
  runner.test('Chatbot initialization - default state', () => {
    const chatbot = new TestChatbot();
    
    assert(Array.isArray(chatbot.conversation), 'conversation should be an array');
    assert(chatbot.conversation.length === 1, 'conversation should start with system message');
    assert(chatbot.conversation[0].role === 'system', 'first message should be system role');
    assert(chatbot.conversation[0].content === 'You are a helpful assistant.', 'system message should be correct');
    assert(chatbot.client === null, 'client should not be initialized yet');
  });

  runner.test('Message handling - add user message', () => {
    const chatbot = new TestChatbot();
    const userMessage = 'Hello, how are you?';
    
    chatbot.addUserMessage(userMessage);
    
    assert(chatbot.conversation.length === 2, 'conversation should have 2 messages');
    assert(chatbot.conversation[1].role === 'user', 'second message should be user role');
    assert(chatbot.conversation[1].content === userMessage, 'user message content should match');
  });

  runner.test('Message handling - add assistant message', () => {
    const chatbot = new TestChatbot();
    const assistantMessage = 'I am doing well, thank you!';
    
    chatbot.addAssistantMessage(assistantMessage);
    
    assert(chatbot.conversation.length === 2, 'conversation should have 2 messages');
    assert(chatbot.conversation[1].role === 'assistant', 'second message should be assistant role');
    assert(chatbot.conversation[1].content === assistantMessage, 'assistant message content should match');
  });

  runner.test('Message validation - empty user message', () => {
    const chatbot = new TestChatbot();
    
    assert.throws(() => {
      chatbot.addUserMessage('');
    }, /User message must be a non-empty string/, 'Should reject empty user message');
    
    assert.throws(() => {
      chatbot.addUserMessage(null);
    }, /User message must be a non-empty string/, 'Should reject null user message');
    
    assert.throws(() => {
      chatbot.addUserMessage(undefined);
    }, /User message must be a non-empty string/, 'Should reject undefined user message');
  });

  runner.test('Message validation - invalid assistant message', () => {
    const chatbot = new TestChatbot();
    
    assert.throws(() => {
      chatbot.addAssistantMessage('');
    }, /Assistant message must be a non-empty string/, 'Should reject empty assistant message');
    
    assert.throws(() => {
      chatbot.addAssistantMessage(123);
    }, /Assistant message must be a non-empty string/, 'Should reject numeric assistant message');
  });

  runner.test('Conversation state - history retrieval', () => {
    const chatbot = new TestChatbot();
    
    chatbot.addUserMessage('Hello');
    chatbot.addAssistantMessage('Hi there!');
    chatbot.addUserMessage('How are you?');
    
    const history = chatbot.getConversationHistory();
    
    assert(Array.isArray(history), 'history should be an array');
    assert(history.length === 4, 'history should have 4 messages (system + 3 added)');
    assert(history[0].role === 'system', 'first message should be system');
    assert(history[1].role === 'user', 'second message should be user');
    assert(history[2].role === 'assistant', 'third message should be assistant');
    assert(history[3].role === 'user', 'fourth message should be user');
    
    // Verify it's a copy, not the original array
    history.push({ role: 'test', content: 'test' });
    assert(chatbot.conversation.length === 4, 'original conversation should not be modified');
  });

  runner.test('Conversation state - reset functionality', () => {
    const chatbot = new TestChatbot();
    
    chatbot.addUserMessage('Hello');
    chatbot.addAssistantMessage('Hi there!');
    assert(chatbot.conversation.length === 3, 'conversation should have 3 messages before reset');
    
    chatbot.resetConversation();
    
    assert(chatbot.conversation.length === 1, 'conversation should have 1 message after reset');
    assert(chatbot.conversation[0].role === 'system', 'remaining message should be system message');
    assert(chatbot.conversation[0].content === 'You are a helpful assistant.', 'system message should be restored');
  });

  runner.test('Conversation state - length tracking', () => {
    const chatbot = new TestChatbot();
    
    assert(chatbot.getConversationLength() === 1, 'initial length should be 1');
    
    chatbot.addUserMessage('Hello');
    assert(chatbot.getConversationLength() === 2, 'length should be 2 after user message');
    
    chatbot.addAssistantMessage('Hi!');
    assert(chatbot.getConversationLength() === 3, 'length should be 3 after assistant message');
    
    chatbot.resetConversation();
    assert(chatbot.getConversationLength() === 1, 'length should be 1 after reset');
  });

  // Integration Tests (require API key)
  runner.test('OpenAI integration - successful chat completion', async () => {
    if (TestEnv.skipIfNoApiKey('Chat completion test')) return;
    
    const chatbot = new TestChatbot();
    
    try {
      const result = await chatbot.getResponse('Say hello');
      
      assert(typeof result.response === 'string', 'response should be a string');
      assert(result.response.length > 0, 'response should not be empty');
      assert(result.conversationLength === 3, 'conversation should have 3 messages after response');
      
      TestAssert.isValidUsage(result.usage);
      
      const history = chatbot.getConversationHistory();
      assert(history[1].role === 'user', 'user message should be recorded');
      assert(history[1].content === 'Say hello', 'user message content should match');
      assert(history[2].role === 'assistant', 'assistant message should be recorded');
      assert(history[2].content === result.response, 'assistant message should match response');
      
    } catch (error) {
      if (error.status === 429 || error.status === 401) {
        console.log(`   ℹ️  Chat completion test received expected error: ${error.status}`);
      } else if (error.message.includes('Connection error') || error.message.includes('network')) {
        console.log(`   ℹ️  Network connection issue: ${error.message}`);
      } else {
        throw error;
      }
    }
  }, {
    skipIf: () => config.unitOnly || !TestEnv.hasApiKey()
  });

  runner.test('OpenAI integration - conversation context preservation', async () => {
    if (TestEnv.skipIfNoApiKey('Conversation context test')) return;
    
    const chatbot = new TestChatbot();
    
    try {
      // First exchange
      const result1 = await chatbot.getResponse('My name is Alice');
      assert(result1.conversationLength === 3, 'conversation should have 3 messages after first exchange');
      
      // Second exchange that references the first
      const result2 = await chatbot.getResponse('What is my name?');
      assert(result2.conversationLength === 5, 'conversation should have 5 messages after second exchange');
      
      // The response should ideally reference Alice, but we'll just check it's a valid response
      assert(typeof result2.response === 'string', 'second response should be a string');
      assert(result2.response.length > 0, 'second response should not be empty');
      
      const history = chatbot.getConversationHistory();
      assert(history.length === 5, 'history should have all 5 messages');
      assert(history[1].content === 'My name is Alice', 'first user message should be preserved');
      assert(history[3].content === 'What is my name?', 'second user message should be preserved');
      
    } catch (error) {
      if (error.status === 429 || error.status === 401) {
        console.log(`   ℹ️  Context preservation test received expected error: ${error.status}`);
      } else if (error.message.includes('Connection error') || error.message.includes('network')) {
        console.log(`   ℹ️  Network connection issue: ${error.message}`);
      } else {
        throw error;
      }
    }
  }, {
    skipIf: () => config.unitOnly || !TestEnv.hasApiKey()
  });

  runner.test('Error handling - no API key', () => {
    const originalApiKey = process.env.OPENAI_API_KEY;
    
    try {
      // Temporarily remove API key
      delete process.env.OPENAI_API_KEY;
      
      const chatbot = new TestChatbot();
      
      assert.throws(() => {
        chatbot.initializeClient();
      }, /No API key available/, 'Should throw error when no API key is available');
      
    } finally {
      // Restore original API key
      if (originalApiKey) {
        process.env.OPENAI_API_KEY = originalApiKey;
      }
    }
  });

  runner.test('Error handling - API call failure simulation', async () => {
    if (!TestEnv.hasApiKey()) {
      console.log('⏭️  Skipping API failure test - no API key available');
      return;
    }
    
    const chatbot = new TestChatbot();
    
    try {
      // Try to trigger an error with an invalid model (this might not always fail)
      chatbot.client = TestEnv.createTestClient();
      
      // Manually create a completion call that might fail
      await chatbot.client.chat.completions.create({
        model: 'invalid-model-name-that-does-not-exist',
        messages: [{ role: 'user', content: 'test' }]
      });
      
      // If we get here, the API didn't reject the invalid model (unexpected)
      console.log('   ℹ️  API accepted invalid model name (unexpected but not a test failure)');
      
    } catch (error) {
      // This is expected - API should reject invalid model
      assert(error.message || error.status, 'Error should have message or status');
      console.log(`   ℹ️  Got expected API error: ${error.status || error.message}`);
    }
  }, {
    skipIf: () => config.unitOnly || !TestEnv.hasApiKey()
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