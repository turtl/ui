<script>
    import { onDestroy } from 'svelte';
    import Icon from './Icon.svelte';
    import { createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';
    import * as shortcuts from '@/util/shortcuts';
    import { shortcut_context as page_to_context } from '@/models/pages';
    import { press } from 'svelte-gestures';

    export let actions = [];
    export let page_id = null;
    export let shortcut_context = null;
    export let bind_shortcut = null;
    export let icon = 'plus';
    export let title = '';
    export let extra_classes = '';
    export let open_class = '';

    const dispatch = createEventDispatcher();

    let open = false;

    function toggle_actions(e) {
        if(e) e.preventDefault();
        if(actions) {
            open = !open;
        } else {
            dispatch('action', {action: null});
        }
    }

    function process_action(e, action) {
        if(e) e.preventDefault();
        open = false;
        dispatch('action', {action});
    }

    function default_action(e) {
        process_action(e, actions ? actions[0].id : null);
    }

    if(page_id && !shortcut_context) {
        shortcut_context = page_to_context(page_id);
    }

    const shortcut_unbinds = [];
    shortcut_unbinds.push(shortcuts.register({
        'escape': () => { open = false; },
    }, shortcut_context));
    if(bind_shortcut) {
        shortcut_unbinds.push(shortcuts.register({
            [bind_shortcut]: () => toggle_actions(null),
        }, shortcut_context));
    }
    if(actions) {
        actions.forEach((action) => {
            if(!action || !action.shortcut) return;
            shortcut_unbinds.push(shortcuts.register({
                [action.shortcut]: () => process_action(null, action.id),
            }, shortcut_context));
        });
    }

    onDestroy(() => {
        shortcut_unbinds.forEach((unbind_fn) => unbind_fn());
    });

    $: drop_shadow_class = open ? 'drop-shadow-lg' : 'drop-shadow-md';
</script>

<div class="absolute bottom-2.5 right-2.5 p-2.5 flex flex-col-reverse">
    <a on:click={toggle_actions}
           use:press={{ timeframe: 750, triggerBeforeFinished: true }}
           on:press={default_action}
           class="flex w-16 h-16 justify-center items-center {drop_shadow_class} rounded-full bg-primary transition-[drop-shadow,filter]"
           href="#action"
           title="{title}">
        <Icon
            class="inline-block text-white text-2xl w-8 h-8 text-center align-top transition-transform {extra_classes} {open ? open_class : ''}"
            name={icon} />
    </a>

    {#if actions && open}
        {#each actions as action, i (action.id)}
            <a transition:fly="{{duration: 150, y: 50}}" class="relative flex w-12 h-12 ml-2 mb-2.5 justify-center items-center drop-shadow rounded-full bg-primary" href="#{action.id}" on:click={(e) => process_action(e, action.id)} title="{action.title}">
                <h4 class="absolute right-12 mr-2 px-2 py-px whitespace-nowrap bg-black dark:bg-white text-white dark:text-black rounded">{action.title}</h4>
                <Icon
                    class="inline-block text-white text-2xl w-8 h-8 text-center align-top transition-transform"
                    name={action.icon} />
            </a>
        {/each}
    {/if}
</div>

