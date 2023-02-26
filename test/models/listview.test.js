"use strict";

import { get, writable } from 'svelte/store';
import * as listview from '../../src/models/listview';

describe('models/listview', () => {
    let type = null;
    beforeEach(() => {
        type = listview.type();
    });

    it('creates types', () => {
        const list = type.create([]);
        expect(type.create).toBeInstanceOf(Function);
        expect(get(list)).toEqual([]);
    });

    it('creates types with custom children', () => {
        const custom = listview.type({
            id_field: 'identifier',
            create_child: (data) => {
                const child = writable(data);
                child.id = () => child._id;
                child.name = () => get(child).name;
                return child;
            },
        });
        const list = custom.create();
        list.add([
            {identifier: 'ab427x.2', name: 'garf'},
            {identifier: '772218.9', name: 'neil'},
        ]);
        expect(list.get('ab427x.2').name()).toEqual('garf');
        expect(list.get('772218.9').id()).toEqual('772218.9');
    });

    it('subscribes', () => {
        const list = type.create([{id: 1}]);
        const observed = [];
        list.subscribe((v) => observed.push(v.map(get)));
        list.set([{id: 2}, {id: 3}, {id: 4}]);
        list.clear();
        expect(observed.length).toBe(4);
        expect(observed[0]).toEqual([{id: 1}]);
        expect(observed[1]).toEqual([]);
        expect(observed[2]).toEqual([{id: 2}, {id: 3}, {id: 4}]);
        expect(observed[3]).toEqual([]);
    });

    it('unsubscribes', () => {
        const list = type.create([{id: 2}]);
        let counter = 0;
        const unsub = list.subscribe((_) => counter++);
        list.set([{id: 3}]);
        list.set([{id: 4}]);
        expect(counter).toBe(5);
        unsub();
        list.set([{id: 'SAY THATS A NICE BIKE'}]);
        list.set([{id: 'pooop'}]);
        expect(counter).toBe(5);
    });

    it('adds single and multiple', () => {
        const list = type.create([]);
        const observed = [];
        list.subscribe((v) => observed.push(v.map(get)));

        list.add({id: '123', name: 'pills'});
        list.add([
            {id: '445', name: 'bananas'},
            {id: '777', name: 'mango'},
        ]);

        expect(observed.length).toEqual(3);
        expect(observed[0]).toEqual([]);
        expect(observed[1]).toEqual([{id: '123', name: 'pills'}]);
        expect(observed[2]).toEqual([
            {id: '123', name: 'pills'},
            {id: '445', name: 'bananas'},
            {id: '777', name: 'mango'},
        ]);
    });

    it('finds models', () => {
        const list = type.create([
            {id: 'zing123', name: 'boof'},
            {id: 555, name: 'herp'},
        ]);
        const model1 = list.find((m) => m.name === 'boof');
        const model2 = list.find((m) => m.id === 555);
        const model3 = list.find((m) => m.id === 667);
        expect(get(model1)).toEqual({id: 'zing123', name: 'boof'});
        expect(get(model2)).toEqual({id: 555, name: 'herp'});
        expect(model3).toBeUndefined();
    });

    it('gets models by id', () => {
        const list = type.create([
            {id: 'zing123', name: 'boof'},
            {id: 555, name: 'herp'},
        ]);
        const model1 = list.get('zing123');
        const model2 = list.get(555);
        const model3 = list.get(667);
        expect(get(model1)).toEqual({id: 'zing123', name: 'boof'});
        expect(get(model2)).toEqual({id: 555, name: 'herp'});
        expect(model3).toBeUndefined();
    });

    it('removes models', () => {
        const list = type.create([
            {id: 1},
            {id: 2},
        ]);
        const model2 = list.get(2);
        expect(get(model2)).toEqual({id: 2});
        expect(get(list).map(get)).toEqual([{id: 1}, {id: 2}]);
        const rem1 = list.remove(1);
        expect(rem1).toEqual({id: 1, ref: 0});
        expect(get(list).map(get)).toEqual([{id: 2}]);
        const rem2 = list.remove(model2);
        expect(rem2).toEqual({id: 2, ref: 0});
        expect(get(list).map(get)).toEqual([]);
    });

    it('clears properly', () => {
        const list = type.create([
            {id: 1, name: 'jonesy'},
            {id: 2, name: 'johnny'},
            {id: 3, name: 'jackie'}
        ]);
        // get a ref to the model we're preserving and update it.
        const store = list.get(2);
        store.update((v) => ({...v, name: 'jerry'}));

        // clear all but our preserved model
        list.clear([2]);

        // preserved model should have our update handy
        expect(get(list).map((s) => get(s))).toEqual([{id: 2, name: 'jerry'}]);
        store.update((v) => ({...v, name: 'barry'}));
        expect(get(list).map((s) => get(s))).toEqual([{id: 2, name: 'barry'}]);
    });

    it('sets', () => {
        const list = type.create([
            {id: 888},
            {id: 444},
            {id: 9090},
        ]);
        expect(get(list).map(get)).toEqual([
            {id: 888},
            {id: 444},
            {id: 9090},
        ]);

        list.set([]);
        expect(get(list).map(get)).toEqual([]);

        list.set([
            {id: 777},
            {id: '4343434'},
            {id: 'abc123'},
        ]);
        expect(get(list).map(get)).toEqual([
            {id: 777},
            {id: '4343434'},
            {id: 'abc123'},
        ]);
    });

    it('updates', () => {
        const list = type.create([
            {id: 888},
            {id: 444},
            {id: 9090},
        ]);
        expect(get(list).map(get)).toEqual([
            {id: 888},
            {id: 444},
            {id: 9090},
        ]);
        list.update((vals) => {
            return [
                ...vals.map((entry) => {
                    return {
                        ...entry,
                        id: entry.id < 1000 ? entry.id + 1000 : entry.id,
                        u: entry.id < 1000,
                    };
                }),
            ];
        });
        expect(get(list).map(get)).toEqual([
            {id: 1888, u: true},
            {id: 1444, u: true},
            {id: 9090, u: false},
        ]);
    });

    it('counts models like better than a first grader', () => {
        const list = type.create([
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
        ]);
        expect(list.len()).toEqual(4);
        list.clear();
        expect(list.len()).toEqual(0);
        list.add({id: 'ZING'});
        expect(list.len()).toEqual(1);
    });

    it('finds indexed children by id', () => {
        const list1 = type.create([]);
        const list2 = type.create([]);
        const list3 = type.create([]);

        const find1 = type.find_child(1);
        expect(find1).toBeUndefined();
        list1.add({id: 1, name: 'larry'});

        const find2 = type.find_child(1);
        const find3 = type.find_child(2);
        expect(find2.ref).toBe(1);
        expect(get(find2.store)).toEqual({id: 1, name: 'larry'});
        expect(find3).toBeUndefined();

        list2.add({id: 1, name: 'samantha'});
        const find4 = type.find_child(1);
        expect(find4.ref).toBe(2);
        expect(get(find4.store)).toEqual({id: 1, name: 'samantha'});

        list3.add([
            {id: '333', name: 'fuhfuh'},
            {id: 1, name: 'gerwin'},
        ]);
        const find5 = type.find_child(1);
        const find6 = type.find_child('333');
        expect(find5.ref).toBe(3);
        expect(get(find5.store)).toEqual({id: 1, name: 'gerwin'});
        expect(find6.ref).toBe(1);
        expect(get(find6.store)).toEqual({id: '333', name: 'fuhfuh'});

        list1.remove(1);
        const find7 = type.find_child(1);
        expect(find7.ref).toBe(2);
        expect(get(find7.store)).toEqual({id: 1, name: 'gerwin'});

        list1.remove(1);
        const find8 = type.find_child(1);
        expect(find8.ref).toBe(2);
        expect(get(find8.store)).toEqual({id: 1, name: 'gerwin'});

        list2.remove(1);
        const find9 = type.find_child(1);
        expect(find9.ref).toBe(1);
        expect(get(find9.store)).toEqual({id: 1, name: 'gerwin'});

        list3.remove(1);
        const find10 = type.find_child(1);
        expect(find10).toBeUndefined();
    });

    it('preserves existing models when calling add()', () => {
        const list = type.create([]);
        list.add({id: '123', name: 'pills'});
        const model = list.get('123');
        expect(get(model).name).toBe('pills');
        list.add([
            {id: '1313', name: 'jerry'},
            {id: '123', name: 'barry'},
        ]);
        expect(get(list).map(get)).toEqual([
            {id: '123', name: 'barry'},
            {id: '1313', name: 'jerry'},
        ]);
    });

    it('preserves existing models when calling set()', () => {
        const list = type.create([{id: 2, name: 'barry'}], {skip_update: true});
        list.set([
            {id: 1, name: 'jerry'},
            {id: 2, name: 'larry'},
        ]);
        const existing = list.get(2);
        expect(get(existing).name).toBe('barry');
    });

    it('preserves models across multiple lists', () => {
        const list1 = type.create([
            {id: 1, name: 'sandra'},
            {id: 2, name: 'sammy'},
        ]);
        const model1 = list1.get(1);
        const model2 = list1.get(2);
        expect(get(model1).name).toBe('sandra');
        expect(get(model2).name).toBe('sammy');

        const list2 = type.create([
            {id: 1, name: 'slappy'},
            {id: 3, name: 'sloopy'},    // hang on
        ]);
        const model2_1 = list2.get(1);
        const model3 = list2.get(3);
        expect(model1 === model2_1).toBe(true);
        expect(get(model1).name).toBe('slappy');
        expect(get(model2).name).toBe('sammy');
        expect(get(model3).name).toBe('sloopy');

        const _list3 = type.create([
            {id: 1, name: 'slappy'},
            {id: 3, name: 'swampy'},
        ], {skip_update: true});
        expect(get(model1).name).toBe('slappy');
        expect(get(model2).name).toBe('sammy');
        expect(get(model3).name).toBe('sloopy');
    });

    it('garbage collects models when they are removed', () => {
        const list1 = type.create([
            {id: 1, name: 'slappy'},
        ]);
        const find1 = type.find_child(1);
        expect(find1.ref).toBe(1);
        expect(get(find1.store)).toEqual({id: 1, name: 'slappy'});
        const list2 = type.create([
            {id: 1, name: 'slappy'},
        ]);
        const model1 = list1.get(1);
        const model2 = list2.get(1);
        expect(model1 === model2).toBe(true);

        const rem1 = list1.remove(model1);
        const rem1_2 = list1.remove(model1);
        const rem2 = list2.remove(model2);
        const rem2_2 = list2.remove(model2);
        expect(rem1).toEqual({id: 1, ref: 1});
        expect(rem1_2).toBe(false);
        expect(rem2).toEqual({id: 1, ref: 0});
        expect(rem2_2).toBe(false);
    });

    it('triggers a subscription when a child does', () => {
        const list = type.create([
            {id: 6969},
        ]);
        const model = list.get(6969);
        expect(get(model)).toEqual({id: 6969});

        const observed = [];
        list.subscribe((v) => observed.push(v.map(get)));

        model.update((m) => ({...m, id: 6777, name: 'jack'}));
        expect(observed.length).toBe(2);
        expect(observed[0]).toEqual([{id: 6969}]);
        expect(observed[1]).toEqual([{id: 6777, name: 'jack'}]);
    });

    it('tracks changes in model id', () => {
        const list = type.create([
            {id: 123},
            {id: 444},
        ]);
        const model1 = list.get(123);
        const model2 = list.get(444);
        expect(type.find_child(123).store === model1).toBe(true);
        expect(type.find_child(444).store === model2).toBe(true);

        model1.update((m) => ({...m, id: 42}));
        expect(type.find_child(123)).toBeUndefined();
        expect(type.find_child(42).store === model1).toBe(true);
        expect(type.find_child(444).store === model2).toBe(true);

        expect(list.get(123)).toBeUndefined();
        expect(list.get(42)).toBeDefined();
        expect(list.get(444)).toBeDefined();
    });
});

