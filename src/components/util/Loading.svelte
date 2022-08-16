<script>
    import { onDestroy } from 'svelte';
    import Fullscreen from './Fullscreen.svelte';

    let dots = '';
    let i = 0;
    let dot_interval = setInterval(() => {
        i = (i + 1) % 3;
        dots = Array.from(new Array(i + 1), () => '.').join('');
    }, 750);
    onDestroy(() => {
        clearInterval(dot_interval);
    });
</script>

<Fullscreen>
    <span class="text-6xl">{dots}</span>
</Fullscreen>

