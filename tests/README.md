# OpenAI Basics Testing Infrastructure

This directory contains comprehensive tests for the OpenAI Basics project foundation examples.

## Test Structure

```
tests/
├── foundations/
│   ├── openai-setup.test.js      # Tests for foundations/openai-setup.js
│   └── token-cost-demo.test.js   # Tests for foundations/token-cost-demo.js
├── chatbot/
│   └── chatbot.test.js           # Tests for chatbot/chatbot.js
├── advanced/
│   └── weather-function.test.js  # Tests for advanced/weather-function.js
├── utils/
│   └── test-helpers.js           # Shared testing utilities
├── index.test.js                 # Tests for main index.js
└── run-tests.js                  # Main test runner
```

## Running Tests

### All Tests
```bash
npm test
```

### With Coverage
```bash
npm run test:coverage
```

### Unit Tests Only (no API calls)
```bash
npm run test:unit
npm run test:coverage:unit
```

### Integration Tests Only (requires API key)
```bash
npm run test:integration
npm run test:coverage:integration
```

### Verbose Output
```bash
npm run test:verbose
```

### Coverage Reports
```bash
npm run coverage:report      # Text summary
npm run coverage:html        # HTML report in coverage/
```

## Test Coverage

The project uses **c8** for code coverage analysis. Coverage reports include:

- **Line coverage**: Percentage of lines executed
- **Function coverage**: Percentage of functions called
- **Branch coverage**: Percentage of branches taken
- **Statement coverage**: Percentage of statements executed

### Coverage Configuration

Coverage is configured in `package.json`:
- **Include**: All source files in foundations/, chatbot/, advanced/, agents/, assistants/, index.js
- **Exclude**: Tests, node_modules, coverage reports
- **Reporters**: Text, LCOV, HTML
- **Output**: `coverage/` directory

### Coverage Thresholds

Currently no minimum thresholds are enforced (`check-coverage: false`), but coverage reports are generated for analysis.

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

## Test Coverage Areas

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

### Chatbot Tests (`chatbot.test.js`)
- Conversation state management
- Message handling and formatting
- OpenAI client integration
- Error handling for API failures
- Conversation persistence

### Weather Function Tests (`weather-function.test.js`)
- Function calling schema validation
- Weather API integration (with mocking)
- OpenAI function calling functionality
- Error handling for API failures
- Mock data fallback behavior

### Index Tests (`index.test.js`)
- Main entry point functionality
- Environment setup validation
- Project structure verification
- Package configuration validation

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
- **Coverage reports**: Generated and uploaded as artifacts

### Coverage Artifacts

GitHub Actions uploads coverage reports as artifacts:
- **Name**: `unit-coverage-reports-node-{version}`
- **Path**: `coverage/`
- **Retention**: 30 days
- **Formats**: LCOV, HTML, text summary

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

## Coverage Analysis

### Viewing Coverage Reports

1. **Run tests with coverage**:
   ```bash
   npm run test:coverage
   ```

2. **View HTML report**:
   ```bash
   open coverage/index.html
   ```

3. **View text summary**:
   ```bash
   npm run coverage:report
   ```

### Coverage Metrics

- **High coverage (>80%)**: Good test coverage
- **Medium coverage (50-80%)**: Adequate coverage, room for improvement
- **Low coverage (<50%)**: Needs more tests

### Improving Coverage

1. **Identify uncovered lines**: Check HTML report for red/yellow lines
2. **Add unit tests**: Focus on business logic and edge cases
3. **Add integration tests**: Test API interactions and error handling
4. **Test error paths**: Ensure error handling code is covered

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

#### "Coverage directory not found"
- Run tests with coverage first: `npm run test:coverage`
- Check that c8 is installed: `npm install`

### Debug Mode
```bash
npm run test:verbose
```

### Coverage Debug
```bash
# Check c8 configuration
npx c8 --help

# Run with coverage debug
DEBUG=c8 npm run test:coverage
```

## Performance Guidelines

- **Unit tests**: Should complete in < 100ms each
- **Integration tests**: Should complete in < 5 seconds each
- **Full test suite**: Should complete in < 30 seconds
- **Coverage analysis**: Adds ~10% overhead to test execution

## Test Philosophy

1. **Fast and Reliable**: Unit tests run quickly and consistently
2. **Graceful Degradation**: Integration tests handle errors gracefully
3. **Clear Feedback**: Descriptive test names and error messages
4. **Environment Aware**: Adapt to available credentials and connectivity
5. **Comprehensive Coverage**: Test both happy paths and edge cases
6. **Coverage Driven**: Use coverage metrics to guide test development