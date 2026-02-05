import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageSwitch } from '../LanguageSwitch';

const mockChangeLanguage = vi.fn();

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: {
            language: 'en',
            changeLanguage: mockChangeLanguage,
        },
    }),
}));

describe('LanguageSwitch', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render language options', () => {
        render(<LanguageSwitch />);

        const thiButton = screen.getByTestId('language-option-th');
        const enButton = screen.getByTestId('language-option-en');
        expect(thiButton).toBeInTheDocument();
        expect(enButton).toBeInTheDocument();
    });

    it('should show current language as selected', () => {
        render(<LanguageSwitch />);

        const enButton = screen.getByTestId('language-option-en');
        expect(enButton).toHaveClass('Mui-selected');
    });

    it('should change language when option clicked', async () => {
        const user = userEvent.setup();
        render(<LanguageSwitch />);

        const thButton = screen.getByTestId('language-option-th');
        await user.click(thButton);

        expect(mockChangeLanguage).toHaveBeenCalledWith('th');
    });
});