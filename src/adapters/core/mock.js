import * as core from '@/models/turtl/core';
import delay from '@/util/delay';
import Emitter from '@/util/event';
import { core as log } from '@/util/log';

const CoreAdapter = ((events) => {
    const state = {
        user: {
            id: '01626b759c146c6f6b696da1b7e38fd92ff72c531689872a9da4e1b4cb7697b0636b15616a0f0017',
            username: 'user@turtl.app',
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
                username: 'login@turtl.app',
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
                username: 'login@turtl.app',
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
        notes: [{
            id: '01665e7122136f3cb9f271cb9a3596ab75f9ca3d3d90fd7188222222222222225d4efada9ac8f529',
            space_id: '01665e7122136f3cb9f271cb9a3596ab75f9ca3d3d90fd71882c89a06a244ec25d4efada9ac8f529',
            user_id: '01626b759c146c6f6b696da1b7e38fd92ff72c531689872a9da4e1b4cb7697b0636b15616a0f0017',
            has_file: false,
            mod: new Date('2014-08-13T00:45:12.000Z').getTime(),
            type: 'text',
            title: 'Business things',
            tags: ['business', 'company'],
            text: `# Meeting notes\n\n- Talked to Drew about getting 50% of the company. Sounds good.\n- Wrote a 50 page document nobody read.\n- Saw a mourning dove out the office window. It laid egg on the windowsill, but a jay at them. The dove blamed me.\n`,
        }],
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
            case 'app:get_config': {
                response = {};
                break;
            }
            case 'profile:find-notes': {
                const search = args[0];
                const text = search.text;
                const note_ids = search.notes;
                const space_id = search.space_id;
                const board_ids = search.boards;
                const tags = search.tags;
                const exclude_tags = search.exclude_tags;
                const type = search.type;
                const url = search.url;
                const has_file = search.has_file;
                const sort = search.sort;
                const sort_direction = search.sort_direction;
                const page = search.page || 1;
                const per_page = search.per_page || 50;
                let notes = state.notes;
                if(text) {
                    notes = notes.filter((note) => {
                        note.title.substr(text) >= 0 ||
                            note.text.substr(text) >= 0 ||
                            note.tags.reduce((acc, t) => acc || t.substr(text) >= 0, false);
                    });
                }
                if(note_ids) {
                    notes = notes.filter((note) => note_ids.indexOf(note.id) >= 0);
                }
                if(space_id) {
                    notes = notes.filter((note) => note.space_id === space_id);
                }
                if(board_ids) {
                    notes = notes.filter((note) => board_ids.indexOf(note.board_id) >= 0);
                }
                if(tags) {
                    notes = notes.filter((note) => {
                        return tags.reduce((acc, t) => {
                            return acc && note.tags.indexOf(t) >= 0;
                        }, true);
                    });
                }
                if(exclude_tags) {
                    notes = notes.filter((note) => {
                        return !exclude_tags.reduce((acc, x) => {
                            return acc || note.tags.indexOf(x) >= 0;
                        }, false);
                    });
                }
                if(type) {
                    notes = notes.filter((note) => note.type === type);
                }
                if(url) {
                    notes = notes.filter((note) => note.url === url);
                }
                if(has_file) {
                    notes = notes.filter((note) => note.has_file);
                }
                notes = notes.sort((a, b) => {
                    const [x, y] = sort_direction.toLowerCase().trim() === 'desc' ?
                        [b, a] :
                        [a, b];
                    if(typeof(a[sort]) === 'string') {
                        return x[sort].localeCompare(y[sort]);
                    } else {
                        return x[sort] < y[sort];
                    }
                });
                const offset = (Math.max(page, 0) - 1) * Math.max(per_page, 1);
                const total = notes.length;
                const tags_idx = notes.reduce((acc, x) => {
                    x.tags.forEach((t) => {
                        if(!acc[t]) acc[t] = 0;
                        acc[t]++;
                    });
                    return acc;
                }, {});
                const note_tags = Object.keys(tags_idx).map((k) => [k, tags_idx[k]]);
                notes = notes.slice(offset, offset + per_page);
                response = {
                    notes,
                    tags: note_tags,
                    total,
                };
                break;
            }
            case 'profile:load': {
                await delay(500);
                event('profile:loaded');
                await delay(500);
                event('profile:indexed');
                response = state;
                break;
            }
            case 'sync:start': {
                break;
            }
            case 'user:login': {
                const [username, password] = args;
                if(username === state.user.username && password === state.user.password) {
                    state.user.loggedin = true;
                    response = state.user;
                } else {
                    error = {type: 'login_failed', message: `Login failed`};
                }
                break;
            }
            case 'user:login-from-saved': {
                const [_user_id, key] = args;
                const decoded = JSON.parse(key);
                if(decoded.u === state.user.username && decoded.p === state.user.password) {
                    state.user.loggedin = true;
                    response = state.user;
                } else {
                    error = {type: 'login_failed', message: `Login failed`};
                }
                break;
            }
            case 'user:logout': {
                state.user.loggedin = false;
                response = {};
                break;
            }
            case 'user:save-login': {
                if(state.user.loggedin) {
                    response = {
                        user_id: state.user.id,
                        // TODO: ROT13 this and possibly base64
                        key: JSON.stringify({u: state.user.username, p: state.user.password}),
                    };
                } else {
                    error = {type: 'missing_field', message: 'Turtl.user_id'};
                }
                break;
            }
            default: {
                error = {type: 'missing_command', message: `Missing command ${cmd}`};
                break;
            }
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

