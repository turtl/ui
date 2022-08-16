const production = process.env.ENV === 'prod';
const gen_theme = require('./scripts/gen-theme.cjs');
const default_extractor = require('tailwindcss/lib/lib/defaultExtractor').defaultExtractor;
const color = require('./src/util/theme.cjs').color;

const extractor = default_extractor({
    tailwindConfig: {
        separator: '',
        prefix: '',
    },
});

const theme = gen_theme.gen();
const config = {
    content: {
        files: [
            './index.html',
            './src/**/*.{html,js,svelte}',
        ],
        extract: {
            svelte: (content) => {
                const rules = extractor(content);
                const expanded = [];
                rules.forEach((rule) => {
                    color(rule, () => {}).split(' ').forEach((split) => {
                        expanded.push(split);
                    });
                });
                return expanded;
            },
        },
    },
    darkMode: 'class',
    theme: {
        extend: {
            colors: theme.colors,
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};

module.exports = config;

