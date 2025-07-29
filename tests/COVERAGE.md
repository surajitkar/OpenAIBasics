# Test Coverage Guide

This document explains how to use the test coverage features in the OpenAI Hackathon Starter project.

## Overview

The project uses [c8](https://github.com/bcoe/c8) for test coverage reporting. c8 is the official Node.js coverage tool that works seamlessly with ES modules.

## Coverage Commands

### Basic Coverage Commands

```bash
# Run all tests with coverage
npm run test:coverage

# Run only unit tests with coverage (no API calls)
npm run test:coverage-unit

# Run only integration tests with coverage (requires API key)
npm run test:coverage-integration

# Generate coverage report from existing data
npm run coverage:report

# Check if coverage meets thresholds
npm run coverage:check
```

### Coverage Thresholds

The project is configured with the following coverage thresholds:
- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 60%
- **Statements**: 70%

These thresholds are defined in `.c8rc.json` and can be adjusted as needed.

## Coverage Reports

### HTML Report
The most detailed coverage report is generated as HTML:
- **Location**: `coverage/index.html`
- **Features**: Line-by-line coverage, branch coverage, function coverage
- **Usage**: Open in a web browser for interactive exploration

### Text Report
A summary report is displayed in the terminal:
- **Features**: Overall percentages, file-by-file breakdown
- **Usage**: Quick overview during development

### JSON Summary
Machine-readable coverage data:
- **Location**: `coverage/coverage-summary.json`
- **Usage**: CI/CD integration, automated reporting

## Covered Files

The coverage analysis includes:
- `foundations/**/*.js` - Core OpenAI setup and cost analysis
- `advanced/**/*.js` - Advanced features like function calling
- `agents/**/*.js` - Agent SDK demonstrations
- `assistants/**/*.js` - Assistant API examples
- `chatbot/**/*.js` - Interactive chatbot implementation
- `index.js` - Main entry point
- `demo-all.js` - Comprehensive demo runner

## Excluded Files

The following are excluded from coverage:
- `tests/**` - Test files themselves
- `node_modules/**` - Dependencies
- `coverage/**` - Coverage reports
- `*.config.js` - Configuration files

## Test Structure

### Current Test Coverage

#### ✅ Fully Tested Modules
- **foundations/openai-setup.js** - Environment validation, client setup, API calls
- **foundations/token-cost-demo.js** - Cost tracking, usage analysis, CSV export

#### ✅ Newly Added Tests
- **chatbot/chatbot.js** - Conversation management, message handling
- **advanced/weather-function.js** - Function calling, weather API integration

#### 🔄 Modules Needing Tests
- **agents/agent-demo.js** - Agent SDK basic usage
- **agents/multi-agent-demo.js** - Multi-agent coordination
- **assistants/file-analysis-demo.js** - File analysis capabilities
- **assistants/persistent-assistant-demo.js** - Assistant persistence
- **index.js** - Main application entry point
- **demo-all.js** - Demo orchestration

### Test Categories

#### Unit Tests
- **Purpose**: Test individual functions and classes without external dependencies
- **Requirements**: No API keys needed
- **Speed**: Fast execution
- **Command**: `npm run test:coverage-unit`

#### Integration Tests
- **Purpose**: Test actual API interactions and end-to-end functionality
- **Requirements**: Valid OpenAI API key in environment
- **Speed**: Slower due to network calls
- **Command**: `npm run test:coverage-integration`

## Configuration

### c8 Configuration (`.c8rc.json`)

```json
{
  "include": ["foundations/**/*.js", "advanced/**/*.js", ...],
  "exclude": ["tests/**", "node_modules/**", ...],
  "reporter": ["text", "html", "json-summary"],
  "reports-dir": "coverage",
  "check-coverage": true,
  "lines": 70,
  "functions": 70,
  "branches": 60,
  "statements": 70
}
```

### Key Settings
- **include**: Source files to analyze
- **exclude**: Files to ignore
- **reporter**: Output formats
- **check-coverage**: Enforce thresholds
- **per-file**: Show per-file coverage

## Best Practices

### Writing Testable Code
1. **Separate concerns**: Keep API calls separate from business logic
2. **Use dependency injection**: Make external dependencies mockable
3. **Handle errors gracefully**: Provide fallbacks for API failures
4. **Export testable functions**: Make internal functions available for testing

### Writing Good Tests
1. **Test both success and failure cases**
2. **Use descriptive test names**
3. **Mock external dependencies appropriately**
4. **Test edge cases and boundary conditions**
5. **Keep tests independent and isolated**

### Coverage Goals
- **Aim for high line coverage** (80%+) on core business logic
- **Focus on branch coverage** for conditional logic
- **Don't obsess over 100% coverage** - focus on critical paths
- **Test error handling paths** - they're often missed

## Troubleshooting

### Common Issues

#### "No coverage data found"
- **Cause**: Tests didn't run or c8 wasn't properly configured
- **Solution**: Ensure tests are passing and c8 is installed

#### "API key required" errors in coverage
- **Cause**: Integration tests running without API key
- **Solution**: Use `npm run test:coverage-unit` or set `OPENAI_API_KEY`

#### Low coverage percentages
- **Cause**: Missing tests for source files
- **Solution**: Add test files following the existing patterns

#### Coverage reports not generated
- **Cause**: c8 configuration issues or permission problems
- **Solution**: Check `.c8rc.json` and ensure write permissions to `coverage/`

### Getting Help

1. **Check test output**: Look for specific error messages
2. **Verify configuration**: Ensure `.c8rc.json` is valid
3. **Run tests individually**: Isolate problematic test files
4. **Check file paths**: Ensure include/exclude patterns are correct

## Contributing

When adding new source files:
1. **Create corresponding test files** in the `tests/` directory
2. **Follow the existing test patterns** using TestRunner and helpers
3. **Include both unit and integration tests** where appropriate
4. **Update coverage thresholds** if needed
5. **Document any special testing requirements**

## Examples

### Running Coverage Analysis

```bash
# Quick unit test coverage check
npm run test:coverage-unit

# Full coverage with integration tests (requires API key)
OPENAI_API_KEY=your_key npm run test:coverage

# Check if coverage meets requirements
npm run coverage:check
```

### Viewing Results

```bash
# Open HTML report in browser
open coverage/index.html

# View JSON summary
cat coverage/coverage-summary.json | jq
```

This coverage system provides comprehensive visibility into code testing completeness and helps ensure the reliability of the OpenAI integration examples.