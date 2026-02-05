import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ImageCarousel from '../ImageCarousel';

vi.mock('react-swipeable', () => ({
    useSwipeable: () => ({
        ref: () => { },
        onMouseDown: () => { },
    }),
}));

describe('ImageCarousel', () => {
    const mockImages = [
        { id: '1', smallUrl: '/img1.jpg', largeUrl: '/img1-large.jpg' },
        { id: '2', smallUrl: '/img2.jpg', largeUrl: '/img2-large.jpg' },
        { id: '3', smallUrl: '/img3.jpg', largeUrl: '/img3-large.jpg' },
    ];

    describe('rendering', () => {
        it('should render current image', () => {
            render(<ImageCarousel images={mockImages} />);

            expect(screen.getByAltText('Image 1')).toBeInTheDocument();
        });

        it('should start at specified index', () => {
            render(<ImageCarousel images={mockImages} startIndex={1} />);

            expect(screen.getByAltText('Image 2')).toBeInTheDocument();
        });

        it('should show navigation buttons for multiple images', () => {
            render(<ImageCarousel images={mockImages} />);

            expect(screen.getByTestId('previous-image-button')).toBeInTheDocument();
            expect(screen.getByTestId('next-image-button')).toBeInTheDocument();
        });

        it('should hide navigation for single image', () => {
            render(<ImageCarousel images={[mockImages[0]]} />);

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });
});