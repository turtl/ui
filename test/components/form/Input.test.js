import {render, fireEvent, screen} from '@testing-library/svelte';
import Input from '@/components/form/Input.svelte';

describe('components/pages/Login', () => {
    it('creates text inputs', () => {
        render(Input, {
            type: 'text',
            name: 'full_name',
            label: 'get a job',
            required: true,
            tabindex: 4,
            class: 'nice-legs',
        });
        expect(screen.getByRole('textbox', {name: /get a job/i})).toBeInTheDocument();
    });
});

