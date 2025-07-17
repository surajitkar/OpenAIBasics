// Simple API Server for OpenAI Hackathon Starter
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
const PORT = process.env.PORT || 3001;

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

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(401).json({
        error: 'OpenAI API key not configured'
      });
    }

    const openai = new OpenAI({ apiKey });
    
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
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Weather endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({
        error: 'City parameter is required'
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    
    if (!apiKey) {
      return res.json({
        location: { name: city, country: 'Unknown' },
        current: {
          temperature: '22°C',
          description: 'Clear sky',
          humidity: '45%'
        },
        data_source: 'mock',
        note: 'Set WEATHER_API_KEY for real data'
      });
    }

    // Real weather API would go here
    res.json({
      location: { name: city, country: 'Unknown' },
      current: {
        temperature: '22°C',
        description: 'Clear sky',
        humidity: '45%'
      },
      data_source: 'mock'
    });
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'OpenAI Hackathon Starter API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      chat: '/api/chat',
      weather: '/api/weather'
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
});

export default app;