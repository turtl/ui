import log from '../../util/log';
import Emitter from '../../util/event';

export const events = Emitter();

let adapter = null;
let connected = false;
let message_map = {};
let id = 0;

function next_id() {
    id++;
    return id;
}

export function is_connected() {
    return connected;
}

export async function init(core_adapter, options) {
    if(!options) options = {};
    adapter = core_adapter;
    adapter.on('error', events.emit.bind(events, 'error'));
    adapter.on('connected', (status) => {
        connected = status;
        events.emit('connected', status);
    });
    adapter.on('message', (msg_json) => {
        let msg = null;
        try {
            msg = JSON.parse(msg_json);
        } catch(err) {
            events.emit('error', {core: true, err: 'json_fail', msg: msg_json});
            return;
        }
        if(!msg) {
            events.emit('error', {core: true, err: 'empty_message', msg})
            return;
        }
        const id = msg.id;
        if(id) {
            log.info(`core::recv -- msg ${id}`);
            const handler = message_map[id];
            delete message_map[id];
            if(handler) {
                if(msg.e) {
                    handler.reject(msg.d);
                } else {
                    handler.resolve(msg.d);
                }
            } else {
                events.emit('error', {core: true, err: 'missing_handler', id});
            }
        } else {
            log.info(`core::event`);
            events.emit('event', msg.e, msg.d);
        }
    });
    adapter.on('reset', () => {
        Object.keys(message_map).forEach((id) => {
            const handler = message_map[id];
            if(handler && handler.reject) {
                handler.reject({core: true, err: 'connection_close'});
            }
            delete message_map[id];
        });
    });
}

export async function invoke(call, ...args) {
    if(!connected) {
        throw {core: true, err: 'not_connected'};
    }
    return new Promise((resolve, reject) => {
        const msg_id = next_id();
        if(message_map[id]) {
            reject({core: true, err: 'duplicate_id', id: msg_id});
            return;
        }
        message_map[id] = {resolve, reject};
        log.info(`core::send(${call}) -- msg ${msg_id}`);
        adapter.send(JSON.stringify([id.toString(), call, ...args]));
    });
}

