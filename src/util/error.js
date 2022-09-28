export function procerr(err) {
    return (err && err.message) || ((err && err.err) ? JSON.stringify(err) : err);
}

