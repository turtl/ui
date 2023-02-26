import app_config from '@/config';
import {render, fireEvent, screen} from '@testing-library/svelte'
import Login from '@/components/pages/Login.svelte';

describe('components/pages/Login', () => {
    it('loads proper elements on login page', () => {
        render(Login, {});
        expect(screen.getByRole('textbox', {name: /user\.email/i})).toBeInTheDocument();
        expect(screen.getByLabelText(/user\.passphrase/)).toBeInTheDocument();
        if(app_config.user.enable_remember_me) {
            expect(screen.getByRole('checkbox', {name: /user\.stay_logged_in/i})).toBeInTheDocument();
        }
    });

    it('switches between login/join', () => {
        render(Login, {});
    });
});

