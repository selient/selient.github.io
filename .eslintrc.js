module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2020: true,
  },
  extends: ['airbnb', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: ['prettier', 'react'],
  rules: {
    'prettier/prettier': ['warn'],
    // ref: https://archive.eslint.org/docs/rules/max-len
    'max-len': [
      'off',
      {
        code: 100,
        ignoreComments: true,
        ignoreUrls: true,
      },
    ],
    'no-console': 'off',
    'no-param-reassign': 'warn',
    'function-paren-newline': 'off',

    'import/export': 'off',
    'import/no-unresolved': 'off',

    'react/prop-types': 'off',
    'react/no-adjacent-inline-elements': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-filename-extension': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/function-component-definition': 'off',
    'react/no-unstable-nested-components': 'warn',
    'react/no-unknown-property': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-props-no-spreading': 'off',
  },
  overrides: [
    {
      files: ['cypress/**/*.spec.js', 'cypress/**/*.js'],
      rules: {
        'no-undef': 'off',
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
