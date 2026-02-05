import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import BackButton from '../BackButton';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key === 'backButton.label' ? 'Back' : key,
    }),
}));

describe('BackButton', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render back button with label', () => {
        render(
            <BrowserRouter>
                <BackButton />
            </BrowserRouter>
        );

        const backButton = screen.getByTestId('back-button');
        const backButtonLabel = screen.getByTestId('back-button-label');
        expect(backButton).toBeInTheDocument();
        expect(backButtonLabel).toBeInTheDocument();
        expect(backButtonLabel).toHaveTextContent('Back');
    });

    it('should navigate back when clicked', async () => {
        const user = userEvent.setup();
        render(
            <BrowserRouter>
                <BackButton />
            </BrowserRouter>
        );

        await user.click(screen.getByTestId('back-button'));

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should render chevron icon', () => {
        render(
            <BrowserRouter>
                <BackButton />
            </BrowserRouter>
        );

        expect(screen.getByTestId('back-button').querySelector('.lucide')).toBeInTheDocument();
    });
});