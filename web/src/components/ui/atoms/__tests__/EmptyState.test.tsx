import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
    it('should render the message', () => {
        render(<EmptyState message="No results found" />);

        expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('should render with custom message', () => {
        const customMessage = 'Your search returned no results';
        render(<EmptyState message={ customMessage } />);

        expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should apply correct styles', () => {
        const { container } = render(<EmptyState message="Test" />);
        const box = container.firstChild;

        expect(box).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
    });

    it('should render Typography with correct variant', () => {
        render(<EmptyState message="Test message" />);
        const typography = screen.getByText('Test message');

        expect(typography).toHaveClass('MuiTypography-body2');
    });
});