# OpenAI Technologies Guide for Novice Engineers

This guide explains the different OpenAI technologies, their capabilities, and when to use each one. Perfect for engineers new to AI development!

## 🎯 Overview: The OpenAI Ecosystem

OpenAI provides several different technologies for building AI applications. Think of them as different tools in a toolbox - each one is designed for specific types of problems.

```
🔧 OpenAI Toolbox:
├── 📝 Chat Completions API (Basic conversations)
├── ⚡ Function Calling (AI that can use tools)
├── 👥 Agents SDK (Multiple AIs working together)
└── 💾 Assistants API (Persistent AI with memory)
```

## 📊 Technology Comparison Table

| Technology | Best For | Complexity | State | Memory | Use Case Example |
|------------|----------|------------|--------|--------|------------------|
| **Chat Completions** | Simple Q&A | ⭐ Beginner | Stateless | None | Customer FAQ bot |
| **Function Calling** | AI + External APIs | ⭐⭐ Intermediate | Stateless | None | Weather chatbot |
| **Agents SDK** | Complex workflows | ⭐⭐⭐ Advanced | Stateless* | Manual | Multi-step automation |
| **Assistants API** | Long conversations | ⭐⭐ Intermediate | Stateful | Automatic | Personal assistant |

*Agents can manage state, but you need to handle it yourself

## 🔍 Detailed Technology Breakdown

### 1. 📝 Chat Completions API
**What it is:** The basic building block for AI conversations.

**Think of it like:** A smart person who answers questions but forgets everything after each conversation.

**Key Features:**
- ✅ Simple to use
- ✅ Fast responses
- ✅ Cost-effective
- ❌ No memory between conversations
- ❌ Can't use external tools

**When to use:**
- Building your first AI chatbot
- Simple question-answering systems
- One-off AI interactions
- Learning AI basics

**Example Code:**
```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is the capital of France?" }
  ]
});
```

**Real-world examples:**
- FAQ bots on websites
- Simple writing assistants
- Basic translation tools

---

### 2. ⚡ Function Calling (Advanced Chat Completions)
**What it is:** Chat Completions API + the ability to use external tools and APIs.

**Think of it like:** A smart assistant who can not only answer questions but also check the weather, send emails, or look up information in databases.

**Key Features:**
- ✅ Can call external APIs
- ✅ Structured data handling
- ✅ Tool integration
- ❌ Still no memory between conversations
- ❌ Limited to single-step workflows

**When to use:**
- AI that needs real-time data (weather, stocks, news)
- Chatbots that need to perform actions
- Integration with existing APIs
- Data processing and analysis

**Example Code:**
```javascript
const functions = [{
  name: "get_weather",
  description: "Get current weather for a city",
  parameters: {
    type: "object",
    properties: {
      city: { type: "string" }
    }
  }
}];

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: messages,
  functions: functions,
  function_call: "auto"
});
```

**Real-world examples:**
- Weather chatbots
- E-commerce assistants that can check inventory
- News bots that fetch latest articles
- Calculator bots

---

### 3. 👥 Agents SDK (Multi-Agent Workflows)
**What it is:** A framework for creating multiple AI agents that can work together and hand tasks between each other.

**Think of it like:** A team of specialized experts who can collaborate - one handles customer service, another handles technical questions, and they can pass conversations between each other.

**Key Features:**
- ✅ Multiple agents working together
- ✅ Agent handoffs and routing
- ✅ Custom tools and capabilities
- ✅ Real-time voice support
- ✅ Parallel processing
- ⚠️ More complex to set up
- ⚠️ Requires understanding of workflows

**When to use:**
- Complex business processes
- Multi-step workflows
- When you need different AI personalities/specializations
- Voice applications
- Advanced automation systems

**Example Code:**
```javascript
const weatherAgent = new Agent({
  name: 'Weather Expert',
  instructions: 'You handle all weather-related questions',
  tools: [weatherTool]
});

const coordinator = Agent.create({
  name: 'Coordinator',
  instructions: 'Route questions to the right specialist',
  handoffs: [weatherAgent, mathAgent, creativeAgent]
});
```

