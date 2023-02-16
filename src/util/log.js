/**
 * Sick of all the broken logging libs, so i wrote my own. Sorry.
 */

import config from '../config';

function logger(name, level) {
    if(!level) level = 'info';
    const levels = {
        trace: [7, console.trace], // eslint-disable-line
        debug: [6, console.debug], // eslint-disable-line
        info: [5, console.info], // eslint-disable-line
        notice: [4, console.info], // eslint-disable-line
        warn: [3, console.warn], // eslint-disable-line
        error: [2, console.error], // eslint-disable-line
        emerg: [1, console.error], // eslint-disable-line
    };
    let levelnum = levels[level][0];
    const log = {
        ...Object.keys(levels).reduce((acc, x) => {
            const [thislevel, consolefn] = levels[x];
            acc[x] = (msg, ...args) => {
                if(thislevel <= levelnum) {
                    consolefn.call(console, `[${name}] ${msg}`, ...args);
                }
            };
            return acc;
        }, {}),
        set_level: (levelname) => {
            const levelspec = levels[levelname];
            if(!levelspec) throw new Error(`log::set_level() -- Unknown level ${levelname}`);
            level = levelname;
            levelnum = levelspec[0];
        },
    };
    return log;
}

export const core = logger('core', config.log.core.level);
export const ui = logger('ui', config.log.ui.level);

if(window && !window.log) {
    window.log = {
        core,
        ui,
    };
}

