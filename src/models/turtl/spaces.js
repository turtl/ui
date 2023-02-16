import { get, writable } from 'svelte/store';
import * as listview from '../listview';
import user from './user';

export function Space(data) {
    const model = writable(data);
    model.id = () => get(model).id;
    model.get_color = () => {
        var color = get(model).color;
        if(!color) {
            const available_colors = [
                '666666',
                'b57316',
                '8059ad',
                '76dec2',
                'c32727',
                'de88de',
                '8ea8e0',
                'e4ba58',
                'bb1664',
                'bbbb44',
                '1f9016',
            ];
            const id = model.id();
            var num = 0;
            for(var i = 0; i < (id.length / 2); i++) {
                num += parseInt(id.substr(i * 2, 2), 16);
            }
            color = '#'+available_colors[num % available_colors.length];
        }

        var cr = parseInt(color.substr(1, 2), 16);
        var cg = parseInt(color.substr(3, 2), 16);
        var cb = parseInt(color.substr(5, 2), 16);
        var avg = (cr + cg + cb) / 3;
        var txt_shade = avg < 140 ? 'light' : 'dark';
        return {bg: color, shade: txt_shade};
    };
    return model;
}

const spaces_type = listview.type({
    create_child: Space,
});
const spaces = spaces_type.create();

spaces.get_active = () => {
    let space = spaces.find((s) => s.active === true);
    if(!space) {
        const default_space = ((user.data() || {}).settings || {}).default_space;
        space = spaces.find((s) => s.id === default_space);
    }
    if(!space) {
        space = get(spaces)[0];
    }
    return space;
};

spaces.set_active = (id) => {
    spaces.update((list) => [
        ...list.map((s) => {
            return {
                ...s,
                active: s.id === id,
            };
        }),
    ]);
};

export default spaces;

