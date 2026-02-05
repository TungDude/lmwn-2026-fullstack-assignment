import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuideList from '../GuideList';
import { createGuideDetail } from '@shared/packages/tests';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('GuideList', () => {
    const mockGuides = [
        createGuideDetail({ id: '1', title: 'Guide 1', tags: ['Thai', 'Street Food'] }),
        createGuideDetail({ id: '2', title: 'Guide 2', tags: ['Japanese'] }),
    ];

    describe('rendering', () => {
        it('should render guide items', () => {
            render(<GuideList guides={mockGuides} />);

            expect(screen.getByText('Guide 1')).toBeInTheDocument();
            expect(screen.getByText('Guide 2')).toBeInTheDocument();
        });

        it('should show loading skeletons when loading', () => {
            render(<GuideList guides={[]} isLoading={true} />);

            expect(screen.queryByText('Guide 1')).not.toBeInTheDocument();
        });

        it('should show empty state when no guides', () => {
            render(<GuideList guides={[]} />);

            expect(screen.getByText('emptyGuide')).toBeInTheDocument();
        });
    });

    describe('interactions', () => {
        it('should call onGuideClick when guide is clicked', async () => {
            const user = userEvent.setup();
            const mockOnGuideClick = vi.fn();

            render(<GuideList guides={mockGuides} onGuideClick={mockOnGuideClick} />);

            const guide = screen.getAllByTestId('guide-container')[0];
            await user.click(guide);

            expect(mockOnGuideClick).toHaveBeenCalledWith('1');
        });
    });
});