const mapping = {};

let enabled = true;

// contexts allow interfaces to turn on/off various key bindings based on which
// interface is active. for instance, a page listing notes might bind "a" to add
// a new note, but if the settings page opens over it, we don't want "a" to open
// the note editor anymore (until settings it closed).
let contexts = [];

function handler(e) {
    if(!enabled) return;
    if(!e || !e.key) return;
    // ignore key events on form elements
    if(e.target && e.target.matches('input, select, textarea')) {
        return;
    }
    const key = e.key.toLowerCase();
    const spec = [e.altKey && 'a', e.ctrlKey && 'c', e.metaKey && 'm', e.shiftKey && 's', key]
        .filter((k) => !!k)
        .join('-');
    const actions = mapping[spec];
    if(!actions || actions.length === 0) return;
    actions.forEach((a) => a());
}

export function bind() {
    document.addEventListener('keyup', handler);
}

export function unbind() {
    document.removeEventListener('keyup', handler);
}

export function set_enabled(yesno) {
    enabled = !!yesno;
}

export function register(register, context) {
    const reg_copy = {};
    Object.keys(register).forEach((spec) => {
        const fn = register[spec];
        // if we passed a context in, we only want these bindings to run if the
        // context is active, so we add a check here.
        const wrapped_fn = typeof(context) === 'undefined' || context === null ?
            fn :
            (...args) => (current_context() === context) && fn(...args);
        reg_copy[spec] = wrapped_fn;
        if(!mapping[spec]) {
            mapping[spec] = [];
        }
        if(mapping[spec].indexOf(wrapped_fn) < 0) {
            mapping[spec].push(wrapped_fn);
        }
    });
    // return a function that un-does the register
    return () => unregister(reg_copy);
}

export function unregister(register) {
    Object.keys(register).forEach((spec) => {
        if(mapping[spec].indexOf(register[spec])) {
            mapping[spec] = mapping[spec]
                .filter((x) => x !== register[spec]);
        }
        if(mapping[spec].length === 0) {
            delete mapping[spec];
        }
    });
}

export function push_context(context) {
    contexts.push(context);
    return context;
}

export function current_context() {
    return contexts[contexts.length - 1];
}

export function remove_context(context) {
    contexts = contexts.filter((c) => c !== context);
}

