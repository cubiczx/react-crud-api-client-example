module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.tsx$': 'ts-jest', // Esto debería incluir archivos .tsx
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'], // Asegúrate de incluir .tsx
  testMatch: ['**/src/**/*.test.(ts|tsx)'], // Incluye archivos de prueba .tsx
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.tsx',
    '!**/node_modules/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  testTimeout: 50000,
};
