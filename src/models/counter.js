import { get, writable } from 'svelte/store';

export const counter = writable(0);

export function inc(n) {
    if(!n) n = 1;
    counter.update((v) => v + n);
    return get(counter);
}