**Real-world examples:**
- Customer support systems with specialized agents
- Complex data analysis workflows
- Multi-step business process automation
- Voice assistants with different capabilities

---

### 4. 💾 Assistants API (Persistent Conversations)
**What it is:** AI assistants that remember conversations and can work with files.

**Think of it like:** A personal assistant who remembers all your previous conversations, can analyze documents, and write code for you.

**Key Features:**
- ✅ Persistent memory across conversations
- ✅ File upload and processing
- ✅ Built-in code interpreter
- ✅ Conversation threads
- ✅ Built-in tools (file search, code execution)
- ⚠️ More expensive due to persistent storage
- ⚠️ Single assistant per conversation

**When to use:**
- Long-term customer relationships
- Document analysis and Q&A
- Data science and code generation
- Personal productivity assistants
- Educational tutoring systems

**Example Code:**
```javascript
const assistant = await openai.beta.assistants.create({
  name: "Data Analyst",
  instructions: "You help analyze data and generate insights",
  tools: [{ type: "code_interpreter" }, { type: "file_search" }],
  model: "gpt-4o-mini"
});

const thread = await openai.beta.threads.create();
```

**Real-world examples:**
- Personal AI assistants (like ChatGPT Plus)
- Document analysis tools
- Educational tutoring bots
- Data science assistants

## 🚦 Decision Tree: Which Technology Should I Use?

### Start Here: What are you building?

**🤔 Simple Q&A or basic chatbot?**
→ Use **Chat Completions API**
- Perfect for beginners
- Fastest to implement
- Most cost-effective

**🛠️ Need to use external data or APIs?**
→ Use **Function Calling**
- Weather, stocks, database lookups
- Real-time information
- Tool integration

**🧠 Need to remember previous conversations?**
→ Use **Assistants API**
- Customer support with history
- Personal assistants
- Document analysis

**⚙️ Complex workflows with multiple steps?**
→ Use **Agents SDK**
- Multi-agent collaboration
- Complex business processes
- Advanced automation

## 💡 Beginner's Learning Path

### Phase 1: Foundation (Week 1-2)
1. **Start with Chat Completions API**
   - Build a simple chatbot
   - Learn about prompts and responses
   - Understand API costs and rate limits

### Phase 2: Add Tools (Week 3-4)
2. **Move to Function Calling**
   - Add weather or news API
   - Learn about JSON schemas
   - Practice error handling

### Phase 3: Add Memory (Week 5-6)
3. **Try Assistants API**
   - Build a persistent assistant
   - Upload and analyze files
   - Use code interpreter

### Phase 4: Advanced Workflows (Week 7+)
4. **Explore Agents SDK**
   - Create multiple specialized agents
   - Set up agent handoffs
   - Build complex workflows

## 🎨 Project Ideas by Technology

### Chat Completions API Projects
- Personal journal analyzer
- Writing style improver
- Simple language translator
- Code comment generator

### Function Calling Projects
- Weather assistant with location
- Stock price tracker
- News summarizer
- Recipe finder with ingredients API

### Assistants API Projects
- Document Q&A system
- Personal productivity assistant
- Code review assistant
- Data analysis helper

### Agents SDK Projects
- Multi-language customer support
- Complex research assistant
- Automated content creation pipeline
- Voice-based home automation

## 💰 Cost Considerations

### Most Cost-Effective → Most Expensive
1. **Chat Completions API** - Pay per message, no storage
2. **Function Calling** - Same as above + external API costs
3. **Agents SDK** - Pay per agent interaction + coordination overhead
4. **Assistants API** - Pay per message + storage for threads and files

### Cost Optimization Tips:
- Start with smaller models (gpt-4o-mini vs gpt-4o)
- Use system prompts to reduce input tokens
- Cache results when possible
- Monitor usage with OpenAI dashboard

## 🧠 Essential Concepts for Novice Engineers

### 🎯 Tokens: The Currency of AI

**What are tokens?** Tokens are the basic units that AI models use to process text. Think of them as "word pieces."

**Key Facts:**
- 1 token ≈ 0.75 words (rough estimate)
- "Hello world!" = 3 tokens
- Both input (your prompt) and output (AI response) count as tokens
- You pay for total tokens used (input + output)

