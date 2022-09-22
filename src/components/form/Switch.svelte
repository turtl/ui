<script>
    import { createEventDispatcher } from 'svelte';
    import { inc } from '../../models/counter';
    export let name;
    export let checked = false;
    export let disabled = false;
    let klass = '';
    export { klass as class };
    export let label = '';
    export let tabindex = null;
    export let supporting = null;

    let container;
    $: (() => {
        if(!container) return;
        if(checked === 'false') checked = false;
        if(checked === 'true') checked = true;
        set_checked(container.querySelector('input'), !!checked);
    })();

    const color_class = disabled ? 'text-slate-500 dark:text-slate-400' : 'text-black dark:text-white';

    const dispatch = createEventDispatcher();

    function set_checked(inp, val) {
        if(val === true || val === 'true') {
            inp.setAttribute('checked', 'checked');
        } else {
            inp.removeAttribute('checked');
        }
        return {destroy: () => {}};
    }

    function change(e) {
        dispatch('change', e);
        if(e.target) {
            if(e.target.checked) {
                e.target.setAttribute('checked', 'checked');
            } else {
                e.target.removeAttribute('checked');
            }
        }
    }
</script>

<label class="form-input-checkbox block cursor-pointer mb-6 {klass}">
    <div class="flex items-center justify-between w-full">
        <span class="text-lg text-black dark:text-white">{label}</span>
        <div bind:this={container} class="flex items-center">
            <input
                on:change={change}
                use:set_checked={checked}
                bind:checked
                class="translate-x-8"
                type="checkbox"
                {name}
                disabled={disabled || null}
                tabindex={tabindex || null}>
            <div class="relative flex items-center w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-3xl">
                <div class="absolute left-1 w-5 h-5 rounded-full bg-white dark:bg-black drop-shadow text-sm transition-[left]">&nbsp;</div>
            </div>
        </div>
    </div>
    {#if supporting}
        <div class="px-4 pt-1 text-sm {color_class} opacity-75">{supporting}</div>
    {/if}
</label>

<!-- global is required for dark mode styles -->
<style global lang="postcss">
    .form-input-checkbox input[checked] + div {@apply bg-primary dark:bg-primary;}
    .form-input-checkbox input[checked] + div > div {@apply left-6;}
    .form-input-checkbox input:focus + div {@apply outline outline-2 outline-primary dark:outline-primary-700;}
</style>

