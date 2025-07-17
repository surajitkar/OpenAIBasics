// API Server for OpenAI Hackathon Starter
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import swaggerJsdoc from 'swagger-jsdoc';
// import swaggerUi from 'swagger-ui-express';

// Import route modules
import chatRoutes from './routes/chat.js';
import agentRoutes from './routes/agents.js';
// import assistantRoutes from './routes/assistants.js';
import weatherRoutes from './routes/weather.js';
// import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { validateApiKey } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later',
    retryAfter: '15 minutes'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation setup - temporarily disabled
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'OpenAI Hackathon Starter API',
//       version: '1.0.0',
//       description: 'RESTful API for OpenAI integration, agents, assistants, and external services',
//       contact: {
//         name: 'OpenAI Hackathon Starter',
//         url: 'https://github.com/surajitkar/OpenAIBasics'
//       }
//     },
//     servers: [
//       {
//         url: `http://localhost:${PORT}`,
//         description: 'Development server'
//       }
//     ],
//     components: {
//       securitySchemes: {
//         ApiKeyAuth: {
//           type: 'apiKey',
//           in: 'header',
//           name: 'X-API-Key'
//         }
//       }
//     }
//   },
//   apis: ['./api/routes/*.js']
// };

// const swaggerDocs = swaggerJsdoc(swaggerOptions);
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API routes
// app.use('/api/health', healthRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/chat', validateApiKey, chatRoutes);
// app.use('/api/agents', validateApiKey, agentRoutes);
// app.use('/api/assistants', validateApiKey, assistantRoutes);
// app.use('/api/weather', validateApiKey, weatherRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'OpenAI Hackathon Starter API',
    version: '1.0.0',
    documentation: `/api/docs`,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      chat: '/api/chat',
      agents: '/api/agents',
      assistants: '/api/assistants',
      weather: '/api/weather'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.originalUrl} does not exist. Check /api/docs for available endpoints.`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OpenAI Hackathon Starter API Server running on port ${PORT}`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🔧 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`⚡ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;