import { get, writable } from 'svelte/store';
import user from './user';

const spaces = writable([]);

spaces.get_active = () => {
    let space = get(spaces).find((s) => s.active === true);
    if(!space) {
        const default_space = ((user.data() || {}).settings || {}).default_space;
        space = get(spaces).find((s) => s.id === default_space);
    }
    return space;
};

export default spaces;

