import { writable, get } from 'svelte/store';
import * as localstorage from './localstorage';

const darkmode = writable({});

async function save() {
    await localstorage.set('turtl:darkmode', get(darkmode));
}

async function load() {
    const loaded = await localstorage.get('turtl:darkmode');
    darkmode.set(loaded || {});
}

async function toggle() {
    darkmode.update((obj) => ({...obj, enabled: !obj.enabled}));
    await save();
}

darkmode.load = load;
darkmode.toggle = toggle;
export default darkmode;

