export default function Event() {
    const store = {};

    const on = (evname, fn) => {
        if(!store[evname]) store[evname] = [];
        store[evname].push(fn);
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

    let running = false;
    let queue = [];
    const run_queue = () => {
        const [evname, args] = queue.shift();
        const handlers = (store[evname] || []).slice();
        handlers.forEach((fn) => fn(...args));
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
        off,
        emit,
    };
};

