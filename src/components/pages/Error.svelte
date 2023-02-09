<script>
	export let text;
    export let title;
    import { set_meta } from '@/models/pages';
    import { loc } from '@/util/i18n';

    set_meta(loc('error'), {
        header: {
            title,
            menu: [
            ],
        },
    });
</script>

<content>
    <p class="text-error">
        {text}
    </p>
</content>
