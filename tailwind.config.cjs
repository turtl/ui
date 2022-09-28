const production = process.env.ENV === 'prod';
const defaultTheme = require('tailwindcss/defaultTheme');

const config = {
    content: {
        files: [
            './index.html',
            './src/**/*.{html,js,svelte}',
        ],
    },
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Noto Sans', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: "#8fc46a",
                    '50': '#f2f8ee',
                    '100': '#e7f2df',
                    '200': '#d1e7c2',
                    '300': '#bbdba4',
                    '400': '#a5d087',
                    '500': '#8fc46a',
                    '600': '#71b046',
                    '700': '#588836',
                    '800': '#3e6026',
                    '900': '#243816'
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};

module.exports = config;

