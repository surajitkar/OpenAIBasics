// OpenAI Agents SDK: Multi-Agent Demo with Handoffs
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';
import 'dotenv/config';

// Weather tool for the Weather Agent
const getWeatherTool = tool({
  name: 'get_weather',
  description: 'Get the current weather for a city',
  parameters: z.object({ 
    city: z.string().describe('The city name to get weather for') 
  }),
  execute: async (input) => {
    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return `Mock weather data: ${input.city} is currently 22°C with partly cloudy skies.`;
    }
    
    try {
      const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(input.city)}`;
      const response = await axios.get(url);
      const data = response.data;
      return `Weather in ${data.location.name}: ${data.current.condition.text}, ${data.current.temp_c}°C`;
    } catch (error) {
      return `Unable to get weather for ${input.city}. Please try another city.`;
    }
  },
});

// Math tool for the Math Agent
const calculateTool = tool({
  name: 'calculate',
  description: 'Perform mathematical calculations',
  parameters: z.object({ 
    expression: z.string().describe('Mathematical expression to evaluate') 
  }),
  execute: async (input) => {
    try {
      // Simple safe evaluation (in production, use a proper math parser)
      const result = Function(`"use strict"; return (${input.expression})`)();
      return `The result of ${input.expression} is ${result}`;
    } catch (error) {
      return `Error calculating ${input.expression}: Invalid expression`;
    }
  },
});

// Creative tool for the Creative Agent
const createStoryTool = tool({
  name: 'create_story',
  description: 'Generate a creative story based on a theme',
  parameters: z.object({ 
    theme: z.string().describe('The theme or topic for the story'),
    length: z.enum(['short', 'medium', 'long']).describe('Story length')
  }),
  execute: async (input) => {
    const stories = {
      'space': 'Among the stars, Captain Luna discovered a planet where time flowed backwards, leading to an adventure that changed her understanding of the universe.',
      'ocean': 'Deep beneath the waves, marine biologist Dr. Coral found a city of light that had been hidden for centuries, protected by creatures of legend.',
      'ai': 'In a world where AI and humans worked together, young programmer Alex created an algorithm that could dream, changing the future of technology forever.'
    };
    
    const story = stories[input.theme.toLowerCase()] || `Once upon a time, there was a magical ${input.theme} that brought wonder to all who encountered it.`;
    
    return `Here's a ${input.length} story about ${input.theme}: ${story}`;
  },
});

// Create specialized agents
const weatherAgent = new Agent({
  name: 'Weather Specialist',
  instructions: 'You are a weather expert. Provide detailed weather information and forecasts using your weather tools. Always be specific about locations and conditions.',
  handoffDescription: 'Expert in weather, climate, and atmospheric conditions',
  tools: [getWeatherTool],
});

const mathAgent = new Agent({
  name: 'Math Expert',
  instructions: 'You are a mathematics specialist. Solve complex problems, explain mathematical concepts, and perform calculations using your tools.',
  handoffDescription: 'Expert in mathematics, calculations, and problem solving',
  tools: [calculateTool],
});

const creativeAgent = new Agent({
  name: 'Creative Writer',
  instructions: 'You are a creative writing specialist. Generate stories, poems, and creative content using your tools. Be imaginative and engaging.',
  handoffDescription: 'Expert in creative writing, storytelling, and imaginative content',
  tools: [createStoryTool],
});

// Create the main coordinator agent with handoffs to specialists
const coordinatorAgent = Agent.create({
  name: 'AI Coordinator',
  instructions: `You are an intelligent coordinator that helps users by routing their requests to the right specialists.

- For weather-related questions, hand off to the Weather Specialist
- For math problems, calculations, or technical analysis, hand off to the Math Expert  
- For creative writing, stories, or imaginative content, hand off to the Creative Writer
- For general questions, you can answer directly

Always explain briefly why you're making a handoff and what the specialist will help with.`,
  handoffs: [weatherAgent, mathAgent, creativeAgent],
});

async function testMultiAgentWorkflow() {
  try {
    console.log('🤖 Starting OpenAI Agents SDK Multi-Agent Demo...\n');
    console.log('Main Agent:', coordinatorAgent.name);
    console.log('Available Specialists:');
    console.log('  📊', weatherAgent.name, '- Weather and climate');
    console.log('  🔢', mathAgent.name, '- Mathematics and calculations');
    console.log('  ✍️', creativeAgent.name, '- Creative writing and stories');
    console.log('\n' + '═'.repeat(80) + '\n');

    // Test 1: Weather query (should handoff to weather agent)
    console.log('🧪 Test 1: Weather Request');
    const result1 = await run(coordinatorAgent, 'What\'s the weather like in London today?');
    console.log('User: What\'s the weather like in London today?');
    console.log('Response:', result1.finalOutput);
    console.log('\n' + '─'.repeat(80) + '\n');

    // Test 2: Math problem (should handoff to math agent)
    console.log('🧪 Test 2: Math Problem');
    const result2 = await run(coordinatorAgent, 'Can you calculate 15 * 24 + 128?');
    console.log('User: Can you calculate 15 * 24 + 128?');
    console.log('Response:', result2.finalOutput);
    console.log('\n' + '─'.repeat(80) + '\n');

    // Test 3: Creative request (should handoff to creative agent)
    console.log('🧪 Test 3: Creative Writing');
    const result3 = await run(coordinatorAgent, 'Write me a short story about space exploration');
    console.log('User: Write me a short story about space exploration');
    console.log('Response:', result3.finalOutput);
    console.log('\n' + '─'.repeat(80) + '\n');

    // Test 4: General question (coordinator handles directly)
    console.log('🧪 Test 4: General Question');
    const result4 = await run(coordinatorAgent, 'What time is it?');
    console.log('User: What time is it?');
    console.log('Response:', result4.finalOutput);
    console.log('\n' + '─'.repeat(80) + '\n');

    console.log('✅ Multi-agent workflow completed successfully!');
    console.log('\n💡 Key Features Demonstrated:');
    console.log('  • Agent specialization with custom tools');
    console.log('  • Intelligent handoffs between agents');
    console.log('  • Coordinator pattern for request routing');
    console.log('  • Real API integration (weather) with fallbacks');

  } catch (error) {
    console.error('❌ Error in multi-agent workflow:', error.message);
    
    if (error.message.includes('quota') || error.message.includes('billing')) {
      console.log('\n💡 Note: This demo requires an active OpenAI account with available credits.');
      console.log('Please check your OpenAI billing and usage limits.');
    }
  }
}

testMultiAgentWorkflow();
