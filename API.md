# OpenAI Hackathon Starter API Documentation

## Overview
This API provides access to OpenAI's capabilities through a simple REST interface, including chat completions, AI agents, weather information, and file analysis.

## Base URL
```
http://localhost:3001
```

## Endpoints

### Health Check
- **GET** `/api/health`
- Returns the health status of the API server

### Chat Completions
- **POST** `/api/chat`
- Send messages to OpenAI's chat completion API
- Body: `{"message": "Hello", "stream": false}`
- Supports streaming responses when `stream: true`

### Weather Information
- **GET** `/api/weather?city=Tokyo`
- Get current weather for a city
- Optional: `&forecast=true` for 3-day forecast

### AI Agents
- **GET** `/api/agents` - List available agents
- **POST** `/api/agents/weather` - Weather agent
- **POST** `/api/agents/math` - Math calculation agent

### File Analysis
- **POST** `/api/assistants/analyze-file`
- Upload and analyze files using OpenAI Assistants
- Supports text files, CSV, JSON, and Markdown

### Authentication
- **POST** `/api/auth/validate`
- Validate OpenAI API keys
- Body: `{"api_key": "sk-..."}`

## Authentication
Set the `OPENAI_API_KEY` environment variable with your OpenAI API key.

## Error Handling
All endpoints return appropriate HTTP status codes with JSON error messages.

## Rate Limiting
The API implements basic rate limiting to prevent abuse.

## Examples

### Chat Request
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Weather Request
```bash
curl "http://localhost:3001/api/weather?city=Tokyo&forecast=true"
```

### Agent Request
```bash
curl -X POST http://localhost:3001/api/agents/math \
  -H "Content-Type: application/json" \
  -d '{"message": "What is 15 * 23 + 47?"}'
```

### File Analysis
```bash
curl -X POST http://localhost:3001/api/assistants/analyze-file \
  -F "file=@data.txt" \
  -F "question=What insights can you provide?"
```

## Response Formats
All responses are in JSON format with consistent error handling and status codes.