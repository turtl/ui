<script>
    import Header from './components/Header.svelte';
    import Page from './components/util/Page.svelte';
    import Main from './components/pages/Main.svelte';
    import Login from './components/pages/Login.svelte';
    import Err from './components/pages/Error.svelte';
    import { pages, pop_page, set_page } from './models/pages';
    import * as core from './models/turtl/core';
    import user from './models/turtl/user';
    import * as remember_me from './models/remember-me';
    import config from './models/turtl/config';
    import darkmode from './models/darkmode';
    import { procerr } from './util/error';
    import { ui as log } from './util/log';
    import delay from './util/delay';
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

    async function connected() {
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
            await config.load();
            shortcuts.register({
                's-d': darkmode_toggle,
                'backspace': pop_page,
            });
            shortcuts.bind();
            await remember_me.login();
            await delay(50);
            user.subscribe(test_login);
        } catch(err) {
            set_page(Err, {params: {
                title: loc('error_loading'),
                text: loc('error_config_text', {err: procerr(err)}),
            }});
        }
    }

    onMount(async () => {
        i18n_init();
        const check_connected = async () => {
            if(core.is_connected()) {
                connected();
            }
        };
        core.events.on('connected', check_connected);
        core.events.on('error', (ev) => {
            log.error(`core error`, ev.err);
        });
        check_connected();
    });
</script>

<main class="h-screen">
    <Header />
    <div class="absolute top-12 bottom-0 left-0 right-0">
        {#each $pages as {id, component, params, animate}}
            <div transition:page_animate="{{animate, x: 500, opacity: 0.1}}" class="page absolute left-0 right-0 top-0 bottom-0 overflow-auto p-8 bg-white dark:bg-black z-40">
                <Page page_id={id}>
                    <svelte:component this={component} {...params}/>
                </Page>
            </div>
        {/each}
    </div>
</main>

