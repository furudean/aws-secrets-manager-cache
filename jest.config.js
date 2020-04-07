module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ["test/"],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**'],
  coverageReporters: ['text', 'html'],
  setupFiles: ['jest-date-mock'],
};
