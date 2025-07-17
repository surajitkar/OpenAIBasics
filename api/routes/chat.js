// Chat API endpoints
import express from 'express';
import { OpenAI } from 'openai';

const router = express.Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a chat message
 *     description: Send a message to OpenAI's chat completion API
 *     tags: [Chat]
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
 *                 example: "Hello, how are you?"
 *               model:
 *                 type: string
 *                 example: "gpt-4o-mini"
 *                 default: "gpt-4o-mini"
 *               temperature:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 2
 *                 default: 1
 *               max_tokens:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 4096
 *                 default: 1000
 *     responses:
 *       200:
 *         description: Successful chat response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "Hello! I'm doing well, thank you for asking."
 *                 usage:
 *                   type: object
 *                   properties:
 *                     prompt_tokens:
 *                       type: integer
 *                     completion_tokens:
 *                       type: integer
 *                     total_tokens:
 *                       type: integer
 *                 model:
 *                   type: string
 *                   example: "gpt-4o-mini"
 *       401:
 *         description: Unauthorized - Invalid API key
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { message, model = 'gpt-4o-mini', temperature = 1, max_tokens = 1000 } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    const openai = new OpenAI({ apiKey: req.openaiApiKey });
    
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: message }],
      temperature,
      max_tokens
    });

    res.json({
      response: response.choices[0].message.content,
      usage: response.usage,
      model: response.model
    });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'CHAT_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/chat/stream:
 *   post:
 *     summary: Send a chat message with streaming response
 *     description: Send a message to OpenAI's chat completion API with streaming response
 *     tags: [Chat]
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
 *                 example: "Tell me a story"
 *               model:
 *                 type: string
 *                 example: "gpt-4o-mini"
 *                 default: "gpt-4o-mini"
 *               temperature:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 2
 *                 default: 1
 *               max_tokens:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 4096
 *                 default: 1000
 *     responses:
 *       200:
 *         description: Streaming chat response
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *               example: "data: {\"content\":\"Hello\"}\n\n"
 */
router.post('/stream', async (req, res) => {
  try {
    const { message, model = 'gpt-4o-mini', temperature = 1, max_tokens = 1000 } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Message is required',
        code: 'MISSING_MESSAGE'
      });
    }

    const openai = new OpenAI({ apiKey: req.openaiApiKey });
    
    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const stream = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: message }],
      temperature,
      max_tokens,
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Chat streaming error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

/**
 * @swagger
 * /api/chat/conversation:
 *   post:
 *     summary: Multi-turn conversation
 *     description: Send multiple messages in a conversation context
 *     tags: [Chat]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant, system]
 *                     content:
 *                       type: string
 *                 example:
 *                   - role: "user"
 *                     content: "Hello"
 *                   - role: "assistant"
 *                     content: "Hi there!"
 *                   - role: "user"
 *                     content: "How are you?"
 *               model:
 *                 type: string
 *                 example: "gpt-4o-mini"
 *                 default: "gpt-4o-mini"
 *               temperature:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 2
 *                 default: 1
 *     responses:
 *       200:
 *         description: Successful conversation response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                 usage:
 *                   type: object
 *                 model:
 *                   type: string
 */
router.post('/conversation', async (req, res) => {
  try {
    const { messages, model = 'gpt-4o-mini', temperature = 1, max_tokens = 1000 } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Messages array is required and must not be empty',
        code: 'MISSING_MESSAGES'
      });
    }

    const openai = new OpenAI({ apiKey: req.openaiApiKey });
    
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens
    });

    res.json({
      response: response.choices[0].message.content,
      usage: response.usage,
      model: response.model
    });
  } catch (error) {
    console.error('Conversation API error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'CONVERSATION_ERROR'
    });
  }
});

export default router;