<script>
    import Menu from './util/Menu.svelte';
    import { pages, pop_page } from '../models/pages';
    import user from '../models/turtl/user';
    import Icon from './util/Icon.svelte';

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
    $: space_shade = opts.space && opts.space.color.shade === 'light' ?
        'text-white' :
        'text-black';
</script>

<header class="relative h-12 flex items-center justify-between px-3 {headerclass} z-50">
    {#if $pages.length > 1}
        <a href="#back" on:click={back} class="flex items-center">
            <Icon class="text-primary" name="arrow" />
            {#if !opts.hide}
                <h1 class="font-mono font-bold ml-4 mt-1">{curpage.title || '(untitled)'}</h1>
            {/if}
        </a>
    {:else}
        <a href="#sidebar" on:click={toggle_sidebar} class="flex items-center">
            {#if $user.loggedin}
                <Icon class="text-primary text-xl relative" name="hamburger" />
            {/if}
            {#if !opts.hide}
                {#if opts.space}
                    <div class="px-2 py-0.5 ml-4 rounded-md {space_shade}" style="background-color: {opts.space.color.bg};">
                        {opts.space.title}
                    </div>
                {/if}
                <h1 class="font-mono font-bold ml-4 mt-1">{curpage.title || '(untitled)'}</h1>
            {/if}
        </a>
    {/if}
    {#if opts.menu}
        <Menu items={opts.menu} />
    {/if}
</header>

