import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuideHero from '../GuideHero';
import { createGuideDetail } from '@shared/packages/tests';

describe('GuideHero', () => {
    const mockGuide = createGuideDetail({
        id: 'guide-1',
        title: 'Best Restaurants in Bangkok',
        description: 'This is a very long description that exceeds the maximum length and should be truncated or handled appropriately based on the description type settings. It contains detailed information about various restaurants.',
        shortDescription: 'A curated list of the best restaurants in Bangkok. This review is more than 100 characters long but not more than 200 characters',
        writeDate: '2024-01-15T10:30:00Z',
        coverPhoto: {
            id: 'photo-1',
            largeUrl: '/cover-large.jpg',
            smallUrl: '/cover-small.jpg',
        },
    });

    describe('rendering', () => {
        it('should render guide title', () => {
            render(<GuideHero guide={mockGuide} />);

            expect(screen.getByTestId('guide-title')).toHaveTextContent('Best Restaurants in Bangkok');
        });

        it('should render formatted date', () => {
            render(<GuideHero guide={mockGuide} />);

            const dateElement = screen.getByTestId('guide-write-date');
            expect(dateElement).toBeInTheDocument();
            expect(dateElement).not.toHaveTextContent(mockGuide.writeDate); // formatted
        });

        it('should render cover image', () => {
            render(<GuideHero guide={mockGuide} />);

            const image = screen.getByTestId('guide-cover-image');
            expect(image).toBeInTheDocument();
            expect(image).toHaveAttribute('src', '/cover-large.jpg');
            expect(image).toHaveAttribute('alt', 'Best Restaurants in Bangkok');
        });

        it('should render header when provided', () => {
            render(
                <GuideHero
                    guide={mockGuide}
                    header={<div>Custom Header</div>}
                />
            );

            expect(screen.getByTestId('guide-header')).toBeInTheDocument();
            expect(screen.getByText('Custom Header')).toBeInTheDocument();
        });

        it('should render footer when provided', () => {
            render(
                <GuideHero
                    guide={mockGuide}
                    footer={<div>Custom Footer</div>}
                />
            );

            expect(screen.getByTestId('guide-footer')).toBeInTheDocument();
            expect(screen.getByText('Custom Footer')).toBeInTheDocument();
        });
    });

    describe('description rendering', () => {
        it('should show short description when descriptionType is "short"', () => {
            render(
                <GuideHero
                    guide={mockGuide}
                    descriptionType="short"
                />
            );

            const description = screen.getByTestId('guide-description-static');
            expect(description).toBeInTheDocument();
            expect(description).toHaveTextContent(mockGuide.shortDescription);
            expect(description).not.toHaveTextContent(/very long description/i);
        });

        it('should show full description when descriptionType is "full"', () => {
            render(
                <GuideHero
                    guide={mockGuide}
                    descriptionType="full"
                />
            );

            expect(screen.getByText(/This is a very long description/i)).toBeInTheDocument();
        });

        it('should use short description in auto mode when available and long description is too long', () => {
            render(
                <GuideHero
                    guide={mockGuide}
                    descriptionType="auto"
                />
            );

            const description = screen.getByTestId('guide-description-static');
            expect(description).toBeInTheDocument();
            expect(description).toHaveTextContent(mockGuide.shortDescription);
        });

        it('should show full description in auto mode when it is short enough', () => {
            const shortGuide = createGuideDetail({
                description: 'Short description under max length',
                shortDescription: 'Even shorter',
            });

            render(
                <GuideHero
                    guide={shortGuide}
                    descriptionType="auto"
                />
            );

            expect(screen.getByText('Short description under max length')).toBeInTheDocument();
        });

        it('should truncate description in auto mode when short description is too short', () => {
            const guideWithShortDesc = createGuideDetail({
                description: 'This is a very long description that exceeds the maximum length and should be truncated or handled appropriately based on the description type settings.',
                shortDescription: 'Too short', // Less than MIN_DESCRIPTION_LENGTH
            });

            render(
                <GuideHero
                    guide={guideWithShortDesc}
                    descriptionType="auto"
                />
            );

            const description = screen.getByTestId('guide-description-static');
            expect(description).toBeInTheDocument();
            expect(description).toHaveTextContent(/This is a very long description/i);
        });
    });

    describe('expandable description', () => {
        it('should render ExpandableText when expandableDescription is true', () => {
            render(
                <GuideHero
                    guide={mockGuide}
                    expandableDescription={true}
                />
            );

            const expandableText = screen.getByTestId('guide-description-expandable');
            expect(expandableText).toBeInTheDocument();
        });

        it('should render static text when expandableDescription is false', () => {
            render(
                <GuideHero
                    guide={mockGuide}
                    expandableDescription={false}
                />
            );

            // Should not have expand button
            expect(screen.queryByRole('button', { name: /show more/i })).not.toBeInTheDocument();
        });
    });

    describe('click interactions', () => {
        it('should call onGuideClick when guide is clicked', async () => {
            const user = userEvent.setup();
            const mockOnGuideClick = vi.fn();

            render(
                <GuideHero
                    guide={mockGuide}
                    onGuideClick={mockOnGuideClick}
                />
            );

            const container = screen.getByTestId('guide-container');
            await user.click(container);

            expect(mockOnGuideClick).toHaveBeenCalledWith('guide-1');
        });

        it('should show pointer cursor when onGuideClick is provided', () => {
            render(
                <GuideHero
                    guide={mockGuide}
                    onGuideClick={vi.fn()}
                />
            );

            const container = screen.getByTestId('guide-container');
            expect(container).toHaveStyle({ cursor: 'pointer' });
        });

        it('should show default cursor when onGuideClick is not provided', () => {
            render(<GuideHero guide={mockGuide} />);

            const container = screen.getByTestId('guide-container');
            expect(container).toHaveStyle({ cursor: 'default' });
        });
    });

    describe('edge cases', () => {
        it('should handle guide with equal description lengths', () => {
            const guide = createGuideDetail({
                description: 'Same description',
                shortDescription: 'Same description',
            });

            render(<GuideHero guide={guide} />);

            expect(screen.getByText('Same description')).toBeInTheDocument();
        });

        it('should handle empty descriptions gracefully', () => {
            const guideNoDesc = createGuideDetail({
                description: '',
                shortDescription: '',
            });

            const { container } = render(<GuideHero guide={guideNoDesc} />);

            // Should render without crashing, description will be empty
            expect(container).toBeInTheDocument();
        });
    });
});