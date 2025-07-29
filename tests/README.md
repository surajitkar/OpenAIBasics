# OpenAI Basics Testing Infrastructure

This directory contains comprehensive tests for the OpenAI Basics project foundation examples.

## Test Structure

```
tests/
├── foundations/
│   ├── openai-setup.test.js      # Tests for foundations/openai-setup.js
│   └── token-cost-demo.test.js   # Tests for foundations/token-cost-demo.js
├── utils/
│   └── test-helpers.js           # Shared testing utilities
└── run-tests.js                  # Main test runner
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only (no API calls)
```bash
npm run test:unit
```

### Integration Tests Only (requires API key)
```bash
npm run test:integration
```

### Verbose Output
```bash
npm run test:verbose
```

### Test Coverage
```bash
# Run all tests with coverage
npm run test:coverage

# Run unit tests with coverage
npm run test:unit:coverage

# Run integration tests with coverage
npm run test:integration:coverage

# Run tests with coverage for CI (JSON/text output only)
npm run test:coverage:ci
```

Coverage reports are generated in the `coverage/` directory:
- `coverage/index.html` - Interactive HTML report
- `coverage/coverage-final.json` - JSON report for CI/tooling
- Console output shows coverage summary

## Test Types

### Unit Tests
- ✅ Always run (no API key required)
- ✅ Fast execution (< 5 seconds)
- ✅ Test core logic, calculations, and configurations
- ✅ Mock data and offline validation

### Integration Tests
- ✅ Require valid OPENAI_API_KEY
- ✅ Make real API calls to validate functionality
- ✅ Graceful error handling for rate limits and network issues
- ✅ Optional (skipped if no API key available)

## Test Coverage

### OpenAI Setup Tests (`openai-setup.test.js`)
- Environment variable validation (API key, organization ID)
- OpenAI client instantiation and configuration
- API key format validation
- Basic API call functionality
- Error handling for missing credentials

### Token Cost Demo Tests (`token-cost-demo.test.js`)
- CostTracker class initialization and methods
- Cost calculation accuracy for different models
- Token usage tracking and session management
- Pricing data validation
- Statistics aggregation
- CSV export functionality
- Edge cases and error handling

## Environment Setup

### Required for Integration Tests
```bash
# Create .env file with:
OPENAI_API_KEY=your_api_key_here
OPENAI_ORG_ID=your_org_id_here  # Optional
```

### API Key Format
- Must start with `sk-`
- Minimum 20 characters
- Valid OpenAI API key format

## CI/CD Integration

Tests run automatically via GitHub Actions on:
- Push to main branch
- Pull requests
- Manual workflow dispatch

### Test Matrix
- **Node.js versions**: 18.x, 20.x, 22.x
- **Unit tests**: Always run
- **Integration tests**: Only run if API key available
- **Quality checks**: Code structure and imports

## Adding New Tests

### 1. Create Test File
```javascript
// tests/foundations/new-feature.test.js
import { TestRunner, TestEnv, TestAssert } from '../utils/test-helpers.js';

export async function runTests(config = {}) {
  const runner = new TestRunner();
  
  runner.test('Test description', () => {
    // Test implementation
  });
  
  return await runner.run();
}
```

### 2. Use Test Helpers
```javascript
// Environment checks
if (TestEnv.skipIfNoApiKey('Test name')) return;

// Assertions
TestAssert.isValidCost(cost);
TestAssert.isValidUsage(usage);
TestAssert.approximately(actual, expected);

// Mock data
const mockUsage = MockData.mockUsage('gpt-4o-mini');
const mockMessages = MockData.mockMessages(2);
```

### 3. Test Patterns

#### Unit Test Pattern
```javascript
runner.test('Unit test description', () => {
  // Setup
  const input = mockData();
  
  // Execute
  const result = functionUnderTest(input);
  
  // Verify
  assert(result.property === expectedValue);
});
```

#### Integration Test Pattern
```javascript
runner.test('Integration test description', async () => {
  // Skip if no API key
  if (TestEnv.skipIfNoApiKey('Test name')) return;
  
  try {
    // Make API call
    const response = await apiCall();
    
    // Verify response
    assert(response.isValid);
  } catch (error) {
    // Handle expected errors gracefully
    if (error.status === 429) {
      console.log('Rate limit hit - expected in CI');
    } else {
      throw error;
    }
  }
}, {
  skipIf: () => config.unitOnly || !TestEnv.hasApiKey()
});
```

## Troubleshooting

### Common Issues

#### "No API key available"
- Set `OPENAI_API_KEY` in `.env` file
- Or run unit tests only: `npm run test:unit`

#### "Connection error"
- Network connectivity issue
- Integration tests will skip gracefully

#### "Rate limit exceeded"
- OpenAI API rate limit hit
- Tests handle this gracefully

### Debug Mode
```bash
npm run test:verbose
```

## Performance Guidelines

- **Unit tests**: Should complete in < 100ms each
- **Integration tests**: Should complete in < 5 seconds each
- **Full test suite**: Should complete in < 30 seconds

## Test Philosophy

1. **Fast and Reliable**: Unit tests run quickly and consistently
2. **Graceful Degradation**: Integration tests handle errors gracefully
3. **Clear Feedback**: Descriptive test names and error messages
4. **Environment Aware**: Adapt to available credentials and connectivity
5. **Comprehensive Coverage**: Test both happy paths and edge cases