"use strict";

/**
 * A list view is a store that houses other stores, and holds common references
 * to the child stores such that there is only ever one reference to the child
 * store in any given list, giving us a single point of update/subscription.
 *
 * Because listview stores hold and retain state, they *must* be clear()ed when
 * a component is finished with them. OR ELSE.
 */

import { get, writable } from 'svelte/store';

/**
 * Create a new list view *type*.
 *
 * This will allow creating any number of list views with common child stores:
 *
 *     const note_type = listview.type();
 *     const note_list1 = note_type.create([
 *         {id: 1, text: 'GROCERY LIST LOL'},
 *         {id: 2, text: 'remember to THANK ALEXA FOR TURNING ON THE LIGHTS'},
 *     ]);
 *     const note_list2 = note_type.create([
 *         {id: 1, text: 'GROCERY LIST OMG'},     // updates note id 1!
 *     ]);
 *     expect(get(note_list1.find(1)).text).toBe('GROCERY LIST OMG');
 *     expect(get(note_list2.find(1)).text).toBe('GROCERY LIST OMG');
 *
 * In the above, note_list1 and note_list2 will be stores that both hold a
 * common reference to note ID 1. When the second list is created, it updates
 * note 1 with the new `text` field byte default. If no update is desired, set
 * `options.skip_update = true`
 */
export function type(options) {
    if(!options) options = {};
    const id_field = options.id_field || 'id';

    // a mapping that references children *across all list views* to their IDs
    const child_index = {};
    return {
        /**
         * Creates a new listview which tracks models in common with other
         * listviews of the same type.
         *
         * @param {object[]} children - An initial set of children to initialize
         *   this list view with.
         * @param {object} options - Some options for our list view
         * @param {bool|false} options.skip_update - By default, if a child that
         *   already exists in the list view is passed in, it will update (merge)
         *   the existing model with its data. If this is not desired, set to
         *   false.
         * @returns - A store with a set of extra functions for managing the list
         *   view.
         */
        create: (children, options) => {
            if(!Array.isArray(children)) {
                children = [];
            }
            if(!options) options = {};
            const skip_update = options.skip_update || false;

            const collection = writable([]);
            const subscribe = collection.subscribe;
            const add = (children) => {
                const exists_map = get(collection)
                    .reduce((acc, x) => { acc[x._id] = x; return acc; }, {});
                if(!Array.isArray(children)) {
                    children = [children];
                }
                const stores = children
                    .map((child) => {
                        const id = child[id_field];
                        const exists = exists_map[id];
                        if(exists) {
                            // don't add children that are already in the list
                            if(!skip_update) {
                                exists.set(child);
                            }
                            return false;
                        }
                        const indexed = child_index[id];
                        const store = indexed ?
                            (() => {
                                if(!skip_update) {
                                    indexed.store.set(child);
                                }
                                return indexed.store;
                            })() :
                            // if creating a new store, index it
                            (() => {
                                const child_store = writable(child);
                                // changes in child bubble up to collection, but
                                // we don't want the initial subscription to fire
                                // (like, LOL, who would, right??) so we silence
                                // the first run of the subscription.
                                let last_id = null;
                                const unsubscribe = child_store.subscribe((model) => {
                                    if(!last_id) {
                                        last_id = model[id_field];
                                        return;
                                    }
                                    // if the child id has changed, update our index
                                    // entry.
                                    const id = model[id_field];
                                    if(id != last_id) {
                                        const entry = child_index[last_id];
                                        entry.store._id = id;
                                        delete child_index[last_id];
                                        child_index[id] = entry;
                                        last_id = id;
                                    }
                                    collection.update((v) => [...v]);
                                });
                                child_index[id] = {store: child_store, unsubscribe, ref: 0};
                                return child_store;
                            })();
                        store._id = id; // a bit of caching
                        child_index[id].ref += 1;
                        return store;
                    })
                    .filter((s) => !!s);
                collection.update((c) => [...c, ...stores]);
            };
            const is_store = (id_or_store) => !!id_or_store._id;
            const get_id = (values, id_or_store) => {
                if(is_store(id_or_store)) {
                    return id_or_store._id;
                } else {
                    return id_or_store;
                }
            };
            const unindex = (values, id) => {
                if(!id) return false;
                const entry = child_index[id];
                entry.ref -= 1;
                if(entry.ref <= 0) {
                    // dereference the child, allowing it to be GCed LOL
                    delete child_index[id];
                    entry.unsubscribe();
                }
                return entry.ref;
            };
            const remove = (id_or_store) => {
                const values = get(collection);
                const id = get_id(values, id_or_store);
                if(!values.find((s) => s._id === id)) {
                    return false;
                }
                const ref = unindex(values, id);
                if(!id) return false;
                collection.update((c) => c.filter((s) => s._id !== id));
                return {id, ref};
            };
            const find = (id) => get(collection).find((s) => s._id === id);
            const clear = (exclude_ids) => {
                if(!Array.isArray(exclude_ids)) {
                    exclude_ids = [];
                }
                const exclude_map = exclude_ids.reduce((acc, x) => { acc[x] = true; return acc; }, {});
                // clone because we're going to be looping and removing at the
                // same time
                const values = get(collection);
                if(values.length === 0) return;
                values.forEach((store) => {
                    const id = store._id;
                    if(exclude_map[id]) {
                        return;
                    }
                    // unindex, but don't remove the items
                    unindex(values, id);
                });
                // now remove everything
                collection.update((vals) => vals.filter((s) => exclude_map[s._id]));
            };
            const set = (children) => {
                const ids = children.map((child) => child[id_field]);
                clear(ids);
                add(children);
            };
            add(children);
            return {
                subscribe,
                add,
                remove,
                find,
                clear,
                set,
            };
        },

        /**
         * Allows finding a child by id from the tacking index. This returns an
         * object:
         *
         *     {store: <child store>, ref: <num_references>}
         * 
         * `store` holds the child store, ref is the reference count of how many
         * lists store this child. If the reference count drops to 0, the index
         * entry is removed which frees the store.
         */
        find_child: (id) => {
            return child_index[id];
        },
    };
}

