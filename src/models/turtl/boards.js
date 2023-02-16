import { get, writable } from 'svelte/store';
import * as listview from '../listview';

export function Board(data) {
    const model = writable(data);
    model.id = () => get(model).id;
    return model;
}

const boards_type = listview.type({
    create_child: Board,
});
const boards = boards_type.create();

export default boards;

