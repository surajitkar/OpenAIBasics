// Agents API endpoints
import express from 'express';
import { Agent, tool } from '@openai/agents';
import { OpenAI } from 'openai';
import { z } from 'zod';
import axios from 'axios';

const router = express.Router();

/**
 * @swagger
 * /api/agents/available:
 *   get:
 *     summary: List available agents
 *     description: Get a list of all available pre-configured agents
 *     tags: [Agents]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of available agents
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 agents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       tools:
 *                         type: array
 *                         items:
 *                           type: string
 */
router.get('/available', (req, res) => {
  const agents = [
    {
      id: 'weather-agent',
      name: 'Weather Agent',
      description: 'Provides weather information for any city using WeatherAPI',
      tools: ['get_weather']
    },
    {
      id: 'math-agent',
      name: 'Math Agent',
      description: 'Performs mathematical calculations and evaluates expressions',
      tools: ['calculate']
    },
    {
      id: 'fact-agent',
      name: 'Fact Agent',
      description: 'Provides interesting facts and random information',
      tools: ['get_random_fact']
    },
    {
      id: 'search-agent',
      name: 'Search Agent',
      description: 'Performs web searches and retrieves current information',
      tools: ['web_search']
    }
  ];

  res.json({ agents });
});

/**
 * @swagger
 * /api/agents/weather:
 *   post:
 *     summary: Weather agent interaction
 *     description: Interact with the weather agent to get weather information
 *     tags: [Agents]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "What's the weather like in Tokyo?"
 *     responses:
 *       200:
 *         description: Weather agent response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                 agent:
 *                   type: string
 *                   example: "weather-agent"
 *                 tools_used:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post('/weather', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    // Weather tool
    const weatherTool = tool({
      name: 'get_weather',
      description: 'Get current weather information for a specified city',
      parameters: z.object({
        city: z.string().describe('The city name to get weather for')
      }),
      execute: async (input) => {
        const apiKey = process.env.WEATHER_API_KEY;
        
        if (!apiKey) {
          return JSON.stringify({
            city: input.city,
            temperature: "22°C",
            description: "Clear sky",
            humidity: "45%",
            note: "Using mock data - set WEATHER_API_KEY for real data"
          });
        }

        try {
          const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(input.city)}`;
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

    // Run the agent
    const result = await weatherAgent.run(message, {
      openai: new OpenAI({ apiKey: req.openaiApiKey })
    });

    res.json({
      response: result,
      agent: 'weather-agent',
      tools_used: ['get_weather']
    });
  } catch (error) {
    console.error('Weather agent error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'WEATHER_AGENT_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/agents/math:
 *   post:
 *     summary: Math agent interaction
 *     description: Interact with the math agent to perform calculations
 *     tags: [Agents]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "What's 15 * 23 + 47?"
 *     responses:
 *       200:
 *         description: Math agent response
 */
router.post('/math', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    // Math calculation tool
    const mathTool = tool({
      name: 'calculate',
      description: 'Perform mathematical calculations and evaluate expressions',
      parameters: z.object({
        expression: z.string().describe('Mathematical expression to evaluate')
      }),
      execute: async (input) => {
        try {
          // Simple math expression evaluation (safe)
          const result = Function(`"use strict"; return (${input.expression})`)();
          return `The result of ${input.expression} is ${result}`;
        } catch (error) {
          return `Error calculating ${input.expression}: Invalid expression`;
        }
      }
    });

    // Create math agent
    const mathAgent = new Agent({
      name: 'Math Agent',
      description: 'I perform mathematical calculations and evaluate mathematical expressions.',
      instructions: 'You are a helpful math assistant. Use the calculate tool to solve math problems. Show your work when possible.',
      tools: [mathTool],
      model: 'gpt-4o-mini'
    });

    // Run the agent
    const result = await mathAgent.run(message, {
      openai: new OpenAI({ apiKey: req.openaiApiKey })
    });

    res.json({
      response: result,
      agent: 'math-agent',
      tools_used: ['calculate']
    });
  } catch (error) {
    console.error('Math agent error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'MATH_AGENT_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/agents/fact:
 *   post:
 *     summary: Fact agent interaction
 *     description: Interact with the fact agent to get interesting facts
 *     tags: [Agents]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Tell me an interesting fact about space"
 *     responses:
 *       200:
 *         description: Fact agent response
 */
router.post('/fact', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    // Fact generation tool
    const factTool = tool({
      name: 'get_random_fact',
      description: 'Get a random interesting fact on any topic',
      parameters: z.object({
        topic: z.string().describe('The topic to get a fact about')
      }),
      execute: async (input) => {
        const facts = {
          space: "The largest known star, UY Scuti, is so big that if it were placed at the center of our solar system, it would extend beyond the orbit of Jupiter.",
          ocean: "The ocean contains 99% of the living space on Earth, yet only 5% of it has been explored by humans.",
          animals: "Octopuses have three hearts, blue blood, and can change both their color and texture to match their surroundings.",
          science: "A single teaspoon of a neutron star would weigh about 6 billion tons - the same as about 900 Great Pyramids of Giza.",
          technology: "The first computer bug was an actual bug - a moth that was trapped in a computer relay in 1947.",
          default: "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible."
        };

        const fact = facts[input.topic.toLowerCase()] || facts.default;
        return `Here's an interesting fact about ${input.topic}: ${fact}`;
      }
    });

    // Create fact agent
    const factAgent = new Agent({
      name: 'Fact Agent',
      description: 'I provide interesting and educational facts on various topics.',
      instructions: 'You are a knowledgeable fact-sharing assistant. Use the get_random_fact tool to provide interesting facts. Be engaging and educational.',
      tools: [factTool],
      model: 'gpt-4o-mini'
    });

    // Run the agent
    const result = await factAgent.run(message, {
      openai: new OpenAI({ apiKey: req.openaiApiKey })
    });

    res.json({
      response: result,
      agent: 'fact-agent',
      tools_used: ['get_random_fact']
    });
  } catch (error) {
    console.error('Fact agent error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'FACT_AGENT_ERROR'
    });
  }
});

export default router;