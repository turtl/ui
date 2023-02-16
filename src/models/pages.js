import { writable } from 'svelte/store';
import * as shortcuts from '@/util/shortcuts';

export const pages = writable([]);

let page_id_counter = 1;

export function shortcut_context(page_id) {
    return `page-${page_id}`;
}

export function set_page(component, options) {
    if(!options) options = {};
    pages.update((vals) => {
        vals.forEach(({id}) => shortcuts.remove_context(`page-${id}`));
        const page_id = page_id_counter++;
        shortcuts.push_context(shortcut_context(page_id));
        return [{id: page_id, component, animate: false, ...options}];
    });
}

export function push_page(component, options) {
    if(!options) options = {};
    const page_id = page_id_counter++;
    shortcuts.push_context(shortcut_context(page_id));
    pages.update((val) => [...val, {id: page_id, component, animate: true, ...options}]);
}

export function set_meta(id, title, options) {
    if(!options) options = {};
    pages.update((val) => val.map((page) => {
        if(id === page.id) {
            return {
                ...page,
                title,
                ...options,
            };
        } else {
            return page;
        }
    }));
}

export function pop_page() {
    pages.update((val) => {
        if(val.length > 1) {
            const page_id = val[val.length - 1].id;
            shortcuts.remove_context(shortcut_context(page_id));
            return [...val.slice(0, -1)];
        } else {
            return val;
        }
    });
}

