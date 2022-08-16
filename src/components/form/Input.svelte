<script>
    import { createEventDispatcher } from 'svelte';
    import { inc } from '../../models/counter';
    export let name;
    export let label;
    export let type = 'text';
    export let value = '';
    let klass = '';
    export { klass as class };
    export let id = null;
    export let disabled = false;
    export let autocomplete = false;
    export let required = false;
    export let supporting = null;
    export let error = false;
    export let icon = null;
    export let icon_class = null;
    export let icon_trailing = null;
    export let icon_trailing_class = null;

    const dispatch = createEventDispatcher();

    if(!id) {
        id = `form_inp_${inc()}`;
    }
    const label_id = `${id}_label`;

    const is_textarea = type === 'textarea';
    const container_padding_class = is_textarea ? 'pt-5' : '';
    const tag = is_textarea ? 'textarea' : 'input';
    const height = 'h-12';
    const height_class = is_textarea ? '' : height;
    const padding_top_class = is_textarea ? '' : 'pt-4';
    const color_class = error ? 'text-red-700 dark:text-red-200' : 'text-black dark:text-white';
    const label_color_class = disabled ? 'text-slate-400 dark:text-slate-500' : 'text-black dark:text-white';
    const border_class = error ? 'border-b-red-600 dark:border-b-red-300' : 'border-b-slate-300 dark:border-b-slate-600';
    const padding_left = icon ? 'pl-11' : 'pl-4';
    const padding_right = icon_trailing ? 'pr-11' : 'pr-4';
    const pointer_events_class = is_textarea ? 'pointer-events-auto' : '';

    function set_value(inp, val) {
        inp.setAttribute('value', val);
        return {destroy: () => {}};
    }

    function handle_input(e) {
        // svelte doesn't let us two-way bind if we have a dynamic `type` attr
        // (why??) so we implement it by hand...
        if(e.target) e.target.setAttribute('value', e.target.value);
    }

    function icon_trailing_click(e) {
        dispatch('click-trailing-icon', e);
    }
</script>

<div class="mb-6">
    <div class="relative {container_padding_class} bg-slate-200/50 bg-slate-700/50">
        {#if icon}
            <div class="absolute z-0 top-0 bottom-0 left-0 ml-4 flex items-center {icon_class || ''}">
                <icon class="text-xl">{icon}</icon>
            </div>
        {/if}
        <svelte:element this={tag}
            on:input={handle_input}
            use:set_value={value}
            class="relative z-10 block {height_class} w-full {padding_top_class} {color_class} border-b-2 {border_class} text-base {padding_left} {padding_right} bg-transparent focus:outline-none focus:border-b-primary dark:focus:border-b-primary transition-colors {klass}"
            {name}
            {type}
            value="{value}"
            id={id || null}
            disabled={disabled || null}
            autocomplete={autocomplete ? 'on' : 'off'}
            required={required || null}
            aria-labelledby={label_id}>{is_textarea ? value : null}</svelte:element>
            <label class="absolute z-10 top-0 left-0 right-0 {height} flex items-center pointer-events-none bg-transparent" id={label_id} for={id}>
            <div class="text-lg {padding_left} pr-4 -mt-1 {label_color_class} transition-all">{label}</div>
        </label>
        {#if icon_trailing}
            <div on:click={icon_trailing_click} class="absolute z-10 top-0 bottom-0 right-0 mr-4 flex items-center {icon_trailing_class || ''}">
                <icon class="text-xl">{icon_trailing}</icon>
            </div>
        {/if}
    </div>
    {#if supporting}
        <div class="px-4 pt-1 text-sm {color_class} opacity-75">{supporting}</div>
    {/if}
</div>

<style lang="postcss">
    input:focus + label div,
    input[value]:not([value=""]) + label div,
    textarea:focus + label div,
    textarea[value]:not([value=""]) + label div {@apply text-sm text-primary-700 dark:text-primary-200 -translate-y-[60%];}
    textarea:focus + label div,
    textarea[value]:not([value=""]) + label div {@apply pointer-events-auto;}
</style>

