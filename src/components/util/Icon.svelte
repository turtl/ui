<script>
    export let name = '';
    let klass = '';
    export { klass as class };

    const icons = {
        arrow: '&#xE801;',
        arrow_min: '&#xE809;',
        bookmark: '&#xE805;',
        bullhorn: '&#xE807;',
        eye: '&#xE813;',
        folder: '&#xE814;',
        gear: '&#xE80F;',
        hamburger: '&#xF0C9;',
        history: '&#xE80E;',
        lock: '&#xE80B;',
        magnify: '&#xE810;',
        page: '&#xE806;',
        paper_airplane: '&#xE80D;',
        paperclip: '&#xE803;',
        pencil: '&#xE812;',
        photo: '&#xE804;',
        plus: '&#xE800;',
        tag: '&#xE808;',
        tripledot: '&#xE802;',
        unlock: '&#xE80C;',
        user_add: '&#xE811;',
        wifi: '&#xE80A;',
    };
    const icon = icons[name] || '[bad icon]';
</script>

<icon class="{klass}">
    <slot icon={icon}>
        {@html icon} <!-- eslint-disable-line -->
    </slot>
</icon>
