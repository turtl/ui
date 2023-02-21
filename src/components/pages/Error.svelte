<script>
    import { getContext } from 'svelte';
    import { set_meta } from '@/models/pages';
    import { t } from '@/util/i18n';

	export let text;
    export let title;

    const page_id = getContext('page_id');

    set_meta(page_id, t('common.error'), {
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
