# OpenAI Hackathon Starter

A comprehensive Node.js project demonstrating OpenAI API capabilities across 5 learning modules, from basic setup to advanced multi-agent workflows and persistent assistants. Now featuring a modern React frontend interface!

## 🚀 Quick Start

### Option 1: Web Interface (Recommended)
1. **Install dependencies:**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Set up your OpenAI API key:**
   - Create a `.env` file:
     ```
     OPENAI_API_KEY=your_api_key_here
     OPENAI_ORG_ID=your_organization_id_here  # Optional
     WEATHER_API_KEY=your_weatherapi_key_here  # Optional
     ```

3. **Start the web application:**
   ```bash
   npm run dev
   ```
   
   This starts both the backend API server and React frontend. Open http://localhost:5173 in your browser.

### Option 2: Command Line Interface
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your OpenAI API key (see above)**

3. **Run the complete demo:**
   ```bash
   node demo-all.js
   ```

## 🌐 React Frontend Features

The new React frontend provides:

- **Interactive Chat Interface**: Real-time messaging with all AI agents
- **Agent Selection**: Easy switching between different AI capabilities
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Status**: API connection monitoring
- **Settings Panel**: Configuration help and project information
- **Error Handling**: Graceful error handling with user feedback
- **Token Usage Tracking**: Monitor API usage and costs

### Frontend Technology Stack
- **React 18** with modern hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Express.js** API server bridge

## 📚 Project Structure

```
openai-hackathon-starter/
├── frontend/              # React Web Application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Chat/      # Chat interface
│   │   │   ├── AgentSelector/ # Agent selection
│   │   │   └── Settings/  # Settings panel
│   │   └── App.jsx        # Main app component
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
├── api-server.js          # Express API server (bridges frontend/backend)
├── foundations/           # Module 1: Core Implementation
│   ├── openai-setup.js    # Basic API setup and first call
│   └── token-cost-demo.js # Real token usage and cost tracking
├── chatbot/               # Module 2: Chatbot Development  
│   └── chatbot.js         # Interactive persistent chatbot
├── advanced/              # Module 3: Advanced Concepts
│   └── weather-function.js # Function calling with external APIs
├── agents/                # Module 4: OpenAI Agents SDK
│   ├── agent-demo.js      # Single agent with tools
│   └── multi-agent-demo.js # Multi-agent workflows & handoffs
├── assistants/            # Module 5: OpenAI Assistants API
│   ├── persistent-assistant-demo.js # Stateful conversations
│   └── file-analysis-demo.js # File processing & code interpreter
├── demo-all.js            # Complete demonstration runner
└── package.json           # Main project configuration
```

## 🛠️ Available Scripts

### Web Application
```bash
# Start both backend API and React frontend
npm run dev

# Start only the backend API server
npm run api

# Start only the frontend (requires API server running)
npm run frontend

# Build frontend for production
npm run build
```

### Command Line Interface
```bash
# Run complete demo sequence
node demo-all.js

# Run individual modules
node foundations/openai-setup.js
node chatbot/chatbot.js
node advanced/weather-function.js
node agents/agent-demo.js
node agents/multi-agent-demo.js
node assistants/persistent-assistant-demo.js
node assistants/file-analysis-demo.js
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

### Backend
- **@openai/agents**: OpenAI Agents SDK for advanced agent workflows
- **openai**: Official OpenAI API client
- **express**: Web server framework for API endpoints
- **cors**: Cross-origin resource sharing middleware
- **zod**: Schema validation (required for Agents SDK)
- **axios**: HTTP client for external API calls
- **dotenv**: Environment variable management
- **concurrently**: Run multiple commands simultaneously

### Frontend
- **react**: React library for building user interfaces
- **vite**: Fast build tool and dev server
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Beautiful icon library
- **axios**: HTTP client for API communication

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

## 📄 License

MIT License - Feel free to use this project as a foundation for your OpenAI applications!
