import i18next from 'i18next';
import { translation as en_US } from '../locales/en_us';

function get_lang() {
    return navigator.languages;
}

export function init() {
    i18next.init({
        lng: get_lang(),
        resources: {
            'en-US': { translation: en_US },
        },
    });
}

export function loc(key, options) {
    return i18next.t(key, options);
}

