import { invoke } from './core';
import { config } from './config';
import user from './user';
import spaces from './spaces';
import boards from './boards';
import invites from './invites';

export async function load_profile() {
    await invoke('sync:start');
    const profile = await invoke('profile:load');
    spaces.set(profile.spaces);
    boards.set(profile.boards);
    invites.set(profile.invites);
}

