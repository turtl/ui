"use strict";

const tw_colors = require('tailwindcss/colors');
const theme = require('../theme.cjs');

['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray']
    .forEach((color) => delete tw_colors[color]);

const COLORS = {
    ...tw_colors,
    ...theme.colors,
};
const PROPERTY_VALUES = [
    'decoration',
    'text',
    'ring',
    'outline',
    'divide',
    'border',
    'border-x',
    'border-y',
    'border-t',
    'border-b',
    'border-l',
    'border-r',
    'from',
    'via',
    'to',
    'bg',
    'caret',
    'accent',
    'shadow',
];

const DARK_MAP = {};
PROPERTY_VALUES.forEach((prop) => {
    Object.keys(COLORS).forEach((color) => {
        if(typeof(COLORS[color]) === 'string') {
            DARK_MAP[`${prop}-${color}`] = `${prop}-${color}-dark`;
        } else {
            Object.keys(COLORS[color]).forEach((num) => {
                if(num === 'DEFAULT') {
                    DARK_MAP[`${prop}-${color}`] = `${prop}-${color}-dark`;
                } else {
                    DARK_MAP[`${prop}-${color}-${num}`] = `${prop}-${color}-dark-${num}`;
                }
            });
        }
    });
});

exports.color = function(property, log) {
    const mods = property.split(':');
    const unmod = mods[mods.length - 1];
    const opacity = unmod.split('/');
    const raw = opacity[0];
    const dark_val = DARK_MAP[raw];
    if(!dark_val) {
        if(!log) log = require('./log').warn;
        log(`theme::color() -- missing dark value for property '${property}'`);
        return property;
    }
    const mods_txt = mods.slice(0, -1).join(':');
    const opacity_txt = opacity.slice(1).join('/');
    return `${property} dark:${mods_txt === '' ? '' : mods_txt+':'}${dark_val}${opacity_txt === '' ? '' : '/'+opacity_txt}`;
}

