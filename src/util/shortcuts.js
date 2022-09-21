const mapping = {};

let enabled = true;

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

export function register(register) {
    Object.keys(register).forEach((spec) => {
        if(!mapping[spec]) {
            mapping[spec] = [];
        }
        if(mapping[spec].indexOf(register[spec]) < 0) {
            mapping[spec].push(register[spec]);
        }
    });
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

