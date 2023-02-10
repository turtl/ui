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

            // the main place we store our child models
            const collection = writable([]);

            // subscription function for our child store
            const subscribe = collection.subscribe;

            // unindex a model. reference counts models that exist in other types
            // and if we hit a count of zero, clear out that model and unsubscribe
            // from it
            const unindex = (id) => {
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

            // this function processes child models (turns data into models and
            // indexes them), but does not actually add the resulting models to
            // the underlying store (`collection`).
            const add_impl = (children, options) => {
                if(!options) options = {};
                const return_existing = options.return_existing || false;
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
                            return return_existing ? exists : false;
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
                return stores;
            };

            // process (store-ize and index) child models and add them to the underlying
            // storage.
            const add = (children) => {
                collection.update((c) => [...c, ...add_impl(children)]);
            };

            // check if a model is a store or raw data
            const is_store = (id_or_store) => !!id_or_store._id;

            // get a model's id
            const get_id = (id_or_store) => {
                if(is_store(id_or_store)) {
                    return id_or_store._id;
                } else {
                    return id_or_store;
                }
            };

            // remove a model (by ref or by id) from the underlying store
            const remove = (id_or_store) => {
                const values = get(collection);
                const id = get_id(id_or_store);
                if(!values.find((s) => s._id === id)) {
                    return false;
                }
                const ref = unindex(id);
                if(!id) return false;
                collection.update((c) => c.filter((s) => s._id !== id));
                return {id, ref};
            };

            // find a model (as a store, not as data) via a finder fn
            const find = (findfn) => get(collection).find((m) => findfn(get(m)));

            // get a model (As a store, not as data) by id
            const get_by_id = (id) => get(collection).find((s) => s._id === id);

            // clear all models from the underlying store EXCEPT those the excluded
            // IDs array given as the first arg
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
                    unindex(id);
                });
                // now remove everything
                collection.update((vals) => vals.filter((s) => exclude_map[s._id]));
            };

            // replace all children in the underlying store with the given set,
            // (un)indexing removed, preserved, and created models properly.
            const set = (children) => {
                const ids = children.map((child) => child[id_field]);
                clear(ids);
                // if we call add() here, new models will be added AFTER existing
                // models (order of `children` is NOT preserved). instead, we ask
                // `add_impl()` to model-ize/index everything for us, then we
                // add it all ourselves.
                const stores = add_impl(children, {return_existing: true});
                collection.update((_) => [...stores]);
            };

            // allows updating all the models in the collection
            const update = (updatefn) => {
                set(updatefn(get(collection).map((s) => get(s))));
            };

            // add our initial children
            add(children);

            // return our api
            return {
                subscribe,
                add,
                remove,
                find,
                get: get_by_id,
                clear,
                set,
                update,
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

