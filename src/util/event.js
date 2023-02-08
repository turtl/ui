export default function Event() {
    const store = {};
    const special_all_event = ':all:';

    const on = (evname, fn) => {
        if(!store[evname]) store[evname] = [];
        store[evname].push(fn);
        // return a function that unbinds
        return () => off(evname, fn);
    };

    const once = (evname, fn) => {
        const unbind = on(evname, (...args) => {
            fn(...args);
            unbind();
        });
        return unbind;
    };

    const off = (evname, fn) => {
        if(!Array.isArray(store[evname])) {
            return;
        }
        store[evname] = store[evname].filter((x) => x !== fn);
        if(store[evname].length === 0) {
            delete store[evname];
        }
    };

    // use a queue so that events run in order of creation. in other words if
    // event B is emitted while event A is taking place, all the handlers for
    // event A will finish before calling handlers for event B.
    let running = false;
    let queue = [];
    const run_queue = () => {
        const [evname, args] = queue.shift();
        const handlers = (store[evname] || []).slice();
        handlers.forEach((fn) => fn(...args));
        const all_handlers = (store[special_all_event] || []).slice();
        all_handlers.forEach((fn) => fn(evname, ...args));
        if(queue.length === 0) return;
        run_queue();
    };

    const emit = (evname, ...args) => {
        queue.push([evname, args]);
        if(running) return;
        running = true;
        run_queue();
        running = false;
    };

    return {
        on,
        once,
        off,
        emit,
        all: special_all_event,
    };
};

