<script>
    import Switch from '../form/Switch.svelte';
    import darkmode from '@/models/darkmode';
    import { set_meta } from '@/models/pages';
    import { loc } from '@/util/i18n';

    set_meta(loc('settings'));
</script>

<Switch name="darkmode" label="{loc('dark_mode_enable')}" on:change={darkmode.toggle} checked={$darkmode.enabled} supporting="{loc('dark_mode_note')}" />