**Token Examples:**
```javascript
// Short message: ~10 tokens
"What is AI?" 

// Medium message: ~25 tokens  
"Can you explain how machine learning works in simple terms?"

// Long message: ~100 tokens
"I'm building a customer service chatbot for my e-commerce website. 
It needs to handle order inquiries, return requests, and product 
questions. What's the best approach to implement this?"
```

**Token Calculator:** Use OpenAI's tokenizer tool to count tokens before sending requests.

---

### 💡 Real Example: Token Usage and Cost Breakdown

Let's see a real API call with actual token counts and costs:

```javascript
import { OpenAI } from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});

async function analyzeTokensAndCost() {
  const conversation = [
    {
      role: "system", 
      content: "You are a helpful customer service assistant for an online store."
    },
    {
      role: "user", 
      content: "I ordered a laptop 3 days ago but haven't received a tracking number. My order ID is #12345. Can you help me check the status?"
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversation,
      max_tokens: 150
    });

    // Extract token usage from response
    const usage = response.usage;
    
    console.log("📊 TOKEN USAGE BREAKDOWN:");
    console.log(`Input tokens: ${usage.prompt_tokens}`);
    console.log(`Output tokens: ${usage.completion_tokens}`);
    console.log(`Total tokens: ${usage.total_tokens}`);
    
    // Calculate costs (GPT-4o-mini pricing)
    const inputCost = (usage.prompt_tokens / 1_000_000) * 0.150;  // $0.150 per 1M input tokens
    const outputCost = (usage.completion_tokens / 1_000_000) * 0.600; // $0.600 per 1M output tokens
    const totalCost = inputCost + outputCost;
    
    console.log("\n💰 COST BREAKDOWN:");
    console.log(`Input cost: $${inputCost.toFixed(6)}`);
    console.log(`Output cost: $${outputCost.toFixed(6)}`);
    console.log(`Total cost: $${totalCost.toFixed(6)}`);
    
    console.log("\n🤖 AI RESPONSE:");
    console.log(response.choices[0].message.content);
    
    return {
      usage,
      costs: { inputCost, outputCost, totalCost },
      response: response.choices[0].message.content
    };
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the example
analyzeTokensAndCost();
```

**Example Output:**
```
📊 TOKEN USAGE BREAKDOWN:
Input tokens: 45
Output tokens: 87
Total tokens: 132

💰 COST BREAKDOWN:
Input cost: $0.000007
Output cost: $0.000052
Total cost: $0.000059

🤖 AI RESPONSE:
I'd be happy to help you check your order status! I can see you're looking for 
tracking information for order #12345 placed 3 days ago. Let me look that up 
for you right away.

Based on your order ID, I can see your laptop order is currently being processed 
at our fulfillment center. You should receive your tracking number within the 
next 24 hours via email. Orders typically ship within 3-5 business days, and 
since today is day 3, you're right on schedule!

Is there anything else I can help you with regarding your order?
```

**📈 Scaling Example: 1000 Similar Conversations**
```javascript
// If you had 1000 customers with similar conversations:
const conversations = 1000;
const avgTokensPerConversation = 132;
const totalTokens = conversations * avgTokensPerConversation; // 132,000 tokens

// Cost calculation for 1000 conversations
const scaledInputCost = (45 * conversations / 1_000_000) * 0.150;   // $0.007
const scaledOutputCost = (87 * conversations / 1_000_000) * 0.600;  // $0.052
const scaledTotalCost = scaledInputCost + scaledOutputCost;         // $0.059

console.log(`💼 BUSINESS SCALE EXAMPLE:`);
console.log(`1000 customer conversations = $${scaledTotalCost.toFixed(3)}`);
console.log(`Cost per customer = $${(scaledTotalCost/1000).toFixed(6)}`);
console.log(`Monthly cost (30k conversations) = $${(scaledTotalCost * 30).toFixed(2)}`);
```

**Business Scale Output:**
```
💼 BUSINESS SCALE EXAMPLE:
1000 customer conversations = $0.059
Cost per customer = $0.000059
Monthly cost (30k conversations) = $1.77
```

