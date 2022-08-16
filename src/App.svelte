<script>
    import Header from './components/Header.svelte';
    import Main from './pages/Main.svelte';
    import Login from './pages/Login.svelte';
    import Err from './pages/Error.svelte';
    import { pages, set_page } from './models/pages';
    import { user } from './models/turtl/user';
    import { load_config } from './models/turtl/config';
    import { procerr } from './util/error';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    function page_animate(node, options) {
        if(!options) options = {};
        if(options.animate) {
            return fly(node, options);
        }
    }

    function test_login(userobj) {
        if(userobj.logged_in) {
            set_page('Turtl', Main);
        } else {
            set_page('Login', Login);
        }
    }
    onMount(async () => {
        // load the stamp config and create our homepage
        try {
            await load_config();
            user.subscribe((v) => {
                test_login(v);
            });
        } catch(err) {
            set_page('Error while loading', Err, {params: {
                text: `There was a problem loading the Turtl configuration: ${procerr(err)}`,
            }});
        }
    });
</script>

<main class="h-screen">
    <Header />
    <div class="absolute top-12 bottom-0 left-0 right-0">
        {#each $pages as {component, params, animate}}
            <div transition:page_animate="{{animate, x: 500, opacity: 0.1}}" class="page absolute left-0 right-0 top-0 bottom-0 overflow-auto p-8 bg-white dark:bg-black">
                <svelte:component this={component} {...params}/>
            </div>
        {/each}
    </div>
</main>

