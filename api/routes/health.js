// Health check and monitoring endpoints
import express from 'express';
import { OpenAI } from 'openai';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
        openai: 'unknown',
        weather: 'unknown'
      }
    };

    // Check OpenAI connection
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        await openai.models.list();
        health.services.openai = 'connected';
      } catch (error) {
        health.services.openai = 'error';
        health.status = 'degraded';
      }
    } else {
      health.services.openai = 'not_configured';
    }

    // Check Weather API
    if (process.env.WEATHER_API_KEY) {
      health.services.weather = 'configured';
    } else {
      health.services.weather = 'not_configured';
    }

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// System metrics endpoint
router.get('/metrics', (req, res) => {
  const metrics = {
    uptime: process.uptime(),
    memory: {
      used: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      total: process.memoryUsage().heapTotal / 1024 / 1024 // MB
    },
    cpu: {
      usage: process.cpuUsage()
    },
    timestamp: new Date().toISOString()
  };

  res.json(metrics);
});

export default router;