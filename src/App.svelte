<script>
    import Header from './components/Header.svelte';
    import Main from './pages/Main.svelte';
    import Login from './pages/Login.svelte';
    import Err from './pages/Error.svelte';
    import Settings from './pages/Settings.svelte';
    import { pages, pop_page, push_page, set_page } from './models/pages';
    import user from './models/turtl/user';
    import { load_config } from './models/turtl/config';
    import darkmode from './models/darkmode';
    import { procerr } from './util/error';
    import { init as i18n_init, loc } from './util/i18n';
    import * as shortcuts from './util/shortcuts';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';

    function page_animate(node, options) {
        if(!options) options = {};
        if(options.animate) {
            return fly(node, options);
        }
    }

    function test_login(userobj) {
        if(userobj.loggedin) {
            set_page(Main);
        } else {
            set_page(Login);
        }
    }

    async function darkmode_toggle() {
        await darkmode.toggle();
    }

    onMount(async () => {
        i18n_init();

        darkmode.subscribe((dm) => {
            const html = document.querySelector('html');
            if(dm.enabled && !html.classList.contains('dark')) {
                html.classList.add('dark');
            } else if(!dm.enabled && html.classList.contains('dark')) {
                html.classList.remove('dark');
            }
        });
        await darkmode.load();

        // load the config and create our homepage
        try {
            await load_config();
            shortcuts.register({
                's-d': darkmode_toggle,
                'backspace': pop_page,
            });
            shortcuts.bind();
            user.subscribe(test_login);
        } catch(err) {
            set_page(Err, {params: {
                title: loc('error_loading'),
                text: loc('error_config_text', {err: procerr(err)}),
            }});
        }
    });
</script>

<main class="h-screen">
    <Header />
    <div class="absolute top-12 bottom-0 left-0 right-0">
        {#each $pages as {component, params, animate}}
            <div transition:page_animate="{{animate, x: 500, opacity: 0.1}}" class="page absolute left-0 right-0 top-0 bottom-0 overflow-auto p-8 bg-white dark:bg-black z-40">
                <svelte:component this={component} {...params}/>
            </div>
        {/each}
    </div>
</main>

