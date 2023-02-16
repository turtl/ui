import { get, writable } from 'svelte/store';
import { invoke } from './core';
import * as listview from '../listview';

export function Note(data) {
    const model = writable(data);
    model.id = () => get(model).id;
    return model;
}

export const notes_collection = listview.type({
    create_child: Note,
});

export async function search(filters, store) {
    if(!filters) filters = {};
    const {notes, tags, total} = await invoke('profile:find-notes', filters);
    if(store) {
        store.set(notes);
    } else {
        store = notes_collection.create(notes);
    }
    return {notes: store, tags, total};
}

