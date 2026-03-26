import tsParser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    files: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': 'off',  // ts handles this via tsconfig
      'no-undef': 'off',        // TypeScript handles this
      'no-console': 'off',
    },
  },
]

export default config
