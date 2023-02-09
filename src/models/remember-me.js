import app_config from '@/config';
import log from '@/util/log';
import Emitter from '@/util/event';
import user from './turtl/user';

let adapter = null;

function enabled() {
    return adapter && app_config.user.enable_remember_me;
}

export async function init(remember_adapter, options) {
    adapter = remember_adapter;
}

export async function save() {
    if(!enabled()) return;
    const {user_id, key} = await user.save_login();
    await adapter.save(user_id, key);
}

export async function login() {
    if(!enabled()) return;
    const saved = await adapter.get();
    if(!saved) return;
    try {
        return user.login_from_saved(saved.user_id, saved.key);
    } catch(err) {
        log.notice('remember-me::login() -- Problem logging in from saved', err);
    }
}

export async function clear() {
    if(!enabled()) return;
    await adapter.clear();
}

