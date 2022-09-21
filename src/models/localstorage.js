export async function set(key, value) {
    window.localStorage[key] = JSON.stringify(value);
}

export async function get(key) {
    const ser = window.localStorage[key];
    try {
        return JSON.parse(ser);
    } catch(_) {
        return undefined;
    }
}

