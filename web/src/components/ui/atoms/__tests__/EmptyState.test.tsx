import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
    it('should render the message', () => {
        render(<EmptyState message="No results found" />);

        const emptyState = screen.getByTestId('empty-state');
        expect(emptyState).toBeInTheDocument();
        expect(emptyState).toHaveTextContent('No results found');
    });

    it('should render with custom message', () => {
        const customMessage = 'Your search returned no results';
        render(<EmptyState message={ customMessage } />);

        const emptyState = screen.getByTestId('empty-state');
        expect(emptyState).toBeInTheDocument();
        expect(emptyState).toHaveTextContent(customMessage);
    });

    it('should apply correct styles', () => {
        render(<EmptyState message="Test" />);
        const box = screen.getByTestId('empty-state');

        expect(box).toHaveStyle({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
    });

    it('should render Typography with correct variant', () => {
        render(<EmptyState message="Test message" />);
        
        const emptyState = screen.getByTestId('empty-state');
        const typography = emptyState.querySelector('p.MuiTypography-body2');
        expect(typography).toHaveClass('MuiTypography-body2');
    });
});