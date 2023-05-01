module.exports = {
  extends: ['@innei/eslint-config-react-ts'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-restricted-globals': ['error', 'close', 'open', 'name', 'event'],
    'react/self-closing-comp': 'warn',
    'react/jsx-curly-brace-presence': [
      'error',
      { props: 'never', children: 'never' },
    ],
  },
}
