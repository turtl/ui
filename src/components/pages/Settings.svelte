<script>
    import { getContext } from 'svelte';
    import Switch from '../form/Switch.svelte';
    import darkmode from '@/models/darkmode';
    import { set_meta } from '@/models/pages';
    import { loc } from '@/util/i18n';

    const page_id = getContext('page_id');

    set_meta(page_id, loc('settings'));
</script>

<Switch name="darkmode" label="{loc('dark_mode_enable')}" on:change={darkmode.toggle} checked={$darkmode.enabled} supporting="{loc('dark_mode_note')}" />

