import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Searchbar from '../SearchBar';

vi.mock('@/hooks/useSearchHistory', () => ({
    useSearchHistory: () => ({
        addToHistory: vi.fn(),
        filterHistory: vi.fn((query) => {
            const history = ['react hooks', 'react query', 'javascript'];
            return query
                ? history.filter(item => item.toLowerCase().includes(query.toLowerCase()))
                : history;
        }),
        clearHistory: vi.fn(),
        searchHistory: ['react hooks', 'react query', 'javascript'],
    }),
}));

describe('Searchbar', () => {
    const mockOnSearch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('should render with placeholder', () => {
            render(
                <Searchbar
                    value=""
                    onSearch={mockOnSearch}
                    placeholder="Search guides..."
                />
            );

            const searchBarContainer = screen.getByTestId('searchbar-container');
            const searchBarInput = screen.getByTestId('searchbar-input');
            expect(searchBarContainer).toBeInTheDocument();
            expect(searchBarInput).toBeInTheDocument();
            expect(searchBarInput).toHaveAttribute('placeholder', 'Search guides...');
        });

        it('should render with initial value', () => {
            render(
                <Searchbar
                    value="test query"
                    onSearch={mockOnSearch}
                />
            );

            const searchBarInput = screen.getByTestId('searchbar-input');
            expect(searchBarInput).toBeInTheDocument();
            expect(searchBarInput).toHaveValue('test query');
        });

        it('should render disabled state', () => {
            render(
                <Searchbar
                    value=""
                    onSearch={mockOnSearch}
                    disabled={true}
                />
            );

            const searchBarInput = screen.getByTestId('searchbar-input');
            expect(searchBarInput).toBeDisabled();
        });
    });

    describe('user input', () => {
        it('should update internal value on type', async () => {
            const user = userEvent.setup();
            render(<Searchbar value="" onSearch={mockOnSearch} />);

            const searchBarInput = screen.getByTestId('searchbar-input');
            await user.type(searchBarInput, 'new search');

            expect(searchBarInput).toHaveValue('new search');
        });

        it('should call onSearch when Enter is pressed', async () => {
            const user = userEvent.setup();
            render(<Searchbar value="" onSearch={mockOnSearch} />);

            const searchBarInput = screen.getByTestId('searchbar-input');
            await user.type(searchBarInput, 'test query{Enter}');

            expect(mockOnSearch).toHaveBeenCalledWith('test query');
        });

        it('should not call onSearch on other keys', async () => {
            const user = userEvent.setup();
            render(<Searchbar value="" onSearch={mockOnSearch} />);

            const searchBarInput = screen.getByTestId('searchbar-input');
            await user.type(searchBarInput, 'test');

            expect(mockOnSearch).not.toHaveBeenCalled();
        });
    });

    describe('search history', () => {
        it('should show history on focus when available', async () => {
            const user = userEvent.setup();
            render(<Searchbar value="" onSearch={mockOnSearch} />);

            const searchBarInput = screen.getByTestId('searchbar-input');
            
            await user.click(searchBarInput);

            expect(searchBarInput).toHaveFocus();

            await waitFor(() => {
                const dropdown = screen.queryByTestId('searchbar-history-dropdown');
                expect(dropdown).toBeInTheDocument();
                expect(dropdown).toBeVisible();
            });

            expect(screen.getByText('react hooks')).toBeInTheDocument();
            expect(screen.getByText('react query')).toBeInTheDocument();
        });

        it('should filter history based on input', async () => {
            const user = userEvent.setup();
            render(<Searchbar value="" onSearch={mockOnSearch} />);

            const searchBarInput = screen.getByTestId('searchbar-input');
            await user.click(searchBarInput);
            await user.type(searchBarInput, 'react');

            await waitFor(() => {
                expect(screen.getByText('react hooks')).toBeInTheDocument();
                expect(screen.getByText('react query')).toBeInTheDocument();
                expect(screen.queryByText('javascript')).not.toBeInTheDocument();
            });
        });

        it('should call onSearch when history item is clicked', async () => {
            const user = userEvent.setup();
            render(<Searchbar value="" onSearch={mockOnSearch} />);

            const searchBarInput = screen.getByTestId('searchbar-input');
            await user.click(searchBarInput);

            await waitFor(() => {
                expect(screen.getByText('react hooks')).toBeInTheDocument();
            });

            await user.click(screen.getByText('react hooks'));

            expect(mockOnSearch).toHaveBeenCalledWith('react hooks');
        });

        it('should hide history on click away', async () => {
            const user = userEvent.setup();
            
            render(
                <div>
                    <Searchbar value="" onSearch={mockOnSearch} />
                    <button data-testid="outside-button">Outside</button>
                </div>
            );

            const searchBarInput = screen.getByTestId('searchbar-input');
            
            // Focus the input to show history
            searchBarInput.focus();

            // Wait for history to appear
            await waitFor(() => {
                expect(screen.getByTestId('searchbar-history-dropdown')).toBeInTheDocument();
            });

            // Verify history items are visible
            expect(screen.getByText('react hooks')).toBeInTheDocument();

            // Click outside
            const outsideButton = screen.getByTestId('outside-button');
            await user.click(outsideButton);

            // Wait for history to disappear
            await waitFor(() => {
                expect(screen.queryByTestId('searchbar-history-dropdown')).not.toBeInTheDocument();
            });
        });
    });

    describe('value synchronization', () => {
        it('should update internal value when prop value changes', () => {
            const { rerender } = render(
                <Searchbar value="initial" onSearch={mockOnSearch} />
            );

            expect(screen.getByDisplayValue('initial')).toBeInTheDocument();

            rerender(<Searchbar value="updated" onSearch={mockOnSearch} />);

            expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
        });
    });
});