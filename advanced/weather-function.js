// Advanced Concepts: Function Calling & Weather API Integration using WeatherAPI.com
import { OpenAI } from 'openai';
import axios from 'axios';
import 'dotenv/config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Example function schema for weather
const functions = [
  {
    name: 'get_weather',
    description: 'Get the current weather for a city',
    parameters: {
      type: 'object',
      properties: {
        city: { type: 'string', description: 'City name' }
      },
      required: ['city']
    }
  }
];

async function getWeather(city) {
  // Using WeatherAPI.com
  const apiKey = process.env.WEATHER_API_KEY;
  
  if (!apiKey) {
    // Return mock data when no API key is provided
    return {
      location: { name: city },
      current: {
        condition: { text: 'partly cloudy' },
        temp_c: 15
      }
    };
  }
  
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
  console.log('WeatherAPI URL:', url);
  const response = await axios.get(url);
  return response.data;
}

async function main() {
  // Get city from command line argument or use default
  const city = process.argv[2] || 'London';
  
  const messages = [
    { role: 'system', content: 'You are a weather assistant.' },
    { role: 'user', content: `What is the weather in ${city}?` }
  ];
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    functions,
    function_call: 'auto'
  });
  const choice = completion.choices[0];
  if (choice.finish_reason === 'function_call' && choice.message.function_call) {
    const args = JSON.parse(choice.message.function_call.arguments);
    const weather = await getWeather(args.city);
    console.log(`Weather in ${weather.location.name}:`, weather.current.condition.text, `${weather.current.temp_c}°C`);
  } else {
    console.log('AI:', choice.message.content);
  }
}

main();
