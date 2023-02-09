import { get, writable } from 'svelte/store';
import user from './user';

const spaces = writable([]);

spaces.get_active = () => {
    const got_spaces = get(spaces);
    let space = got_spaces.find((s) => s.active === true);
    if(!space) {
        const default_space = ((user.data() || {}).settings || {}).default_space;
        space = got_spaces.find((s) => s.id === default_space);
    }
    if(!space) {
        space = got_spaces[0];
    }
    return space;
};

export default spaces;

