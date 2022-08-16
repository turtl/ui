import { invoke } from './invoke';
import * as listview from '../listview';

const notes_collections = listview.type();

export async function search(filters) {
    if(!filters) filters = {};
    const notes = await invoke('profile:find-notes', filters);
    const store = notes_collections.create(notes);
    return store;
}


