<script>
    import Button from '../form/Button.svelte';
    import spaces from '@/models/turtl/spaces';
    import user from '@/models/turtl/user';

    $: space = spaces.get_active();

    function set_active() {
    }
</script>

<p class="dark:text-white">{space.title}</p>

<Button on:click={set_active} label="CLICK ME!!" display="text" class="ml-2" tabindex=5 />

