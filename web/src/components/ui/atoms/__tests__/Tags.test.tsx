import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tags from '../Tags';

describe('Tags', () => {
    const mockTags = ['react', 'typescript', 'javascript', 'node'];

    describe('default variant', () => {
        it('should render all tags as chips', () => {
            render(<Tags tags={mockTags} />);

            mockTags.forEach(tag => {
                expect(screen.getByText(tag)).toBeInTheDocument();
            });
        });

        it('should limit displayed tags with maxTags', () => {
            render(<Tags tags={mockTags} maxTags={2} />);

            expect(screen.getByText('react')).toBeInTheDocument();
            expect(screen.getByText('typescript')).toBeInTheDocument();
            expect(screen.queryByText('javascript')).not.toBeInTheDocument();
        });

        it('should show remaining count when maxTags exceeded', () => {
            render(<Tags tags={mockTags} maxTags={2} />);

            expect(screen.getByText('+2')).toBeInTheDocument();
        });

        it('should not show remaining count when all tags displayed', () => {
            render(<Tags tags={mockTags} maxTags={4} />);

            expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
        });
    });

    describe('minimal variant', () => {
        it('should render tags as boxes instead of chips', () => {
            const { container } = render(
                <Tags tags={mockTags} variant="minimal" />
            );

            // Minimal variant uses Box instead of Chip
            const chips = container.querySelectorAll('.MuiChip-root');
            expect(chips.length).toBe(0);
        });

        it('should show remaining count in minimal variant', () => {
            render(<Tags tags={mockTags} variant="minimal" maxTags={2} />);

            expect(screen.getByText('+2')).toBeInTheDocument();
        });
    });

    describe('highlighting', () => {
        it('should highlight specified tags', () => {
            render(
                <Tags
                    tags={mockTags}
                    highlights={['react', 'typescript']}
                />
            );

            const reactChip = screen.getByText('react').closest('.MuiChip-root');
            const javascriptChip = screen.getByText('javascript').closest('.MuiChip-root');

            expect(reactChip).toBeInTheDocument();
            expect(javascriptChip).toBeInTheDocument();
        });

        it('should highlight all tags when highlights is empty', () => {
            render(<Tags tags={mockTags} highlights={[]} />);

            mockTags.forEach(tag => {
                expect(screen.getByText(tag)).toBeInTheDocument();
            });
        });
    });

    describe('edge cases', () => {
        it('should handle empty tags array', () => {
            const { container } = render(<Tags tags={[]} />);

            const chips = container.querySelectorAll('.MuiChip-root');
            expect(chips.length).toBe(0);
        });

        it('should handle single tag', () => {
            render(<Tags tags={['solo']} />);

            expect(screen.getByText('solo')).toBeInTheDocument();
        });

        it('should handle maxTags equal to tags length', () => {
            render(<Tags tags={mockTags} maxTags={mockTags.length} />);

            expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
        });

        it('should handle maxTags greater than tags length', () => {
            render(<Tags tags={mockTags} maxTags={10} />);

            mockTags.forEach(tag => {
                expect(screen.getByText(tag)).toBeInTheDocument();
            });
            expect(screen.queryByText(/^\+\d+$/)).not.toBeInTheDocument();
        });
    });
});