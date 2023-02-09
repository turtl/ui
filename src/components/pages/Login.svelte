<script>
    import Settings from './Settings.svelte';
    import Button from '../form/Button.svelte';
    import Input from '../form/Input.svelte';
    import Switch from '../form/Switch.svelte';
    import logo from '@/assets/images/logo.svg';
    import { push_page, set_meta } from '@/models/pages';
    import { loc } from '@/util/i18n';
    import { slide } from "svelte/transition";
    import user from '@/models/turtl/user';
    import { procerr } from '@/util/error';

    set_meta(loc('login'), {
        header: {
            hide: true,
            menu: [
                {id: 'settings', title: loc('settings'), action: () => push_page(Settings)},
            ],
        },
    });

    let page_join_mode = false;
    let page_settings_open = false;
    let page_error = null;

    let username = null;
    let passphrase = null;
    let passphrase_confirm = null;
    let i_understand = false;
    let turtl_server = null;
    let proxy_server = null;
    let skip_ssl_verification = false;
    let strength_text = null;
    let strength_width = null;
    let strength_class = null;

    async function submit(e) {
        e.preventDefault();
        e.stopPropagation();
        if(page_join_mode) {
            throw new Error('unimplemented');
        } else {
            try {
                await user.login(username, passphrase);
            } catch(err) {
                page_error = err;
            }
        }
    }

    function open_join(e) {
        e.preventDefault();
        page_join_mode = true;
        page_error = null;
        update_passphrase_strength_meter(e);
    }

    function open_login(e) {
        e.preventDefault();
        page_join_mode = false;
        page_error = null;
    }

    function toggle_settings(e) {
        e.preventDefault();
        page_settings_open = !page_settings_open;
    }

    function update_passphrase_strength_meter(_e) {
        const pass = passphrase || '';
        // NOTE: we actually want i18next('stringval') here instead of
        // i18next(status) because by using hardcoded strings, we can analyze
        // the code and find a list of active i18n strings, which could be used
        // to generate an automated list of translations that are needed. this
        // is especially important for when the interface language  changes.
        let status = null;
        let text = null;
        if(pass.length >= 32) {
            status = 'excellent';
            text = loc('excellent');
        } else if(pass.length >= 24) {
            status = 'great';
            text = loc('great');
        } else if(pass.length >= 16) {
            status = 'good';
            text = loc('good');
        } else if(pass.length >= 10) {
            status = 'ok';
            text = loc('ok');
        } else if(pass.length > 4) {
            status = 'weak';
            text = loc('weak');
        } else if(pass.length > 0) {
            status = 'too short';
            text = loc('too_short');
        }

        var width = Math.min(pass.length / 32, 1) * 100;

        const class_map = {
            'excellent': ' bg-primary',
            'good': ' bg-yellow-300',
            'great': 'bg-primary-200',
            'ok': 'bg-yellow-500',
            'too short': 'bg-red-600',
            'weak': 'bg-red-400',
        };

        strength_text = text;
        strength_width = width;
        strength_class = class_map[status];
    }
</script>

<form on:submit={submit} class="mx-auto max-w-screen-md text-auto">
    <div class="flex flex-col w-full py-10 items-center justify-center">
        <img src="{logo}" class="w-20 h-20 md:w-24 md:h-24" alt="{loc('logo')}">
        <content class="pt-4 text-center">
            <h1 class="mb-3">{loc('welcome_turtl')}</h1>
            <p>{loc('app_desc')}</p>
        </content>
    </div>
    {#if page_error}
        <div transition:slide="{{duration: 150}}" class="mb-6 p-4 bg-red-200 dark:bg-red-700">
            {procerr(page_error)}
        </div>
    {/if}
    <Input bind:value={username} type="email" name="email" label="{loc('email')}" required=true tabindex=1 />
    <Input on:input={update_passphrase_strength_meter} bind:value={passphrase} type="password" name="passphrase" label="{loc('passphrase')}" required=true tabindex=2 supporting={page_join_mode && passphrase ? loc('passphrase_strength', {strength: strength_text}) : null} class="mb-0" />
    {#if page_join_mode}
        {#if passphrase}
            <div class="relative px-4 -top-5" transition:slide="{{duration: 150}}">
                <div class="block w-full bg-slate-50 dark:bg-slate-800">
                    <div class="block {strength_class} h-1" style="width: {strength_width}%;"></div>
                </div>
            </div>
        {/if}
        <div class="mb-6" transition:slide="{{duration: 150}}">
            <Input bind:value={passphrase_confirm} type="password" name="confirm" label="{loc('passphrase_confirm')}" required=true tabindex=2 />
            <div class="my-2 p-4 bg-orange-100 dark:bg-orange-900/50">
                <Switch bind:checked={i_understand} name="understand" class="!mb-0" label="{loc('passphrase_understand')}" tabindex="3" supporting="{loc('passphrase_importance')}" />
            </div>
        </div>
    {/if}
    <div class="flex items-center justify-center">
        {#if page_join_mode}
            <Button label="{loc('create_account')}" submit=true tabindex=4 />
            <Button on:click={open_login} label="{loc('login_existing')}" display="text" class="ml-2" tabindex=5 />
        {:else}
            <Button label="{loc('login')}" submit=true tabindex=4 />
            <Button on:click={open_join} label="{loc('create_account')}" display="text" class="ml-2" tabindex=5 />
        {/if}
    </div>

    <div class="flex items-center justify-center my-6 pt-6 border-t border-slate-200 dark:border-slate-600">
        <Button on:click={toggle_settings} label="{loc('advanced_settings')}" display="text" tabindex=6 />
    </div>

    {#if page_settings_open}
        <div transition:slide="{{duration: 150}}">
            <Input bind:value={turtl_server} type="text" name="server" label="{loc('turtl_server')}" tabindex=7 />
            <Input bind:value={proxy_server} type="text" name="proxy" label="{loc('proxy_server')}" tabindex=8 />
            <Switch bind:checked={skip_ssl_verification} name="skip_ssl" label="{loc('skip_ssl_verify')}" tabindex=9 />
        </div>
    {/if}
</form>

