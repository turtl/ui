import * as remember_me from '@/models/remember-me';

const KEY = 'remember_me';

remember_me.init({
    save: async (user_id, key) => {
        const val = {user_id, key};
        localStorage.setItem(KEY, JSON.stringify(val));
    },

    get: async () => {
        const val = localStorage.getItem(KEY);
        if(!val) return null;
        return JSON.parse(val);
    },

    clear: async() => {
        delete localStorage.removeItem(KEY);
    },
});

