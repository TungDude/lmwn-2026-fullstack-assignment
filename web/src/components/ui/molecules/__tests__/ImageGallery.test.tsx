import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageGallery, { Image } from '../ImageGallery';

vi.mock('@/hooks/useResponsive', () => ({
    default: () => ({ isMobile: false }),
}));

describe('ImageGallery', () => {
    const mockImages: Image[] = [
        { id: '1', smallUrl: '/img1.jpg', largeUrl: '/img1-large.jpg' },
        { id: '2', smallUrl: '/img2.jpg', largeUrl: '/img2-large.jpg' },
        { id: '3', smallUrl: '/img3.jpg', largeUrl: '/img3-large.jpg' },
    ];

    describe('rendering', () => {
        it('should render all images', () => {
            render(<ImageGallery images={mockImages} />);

            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(3);
        });

        it('should limit columns based on maxColumns', () => {
            const manyImages = new Array(10).fill(null).map((_, i) => ({
                id: String(i),
                smallUrl: `/img${i}.jpg`,
                largeUrl: `/img${i}-large.jpg`,
            }));

            render(<ImageGallery images={manyImages} maxColumns={4} />);

            const images = screen.getAllByRole('img');
            expect(images).toHaveLength(4);
        });

        it('should show remaining count overlay', () => {
            const manyImages = new Array(10).fill(null).map((_, i) => ({
                id: String(i),
                smallUrl: `/img${i}.jpg`,
                largeUrl: `/img${i}-large.jpg`,
            }));

            render(<ImageGallery images={manyImages} maxColumns={4} />);

            const imageGalleryOverlay = screen.getByTestId('image-gallery-overlay');
            expect(imageGalleryOverlay).toBeInTheDocument();
            expect(imageGalleryOverlay).toHaveTextContent('+6');
        });

        it('should not show overlay when all images fit', () => {
            render(<ImageGallery images={mockImages} maxColumns={4} />);

            expect(screen.queryByTestId('image-gallery-overlay')).not.toBeInTheDocument();
        });
    });

    describe('interactions', () => {
        it('should call onImageClick when image is clicked', async () => {
            const user = userEvent.setup();
            const mockOnImageClick = vi.fn();

            render(
                <ImageGallery
                    images={mockImages}
                    onImageClick={mockOnImageClick}
                />
            );

            const images = screen.getAllByRole('img');
            await user.click(images[1]);

            expect(mockOnImageClick).toHaveBeenCalledWith(1);
        });
    });

    describe('edge cases', () => {
        it('should handle empty images array', () => {
            const { container } = render(<ImageGallery images={[]} />);

            const images = container.querySelectorAll('img');
            expect(images).toHaveLength(0);
        });

        it('should handle single image', () => {
            render(<ImageGallery images={[mockImages[0]]} />);

            expect(screen.getByRole('img')).toBeInTheDocument();
        });
    });
});