# OpenAI Hackathon Starter

A comprehensive Node.js project demonstrating OpenAI API capabilities across 5 learning modules, from basic setup to advanced multi-agent workflows and persistent assistants.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your OpenAI API key:**
   - Option 1: System environment variable (recommended)
     ```bash
     # Windows
     set OPENAI_API_KEY=your_api_key_here
     set OPENAI_ORG_ID=your_organization_id_here
     
     # macOS/Linux
     export OPENAI_API_KEY=your_api_key_here
     export OPENAI_ORG_ID=your_organization_id_here
     ```
   - Option 2: Create a `.env` file
     ```
     OPENAI_API_KEY=your_api_key_here
     OPENAI_ORG_ID=your_organization_id_here  # Optional: For organization billing
     WEATHER_API_KEY=your_weatherapi_key_here  # Optional for weather demos
     ```

3. **Run the complete demo:**
   ```bash
   node demo-all.js
   ```

## 📚 Project Structure

```
openai-hackathon-starter/
├── foundations/          # Module 1: Core Implementation
│   └── openai-setup.js  # Basic API setup and first call
├── chatbot/             # Module 2: Chatbot Development  
│   └── chatbot.js       # Interactive persistent chatbot
├── advanced/            # Module 3: Advanced Concepts
│   └── weather-function.js  # Function calling with external APIs
├── agents/              # Module 4: OpenAI Agents SDK
│   ├── agent-demo.js    # Single agent with tools
│   └── multi-agent-demo.js  # Multi-agent workflows & handoffs
├── assistants/          # Module 5: OpenAI Assistants API
│   ├── persistent-assistant-demo.js  # Stateful conversations
│   └── file-analysis-demo.js  # File processing & code interpreter
├── demo-all.js          # Complete demonstration runner
├── package.json         # Dependencies and project config
├── README.md           # This file
└── TECHNOLOGY-GUIDE.md  # Comprehensive guide for beginners
```

## 🎯 Learning Modules

### 📚 Module 1: Foundations & Core Implementation
**Files:** `foundations/openai-setup.js`, `foundations/token-cost-demo.js`

Learn the basics of OpenAI API integration:
- Setting up the OpenAI client
- Making your first API call
- Understanding API responses
- **Real token usage and cost tracking**
- **Production-ready cost monitoring**
- Environment configuration

```bash
node foundations/openai-setup.js
node foundations/token-cost-demo.js
```

### 🤖 Module 2: Basic Chatbot Development
**File:** `chatbot/chatbot.js`

Build an interactive chatbot with:
- Persistent conversation memory
- Terminal-based interface
- Graceful conversation handling
- Context preservation across messages

```bash
node chatbot/chatbot.js
```

### 🌟 Module 3: Advanced Concepts & Project Development
**File:** `advanced/weather-function.js`

Explore advanced OpenAI features:
- Function calling capabilities
- External API integration (WeatherAPI.com)
- Schema definition and validation
- Error handling and fallbacks
- Command-line argument processing

```bash
# Basic usage
node advanced/weather-function.js

# With specific city
node advanced/weather-function.js "Tokyo"
```

### 👥 Module 4: OpenAI Agents SDK Introduction

#### Single Agent Demo
**File:** `agents/agent-demo.js`

Learn the OpenAI Agents SDK fundamentals:
- Creating agents with custom tools
- Tool definition and execution
- Agent instructions and behavior
- Testing agent capabilities

```bash
node agents/agent-demo.js
```

#### Multi-Agent Workflows
**File:** `agents/multi-agent-demo.js`

Advanced agent coordination:
- Multiple specialized agents
- Agent handoffs and routing
- Coordinator pattern implementation
- Tool specialization per agent
- Real-time agent collaboration

```bash
node agents/multi-agent-demo.js
```

### 💾 Module 5: OpenAI Assistants API

#### Persistent Conversations
**File:** `assistants/persistent-assistant-demo.js`

Learn stateful conversation management:
- Persistent conversation threads
- Context retention across sessions
- Built-in conversation history
- Stateful assistant interactions

```bash
node assistants/persistent-assistant-demo.js
```

#### File Analysis & Code Interpreter
**File:** `assistants/file-analysis-demo.js`

Explore file processing capabilities:
- File upload and analysis
- Built-in code interpreter
- Automatic data visualization
- Statistical analysis and insights

```bash
node assistants/file-analysis-demo.js
```

## 🔄 **Agents vs Assistants: When to Use Which**

### **Use Agents SDK for:**
- Multi-step workflows requiring agent coordination
- Real-time voice applications and streaming
- Custom tool integration and handoff patterns
- Stateless operations and workflow orchestration
- Complex multi-agent collaboration

### **Use Assistants API for:**
- Long-term conversations requiring persistent context
- File upload, analysis, and code interpretation
- Customer support with conversation history
- Document analysis and data processing
- Applications requiring built-in tools

