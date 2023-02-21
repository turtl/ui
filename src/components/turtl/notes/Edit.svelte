<script>
    import { getContext, onDestroy } from 'svelte';
    import { get } from 'svelte/store';
    import { pop_page, set_meta, shortcut_context } from '@/models/pages';
    import { Note } from '@/models/turtl/notes';
    import Input from '@/components/form/Input.svelte';
    import * as shortcuts from '@/util/shortcuts';
    import { t } from '@/util/i18n';

    export let type = null;
    export let note = null;

    const page_id = getContext('page_id');

    if(!type) {
        type = get(note).type;
    }
    if(!note) {
        note = Note({type});
    }

    var title_part = '';
    switch(type) {
        case 'text': title_part = t('notes.text_note'); break;
        case 'link': title_part = t('notes.bookmark'); break;
        case 'image': title_part = t('notes.image'); break;
        case 'file': title_part = t('notes.file'); break;
        case 'password': title_part = t('notes.password'); break;
        default: title_part = ''; break;
    }
    // HACK: i18n: probably shouldn't lower case here, oh well. it reduces the
    // number of keys we have to translate.
    const title = t('notes.edit_type', {type: title_part.toLowerCase()});
    set_meta(page_id, title);

    function submit(e) {
        if(e) e.preventDefault();
    }

    const shortcut_unbinds = [
        shortcuts.register({
            'escape': pop_page,
        }, shortcut_context(page_id)),
    ];

    onDestroy(() => {
        shortcut_unbinds.forEach((unbind_fn) => unbind_fn());
    });
</script>

<form on:submit={submit} class="mx-auto max-w-screen-md text-auto">
    <Input name="title" label="{t('common.title')}" value={$note.title} tabindex="2" />
</form>

