import { invoke } from './core';
import { get, writable } from 'svelte/store';

const user = writable({});

user.loggedin = () => get(user).loggedin;

user.data = () => get(user);

user.login = async (username, passphrase) => {
    const userdata = await invoke('user:login', username, passphrase);
    user.set({
        ...userdata,
        loggedin: true,
    });
};

export default user;

