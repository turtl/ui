import "./css/app.scss";
import App from "./App.svelte";
import user from './models/turtl/user';
import spaces from './models/turtl/spaces';
import pages from './models/turtl/pages';
import invites from './models/turtl/invites';

// give us a window into the app
window.turtl = { user, spaces, pages, invites };

const app = new App({
    target: document.getElementById("app"),
});

export default app;

