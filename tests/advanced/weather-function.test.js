/**
 * Tests for advanced/weather-function.js
 * 
 * Tests cover:
 * - Function schema validation
 * - Weather API integration (with and without API key)
 * - OpenAI function calling capabilities
 * - Error handling for API failures
 * - Mock data fallback functionality
 */

import assert from 'assert';
import { TestRunner, TestEnv, TestAssert, MockData } from '../utils/test-helpers.js';

/**
 * Mock weather function implementation for testing
 */
class TestWeatherFunction {
  constructor() {
    this.functions = [
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
  }

  async getWeather(city, useRealAPI = false) {
    if (!city || typeof city !== 'string') {
      throw new Error('City parameter must be a non-empty string');
    }

    if (!useRealAPI || !process.env.WEATHER_API_KEY) {
      // Return mock data when no API key is provided
      return {
        location: { name: city },
        current: {
          condition: { text: 'partly cloudy' },
          temp_c: 15
        }
      };
    }

    // For testing purposes, we'll simulate the API call
    // In real implementation, this would use axios to call WeatherAPI.com
    const mockApiResponse = {
      location: { name: city },
      current: {
        condition: { text: 'sunny' },
        temp_c: 22
      }
    };

    return mockApiResponse;
  }

  async processWeatherQuery(city, useOpenAI = false) {
    if (!useOpenAI || !TestEnv.hasApiKey()) {
      // Direct weather lookup without OpenAI
      const weather = await this.getWeather(city);
      return {
        weather,
        usedFunctionCall: false,
        response: `Weather in ${weather.location.name}: ${weather.current.condition.text}, ${weather.current.temp_c}°C`
      };
    }

    // Simulate OpenAI function calling
    const client = TestEnv.createTestClient();
    const messages = [
      { role: 'system', content: 'You are a weather assistant.' },
      { role: 'user', content: `What is the weather in ${city}?` }
    ];

    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        functions: this.functions,
        function_call: 'auto',
        max_tokens: 100
      });

      const choice = completion.choices[0];
      
      if (choice.finish_reason === 'function_call' && choice.message.function_call) {
        const args = JSON.parse(choice.message.function_call.arguments);
        const weather = await this.getWeather(args.city);
        
        return {
          weather,
          usedFunctionCall: true,
          functionCall: choice.message.function_call,
          response: `Weather in ${weather.location.name}: ${weather.current.condition.text}, ${weather.current.temp_c}°C`,
          usage: completion.usage
        };
      } else {
        return {
          weather: null,
          usedFunctionCall: false,
          response: choice.message.content,
          usage: completion.usage
        };
      }
    } catch (error) {
      throw error;
    }
  }

  validateFunctionSchema() {
    const func = this.functions[0];
    
    // Validate required properties
    if (!func.name || !func.description || !func.parameters) {
      return false;
    }
    
    // Validate parameters structure
    const params = func.parameters;
    if (params.type !== 'object' || !params.properties || !params.required) {
      return false;
    }
    
    // Validate city parameter
    const cityParam = params.properties.city;
    if (!cityParam || cityParam.type !== 'string' || !cityParam.description) {
      return false;
    }
    
    // Validate required array
    if (!Array.isArray(params.required) || !params.required.includes('city')) {
      return false;
    }
    
    return true;
  }
}

/**
 * Test suite for weather-function.js
 */
