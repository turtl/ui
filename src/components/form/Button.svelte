<script>
    import { createEventDispatcher } from 'svelte';
    import Icon from '../util/Icon.svelte';
    export let label;
    let klass = '';
    export { klass as class };
    export let display = 'filled';  // 'outlined', 'text'
    export let icon = null;
    export let icon_class = null;
    export let submit = false;
    export let tabindex = null;

    const display_map = {
        'filled': 'text-white dark:text-black bg-primary dark:bg-primary/90 drop-shadow hover:drop-shadow-md focus:drop-shadow-md hover:bg-primary-600 dark:hover:bg-primary focus:bg-primary-600 dark:focus:bg-primary',
        'outlined': 'text-primary dark:text-primary-400 border border-primary hover:bg-primary-50 dark:hover:bg-primary-900 focus:bg-primary-50 dark:focus:bg-primary-900',
        'text': 'text-primary dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 focus:bg-primary-50 dark:focus:bg-primary-900',
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
        class="cursor-pointer flex items-center px-4 py-2 rounded font-semibold transition-all outline-none {button_classes} {klass}"
        type={submit ? 'submit' : 'button'}
        tabindex={tabindex || null}>
    {#if icon}
        <Icon class="text-xl pr-2 {icon_class || ''}" name={icon} />
    {/if}
    <div class="relative">{label}</div>
</button>

