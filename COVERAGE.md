# Test Coverage Guide

This project uses [c8](https://github.com/bcoe/c8) for code coverage analysis. c8 is a native V8 coverage tool that provides accurate coverage data for Node.js applications.

## Quick Start

### Running Tests with Coverage

```bash
# Run all tests with coverage
npm run test:coverage

# Run only unit tests with coverage
npm run test:coverage:unit

# Run only integration tests with coverage
npm run test:coverage:integration

# Generate coverage reports
npm run coverage:report

# Check coverage thresholds
npm run coverage:check
```

## Coverage Configuration

Coverage is configured in `.c8rc.json`:

- **Lines**: 75% minimum
- **Functions**: 75% minimum  
- **Branches**: 70% minimum
- **Statements**: 75% minimum

### Included Files
- All `.js` files in the project root and subdirectories
- Excludes: `tests/`, `node_modules/`, `coverage/`, `*.test.js`, `demo-all.js`

### Report Formats
- **Text**: Console output
- **HTML**: Interactive web report in `coverage/` directory
- **JSON Summary**: Machine-readable summary
- **LCOV**: For integration with external tools

## Coverage Reports

After running coverage tests, reports are generated in the `coverage/` directory:

- `coverage/index.html` - Interactive HTML report
- `coverage/lcov.info` - LCOV format for CI/CD integration
- `coverage/coverage-summary.json` - JSON summary

## CI/CD Integration

The GitHub Actions workflow automatically:

1. Runs tests with coverage on all Node.js versions (18.x, 20.x, 22.x)
2. Uploads coverage reports as artifacts
3. Provides coverage data for both unit and integration tests
4. Stores coverage reports for 30 days

### Viewing Coverage in CI

Coverage reports are uploaded as artifacts in GitHub Actions:
- `coverage-unit-{node-version}` - Unit test coverage
- `coverage-integration-{node-version}` - Integration test coverage  
- `coverage-full-{node-version}` - Full test suite coverage

## Understanding Coverage Metrics

### Line Coverage
Percentage of executable lines that were executed during tests.

### Function Coverage  
Percentage of functions that were called during tests.

### Branch Coverage
Percentage of conditional branches (if/else, switch, ternary) that were executed.

### Statement Coverage
Percentage of statements that were executed during tests.

## Improving Coverage

### Identifying Uncovered Code
1. Run `npm run test:coverage`
2. Open `coverage/index.html` in your browser
3. Click on files to see line-by-line coverage
4. Red lines indicate uncovered code

### Writing Tests for Uncovered Code
1. Focus on uncovered functions and branches
2. Add test cases for error conditions
3. Test edge cases and boundary conditions
4. Ensure all code paths are exercised

### Coverage Best Practices
- Aim for high coverage but prioritize meaningful tests
- Don't write tests just to increase coverage numbers
- Focus on testing critical business logic
- Use coverage to identify missing test scenarios

## Troubleshooting

### Common Issues

**Coverage reports not generated:**
- Ensure c8 is installed: `npm install`
- Check that tests are running successfully first
- Verify `.c8rc.json` configuration

**Low coverage numbers:**
- Check if files are being excluded unintentionally
- Ensure tests are actually calling the code under test
- Review the HTML report to identify specific uncovered areas

**CI coverage failures:**
- Check if coverage thresholds are too strict
- Verify that all test files are being discovered
- Ensure environment variables are set for integration tests

### Getting Help

- Check the [c8 documentation](https://github.com/bcoe/c8)
- Review existing test files in `tests/` directory
- Look at the test helpers in `tests/utils/test-helpers.js`

## Coverage Targets by Component

| Component | Current Target | Notes |
|-----------|---------------|-------|
| Foundations | 80%+ | Core OpenAI setup and utilities |
| Chatbot | 75%+ | Chat functionality |
| Advanced | 70%+ | Complex features, may have external dependencies |
| Agents | 70%+ | Agent SDK integration |
| Tests/Utils | 90%+ | Test utilities should be well-tested |

## Integration with Development Workflow

### Pre-commit Hooks
Consider adding coverage checks to pre-commit hooks:

```bash
# Add to package.json scripts
"precommit": "npm run test:coverage && npm run coverage:check"
```

### IDE Integration
Many IDEs support coverage visualization:
- VS Code: Coverage Gutters extension
- WebStorm: Built-in coverage support
- Vim/Neovim: Various coverage plugins

### Continuous Monitoring
Coverage trends can be tracked over time:
- Set up coverage badges in README
- Monitor coverage changes in pull requests
- Alert on significant coverage drops