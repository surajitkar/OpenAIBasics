// Simple API Server for OpenAI Hackathon Starter
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import { Agent, tool } from '@openai/agents';
import { z } from 'zod';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads
const upload = multer({
  dest: '/tmp/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'text/csv', 'application/json', 'text/markdown'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(txt|csv|json|md)$/)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Please upload text files.'));
    }
  }
});

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'operational',
      openai: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured'
    }
  });
});

// Chat endpoint with streaming support
app.post('/api/chat', async (req, res) => {
  try {
    const { message, stream = false } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(401).json({ error: 'OpenAI API key not configured' });
    }

    const openai = new OpenAI({ apiKey });

    if (stream) {
      // Set up Server-Sent Events for streaming
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });

      const streamResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
        stream: true
      });

      for await (const chunk of streamResponse) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: message }],
        temperature: 1,
        max_tokens: 1000
      });

      res.json({
        response: response.choices[0].message.content,
        usage: response.usage
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
});

// Weather agent endpoint
app.post('/api/agents/weather', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(401).json({ error: 'OpenAI API key not configured' });
    }

    // Weather tool for agents
    const weatherTool = tool({
      name: 'get_weather',
      description: 'Get current weather information for a specified city',
      parameters: z.object({
        city: z.string().describe('The city name to get weather for')
      }),
      execute: async (input) => {
        const weatherApiKey = process.env.WEATHER_API_KEY;
        
        if (!weatherApiKey) {
          return JSON.stringify({
            city: input.city,
            temperature: "22°C",
            description: "Clear sky",
            humidity: "45%",
            note: "Using mock data - set WEATHER_API_KEY for real data"
          });
        }

        try {
          const url = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(input.city)}`;
          const response = await axios.get(url);
          const weather = response.data;
          
          return JSON.stringify({
            city: weather.location.name,
            country: weather.location.country,
            temperature: `${weather.current.temp_c}°C`,
            description: weather.current.condition.text,
            humidity: `${weather.current.humidity}%`,
            wind: `${weather.current.wind_kph} km/h`,
            feels_like: `${weather.current.feelslike_c}°C`
          });
        } catch (error) {
          return JSON.stringify({
            error: `Unable to get weather for ${input.city}`,
            message: error.message
          });
        }
      }
    });

    // Create weather agent
    const weatherAgent = new Agent({
      name: 'Weather Agent',
      description: 'I provide current weather information for any city in the world.',
      instructions: 'You are a helpful weather assistant. Use the get_weather tool to provide accurate weather information. Be friendly and informative.',
      tools: [weatherTool],
      model: 'gpt-4o-mini'
    });

    const result = await weatherAgent.run(message, {
      openai: new OpenAI({ apiKey })
    });

    res.json({
      response: result,
      agent: 'weather-agent',
      tools_used: ['get_weather']
    });
  } catch (error) {
    console.error('Weather agent error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Math agent endpoint
app.post('/api/agents/math', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(401).json({ error: 'OpenAI API key not configured' });
    }

    const mathTool = tool({
      name: 'calculate',
      description: 'Perform mathematical calculations and evaluate expressions',
      parameters: z.object({
        expression: z.string().describe('Mathematical expression to evaluate')
      }),
      execute: async (input) => {
        try {
          const result = Function(`"use strict"; return (${input.expression})`)();
          return `The result of ${input.expression} is ${result}`;
        } catch (error) {
          return `Error calculating ${input.expression}: Invalid expression`;
        }
      }
    });

    const mathAgent = new Agent({
      name: 'Math Agent',
      description: 'I perform mathematical calculations and evaluate mathematical expressions.',
      instructions: 'You are a helpful math assistant. Use the calculate tool to solve math problems. Show your work when possible.',
      tools: [mathTool],
      model: 'gpt-4o-mini'
    });

    const result = await mathAgent.run(message, {
      openai: new OpenAI({ apiKey })
    });

    res.json({
      response: result,
      agent: 'math-agent',
      tools_used: ['calculate']
    });
  } catch (error) {
    console.error('Math agent error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Assistant with file analysis
app.post('/api/assistants/analyze-file', upload.single('file'), async (req, res) => {
  try {
    const { question = 'Please analyze this file and provide insights.' } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(401).json({ error: 'OpenAI API key not configured' });
    }

    const openai = new OpenAI({ apiKey });
    
    // Create assistant with code interpreter
    const assistant = await openai.beta.assistants.create({
      name: 'File Analysis Assistant',
      instructions: 'You are a helpful assistant that analyzes files and provides insights about their content.',
      tools: [{ type: 'code_interpreter' }],
      model: 'gpt-4o-mini'
    });

    // Upload file to OpenAI
    const fileStream = fs.createReadStream(req.file.path);
    const uploadedFile = await openai.files.create({
      file: fileStream,
      purpose: 'assistants'
    });

    // Create thread with file
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: question,
          attachments: [
            {
              file_id: uploadedFile.id,
              tools: [{ type: 'code_interpreter' }]
            }
          ]
        }
      ]
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id
    });

    let analysis = 'Analysis failed';
    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      analysis = lastMessage.content[0].text.value;
    }

    // Clean up resources
    try {
      await openai.beta.assistants.del(assistant.id);
      fs.unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }

    res.json({
      analysis,
      filename: req.file.originalname,
      status: run.status
    });
  } catch (error) {
    console.error('File analysis error:', error);
    
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Enhanced weather endpoint with forecasts
app.get('/api/weather', async (req, res) => {
  try {
    const { city, forecast = false } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      const mockData = {
        location: { name: city, country: 'Unknown' },
        current: {
          temperature: '22°C',
          description: 'Clear sky',
          humidity: '45%',
          wind: '10 km/h'
        },
        data_source: 'mock',
        note: 'Set WEATHER_API_KEY for real data'
      };

      if (forecast === 'true') {
        mockData.forecast = [
          { date: '2025-07-17', max_temp: '25°C', min_temp: '18°C', description: 'Sunny' },
          { date: '2025-07-18', max_temp: '23°C', min_temp: '16°C', description: 'Partly cloudy' },
          { date: '2025-07-19', max_temp: '21°C', min_temp: '14°C', description: 'Cloudy' }
        ];
      }

      return res.json(mockData);
    }

    try {
      const baseUrl = forecast === 'true' 
        ? `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=3`
        : `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
      
      const response = await axios.get(baseUrl);
      const weather = response.data;
      
      const result = {
        location: {
          name: weather.location.name,
          country: weather.location.country,
          region: weather.location.region
        },
        current: {
          temperature: `${weather.current.temp_c}°C`,
          description: weather.current.condition.text,
          humidity: `${weather.current.humidity}%`,
          wind: `${weather.current.wind_kph} km/h`
        },
        data_source: 'real'
      };

      if (forecast === 'true' && weather.forecast) {
        result.forecast = weather.forecast.forecastday.map(day => ({
          date: day.date,
          max_temp: `${day.day.maxtemp_c}°C`,
          min_temp: `${day.day.mintemp_c}°C`,
          description: day.day.condition.text
        }));
      }

      res.json(result);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        res.status(404).json({ error: 'City not found', message: `Weather data not found for city: ${city}` });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// API key validation endpoint
app.post('/api/auth/validate', async (req, res) => {
  try {
    const { api_key } = req.body;

    if (!api_key) {
      return res.status(400).json({ error: 'API key is required' });
    }

    try {
      const openai = new OpenAI({ apiKey: api_key });
      const models = await openai.models.list();
      
      res.json({
        valid: true,
        models: models.data.slice(0, 5).map(model => model.id)
      });
    } catch (error) {
      res.status(401).json({
        valid: false,
        error: 'Invalid API key'
      });
    }
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({ valid: false, error: 'Internal server error' });
  }
});

// List available agents
app.get('/api/agents', (req, res) => {
  const agents = [
    {
      id: 'weather-agent',
      name: 'Weather Agent',
      description: 'Provides weather information for any city using WeatherAPI',
      endpoint: '/api/agents/weather',
      tools: ['get_weather']
    },
    {
      id: 'math-agent',
      name: 'Math Agent',
      description: 'Performs mathematical calculations and evaluates expressions',
      endpoint: '/api/agents/math',
      tools: ['calculate']
    }
  ];

  res.json({ agents });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'OpenAI Hackathon Starter API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      chat: 'POST /api/chat',
      chat_stream: 'POST /api/chat (with stream: true)',
      weather: 'GET /api/weather?city=Tokyo',
      weather_forecast: 'GET /api/weather?city=Tokyo&forecast=true',
      agents: 'GET /api/agents',
      weather_agent: 'POST /api/agents/weather',
      math_agent: 'POST /api/agents/math',
      file_analysis: 'POST /api/assistants/analyze-file',
      auth_validate: 'POST /api/auth/validate'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist.`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OpenAI Hackathon Starter API Server running on port ${PORT}`);
  console.log(`🔧 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat API: POST http://localhost:${PORT}/api/chat`);
  console.log(`🌦️ Weather API: GET http://localhost:${PORT}/api/weather?city=Tokyo`);
  console.log(`🤖 Agents API: GET http://localhost:${PORT}/api/agents`);
  console.log(`📁 File Analysis: POST http://localhost:${PORT}/api/assistants/analyze-file`);
  console.log(`🔑 Auth Validate: POST http://localhost:${PORT}/api/auth/validate`);
});

export default app;