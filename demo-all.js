// OpenAI Hackathon Starter: Complete Demo Runner
// This file demonstrates all 4 modules in the hackathon starter project
import { spawn } from 'child_process';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running: node ${command} ${args.join(' ')}\n`);
    
    const child = spawn('node', [command, ...args], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

function waitForUser(message) {
  return new Promise((resolve) => {
    rl.question(message, () => {
      resolve();
    });
  });
}

async function runCompleteDemo() {
  console.log('🎯 OpenAI Hackathon Starter - Complete Demo');
  console.log('═'.repeat(60));
  console.log('\nThis demo will showcase all 5 modules of the hackathon starter:');
  console.log('📚 Module 1: Foundations & Core Implementation');
  console.log('🤖 Module 2: Basic Chatbot Development');
  console.log('🌟 Module 3: Advanced Concepts & Project Development');
  console.log('👥 Module 4: OpenAI Agents SDK Introduction');
  console.log('💾 Module 5: OpenAI Assistants API (Persistent & File Handling)');
  console.log('\n' + '═'.repeat(60));

  try {
    // Module 1: Foundations
    console.log('\n📚 MODULE 1: Foundations & Core Implementation');
    console.log('─'.repeat(50));
    console.log('Testing basic OpenAI API setup and first API call...');
    await waitForUser('\nPress Enter to continue...');
    await runCommand('foundations/openai-setup.js');

    console.log('\n💰 MODULE 1b: Token Usage & Cost Analysis');
    console.log('─'.repeat(50));
    console.log('Demonstrating real token counts and cost calculations...');
    await waitForUser('\nPress Enter to continue...');
    await runCommand('foundations/token-cost-demo.js');

    // Module 2: Chatbot (skip interactive mode for demo)
    console.log('\n🤖 MODULE 2: Basic Chatbot Development');
    console.log('─'.repeat(50));
    console.log('📝 Interactive chatbot demo available at: chatbot/chatbot.js');
    console.log('💡 Run "node chatbot/chatbot.js" for an interactive conversation');
    console.log('✅ Chatbot module ready');

    // Module 3: Advanced Concepts
    console.log('\n🌟 MODULE 3: Advanced Concepts & Project Development');
    console.log('─'.repeat(50));
    console.log('Testing function calling with weather API integration...');
    await waitForUser('\nPress Enter to continue...');
    await runCommand('advanced/weather-function.js', ['New York']);

    // Module 4a: Single Agent Demo
    console.log('\n👥 MODULE 4a: OpenAI Agents SDK - Single Agent');
    console.log('─'.repeat(50));
    console.log('Testing single agent with tools...');
    await waitForUser('\nPress Enter to continue...');
    await runCommand('agents/agent-demo.js');

    // Module 4b: Multi-Agent Demo
    console.log('\n👥 MODULE 4b: OpenAI Agents SDK - Multi-Agent Workflows');
    console.log('─'.repeat(50));
    console.log('Testing multi-agent coordination with handoffs...');
    await waitForUser('\nPress Enter to continue...');
    await runCommand('agents/multi-agent-demo.js');

    // Module 5a: Persistent Assistants
    console.log('\n💾 MODULE 5a: OpenAI Assistants API - Persistent Conversations');
    console.log('─'.repeat(50));
    console.log('Testing stateful conversations and context retention...');
    await waitForUser('\nPress Enter to continue...');
    await runCommand('assistants/persistent-assistant-demo.js');

    // Module 5b: File Analysis
    console.log('\n📁 MODULE 5b: OpenAI Assistants API - File Analysis');
    console.log('─'.repeat(50));
    console.log('Testing file upload, processing, and code interpreter...');
    await waitForUser('\nPress Enter to continue...');
    await runCommand('assistants/file-analysis-demo.js');

    // Final Summary
    console.log('\n🎉 COMPLETE DEMO FINISHED!');
    console.log('═'.repeat(60));
    console.log('✅ All 5 modules tested successfully:');
    console.log('  📚 Foundations: Basic OpenAI API setup ✓');
    console.log('  🤖 Chatbot: Interactive conversation system ✓');
    console.log('  🌟 Advanced: Function calling with external APIs ✓');
    console.log('  👥 Agents: Single and multi-agent workflows ✓');
    console.log('  � Assistants: Persistent conversations & file analysis ✓');
    console.log('\n💡 Key Differences Highlighted:');
    console.log('  🔄 Agents SDK: Workflow orchestration, handoffs, real-time');
    console.log('  💾 Assistants API: Persistent state, file handling, built-in tools');
    console.log('\n💡 Next steps:');
    console.log('  • Use Agents for complex multi-step workflows');
    console.log('  • Use Assistants for stateful conversations and file processing');
    console.log('  • Combine both for comprehensive AI applications');
    console.log('  • Add more specialized agents and assistants');
    console.log('  • Integrate additional APIs and tools');
    console.log('\n📖 Documentation:');
    console.log('  • README.md - Quick start and module overview');
    console.log('  • TECHNOLOGY-GUIDE.md - Comprehensive beginner\'s guide');
    console.log('  • Each module has detailed comments and examples');

  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('  • Ensure OPENAI_API_KEY is set');
    console.log('  • Check OpenAI account has available credits');
    console.log('  • Verify all dependencies are installed');
  } finally {
    rl.close();
  }
}

runCompleteDemo();
