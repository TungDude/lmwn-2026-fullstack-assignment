import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
    it('should render logo', () => {
        render(<Header />);
        const logo = screen.getByTestId('app-logo');
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveAttribute('src', '/lmwn-logo.svg');
    });
});