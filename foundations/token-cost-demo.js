/**
 * Token Usage and Cost Analysis Demo
 * 
 * This demo shows how to:
 * 1. Track token usage in real API calls
 * 2. Calculate exact costs for different models
 * 3. Compare pricing across models
 * 4. Monitor usage over multiple conversations
 * 5. Optimize for cost-effectiveness
 * 
 * Run: node foundations/token-cost-demo.js
 */

import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});

// Pricing data (as of 2025)
const PRICING = {
  'gpt-4o-mini': { input: 0.150, output: 0.600 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 }
};

/**
 * Cost Tracker Class - Production Ready
 */
class CostTracker {
  constructor() {
    this.sessions = [];
    this.totalCost = 0;
    this.totalTokens = 0;
    this.conversationCount = 0;
  }

  async trackConversation(messages, model = 'gpt-4o-mini', description = '') {
    const startTime = Date.now();
    
    try {
      console.log(`\n🔄 Making API call with ${model}...`);
      
      const response = await openai.chat.completions.create({
        model,
        messages,
        max_tokens: 200
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const usage = response.usage;

      // Calculate costs
      const inputCost = (usage.prompt_tokens / 1_000_000) * PRICING[model].input;
      const outputCost = (usage.completion_tokens / 1_000_000) * PRICING[model].output;
      const conversationCost = inputCost + outputCost;

      // Track session
      const session = {
        id: this.conversationCount + 1,
        model,
        description,
        usage,
        costs: { inputCost, outputCost, total: conversationCost },
        responseTime,
        timestamp: new Date().toISOString(),
        response: response.choices[0].message.content
      };

      this.sessions.push(session);
      this.totalCost += conversationCost;
      this.totalTokens += usage.total_tokens;
      this.conversationCount++;

      // Display results
      this.displayConversationResults(session);

      return response;

    } catch (error) {
      console.error(`❌ API Error: ${error.message}`);
      throw error;
    }
  }

  displayConversationResults(session) {
    console.log(`\n📊 CONVERSATION #${session.id} RESULTS:`);
    console.log(`   Model: ${session.model}`);
    console.log(`   Description: ${session.description}`);
    console.log(`   Response Time: ${session.responseTime}ms`);
    console.log(`\n🔢 TOKEN BREAKDOWN:`);
    console.log(`   Input tokens: ${session.usage.prompt_tokens}`);
    console.log(`   Output tokens: ${session.usage.completion_tokens}`);
    console.log(`   Total tokens: ${session.usage.total_tokens}`);
    console.log(`\n💰 COST BREAKDOWN:`);
    console.log(`   Input cost: $${session.costs.inputCost.toFixed(6)}`);
    console.log(`   Output cost: $${session.costs.outputCost.toFixed(6)}`);
    console.log(`   Total cost: $${session.costs.total.toFixed(6)}`);
    console.log(`\n🤖 AI RESPONSE:`);
    console.log(`   "${session.response.substring(0, 100)}${session.response.length > 100 ? '...' : ''}"`);
  }

  displayRunningTotals() {
    console.log(`\n📈 RUNNING TOTALS:`);
    console.log(`   Total conversations: ${this.conversationCount}`);
    console.log(`   Total tokens: ${this.totalTokens.toLocaleString()}`);
    console.log(`   Total cost: $${this.totalCost.toFixed(4)}`);
    console.log(`   Average cost per conversation: $${(this.totalCost/this.conversationCount).toFixed(6)}`);
    console.log(`   Average tokens per conversation: ${Math.round(this.totalTokens/this.conversationCount)}`);
  }

  generateReport() {
    console.log(`\n📋 DETAILED COST ANALYSIS REPORT`);
    console.log(`=`.repeat(50));
    
    // Group by model
    const byModel = {};
    this.sessions.forEach(session => {
      if (!byModel[session.model]) {
        byModel[session.model] = { count: 0, totalCost: 0, totalTokens: 0 };
      }
      byModel[session.model].count++;
      byModel[session.model].totalCost += session.costs.total;
      byModel[session.model].totalTokens += session.usage.total_tokens;
    });

    Object.entries(byModel).forEach(([model, stats]) => {
      console.log(`\n${model.toUpperCase()}:`);
      console.log(`   Conversations: ${stats.count}`);
      console.log(`   Total cost: $${stats.totalCost.toFixed(4)}`);
      console.log(`   Average cost: $${(stats.totalCost/stats.count).toFixed(6)}`);
      console.log(`   Total tokens: ${stats.totalTokens.toLocaleString()}`);
    });

    // Cost projections
    console.log(`\n📊 SCALING PROJECTIONS:`);
    const avgCostPerConversation = this.totalCost / this.conversationCount;
    console.log(`   1,000 conversations: $${(avgCostPerConversation * 1000).toFixed(2)}`);
    console.log(`   10,000 conversations: $${(avgCostPerConversation * 10000).toFixed(2)}`);
    console.log(`   100,000 conversations: $${(avgCostPerConversation * 100000).toFixed(2)}`);
  }

  exportToCSV() {
    const csvHeader = 'ID,Model,Description,InputTokens,OutputTokens,TotalTokens,InputCost,OutputCost,TotalCost,ResponseTime,Timestamp\n';
    const csvRows = this.sessions.map(session => 
      `${session.id},${session.model},"${session.description}",${session.usage.prompt_tokens},${session.usage.completion_tokens},${session.usage.total_tokens},${session.costs.inputCost},${session.costs.outputCost},${session.costs.total},${session.responseTime},${session.timestamp}`
    ).join('\n');
    
    return csvHeader + csvRows;
  }
}

/**
 * Demo Scenarios
 */
async function runTokenCostDemo() {
  console.log(`🚀 OpenAI Token Usage & Cost Analysis Demo`);
  console.log(`==========================================`);
  
  const tracker = new CostTracker();

  try {
    // Demo 1: Customer Service Conversation
    console.log(`\n🎯 DEMO 1: Customer Service Scenario`);
    await tracker.trackConversation([
      {
        role: "system", 
        content: "You are a helpful customer service assistant for an online electronics store."
      },
      {
        role: "user", 
        content: "I ordered a laptop 3 days ago but haven't received a tracking number. My order ID is #12345. Can you help me check the status?"
      }
    ], 'gpt-4o-mini', 'Customer Service - Order Status');

    // Demo 2: Technical Support
    console.log(`\n🎯 DEMO 2: Technical Support Scenario`);
    await tracker.trackConversation([
      {
        role: "system", 
        content: "You are a technical support specialist helping users with software issues."
      },
      {
        role: "user", 
        content: "My app keeps crashing when I try to upload files larger than 10MB. I'm using Chrome on Windows 11. What could be causing this?"
      }
    ], 'gpt-4o-mini', 'Technical Support - App Issues');

    // Demo 3: Content Creation (longer response)
    console.log(`\n🎯 DEMO 3: Content Creation Scenario`);
    await tracker.trackConversation([
      {
        role: "system", 
        content: "You are a creative writing assistant helping with marketing copy."
      },
      {
        role: "user", 
        content: "Write a compelling product description for a new smart home security camera with AI motion detection, night vision, and mobile alerts."
      }
    ], 'gpt-4o-mini', 'Content Creation - Product Description');

    tracker.displayRunningTotals();

    // Demo 4: Model Comparison - Same prompt, different models
    console.log(`\n🎯 DEMO 4: Model Cost Comparison`);
    console.log(`Testing the same prompt with different models:`);
    
    const comparisonPrompt = [
      {
        role: "user", 
        content: "Explain the concept of machine learning in simple terms that a beginner could understand."
      }
    ];

    // Test with gpt-4o-mini
    await tracker.trackConversation(
      comparisonPrompt, 
      'gpt-4o-mini', 
      'Model Comparison - GPT-4o-mini'
    );

    // Test with gpt-4o (more expensive)
    await tracker.trackConversation(
      comparisonPrompt, 
      'gpt-4o', 
      'Model Comparison - GPT-4o'
    );

    // Final analysis
    tracker.displayRunningTotals();
    tracker.generateReport();

    // Export data for analysis
    console.log(`\n💾 Exporting usage data...`);
    const csvData = tracker.exportToCSV();
    console.log(`\n📄 CSV Export (first 200 chars):`);
    console.log(csvData.substring(0, 200) + '...');

  } catch (error) {
    console.error(`❌ Demo failed: ${error.message}`);
    
    if (error.message.includes('API key')) {
      console.log(`\n🔑 Setup Instructions:`);
      console.log(`1. Get your API key from: https://platform.openai.com/api-keys`);
      console.log(`2. Create a .env file in the project root`);
      console.log(`3. Add: OPENAI_API_KEY=your_api_key_here`);
    }
  }
}

/**
 * Cost Calculator Functions
 */
function calculateProjectedCosts(avgTokens, conversations, model = 'gpt-4o-mini') {
  const pricing = PRICING[model];
  const inputRatio = 0.4; // Assume 40% input, 60% output tokens
  const outputRatio = 0.6;
  
  const inputTokens = avgTokens * inputRatio * conversations;
  const outputTokens = avgTokens * outputRatio * conversations;
  
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  
  return {
    model,
    conversations,
    totalTokens: avgTokens * conversations,
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    costPerConversation: (inputCost + outputCost) / conversations
  };
}

function demonstrateScalingCalculations() {
  console.log(`\n📊 SCALING COST PROJECTIONS`);
  console.log(`==========================`);
  
  const scenarios = [
    { name: 'Small App', conversations: 1000, avgTokens: 100 },
    { name: 'Medium Business', conversations: 10000, avgTokens: 150 },
    { name: 'Large Enterprise', conversations: 100000, avgTokens: 200 }
  ];
  
  scenarios.forEach(scenario => {
    console.log(`\n🏢 ${scenario.name}:`);
    console.log(`   ${scenario.conversations.toLocaleString()} conversations/month`);
    console.log(`   ${scenario.avgTokens} tokens per conversation`);
    
    ['gpt-4o-mini', 'gpt-4o'].forEach(model => {
      const projection = calculateProjectedCosts(scenario.avgTokens, scenario.conversations, model);
      console.log(`\n   ${model}:`);
      console.log(`     Monthly cost: $${projection.totalCost.toFixed(2)}`);
      console.log(`     Cost per conversation: $${projection.costPerConversation.toFixed(6)}`);
      console.log(`     Annual cost: $${(projection.totalCost * 12).toFixed(2)}`);
    });
  });
}

// Run the demo
console.log(`⚡ Starting Token Cost Demo...`);
console.log(`Make sure you have OPENAI_API_KEY in your .env file!\n`);

runTokenCostDemo().then(() => {
  demonstrateScalingCalculations();
  console.log(`\n✅ Demo completed! Check the output above for detailed cost analysis.`);
}).catch(error => {
  console.error(`❌ Demo error:`, error.message);
});