**🎯 Key Insights from this Example:**
- **Single conversation cost:** Less than $0.0001 (incredibly cheap!)
- **Input vs Output:** Output tokens cost 4x more than input tokens
- **Business scale:** Even 30,000 conversations per month = under $2
- **Model choice matters:** GPT-4o would cost ~15x more for the same conversation

**📱 Mobile App Example with Cost Tracking:**
```javascript
class CostTracker {
  constructor() {
    this.totalCost = 0;
    this.totalTokens = 0;
    this.conversationCount = 0;
  }

  async trackConversation(messages, model = 'gpt-4o-mini') {
    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: 200
    });

    const usage = response.usage;
    const pricing = {
      'gpt-4o-mini': { input: 0.150, output: 0.600 },
      'gpt-4o': { input: 2.50, output: 10.00 }
    };

    const inputCost = (usage.prompt_tokens / 1_000_000) * pricing[model].input;
    const outputCost = (usage.completion_tokens / 1_000_000) * pricing[model].output;
    const conversationCost = inputCost + outputCost;

    // Update totals
    this.totalCost += conversationCost;
    this.totalTokens += usage.total_tokens;
    this.conversationCount++;

    console.log(`💬 Conversation #${this.conversationCount}`);
    console.log(`   Tokens: ${usage.total_tokens} | Cost: $${conversationCost.toFixed(6)}`);
    console.log(`📊 Running Totals:`);
    console.log(`   Total conversations: ${this.conversationCount}`);
    console.log(`   Total tokens: ${this.totalTokens.toLocaleString()}`);
    console.log(`   Total cost: $${this.totalCost.toFixed(4)}`);
    console.log(`   Average cost per conversation: $${(this.totalCost/this.conversationCount).toFixed(6)}`);

    return response;
  }

  getStats() {
    return {
      conversations: this.conversationCount,
      totalTokens: this.totalTokens,
      totalCost: this.totalCost,
      avgCostPerConversation: this.totalCost / this.conversationCount,
      avgTokensPerConversation: this.totalTokens / this.conversationCount
    };
  }
}

// Usage example:
const tracker = new CostTracker();

// Simulate a few conversations
await tracker.trackConversation([
  { role: "user", content: "What's the weather like?" }
]);

await tracker.trackConversation([
  { role: "user", content: "Help me write a professional email" }
]);

await tracker.trackConversation([
  { role: "user", content: "Explain quantum computing in simple terms" }
]);

console.log("\n📈 Final Statistics:", tracker.getStats());
```

---

### 📝 Context: AI's Memory Window

**What is context?** Context is how much conversation history the AI can "remember" in a single conversation.

**Context Window Sizes:**
- **GPT-4o-mini**: 128K tokens (~96,000 words)
- **GPT-4o**: 128K tokens (~96,000 words)
- **GPT-3.5-turbo**: 16K tokens (~12,000 words)

**Context Example:**
```javascript
const conversation = [
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "My name is Alice." },
  { role: "assistant", content: "Nice to meet you, Alice!" },
  { role: "user", content: "What's my name?" }, // AI remembers: "Alice"
  { role: "assistant", content: "Your name is Alice." }
];
// Total context: All messages combined must fit in context window
```

**Context Management Tips:**
- Keep conversations focused to save tokens
- Remove old messages when context gets full
- Use system prompts efficiently
- Summarize long conversations periodically

---

### 💵 Pricing: Understanding Costs

**Current Pricing (as of 2025):**

| Model | Input Price | Output Price | Context Window |
|-------|-------------|--------------|----------------|
| **gpt-4o-mini** | $0.150/1M tokens | $0.600/1M tokens | 128K |
| **gpt-4o** | $2.50/1M tokens | $10.00/1M tokens | 128K |
| **gpt-3.5-turbo** | $0.50/1M tokens | $1.50/1M tokens | 16K |

**Cost Examples:**
```javascript
// Example 1: Simple chatbot (gpt-4o-mini)
// 1000 users, 10 messages each, 50 tokens per interaction
// Cost: (1000 × 10 × 50) ÷ 1,000,000 × $0.15 = $0.075

