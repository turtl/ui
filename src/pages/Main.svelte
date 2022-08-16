<script>
    import Loading from '../components/util/Loading.svelte';
    import { set_page } from '../models/pages';
    import { load_profile } from '../models/turtl/profile';
    import { procerr } from '../util/error';

    async function load() {
        return load_profile();
    }
</script>

{#await load()}
    <Loading />
{:then identity}
    Loaded!
{:catch err}
    <p class="text-error">{procerr(err)}</p>
{/await}

