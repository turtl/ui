<script>
    import Menu from './util/Menu.svelte';
    import { pages, pop_page } from '../models/pages';
    import user from '../models/turtl/user';

    function back(e) {
        e.preventDefault();
        pop_page();
    }

    let open = false;
    function toggle_sidebar(e) {
        e.preventDefault();
        open = !open;
    }

    $: curpage = $pages[$pages.length - 1] || {};

    $: opts = curpage.header || {};
    $: headerclass = opts.hide ?
        'bg-white dark:bg-black text-black dark:text-white' :
        'bg-slate-800 dark:bg-black text-white';
</script>

<header class="relative h-12 flex items-center justify-between px-3 {headerclass} z-50">
    {#if $pages.length > 1}
        <a href="#back" on:click={back} class="flex items-center">
            <icon class="text-primary">&#xE801;</icon>
            {#if !opts.hide}
                <h1 class="font-mono font-bold ml-4 mt-1">{curpage.title || '(untitled)'}</h1>
            {/if}
        </a>
    {:else}
        <a href="#sidebar" on:click={toggle_sidebar} class="flex items-center">
            {#if $user.loggedin}
                <icon class="text-primary text-xl relative">&#xF0C9;</icon>
            {/if}
            {#if !opts.hide}
                <h1 class="font-mono font-bold ml-4 mt-1">{curpage.title || '(untitled)'}</h1>
            {/if}
        </a>
    {/if}
    {#if opts.menu}
        <Menu items={opts.menu} />
    {/if}
</header>

