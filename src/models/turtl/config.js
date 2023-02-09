import { invoke } from './core';
import { writable } from 'svelte/store';

export const config = writable({});

config.load = async function load_config() {
    const conf = await invoke('app:get_config');
    config.set(conf || {});
};

export default config;

