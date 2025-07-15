// Foundations & Core Implementation
// This script demonstrates OpenAI API setup and a basic API call.
import { OpenAI } from 'openai';
import 'dotenv/config';

// add organization ID if available
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID // Optional: Set organization header
});
console.log(process.env.OPENAI_API_KEY);
console.log(process.env.OPENAI_ORG_ID);

async function testOpenAICall() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello world!' }
      ]
    });
    console.log('OpenAI API response:', completion.choices[0].message.content);
  } catch (err) {
    console.error('Error calling OpenAI API:', err.message);
  }
}

testOpenAICall();
