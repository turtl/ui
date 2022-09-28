import { invoke } from './core';
import { config } from './config';
import user from './user';
import spaces from './spaces';
import pages from './pages';
import invites from './invites';

export async function load_profile() {
    await invoke('sync:start');
    const profile = await invoke('profile:load');
    spaces.set(profile.spaces);
    pages.set(profile.pages);
    invites.set(profile.invites);
}

