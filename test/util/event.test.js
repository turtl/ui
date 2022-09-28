"use strict";

import Emitter from '../../src/util/event';

describe('util/event', () => {
    it('creates emitters', () => {
        const ev = Emitter();
        expect(ev.on instanceof Function).toEqual(true);
        expect(ev.off instanceof Function).toEqual(true);
        expect(ev.emit instanceof Function).toEqual(true);
    });

    it('triggers events synchronously', () => {
        const ev = Emitter();
        let count_poop = 0;
        let count_shart = 0;
        ev.on('poop', () => count_poop++);
        ev.on('shart', () => count_shart++);
        ev.emit('poop');
        ev.emit('poop');
        ev.emit('shart');
        ev.emit('poop');
        expect(count_poop).toEqual(3);
        expect(count_shart).toEqual(1);
    });

    it('passes args to handlers', () => {
        const ev = Emitter();
        let args = null;
        ev.on('hello', (...argz) => { args = argz; });
        expect(args).toEqual(null);
        ev.emit('hello', 'get', 'a', 'job');
        expect(args).toEqual(['get', 'a', 'job']);
    });

    it('calls events in order', () => {
        const ev = Emitter();

        let order = [];
        ev.on('bark', () => {
            order.push('bark');
            ev.emit('quack');
        });
        ev.on('bark', () => {
            order.push('bark2');
        });
        ev.on('quack', () => {
            order.push('quack');
        });

        ev.emit('bark');

        expect(order).toEqual(['bark', 'bark2', 'quack']);
    });

    it('unbinds events in order', () => {
        const ev = Emitter();

        let count = 0;
        const handler = () => {
            count++;
            ev.off('hello', handler);
        };
        ev.on('hello', handler);
        ev.on('hello', handler);
        ev.emit('hello');
        expect(count).toEqual(2);
        ev.emit('hello');
        expect(count).toEqual(2);
    });

    it('silently unbinds nonexistent events', () => {
        const ev = Emitter();
        ev.off('test', () => {});
    });

    it('creates distinct states for different emitters', () => {
        const ev1 = Emitter();
        const ev2 = Emitter();

        let hi_1 = 0;
        let hi_2 = 0;

        ev1.on('hello', () => { hi_1++; });
        ev2.on('hello', () => { hi_2++; });

        expect(hi_1).toEqual(0);
        expect(hi_2).toEqual(0);
        ev1.emit('hello');
        expect(hi_1).toEqual(1);
        expect(hi_2).toEqual(0);
        ev2.emit('hello');
        expect(hi_1).toEqual(1);
        expect(hi_2).toEqual(1);
    });

    it('allows binding', () => {
        const ev1 = Emitter();
        const ev2 = Emitter();
        let called = null;
        ev2.on('goodbye', (val) => { called = val; });  // VALLEY GO HOME
        ev1.on('hello', ev2.emit.bind(ev2, 'goodbye'));
        expect(called).toEqual(null);
        ev1.emit('hello', 5);
        expect(called).toEqual(5);
    });
});

