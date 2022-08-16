import { writable } from 'svelte/store';

export const pages = writable([]);

export function set_page(title, component, options) {
    if(!options) options = {};
    pages.set([{title, component, animate: false, ...options}]);
}

export function push_page(title, component, options) {
    if(!options) options = {};
    pages.update((val) => [...val, {title, component, animate: true, ...options}]);
}

export function pop_page() {
    pages.update((val) => {
        if(val.length > 1) {
            return [...val.slice(0, -1)];
        } else {
            return val;
        }
    });
}

