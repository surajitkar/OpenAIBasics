// Assistants API endpoints
import express from 'express';
import { OpenAI } from 'openai';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: '/tmp/uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow text files, documents, and code files
    const allowedTypes = [
      'text/plain',
      'text/csv',
      'application/json',
      'application/javascript',
      'application/python',
      'text/markdown',
      'text/html',
      'text/css'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(txt|csv|json|js|py|md|html|css)$/)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Please upload text files, documents, or code files.'));
    }
  }
});

/**
 * @swagger
 * /api/assistants/create:
 *   post:
 *     summary: Create a new assistant
 *     description: Create a new OpenAI assistant with specified instructions and tools
 *     tags: [Assistants]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - instructions
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Code Helper"
 *               instructions:
 *                 type: string
 *                 example: "You are a helpful coding assistant. Help users with programming questions and code analysis."
 *               tools:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [code_interpreter, file_search]
 *                 example: ["code_interpreter"]
 *               model:
 *                 type: string
 *                 example: "gpt-4o-mini"
 *                 default: "gpt-4o-mini"
 *     responses:
 *       200:
 *         description: Assistant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assistant:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     instructions:
 *                       type: string
 *                     tools:
 *                       type: array
 *                     model:
 *                       type: string
 */
router.post('/create', async (req, res) => {
  try {
    const { name, instructions, tools = [], model = 'gpt-4o-mini' } = req.body;

    if (!name || !instructions) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Name and instructions are required',
        code: 'MISSING_FIELDS'
      });
    }

    const openai = new OpenAI({ apiKey: req.openaiApiKey });
    
    // Convert tool strings to tool objects
    const toolObjects = tools.map(tool => {
      if (tool === 'code_interpreter') {
        return { type: 'code_interpreter' };
      } else if (tool === 'file_search') {
        return { type: 'file_search' };
      } else {
        return { type: tool };
      }
    });

    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      tools: toolObjects,
      model
    });

    res.json({
      assistant: {
        id: assistant.id,
        name: assistant.name,
        instructions: assistant.instructions,
        tools: assistant.tools,
        model: assistant.model
      }
    });
  } catch (error) {
    console.error('Create assistant error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'CREATE_ASSISTANT_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/assistants/{assistantId}/thread:
 *   post:
 *     summary: Create a new thread for an assistant
 *     description: Create a new conversation thread for the specified assistant
 *     tags: [Assistants]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: assistantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The assistant ID
 *     responses:
 *       200:
 *         description: Thread created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 thread:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     created_at:
 *                       type: integer
 */
router.post('/:assistantId/thread', async (req, res) => {
  try {
    const { assistantId } = req.params;
    const openai = new OpenAI({ apiKey: req.openaiApiKey });
    
    const thread = await openai.beta.threads.create();

    res.json({
      thread: {
        id: thread.id,
        created_at: thread.created_at
      },
      assistant_id: assistantId
    });
  } catch (error) {
    console.error('Create thread error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'CREATE_THREAD_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/assistants/{assistantId}/thread/{threadId}/message:
 *   post:
 *     summary: Send a message to an assistant thread
 *     description: Send a message to an existing assistant thread and get a response
 *     tags: [Assistants]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: assistantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The assistant ID
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The thread ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Can you help me analyze this data?"
 *     responses:
 *       200:
 *         description: Message sent and response received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                 thread_id:
 *                   type: string
 *                 run_id:
 *                   type: string
 *                 usage:
 *                   type: object
 */
router.post('/:assistantId/thread/:threadId/message', async (req, res) => {
  try {
    const { assistantId, threadId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Content is required',
        code: 'MISSING_CONTENT'
      });
    }

    const openai = new OpenAI({ apiKey: req.openaiApiKey });
    
    // Add message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId
    });

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(threadId);
      const lastMessage = messages.data[0];
      
      res.json({
        response: lastMessage.content[0].text.value,
        thread_id: threadId,
        run_id: run.id,
        usage: run.usage
      });
    } else {
      res.status(500).json({
        error: 'Assistant Run Failed',
        message: `Run status: ${run.status}`,
        code: 'RUN_FAILED'
      });
    }
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'SEND_MESSAGE_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/assistants/{assistantId}/analyze-file:
 *   post:
 *     summary: Upload and analyze a file with an assistant
 *     description: Upload a file and have the assistant analyze it
 *     tags: [Assistants]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: assistantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The assistant ID (should have code_interpreter or file_search tools)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to analyze
 *               question:
 *                 type: string
 *                 example: "What insights can you provide about this data?"
 *                 description: Optional question about the file
 *     responses:
 *       200:
 *         description: File analyzed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analysis:
 *                   type: string
 *                 file_id:
 *                   type: string
 *                 thread_id:
 *                   type: string
 *                 filename:
 *                   type: string
 */
router.post('/:assistantId/analyze-file', upload.single('file'), async (req, res) => {
  try {
    const { assistantId } = req.params;
    const { question = 'Please analyze this file and provide insights.' } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'File is required',
        code: 'MISSING_FILE'
      });
    }

    const openai = new OpenAI({ apiKey: req.openaiApiKey });
    
    // Upload file to OpenAI
    const fileStream = fs.createReadStream(req.file.path);
    const uploadedFile = await openai.files.create({
      file: fileStream,
      purpose: 'assistants'
    });

    // Create a thread with the file
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
      assistant_id: assistantId
    });

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];
      
      res.json({
        analysis: lastMessage.content[0].text.value,
        file_id: uploadedFile.id,
        thread_id: thread.id,
        filename: req.file.originalname
      });
    } else {
      res.status(500).json({
        error: 'Analysis Failed',
        message: `Run status: ${run.status}`,
        code: 'ANALYSIS_FAILED'
      });
    }

    // Clean up temporary file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error('File analysis error:', error);
    
    // Clean up temporary file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'FILE_ANALYSIS_ERROR'
    });
  }
});

/**
 * @swagger
 * /api/assistants/{assistantId}:
 *   delete:
 *     summary: Delete an assistant
 *     description: Delete an existing assistant
 *     tags: [Assistants]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: assistantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The assistant ID to delete
 *     responses:
 *       200:
 *         description: Assistant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deleted:
 *                   type: boolean
 *                 id:
 *                   type: string
 */
router.delete('/:assistantId', async (req, res) => {
  try {
    const { assistantId } = req.params;
    const openai = new OpenAI({ apiKey: req.openaiApiKey });
    
    const result = await openai.beta.assistants.del(assistantId);
    
    res.json({
      deleted: result.deleted,
      id: result.id
    });
  } catch (error) {
    console.error('Delete assistant error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      code: 'DELETE_ASSISTANT_ERROR'
    });
  }
});

export default router;