## 🛠️ Dependencies

- **@openai/agents**: OpenAI Agents SDK for advanced agent workflows
- **openai**: Official OpenAI API client
- **zod**: Schema validation (required for Agents SDK)
- **axios**: HTTP client for external API calls
- **dotenv**: Environment variable management

## 🌡️ Weather API Setup (Optional)

For enhanced weather functionality, get a free API key from [WeatherAPI.com](https://www.weatherapi.com/):

1. Sign up for a free account
2. Get your API key
3. Add to your environment:
   ```
   WEATHER_API_KEY=your_weatherapi_key_here
   ```

Without this key, the weather demos will use mock data.

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY` (required): Your OpenAI API key
- `WEATHER_API_KEY` (optional): WeatherAPI.com key for real weather data

### API Key Priority
1. System environment variables (highest priority)
2. `.env` file variables
3. If neither is set, the application will show an error

## 🎮 Interactive Features

### Chatbot Commands
- Type naturally to chat with the AI
- Type `exit`, `quit`, or `bye` to end the conversation
- Press Ctrl+C for immediate exit

### Weather Function
- Supports any city name worldwide
- Falls back to mock data if API is unavailable
- Handles various city name formats

### Agent Interactions
- Agents use specialized tools automatically
- Multi-agent demo shows intelligent request routing
- Handoffs happen seamlessly between agents

## 📝 Example Use Cases

1. **Learning OpenAI Integration:** Start with Module 1
2. **Building Chatbots:** Use Module 2 as a foundation
3. **Adding External APIs:** Module 3 shows function calling patterns
4. **Complex AI Workflows:** Module 4 demonstrates agent coordination
5. **Persistent Assistants:** Module 5 shows stateful conversations

## 📖 Technology Guide

**New to OpenAI development?** Check out our comprehensive [Technology Guide](./TECHNOLOGY-GUIDE.md) that explains:
- When to use each OpenAI technology
- Detailed comparisons and decision trees
- Cost considerations and best practices
- Step-by-step learning path for beginners
- Real-world project ideas for each technology

## 🚨 Troubleshooting

### Common Issues

**API Key Not Found:**
```
Error: OpenAI API key not found
```
- Solution: Set `OPENAI_API_KEY` in your environment or `.env` file

**Billing/Quota Errors:**
- Check your OpenAI account billing status
- Ensure you have available API credits

**Weather API Errors:**
- The demos work without `WEATHER_API_KEY` (uses mock data)
- Check your WeatherAPI.com account if using real data

**Agent SDK Issues:**
- Ensure you're using Node.js 18+ for ES modules
- All Zod schema fields must be required (no `.optional()`)

### Getting Help

1. Check the error messages for specific guidance
2. Verify all environment variables are set correctly
3. Test with the basic foundation module first
4. Ensure your OpenAI account has available credits

## 🚀 Next Steps

- Customize the agents for your specific use case
- Add more specialized tools and functions
- Integrate additional external APIs
- Build complex multi-agent workflows
- Explore advanced agent patterns like hierarchical coordination

## 🔧 API Server Extension Guide

This project includes a simple Node.js API server (`api.js`) with public and protected endpoints. Here's how to extend it for your needs:

### 🚀 Quick Start with the API

```bash
# Start the API server
node api.js

# Test public endpoint
curl http://localhost:3000/hello

# Test protected endpoint with authentication
curl -H "Authorization: Bearer valid-token" http://localhost:3000/secure-hello
```

### 📋 Adding New Endpoints

#### 1. Public Endpoints
```javascript
// Add a new public endpoint
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// POST endpoint with data validation
app.post('/api/feedback', (req, res) => {
    const { message, rating } = req.body;
    
    // Validate input
    if (!message || !rating) {
        return res.status(400).json({ 
            error: 'Missing required fields: message, rating' 
        });
    }
    
    // Process feedback (save to database, etc.)
    res.json({ 
        success: true, 
        message: 'Feedback received' 
    });
});
```

#### 2. Protected Endpoints
```javascript
// Add a protected endpoint using existing middleware
app.get('/api/user/profile', validateToken, (req, res) => {
    // Access user data (req.user would be available if you decode the token)
    res.json({ 
        profile: { id: 1, name: 'John Doe' },
        permissions: ['read', 'write']
    });
});

// Protected POST endpoint
app.post('/api/user/settings', validateToken, (req, res) => {
    const { theme, notifications } = req.body;
    
    // Update user settings
    res.json({ 
        success: true, 
        settings: { theme, notifications }
    });
});
```

### 🔐 Enhanced Authentication

#### 1. JWT Token Authentication
```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Enhanced token validation with JWT
const validateJWTToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No valid token provided' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user info to request
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Use the enhanced middleware
app.get('/api/secure-data', validateJWTToken, (req, res) => {
    res.json({ 
        message: 'Secure data accessed',
        user: req.user 
    });
});
```

#### 2. Role-Based Access Control
```javascript
// Role validation middleware
const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

// Admin-only endpoint
app.get('/api/admin/users', validateJWTToken, requireRole('admin'), (req, res) => {
    res.json({ users: [] }); // Return admin data
});
```

### 🛠️ Middleware Extensions

#### 1. Request Logging
```javascript
// Custom logging middleware
const logRequests = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
};

