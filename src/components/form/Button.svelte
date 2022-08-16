<script>
    import { createEventDispatcher } from 'svelte';
    export let label;
    let klass = '';
    export { klass as class };
    export let display = 'filled';  // 'outlined', 'text'
    export let icon = null;
    export let icon_class = null;

    const display_map = {
        'filled': 'text-white bg-primary drop-shadow hover:drop-shadow-md focus:bg-primary-dark/75 focus:drop-shadow-md',
        'outlined': 'text-primary border border-primary hover:bg-primary/10 focus:bg-primary/25',
        'text': 'text-primary hover:bg-primary/10 focus:bg-primary/25',
    };

    const dispatch = createEventDispatcher();

    const button_classes = display_map[display];
    if(!button_classes) {
        throw new Error(`Button -- unknown 'display' type ${display}`);
    }
    function button_click(e) {
        dispatch('click', e);
    }
</script>

<button
        on:click={button_click}
        class="cursor-pointer flex items-center h-9 px-3 py-1 rounded font-semibold transition-all outline-none {button_classes} {klass}"
        type="button">
    {#if icon}
        <icon class="text-xl pr-2 {icon_class || ''}">{icon}</icon>
    {/if}
    <div class="relative">{label}</div>
</button>

