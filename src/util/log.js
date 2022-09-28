import config from '../config';
import ulog from 'ulog';
// set this manually because of weird lazy loading or something
ulog.set('level', window.localStorage['log'] || (config.log || {}).default_level || 'warn');
import anylogger from 'anylogger';
const log = anylogger('turtl-ui');
export default log;

if(!window.log) {
    log.save_conf = (conf) => { window.localStorage.setItem('log', conf); };
    log.clear_conf = () => { window.localStorage.removeItem('log'); };
    log._ulog = ulog;
    window.log = log;
}

