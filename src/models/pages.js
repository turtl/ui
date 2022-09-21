import { writable } from 'svelte/store';

export const pages = writable([]);

export function set_page(component, options) {
    if(!options) options = {};
    pages.set([{component, animate: false, ...options}]);
}

export function push_page(component, options) {
    if(!options) options = {};
    pages.update((val) => [...val, {component, animate: true, ...options}]);
}

export function set_meta(title, options) {
    if(!options) options = {};
    pages.update((val) => [
        ...val.slice(0, val.length - 1),
        {
            ...val[val.length - 1],
            title,
            ...options,
        },
    ]);
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

