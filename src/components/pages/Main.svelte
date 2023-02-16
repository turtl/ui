<script>
    import { getContext } from 'svelte';
    import Loading from '../util/Loading.svelte';
    import Space from '../turtl/Space.svelte';
    import { set_meta } from '@/models/pages';
    import { load_profile } from '@/models/turtl/profile';
    import { loc } from '@/util/i18n';
    import * as core from '@/models/turtl/core';

    const page_id = getContext('page_id');

    set_meta(page_id, loc('loading_profile'));

    let loading = true;
    let logs = [];
    let push_log = (msg) => logs = [...logs, msg];
    async function load() {
        loading = true;
        push_log(loc('loading_profile'));
        const unbind = core.events.on('event', (ev) => {
            (ev === 'profile:loaded') && push_log(loc('indexing_notes'));
        });
        await load_profile();
        unbind();
        loading = false;
    }
    load();
</script>

{#if loading}
    <Loading logs={logs} />
{:else}
    <Space />
{/if}

