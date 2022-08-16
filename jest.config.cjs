const config = {
    transform: {
        '^.+\\.js$': 'babel-jest',
        '^.+\\.svelte$': 'svelte-jester',
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
    },
    moduleFileExtensions: ['svelte', 'js'],
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
 };

module.exports = config;
 
