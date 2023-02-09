<script>
    import log from '../../util/log';
    import { onMount, onDestroy } from 'svelte';
    import { inc } from '../../models/counter';
    import * as shortcuts from '../../util/shortcuts';
    import { slide } from "svelte/transition";

    export let items = [];
    export let menu_class = '';
    export let id = null;

    if(!id) {
        id = `menu_${inc()}`;
    }

    let open = false;
    function toggle(e) {
        if(e) e.preventDefault();
        open = !open;
    }

    function close(_e) {
        open = false;
    }

    function click(e, item) {
        if(e) e.preventDefault();
        close();
        if(item.action instanceof Function) {
            item.action();
        } else {
            log.warn(`Menu::click() -- missing action for item ${JSON.stringify(item)}`);
        }
    }

    const clicker = (e) => {
        if(!e || !e.target) return;
        if(!e.target.matches(`.${id} *`)) {
            close();
        }
    };

    onMount(() => {
        document.body.addEventListener('click', clicker);
        shortcuts.register({
            'escape': close,
        });
    });

    onDestroy(() => {
        document.body.removeEventListener('click', clicker);
        shortcuts.unregister({
            'escape': close,
        });
    });
</script>

<div class="{id} relative">
    <a on:click={toggle} href="#menu">
        <icon class="block rotate-90 text-xl">&#xE802;</icon>
    </a>
    {#if open}
        <menu transition:slide="{{duration: 150}}" class="absolute top-0 right-0 w-48 shadow-lg {menu_class}">
            {#if items.length > 0}
                {#each items as item, _i}
                    <a href="#item-{item.id}" on:click={(e) => click(e, item)} class="block p-2 text-black dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600">
                        {item.title}
                    </a>
                {/each}
            {/if}
        </menu>
    {/if}
</div>

