// Express API Server for OpenAI Hackathon Starter
// Bridges React frontend with existing backend modules
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI client with error handling
let openai = null;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID
    });
  } else {
    console.warn('⚠️  OPENAI_API_KEY not found. Some features will be limited.');
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error.message);
}

// Store conversation history (in production, use a database)
const conversations = new Map();

// Weather function for advanced module
async function getWeather(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  
  if (!apiKey) {
    return {
      location: { name: city },
      current: {
        condition: { text: 'partly cloudy' },
        temp_c: 15
      }
    };
  }
  
  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    return {
      location: { name: city },
      current: {
        condition: { text: 'partly cloudy' },
        temp_c: 15
      }
    };
  }
}

// Agent tools
const getFactTool = tool({
  name: 'get_interesting_fact',
  description: 'Get an interesting fact about a given topic',
  parameters: z.object({ 
    topic: z.string().describe('The topic to get a fact about') 
  }),
  execute: async (input) => {
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

const weatherTool = tool({
  name: 'get_weather',
  description: 'Get the current weather for a city',
  parameters: z.object({
    city: z.string().describe('The city name to get weather for')
  }),
  execute: async (input) => {
    const weatherData = await getWeather(input.city);
    return `The weather in ${weatherData.location.name} is ${weatherData.current.condition.text} with a temperature of ${weatherData.current.temp_c}°C`;
  },
});

// Create agents
const factAgent = new Agent({
  name: 'Fact Assistant',
  instructions: 'You are a helpful assistant that provides interesting facts. Use the get_interesting_fact tool when users ask about topics.',
  tools: [getFactTool],
});

const weatherAgent = new Agent({
  name: 'Weather Assistant',
  instructions: 'You are a weather assistant. Use the get_weather tool to provide weather information when users ask about weather.',
  tools: [weatherTool],
});

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    openaiConfigured: !!openai
  });
});

// Get available agents
app.get('/api/agents', (req, res) => {
  res.json({
    agents: [
      { id: 'chatbot', name: 'Basic Chatbot', description: 'Simple conversational AI' },
      { id: 'fact-agent', name: 'Fact Agent', description: 'Get interesting facts about topics' },
      { id: 'weather-agent', name: 'Weather Agent', description: 'Get weather information' },
      { id: 'assistant', name: 'OpenAI Assistant', description: 'Persistent conversation assistant' }
    ]
  });
});

// Basic chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId = 'default' } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI client not configured', 
        details: 'Please set OPENAI_API_KEY environment variable' 
      });
    }

    // Get or create conversation
    if (!conversations.has(conversationId)) {
      conversations.set(conversationId, [
        { role: 'system', content: 'You are a helpful assistant.' }
      ]);
    }
    
    const conversation = conversations.get(conversationId);
    conversation.push({ role: 'user', content: message });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversation,
      max_tokens: 1000
    });
    
    const reply = completion.choices[0].message.content;
    conversation.push({ role: 'assistant', content: reply });
    
    res.json({ 
      reply, 
      usage: completion.usage,
      conversationId 
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
});

// Agent chat endpoint
app.post('/api/agents/:agentId/chat', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI client not configured', 
        details: 'Please set OPENAI_API_KEY environment variable' 
      });
    }

    let agent;
    switch (agentId) {
      case 'fact-agent':
        agent = factAgent;
        break;
      case 'weather-agent':
        agent = weatherAgent;
        break;
      default:
        return res.status(400).json({ error: 'Invalid agent ID' });
    }

    const result = await run(agent, message);
    
    res.json({ 
      reply: result.finalOutput,
      agentName: agent.name,
      toolsUsed: result.steps?.map(step => step.toolName).filter(Boolean) || []
    });
    
  } catch (error) {
    console.error('Agent chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process agent message',
      details: error.message 
    });
  }
});

// Weather endpoint (for advanced module)
app.post('/api/weather', async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const weatherData = await getWeather(city);
    res.json(weatherData);
    
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ 
      error: 'Failed to get weather data',
      details: error.message 
    });
  }
});

// Clear conversation
app.delete('/api/conversations/:id', (req, res) => {
  const { id } = req.params;
  conversations.delete(id);
  res.json({ message: 'Conversation cleared' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OpenAI Hackathon Starter API Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});