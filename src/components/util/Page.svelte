<script>
    import { setContext } from 'svelte';

    export let page_id = null;

    setContext('page_id', page_id);
</script>

<slot></slot>

