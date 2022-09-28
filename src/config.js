const config = {
    log: {
        default_level: 'warn',
    },
    core: {
        // if true, we don't load or initialize the core at all, but rather
        // implement a number of mocked calls within the UI that allow for dev
        // without needing the core
        mock: true,
    },
};
export default config;

