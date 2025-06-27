import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import boundaries from 'eslint-plugin-boundaries'
import { dirname } from 'path'
import ts from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname })

const boundariesConfig = {
  files: ['**/*.{ts,tsx}'],

  ignores: [
    'eslint.config.mjs',
    '*.config.js',
    '*.config.cjs',
    'next-env.d.ts',
    '.next/**/*',
    'public/**/*',
    '@types/**/*',
    'node_modules/**/*',
    '.git/**/*',
    '.vscode/**/*',
    'tsconfig.json',
    'package.json',
    'pnpm-lock.yaml',
    'README.md',
    'next.config.ts',
    'middleware.ts',
    'i18n/**/*',
  ],

  plugins: { boundaries },

  settings: {
    'boundaries/elements': [
      {
        mode: 'full',
        type: 'shared',
        pattern: [
          'components/**/*',
          'lib/**/*',
          'hooks/**/*',
          'data/**/*',
          'server/**/*',
          'utils/**/*',
          'providers/**/*',
          'types/**/*',
          'schemas/**/*',
        ],
      },
      {
        mode: 'full',
        type: 'feature',
        capture: ['featureName'],
        pattern: ['features/([^/]+)/**/*'],
      },
      {
        mode: 'full',
        type: 'feature',
        capture: ['featureName'],
        pattern: ['app/api/([^/]+)/**/*'],
      },
      {
        mode: 'full',
        type: 'feature',
        capture: ['featureName'],
        pattern: ['app/\\[locale\\]/([^/]+)/**/*'],
      },
      {
        mode: 'full',
        type: 'app',
        pattern: [
          'app/\\[locale\\]/+(layout|page|loading|error|not-found|template|global-error).tsx$',
        ],
      },
      {
        mode: 'full',
        type: 'app',
        pattern: [
          'app/+(layout|page|loading|error|not-found|template|global-error|manifest|sitemap|robots).+(ts|tsx)$',
        ],
      },
      {
        mode: 'full',
        type: 'app',
        capture: ['_', 'fileName'],
        pattern: ['app/**/*'],
      },
      { mode: 'full', type: 'neverImport', pattern: ['tasks/**/*'] },
    ],
  },
  rules: {
    'boundaries/no-unknown': ['error'],
    'boundaries/no-unknown-files': ['error'],
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          { from: ['shared'], allow: ['shared'] },
          {
            from: ['feature'],
            allow: ['shared', ['feature', { featureName: '${from.featureName}' }]],
          },
          { from: ['app', 'neverImport'], allow: ['shared', 'feature'] },
          { from: ['app'], allow: [['app', { fileName: '*.css' }]] },
        ],
      },
    ],
  },
}

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  js.configs.recommended,
  ...ts.configs.recommended,
  boundariesConfig,
  {
    ignores: ['.next/**/*', 'node_modules/**/*', 'public/**/*'],
  },
]

export default eslintConfig
