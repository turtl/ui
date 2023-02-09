<script>
    import { onDestroy } from 'svelte';
    import Fullscreen from './Fullscreen.svelte';
    import { loc } from '../../util/i18n';
    import logo from '../../assets/images/logo.svg';

    export let logs = [];

    let i = 0;
    let dot_interval = setInterval(() => {
        i = (i + 1) % 3;
    }, 750);
    onDestroy(() => {
        clearInterval(dot_interval);
    });
</script>

<Fullscreen>
    <div class="w-full text-center">
        <span class="flex items-center justify-center mb-6 text-6xl text-slate-400 dark:text-slate-500">
            {#each Array(i + 1) as _}
                <img class="w-8 h-8 md:w-12 md:h-12 mx-1" src="{logo}" alt="{loc('logo')}">
            {/each}
        </span>
        {#if logs && logs.length > 0}
            <div class="h-0">
                {#each logs as log}
                    <p class="text-slate-500 dark:text-slate-400">{log}</p>
                {/each}
            </div>
        {/if}
    </div>
</Fullscreen>

