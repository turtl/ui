<script>
    import { onDestroy } from 'svelte';
    import Note from './View.svelte';
    import * as notes from '@/models/turtl/notes';
    export let space_id = null;

    const note_search = notes.notes_collection.create();

    onDestroy(() => {
        note_search.clear();
    });
</script>

{#await notes.search({ space_id }, note_search)}
    LOADING!!!1
{:then _res}
    {#if note_search.len() > 0}
        {#each $note_search as note (note.id())}
            <Note {note} />
        {/each}
    {:else}
        <content>
            NO NOTES TRY AGAIN LATER!!!
        </content>
    {/if}
{:catch err}
    OH MY GOD {err}
{/await}

