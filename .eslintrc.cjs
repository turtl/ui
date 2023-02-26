const unused_vars_config = {
    argsIgnorePattern: '^_[a-z]?',
    varsIgnorePattern: '^_[a-z]?',
};

module.exports = {
    env: {
        //'commonjs': true,
        browser: true,
        es2021: true,
        node: true,
    },
    parserOptions: {
        sourceType: 'module',
    },
    extends: [
        'eslint:recommended',
        'plugin:svelte/recommended',
    ],
    plugins: [
    ],
    // NOTE: please keep these alphabetical!! (ignoring leading special chars)
    rules: {
        'indent': ['error', 4, { SwitchCase: 1, ignoreComments: true }],
        'linebreak-style': ['error', 'unix'],
        'no-console': ['warn'],
        'no-inner-declarations': ['off'],
        'no-unused-vars': ['warn', unused_vars_config],
        'prefer-const': ['off'],
        'quotes': ['off'],
        'semi': ['error', 'always'],
    },
    overrides: [
        {
            files: 'test/**/*.test.js',
            globals: {
                'afterAll': 'readonly',
                'afterEach': 'readonly',
                'beforeAll': 'readonly',
                'beforeEach': 'readonly',
                'describe': 'readonly',
                'expect': 'readonly',
                'it': 'readonly',
            },
        },
    ],
};
