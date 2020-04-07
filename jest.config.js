module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["test/"],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**'],
  coverageReporters: ['text', 'html', 'lcov'],
  setupFiles: ['jest-date-mock'],
};
