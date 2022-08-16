<script>
    import { pages, pop_page } from '../models/pages';
    import logo from '../assets/images/logo.svg';

    function back(e) {
        e.preventDefault();
        pop_page();
    }
</script>

<header class="bg-slate-700 dark:bg-black h-12 flex items-center text-white px-3">
    {#if $pages.length > 1}
        <a href="#back" on:click={back} class="flex">
            <icon class="pr-6">&#xE800;</icon>
            <h1 class="font-mono font-bold">{($pages[$pages.length - 1] || {}).title}</h1>
        </a>
    {:else}
        <img src={logo} alt="Turtl logo">
        <h1 class="font-mono font-bold">{($pages[$pages.length - 1] || {}).title}</h1>
    {/if}
</header>

