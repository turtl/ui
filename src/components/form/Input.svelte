<script>
    import { createEventDispatcher } from 'svelte';
    import { inc } from '@/models/counter';
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
    export let tabindex = null;
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
    const height = 'h-14';
    const height_class = is_textarea ? '' : height;
    const padding_top_class = is_textarea ? 'pt-1' : 'pt-4';
    const color_class = disabled ? 'text-slate-500 dark:text-slate-400' : 'text-black dark:text-white';
    const label_color_class = disabled ?
        'label-disabled' :
        (error ? 'label-error' : '');
    const border_class = (error && !disabled) ?
        'border-b-red-600 dark:border-b-red-400' :
        'border-b-slate-300 dark:border-b-slate-600 focus:border-b-primary dark:focus:border-b-primary-700';
    const padding_left = icon ? 'pl-11' : 'pl-4';
    const padding_right = icon_trailing ? 'pr-11' : 'pr-4';

    function set_value(inp, val) {
        if(!val) return;
        if(is_textarea) {
            inp.innerHTML(val);
        } else {
            inp.setAttribute('value', val);
        }
        return {destroy: () => {}};
    }

    function handle_input(e) {
        // svelte doesn't let us two-way bind if we have a dynamic `type` attr
        // (why??) so we implement it by hand...
        if(e.target) e.target.setAttribute('value', e.target.value);
        // delay s value attr is set when we run the event
        setTimeout(() => dispatch('input', e));
    }

    function icon_trailing_click(e) {
        dispatch('click-trailing-icon', e);
    }

    // some song and dance because of this: https://github.com/sveltejs/svelte/issues/7566
    const attrs = {
        class: `relative z-10 block ${height_class} w-full ${padding_top_class} ${color_class} border-b-2 ${border_class} text-base ${padding_left} ${padding_right} bg-transparent focus:outline-none transition-colors ${klass}`,
        name,
        type,
        tabindex: tabindex || null,
        id: id || null,
        disabled: disabled || null,
        autocomplete: autocomplete ? 'on' : 'off',
        required: required || null,
        'aria-labelledby': '{label_id}',
    };
</script>

<div class="turtl-input mb-6">
    <div class="relative {container_padding_class} bg-slate-200/50 dark:bg-slate-600/50">
        {#if icon}
            <div class="absolute z-0 top-0 bottom-0 left-0 ml-4 flex items-center {icon_class || ''}">
                <icon class="text-xl">{icon}</icon>
            </div>
        {/if}
        <!-- lovely duplication here. again, https://github.com/sveltejs/svelte/issues/7566 -->
        {#if is_textarea}
            <textarea
                on:input={handle_input}
                use:set_value={value}
                bind:value
                {...attrs}></textarea>
        {:else}
            <input
                on:input={handle_input}
                use:set_value={value}
                bind:value
                {...attrs}/>
        {/if}

        <label class="absolute z-10 top-px left-0 right-0 {height} flex items-center pointer-events-none bg-transparent" id={label_id} for={id}>
            <div class="text-lg {padding_left} pr-4 -mt-1 text-slate-600 dark:text-slate-400 {label_color_class} transition-all">{label}</div>
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

<!-- global is required for dark mode styles -->
<style global lang="postcss">
    .turtl-input input:focus + label div,
    .turtl-input textarea:focus + label div {@apply !text-primary-700 dark:!text-primary-400;}
    .turtl-input input:focus + label div,
    .turtl-input input[value]:not([value=""]) + label div,
    .turtl-input textarea:focus + label div,
    .turtl-input textarea[value]:not([value=""]) + label div {@apply text-sm text-slate-500 dark:text-slate-400 -translate-y-[55%];}
    .turtl-input textarea:focus + label div,
    .turtl-input textarea[value]:not([value=""]) + label div {@apply pointer-events-auto;}
    .turtl-input input + label div.label-disabled,
    .turtl-input textarea + label div.label-disabled {@apply !text-slate-500;}
    .turtl-input input + label div.label-error,
    .turtl-input textarea + label div.label-error {@apply !text-red-700 dark:!text-red-400;}
</style>

