import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterButton from '../FilterButton';

describe('FilterButton', () => {
    const mockOnFilterClick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('should render without label', () => {
            render(<FilterButton onFilterClick={mockOnFilterClick} />);

            const filterButton = screen.getByTestId('filter-button');
            expect(filterButton).toBeInTheDocument();
            expect(filterButton.querySelector('svg')).toBeInTheDocument();
        });

        it('should render with label', () => {
            render(<FilterButton label="Filters" onFilterClick={mockOnFilterClick} />);

            expect(screen.getByTestId('filter-button-label')).toHaveTextContent('Filters');
        });
    });

    describe('click behavior', () => {
        it('should call onFilterClick when clicked', async () => {
            const user = userEvent.setup();
            render(<FilterButton onFilterClick={mockOnFilterClick} />);

            await user.click(screen.getByRole('button'));

            expect(mockOnFilterClick).toHaveBeenCalledTimes(1);
        });

        it('should pass event to onFilterClick', async () => {
            const user = userEvent.setup();
            render(<FilterButton onFilterClick={mockOnFilterClick} />);

            await user.click(screen.getByRole('button'));

            expect(mockOnFilterClick).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'click'
                })
            );
        });
    });

    describe('visual states', () => {
        it('should apply default styles when no filters active', () => {
            render(
                <FilterButton
                    onFilterClick={mockOnFilterClick}
                    hasActiveFilters={false}
                    isFilterMenuOpen={false}
                />
            );

            const filterButton = screen.getByTestId('filter-button');
            expect(filterButton).toHaveStyle({ borderColor: '#ccc' });
            expect(filterButton).toHaveStyle({ backgroundColor: 'transparent' });
        });

        it('should apply active styles when filters are active', () => {
            render(
                <FilterButton
                    label="Filters"
                    onFilterClick={mockOnFilterClick}
                    hasActiveFilters={true}
                />
            );

            const typography = screen.getByTestId('filter-button-label');
            expect(typography).toHaveStyle({ fontWeight: 500 });
        });

        it('should apply open styles when menu is open', () => {
            render(
                <FilterButton
                    label="Filters"
                    onFilterClick={mockOnFilterClick}
                    isFilterMenuOpen={true}
                />
            );

            const typography = screen.getByTestId('filter-button-label');
            expect(typography).toHaveStyle({ fontWeight: 500 });
        });

        it('should prioritize open state over active state', () => {
            render(
                <FilterButton
                    label="Filters"
                    onFilterClick={mockOnFilterClick}
                    hasActiveFilters={true}
                    isFilterMenuOpen={true}
                />
            );

            // Open state should take precedence
            const filterButton = screen.getByTestId('filter-button');
            expect(filterButton).toBeInTheDocument();
        });
    });

    describe('icon rendering', () => {
        it('should render icon without margin when no label', () => {
            render(
                <FilterButton onFilterClick={mockOnFilterClick} />
            );

            const icon = screen.getByTestId('filter-button').querySelector('svg');
            expect(icon).toHaveStyle({ marginRight: '0px' });
        });

        it('should render icon with margin when label present', () => {
            render(
                <FilterButton label="Filters" onFilterClick={mockOnFilterClick} />
            );

            const icon = screen.getByTestId('filter-button').querySelector('svg');
            expect(icon).toHaveStyle({ marginRight: '8px' });
        });

        it('should show filled icon when filters active', () => {
            render(
                <FilterButton
                    onFilterClick={mockOnFilterClick}
                    hasActiveFilters={true}
                />
            );

            const icon = screen.getByTestId('filter-button').querySelector('svg');
            expect(icon).toHaveAttribute('fill', '#7bf1a8');
        });
    });
});