# OpenAI Hackathon Starter - React Frontend

A modern React frontend for the OpenAI Hackathon Starter project, providing an intuitive web interface for all existing OpenAI capabilities.

## 🚀 Features

- **Interactive Chat Interface**: Real-time messaging with AI agents
- **Agent Selection**: Switch between different AI agents (Chatbot, Fact Agent, Weather Agent, Assistant)
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Status**: API connection monitoring
- **Settings Panel**: Configuration help and project information
- **Error Handling**: Graceful error handling with user feedback
- **Token Usage Tracking**: Monitor API usage and costs

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API communication

## 📋 Prerequisites

1. Node.js 18+ installed
2. Backend API server running (`api-server.js`)
3. OpenAI API key configured (optional for demo)

## 🚦 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```bash
VITE_API_URL=http://localhost:3001
```

### API Server

The frontend requires the backend API server to be running. Start it with:

```bash
cd ..
node api-server.js
```

## 🎯 Usage

### Chat Interface

1. **Select an Agent**: Choose from the available AI agents in the sidebar
2. **Start Chatting**: Type your message and press Enter or click Send
3. **View Responses**: See AI responses with metadata (agent name, tools used, token usage)
4. **Clear Chat**: Use the trash icon to clear the conversation

### Available Agents

- **Basic Chatbot**: Simple conversational AI
- **Fact Agent**: Get interesting facts about topics
- **Weather Agent**: Get weather information for cities
- **OpenAI Assistant**: Persistent conversation assistant

### Settings Panel

- **API Settings**: View configuration requirements
- **About**: Project information and technology stack
- **Links**: Direct links to OpenAI dashboard and GitHub

## 🏗️ Component Structure

```
src/
├── components/
│   ├── Chat/
│   │   └── ChatInterface.jsx     # Main chat component
│   ├── AgentSelector/
│   │   └── AgentSelector.jsx     # Agent selection sidebar
│   └── Settings/
│       └── SettingsPanel.jsx     # Settings and configuration
├── App.jsx                       # Main application component
├── main.jsx                      # React entry point
└── index.css                     # Global styles
```

## 🎨 Styling

The frontend uses Tailwind CSS for styling:

- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional interface
- **Accessible**: Proper contrast and keyboard navigation
- **Consistent**: Unified design system

## 🔌 API Integration

The frontend communicates with the backend API server:

- **Health Check**: `GET /api/health`
- **Agent List**: `GET /api/agents`
- **Basic Chat**: `POST /api/chat`
- **Agent Chat**: `POST /api/agents/:agentId/chat`
- **Weather**: `POST /api/weather`

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### File Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── Chat/
│   │   ├── AgentSelector/
│   │   └── Settings/
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── postcss.config.js       # PostCSS configuration
```

## 🚨 Troubleshooting

### Common Issues

**Frontend won't start:**
- Check Node.js version (18+ required)
- Run `npm install` to ensure dependencies are installed
- Check for port conflicts (default: 5173)

**API connection failed:**
- Ensure backend server is running on port 3001
- Check CORS settings in api-server.js
- Verify API_URL in .env file

**Styling issues:**
- Ensure Tailwind CSS is properly configured
- Check postcss.config.js and tailwind.config.js
- Rebuild the project: `npm run build`

**Build fails:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors in JSX files
- Verify all imports are correct

## 📝 Contributing

1. Follow the existing code style
2. Use meaningful component names
3. Add proper error handling
4. Test on different screen sizes
5. Document any new features

## 🔗 Integration

This frontend integrates seamlessly with the existing OpenAI Hackathon Starter project:

- Maintains all existing backend functionality
- Adds web interface without breaking CLI tools
- Preserves educational structure and examples
- Enhances user experience with modern UI

## 📄 License

MIT License - Part of the OpenAI Hackathon Starter project.
