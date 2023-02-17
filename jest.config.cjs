const config = {
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.svelte$': [
            'svelte-jester',
            { preprocess: true },   // runs tailwind
        ],
        // ignore static files
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$': 'jest-transform-stub'
    },
    moduleFileExtensions: ['svelte', 'js'],
    moduleNameMapper: {
        // map @ to src/
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
 };

module.exports = config;
 
