import { invoke } from './invoke';
import { writable } from 'svelte/store';

export const config = writable({});

export async function load_config() {
    const conf = await invoke('get_config');
    config.set(conf || {});
}

