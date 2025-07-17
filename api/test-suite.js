#!/usr/bin/env node

// API Test Suite for OpenAI Hackathon Starter
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const BASE_URL = 'http://localhost:3001';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

class APITester {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.warnings = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const color = type === 'success' ? GREEN : type === 'error' ? RED : type === 'warning' ? YELLOW : RESET;
    console.log(`${color}[${timestamp}] ${message}${RESET}`);
  }

  async test(name, testFn) {
    try {
      await testFn();
      this.log(`✓ ${name}`, 'success');
      this.passed++;
    } catch (error) {
      this.log(`✗ ${name}: ${error.message}`, 'error');
      this.failed++;
    }
  }

  async testEndpoint(method, path, data = null, expectedStatus = 200) {
    const url = `${BASE_URL}${path}`;
    try {
      const response = await axios({
        method,
        url,
        data,
        validateStatus: () => true // Don't throw on non-2xx status codes
      });

      if (response.status !== expectedStatus) {
        throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
      }

      return response.data;
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  async run() {
    this.log('Starting API Test Suite', 'info');
    this.log('================================', 'info');

    // Test 1: Health Check
    await this.test('Health Check', async () => {
      const response = await this.testEndpoint('GET', '/api/health');
      if (!response.status || response.status !== 'healthy') {
        throw new Error('Health check failed');
      }
    });

    // Test 2: Metrics
    await this.test('Metrics Endpoint', async () => {
      const response = await this.testEndpoint('GET', '/api/metrics');
      if (!response.uptime_seconds || !response.total_requests) {
        throw new Error('Metrics missing required fields');
      }
    });

    // Test 3: Root Endpoint
    await this.test('Root Endpoint', async () => {
      const response = await this.testEndpoint('GET', '/');
      if (!response.message || !response.endpoints) {
        throw new Error('Root endpoint missing required fields');
      }
    });

    // Test 4: Weather API
    await this.test('Weather API - Basic', async () => {
      const response = await this.testEndpoint('GET', '/api/weather?city=Tokyo');
      if (!response.location || !response.current) {
        throw new Error('Weather response missing required fields');
      }
    });

    // Test 5: Weather API with Forecast
    await this.test('Weather API - Forecast', async () => {
      const response = await this.testEndpoint('GET', '/api/weather?city=London&forecast=true');
      if (!response.forecast || !Array.isArray(response.forecast)) {
        throw new Error('Weather forecast response missing forecast array');
      }
    });

    // Test 6: Agents List
    await this.test('Agents List', async () => {
      const response = await this.testEndpoint('GET', '/api/agents');
      if (!response.agents || !Array.isArray(response.agents)) {
        throw new Error('Agents response missing agents array');
      }
    });

    // Test 7: Chat API without key (should fail)
    await this.test('Chat API - No Key (Expected Failure)', async () => {
      await this.testEndpoint('POST', '/api/chat', { message: 'Hello' }, 401);
    });

    // Test 8: Weather Agent without key (should fail)
    await this.test('Weather Agent - No Key (Expected Failure)', async () => {
      await this.testEndpoint('POST', '/api/agents/weather', { message: 'Weather in Tokyo' }, 401);
    });

    // Test 9: Math Agent without key (should fail)
    await this.test('Math Agent - No Key (Expected Failure)', async () => {
      await this.testEndpoint('POST', '/api/agents/math', { message: 'What is 2+2?' }, 401);
    });

    // Test 10: Auth Validation
    await this.test('Auth Validation - Invalid Key', async () => {
      const response = await this.testEndpoint('POST', '/api/auth/validate', { api_key: 'invalid-key' }, 401);
      if (response.valid !== false) {
        throw new Error('Auth validation should return false for invalid key');
      }
    });

    // Test 11: File Analysis without key (should fail)
    await this.test('File Analysis - No Key (Expected Failure)', async () => {
      await this.testEndpoint('POST', '/api/assistants/analyze-file', {}, 401);
    });

    // Test 12: Error handling - Bad requests
    await this.test('Error Handling - Missing City', async () => {
      await this.testEndpoint('GET', '/api/weather', null, 400);
    });

    await this.test('Error Handling - Missing Message', async () => {
      await this.testEndpoint('POST', '/api/chat', {}, 400);
    });

    // Test 13: 404 Handler
    await this.test('404 Handler', async () => {
      await this.testEndpoint('GET', '/api/nonexistent', null, 404);
    });

    // Test 14: CORS Headers
    await this.test('CORS Headers', async () => {
      const response = await axios.options(`${BASE_URL}/api/health`);
      const corsHeaders = response.headers['access-control-allow-origin'];
      if (!corsHeaders) {
        throw new Error('CORS headers not present');
      }
    });

    // Summary
    this.log('================================', 'info');
    this.log('Test Results:', 'info');
    this.log(`Passed: ${this.passed}`, 'success');
    this.log(`Failed: ${this.failed}`, 'error');
    this.log(`Warnings: ${this.warnings}`, 'warning');
    this.log(`Total: ${this.passed + this.failed + this.warnings}`, 'info');

    if (this.failed === 0) {
      this.log('🎉 All tests passed!', 'success');
      process.exit(0);
    } else {
      this.log('❌ Some tests failed!', 'error');
      process.exit(1);
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/api/health`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.error(`${RED}Error: API server is not running at ${BASE_URL}${RESET}`);
    console.error(`${YELLOW}Please start the server with: npm run api${RESET}`);
    process.exit(1);
  }

  const tester = new APITester();
  await tester.run();
}

main().catch(console.error);