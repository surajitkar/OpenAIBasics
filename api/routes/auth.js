// Authentication and API key management endpoints
import express from 'express';
import { OpenAI } from 'openai';
import { validateInternalApiKey } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/validate:
 *   post:
 *     summary: Validate OpenAI API key
 *     description: Validate that the provided OpenAI API key is working
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - api_key
 *             properties:
 *               api_key:
 *                 type: string
 *                 description: OpenAI API key to validate
 *                 example: "sk-..."
 *     responses:
 *       200:
 *         description: API key is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 organization:
 *                   type: string
 *                 models:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: API key is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 error:
 *                   type: string
 */
router.post('/validate', async (req, res) => {
  try {
    const { api_key } = req.body;

    if (!api_key) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'API key is required',
        code: 'MISSING_API_KEY'
      });
    }

    try {
      const openai = new OpenAI({ apiKey: api_key });
      
      // Test the API key by listing models
      const models = await openai.models.list();
      const modelNames = models.data.map(model => model.id);
      
      res.json({
        valid: true,
        organization: models.data[0]?.owned_by || 'unknown',
        models: modelNames.slice(0, 10) // Return first 10 models
      });
    } catch (error) {
      if (error.status === 401) {
        res.status(401).json({
          valid: false,
          error: 'Invalid API key'
        });
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        res.status(402).json({
          valid: false,
          error: 'API key valid but has quota/billing issues'
        });
      } else {
        res.status(500).json({
          valid: false,
          error: 'Unable to validate API key'
        });
      }
    }
  } catch (error) {
    console.error('API key validation error:', error);
    res.status(500).json({
      valid: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @swagger
 * /api/auth/key-info:
 *   get:
 *     summary: Get API key information
 *     description: Get information about the current API key configuration
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: API key information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 configured:
 *                   type: boolean
 *                 source:
 *                   type: string
 *                   enum: [environment, header, none]
 *                 organization_configured:
 *                   type: boolean
 *                 weather_api_configured:
 *                   type: boolean
 */
router.get('/key-info', (req, res) => {
  const openaiKey = process.env.OPENAI_API_KEY;
  const orgId = process.env.OPENAI_ORG_ID;
  const weatherKey = process.env.WEATHER_API_KEY;
  
  let source = 'none';
  if (openaiKey) {
    source = 'environment';
  } else if (req.headers['x-openai-api-key']) {
    source = 'header';
  }

  res.json({
    configured: !!(openaiKey || req.headers['x-openai-api-key']),
    source,
    organization_configured: !!orgId,
    weather_api_configured: !!weatherKey
  });
});

/**
 * @swagger
 * /api/auth/usage:
 *   get:
 *     summary: Get API usage statistics
 *     description: Get basic usage statistics for the current session
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Usage statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session_start:
 *                   type: string
 *                   format: date-time
 *                 requests_made:
 *                   type: integer
 *                 endpoints_used:
 *                   type: array
 *                   items:
 *                     type: string
 *                 note:
 *                   type: string
 */
router.get('/usage', (req, res) => {
  // This is a basic implementation - in production you'd want to track this properly
  res.json({
    session_start: new Date().toISOString(),
    requests_made: 0,
    endpoints_used: [],
    note: 'Usage tracking is not implemented in this demo version. Check OpenAI dashboard for actual usage.'
  });
});

/**
 * @swagger
 * /api/auth/rotate-key:
 *   post:
 *     summary: Rotate API key
 *     description: Update the API key for the current session (demo endpoint)
 *     tags: [Authentication]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - new_api_key
 *             properties:
 *               new_api_key:
 *                 type: string
 *                 description: New OpenAI API key
 *                 example: "sk-..."
 *     responses:
 *       200:
 *         description: API key rotated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 note:
 *                   type: string
 */
router.post('/rotate-key', validateInternalApiKey, async (req, res) => {
  try {
    const { new_api_key } = req.body;

    if (!new_api_key) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'New API key is required',
        code: 'MISSING_NEW_API_KEY'
      });
    }

    // Validate the new API key
    try {
      const openai = new OpenAI({ apiKey: new_api_key });
      await openai.models.list();
      
      res.json({
        success: true,
        message: 'API key validation successful',
        note: 'In production, this would update the environment variable or secure key store'
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid new API key',
        message: error.message
      });
    }
  } catch (error) {
    console.error('API key rotation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/auth/rate-limit-status:
 *   get:
 *     summary: Get rate limit status
 *     description: Get current rate limit status for the client
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Rate limit status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 limit:
 *                   type: integer
 *                   description: Requests per window
 *                 remaining:
 *                   type: integer
 *                   description: Remaining requests
 *                 reset_time:
 *                   type: string
 *                   format: date-time
 *                 window_ms:
 *                   type: integer
 *                   description: Window size in milliseconds
 */
router.get('/rate-limit-status', (req, res) => {
  // This would be implemented with proper rate limiting middleware
  res.json({
    limit: 100,
    remaining: 95,
    reset_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    window_ms: 15 * 60 * 1000,
    note: 'Rate limiting is configured at 100 requests per 15 minutes'
  });
});

export default router;