// Example 2: Complex analysis (gpt-4o)  
// 100 documents, 2000 tokens each
// Cost: (100 × 2000) ÷ 1,000,000 × $2.50 = $0.50

// Example 3: Customer support (gpt-4o-mini)
// 500 conversations, 200 tokens average
// Cost: (500 × 200) ÷ 1,000,000 × $0.15 = $0.015
```

**Money-Saving Tips:**
1. **Start with gpt-4o-mini** - 10x cheaper than gpt-4o
2. **Optimize prompts** - Shorter, clearer prompts = fewer tokens
3. **Cache responses** - Don't ask the same question twice
4. **Set usage limits** - Prevent unexpected bills
5. **Monitor daily** - Check OpenAI dashboard regularly

---

### ⚡ Rate Limits: Traffic Control

**What are rate limits?** Limits on how many requests you can make per minute/day.

**Current Rate Limits (Free Tier):**
- **Requests per minute (RPM):** 3-20 depending on model
- **Tokens per minute (TPM):** 40K-200K depending on model
- **Requests per day (RPD):** 200-10,000 depending on model

**Paid Tier Benefits:**
- Higher rate limits based on usage tier
- Priority access during high demand
- Faster response times

**Rate Limit Examples:**
```javascript
// ❌ This will hit rate limits quickly
for (let i = 0; i < 100; i++) {
  await openai.chat.completions.create({
    messages: [{ role: "user", content: `Question ${i}` }],
    model: "gpt-4o-mini"
  });
}

// ✅ Better: Add delays between requests
for (let i = 0; i < 100; i++) {
  await openai.chat.completions.create({
    messages: [{ role: "user", content: `Question ${i}` }],
    model: "gpt-4o-mini"
  });
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
}

// ✅ Best: Batch multiple questions together
const allQuestions = Array.from({length: 10}, (_, i) => `Question ${i}`);
const batchPrompt = `Please answer these questions:\n${allQuestions.join('\n')}`;

