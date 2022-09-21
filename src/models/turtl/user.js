import { get, writable } from 'svelte/store';

const user = writable({});

user.loggedin = () => get(user).loggedin;
user.data = () => get(user);

export default user;

