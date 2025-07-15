// OpenAI Assistants API: Persistent Conversation Demo
// This demonstrates the key differences between Assistants and Agents
import { OpenAI } from 'openai';
import { createInterface } from 'readline';
import 'dotenv/config';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

class PersistentAssistant {
  constructor() {
    this.assistant = null;
    this.thread = null;
  }

  async initialize() {
    console.log('🤖 Creating a persistent assistant...\n');
    
    // Create an assistant with specific instructions and tools
    this.assistant = await openai.beta.assistants.create({
      name: "Document Analyst",
      instructions: `You are a persistent document analyst assistant. You maintain context across conversations and can:
      - Analyze and remember document content across sessions
      - Maintain conversation history and context
      - Provide consistent responses based on previous interactions
      - Help with file analysis, code interpretation, and research tasks
      
      Always reference previous conversations when relevant and maintain a helpful, professional tone.`,
      model: "gpt-4o-mini",
      tools: [
        { type: "code_interpreter" },
        { type: "file_search" }
      ]
    });

    // Create a persistent thread for this conversation
    this.thread = await openai.beta.threads.create({
      metadata: {
        purpose: "persistent_demo",
        created: new Date().toISOString()
      }
    });

    console.log(`✅ Assistant created: ${this.assistant.id}`);
    console.log(`✅ Thread created: ${this.thread.id}`);
    console.log('\n💡 Key Features of Assistants API:');
    console.log('  📝 Persistent conversation threads');
    console.log('  🧠 Maintains context across messages');
    console.log('  📁 Built-in file handling capabilities');
    console.log('  🔧 Code interpreter and file search tools');
    console.log('  💾 Conversation history persists across sessions');
    console.log('\n' + '═'.repeat(60));
  }

  async sendMessage(content) {
    try {
      // Add message to the thread
      await openai.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: content
      });

      // Run the assistant
      console.log('\n🔄 Processing with assistant...');
      const run = await openai.beta.threads.runs.createAndPoll(this.thread.id, {
        assistant_id: this.assistant.id
      });

      if (run.status === 'completed') {
        // Get the assistant's response
        const messages = await openai.beta.threads.messages.list(this.thread.id);
        const response = messages.data[0].content[0].text.value;
        
        console.log('\n🤖 Assistant:');
        console.log(response);
        
        return response;
      } else {
        console.log(`❌ Run failed with status: ${run.status}`);
        if (run.last_error) {
          console.log('Error:', run.last_error.message);
        }
        return null;
      }
    } catch (error) {
      console.error('❌ Error sending message:', error.message);
      return null;
    }
  }

  async showConversationHistory() {
    try {
      console.log('\n📜 Conversation History:');
      console.log('─'.repeat(40));
      
      const messages = await openai.beta.threads.messages.list(this.thread.id);
      
      // Show last 10 messages in reverse order (oldest first)
      const recentMessages = messages.data.slice(0, 10).reverse();
      
      recentMessages.forEach((message, index) => {
        const role = message.role === 'user' ? '👤 You' : '🤖 Assistant';
        const content = message.content[0].text.value;
        const truncated = content.length > 100 ? content.substring(0, 100) + '...' : content;
        console.log(`${index + 1}. ${role}: ${truncated}`);
      });
      
      console.log('─'.repeat(40));
    } catch (error) {
      console.error('❌ Error retrieving history:', error.message);
    }
  }

  async demonstrateStatefulFeatures() {
    console.log('\n🎯 Demonstrating Assistants API Stateful Features');
    console.log('═'.repeat(60));

    // Demo 1: Context retention
    console.log('\n📝 Demo 1: Context Retention');
    await this.sendMessage("My name is Alice and I'm working on a machine learning project about sentiment analysis.");
    
    await this.sendMessage("What was my name again?");
    
    // Demo 2: Sequential conversation
    console.log('\n📈 Demo 2: Sequential Learning');
    await this.sendMessage("I need to process customer reviews. What approach would you recommend?");
    
    await this.sendMessage("How would I implement the approach you just suggested?");
    
    // Demo 3: Show persistent history
    await this.showConversationHistory();
  }

  async cleanup() {
    try {
      console.log('\n🧹 Cleaning up resources...');
      
      if (this.assistant) {
        await openai.beta.assistants.delete(this.assistant.id);
        console.log('✅ Assistant deleted');
      }
      
      // Note: Threads are automatically cleaned up, but you could delete manually if needed
      console.log('✅ Thread will be cleaned up automatically');
      
    } catch (error) {
      console.error('❌ Error during cleanup:', error.message);
    }
  }

  async interactiveMode() {
    console.log('\n💬 Interactive Mode (type "exit" to quit, "history" to see conversation)');
    console.log('─'.repeat(60));

    const askQuestion = () => {
      rl.question('\n👤 You: ', async (input) => {
        if (input.toLowerCase().trim() === 'exit') {
          console.log('\n👋 Goodbye!');
          rl.close();
          await this.cleanup();
          return;
        }
        
        if (input.toLowerCase().trim() === 'history') {
          await this.showConversationHistory();
          askQuestion();
          return;
        }

        await this.sendMessage(input);
        askQuestion();
      });
    };

    askQuestion();
  }
}

async function runAssistantDemo() {
  const assistant = new PersistentAssistant();
  
  try {
    console.log('🚀 OpenAI Assistants API: Persistent Conversation Demo');
    console.log('═'.repeat(60));
    console.log('\nThis demo showcases the key differences between Assistants and Agents:');
    console.log('🔄 Agents: Workflow orchestration, handoffs, stateless by default');
    console.log('💾 Assistants: Persistent threads, stateful conversations, built-in tools');
    console.log('\n' + '─'.repeat(60));

    await assistant.initialize();
    
    // Run automated demo first
    await assistant.demonstrateStatefulFeatures();
    
    console.log('\n💡 Key Differences Demonstrated:');
    console.log('  ✅ Persistent conversation threads');
    console.log('  ✅ Context retention across messages');
    console.log('  ✅ Built-in conversation history');
    console.log('  ✅ Stateful interactions');
    
    console.log('\n🎮 Now try the interactive mode!');
    await assistant.interactiveMode();
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    
    if (error.message.includes('quota') || error.message.includes('billing')) {
      console.log('\n💡 Note: This demo requires an active OpenAI account with available credits.');
    }
    
    await assistant.cleanup();
    rl.close();
  }
}

runAssistantDemo();