const response = await openai.chat.completions.create({
  messages: [{ role: "user", content: batchPrompt }],
  model: "gpt-4o-mini"
});
```

**Rate Limit Handling:**
```javascript
async function makeAPICallWithRetry(prompt, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini"
      });
      return response;
    } catch (error) {
      if (error.status === 429) { // Rate limit error
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Rate limited. Waiting ${delay}ms before retry ${attempt}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Non-rate-limit error
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

### 📊 Real-World Cost Calculator

**Interactive Cost Estimator:**
```javascript
function estimateCost(users, messagesPerUser, avgTokensPerMessage, model = 'gpt-4o-mini') {
  const pricing = {
    'gpt-4o-mini': { input: 0.150, output: 0.600 },
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 }
  };
  
  const totalTokens = users * messagesPerUser * avgTokensPerMessage;
  const inputCost = (totalTokens / 1000000) * pricing[model].input;
  const outputCost = (totalTokens / 1000000) * pricing[model].output; // Assuming equal input/output
  
  return {
    totalTokens,
    inputCost: inputCost.toFixed(4),
    outputCost: outputCost.toFixed(4),
    totalCost: (inputCost + outputCost).toFixed(4),
    model
  };
}

// Example usage:
console.log(estimateCost(1000, 5, 100, 'gpt-4o-mini'));
// Output: { totalTokens: 500000, inputCost: '0.0750', outputCost: '0.3000', totalCost: '0.3750', model: 'gpt-4o-mini' }
```

---

### 🎛️ Monitoring and Analytics

**Essential Metrics to Track:**
1. **Token usage per day/month**
2. **Average response time** 
3. **Error rates and types**
4. **Cost per user/conversation**
5. **Rate limit hits**

**OpenAI Dashboard Monitoring:**
```javascript
// Add logging to track usage
async function loggedAPICall(prompt, userId = 'anonymous') {
  const startTime = Date.now();
  
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini"
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Log metrics
    console.log({
      userId,
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      totalTokens: response.usage.total_tokens,
      responseTime,
      timestamp: new Date().toISOString()
    });
    
    return response;
  } catch (error) {
    console.error('API Error:', {
      userId,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}
```

---

### 🚨 Common Pitfalls and Solutions

**Pitfall 1: Unexpected High Costs**
```javascript
// ❌ Problem: Uncontrolled loops
while (condition) {
  await callOpenAI(data); // Could run forever!
}

// ✅ Solution: Set limits
let attempts = 0;
const maxAttempts = 10;
while (condition && attempts < maxAttempts) {
  await callOpenAI(data);
  attempts++;
}
```

**Pitfall 2: Context Window Overflow**
```javascript
// ❌ Problem: Adding unlimited conversation history
conversation.push(newMessage); // Eventually exceeds context limit

// ✅ Solution: Manage conversation length
function manageConversation(conversation, maxTokens = 4000) {
  let totalTokens = 0;
  const managedConversation = [];
  
  // Count from newest to oldest
  for (let i = conversation.length - 1; i >= 0; i--) {
    const messageTokens = conversation[i].content.length / 4; // Rough estimate
    if (totalTokens + messageTokens > maxTokens) break;
    
    managedConversation.unshift(conversation[i]);
    totalTokens += messageTokens;
  }
  
  return managedConversation;
}
```

**Pitfall 3: Rate Limit Crashes**
```javascript
// ❌ Problem: No error handling
const response = await openai.chat.completions.create(params);

// ✅ Solution: Proper error handling
try {
  const response = await openai.chat.completions.create(params);
  return response;
} catch (error) {
  if (error.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
  } else if (error.status === 401) {
    throw new Error('Invalid API key. Please check your configuration.');
  } else {
    throw new Error(`API Error: ${error.message}`);
  }
}
```

## 🔧 Getting Started Code Examples

### Quick Setup (All Technologies)
```bash
# Install dependencies
npm install openai @openai/agents zod axios dotenv

# Set environment variable
export OPENAI_API_KEY="your-api-key-here"
```

### Basic Templates

#### Chat Completions Template
```javascript
import { OpenAI } from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});

const chatCompletion = await openai.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'gpt-4o-mini',
});
```

#### Function Calling Template
```javascript
import { OpenAI } from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});

const tools = [{
  type: "function",
  function: {
    name: "get_weather",
    description: "Get weather for a city",
    parameters: {
      type: "object",
      properties: {
        city: { type: "string" }
      }
    }
  }
}];
```

#### Agents SDK Template
```javascript
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';

const myTool = tool({
  name: 'example_tool',
  description: 'An example tool',
  parameters: z.object({ input: z.string() }),
  execute: async (params) => `Result: ${params.input}`
});

const agent = new Agent({
  name: 'My Agent',
  instructions: 'You are a helpful assistant',
  tools: [myTool]
});
```

#### Assistants API Template
```javascript
import { OpenAI } from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});

const assistant = await openai.beta.assistants.create({
  name: "My Assistant",
  instructions: "You are a helpful assistant",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-4o-mini"
});
```

## 📚 Additional Resources

### Official Documentation
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Agents SDK GitHub](https://github.com/openai/openai-agents-js)
- [OpenAI Cookbook](https://cookbook.openai.com/)

### Community Resources
- [OpenAI Developer Forum](https://community.openai.com/)
- [OpenAI Discord](https://discord.gg/openai)
- [GitHub Examples](https://github.com/openai/openai-cookbook)

### Best Practices
1. **Always handle errors gracefully**
2. **Start simple and add complexity gradually**
3. **Monitor your API usage and costs**
4. **Use environment variables for API keys**
5. **Test with smaller models first**
6. **Cache responses when appropriate**

## 🎯 Summary for Novice Engineers

**If you're just starting:**
1. Begin with **Chat Completions API** - it's the easiest to understand
2. Add **Function Calling** when you need external data
3. Use **Assistants API** when you need memory and file handling
4. Graduate to **Agents SDK** for complex, multi-step workflows

**Remember:** You don't need to use the most advanced technology for every project. Choose the simplest solution that meets your requirements!

**Happy coding!** 🚀

---

*This guide is part of the OpenAI Hackathon Starter project. For hands-on examples, check out the demo files in each module.*
