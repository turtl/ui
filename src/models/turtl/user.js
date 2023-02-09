import { invoke } from './core';
import { get, writable } from 'svelte/store';
import * as remember_me from '../remember-me';

const user = writable({});

user.loggedin = () => get(user).loggedin;

user.data = () => get(user);

user.login = async (username, passphrase, options) => {
    if(!options) options = {};
    const userdata = await invoke('user:login', username, passphrase);
    user.set({
        ...userdata,
        loggedin: true,
    });
    if(options.remember_me) {
        await remember_me.save();
    }
};

user.save_login = async () => {
    return invoke('user:save-login');
};

user.login_from_saved = async (user_id, key) => {
    const userdata = await invoke('user:login-from-saved', user_id, key);
    user.set({
        ...userdata,
        loggedin: true,
    });
};

export default user;

