import i18next from 'i18next';
import { translation as en_US } from '../locales/en_us';

function get_lang() {
    return navigator?.languages;
}

export function init(options) {
    if(!options) options = {};
    i18next.init({
        lng: options.lang || get_lang(),
        resources: {
            'en-US': { translation: en_US },
        },
    });
}

export function t(key, options) {
    return i18next.t(key, options) ?? key;
}

