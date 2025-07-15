// Basic Chatbot Development
// Persistent conversation chatbot using OpenAI API
import { OpenAI } from 'openai';
import readline from 'readline';
import 'dotenv/config';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const conversation = [
  { role: 'system', content: 'You are a helpful assistant.' }
];

async function chat() {
  rl.question('You: ', async (input) => {
    conversation.push({ role: 'user', content: input });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversation
    });
    const reply = completion.choices[0].message.content;
    console.log('Bot:', reply);
    conversation.push({ role: 'assistant', content: reply });
    chat();
  });
}

console.log('Start chatting with the bot (type Ctrl+C to exit):');
chat();
