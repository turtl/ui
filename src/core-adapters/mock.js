import * as core from '../models/turtl/core';
import delay from '../util/delay';
import Emitter from '../util/event';
import log from '../util/log';

const CoreAdapter = ((events) => {
    const state = {
        user: {
            id: '01626b759c146c6f6b696da1b7e38fd92ff72c531689872a9da4e1b4cb7697b0636b15616a0f0017',
            username: 'login@turtl.app',
            password: 'password',
            confirmed: false,
            name: 'Andrew',
            pubkey: null,
            settings: {},
            privkey: null,
            loggedin: false,
        },
        spaces: [{
            id: '01626b759c146c6f634b027b1b69e1242d40d53e312b3b4ac7710f55be81f289b549446ef6778bee',
            user_id: '01626b759c146c6f6b696da1b7e38fd92ff72c531689872a9da4e1b4cb7697b0636b15616a0f0017',
            title: /* NOTHING */ 'Personnel',
            members: [{
                id: '01626b759c146c6f73a1d9cf35821d7a39e7b2b2bf7521b3acd96d33eed8ab7951ff6d433d9525e8',
                space_id: '01626b759c146c6f634b027b1b69e1242d40d53e312b3b4ac7710f55be81f289b549446ef6778bee',
                user_id: '01626b759c146c6f6b696da1b7e38fd92ff72c531689872a9da4e1b4cb7697b0636b15616a0f0017',
                username: 'andrew@turtlapp.com',
                role: 'owner',
                permissions: ['edit-space','delete-space','set-space-owner','edit-space-member','delete-space-member','add-space-invite','edit-space-invite','delete-space-invite','add-board','edit-board','delete-board','add-note','edit-note','delete-note'],
                updated: '2018-03-28T07:16:40.120Z',
                created: '2018-03-28T07:16:40.120Z',
            }],
            invites: [],
            color: '#b7479b',
            body: 'eyJTRUNSVVJFIEFORCBFQ05SUElURUQiKQ==',
        }, {
            id: '01665e7122136f3cb9f271cb9a3596ab75f9ca3d3d90fd71882c89a06a244ec25d4efada9ac8f529',
            user_id: '01665e7122136f3c14b49f26924cd2b4a3a5d539221b4eaffb5fc6f6906349b4b6f16bc615d2eea0',
            title: 'Lyon Bros',
            members: [{
                id: '01665e7122136f3cb9f271cb9a3596ab75f9ca3d3d90fd71882c89a06a244ec25d4efada9ac8f528',
                space_id: '01665e7122136f3cb9f271cb9a3596ab75f9ca3d3d90fd71882c89a06a244ec25d4efada9ac8f529',
                user_id: '01665e7122136f3c14b49f26924cd2b4a3a5d539221b4eaffb5fc6f6906349b4b6f16bc615d2eea0',
                username: 'jeff@turtlapp.com',
                role: 'owner',
                permissions: ['edit-space','delete-space','set-space-owner','edit-space-member','delete-space-member','add-space-invite','edit-space-invite','delete-space-invite','add-board','edit-board','delete-board','add-note','edit-note','delete-note'],
                updated: '2018-10-10T14:46:07.455Z',
                created: '2018-10-10T14:46:07.455Z',
            }, {
                id: '01665e7122136f3cb9f271cb9a3596ab75f9ca3d3d90fd71882c89a06a244ec25d4efada9ac8f532',
                space_id: '01665e7122136f3cb9f271cb9a3596ab75f9ca3d3d90fd71882c89a06a244ec25d4efada9ac8f529',
                user_id: '01626b759c146c6f6b696da1b7e38fd92ff72c531689872a9da4e1b4cb7697b0636b15616a0f0017',
                username: 'andrew@turtlapp.com',
                role: 'admin',
                permissions: ['edit-space','edit-space-member','delete-space-member','add-space-invite','edit-space-invite','delete-space-invite','add-board','edit-board','delete-board','add-note','edit-note','delete-note'],
                created: '2018-10-10T16:10:02.024Z',
                updated: '2018-10-10T16:10:02.024Z',
            }],
            invites: [],
            color: '#408080',
            body: 'eyJXT1cgTVVIQyBTRUNVRVIiKQ==',
        }],
        boards: [{
            id: '013e4c7a04286c8cf3cf96d4d489d14095b5937cbde319f57adabbc0ab24f3209bb63a3de800a9ce',
            space_id: '01626b759c146c6f634b027b1b69e1242d40d53e312b3b4ac7710f55be81f289b549446ef6778bee',
            user_id: '01626b759c146c6f6b696da1b7e38fd92ff72c531689872a9da4e1b4cb7697b0636b15616a0f0017',
            title: 'Bookmarks',
        }],
        invites: [],
    };

    function event(name, eventdata) {
        const res_msg = {
            e: name,
            d: typeof(eventdata) === 'undefined' ? eventdata : JSON.parse(JSON.stringify(eventdata)),
        };
        log.debug('CoreAdapter::mock::event() -- event: ', res_msg);

        events.emit('message', JSON.stringify(res_msg));
    }

    async function send(msg) {
        const parsed = JSON.parse(msg);
        const [msg_id, cmd, ...args] = parsed;
        if(!cmd) {
            throw new Error(`Missing command in msg ${msg}`);
        }
        let response = null;
        let error = null;
        log.debug('CoreAdapter::mock::send() -- req: ', parsed);
        switch(cmd) {
            case 'app:get_config':
                response = {};
                break;
            case 'user:login':
                const [username, passphrase] = args;
                if(username === 'login@turtl.app' && passphrase === 'password') {
                    response = {
                        id: '01626b759c146c6f6b696da1b7e38fd92ff72c531689872a9da4e1b4cb7697b0636b15616a0f0017',
                        username: 'login@turtl.app',
                        passphrase: 'password',
                        confirmed: false,
                        name: 'Andrew',
                        pubkey: null,
                        settings: {},
                        privkey: null,
                    };
                } else {
                    error = {type: 'login_failed', message: `Login failed`};
                }
                break;
            case 'profile:load':
                await delay(1000);
                event('profile:loaded');
                await delay(2000);
                event('profile:indexed');
                response = state;
                break;
            case 'sync:start':
                break;
            default:
                error = {type: 'missing_command', message: `Missing command ${cmd}`};
                break;
        }
        setTimeout(() => {
            const res_msg = {
                id: msg_id,
                d: JSON.parse(JSON.stringify(error || response)),
                e: !!error,
            };
            log.debug('CoreAdapter::mock::send() -- res: ', res_msg);

            events.emit('message', JSON.stringify(res_msg));
        });
    }

    setTimeout(() => {
        events.emit('connected', true);
    });

    events.send = send;
    return events;
});

core.init(CoreAdapter(Emitter()));

