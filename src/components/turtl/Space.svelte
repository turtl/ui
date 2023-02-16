<script>
    import { onDestroy, getContext } from 'svelte';
    import { get } from 'svelte/store';
    import Settings from '../pages/Settings.svelte';
    import Action from '../util/Action.svelte';
    import NoteList from './notes/List.svelte';
    import NoteEdit from './notes/Edit.svelte';
    import { push_page, set_meta } from '@/models/pages';
    import spaces from '@/models/turtl/spaces';
    import { loc } from '@/util/i18n';
    import * as shortcuts from '@/util/shortcuts';

    const page_id = getContext('page_id');
    const actions = [
        {id: 'text', title: loc('Text note'), icon: 'page', shortcut: 't'},
        {id: 'link', title: loc('Bookmark'), icon: 'bookmark', shortcut: 'b'},
        {id: 'image', title: loc('Image'), icon: 'photo', shortcut: 'i'},
        {id: 'file', title: loc('File'), icon: 'paperclip', shortcut: 'f'},
        {id: 'password', title: loc('Password'), icon: 'tripledot', shortcut: 'p'}
    ];

    let space = null;
    let board_id = null;
    const update_active = (_) => {
        const new_space = spaces.get_active();
        let board_title = null;
        if(board_id) {
            // TODO: get baord title
        } else {
            board_title = loc('all_notes');
        }
        set_meta(page_id, board_title, {
            header: {
                space: {title: get(new_space).title, color: new_space.get_color()},
                menu: [
                    {id: 'settings', title: loc('settings'), action: () => push_page(Settings)},
                ],
            },
        });
        space = new_space;
    };
    const space_unsubscribe = spaces.subscribe(update_active);
    update_active();

    function process_action(action) {
        const type = action.detail.action;
        push_page(NoteEdit, {
            partial: true,
            params: {type},
        });
    }

    onDestroy(() => {
        space_unsubscribe();
    });
</script>

<NoteList space_id={$space.id} />

<Action
    actions={actions}
    {page_id}
    bind_shortcut="a"
    on:action={process_action}
    title={loc('add_note')}
    extra_classes="leading-9"
    open_class="rotate-45" />

