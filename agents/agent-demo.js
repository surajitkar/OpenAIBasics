// OpenAI Agents SDK Demo: Single Agent with Tools
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import 'dotenv/config';

// Define a simple tool
const getFactTool = tool({
  name: 'get_interesting_fact',
  description: 'Get an interesting fact about a given topic',
  parameters: z.object({ 
    topic: z.string().describe('The topic to get a fact about') 
  }),
  execute: async (input) => {
    // Mock fact database - in real app this could be an API call
    const facts = {
      'ai': 'The term "Artificial Intelligence" was coined by John McCarthy in 1956.',
      'space': 'A day on Venus is longer than its year - it takes 243 Earth days to rotate once.',
      'ocean': 'We have explored less than 5% of our oceans, but we have detailed maps of Mars.',
      'default': 'Honey never spoils - archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.'
    };
    
    const fact = facts[input.topic.toLowerCase()] || facts.default;
    return `Here's an interesting fact about ${input.topic}: ${fact}`;
  },
});

// Create an agent with tools
const agent = new Agent({
  name: 'Fact Assistant',
  instructions: 'You are a helpful assistant that provides interesting facts. Use the get_interesting_fact tool when users ask about topics. Be engaging and educational.',
  tools: [getFactTool],
});

async function runAgent() {
  try {
    console.log('🤖 Starting OpenAI Agents SDK Demo...\n');
    console.log('Agent:', agent.name);
    console.log('Tools available:', agent.tools.map(t => t.name).join(', '));
    console.log('\n' + '─'.repeat(50) + '\n');

    // Test 1: Simple greeting (no tools needed)
    console.log('📋 Test 1: Simple conversation');
    const result1 = await run(agent, 'Hello! What can you help me with?');
    console.log('User: Hello! What can you help me with?');
    console.log('Agent:', result1.finalOutput);
    console.log('\n' + '─'.repeat(50) + '\n');

    // Test 2: Request that triggers tool usage
    console.log('📋 Test 2: Tool usage - asking for facts');
    const result2 = await run(agent, 'Tell me something interesting about AI');
    console.log('User: Tell me something interesting about AI');
    console.log('Agent:', result2.finalOutput);
    console.log('\n' + '─'.repeat(50) + '\n');

    // Test 3: Another tool usage with different topic
    console.log('📋 Test 3: Tool usage - different topic');
    const result3 = await run(agent, 'What about space? Any cool facts?');
    console.log('User: What about space? Any cool facts?');
    console.log('Agent:', result3.finalOutput);
    console.log('\n' + '─'.repeat(50) + '\n');

    console.log('✅ Agent demo completed successfully!');

  } catch (error) {
    console.error('❌ Error running agent:', error.message);
    
    if (error.message.includes('quota') || error.message.includes('billing')) {
      console.log('\n💡 Note: This demo requires an active OpenAI account with available credits.');
      console.log('Please check your OpenAI billing and usage limits.');
    }
  }
}

runAgent();