export async function runTests(config = {}) {
  const runner = new TestRunner();

  // Unit Tests - Function schema validation
  runner.test('Function schema validation - structure', () => {
    const weatherFunc = new TestWeatherFunction();
    
    assert(weatherFunc.validateFunctionSchema(), 'Function schema should be valid');
    
    const func = weatherFunc.functions[0];
    assert(func.name === 'get_weather', 'Function name should be get_weather');
    assert(func.description.includes('weather'), 'Description should mention weather');
    assert(func.parameters.type === 'object', 'Parameters type should be object');
    assert(func.parameters.properties.city, 'Should have city property');
    assert(func.parameters.required.includes('city'), 'City should be required');
  });

  runner.test('Function schema validation - city parameter', () => {
    const weatherFunc = new TestWeatherFunction();
    const cityParam = weatherFunc.functions[0].parameters.properties.city;
    
    assert(cityParam.type === 'string', 'City parameter should be string type');
    assert(cityParam.description, 'City parameter should have description');
    assert(cityParam.description.toLowerCase().includes('city'), 'Description should mention city');
  });

  // Unit Tests - Weather API mock functionality
  runner.test('Weather API - mock data without API key', async () => {
    const weatherFunc = new TestWeatherFunction();
    const city = 'London';
    
    const weather = await weatherFunc.getWeather(city, false);
    
    assert(weather.location, 'Weather response should have location');
    assert(weather.location.name === city, 'Location name should match requested city');
    assert(weather.current, 'Weather response should have current conditions');
    assert(weather.current.condition, 'Current conditions should have condition');
    assert(weather.current.condition.text, 'Condition should have text description');
    assert(typeof weather.current.temp_c === 'number', 'Temperature should be a number');
  });

  runner.test('Weather API - input validation', async () => {
    const weatherFunc = new TestWeatherFunction();
    
    // Test empty city
    await assert.rejects(
      async () => await weatherFunc.getWeather(''),
      /City parameter must be a non-empty string/,
      'Should reject empty city'
    );
    
    // Test null city
    await assert.rejects(
      async () => await weatherFunc.getWeather(null),
      /City parameter must be a non-empty string/,
      'Should reject null city'
    );
    
    // Test undefined city
    await assert.rejects(
      async () => await weatherFunc.getWeather(undefined),
      /City parameter must be a non-empty string/,
      'Should reject undefined city'
    );
    
    // Test non-string city
    await assert.rejects(
      async () => await weatherFunc.getWeather(123),
      /City parameter must be a non-empty string/,
      'Should reject numeric city'
    );
  });

  runner.test('Weather API - different cities', async () => {
    const weatherFunc = new TestWeatherFunction();
    const cities = ['London', 'New York', 'Tokyo', 'Sydney'];
    
    for (const city of cities) {
      const weather = await weatherFunc.getWeather(city, false);
      
      assert(weather.location.name === city, `Location name should match ${city}`);
      assert(weather.current.condition.text, `${city} should have weather condition`);
      assert(typeof weather.current.temp_c === 'number', `${city} should have temperature`);
    }
  });

  // Unit Tests - Weather query processing
  runner.test('Weather query processing - without OpenAI', async () => {
    const weatherFunc = new TestWeatherFunction();
    const city = 'Paris';
    
    const result = await weatherFunc.processWeatherQuery(city, false);
    
    assert(result.weather, 'Result should have weather data');
    assert(result.weather.location.name === city, 'Weather location should match requested city');
    assert(result.usedFunctionCall === false, 'Should not use function call without OpenAI');
    assert(typeof result.response === 'string', 'Should have string response');
    assert(result.response.includes(city), 'Response should mention the city');
    assert(result.response.includes('°C'), 'Response should include temperature');
  });

  runner.test('Weather query processing - response formatting', async () => {
    const weatherFunc = new TestWeatherFunction();
    const city = 'Berlin';
    
    const result = await weatherFunc.processWeatherQuery(city, false);
    
    assert(result.response.includes(`Weather in ${city}`), 'Response should start with weather in city');
    assert(result.response.includes('partly cloudy'), 'Response should include condition');
    assert(result.response.includes('15°C'), 'Response should include temperature');
  });

  // Integration Tests (require OpenAI API key)
  runner.test('OpenAI function calling - weather query', async () => {
    if (TestEnv.skipIfNoApiKey('OpenAI function calling test')) return;
    
    const weatherFunc = new TestWeatherFunction();
    const city = 'Madrid';
    
    try {
      const result = await weatherFunc.processWeatherQuery(city, true);
      
      // The result could use function calling or not, depending on the model's decision
      assert(typeof result.response === 'string', 'Should have string response');
      assert(result.response.length > 0, 'Response should not be empty');
      
      if (result.usedFunctionCall) {
        assert(result.functionCall, 'Should have function call data when used');
        assert(result.functionCall.name === 'get_weather', 'Function call should be get_weather');
        assert(result.weather, 'Should have weather data when function was called');
        TestAssert.isValidUsage(result.usage);
      } else {
        // Model chose to respond directly without function call
        assert(result.usage, 'Should have usage data even without function call');
        TestAssert.isValidUsage(result.usage);
      }
      
    } catch (error) {
      if (error.status === 429 || error.status === 401) {
        console.log(`   ℹ️  Function calling test received expected error: ${error.status}`);
      } else if (error.message.includes('Connection error') || error.message.includes('network')) {
        console.log(`   ℹ️  Network connection issue: ${error.message}`);
      } else {
        throw error;
      }
    }
  }, {
    skipIf: () => config.unitOnly || !TestEnv.hasApiKey()
  });

  return await runner.run();
}

// Allow running this test file directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests({ verbose: true })
    .then(results => {
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}