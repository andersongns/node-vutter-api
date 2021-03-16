// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  coverageThreshold: {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: -10
  }
}