// Add logging to all routes
app.use(logRequests);
```

#### 2. Rate Limiting
```javascript
// Simple rate limiting (consider using express-rate-limit in production)
const rateLimitMap = new Map();

const rateLimit = (maxRequests = 100, windowMs = 60000) => {
    return (req, res, next) => {
        const clientIp = req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Clean old entries
        if (!rateLimitMap.has(clientIp)) {
            rateLimitMap.set(clientIp, []);
        }
        
        const requests = rateLimitMap.get(clientIp).filter(time => time > windowStart);
        
        if (requests.length >= maxRequests) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        
        requests.push(now);
        rateLimitMap.set(clientIp, requests);
        next();
    };
};

// Apply rate limiting
app.use('/api', rateLimit(50, 60000)); // 50 requests per minute
```

### 🗃️ Database Integration

#### 1. Simple File-Based Storage
```javascript
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = './data';

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

// Save data endpoint
app.post('/api/data', validateToken, async (req, res) => {
    try {
        const { key, value } = req.body;
        const filePath = path.join(DATA_DIR, `${key}.json`);
        
        await fs.writeFile(filePath, JSON.stringify(value, null, 2));
        res.json({ success: true, message: 'Data saved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Read data endpoint
app.get('/api/data/:key', validateToken, async (req, res) => {
    try {
        const { key } = req.params;
        const filePath = path.join(DATA_DIR, `${key}.json`);
        
        const data = await fs.readFile(filePath, 'utf8');
        res.json({ key, value: JSON.parse(data) });
    } catch (error) {
        res.status(404).json({ error: 'Data not found' });
    }
});
```

#### 2. Database Connection Example
```javascript
// Example with a hypothetical database
/*
import Database from 'your-database-library';

const db = new Database(process.env.DATABASE_URL);

app.get('/api/users', validateToken, async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users');
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});
*/
```

### 📊 Error Handling & Validation

#### 1. Global Error Handler
```javascript
// Add after all routes
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    
    // Development vs Production error responses
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(error.status || 500).json({
        error: error.message || 'Internal server error',
        ...(isDevelopment && { stack: error.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});
```

#### 2. Input Validation
```javascript
// Validation middleware example
const validateInput = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: error.details.map(d => d.message)
            });
        }
        next();
    };
};

// Usage with a validation library like Joi
/*
import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required()
});

app.post('/api/users', validateInput(userSchema), (req, res) => {
    // Handle validated input
});
*/
```

### 🔧 Configuration & Environment

#### 1. Environment-Based Configuration
```javascript
const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'development-secret',
    databaseUrl: process.env.DATABASE_URL || 'sqlite://./dev.db',
    apiPrefix: process.env.API_PREFIX || '/api',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    rateLimit: {
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000
    }
};

// Use configuration
app.listen(config.port, () => {
    console.log(`API server running on port ${config.port}`);
});
```

#### 2. CORS Configuration
```javascript
// Simple CORS middleware
const cors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.corsOrigin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
};

app.use(cors);
```

### 🧪 Testing Your Extensions

Add tests for new endpoints:

```javascript
// In tests/foundations/api.test.js

runner.test('New endpoint - status check', () => {
    // Test your new /api/status endpoint structure
    const expectedResponse = { 
        status: 'healthy', 
        timestamp: expect.any(String),
        version: '1.0.0'
    };
    // Add validation logic
});
```

### 📦 Production Deployment Tips

1. **Security Headers**: Add helmet.js for security headers
2. **HTTPS**: Always use HTTPS in production
3. **Logging**: Use winston or similar for structured logging
4. **Monitoring**: Add health check endpoints
5. **Documentation**: Consider adding Swagger/OpenAPI documentation
6. **Testing**: Add integration tests for all endpoints

### 🔗 Useful Libraries for Extension

- **express-rate-limit**: Professional rate limiting
- **helmet**: Security headers
- **cors**: CORS handling
- **joi** or **zod**: Input validation
- **jsonwebtoken**: JWT authentication
- **winston**: Logging
- **swagger-ui-express**: API documentation

This foundation provides a solid starting point for building sophisticated APIs while maintaining simplicity and extensibility.

## 📄 License

MIT License - Feel free to use this project as a foundation for your OpenAI applications!
