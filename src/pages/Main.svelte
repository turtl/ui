<script>
    import Loading from '../components/util/Loading.svelte';
    import { set_meta } from '../models/pages';
    import { load_profile } from '../models/turtl/profile';
    import spaces from '../models/turtl/spaces';
    import { procerr } from '../util/error';
    import { loc } from '../util/i18n';

    set_meta(loc('loading_profile'));

    let loading = true;
    let logs = [];
    let push_log = (msg) => logs = [...logs, msg];
    async function load() {
        loading = true;
        push_log(loc('loading_profile'));
        await load_profile();
    }
    load();
</script>

{#if loading}
    <Loading logs={logs} />
{:else}
    Loaded!
{/if}

