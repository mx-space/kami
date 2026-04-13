const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = [
  ...compat.config({
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['unused-imports', 'react-hooks'],
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:react/recommended',
      'prettier',
    ],
    ignorePatterns: [
      '*.min.*',
      'CHANGELOG.md',
      'dist',
      'LICENSE*',
      'output',
      'coverage',
      'public',
      'temp',
      'packages-lock.json',
      'pnpm-lock.yaml',
      'yarn.lock',
      '__snapshots__',
      '!.github',
      '!.vitepress',
      '!.vscode',
    ],
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: { extensions: ['.js', '.mjs', '.ts', '.d.ts'] },
      },
    },
    rules: {
      'import/named': 'off',
      'import/order': 'off',
      'import/first': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-unresolved': 'off',
      'import/no-absolute-path': 'off',
      'import/no-default-export': 'error',
      'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: true }],
      'prefer-arrow-callback': [
        'error',
        { allowNamedFunctions: false, allowUnboundThis: true },
      ],
      'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'generator-star-spacing': 'off',
      'spaced-comment': [
        'error',
        'always',
        {
          line: { markers: ['/'], exceptions: ['/', '#'] },
          block: { markers: ['!'], exceptions: ['*'], balanced: true },
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'no-empty': 'warn',
      'no-fallthrough': 'error',
      'no-restricted-globals': ['error', 'close', 'open', 'name', 'event'],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      'react/self-closing-comp': 'warn',
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
    },
    overrides: [
      {
        files: [
          '*.config.[tj]s',
          'pages/**/*.[tj]sx',
          'src/pages/**/*.[tj]sx',
          'src/views/**/*.[tj]sx',
          'views/**/*.[tj]sx',
          'src/store/**/*.[tj]s',
          'store/**/*.[tj]s',
        ],
        rules: {
          'import/no-default-export': 'off',
        },
      },
      {
        files: ['*.d.ts'],
        rules: {
          'import/no-duplicates': 'off',
        },
      },
      {
        files: ['*.js'],
        rules: {
          '@typescript-eslint/no-var-requires': 'off',
        },
      },
      {
        files: ['*.test.ts', '*.test.js', '*.spec.ts', '*.spec.js'],
        rules: {
          'no-unused-expressions': 'off',
        },
      },
      {
        files: ['next-env.d.ts'],
        rules: {
          '@typescript-eslint/triple-slash-reference': 'off',
        },
      },
    ],
  }),
]
