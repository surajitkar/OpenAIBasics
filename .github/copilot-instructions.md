# OpenAI Hackathon Starter - AI Coding Agent Instructions

## Project Overview

This is a modular Node.js educational project demonstrating OpenAI API capabilities across 5 learning modules, from basic setup to advanced multi-agent workflows. The project uses ES modules (`"type": "module"` in package.json) and follows a clear module-based architecture.

## Critical Project Architecture

### Module Structure & Technology Decisions
- **foundations/**: Core OpenAI API setup, token cost tracking (`openai-setup.js`, `token-cost-demo.js`)
- **chatbot/**: Interactive terminal-based chatbot with persistent memory (`chatbot.js`)
- **advanced/**: Function calling patterns with external APIs (`weather-function.js`)
- **agents/**: OpenAI Agents SDK demos for workflow orchestration (`agent-demo.js`, `multi-agent-demo.js`)
- **assistants/**: OpenAI Assistants API for stateful conversations (`persistent-assistant-demo.js`, `file-analysis-demo.js`)
- **demo-all.js**: Sequential runner that executes all modules with user prompts

### Key Technology Distinctions (Essential for AI Agents)
When working on this codebase, understand these critical differences:

**Agents SDK vs Assistants API** - This is the core architectural decision:
- **Agents SDK**: Use for stateless workflows, multi-agent coordination, real-time handoffs. Pattern: `run(agent, userInput)`
- **Assistants API**: Use for persistent conversations, file handling, code interpretation. Pattern: `threads.runs.createAndPoll()`

**ES Module Requirements**:
- All files use `import`/`export` syntax, never `require()`
- Tools in Agents SDK must use Zod schemas with NO `.optional()` fields
- Environment variables loaded via `import 'dotenv/config'`

## Development Workflows

### Running Demos
```bash
# Complete demo sequence
node demo-all.js

# Individual modules
node foundations/openai-setup.js
node agents/agent-demo.js "specific query"
node advanced/weather-function.js "Tokyo"
```

### Environment Setup Pattern
```javascript
import 'dotenv/config';  // Always this import style
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

### Error Handling Pattern
Every demo includes quota/billing error detection:
```javascript
if (error.message.includes('quota') || error.message.includes('billing')) {
  console.log('💡 Note: This demo requires an active OpenAI account with available credits.');
}
```

## Project-Specific Patterns

### Tool Definition (Agents SDK)
```javascript
const myTool = tool({
  name: 'tool_name',
  description: 'Clear description',
  parameters: z.object({ 
    field: z.string().describe('Description')  // NO .optional()
  }),
  execute: async (input) => { /* implementation */ }
});
```

### Cost Tracking Implementation
The project emphasizes real cost monitoring. When adding new API calls, include token usage tracking:
```javascript
const response = await openai.chat.completions.create(params);
console.log('Token usage:', response.usage);
```

### Mock Data Fallbacks
External APIs (like weather) include mock data when API keys aren't available - maintain this pattern for new integrations.

### Interactive Demo Structure
Demos follow this pattern:
1. Console header with module info
2. Sequential tests with separators (`'─'.repeat(50)`)
3. User prompts via `waitForUser()` in demo-all.js
4. Cleanup sections for resources

## Integration Points

### OpenAI Dependencies
- Core: `openai` package for Chat Completions and Assistants
- Agents: `@openai/agents` package with `zod` for schemas
- Environment: `dotenv` for configuration
- HTTP: `axios` for external API calls

### Model Selection Strategy
- Default: `gpt-4o-mini` for cost-effective demos
- Upgrade: `gpt-4o` only for complex reasoning (weather-function.js example)
- Consistent across modules for predictable behavior

### File Organization Conventions
- Each module is self-contained with clear entry points
- Shared utilities avoided - each demo is standalone for learning
- Comments emphasize the "why" behind architectural choices

## Common Pitfalls for AI Agents

1. **Don't mix Agents and Assistants patterns** - They have different execution models
2. **ES Module imports only** - No CommonJS in this project
3. **Zod schemas must be fully required** - No optional fields in Agent tools
4. **Environment variable precedence** - System env vars override .env file
5. **Resource cleanup** - Assistants create persistent resources that need deletion

## Testing & Validation

- Run `demo-all.js` after changes to ensure all modules work
- Each module should handle missing API keys gracefully (mock data fallbacks)
- Console output should be educational and clearly formatted
- Interactive modes should handle `exit` commands and Ctrl+C

## When Adding New Features

- Follow the module structure (foundations → chatbot → advanced → agents → assistants)
- Include cost tracking and error handling
- Add educational console output explaining the technology being demonstrated
- Update `demo-all.js` if adding new entry points
- Maintain the learning progression from simple to complex
