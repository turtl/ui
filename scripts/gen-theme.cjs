"use strict";

const fs = require('fs');
const tw_colors = require('tailwindcss/colors');
const theme = require('../src/theme.cjs');

const theme_colors = theme.colors;
['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'].forEach((color) => delete tw_colors[color]);
const COLORS = { ...tw_colors, ...theme_colors };

// edit this to override and automated dark colors.
const OVERRIDE = {
    'white': COLORS.black,
    'black': COLORS.white,
    'inherit': false,
    'current': false,
    'transparent': false,
};

// -----------------------------------------------------------------------------

const COLOR_MAP = {
    ...theme_colors,
};

function find_nearest(val, search) {
    let found = search[0];
    for(let i = 0; i < search.length; i++) {
        if(Math.abs(val - search[i]) < Math.abs(val - found)) {
            found = search[i];
        }
    }
    return found;
}

function dark(color, val, othervals) {
    // if all we have is a color name and no vals, then this is something with a
    // singular value like `black` or `transparent` so we rely on overrides to
    // process it.
    if(!val) {
        const override = OVERRIDE[color];
        if(typeof(override) === 'undefined') {
            console.warn(`theme::dark() -- missing override for single value '${color}'`);
            return color;
        }
        if(!override) return;
        return override;
    }

    // if we have an explicit override, use it.
    const override = OVERRIDE[`${color}-${val}`];
    if(override) return override;

    // ok now to the important stuff. based on the number value we get, we can
    // generate its light/dark negative using the other values from the color.
    const min_val = othervals.reduce((acc, x) => Math.min(acc, x), 9999999); 
    const normalized = othervals.map((x) => x - min_val);
    const max_val = normalized.reduce((acc, x) => Math.max(acc, x), -1); 
    const negated = max_val - (val - min_val);
    const nearest = find_nearest(negated, normalized);
    return COLORS[color][`${nearest + min_val}`];
}

exports.gen = function() {
    Object.keys(COLORS).forEach((color) => {
        if(!COLOR_MAP[`${color}-dark`]) COLOR_MAP[`${color}-dark`] = {};
        if(typeof(COLORS[color]) === 'string') {
            COLOR_MAP[`${color}-dark`] = dark(color);
        } else {
            const vals = Object.keys(COLORS[color])
                .map((x) => parseInt(x))
                .filter((x) => !!x);
            if(COLORS[color]['DEFAULT']) {
                COLOR_MAP[`${color}-dark`]['DEFAULT'] = COLORS[color]['DEFAULT'];
            }
            vals.forEach((num) => {
                const darkval = dark(color, num, vals);
                if(!darkval) return;
                COLOR_MAP[`${color}-dark`][`${num}`] = darkval;
            });
        }
    });
    return {colors: COLOR_MAP};
};

