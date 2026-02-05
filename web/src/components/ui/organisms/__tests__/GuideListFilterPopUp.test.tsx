import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuideListFilterPopUp from '../GuideListFilterPopUp';

vi.mock('@/hooks/useResponsive', () => ({
    default: vi.fn(() => ({
        isMobile: false,
        isSmallScreen: false,
        isTablet: false,
        isDesktop: true,
    })),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'guideList:filter.title': 'Filters',
                'guideList:filter.tags': 'Tags',
            };
            return translations[key] || key;
        },
    }),
}));

describe('GuideListFilterPopUp', () => {
    const mockSetOpen = vi.fn();
    const mockOnTagFilterChange = vi.fn();

    const defaultProps = {
        open: true,
        setOpen: mockSetOpen,
        anchorEl: document.createElement('button'),
        selectedTags: ['Thai', 'Japanese'],
        tagFilterOptions: ['Thai', 'Japanese', 'Italian', 'Chinese', 'Mexican'],
        onTagFilterChange: mockOnTagFilterChange,
        isLoading: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('should render when open is true', () => {
            render(<GuideListFilterPopUp {...defaultProps} />);

            const filterPopOver = screen.getByTestId('guide-list-filter-popup-paper');
            expect(filterPopOver).toBeInTheDocument();
        });

        it('should not render when open is false', () => {
            render(<GuideListFilterPopUp {...defaultProps} open={false} />);

            expect(screen.queryByText('Filters')).not.toBeInTheDocument();
        });

        it('should render all tag options', () => {
            render(<GuideListFilterPopUp {...defaultProps} />);

            expect(screen.getByRole('button', { name: 'Thai' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Japanese' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Italian' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Chinese' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Mexican' })).toBeInTheDocument();
        });

        it('should show selected tags as selected', () => {
            render(<GuideListFilterPopUp {...defaultProps} />);

            const thaiButton = screen.getByRole('button', { name: 'Thai' });
            const japaneseButton = screen.getByRole('button', { name: 'Japanese' });
            const italianButton = screen.getByRole('button', { name: 'Italian' });

            expect(thaiButton).toHaveClass('Mui-selected');
            expect(japaneseButton).toHaveClass('Mui-selected');
            expect(italianButton).not.toHaveClass('Mui-selected');
        });
    });

    describe('tag filtering', () => {
        it('should call onTagFilterChange when tag is clicked', async () => {
            const user = userEvent.setup();
            render(<GuideListFilterPopUp {...defaultProps} />);

            const italianButton = screen.getByRole('button', { name: 'Italian' });
            await user.click(italianButton);

            expect(mockOnTagFilterChange).toHaveBeenCalledWith(['Thai', 'Japanese', 'Italian']);
        });

        it('should deselect tag when clicked again', async () => {
            const user = userEvent.setup();
            render(<GuideListFilterPopUp {...defaultProps} />);

            const thaiButton = screen.getByRole('button', { name: 'Thai' });
            await user.click(thaiButton);

            expect(mockOnTagFilterChange).toHaveBeenCalledWith(['Japanese']);
        });

        it('should handle multiple tag selections', async () => {
            const user = userEvent.setup();
            render(
                <GuideListFilterPopUp
                    {...defaultProps}
                    selectedTags={[]}
                />
            );

            const thaiButton = screen.getByRole('button', { name: 'Thai' });
            const italianButton = screen.getByRole('button', { name: 'Italian' });

            await user.click(thaiButton);
            await user.click(italianButton);

            expect(mockOnTagFilterChange).toHaveBeenCalledTimes(2);
        });

        it('should not call onTagFilterChange when not provided', async () => {
            const user = userEvent.setup();
            render(
                <GuideListFilterPopUp
                    {...defaultProps}
                    onTagFilterChange={undefined}
                />
            );

            const thaiButton = screen.getByRole('button', { name: 'Thai' });
            await user.click(thaiButton);

            // Should not throw error
            expect(true).toBe(true);
        });
    });

    describe('loading state', () => {
        it('should disable tag buttons when loading', () => {
            render(<GuideListFilterPopUp {...defaultProps} isLoading={true} />);

            const thaiButton = screen.getByRole('button', { name: 'Thai' });
            const japaneseButton = screen.getByRole('button', { name: 'Japanese' });

            expect(thaiButton).toBeDisabled();
            expect(japaneseButton).toBeDisabled();
        });

        it('should not disable buttons when not loading', () => {
            render(<GuideListFilterPopUp {...defaultProps} isLoading={false} />);

            const thaiButton = screen.getByRole('button', { name: 'Thai' });

            expect(thaiButton).not.toBeDisabled();
        });
    });

    describe('click away behavior', () => {
        it('should call setOpen(false) when clicking outside', async () => {
            const user = userEvent.setup();

            render(
                <div>
                    <GuideListFilterPopUp {...defaultProps} />
                    <button data-testid="outside">Outside</button>
                </div>
            );

            const outsideButton = screen.getByTestId('outside');
            await user.click(outsideButton);

            expect(mockSetOpen).toHaveBeenCalledWith(false);
        });

        it('should not close when clicking inside', async () => {
            const user = userEvent.setup();
            render(<GuideListFilterPopUp {...defaultProps} />);

            const thaiButton = screen.getByRole('button', { name: 'Thai' });
            await user.click(thaiButton);

            expect(mockSetOpen).not.toHaveBeenCalled();
        });
    });

    describe('fallback tag options', () => {
        it('should use selectedTags when tagFilterOptions is empty', () => {
            render(
                <GuideListFilterPopUp
                    {...defaultProps}
                    tagFilterOptions={[]}
                    selectedTags={['Thai', 'Japanese']}
                />
            );

            expect(screen.getByRole('button', { name: 'Thai' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Japanese' })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: 'Italian' })).not.toBeInTheDocument();
        });

        it('should prefer tagFilterOptions over selectedTags', () => {
            render(<GuideListFilterPopUp {...defaultProps} />);

            // Should show all 5 options from tagFilterOptions
            expect(screen.getByRole('button', { name: 'Italian' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Chinese' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Mexican' })).toBeInTheDocument();
        });
    });

    describe('edge cases', () => {
        it('should handle empty selectedTags', () => {
            render(
                <GuideListFilterPopUp
                    {...defaultProps}
                    selectedTags={[]}
                />
            );

            const thaiButton = screen.getByRole('button', { name: 'Thai' });
            expect(thaiButton).not.toHaveClass('Mui-selected');
        });

        it('should handle no tags at all', () => {
            render(
                <GuideListFilterPopUp
                    {...defaultProps}
                    selectedTags={[]}
                    tagFilterOptions={[]}
                />
            );

            const filterPopOver = screen.getByTestId('guide-list-filter-popup-paper');
            expect(filterPopOver).toBeInTheDocument();
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });
});