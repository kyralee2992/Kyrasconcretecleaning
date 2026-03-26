import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/app/components/ContactForm.tsx',
    'next.config.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 95,
      branches: 95,
      functions: 95,
      statements: 95,
    },
  },
}

export default config
