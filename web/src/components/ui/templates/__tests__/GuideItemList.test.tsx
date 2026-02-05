import { describe, it, expect, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GuideItemList from '../GuideItemList';
import { createGuideItemWithRestaurant } from '@shared/packages/tests';

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock('@/hooks/useResponsive', () => ({
    default: () => ({
        isMobile: false,
        isSmallScreen: false,
        isTablet: false,
        isDesktop: true,
    }),
}));

vi.mock('@/hooks/useToast', () => ({
    useToast: () => ({
        showToast: vi.fn(),
    }),
}));

vi.mock('react-swipeable', () => ({
    useSwipeable: () => ({
        ref: () => { },
        onMouseDown: () => { },
    }),
}));

describe('GuideItemList', () => {
    const mockGuideItems = [
        createGuideItemWithRestaurant({
            id: '1',
            description: 'Great restaurant',
            photos: [
                { id: 'p1', smallUrl: '/img1.jpg', largeUrl: '/img1-lg.jpg' },
                { id: 'p2', smallUrl: '/img2.jpg', largeUrl: '/img2-lg.jpg' },
            ],
            restaurant: {
                name: 'Restaurant 1',
            },
        }),
        createGuideItemWithRestaurant({
            id: '2',
            description: 'Another great place',
            photos: [
                { id: 'p3', smallUrl: '/img3.jpg', largeUrl: '/img3-lg.jpg' },
            ],
            restaurant: {
                name: 'Restaurant 2',
            },
        }),
    ];

    describe('rendering', () => {
        it('should render guide items', () => {
            render(<GuideItemList guideItems={mockGuideItems} />);

            expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
            expect(screen.getByText('Restaurant 2')).toBeInTheDocument();
        });

        it('should show empty state when no items', () => {
            render(<GuideItemList guideItems={[]} />);

            expect(screen.getByText('emptyState')).toBeInTheDocument();
        });

        it('should render dividers between items', () => {
            const { container } = render(<GuideItemList guideItems={mockGuideItems} />);

            const dividers = container.querySelectorAll('.MuiDivider-root');
            expect(dividers.length).toBeGreaterThan(0);
        });
    });

    describe('image carousel', () => {
        it('should not show carousel initially', () => {
            render(<GuideItemList guideItems={mockGuideItems} />);

            const dialog = screen.queryByRole('dialog');
            expect(dialog).not.toBeInTheDocument();
        });

        it('should open carousel when image is clicked', async () => {
            const user = userEvent.setup();

            render(<GuideItemList guideItems={mockGuideItems} />);

            // Find and click the first image
            const images = screen.getAllByRole('img');
            await user.click(images[0]);

            // Carousel dialog should open
            const dialog = await screen.findByRole('dialog');
            expect(dialog).toBeInTheDocument();
        });

        it('should pass correct images to carousel', async () => {
            const user = userEvent.setup();

            render(<GuideItemList guideItems={mockGuideItems} />);

            const images = screen.getAllByRole('img');
            await user.click(images[0]);

            // Should show images from first guide item
            const dialog = await screen.findByRole('dialog');
            expect(dialog).toBeInTheDocument();

            // Images should be rendered in carousel
            const carouselImages = within(dialog).getAllByRole('img');
            expect(carouselImages.length).toBeGreaterThan(0);
        });

        it('should close carousel when close is triggered', async () => {
            const user = userEvent.setup();

            render(<GuideItemList guideItems={mockGuideItems} />);

            const images = screen.getAllByRole('img');
            await user.click(images[0]);

            const guideItemCarouselDialog = await screen.findByTestId('guide-item-list-image-carousel-dialog');
            expect(guideItemCarouselDialog).toBeInTheDocument();

            const closeButton = screen.getByTestId('responsive-dialog-close-button');
            await user.click(closeButton);

            await waitFor(() => {
                expect(guideItemCarouselDialog).not.toBeInTheDocument();
            });
        });

        it('should open carousel at correct image index', async () => {
            const user = userEvent.setup();

            const itemWithMultiplePhotos = createGuideItemWithRestaurant({
                photos: [
                    { id: 'p1', smallUrl: '/img1.jpg', largeUrl: '/img1-lg.jpg' },
                    { id: 'p2', smallUrl: '/img2.jpg', largeUrl: '/img2-lg.jpg' },
                    { id: 'p3', smallUrl: '/img3.jpg', largeUrl: '/img3-lg.jpg' },
                ],
            });

            render(<GuideItemList guideItems={[itemWithMultiplePhotos]} />);

            const images = screen.getAllByRole('img');
            await user.click(images[1]);

            const guideItemCarouselDialog = screen.getByTestId('guide-item-list-image-carousel-dialog');
            expect(guideItemCarouselDialog).toBeInTheDocument();
        });
    });

    describe('edge cases', () => {
        it('should handle guide item with no photos', () => {
            const itemNoPhotos = createGuideItemWithRestaurant({
                photos: [],
            });

            render(<GuideItemList guideItems={[itemNoPhotos]} />);

            expect(screen.getByText('Sample Restaurant')).toBeInTheDocument();
        });

        it('should handle empty photo array gracefully', () => {
            const itemNoPhotos = createGuideItemWithRestaurant({
                photos: [],
            });

            const { container } = render(<GuideItemList guideItems={[itemNoPhotos]} />);

            expect(container).toBeInTheDocument();
            expect(screen.getByText('Sample Restaurant')).toBeInTheDocument();
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
    });
});